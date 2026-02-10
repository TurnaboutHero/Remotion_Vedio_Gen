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

// 컬러 팔레트 - 딸깍 브랜드
const C = {
  bg: '#070714',
  bgLight: '#0E0E24',
  text: '#FFFFFF',
  textMuted: '#8888AA',
  // 보라-핑크 그라디언트 (AI/테크 느낌)
  gradStart: '#7C3AED',  // purple
  gradMid: '#EC4899',    // pink
  gradEnd: '#F97316',    // orange
  accent: '#A78BFA',     // light purple
};

// ============================================================
// 씬 1: 문제 제기 (0-3초)
// "AI, 어렵지 않나요?"
// ============================================================
const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 타이핑 효과 - 프롬프트 텍스트가 하나씩 나타남
  const promptText = 'A photorealistic image of a golden retriever wearing...';
  const typedLength = Math.min(
    Math.floor(interpolate(frame, [10, 60], [0, promptText.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })),
    promptText.length
  );

  // 커서 깜빡임
  const cursorVisible = Math.sin(frame * 0.3) > 0;

  // "어렵지 않나요?" 텍스트
  const questionOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const questionScale = spring({
    frame: frame - 55,
    fps,
    config: {damping: 12, stiffness: 150, mass: 0.8},
  });

  // 전체 페이드인
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeIn,
      }}
    >
      {/* 프롬프트 입력 박스 UI */}
      <div
        style={{
          width: 800,
          padding: '24px 32px',
          borderRadius: 16,
          border: `1px solid rgba(255,255,255,0.08)`,
          backgroundColor: 'rgba(255,255,255,0.03)',
          marginBottom: 50,
        }}
      >
        {/* 입력 필드 라벨 */}
        <div
          style={{
            fontSize: 13,
            color: C.textMuted,
            marginBottom: 12,
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: 1,
          }}
        >
          PROMPT
        </div>
        {/* 타이핑 텍스트 */}
        <div
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: "'Consolas', 'Courier New', monospace",
            minHeight: 30,
          }}
        >
          {promptText.slice(0, typedLength)}
          <span
            style={{
              opacity: cursorVisible ? 1 : 0,
              color: C.accent,
              marginLeft: 2,
            }}
          >
            |
          </span>
        </div>
      </div>

      {/* "AI 프롬프트, 어렵지 않나요?" */}
      <div
        style={{
          fontSize: 42,
          fontWeight: 600,
          color: C.text,
          fontFamily: "'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
          opacity: questionOpacity,
          transform: `scale(${Math.max(0, questionScale)})`,
        }}
      >
        AI 프롬프트, 어렵지 않나요?
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 씬 2: 솔루션 - 딸깍 등장 (3-7초)
// ============================================================
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // "딸깍" 텍스트 스프링 등장
  const nameScale = spring({
    frame: frame - 15,
    fps,
    config: {damping: 10, stiffness: 180, mass: 0.6},
  });

  const nameOpacity = interpolate(frame, [10, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 그라디언트 회전 (배경 글로우)
  const gradAngle = frame * 0.8;
  const glowScale = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 슬로건
  const sloganOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sloganY = interpolate(frame, [40, 55], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 클릭 효과 (딸깍!)
  const clickRing = interpolate(frame, [5, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clickRingOpacity = interpolate(frame, [5, 20], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 배경 그라디언트 글로우 */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `conic-gradient(from ${gradAngle}deg, ${C.gradStart}, ${C.gradMid}, ${C.gradEnd}, ${C.gradStart})`,
          filter: 'blur(120px)',
          opacity: 0.25 * glowScale,
          transform: `scale(${glowScale})`,
        }}
      />

      {/* 클릭 링 이펙트 */}
      <div
        style={{
          position: 'absolute',
          width: 200 + clickRing * 150,
          height: 200 + clickRing * 150,
          borderRadius: '50%',
          border: `2px solid ${C.accent}`,
          opacity: clickRingOpacity,
        }}
      />

      {/* "딸깍" 메인 텍스트 */}
      <div
        style={{
          fontSize: 120,
          fontWeight: 800,
          fontFamily: "'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
          background: `linear-gradient(135deg, ${C.gradStart}, ${C.gradMid}, ${C.gradEnd})`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          opacity: nameOpacity,
          transform: `scale(${Math.max(0, nameScale)})`,
          textShadow: 'none',
          filter: `drop-shadow(0 0 30px rgba(124,58,237,0.4))`,
        }}
      >
        딸깍
      </div>

      {/* 영문 서브 */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 400,
          color: C.textMuted,
          letterSpacing: 8,
          marginTop: 16,
          opacity: nameOpacity,
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        DALGAK
      </div>

      {/* 슬로건 */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: C.text,
          marginTop: 40,
          opacity: sloganOpacity,
          transform: `translateY(${sloganY}px)`,
          fontFamily: "'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
        }}
      >
        당신의 아이디어를{' '}
        <span style={{color: C.accent, fontWeight: 600}}>완벽한 프롬프트</span>
        로
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 씬 3: 기능 소개 (7-12초)
// ============================================================
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  index: number;
}> = ({icon, title, desc, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const delay = index * 12;

  const cardSpring = spring({
    frame: frame - 10 - delay,
    fps,
    config: {damping: 15, stiffness: 120, mass: 0.7},
  });

  const cardOpacity = interpolate(frame, [8 + delay, 20 + delay], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: 260,
        padding: '32px 24px',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        textAlign: 'center',
        opacity: cardOpacity,
        transform: `translateY(${interpolate(Math.max(0, cardSpring), [0, 1], [40, 0])}px)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div style={{fontSize: 44, marginBottom: 16}}>{icon}</div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: C.text,
          marginBottom: 8,
          fontFamily: "'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 14,
          color: C.textMuted,
          lineHeight: 1.5,
          fontFamily: "'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
        }}
      >
        {desc}
      </div>
    </div>
  );
};

const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* 섹션 타이틀 */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: C.accent,
          letterSpacing: 4,
          textTransform: 'uppercase',
          marginBottom: 50,
          opacity: titleOpacity,
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        FEATURES
      </div>

      {/* 기능 카드 3개 */}
      <div style={{display: 'flex', gap: 30}}>
        <FeatureCard
          icon="💡"
          title="아이디어 → 프롬프트"
          desc="간단한 아이디어만 입력하면 완벽한 프롬프트로 변환"
          index={0}
        />
        <FeatureCard
          icon="🎨"
          title="AI 이미지 생성"
          desc="프리미엄 AI 모델로 고품질 이미지 즉시 생성"
          index={1}
        />
        <FeatureCard
          icon="⚡"
          title="원클릭 완성"
          desc="복잡한 설정 없이 클릭 한 번으로 결과물 완성"
          index={2}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 씬 4: CTA (12-15초)
// ============================================================
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mainScale = spring({
    frame: frame - 10,
    fps,
    config: {damping: 14, stiffness: 100, mass: 0.8},
  });

  const mainOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const urlOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const urlY = interpolate(frame, [30, 45], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 글로우 배경
  const glowAngle = frame * 0.6;
  const glowPulse = 0.2 + Math.sin(frame * 0.05) * 0.05;

  // 전체 페이드아웃 (마지막)
  const fadeOut = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      {/* 배경 글로우 */}
      <div
        style={{
          position: 'absolute',
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: `conic-gradient(from ${glowAngle}deg, ${C.gradStart}, ${C.gradMid}, ${C.gradEnd}, ${C.gradStart})`,
          filter: 'blur(150px)',
          opacity: glowPulse,
        }}
      />

      {/* 메인 CTA 텍스트 */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: C.text,
          fontFamily: "'Segoe UI', 'Apple SD Gothic Neo', sans-serif",
          textAlign: 'center',
          opacity: mainOpacity,
          transform: `scale(${Math.max(0, mainScale)})`,
        }}
      >
        지금 바로,{' '}
        <span
          style={{
            background: `linear-gradient(135deg, ${C.gradStart}, ${C.gradMid})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          딸깍
        </span>
      </div>

      {/* URL */}
      <div
        style={{
          marginTop: 30,
          opacity: urlOpacity,
          transform: `translateY(${urlY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: C.textMuted,
            letterSpacing: 3,
            fontFamily: "'Segoe UI', sans-serif",
            padding: '12px 32px',
            borderRadius: 40,
            border: `1px solid rgba(124,58,237,0.3)`,
            backgroundColor: 'rgba(124,58,237,0.05)',
          }}
        >
          dalgak.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// 메인 컴포지션
// ============================================================
export const DalGakIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {/* 씬 1: 문제 제기 (0-3초, 0-90프레임) */}
      <Sequence from={0} durationInFrames={100}>
        <SceneProblem />
      </Sequence>

      {/* 씬 2: 솔루션 - 딸깍 등장 (3-7초, 90-210프레임) */}
      <Sequence from={85} durationInFrames={130}>
        <SceneSolution />
      </Sequence>

      {/* 씬 3: 기능 소개 (7-12초, 210-360프레임) */}
      <Sequence from={205} durationInFrames={155}>
        <SceneFeatures />
      </Sequence>

      {/* 씬 4: CTA (12-15초, 360-450프레임) */}
      <Sequence from={350} durationInFrames={100}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
