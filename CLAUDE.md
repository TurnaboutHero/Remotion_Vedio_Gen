# Remotion Video Generation Project

## Project Overview
React + TypeScript based Remotion video generation framework for programmatic video creation.

## Tech Stack
- Remotion 4.0.420 (programmatic video creation framework)
- React 19, TypeScript
- @remotion/transitions (scene transition effects)

## Key Conventions
- All compositions located in `src/compositions/` directory
- Compositions registered via `<Composition>` in `src/Root.tsx`
- Entry point: `src/index.ts` (registerRoot)
- Static assets: `public/` directory
- Render output: `out/` directory

## Build & Run
- `npm run dev` - Launch Remotion Studio
- `npm run render` - Render HelloWorld composition
- `npx remotion render src/index.ts <CompositionId> out/<filename>.mp4` - Render specific composition

## Animation Patterns
- `useCurrentFrame()` + `interpolate()` for frame-based animations
- `spring()` for physics-based elastic animations
- `<Sequence>` for timeline control
- `<TransitionSeries>` + `@remotion/transitions` for scene transitions
- All animations must be deterministic (no Math.random)

## File Structure
- `src/index.ts` - Entry point
- `src/Root.tsx` - Composition registry
- `src/compositions/*.tsx` - Individual video compositions
- `remotion.config.ts` - Remotion CLI configuration
- `remotion-effects-reference.md` - 350+ effect prompts reference

## Audio Generation (MMAudio)
- MMAudio: AI 기반 video-to-audio 생성 (MIT 라이선스, CVPR 2025)
- 설치 경로: 프로젝트 상위 `../MMAudio/` (별도 repo)
- 최적 duration: 8초 (학습 데이터 기준)
- 권장 파라미터: `cfg_strength=6.0`, `num_steps=35`, `seed=42`
- 네거티브 프롬프트: `"music, speech, voices, harsh, loud, distorted, noise"`
- 파이프라인 스크립트: `scripts/audio-pipeline.sh`
- 씬 설정 예시: `scripts/scenes-dalgak.json`
- 상세 가이드: `docs/audio-workflow.md`

## File Structure
- `src/index.ts` - Entry point
- `src/Root.tsx` - Composition registry
- `src/compositions/*.tsx` - Individual video compositions
- `scripts/audio-pipeline.sh` - MMAudio 오디오 생성 자동화 스크립트
- `scripts/scenes-*.json` - 씬별 프롬프트 설정 파일
- `docs/audio-workflow.md` - 오디오 워크플로우 문서
- `remotion.config.ts` - Remotion CLI configuration
- `remotion-effects-reference.md` - 350+ effect prompts reference

## Important Notes
- Maintain consistent Remotion package versions across dependencies (currently 4.0.420)
- MP4 rendering requires width/height to be even numbers
- Korean text may require system font verification
- Windows ffmpeg에서는 `h264_mf` 인코더 사용, Linux에서는 `libx264`
- MMAudio GPU 동시 실행 불가 (순차 처리)
