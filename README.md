# Remotion Video Generator

React 기반의 프로그래밍 비디오 프레임워크 Remotion으로 만든 다양한 영상 컴포지션 모음입니다.

## Overview

이 프로젝트는 Remotion을 사용하여 **10개의 독립적인 비디오 컴포지션**을 제공합니다. 각 컴포지션은 다양한 애니메이션 기법과 이펙트를 활용한 프로덕션 레벨의 예제입니다.

**MCP(Model Context Protocol) 통합**으로 Manim, Excalidraw 등 외부 도구와 연동하여 수학 애니메이션, 다이어그램을 자동 생성하고 영상에 삽입할 수 있습니다.

## Quick Start

### Installation

```bash
npm install
```

Node.js 18.0 이상 필수입니다.

### Development Server

```bash
npm run dev
```

http://localhost:3000에서 모든 컴포지션을 확인할 수 있습니다.

### Rendering

```bash
# 기본 렌더링
npm run render

# 특정 컴포지션 렌더링
npx remotion render src/index.ts <CompositionId> out/<filename>.mp4
```

## Compositions

### 기본 컴포지션

| ID | 설명 | Duration |
|----|------|----------|
| HelloWorld | 기본 텍스트 애니메이션 | 5s |
| ImageSlideshow | 이미지 슬라이드쇼 | 10s |
| SceneTransition | 장면 전환 효과 | 7s |
| CinematicIntro | 시네마틱 인트로 (파티클, 글로우) | 7s |
| TurnaboutHeroIntro | 프리미엄 미니멀 인트로 | 5s |
| YouTubeIntro | YouTube 채널 인트로 | 5s |
| DalGakIntro | 딸깍 서비스 소개 영상 | 15s |

### 신규 컴포지션

| ID | 설명 | Duration |
|----|------|----------|
| **KineticTypography** | 동적 타이포그래피 (5가지 텍스트 효과) | 11s |
| **MCPShowcase** | MCP 파이프라인 쇼케이스 | 15s |
| **MCPIntegration** | Manim + Excalidraw 실제 통합 데모 | 17s |

### KineticTypography

동적 타이포그래피 컴포지션. 텍스트가 화면에서 역동적으로 움직이는 효과.

**Features:**
- 5가지 애니메이션 스타일: bounce, slide, scale, rotate, split
- 배경 파티클 시스템
- 애니메이션 그라디언트 배경
- 커스터마이저블 단어 및 색상

### MCPIntegration

Manim + Excalidraw + Remotion 통합 데모.

**구성:**
1. 인트로 타이틀 (0-3초)
2. Excalidraw 스타일 다이어그램 (3-7초)
3. Manim 애니메이션 삽입 (7-14초)
4. 아웃트로 (14-17초)

## MCP Integration

### 지원 MCP 서버

| MCP 서버 | 용도 | 출력 |
|----------|------|------|
| **Manim MCP** | 수학 애니메이션 생성 | MP4 |
| **Excalidraw MCP** | 손그림 스타일 다이어그램 | PNG/SVG |

### MCP 설정 (.mcp.json)

```json
{
  "mcpServers": {
    "manim": {
      "command": "python",
      "args": ["path/to/manim_server.py"]
    },
    "excalidraw": {
      "command": "node",
      "args": ["path/to/excalidraw-mcp/dist/index.js", "--stdio"]
    }
  }
}
```

### MCP 파이프라인 사용

```bash
# 파이프라인 상태 확인
node scripts/mcp-pipeline.js status

# 디렉토리 초기화
node scripts/mcp-pipeline.js init

# Manim 애니메이션 생성 (Python)
manim -ql scripts/manim_simple.py SimpleAnimation --media_dir public/mcp-assets/manim
```

## Audio Generation (MMAudio)

AI 기반 video-to-audio 생성 파이프라인 지원.

- **MMAudio**: MIT 라이선스, CVPR 2025
- **최적 duration**: 8초
- **권장 파라미터**: `cfg_strength=6.0`, `num_steps=35`, `seed=42`

```bash
# MMAudio 설치 (별도 repo)
git clone https://github.com/hkchengrex/MMAudio.git ../MMAudio
cd ../MMAudio && pip install -e .
```

## Project Structure

```
src/
├── index.ts                    # 엔트리 포인트
├── Root.tsx                    # Composition 레지스트리
└── compositions/
    ├── HelloWorld.tsx
    ├── ImageSlideshow.tsx
    ├── SceneTransition.tsx
    ├── CinematicIntro.tsx
    ├── TurnaboutHeroIntro.tsx
    ├── YouTubeIntro.tsx
    ├── DalGakIntro.tsx
    ├── KineticTypography.tsx   # NEW
    ├── MCPShowcase.tsx         # NEW
    └── MCPIntegration.tsx      # NEW

scripts/
├── mcp-pipeline.js             # MCP 통합 파이프라인
├── manim_simple.py             # Manim 기본 씬
└── manim_scene.py              # Manim 수학 씬

docs/
├── mcp-pipeline-guide.md       # MCP 파이프라인 가이드
└── audio-workflow.md           # 오디오 워크플로우

public/mcp-assets/              # MCP 생성 에셋
├── manim/
└── excalidraw/
```

## Tech Stack

| 라이브러리 | 버전 | 설명 |
|-----------|------|------|
| Remotion | 4.0.420 | 비디오 렌더링 프레임워크 |
| React | 19 | UI 라이브러리 |
| TypeScript | 5.x | 정적 타입 언어 |
| Manim | 0.19.2 | 수학 애니메이션 (선택) |
| MMAudio | 1.0.0 | AI 오디오 생성 (선택) |

## Commands Reference

```bash
# Development
npm run dev                     # Remotion Studio 시작

# Rendering
npm run render                  # HelloWorld 렌더링
npx remotion render src/index.ts KineticTypography out/kinetic.mp4
npx remotion render src/index.ts MCPIntegration out/mcp-demo.mp4

# MCP Pipeline
node scripts/mcp-pipeline.js status
manim -ql scripts/manim_simple.py SimpleAnimation
```

## Requirements

- Node.js 18+
- Python 3.10+ (Manim 사용 시)
- ffmpeg (Manim 렌더링 시)

## License

ISC

## Repository

[GitHub - TurnaboutHero/Remotion_Video_Generator](https://github.com/TurnaboutHero/Remotion_Video_Generator)

## References

- [Remotion Documentation](https://www.remotion.dev/)
- [Manim Community](https://www.manim.community/)
- [Excalidraw](https://excalidraw.com/)
- [MMAudio](https://github.com/hkchengrex/MMAudio)
