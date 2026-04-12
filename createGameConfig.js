import Phaser from "phaser";

const BASE_DIMENSIONS = {
  portrait: { width: 540, height: 960 },
  landscape: { width: 960, height: 540 },
};

function clampToAspect(width, height, aspect) {
  if (width / height > aspect) {
    width = height * aspect;
  } else {
    height = width / aspect;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

export function getResponsiveViewport() {
  if (typeof window === "undefined") {
    return { ...BASE_DIMENSIONS.landscape, orientation: "landscape" };
  }

  const isPortrait = window.innerHeight >= window.innerWidth;
  const base = isPortrait ? BASE_DIMENSIONS.portrait : BASE_DIMENSIONS.landscape;
  const { width, height } = clampToAspect(window.innerWidth, window.innerHeight, base.width / base.height);

  return {
    width,
    height,
    orientation: isPortrait ? "portrait" : "landscape",
  };
}

const INITIAL_VIEWPORT = getResponsiveViewport();

const DEFAULT_CONFIG = {
  type: Phaser.AUTO,
  width: INITIAL_VIEWPORT.width,
  height: INITIAL_VIEWPORT.height,
  backgroundColor: "#0d1821",
  pixelArt: true,
  parent: "game",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export function createGameConfig({ parent, scenes } = {}) {
  return {
    ...DEFAULT_CONFIG,
    parent: parent ?? DEFAULT_CONFIG.parent,
    scene: scenes ?? [],
  };
}
