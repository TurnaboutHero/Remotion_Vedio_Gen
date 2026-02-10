#!/bin/bash
# =============================================================
# Remotion + MMAudio 오디오 생성 파이프라인
# =============================================================
# 사용법:
#   bash scripts/audio-pipeline.sh --config scripts/scenes-dalgak.json
#   bash scripts/audio-pipeline.sh --comp DalGakIntro --fps 30 --total-frames 450
#
# 필수 환경:
#   - Node.js + Remotion (npm install 완료)
#   - Python 3.10+ + MMAudio (venv 설치 완료)
#   - ffmpeg
#   - CUDA GPU (RTX 3070 이상 권장)
# =============================================================

set -euo pipefail

# ─── 설정 (환경에 맞게 수정) ──────────────────────────────────
REMOTION_PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MMAUDIO_DIR="${MMAUDIO_DIR:-$(dirname "$REMOTION_PROJECT_DIR")/MMAudio}"
MMAUDIO_VENV="${MMAUDIO_DIR}/venv"
OUTPUT_DIR="${REMOTION_PROJECT_DIR}/out"
TEMP_DIR="${OUTPUT_DIR}/audio_temp"

# MMAudio 기본 파라미터
VARIANT="large_44k_v2"
CFG_STRENGTH=6.0
NUM_STEPS=35
SEED=42
NEGATIVE_PROMPT="music, speech, voices, harsh, loud, distorted, noise"
CROSSFADE_DURATION=0.3

# ─── 색상 출력 ─────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ─── 사전 체크 ─────────────────────────────────────────────────
check_prerequisites() {
  log_info "필수 도구 확인 중..."

  command -v npx >/dev/null 2>&1 || { log_error "npx 없음. Node.js 설치 필요"; exit 1; }
  command -v ffmpeg >/dev/null 2>&1 || { log_error "ffmpeg 없음"; exit 1; }
  command -v ffprobe >/dev/null 2>&1 || { log_error "ffprobe 없음"; exit 1; }

  if [ ! -d "$MMAUDIO_DIR" ]; then
    log_error "MMAudio 디렉토리 없음: $MMAUDIO_DIR"
    log_info "MMAUDIO_DIR 환경변수로 경로 지정 가능"
    exit 1
  fi

  if [ ! -d "$MMAUDIO_VENV" ]; then
    log_error "MMAudio venv 없음: $MMAUDIO_VENV"
    log_info "MMAudio README 참고하여 venv 설치 필요"
    exit 1
  fi

  log_ok "모든 필수 도구 확인 완료"
}

# ─── 도움말 ────────────────────────────────────────────────────
show_help() {
  cat << 'EOF'
Remotion + MMAudio 오디오 생성 파이프라인

사용법:
  bash scripts/audio-pipeline.sh [옵션]

옵션:
  --config <파일>       JSON 씬 설정 파일 경로
  --comp <이름>         Remotion Composition ID (기본: DalGakIntro)
  --fps <숫자>          FPS (기본: 30)
  --total-frames <숫자> 총 프레임 수 (기본: 450)
  --output <이름>       출력 파일명 (기본: composition 이름)
  --cfg <숫자>          CFG strength (기본: 6.0)
  --steps <숫자>        추론 스텝 수 (기본: 35)
  --seed <숫자>         랜덤 시드 (기본: 42)
  --crossfade <초>      크로스페이드 길이 (기본: 0.3)
  --skip-render         Remotion 렌더링 건너뛰기 (이미 렌더링된 경우)
  --help                도움말

씬 설정 JSON 예시:
  [
    {
      "name": "part1",
      "start_frame": 0,
      "end_frame": 239,
      "prompt": "soft digital UI click sounds, subtle whoosh transitions",
      "negative_prompt": "music, speech, voices"
    },
    {
      "name": "part2",
      "start_frame": 230,
      "end_frame": 449,
      "prompt": "gentle reveal chime, sparkling digital sounds",
      "negative_prompt": "music, speech, voices"
    }
  ]

환경 변수:
  MMAUDIO_DIR    MMAudio 설치 경로 (기본: 프로젝트 상위의 MMAudio/)
EOF
}

