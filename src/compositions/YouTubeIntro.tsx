import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

// ============================================================
// COLOR PALETTE - Modern Minimal with warm accent
// ============================================================
const C = {
  bg: '#0A0A0A',
  text: '#F5F5F5',
  muted: '#666666',
  accent: '#FF6B35',
  accentSoft: 'rgba(255,107,53,0.12)',
  line: '#222222',
};

// ============================================================
// LOGO MARK - Geometric "turnabout" arrow
// ============================================================
const LogoMark: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const circleScale = spring({
    frame: frame - 5,
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.6},
  });

  const pathLength = 120;
  const drawProgress = interpolate(frame, [12, 40], [pathLength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const opacity = interpolate(frame, [3, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const glowOpacity = interpolate(frame, [30, 50], [0, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${Math.max(0, circleScale)})`,
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: 40,
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          inset: -20,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.accentSoft} 0%, transparent 70%)`,
          opacity: glowOpacity,
          filter: 'blur(15px)',
        }}
      />

      {/* Circle outline */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        style={{position: 'absolute'}}
      >
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={C.accent}
          strokeWidth="1.5"
          opacity="0.6"
        />
      </svg>

      {/* Turnabout arrow mark */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        style={{position: 'absolute'}}
      >
        <path
          d="M 50 28 L 30 28 C 22 28 18 34 18 40 C 18 46 22 52 30 52 L 52 52"
          fill="none"
          stroke={C.text}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={pathLength}
          strokeDashoffset={drawProgress}
        />
        {/* Arrowhead */}
        <path
          d="M 46 46 L 52 52 L 46 58"
          fill="none"
          stroke={C.text}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={30}
          strokeDashoffset={interpolate(frame, [30, 42], [30, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })}
        />
      </svg>
    </div>
  );
};

// ============================================================
// BRAND NAME - Per-character staggered entrance
// ============================================================
const BrandName: React.FC = () => {
  const frame = useCurrentFrame();

  const text = 'TurnaboutHero';
  const chars = text.split('');
  const START = 25;
  const STAGGER = 2;

  const letterSpacing = interpolate(frame, [START, START + 30], [20, 5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{display: 'flex', letterSpacing}}>
      {chars.map((char, i) => {
        const charStart = START + i * STAGGER;

        const charOpacity = interpolate(
          frame,
          [charStart, charStart + 12],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        );

        const charY = interpolate(
          frame,
          [charStart, charStart + 14],
          [18, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          },
        );

        // "Hero" portion (index 9-12) in accent color
        const isHero = i >= 9;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 52,
              fontWeight: 300,
              fontFamily:
                "'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
              color: isHero ? C.accent : C.text,
              opacity: Math.max(0, charOpacity),
              transform: `translateY(${charY}px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================
// DIVIDER LINE - Precise horizontal rule
// ============================================================
const Divider: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lineWidth = spring({
    frame: frame - 55,
    fps,
    config: {damping: 25, stiffness: 80, mass: 0.5},
  });

  return (
    <div
      style={{
        width: Math.max(0, lineWidth) * 60,
        height: 1,
        backgroundColor: C.line,
        marginTop: 24,
        marginBottom: 24,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      {/* Center accent dot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: C.accent,
          opacity: interpolate(frame, [65, 75], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          boxShadow: `0 0 8px ${C.accent}`,
        }}
      />
    </div>
  );
};

// ============================================================
// TAGLINE
// ============================================================
const Tagline: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [70, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = interpolate(frame, [70, 88], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontSize: 15,
        fontWeight: 400,
        fontFamily: "'Segoe UI', 'Helvetica Neue', 'Arial', sans-serif",
        color: C.muted,
        letterSpacing: 6,
        textTransform: 'uppercase',
      }}
    >
      Developer &middot; Creator
    </div>
  );
};

// ============================================================
// CORNER DECORATIONS - Minimal geometric elements
// ============================================================
const CornerDecor: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [40, 60], [0, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const lineLen = interpolate(frame, [40, 65], [0, 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      {/* Top-left */}
      <div style={{position: 'absolute', top: 60, left: 60, opacity}}>
        <div
          style={{width: lineLen, height: 1, backgroundColor: C.line}}
        />
        <div
          style={{width: 1, height: lineLen, backgroundColor: C.line}}
        />
      </div>
      {/* Bottom-right */}
      <div style={{position: 'absolute', bottom: 60, right: 60, opacity}}>
        <div
          style={{
            width: lineLen,
            height: 1,
            backgroundColor: C.line,
            marginLeft: 'auto',
          }}
        />
        <div
          style={{
            width: 1,
            height: lineLen,
            backgroundColor: C.line,
            marginLeft: 'auto',
          }}
        />
      </div>
    </>
  );
};

// ============================================================
// SUBTLE GRID BACKGROUND
// ============================================================
const SubtleGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 0.03], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
};

// ============================================================
// MAIN COMPOSITION - YouTubeIntro
// ============================================================
export const YouTubeIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [130, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
        {/* Subtle grid */}
        <SubtleGrid />

        {/* Corner decorations */}
        <CornerDecor />

        {/* Center content */}
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {/* Logo mark */}
          <LogoMark />

          {/* Brand name */}
          <BrandName />

          {/* Divider */}
          <Divider />

          {/* Tagline */}
          <Tagline />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
