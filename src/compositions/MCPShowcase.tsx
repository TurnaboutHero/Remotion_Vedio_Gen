import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  Video,
  staticFile,
} from 'remotion';

/**
 * MCP Showcase - Manim + Excalidraw + Remotion 통합 컴포지션
 *
 * 이 컴포지션은 MCP 파이프라인으로 생성된 에셋들을 조합하여
 * 최종 비디오를 생성합니다.
 *
 * 구조:
 * - Scene 1: 타이틀 인트로 (0-90 frames)
 * - Scene 2: Excalidraw 다이어그램 표시 (90-210 frames)
 * - Scene 3: Manim 애니메이션 삽입 (210-390 frames)
 * - Scene 4: 아웃트로 (390-450 frames)
 */

interface MCPShowcaseProps {
  title?: string;
  subtitle?: string;
  manimVideo?: string;
  excalidrawImage?: string;
}

// 타이틀 씬 컴포넌트
const TitleScene: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const titleSpring = spring({frame, fps, config: {damping: 12}});
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {extrapolateRight: 'clamp'});

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
            fontSize: 80,
            color: '#e94560',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            transform: `scale(${titleSpring})`,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 36,
            color: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            opacity: subtitleOpacity,
            marginTop: 20,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* 데코 요소 */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          display: 'flex',
          gap: 30,
        }}
      >
        {['Manim', 'Excalidraw', 'Remotion'].map((tool, i) => {
          const delay = i * 10;
          const opacity = interpolate(frame, [40 + delay, 60 + delay], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [40 + delay, 60 + delay], [20, 0], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={tool}
              style={{
                padding: '12px 24px',
                background: 'rgba(233, 69, 96, 0.2)',
                borderRadius: 8,
                border: '1px solid #e94560',
                color: '#ffffff',
                fontSize: 18,
                fontFamily: 'monospace',
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {tool}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Excalidraw 다이어그램 씬
const ExcalidrawScene: React.FC<{imagePath?: string}> = ({imagePath}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 15}});
  const rotation = interpolate(frame, [0, 60], [-5, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#fafafa',
          padding: 40,
        }}
      >
        {imagePath ? (
          <Img src={staticFile(imagePath)} style={{maxWidth: 1200, maxHeight: 700}} />
        ) : (
          <div
            style={{
              width: 1200,
              height: 700,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '3px dashed #ccc',
              borderRadius: 12,
              color: '#666',
              fontSize: 32,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Excalidraw 다이어그램이 여기에 표시됩니다
          </div>
        )}
      </div>

      {/* 레이블 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 60,
          background: '#1a1a2e',
          padding: '10px 20px',
          borderRadius: 8,
          color: '#ffffff',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Generated with Excalidraw MCP
      </div>
    </AbsoluteFill>
  );
};

// Manim 비디오 씬
const ManimScene: React.FC<{videoPath?: string}> = ({videoPath}) => {
  const frame = useCurrentFrame();

  const borderGlow = interpolate(frame, [0, 30, 60, 90], [0, 1, 1, 0.5]);

  return (
    <AbsoluteFill
      style={{
        background: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          boxShadow: `0 0 ${40 * borderGlow}px ${10 * borderGlow}px rgba(88, 166, 255, 0.5)`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {videoPath ? (
          <Video src={staticFile(videoPath)} style={{width: 1600, height: 900}} />
        ) : (
          <div
            style={{
              width: 1600,
              height: 900,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(45deg, #1a1a2e, #16213e)',
              color: '#58a6ff',
              fontSize: 32,
              fontFamily: 'monospace',
            }}
          >
            Manim 애니메이션이 여기에 표시됩니다
          </div>
        )}
      </div>

      {/* 레이블 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          right: 60,
          background: 'rgba(88, 166, 255, 0.2)',
          padding: '10px 20px',
          borderRadius: 8,
          border: '1px solid #58a6ff',
          color: '#58a6ff',
          fontSize: 18,
          fontFamily: 'monospace',
        }}
      >
        Rendered with Manim MCP
      </div>
    </AbsoluteFill>
  );
};

// 아웃트로 씬
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({frame, fps, config: {damping: 10}});
  const opacity = interpolate(frame, [30, 60], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontSize: 48,
            color: '#e94560',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            transform: `scale(${scale})`,
          }}
        >
          MCP Pipeline
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 24,
            color: '#ffffff',
            fontFamily: 'monospace',
            opacity,
          }}
        >
          Manim + Excalidraw + Remotion
        </div>
        <div
          style={{
            marginTop: 60,
            fontSize: 18,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'Arial, sans-serif',
            opacity,
          }}
        >
          Powered by Claude Code MCP Servers
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 메인 컴포지션
export const MCPShowcase: React.FC<MCPShowcaseProps> = ({
  title = 'MCP Pipeline Demo',
  subtitle = 'AI-Powered Video Generation',
  manimVideo,
  excalidrawImage,
}) => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Title (0-90 frames) */}
      <Sequence from={0} durationInFrames={90}>
        <TitleScene title={title} subtitle={subtitle} />
      </Sequence>

      {/* Scene 2: Excalidraw (90-210 frames) */}
      <Sequence from={90} durationInFrames={120}>
        <ExcalidrawScene imagePath={excalidrawImage} />
      </Sequence>

      {/* Scene 3: Manim (210-390 frames) */}
      <Sequence from={210} durationInFrames={180}>
        <ManimScene videoPath={manimVideo} />
      </Sequence>

      {/* Scene 4: Outro (390-450 frames) */}
      <Sequence from={390} durationInFrames={60}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
