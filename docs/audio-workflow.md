# MMAudio 오디오 생성 워크플로우

## 개요

Remotion으로 렌더링한 영상에 AI 기반 사운드 이펙트를 자동 생성하는 워크플로우입니다.
[MMAudio](https://github.com/hkchengrex/MMAudio) (CVPR 2025, MIT 라이선스)를 사용하여 영상 내용을 분석하고 매칭되는 오디오를 생성합니다.

## 아키텍처

```
Remotion 렌더링 → 파트 분할 (8초 단위) → MMAudio 오디오 생성 → ffmpeg 크로스페이드 병합
```

## 요구사항

### 하드웨어
- CUDA 지원 NVIDIA GPU (VRAM 8GB 이상)
- 테스트 환경: RTX 3070 8GB

### 소프트웨어
- Node.js 18+ (Remotion용)
- Python 3.10+ (MMAudio용)
- ffmpeg (영상 처리)
- CUDA Toolkit 12.x

## MMAudio 설치

```bash
# 1. 클론
git clone https://github.com/hkchengrex/MMAudio.git
cd MMAudio

# 2. Python venv 생성
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 3. PyTorch + CUDA 설치
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

# 4. MMAudio 의존성 설치
pip install -e .

# 5. 모델 가중치 (첫 실행 시 자동 다운로드)
python demo.py --variant large_44k_v2 --prompt "test sound" --duration 3
```

## 파이프라인 사용법

### 빠른 시작

```bash
# 기본 실행 (DalGakIntro, 자동 8초 분할)
bash scripts/audio-pipeline.sh

# 씬 설정 파일 사용
bash scripts/audio-pipeline.sh --config scripts/scenes-dalgak.json

# 다른 컴포지션
bash scripts/audio-pipeline.sh --comp CinematicIntro --total-frames 300
```

### 옵션

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `--config` | - | JSON 씬 설정 파일 |
| `--comp` | DalGakIntro | Remotion Composition ID |
| `--fps` | 30 | 프레임 레이트 |
| `--total-frames` | 450 | 총 프레임 수 |
| `--output` | (comp 이름) | 출력 파일명 |
| `--cfg` | 6.0 | CFG guidance strength |
| `--steps` | 35 | 추론 스텝 수 (높을수록 품질 향상) |
| `--seed` | 42 | 랜덤 시드 |
| `--crossfade` | 0.3 | 크로스페이드 초 |
| `--skip-render` | false | 렌더링 건너뛰기 |

### 씬 설정 JSON 형식

```json
[
  {
    "name": "part1",
    "start_frame": 0,
    "end_frame": 239,
    "prompt": "soft digital UI sounds, subtle clicks",
    "negative_prompt": "music, speech, voices, harsh, loud"
  }
]
```

### 환경 변수

```bash
# MMAudio 설치 경로 (기본: 프로젝트 상위의 MMAudio/)
export MMAUDIO_DIR="/path/to/MMAudio"
```

## MMAudio 프롬프트 가이드

### 핵심 원칙

1. **8초가 최적** - MMAudio 학습 데이터 기준. 긴 영상은 8초 단위로 분할
2. **서술적 키워드** - 구체적인 소리 묘사 사용
3. **네거티브 프롬프트 필수** - 원치 않는 소리 명시적으로 제외
4. **cfg_strength 5-7** - 프롬프트에 충실한 결과 (높을수록 엄격)
5. **num_steps 25-50** - 높을수록 품질 향상, 생성 시간 증가

### 좋은 프롬프트 예시

| 씬 유형 | 프롬프트 |
|---------|---------|
| UI/테크 | `soft digital UI click sounds, subtle whoosh transitions, ambient tech atmosphere` |
| 브랜드 등장 | `gentle reveal chime, sparkling digital sounds, soft glowing ambience` |
| 기능 소개 | `light electronic notification tones, card flip sounds, subtle sparkle` |
| CTA/마무리 | `satisfying click sound, calm ambient fade, subtle futuristic tones` |
| 자연 | `birds chirping, gentle wind, rustling leaves, peaceful atmosphere` |
| 도시 | `city traffic, distant car horns, pedestrian footsteps, urban ambience` |

### 네거티브 프롬프트 추천

```
music, speech, voices, harsh, loud, distorted, noise
```

### 파라미터 튜닝 팁

| 파라미터 | 낮은 값 | 높은 값 |
|---------|---------|---------|
| `cfg_strength` | 자유로운 생성 (3-4) | 프롬프트에 충실 (6-8) |
| `num_steps` | 빠르지만 거친 (15-20) | 느리지만 정교 (35-50) |
| `seed` | 다른 시드 = 다른 결과 | 같은 시드 = 재현 가능 |

## 수동 실행 (단계별)

파이프라인 대신 수동으로 실행하려면:

### 1. Remotion 렌더링

```bash
# 특정 프레임 범위 렌더링
npx remotion render src/index.ts DalGakIntro out/part1.mp4 --frames=0-239
npx remotion render src/index.ts DalGakIntro out/part2.mp4 --frames=230-449
```

### 2. MMAudio 오디오 생성

```bash
cd /path/to/MMAudio
source venv/bin/activate  # 또는 venv\Scripts\activate (Windows)

python demo.py \
  --variant large_44k_v2 \
  --video /path/to/part1.mp4 \
  --prompt "soft digital UI sounds" \
  --negative_prompt "music, speech, voices, harsh, loud, distorted, noise" \
  --duration 8.0 \
  --cfg_strength 6.0 \
  --num_steps 35 \
  --seed 42 \
  --output ./output
```

### 3. ffmpeg 크로스페이드 병합

```bash
ffmpeg -y \
  -i part1_with_audio.mp4 -i part2_with_audio.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.3:offset=7.734[outv];[0:a][1:a]acrossfade=d=0.3:c1=tri:c2=tri[outa]" \
  -map "[outv]" -map "[outa]" \
  -c:v h264_mf -b:v 4M -c:a aac -b:a 192k \
  output_final.mp4
```

> **참고**: `h264_mf`는 Windows MediaFoundation 인코더입니다. Linux에서는 `libx264`를 사용하세요.

## 알려진 제한사항

- MMAudio 최적 길이가 8초 → 긴 영상은 분할 필요
- GPU VRAM 8GB에서 동시 실행 불가 (순차 처리)
- `h264_mf` 인코더는 `libx264`보다 품질/옵션이 제한적
- 파트 간 오디오 연결은 크로스페이드로 처리하지만 완벽하지 않을 수 있음

## 트러블슈팅

| 문제 | 해결 |
|------|------|
| `Unknown encoder 'libx264'` | Windows: `h264_mf` 사용, 또는 ffmpeg full build 설치 |
| `CUDA out of memory` | `--full_precision` 제거, 또는 variant를 `small_16k`로 변경 |
| `Clip video is too short` | 정상 경고, 자동으로 실제 길이에 맞춤 |
| 오디오가 영상과 안 맞음 | 프롬프트를 더 구체적으로, cfg_strength 높이기 |
| 크로스페이드 소리 겹침 | `--crossfade` 값 줄이기 (0.1~0.3 권장) |
