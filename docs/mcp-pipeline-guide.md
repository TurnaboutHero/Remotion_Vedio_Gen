# MCP Pipeline Guide

Manim, Excalidraw MCP 서버와 Remotion을 통합한 비디오 생성 파이프라인 가이드입니다.

## 아키텍처

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Manim MCP     │────▶│                  │     │             │
│ (수학 애니메이션) │     │   MCP Pipeline   │────▶│  Remotion   │
└─────────────────┘     │                  │     │ (최종 비디오) │
                        │                  │     │             │
┌─────────────────┐     │                  │     └─────────────┘
│  Excalidraw MCP │────▶│                  │
│   (다이어그램)   │     └──────────────────┘
└─────────────────┘
```

## 설치된 구성요소

| 구성요소 | 경로 | 설명 |
|---------|------|------|
| Manim MCP | `../manim-mcp-server/` | Python 수학 애니메이션 생성 |
| Excalidraw MCP | `../excalidraw-mcp/` | 손그림 스타일 다이어그램 |
| Remotion | 현재 프로젝트 | 프로그래매틱 비디오 생성 |

## MCP 서버 설정

프로젝트 루트의 `.mcp.json` 파일에서 MCP 서버가 설정됩니다:

```json
{
  "mcpServers": {
    "manim": {
      "command": "python",
      "args": ["D:/Documents/GitHub/manim-mcp-server/src/manim_server.py"],
      "env": {
        "MANIM_EXECUTABLE": "manim"
      }
    },
    "excalidraw": {
      "command": "node",
      "args": ["D:/Documents/GitHub/excalidraw-mcp/dist/index.js", "--stdio"]
    }
  }
}
```

## 사용 방법

### 1. 파이프라인 상태 확인

```bash
node scripts/mcp-pipeline.js status
```

### 2. Manim MCP 사용 (Claude Code에서)

```
# Claude Code에서 Manim MCP를 통해 애니메이션 생성
execute_manim_code 도구를 사용하여 Manim 코드 실행

예시 코드:
from manim import *

class HelloCircle(Scene):
    def construct(self):
        circle = Circle()
        self.play(Create(circle))
```

### 3. Excalidraw MCP 사용 (Claude Code에서)

```
# read_me 도구로 Excalidraw 포맷 확인
# create_view 도구로 다이어그램 생성

예시 elements:
[
  {"type": "rectangle", "id": "r1", "x": 100, "y": 100, "width": 200, "height": 100},
  {"type": "text", "id": "t1", "x": 150, "y": 140, "text": "Hello", "fontSize": 20}
]
```

### 4. Remotion으로 통합 렌더링

```bash
# MCPShowcase 컴포지션 렌더링
npx remotion render src/index.ts MCPShowcase out/mcp-showcase.mp4

# 또는 파이프라인 스크립트 사용
node scripts/mcp-pipeline.js render MCPShowcase out/video.mp4
```

## 에셋 디렉토리 구조

```
public/mcp-assets/
├── manim/           # Manim 출력 비디오 (.mp4)
└── excalidraw/      # Excalidraw 다이어그램 (.json, .png)
```

## MCPShowcase 컴포지션

`src/compositions/MCPShowcase.tsx`는 MCP 파이프라인 데모 컴포지션입니다:

- **Scene 1 (0-90f)**: 타이틀 인트로
- **Scene 2 (90-210f)**: Excalidraw 다이어그램 표시
- **Scene 3 (210-390f)**: Manim 애니메이션 삽입
- **Scene 4 (390-450f)**: 아웃트로

### Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| title | string | "MCP Pipeline Demo" | 타이틀 텍스트 |
| subtitle | string | "AI-Powered Video Generation" | 서브타이틀 |
| manimVideo | string | undefined | Manim 비디오 경로 |
| excalidrawImage | string | undefined | Excalidraw 이미지 경로 |

## 워크플로우 예시

### 기술 설명 비디오 제작

1. **Excalidraw로 아키텍처 다이어그램 생성**
   ```
   Claude: "시스템 아키텍처를 Excalidraw로 그려줘"
   → excalidraw MCP의 create_view 도구 사용
   → public/mcp-assets/excalidraw/architecture.png로 저장
   ```

2. **Manim으로 수학적 개념 애니메이션**
   ```
   Claude: "피타고라스 정리를 Manim으로 시각화해줘"
   → manim MCP의 execute_manim_code 도구 사용
   → public/mcp-assets/manim/pythagorean.mp4로 저장
   ```

3. **Remotion으로 최종 비디오 합성**
   ```bash
   npx remotion render src/index.ts MCPShowcase out/tutorial.mp4 \
     --props='{"excalidrawImage":"mcp-assets/excalidraw/architecture.png","manimVideo":"mcp-assets/manim/pythagorean.mp4"}'
   ```

## 트러블슈팅

### Manim을 찾을 수 없음
```bash
# Anaconda 환경에서 실행
conda activate base
manim --version
```

### Excalidraw MCP 연결 실패
```bash
# 빌드 확인
cd ../excalidraw-mcp
npm run build
```

### MCP 서버가 Claude Code에서 인식되지 않음
1. Claude Code 재시작
2. `.mcp.json` 파일 경로 확인
3. `settings.json`의 `enableAllProjectMcpServers: true` 확인
