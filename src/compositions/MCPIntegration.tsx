import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
  staticFile,
  Easing,
} from 'remotion';

/**
 * MCP Integration - Manim + Excalidraw + Remotion 통합 데모
 *
 * 구조:
 * - Scene 1: 인트로 타이틀 (0-90 frames)
 * - Scene 2: Excalidraw 스타일 다이어그램 (90-210 frames)
 * - Scene 3: Manim 애니메이션 (210-420 frames)
 * - Scene 4: 아웃트로 (420-510 frames)
 */

// 인트로 씬
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleScale = spring({frame, fps, config: {damping: 12}});
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {extrapolateRight: 'clamp'});
  const lineWidth = interpolate(frame, [20, 50], [0, 400], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{textAlign: 'center'}}>
        <h1
          style={{
            fontSize: 72,
            color: '#fff',
            fontFamily: 'Arial Black, sans-serif',
            transform: `scale(${titleScale})`,
            margin: 0,
            textShadow: '0 0 40px rgba(233, 69, 96, 0.5)',
          }}
        >
          MCP Integration
        </h1>

        {/* 장식 라인 */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #e94560, transparent)',
            margin: '20px auto',
            borderRadius: 2,
          }}
        />

        <p
          style={{
            fontSize: 32,
            color: '#a0a0a0',
            fontFamily: 'Arial, sans-serif',
            opacity: subtitleOpacity,
            marginTop: 10,
          }}
        >
          Manim + Excalidraw + Remotion
        </p>
      </div>

      {/* 배경 장식 */}
      {[...Array(5)].map((_, i) => {
        const delay = i * 15;
        const y = interpolate(frame, [delay, delay + 60], [100, -20], {extrapolateRight: 'clamp'});
        const opacity = interpolate(frame, [delay, delay + 30, delay + 50, delay + 60], [0, 0.3, 0.3, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${15 + i * 18}%`,
              bottom: `${y}%`,
              width: 60 + i * 10,
              height: 60 + i * 10,
              border: '2px solid rgba(233, 69, 96, 0.3)',
              borderRadius: '50%',
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Excalidraw 스타일 다이어그램 씬 (CSS로 재현)
const ExcalidrawScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const boxScale = spring({frame, fps, config: {damping: 15}});

  // 박스 데이터
  const boxes = [
    {label: 'Manim', color: '#d0bfff', x: 200, delay: 0},
    {label: 'Excalidraw', color: '#fff3bf', x: 200, y: 120, delay: 10},
    {label: 'Assets', color: '#b2f2bb', x: 600, y: 60, delay: 20},
    {label: 'Remotion', color: '#ffc9c9', x: 1000, y: 60, delay: 30},
  ];

  return (
    <AbsoluteFill
      style={{
        background: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 제목 */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          fontSize: 36,
          fontFamily: 'Comic Sans MS, cursive',
          color: '#1e1e1e',
        }}
      >
        MCP Pipeline Flow
      </div>

      {/* 박스들 */}
      <div style={{position: 'relative', width: 1400, height: 400}}>
        {boxes.map((box, i) => {
          const localFrame = frame - box.delay;
          const scale = spring({frame: localFrame, fps, config: {damping: 12}});
          const opacity = interpolate(localFrame, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

          return (
            <div
              key={box.label}
              style={{
                position: 'absolute',
                left: box.x,
                top: box.y || 60,
                width: 180,
                height: 80,
                background: box.color,
                borderRadius: 12,
                border: '3px solid #1e1e1e',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Comic Sans MS, cursive',
                fontSize: 22,
                color: '#1e1e1e',
                transform: `scale(${scale})`,
                opacity,
                boxShadow: '4px 4px 0 #1e1e1e',
              }}
            >
              {box.label}
            </div>
          );
        })}

        {/* 화살표들 */}
        {[
          {from: {x: 380, y: 100}, to: {x: 580, y: 100}, delay: 40},
          {from: {x: 380, y: 160}, to: {x: 580, y: 120}, delay: 45},
          {from: {x: 780, y: 100}, to: {x: 980, y: 100}, delay: 50},
        ].map((arrow, i) => {
          const localFrame = frame - arrow.delay;
          const progress = interpolate(localFrame, [0, 20], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });

          return (
            <svg
              key={i}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <defs>
                <marker
                  id={`arrowhead-${i}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#1e1e1e" />
                </marker>
              </defs>
              <line
                x1={arrow.from.x}
                y1={arrow.from.y}
                x2={arrow.from.x + (arrow.to.x - arrow.from.x) * progress}
                y2={arrow.from.y + (arrow.to.y - arrow.from.y) * progress}
                stroke="#1e1e1e"
                strokeWidth="3"
                markerEnd={progress > 0.9 ? `url(#arrowhead-${i})` : undefined}
                strokeDasharray="8,4"
              />
            </svg>
          );
        })}
      </div>

      {/* 하단 라벨 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 18,
          color: '#757575',
          fontFamily: 'monospace',
        }}
      >
        Hand-drawn style diagram with Excalidraw
      </div>
    </AbsoluteFill>
  );
};

// Manim 비디오 씬
const ManimScene: React.FC = () => {
  const frame = useCurrentFrame();

  const borderGlow = interpolate(frame, [0, 30, 60, 90], [0, 1, 1, 0.7]);
  const scale = interpolate(frame, [0, 30], [0.9, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 배경 그라디언트 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, #1a1a2e 0%, #000 70%)',
        }}
      />

      {/* 비디오 컨테이너 */}
      <div
        style={{
          transform: `scale(${scale})`,
          boxShadow: `0 0 ${60 * borderGlow}px ${20 * borderGlow}px rgba(88, 166, 255, 0.4)`,
          borderRadius: 16,
          overflow: 'hidden',
          border: '2px solid rgba(88, 166, 255, 0.5)',
        }}
      >
        <Video
          src={staticFile('mcp-assets/manim/manim-demo.mp4')}
          style={{
            width: 1280,
            height: 720,
          }}
        />
      </div>

      {/* 라벨 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 60,
          background: 'rgba(88, 166, 255, 0.2)',
          padding: '12px 24px',
          borderRadius: 8,
          border: '1px solid #58a6ff',
          color: '#58a6ff',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Rendered with Manim Community
      </div>

      {/* 상단 라벨 */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 60,
          color: '#fff',
          fontSize: 24,
          fontFamily: 'Arial, sans-serif',
          opacity: 0.8,
        }}
      >
        Mathematical Animation
      </div>
    </AbsoluteFill>
  );
};

