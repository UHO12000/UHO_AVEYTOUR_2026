import { AudioManager } from "./AudioManager.js";
import { BootScene } from "./BootScene.js";
import MenuScene from "./MenuScene.js";
import { PlayScene } from "./PlayScene.js";
import { GameOverScene } from "./GameOverScene.js";
import CreditsScene from "./CreditsScene.js";
import { FinScene } from "./FinScene.js";

const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  backgroundColor: "#222222",
  parent: "game-container",

  pixelArt: true,
  render: {
    antialias: false,
    roundPixels: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },

  scene: [BootScene, MenuScene, PlayScene, GameOverScene, CreditsScene, FinScene]
};

const game = new Phaser.Game(config);
AudioManager.get(game);
