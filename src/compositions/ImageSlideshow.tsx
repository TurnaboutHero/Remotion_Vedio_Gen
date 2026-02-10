import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from 'remotion';

const slides = [
  {bg: '#FF6B6B', title: 'Slide 1', subtitle: '첫 번째 슬라이드'},
  {bg: '#4ECDC4', title: 'Slide 2', subtitle: '두 번째 슬라이드'},
  {bg: '#45B7D1', title: 'Slide 3', subtitle: '세 번째 슬라이드'},
  {bg: '#96CEB4', title: 'Slide 4', subtitle: '네 번째 슬라이드'},
];

const SLIDE_DURATION = 75; // 2.5초 per slide at 30fps

const Slide: React.FC<{bg: string; title: string; subtitle: string}> = ({
  bg,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: {damping: 15, stiffness: 150, mass: 0.8},
  });

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [SLIDE_DURATION - 15, SLIDE_DURATION],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: Math.min(opacity, fadeOut),
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 20,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ImageSlideshow: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {slides.map((slide, i) => (
        <Sequence
          key={i}
          from={i * SLIDE_DURATION}
          durationInFrames={SLIDE_DURATION}
        >
          <Slide bg={slide.bg} title={slide.title} subtitle={slide.subtitle} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
