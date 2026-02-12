import React from 'react';
import {Composition} from 'remotion';
import {HelloWorld} from './compositions/HelloWorld';
import {ImageSlideshow} from './compositions/ImageSlideshow';
import {SceneTransition} from './compositions/SceneTransition';
import {CinematicIntro} from './compositions/CinematicIntro';
import {TurnaboutHeroIntro} from './compositions/TurnaboutHeroIntro';
import {YouTubeIntro} from './compositions/YouTubeIntro';
import {DalGakIntro} from './compositions/DalGakIntro';
import {MCPShowcase} from './compositions/MCPShowcase';
import {KineticTypography} from './compositions/KineticTypography';
import {MCPIntegration} from './compositions/MCPIntegration';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 기본 텍스트 애니메이션 */}
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleText: 'Remotion으로 만든 첫 영상!',
          titleColor: '#ffffff',
        }}
      />

      {/* 이미지 슬라이드쇼 */}
      <Composition
        id="ImageSlideshow"
        component={ImageSlideshow}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 씬 전환 예제 */}
      <Composition
        id="SceneTransition"
        component={SceneTransition}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 시네마틱 인트로 - 풀 이펙트 */}
      <Composition
        id="CinematicIntro"
        component={CinematicIntro}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* TurnaboutHero - Premium Minimal Intro */}
      <Composition
        id="TurnaboutHeroIntro"
        component={TurnaboutHeroIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* YouTube Intro - Modern Minimal */}
      <Composition
        id="YouTubeIntro"
        component={YouTubeIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* 딸깍 서비스 소개 영상 */}
      <Composition
        id="DalGakIntro"
        component={DalGakIntro}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* MCP Pipeline Showcase - Manim + Excalidraw 통합 */}
      <Composition
        id="MCPShowcase"
        component={MCPShowcase}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'MCP Pipeline Demo',
          subtitle: 'AI-Powered Video Generation',
          manimVideo: undefined,
          excalidrawImage: undefined,
        }}
      />

      {/* Kinetic Typography - 동적 타이포그래피 */}
      <Composition
        id="KineticTypography"
        component={KineticTypography}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          words: ['CREATE', 'DESIGN', 'ANIMATE', 'INSPIRE'],
          primaryColor: '#ffffff',
          accentColor: '#ff6b6b',
        }}
      />

      {/* MCP Integration - Manim + Excalidraw 실제 통합 데모 */}
      <Composition
        id="MCPIntegration"
        component={MCPIntegration}
        durationInFrames={510}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