# ─── 파라미터 파싱 ─────────────────────────────────────────────
COMP_ID="DalGakIntro"
FPS=30
TOTAL_FRAMES=450
OUTPUT_NAME=""
CONFIG_FILE=""
SKIP_RENDER=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --config)       CONFIG_FILE="$2"; shift 2 ;;
    --comp)         COMP_ID="$2"; shift 2 ;;
    --fps)          FPS="$2"; shift 2 ;;
    --total-frames) TOTAL_FRAMES="$2"; shift 2 ;;
    --output)       OUTPUT_NAME="$2"; shift 2 ;;
    --cfg)          CFG_STRENGTH="$2"; shift 2 ;;
    --steps)        NUM_STEPS="$2"; shift 2 ;;
    --seed)         SEED="$2"; shift 2 ;;
    --crossfade)    CROSSFADE_DURATION="$2"; shift 2 ;;
    --skip-render)  SKIP_RENDER=true; shift ;;
    --help)         show_help; exit 0 ;;
    *)              log_error "알 수 없는 옵션: $1"; show_help; exit 1 ;;
  esac
done

[ -z "$OUTPUT_NAME" ] && OUTPUT_NAME="$COMP_ID"

# ─── 씬 설정 로드 ─────────────────────────────────────────────
load_scenes() {
  if [ -n "$CONFIG_FILE" ] && [ -f "$CONFIG_FILE" ]; then
    log_info "씬 설정 로드: $CONFIG_FILE"
    SCENES=$(cat "$CONFIG_FILE")
  else
    # 기본: 8초 단위로 자동 분할 (10프레임 겹침)
    log_info "자동 씬 분할 (8초 단위, ${FPS}fps)"
    local max_frames_per_part=$((FPS * 8))
    local overlap=$((FPS / 3))  # ~10 frames at 30fps
    local scenes="["
    local part=1
    local start=0

    while [ $start -lt $TOTAL_FRAMES ]; do
      local end=$((start + max_frames_per_part - 1))
      [ $end -ge $TOTAL_FRAMES ] && end=$((TOTAL_FRAMES - 1))

      [ $part -gt 1 ] && scenes+=","
      scenes+=$(cat <<PART
{
  "name": "part${part}",
  "start_frame": ${start},
  "end_frame": ${end},
  "prompt": "cinematic sound effects, ambient atmosphere, subtle transitions",
  "negative_prompt": "${NEGATIVE_PROMPT}"
}
PART
)
      start=$((end - overlap + 1))
      part=$((part + 1))
    done

    scenes+="]"
    SCENES="$scenes"
  fi

  SCENE_COUNT=$(echo "$SCENES" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
  log_ok "${SCENE_COUNT}개 씬 로드 완료"
}

# ─── Step 1: Remotion 렌더링 ──────────────────────────────────
render_parts() {
  log_info "=== Step 1: Remotion 파트별 렌더링 ==="
  mkdir -p "$TEMP_DIR"

  for i in $(seq 0 $((SCENE_COUNT - 1))); do
    local name=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i]['name'])")
    local start=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i]['start_frame'])")
    local end=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i]['end_frame'])")
    local out_file="${TEMP_DIR}/${OUTPUT_NAME}_${name}.mp4"

    if [ "$SKIP_RENDER" = true ] && [ -f "$out_file" ]; then
      log_warn "렌더링 건너뛰기 (파일 존재): $out_file"
      continue
    fi

    log_info "렌더링: ${name} (frames ${start}-${end})"
    cd "$REMOTION_PROJECT_DIR"
    npx remotion render src/index.ts "$COMP_ID" "$out_file" \
      --frames="${start}-${end}" 2>&1 | tail -3
    log_ok "렌더링 완료: ${name}"
  done
}

# ─── Step 2: MMAudio 오디오 생성 ──────────────────────────────
generate_audio() {
  log_info "=== Step 2: MMAudio 오디오 생성 ==="

  # venv 활성화
  if [ -f "${MMAUDIO_VENV}/Scripts/activate" ]; then
    source "${MMAUDIO_VENV}/Scripts/activate"  # Windows
  elif [ -f "${MMAUDIO_VENV}/bin/activate" ]; then
    source "${MMAUDIO_VENV}/bin/activate"  # Linux/Mac
  fi

  for i in $(seq 0 $((SCENE_COUNT - 1))); do
    local name=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i]['name'])")
    local prompt=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i]['prompt'])")
    local neg_prompt=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i].get('negative_prompt','${NEGATIVE_PROMPT}'))")
    local video_file="${TEMP_DIR}/${OUTPUT_NAME}_${name}.mp4"
    local duration
    duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$video_file")

    log_info "오디오 생성: ${name} (${duration}s)"
    log_info "  프롬프트: ${prompt}"

    cd "$MMAUDIO_DIR"
    python demo.py \
      --variant "$VARIANT" \
      --video "$video_file" \
      --prompt "$prompt" \
      --negative_prompt "$neg_prompt" \
      --duration "$duration" \
      --cfg_strength "$CFG_STRENGTH" \
      --num_steps "$NUM_STEPS" \
      --seed "$SEED" \
      --output "$TEMP_DIR" 2>&1 | tail -5

    # MMAudio는 비디오 파일명으로 출력하므로 이동
    local mmaudio_output="${TEMP_DIR}/${OUTPUT_NAME}_${name}.mp4"
    log_ok "오디오 생성 완료: ${name}"
  done

  deactivate 2>/dev/null || true
}

