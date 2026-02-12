import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';

/**
 * Kinetic Typography - 동적 타이포그래피 컴포지션
 *
 * 텍스트가 화면에서 역동적으로 등장하고 움직이는 효과
 */

interface KineticTypographyProps {
  words?: string[];
  primaryColor?: string;
  accentColor?: string;
}

// 개별 단어 애니메이션 컴포넌트
const AnimatedWord: React.FC<{
  word: string;
  style: 'bounce' | 'slide' | 'scale' | 'rotate' | 'split';
  color: string;
  fontSize?: number;
}> = ({word, style, color, fontSize = 120}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const getAnimation = () => {
    switch (style) {
      case 'bounce': {
        const bounce = spring({frame, fps, config: {damping: 8, mass: 0.5}});
        return {
          transform: `scale(${bounce}) translateY(${(1 - bounce) * -100}px)`,
          opacity: bounce,
        };
      }
      case 'slide': {
        const slide = interpolate(frame, [0, 20], [-800, 0], {extrapolateRight: 'clamp'});
        const opacity = interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
        return {
          transform: `translateX(${slide}px)`,
          opacity,
        };
      }
      case 'scale': {
        const scale = spring({frame, fps, config: {damping: 12}});
        const rotation = interpolate(frame, [0, 30], [180, 0], {extrapolateRight: 'clamp'});
        return {
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity: scale,
        };
      }
      case 'rotate': {
        const rotate = spring({frame, fps, config: {damping: 15}});
        return {
          transform: `rotateY(${(1 - rotate) * 90}deg) rotateX(${(1 - rotate) * -30}deg)`,
          opacity: rotate,
        };
      }
      case 'split': {
        // 글자별로 애니메이션
        return {opacity: 1};
      }
      default:
        return {};
    }
  };

  if (style === 'split') {
    return (
      <div style={{display: 'flex', justifyContent: 'center'}}>
        {word.split('').map((char, i) => {
          const delay = i * 3;
          const charSpring = spring({
            frame: frame - delay,
            fps,
            config: {damping: 10},
          });
          const y = interpolate(charSpring, [0, 1], [50, 0]);
          const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={i}
              style={{
                fontSize,
                fontWeight: 'bold',
                fontFamily: 'Arial Black, sans-serif',
                color,
                display: 'inline-block',
                transform: `translateY(${y}px)`,
                opacity,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        fontSize,
        fontWeight: 'bold',
        fontFamily: 'Arial Black, sans-serif',
        color,
        textAlign: 'center',
        ...getAnimation(),
      }}
    >
      {word}
    </div>
  );
};

// 배경 파티클 효과
const BackgroundParticles: React.FC<{color: string}> = ({color}) => {
  const frame = useCurrentFrame();
  const particles = Array.from({length: 20}, (_, i) => ({
    id: i,
    x: (i * 137) % 100,
    y: (i * 89) % 100,
    size: 4 + (i % 5) * 2,
    speed: 0.5 + (i % 3) * 0.3,
  }));

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {particles.map((p) => {
        const y = (p.y + frame * p.speed) % 120 - 10;
        const opacity = interpolate(y, [0, 50, 100], [0, 0.3, 0]);

        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: color,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};

// 메인 컴포지션
export const KineticTypography: React.FC<KineticTypographyProps> = ({
  words = ['CREATE', 'DESIGN', 'ANIMATE', 'INSPIRE'],
  primaryColor = '#ffffff',
  accentColor = '#ff6b6b',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const styles: Array<'bounce' | 'slide' | 'scale' | 'rotate' | 'split'> = [
    'bounce',
    'slide',
    'scale',
    'rotate',
    'split',
  ];

  // 배경 그라디언트 애니메이션
  const bgHue = interpolate(frame, [0, 300], [220, 280]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg,
          hsl(${bgHue}, 50%, 10%) 0%,
          hsl(${bgHue + 30}, 60%, 15%) 50%,
          hsl(${bgHue + 60}, 40%, 8%) 100%)`,
      }}
    >
      <BackgroundParticles color={accentColor} />

      {words.map((word, index) => (
        <Sequence
          key={word}
          from={index * 60}
          durationInFrames={60}
        >
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AnimatedWord
              word={word}
              style={styles[index % styles.length]}
              color={index % 2 === 0 ? primaryColor : accentColor}
              fontSize={140}
            />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* 마지막 통합 씬 */}
      <Sequence from={words.length * 60} durationInFrames={90}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {words.map((word, i) => {
            const localFrame = frame - words.length * 60;
            const delay = i * 8;
            const wordSpring = spring({
              frame: localFrame - delay,
              fps,
              config: {damping: 12},
            });
            const scale = interpolate(wordSpring, [0, 1], [0.5, 1]);
            const opacity = interpolate(localFrame, [delay, delay + 15], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const x = interpolate(
              localFrame,
              [delay, delay + 20],
              [i % 2 === 0 ? -200 : 200, 0],
              {extrapolateRight: 'clamp'}
            );

            return (
              <div
                key={word}
                style={{
                  fontSize: 60,
                  fontWeight: 'bold',
                  fontFamily: 'Arial Black, sans-serif',
                  color: i % 2 === 0 ? primaryColor : accentColor,
                  transform: `scale(${scale}) translateX(${x}px)`,
                  opacity,
                  textShadow: `0 0 30px ${i % 2 === 0 ? primaryColor : accentColor}40`,
                }}
              >
                {word}
              </div>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* 로고/브랜드 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          fontSize: 18,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'monospace',
        }}
      >
        Kinetic Typography
      </div>
    </AbsoluteFill>
  );
};
