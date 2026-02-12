/**
 * MCP Integration Pipeline for Remotion Video Generation
 *
 * 이 스크립트는 Manim, Excalidraw MCP 서버와 Remotion을 연동하여
 * 통합 비디오 생성 파이프라인을 제공합니다.
 *
 * 워크플로우:
 * 1. Excalidraw MCP: 다이어그램/스케치 생성 → PNG/SVG 내보내기
 * 2. Manim MCP: 수학 애니메이션 생성 → MP4 클립
 * 3. Remotion: 위 결과물을 조합하여 최종 비디오 생성
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 경로 설정
const PATHS = {
  manimMcp: 'D:/Documents/GitHub/manim-mcp-server',
  excalidrawMcp: 'D:/Documents/GitHub/excalidraw-mcp',
  remotionProject: 'D:/Documents/GitHub/Remotion_Vedio_Gen',
  assets: 'D:/Documents/GitHub/Remotion_Vedio_Gen/public/mcp-assets',
  manimOutput: 'D:/Documents/GitHub/manim-mcp-server/src/media',
};

// 에셋 디렉토리 생성
function ensureDirectories() {
  const dirs = [
    PATHS.assets,
    path.join(PATHS.assets, 'manim'),
    path.join(PATHS.assets, 'excalidraw'),
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

/**
 * Manim 애니메이션 생성 및 출력 파일 복사
 * @param {string} sceneName - Manim 씬 이름
 * @param {string} outputName - 출력 파일명
 */
async function generateManimAnimation(sceneName, outputName) {
  console.log(`[Manim] Generating animation: ${sceneName}`);

  const manimOutputDir = path.join(PATHS.manimOutput, 'videos');
  const targetPath = path.join(PATHS.assets, 'manim', `${outputName}.mp4`);

  // Manim 출력 디렉토리에서 최신 비디오 찾기
  if (fs.existsSync(manimOutputDir)) {
    const files = fs.readdirSync(manimOutputDir, { recursive: true })
      .filter(f => f.endsWith('.mp4'));

    if (files.length > 0) {
      const latestFile = files[files.length - 1];
      const sourcePath = path.join(manimOutputDir, latestFile);
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`[Manim] Copied: ${sourcePath} -> ${targetPath}`);
      return targetPath;
    }
  }

  console.log('[Manim] No output found');
  return null;
}

/**
 * Excalidraw 다이어그램을 이미지로 저장
 * @param {string} diagramName - 다이어그램 이름
 * @param {object} elements - Excalidraw 엘리먼트 배열
 */
async function saveExcalidrawDiagram(diagramName, elements) {
  console.log(`[Excalidraw] Saving diagram: ${diagramName}`);

  const targetPath = path.join(PATHS.assets, 'excalidraw', `${diagramName}.json`);
  fs.writeFileSync(targetPath, JSON.stringify(elements, null, 2));
  console.log(`[Excalidraw] Saved: ${targetPath}`);

  return targetPath;
}

/**
 * 파이프라인 상태 확인
 */
function checkPipelineStatus() {
  console.log('\n=== MCP Pipeline Status ===\n');

  // Manim 확인
  try {
    execSync('manim --version', { stdio: 'pipe' });
    console.log('[Manim] Installed');
  } catch {
    console.log('[Manim] Not found - pip install manim');
  }

  // Excalidraw MCP 확인
  const excalidrawIndex = path.join(PATHS.excalidrawMcp, 'dist', 'index.js');
  if (fs.existsSync(excalidrawIndex)) {
    console.log('[Excalidraw MCP] Built');
  } else {
    console.log('[Excalidraw MCP] Not built - run npm run build');
  }

  // Remotion 확인
  const remotionPkg = path.join(PATHS.remotionProject, 'node_modules', 'remotion');
  if (fs.existsSync(remotionPkg)) {
    console.log('[Remotion] Installed');
  } else {
    console.log('[Remotion] Not installed - run npm install');
  }

  // 에셋 디렉토리 확인
  console.log(`\n[Assets Directory] ${PATHS.assets}`);
  if (fs.existsSync(PATHS.assets)) {
    const manimAssets = fs.readdirSync(path.join(PATHS.assets, 'manim')).length;
    const excalidrawAssets = fs.readdirSync(path.join(PATHS.assets, 'excalidraw')).length;
    console.log(`  - Manim assets: ${manimAssets}`);
    console.log(`  - Excalidraw assets: ${excalidrawAssets}`);
  }

  console.log('\n===========================\n');
}

/**
 * Remotion 컴포지션 렌더링
 * @param {string} compositionId - 컴포지션 ID
 * @param {string} outputPath - 출력 경로
 */
async function renderRemotionComposition(compositionId, outputPath) {
  console.log(`[Remotion] Rendering: ${compositionId}`);

  const cmd = `npx remotion render src/index.ts ${compositionId} ${outputPath}`;

  try {
    execSync(cmd, {
      cwd: PATHS.remotionProject,
      stdio: 'inherit'
    });
    console.log(`[Remotion] Output: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('[Remotion] Render failed:', error.message);
    return null;
  }
}

// CLI 인터페이스
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'status':
    ensureDirectories();
    checkPipelineStatus();
    break;

  case 'init':
    ensureDirectories();
    console.log('Pipeline directories initialized');
    break;

  case 'render':
    const compositionId = args[1] || 'MCPShowcase';
    const outputFile = args[2] || 'out/mcp-video.mp4';
    renderRemotionComposition(compositionId, outputFile);
    break;

  default:
    console.log(`
MCP Integration Pipeline

Usage:
  node scripts/mcp-pipeline.js <command>

Commands:
  status    - Check pipeline component status
  init      - Initialize asset directories
  render    - Render Remotion composition

Examples:
  node scripts/mcp-pipeline.js status
  node scripts/mcp-pipeline.js render MCPShowcase out/video.mp4
`);
}

module.exports = {
  PATHS,
  ensureDirectories,
  generateManimAnimation,
  saveExcalidrawDiagram,
  renderRemotionComposition,
  checkPipelineStatus,
};
