import { AudioManager } from "./AudioManager.js";
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  preload() {
    console.log("BOOT OK");

    this.load.on("loaderror", (file) => {
      console.error("Erreur de chargement :", file.key, file.src);
    });

    this.load.image("aveytour-map", "assets/background/uhomapblanc.png");
    this.load.image("panneau-aveytour", "assets/panneaux/aveytour.png");
    this.load.image("uho", "assets/player/uho.png");
    this.load.image("credits", "assets/panneaux/credits.png");

    this.load.image("jaune", "assets/notes/jaune.png");
    this.load.image("bleue", "assets/notes/bleue.png");
    this.load.image("rouge", "assets/notes/rouge.png");
    this.load.image("verte", "assets/notes/verte.png");

    this.load.audio("uho-melodie", "assets/audio/uho-melodie.wav");
    this.load.audio("uho-solo", "assets/audio/uho-solo.wav");
    this.load.audio("gameover", "assets/audio/gameover.wav");
  }

  create() {
    this.audioManager();
    this.scene.start("MenuScene");
  }
}
