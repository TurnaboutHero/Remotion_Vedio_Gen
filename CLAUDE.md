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

## Important Notes
- Maintain consistent Remotion package versions across dependencies (currently 4.0.420)
- MP4 rendering requires width/height to be even numbers
- Korean text may require system font verification
