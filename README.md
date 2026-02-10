# Remotion_Vedio_Gen

React 기반의 프로그래밍 비디오 프레임워크 Remotion으로 만든 다양한 영상 컴포지션 모음입니다.

## Overview

이 프로젝트는 Remotion을 사용하여 7개의 독립적인 비디오 컴포지션을 제공합니다. 각 컴포지션은 다양한 애니메이션 기법과 이펙트를 활용한 프로덕션 레벨의 예제입니다. Remotion Studio에서 실시간 미리보기를 하거나, CLI를 통해 MP4 파일로 렌더링할 수 있습니다.

## Quick Start

### Installation

```bash
npm install
```

Node.js 24.0 이상 필수입니다.

### Development Server

Remotion Studio를 실행하여 브라우저에서 실시간으로 컴포지션을 미리보고 편집합니다.

```bash
npm run dev
```

http://localhost:3000에서 모든 컴포지션을 확인할 수 있습니다.

### Rendering

각 컴포지션을 MP4 파일로 렌더링합니다.

```bash
# HelloWorld 기본 텍스트 애니메이션
npm run render

# ImageSlideshow 이미지 슬라이드쇼
npm run render:slideshow

# SceneTransition 장면 전환 효과
npm run render:transition
```

렌더링된 파일은 `out/` 디렉토리에 저장됩니다.

기타 컴포지션 렌더링:

```bash
remotion render CinematicIntro out/cinematic.mp4
remotion render TurnaboutHeroIntro out/turnabout.mp4
remotion render YouTubeIntro out/youtube.mp4
remotion render DalGakIntro out/dalgak.mp4
```

## Compositions

### 1. HelloWorld

