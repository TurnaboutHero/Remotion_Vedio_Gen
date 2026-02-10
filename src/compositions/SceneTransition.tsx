import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';

// 씬 컴포넌트
const Scene: React.FC<{
  title: string;
  bg: string;
  emoji: string;
}> = ({title, bg, emoji}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame: frame - 5,
    fps,
    config: {damping: 12, stiffness: 200},
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 120, marginBottom: 20}}>{emoji}</div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            transform: `scale(${Math.max(0, scale)})`,
            textShadow: '0 4px 15px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SceneTransition: React.FC = () => {
  return (
    <TransitionSeries>
      {/* 씬 1: 페이드 전환 */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <Scene title="페이드 전환" bg="#E74C3C" emoji="🎬" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: 15})}
      />

      {/* 씬 2: 슬라이드 전환 */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <Scene title="슬라이드 전환" bg="#3498DB" emoji="🎞️" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({direction: 'from-left'})}
        timing={springTiming({config: {damping: 15}})}
      />

      {/* 씬 3: 와이프 전환 */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <Scene title="와이프 전환" bg="#2ECC71" emoji="🎥" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({direction: 'from-left'})}
        timing={linearTiming({durationInFrames: 15})}
      />

      {/* 씬 4: 마지막 씬 */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <Scene title="완성!" bg="#9B59B6" emoji="✨" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