# ─── Step 3: ffmpeg 크로스페이드 합치기 ──────────────────────
merge_parts() {
  log_info "=== Step 3: ffmpeg 크로스페이드 병합 ==="

  local final_output="${OUTPUT_DIR}/${OUTPUT_NAME}_final.mp4"

  if [ "$SCENE_COUNT" -eq 1 ]; then
    local name=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['name'])")
    cp "${TEMP_DIR}/${OUTPUT_NAME}_${name}.mp4" "$final_output"
    log_ok "단일 파트 - 복사 완료"
    return
  fi

  # 2개 파트: 직접 xfade + acrossfade
  if [ "$SCENE_COUNT" -eq 2 ]; then
    local name1=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[0]['name'])")
    local name2=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[1]['name'])")
    local file1="${TEMP_DIR}/${OUTPUT_NAME}_${name1}.mp4"
    local file2="${TEMP_DIR}/${OUTPUT_NAME}_${name2}.mp4"
    local dur1
    dur1=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$file1")
    local offset
    offset=$(python3 -c "print(round(${dur1} - ${CROSSFADE_DURATION}, 3))")

    log_info "병합: ${name1} + ${name2} (크로스페이드 ${CROSSFADE_DURATION}s)"

    ffmpeg -y \
      -i "$file1" -i "$file2" \
      -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${offset}[outv];[0:a][1:a]acrossfade=d=${CROSSFADE_DURATION}:c1=tri:c2=tri[outa]" \
      -map "[outv]" -map "[outa]" \
      -c:v h264_mf -b:v 4M -c:a aac -b:a 192k \
      "$final_output" 2>&1 | tail -3

    log_ok "병합 완료: $final_output"
    return
  fi

  # 3개 이상: 순차적으로 2개씩 병합
  local prev_file=""
  for i in $(seq 0 $((SCENE_COUNT - 1))); do
    local name=$(echo "$SCENES" | python3 -c "import sys,json; print(json.load(sys.stdin)[$i]['name'])")
    local current="${TEMP_DIR}/${OUTPUT_NAME}_${name}.mp4"

    if [ -z "$prev_file" ]; then
      prev_file="$current"
      continue
    fi

    local merge_output="${TEMP_DIR}/merge_step_${i}.mp4"
    [ $i -eq $((SCENE_COUNT - 1)) ] && merge_output="$final_output"

    local dur_prev
    dur_prev=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$prev_file")
    local offset
    offset=$(python3 -c "print(round(${dur_prev} - ${CROSSFADE_DURATION}, 3))")

    log_info "병합 단계 ${i}: 크로스페이드 ${CROSSFADE_DURATION}s"

    ffmpeg -y \
      -i "$prev_file" -i "$current" \
      -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=${offset}[outv];[0:a][1:a]acrossfade=d=${CROSSFADE_DURATION}:c1=tri:c2=tri[outa]" \
      -map "[outv]" -map "[outa]" \
      -c:v h264_mf -b:v 4M -c:a aac -b:a 192k \
      "$merge_output" 2>&1 | tail -3

    prev_file="$merge_output"
  done

  log_ok "최종 병합 완료: $final_output"
}

# ─── 실행 ──────────────────────────────────────────────────────
main() {
  echo ""
  echo "============================================"
  echo "  Remotion + MMAudio 오디오 파이프라인"
  echo "============================================"
  echo ""

  check_prerequisites
  load_scenes

  echo ""
  log_info "설정:"
  log_info "  Composition: $COMP_ID"
  log_info "  파트 수: $SCENE_COUNT"
  log_info "  MMAudio: variant=$VARIANT, cfg=$CFG_STRENGTH, steps=$NUM_STEPS"
  log_info "  크로스페이드: ${CROSSFADE_DURATION}s"
  echo ""

  render_parts
  generate_audio
  merge_parts

  echo ""
  log_ok "============================================"
  log_ok "  파이프라인 완료!"
  log_ok "  출력: ${OUTPUT_DIR}/${OUTPUT_NAME}_final.mp4"
  log_ok "============================================"
}

main "$@"
