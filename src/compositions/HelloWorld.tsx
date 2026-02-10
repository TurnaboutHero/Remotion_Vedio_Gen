import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface HelloWorldProps {
  titleText: string;
  titleColor: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({
  titleText,
  titleColor,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 타이틀 스프링 애니메이션
  const titleScale = spring({
    frame,
    fps,
    config: {damping: 12, stiffness: 200, mass: 0.5},
  });

  // 타이틀 투명도
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 서브타이틀 등장 (40프레임 후)
  const subtitleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleY = interpolate(frame, [40, 60], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 배경 그라디언트 회전
  const gradientRotation = interpolate(frame, [0, 150], [0, 360]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(${gradientRotation}deg, #0f0c29, #302b63, #24243e)`,
      }}
    >
      {/* 타이틀 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          color: titleColor,
          fontSize: 80,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {titleText}
      </div>

      {/* 서브타이틀 */}
      <div
        style={{
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          color: '#aaa',
          fontSize: 30,
          marginTop: 20,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        React로 만드는 프로그래밍 영상
      </div>
    </AbsoluteFill>
  );
};