**Duration**: 5s (150 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

기본 텍스트 애니메이션 예제. 스프링 애니메이션, 투명도 전환, 회전하는 배경 그라디언트를 활용합니다.

**Features**:
- 스프링 애니메이션으로 타이틀 등장
- 페이드 인/아웃 효과
- 로테이션 그라디언트 배경
- 커스터마이저블 텍스트 및 색상 (Props)

**Props**:
- `titleText` (string): 메인 타이틀 텍스트
- `titleColor` (string): 타이틀 색상 (hex)

### 2. ImageSlideshow

**Duration**: 10s (300 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

4개 슬라이드의 부드러운 전환 예제입니다.

**Features**:
- 이미지 슬라이드 시퀀싱
- 다양한 전환 애니메이션
- 자동 타이밍

### 3. SceneTransition

**Duration**: 7s (210 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

장면 전환의 여러 기법을 시연합니다. 페이드, 슬라이드, 와이프 전환 효과가 포함됩니다.

**Features**:
- 페이드 트랜지션
- 슬라이드 트랜지션
- 와이프 트랜지션
- @remotion/transitions 활용

### 4. CinematicIntro

**Duration**: 7s (210 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

"OBSIDIAN FORGE" 시네마틱 인트로. 파티클 시스템, 글로우 이펙트, 몰튼 메탈 테마를 활용한 프로덕션 레벨의 영상입니다.

**Features**:
- 3레이어 파티클 시스템 (깊이감)
- 네뷸라 배경 (회전 그라디언트)
- 볼류메트릭 라이트 (고드 레이)
- 아나모픽 플레어 (렌즈 스트릭)
- 문자별 스태거 스프링 애니메이션
- 몰튼 메탈 그라디언트 스윕
- 렌즈 플레어 임팩트
- 라이트 릭 효과
- 필름 그레인, 스캔라인, 비네팅 포스트 프로세싱
- 카메라 줌 및 쉐이크

### 5. TurnaboutHeroIntro

**Duration**: 5s (150 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

TurnaboutHero 프리미엄 미니멀 인트로. 세련된 애니메이션과 타이포그래피를 강조합니다.

**Features**:
- 미니멀한 디자인
- 세련된 애니메이션 타이밍
- 프리미엄 느낌의 효과

### 6. YouTubeIntro

**Duration**: 5s (150 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

TurnaboutHero YouTube 채널 인트로. 모던 미니멀 스타일로 제작되었습니다.

**Features**:
- YouTube 호환 크기
- 모던 미니멀 스타일
- 채널 브랜딩에 최적화

### 7. DalGakIntro

**Duration**: 15s (450 frames @ 30fps)
**Dimensions**: 1920x1080 Full HD

딸깍(DalGak) AI 서비스 소개 영상. 가장 길고 복잡한 컴포지션으로, 여러 장면과 전환이 포함됩니다.

**Features**:
- 멀티 씬 구성
- 서비스 소개에 최적화된 스토리텔링
- 복합 애니메이션

## Project Structure

```
src/
├── index.ts                    # 엔트리 포인트 (registerRoot)
├── Root.tsx                    # 모든 Composition 정의
└── compositions/
    ├── HelloWorld.tsx          # 기본 텍스트 애니메이션
    ├── ImageSlideshow.tsx      # 이미지 슬라이드쇼
    ├── SceneTransition.tsx      # 장면 전환 효과
    ├── CinematicIntro.tsx       # 시네마틱 인트로
    ├── TurnaboutHeroIntro.tsx   # TurnaboutHero 인트로
    ├── YouTubeIntro.tsx         # YouTube 인트로
    └── DalGakIntro.tsx          # DalGak 서비스 소개
```

## Tech Stack

| 라이브러리 | 버전 | 설명 |
|-----------|------|------|
| Remotion | 4.0.420 | 비디오 렌더링 프레임워크 |
| @remotion/transitions | 4.0.420 | 전환 효과 라이브러리 |
| React | 19.2.4 | UI 라이브러리 |
| React DOM | 19.2.4 | React DOM 렌더링 |
| TypeScript | 5.9.3 | 정적 타입 언어 |
| Node.js | 24+ | JavaScript 런타임 |

## Commands Reference

### Development

```bash
npm run dev
```
Remotion Studio 시작. 브라우저에서 실시간 미리보기 및 편집.

### Rendering

```bash
npm run render                  # HelloWorld 렌더링
npm run render:slideshow        # ImageSlideshow 렌더링
npm run render:transition       # SceneTransition 렌더링
remotion render <id> <output>   # 일반 렌더링 커맨드
```

### Build & Upgrade

```bash
npm run build                   # 프로덕션 번들 생성
npm run upgrade                 # Remotion 자동 업그레이드
```

## Configuration

### Default Settings

모든 컴포지션은 다음 기본 설정을 사용합니다:

- **Frame Rate**: 30 FPS
- **Dimensions**: 1920x1080 (Full HD)
- **Codec**: H.264 MP4

### Composition Properties (Root.tsx)

각 Composition은 `<Composition>` 컴포넌트로 정의되며, 다음 속성을 포함합니다:

- `id`: 컴포지션 고유 식별자
- `component`: React 컴포넌트
- `durationInFrames`: 총 프레임 수
- `fps`: 프레임 레이트
- `width`, `height`: 영상 해상도
- `defaultProps`: 기본 Props (선택사항)

## Development Workflow

### Adding a New Composition

1. `src/compositions/` 에 새 `.tsx` 파일 생성
2. `Root.tsx` 에 import 및 Composition 추가
3. `npm run dev` 로 Remotion Studio에서 확인
4. 필요시 npm scripts 추가

### Customizing HelloWorld

```typescript
// Root.tsx에서 defaultProps 수정
defaultProps={{
  titleText: '커스텀 텍스트',
  titleColor: '#FF0000',
}}
```

### Rendering with Custom Options

```bash
remotion render HelloWorld out/custom.mp4 --props '{"titleText":"Custom","titleColor":"#00FF00"}'
```

## Performance Tips

1. **Rendering 최적화**: 불필요한 리렌더링을 피하기 위해 `useMemo` 및 `useCallback` 활용
2. **파티클 수 조절**: CinematicIntro의 파티클 수를 감소하면 렌더링 속도 향상
3. **메모리 관리**: 대용량 이미지는 필요한 크기로 최적화
4. **병렬 렌더링**: `remotion render --concurrency` 옵션으로 CPU 코어 활용

## Troubleshooting

### Studio가 열리지 않음

```bash
# 포트가 사용 중인 경우
npm run dev -- --port 3001
```

### 렌더링 실패

```bash
# 의존성 재설치
rm -rf node_modules
npm install

# Remotion 업그레이드
npm run upgrade
```

### 성능 저하

- 복잡한 애니메이션은 프리뷰 영상으로 테스트 후 렌더링
- CinematicIntro 같은 파티클 집약적 컴포지션은 렌더링에 시간 소요

## Browser Support

Remotion Studio:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

ISC

## Repository

[GitHub - TurnaboutHero/Remotion_Vedio_Gen](https://github.com/TurnaboutHero/Remotion_Vedio_Gen)

## References

- [Remotion Documentation](https://www.remotion.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
