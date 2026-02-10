import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from 'remotion';

// ============================================================
// 컬러 팔레트 - 몰튼 메탈 테마
// ============================================================
const COLORS = {
  void: '#000000',
  charcoal: '#0D0D0D',
  ironCore: '#1A1A1A',
  steelEdge: '#4A4A4A',
  silverGlow: '#C0C0C0',
  emberDeep: '#FF4500',
  goldMolten: '#FF8C00',
  goldBright: '#FFA500',
  goldFlare: '#FFD700',
  sparkWhite: '#FFF5E6',
};

// ============================================================
// 파티클 시스템 - 3레이어 깊이감
// ============================================================
const ParticleLayer: React.FC<{
  count: number;
  layerSeed: number;
  sizeRange: [number, number];
  speed: number;
  opacityRange: [number, number];
  blurAmount: number;
}> = ({count, layerSeed, sizeRange, speed, opacityRange, blurAmount}) => {
  const frame = useCurrentFrame();

  const particles = Array.from({length: count}, (_, i) => {
    const seed = (i + 1) * 137.508 * layerSeed;
    const x = ((seed * 7.3) % 100);
    const y = ((seed * 3.7) % 100);
    const size = sizeRange[0] + ((seed * 1.3) % (sizeRange[1] - sizeRange[0]));
    const phase = (seed * 2.1) % (Math.PI * 2);
    const baseOpacity = opacityRange[0] + ((seed * 0.3) % (opacityRange[1] - opacityRange[0]));

    // 위로 떠오르는 움직임
    const currentY = ((y - frame * speed * 0.3) % 100 + 100) % 100;
    // 수평 흔들림
    const drift = Math.sin(frame * 0.015 + phase) * 12;
    // 반짝임
    const twinkle = 0.5 + Math.sin(frame * 0.04 + phase * 3) * 0.5;

    // 엠버 색상 스펙트럼
    const colorIndex = i % 4;
    const color = [COLORS.emberDeep, COLORS.goldMolten, COLORS.goldBright, COLORS.sparkWhite][colorIndex];

    // 다이아몬드 vs 원형 모양
    const isRhombus = i % 5 === 0;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x + drift * 0.15}%`,
          top: `${currentY}%`,
          width: size,
          height: size,
          borderRadius: isRhombus ? '1px' : '50%',
          transform: isRhombus ? 'rotate(45deg)' : undefined,
          backgroundColor: color,
          opacity: baseOpacity * twinkle,
          boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${COLORS.goldMolten}`,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
        }}
      />
    );
  });

  return <AbsoluteFill style={{overflow: 'hidden'}}>{particles}</AbsoluteFill>;
};

