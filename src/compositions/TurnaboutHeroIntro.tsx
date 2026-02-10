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
// COLOR SYSTEM - Premium Minimal Palette
// ============================================================
const COLORS = {
  background: '#0A0A0A',
  surface: '#141414',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accentBlue: '#0066FF',
  accentGlow: 'rgba(0, 102, 255, 0.2)',
  gridDot: 'rgba(255, 255, 255, 0.03)',
  line: '#2A2A2A',
};

// ============================================================
// DOT GRID BACKGROUND - Technical precision texture
// ============================================================
const DotGrid: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `radial-gradient(circle, ${COLORS.gridDot} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        backgroundPosition: 'center center',
      }}
    />
  );
};

// ============================================================
// GEOMETRIC LOGO MARK - Abstract T+H monogram
// ============================================================
const LogoMark: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Circle reveal (stroke drawing)
  const circleProgress = spring({
    frame: frame - 15,
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.8},
  });

  // Vertical line reveal
  const verticalProgress = spring({
    frame: frame - 25,
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.8},
  });

  // Horizontal line reveal
  const horizontalProgress = spring({
    frame: frame - 35,
    fps,
    config: {damping: 20, stiffness: 90, mass: 0.8},
  });

  // Completion pulse
  const completionPulse = spring({
    frame: frame - 45,
    fps,
    config: {damping: 15, stiffness: 120, mass: 0.5},
  });

  const pulseScale = interpolate(
    completionPulse,
    [0, 0.5, 1],
    [1, 1.02, 1],
  );

  // Fade to background after title appears
  const backgroundFade = interpolate(frame, [90, 105], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Initial blur to sharp
  const blur = interpolate(frame, [15, 30], [4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const SIZE = 200;
  const CENTER = SIZE / 2;
  const RADIUS = 60;
  const LINE_LENGTH = 50;
  const STROKE_WIDTH = 2;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        filter: `blur(${Math.max(0, blur)}px)`,
        opacity: backgroundFade,
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          transform: `scale(${pulseScale})`,
        }}
      >
        {/* Circle (represents completeness) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke={COLORS.textPrimary}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={2 * Math.PI * RADIUS}
          strokeDashoffset={2 * Math.PI * RADIUS * (1 - circleProgress)}
          strokeLinecap="round"
          style={{
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
          }}
        />

        {/* Vertical line (represents identity/strength) */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={CENTER}
          y2={CENTER + LINE_LENGTH * verticalProgress}
          stroke={COLORS.textPrimary}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />

        {/* Horizontal line (represents connection) */}
        <line
          x1={CENTER - (LINE_LENGTH / 2) * horizontalProgress}
          y1={CENTER}
          x2={CENTER + (LINE_LENGTH / 2) * horizontalProgress}
          y2={CENTER}
          stroke={COLORS.textPrimary}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================
// BRAND NAME - Character-by-character reveal
// ============================================================
const BrandName: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();

  const chars = text.split('');
  const START_FRAME = 60;
  const CHAR_STAGGER = 2;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 68,
        fontWeight: 700,
        fontFamily:
          "'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        letterSpacing: '-0.03em',
        lineHeight: 1.0,
        color: COLORS.textPrimary,
        textShadow: '0 2px 40px rgba(0, 0, 0, 0.8)',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {chars.map((char, i) => {
        const charFrame = frame - START_FRAME - i * CHAR_STAGGER;

        const opacity = interpolate(charFrame, [0, 15], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });

        const translateY = interpolate(charFrame, [0, 15], [8, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: Math.max(0, opacity),
              transform: `translateY(${translateY}px)`,
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
// ACCENT LINE - Horizontal brand signature
// ============================================================
const AccentLine: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lineSpring = spring({
    frame: frame - 75,
    fps,
    config: {damping: 18, stiffness: 100, mass: 0.6},
  });

  const width = interpolate(lineSpring, [0, 1], [0, 120]);

  // Subtle glow pulse
  const glowPulse = 20 + Math.sin((frame - 90) * 0.08) * 5;

  const glowOpacity = interpolate(frame, [90, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: Math.max(0, width),
        height: 2,
        marginTop: 90,
        backgroundColor: COLORS.accentBlue,
        boxShadow: `0 0 ${glowPulse}px ${COLORS.accentGlow}`,
        opacity: glowOpacity,
      }}
    />
  );
};

// ============================================================
// TAGLINE - Optional subtitle with letter-spacing compression
// ============================================================
const Tagline: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [105, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const letterSpacing = interpolate(frame, [105, 120], [0.2, 0.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: 'absolute',
        marginTop: 130,
        fontSize: 16,
        fontWeight: 500,
        fontFamily:
          "'Inter Tight', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        letterSpacing: `${letterSpacing}em`,
        color: COLORS.textSecondary,
        textTransform: 'uppercase',
        opacity: Math.max(0, opacity),
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {text}
    </div>
  );
};

// ============================================================
// COMPOSITION BREATHING - Subtle depth animation
// ============================================================
const useBreathingScale = (startFrame: number): number => {
  const frame = useCurrentFrame();

  if (frame < startFrame) return 1;

  const breathPhase = (frame - startFrame) * 0.04;
  const breathAmount = Math.sin(breathPhase) * 0.02;

  return 1 + breathAmount * interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

// ============================================================
// MAIN COMPOSITION - TurnaboutHero Intro
// ============================================================
export const TurnaboutHeroIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // Master fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle breathing animation
  const breathingScale = useBreathingScale(120);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.background}}>
      <AbsoluteFill style={{opacity: fadeIn}}>
        {/* Background texture */}
        <DotGrid />

        {/* Content wrapper with breathing */}
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${breathingScale})`,
          }}
        >
          {/* Geometric logo mark (background layer) */}
          <LogoMark />

          {/* Brand name */}
          <BrandName text="TurnaboutHero" />

          {/* Accent line */}
          <AccentLine />

          {/* Optional tagline */}
          <Tagline text="PORTFOLIO • DESIGN • CODE" />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
