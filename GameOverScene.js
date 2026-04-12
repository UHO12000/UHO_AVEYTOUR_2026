import { AudioManager } from "./AudioManager.js";
export class GameOverScene extends Phaser.Scene {
  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  constructor() {
    super({ key: "GameOverScene" });
  }

  preload() {
    this.load.image("uhotriste", "assets/player/uhotriste.png");
    this.load.image("uho-ref", "assets/player/uho.png");

    this.levels = [
      { mapName: "millau", panelName: "millau" },
      { mapName: "cavalerie", panelName: "cavalerie" },
      { mapName: "couvertoirade", panelName: "couvertoirade" },
      { mapName: "nant", panelName: "nant" },
      { mapName: "mostuejouls", panelName: "mostuejouls" },
      { mapName: "severac", panelName: "severac" },
      { mapName: "laissac", panelName: "laissac" },
      { mapName: "stgeniez", panelName: "stgeniez" },
      { mapName: "bozouls", panelName: "bozouls" },
      { mapName: "espalion", panelName: "espalion" },
      { mapName: "estaing", panelName: "estaing" },
      { mapName: "stchely", panelName: "stchely" },
      { mapName: "laguiole", panelName: "laguiole" },
      { mapName: "argence", panelName: "argence" },
      { mapName: "stamans", panelName: "stamans" },
      { mapName: "entraygues", panelName: "entraygues" },
      { mapName: "conques", panelName: "conques" },
      { mapName: "decazeville", panelName: "decazeville" },
      { mapName: "montbazens", panelName: "montbazens" },
      { mapName: "bournazel", panelName: "bournazel" },
      { mapName: "marcillac", panelName: "marcillac" },
      { mapName: "belcastel", panelName: "belcastel" },
      { mapName: "villefranchederouergue", panelName: "villefranchederouergue" },
      { mapName: "najac", panelName: "najac" },
      { mapName: "rieupeyroux", panelName: "rieupeyroux" },
      { mapName: "sauveterre", panelName: "sauveterre" },
      { mapName: "baraqueville", panelName: "baraqueville" },
      { mapName: "arvieu", panelName: "arvieu" },
      { mapName: "requista", panelName: "requista" },
      { mapName: "staff", panelName: "staff" },
      { mapName: "camares", panelName: "camares" },
      { mapName: "roquefort", panelName: "roquefort" },
      { mapName: "sallescuran", panelName: "sallescuran" },
      { mapName: "pontdesalars", panelName: "pontdesalars" },
      { mapName: "steradegonde", panelName: "steradegonde" },
      { mapName: "rodez", panelName: "RODEZ" }
    ];

    this.levels.forEach((level, index) => {
      const i = index + 1;

      this.load.image(
        `map-niv${i}`,
        `assets/background/aveyron/N${i}-${level.mapName}.png`
      );

      this.load.image(
        `panel-niv${i}`,
        `assets/panneaux/P${i}-${level.panelName}.png`
      );
    });
  }

  create(data) {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#081a33");
    this.audioManager().playGameOver();

    const safeNumber = (value, fallback) =>
      Number.isFinite(value) ? value : fallback;

    const finalScore = safeNumber(data?.score, 0);
    const rawLastLevel = safeNumber(data?.lastLevel, 1);
    const rawLastCaughtPanelLevel = safeNumber(
      data?.lastCaughtPanelLevel,
      rawLastLevel
    );

    const lastLevel = Phaser.Math.Clamp(rawLastLevel, 1, this.levels.length);
    const lastCaughtPanelLevel = Phaser.Math.Clamp(
      rawLastCaughtPanelLevel,
      1,
      this.levels.length
    );

    // Même position verticale du personnage que dans PlayScene
    const playSize = width;
    const topHudHeight = Math.floor((height - playSize) / 2);
    const playBottomY = topHudHeight + playSize;
    const uhoY = playBottomY - 140;

    // UHO triste
    const refFrame = this.textures.get("uho-ref").getSourceImage();
    const targetUhoWidth = refFrame.width * 0.4;
    const targetUhoHeight = refFrame.height * 0.4;

    const uhoTriste = this.add
      .image(width / 2, uhoY, "uhotriste")
      .setOrigin(0.5)
      .setDisplaySize(targetUhoWidth, targetUhoHeight);

    const uhoTop = uhoTriste.y - uhoTriste.displayHeight / 2;

    // MAP un peu plus petite et remontée
    const map = this.add
      .image(width / 2, 0, `map-niv${lastLevel}`)
      .setOrigin(0.5);

    const mapTopLimit = 46;
    const reservedBeforeUho = 170;
    const mapBottomLimit = uhoTop - reservedBeforeUho;
    const availableMapHeight = Math.max(60, mapBottomLimit - mapTopLimit);

    const mapScale = Math.min(
      (width * 0.76) / map.width,
      (availableMapHeight * 0.88) / map.height
    );

    map.setScale(mapScale);
    map.setPosition(width / 2, mapTopLimit + availableMapHeight / 2 - 16);

    // PANNEAU sous la map
    const panel = this.add
      .image(
        width / 2,
        map.y + map.displayHeight / 2 +55,
        `panel-niv${lastCaughtPanelLevel}`
      )
      .setOrigin(0.5);

panel.setScale(0.16);

    // GAME OVER
    const gameOverText = this.add.text(
      width / 2,
      uhoTop - 48,
      "PERDU!",
      {
        fontSize: "34px",
        fill: "#ffffff",
        fontStyle: "bold",
        stroke: "#081a33",
        strokeThickness: 6
      }
    ).setOrigin(0.5);

    gameOverText.setResolution(1);

    // SCORE sous GAME OVER
    this.add.text(
      width / 2,
      gameOverText.y + 34,
      `SCORE: ${finalScore}`,
      {
        fontSize: "26px",
        fill: "#ffffff",
        fontStyle: "bold",
        stroke: "#081a33",
        strokeThickness: 6
      }
    ).setOrigin(0.5);

    // TOUCHER POUR REJOUER
    const replayText = this.add.text(
      width / 2,
      uhoTriste.y + uhoTriste.displayHeight / 2 + 18,
      "RETOUR MENU",
      {
        fontSize: "20px",
        fill: "#ffffff",
        fontStyle: "bold",
        stroke: "#081a33",
        strokeThickness: 5
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: replayText,
      alpha: { from: 1, to: 0.35 },
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    this.input.once("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}