// ============================================================
// 네뷸라 배경 - 다중 회전 그라디언트
// ============================================================
const NebulaBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const rotation1 = frame * 0.15;
  const rotation2 = frame * -0.1;

  return (
    <AbsoluteFill>
      {/* 레이어 1: 깊은 암흑 */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          background: `radial-gradient(ellipse at ${50 + Math.sin(frame * 0.01) * 5}% ${45 + Math.cos(frame * 0.008) * 3}%, ${COLORS.charcoal} 0%, ${COLORS.void} 60%)`,
        }}
      />
      {/* 레이어 2: 따뜻한 광원 (중앙 하단) */}
      <div
        style={{
          position: 'absolute',
          inset: -200,
          background: `radial-gradient(ellipse at 50% 60%, rgba(255,69,0,0.06) 0%, transparent 50%)`,
          transform: `rotate(${rotation1}deg)`,
          filter: 'blur(60px)',
        }}
      />
      {/* 레이어 3: 골드 액센트 */}
      <div
        style={{
          position: 'absolute',
          inset: -200,
          background: `radial-gradient(ellipse at 45% 40%, rgba(255,140,0,0.04) 0%, transparent 40%)`,
          transform: `rotate(${rotation2}deg)`,
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// 볼류메트릭 라이트 - 고드 레이 (빛 기둥)
// ============================================================
const VolumetricLight: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scaleValue = spring({
    frame: frame - 15,
    fps,
    config: {damping: 20, stiffness: 40, mass: 1.5},
  });

  const rotation = frame * 0.12;
  const opacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: 1400,
          height: 1400,
          opacity: opacity * 0.4,
          transform: `rotate(${rotation}deg) scale(${Math.max(0, scaleValue)})`,
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(255,165,0,0.04) 8deg, transparent 16deg, transparent 45deg, rgba(255,140,0,0.03) 53deg, transparent 61deg, transparent 90deg, rgba(255,200,100,0.04) 98deg, transparent 106deg, transparent 135deg, rgba(255,165,0,0.03) 143deg, transparent 151deg, transparent 180deg, rgba(255,140,0,0.04) 188deg, transparent 196deg, transparent 225deg, rgba(255,200,100,0.03) 233deg, transparent 241deg, transparent 270deg, rgba(255,165,0,0.04) 278deg, transparent 286deg, transparent 315deg, rgba(255,140,0,0.03) 323deg, transparent 331deg, transparent 360deg)`,
          filter: 'blur(25px)',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// 아나모픽 플레어 - 수평 렌즈 스트릭
// ============================================================
const AnamorphicFlare: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [25, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const breathe = 0.35 + Math.sin(frame * 0.04) * 0.12;
  const width = interpolate(frame, [25, 70], [800, 2200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width,
          height: 2,
          opacity: opacity * breathe,
          background: `linear-gradient(90deg, transparent 0%, rgba(255,180,100,0.3) 20%, rgba(255,220,180,0.7) 45%, rgba(255,240,220,0.9) 50%, rgba(255,220,180,0.7) 55%, rgba(255,180,100,0.3) 80%, transparent 100%)`,
          boxShadow: `0 0 30px rgba(255,200,130,0.3), 0 0 60px rgba(255,165,0,0.15)`,
          marginTop: -10,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// 타이틀 리빌 - 글자별 스태거 스프링 애니메이션
// ============================================================
const TitleReveal: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const chars = text.split('');
  const STAGGER_DELAY = 3; // 글자당 3프레임 딜레이
  const START_FRAME = 20;

  // ACT 2: 레터스페이싱 압축 (프레임 50-75)
  const letterSpacing = interpolate(frame, [50, 80], [35, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 글로우 펄스 (정착 후)
  const glowIntensity = frame > 60
    ? 20 + Math.sin(frame * 0.06) * 12
    : interpolate(frame, [40, 60], [5, 20], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  // 몰튼 메탈 그라디언트 스윕
  const gradientPos = interpolate(frame, [50, 210], [-50, 250]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        letterSpacing,
      }}
    >
      {chars.map((char, i) => {
        const charFrame = frame - START_FRAME - i * STAGGER_DELAY;

        // 스프링 등장 (아래에서 위로)
        const springValue = spring({
          frame: charFrame,
          fps,
          config: {damping: 14, stiffness: 120, mass: 0.8},
        });

        const translateY = interpolate(
          Math.max(0, springValue),
          [0, 1],
          [60, 0],
        );

        const charOpacity = interpolate(charFrame, [0, 12], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        // 블러에서 선명으로
        const blur = interpolate(charFrame, [0, 15], [8, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 110,
              fontWeight: 900,
              fontFamily: "'Georgia', 'Palatino', 'Times New Roman', serif",
              background: `linear-gradient(110deg, ${COLORS.ironCore} ${gradientPos}%, ${COLORS.steelEdge} ${gradientPos + 15}%, ${COLORS.silverGlow} ${gradientPos + 30}%, #FFFFFF ${gradientPos + 40}%, ${COLORS.silverGlow} ${gradientPos + 50}%, ${COLORS.steelEdge} ${gradientPos + 65}%, ${COLORS.ironCore} ${gradientPos + 80}%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              opacity: Math.max(0, charOpacity),
              transform: `translateY(${translateY}px)`,
              filter: `blur(${Math.max(0, blur)}px) drop-shadow(0 0 ${glowIntensity}px rgba(255,165,0,0.6))`,
              textShadow: charOpacity > 0.5
                ? `0 0 ${glowIntensity}px rgba(255,140,0,0.5), 0 0 ${glowIntensity * 2}px rgba(255,69,0,0.3), 0 4px 20px rgba(0,0,0,0.8)`
                : 'none',
              textTransform: 'uppercase',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};

// ============================================================
// 수평 몰튼 라인
// ============================================================
const MoltenLine: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const lineSpring = spring({
    frame: frame - 75,
    fps,
    config: {damping: 18, stiffness: 80, mass: 0.8},
  });

  const glowPulse = 10 + Math.sin(frame * 0.06) * 6;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: Math.max(0, lineSpring) * 500,
          height: 2,
          marginTop: 130,
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.emberDeep} 10%, ${COLORS.goldMolten} 30%, ${COLORS.goldBright} 50%, ${COLORS.goldMolten} 70%, ${COLORS.emberDeep} 90%, transparent 100%)`,
          boxShadow: `0 0 ${glowPulse}px ${COLORS.goldBright}, 0 0 ${glowPulse * 2}px ${COLORS.goldMolten}, 0 0 ${glowPulse * 3}px rgba(255,69,0,0.3)`,
          position: 'relative',
        }}
      >
        {/* 쉬머 스윕 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent ${interpolate(frame, [75, 210], [-20, 120]) - 10}%, rgba(255,255,255,0.6) ${interpolate(frame, [75, 210], [-20, 120])}%, transparent ${interpolate(frame, [75, 210], [-20, 120]) + 10}%)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 서브타이틀 - 단어별 페이드업
// ============================================================
const SubtitleReveal: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();

  const words = text.split(' ');
  const START_FRAME = 95;
  const WORD_DELAY = 5;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{marginTop: 190, display: 'flex', gap: 12}}>
        {words.map((word, i) => {
          const wordFrame = frame - START_FRAME - i * WORD_DELAY;

          const wordOpacity = interpolate(wordFrame, [0, 15], [0, 0.85], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const wordY = interpolate(wordFrame, [0, 15], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });

          const wordBlur = interpolate(wordFrame, [0, 12], [4, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <span
              key={i}
              style={{
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "'Arial Narrow', 'Helvetica Neue', sans-serif",
                color: '#808080',
                letterSpacing: 10,
                textTransform: 'uppercase',
                opacity: Math.max(0, wordOpacity),
                transform: `translateY(${wordY}px)`,
                filter: `blur(${Math.max(0, wordBlur)}px)`,
                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 렌즈 플레어 히트 - 임팩트 순간 폭발
// ============================================================
const LensFlareHit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const localFrame = frame - 50;

  const flareScale = spring({
    frame: localFrame,
    fps,
    config: {damping: 8, stiffness: 200, mass: 0.5},
  });

  const flareOpacity = interpolate(localFrame, [0, 3, 8, 20], [0, 0.9, 0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        mixBlendMode: 'screen',
      }}
    >
      {/* 메인 플레어 */}
      <div
        style={{
          width: Math.max(0, flareScale) * 1600,
          height: Math.max(0, flareScale) * 1600,
          borderRadius: '50%',
          opacity: Math.max(0, flareOpacity),
          background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,220,180,0.5) 20%, rgba(255,165,0,0.2) 40%, transparent 60%)`,
          filter: 'blur(10px)',
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// 비네팅 - 애니메이션 (타이틀 등장 시 좁아짐)
// ============================================================
const AnimatedVignette: React.FC = () => {
  const frame = useCurrentFrame();

  // 타이틀 등장 시 좁아지고, 정착 후 다시 넓어짐
  const innerStop = interpolate(frame, [15, 50, 70, 180, 210], [50, 25, 40, 40, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, transparent ${innerStop}%, rgba(0,0,0,0.5) ${innerStop + 20}%, rgba(0,0,0,0.85) 100%)`,
      }}
    />
  );
};

// ============================================================
// 필름 그레인 - 매 프레임 갱신
// ============================================================
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        opacity: 0.08,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
  );
};

// ============================================================
// 스캔라인
// ============================================================
const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      opacity: 0.025,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
    }}
  />
);

// ============================================================
// 라이트 릭
// ============================================================
const LightLeak: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [80, 100, 120, 140], [0, 0.12, 0.12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const angle = 35 + frame * 0.3;
  const position = interpolate(frame, [80, 140], [20, 80]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        background: `linear-gradient(${angle}deg, transparent ${position - 20}%, rgba(255,180,80,0.5) ${position}%, rgba(255,220,150,0.3) ${position + 10}%, transparent ${position + 25}%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};

// ============================================================
// 메인 컴포지션 - OBSIDIAN FORGE
// ============================================================
export const CinematicIntro: React.FC = () => {
  const frame = useCurrentFrame();

  // === 마스터 페이드 ===
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [185, 210], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // === 카메라 줌 + 포커스 시프트 ===
  const cameraZoom = interpolate(frame, [0, 210], [1.0, 1.1], {
    easing: Easing.inOut(Easing.quad),
  });

  // === 카메라 쉐이크 (임팩트 순간) ===
  const shakeIntensity = interpolate(frame, [50, 53, 58], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(frame * 1.5) * 2 * shakeIntensity;
  const shakeY = Math.cos(frame * 2.1) * 1.5 * shakeIntensity;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.void}}>
      {/* 마스터 페이드 래퍼 */}
      <AbsoluteFill style={{opacity: Math.min(fadeIn, fadeOut)}}>
        {/* 카메라 래퍼 */}
        <AbsoluteFill
          style={{
            transform: `scale(${cameraZoom}) translate(${shakeX}px, ${shakeY}px)`,
            transformOrigin: '50% 45%',
          }}
        >
          {/* === 레이어 0: 배경 === */}
          <NebulaBackground />

          {/* === 레이어 1: 볼류메트릭 라이트 === */}
          <Sequence from={10}>
            <VolumetricLight />
          </Sequence>

          {/* === 레이어 2: 파티클 (3 깊이 레이어) === */}
          <Sequence from={0}>
            <ParticleLayer count={35} layerSeed={1.0} sizeRange={[0.5, 1.5]} speed={0.1} opacityRange={[0.1, 0.25]} blurAmount={0} />
          </Sequence>
          <Sequence from={5}>
            <ParticleLayer count={25} layerSeed={2.3} sizeRange={[1.5, 3]} speed={0.18} opacityRange={[0.2, 0.5]} blurAmount={0} />
          </Sequence>
          <Sequence from={20}>
            <ParticleLayer count={12} layerSeed={3.7} sizeRange={[3, 6]} speed={0.28} opacityRange={[0.3, 0.7]} blurAmount={1} />
          </Sequence>

          {/* === 레이어 3: 아나모픽 플레어 === */}
          <Sequence from={25}>
            <AnamorphicFlare />
          </Sequence>

          {/* === 레이어 4: 타이틀 그룹 === */}
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
            <TitleReveal text="OBSIDIAN" />
            <MoltenLine />
            <SubtitleReveal text="FORGED IN DARKNESS" />
          </AbsoluteFill>

          {/* === 레이어 5: 렌즈 플레어 히트 === */}
          <Sequence from={48} durationInFrames={25}>
            <LensFlareHit />
          </Sequence>

          {/* === 레이어 6: 라이트 릭 === */}
          <Sequence from={75} durationInFrames={70}>
            <LightLeak />
          </Sequence>
        </AbsoluteFill>

        {/* === 포스트 프로세싱 스택 (카메라 밖) === */}
        <AnimatedVignette />
        <FilmGrain />
        <Scanlines />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