// 아웃트로 씬
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mainScale = spring({frame, fps, config: {damping: 10}});

  const tools = ['Manim', 'Excalidraw', 'Remotion'];

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{textAlign: 'center', transform: `scale(${mainScale})`}}>
        <div
          style={{
            fontSize: 56,
            color: '#e94560',
            fontFamily: 'Arial Black, sans-serif',
            marginBottom: 30,
          }}
        >
          MCP Pipeline Complete
        </div>

        <div style={{display: 'flex', gap: 30, justifyContent: 'center', marginTop: 40}}>
          {tools.map((tool, i) => {
            const delay = i * 10 + 20;
            const toolOpacity = interpolate(frame, [delay, delay + 20], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const y = interpolate(frame, [delay, delay + 20], [30, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={tool}
                style={{
                  padding: '16px 32px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: 24,
                  fontFamily: 'monospace',
                  opacity: toolOpacity,
                  transform: `translateY(${y}px)`,
                }}
              >
                {tool}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 60,
            fontSize: 20,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Powered by Claude Code MCP Servers
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 메인 컴포지션
export const MCPIntegration: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene />
      </Sequence>

      <Sequence from={90} durationInFrames={120}>
        <ExcalidrawScene />
      </Sequence>

      <Sequence from={210} durationInFrames={210}>
        <ManimScene />
      </Sequence>

      <Sequence from={420} durationInFrames={90}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
