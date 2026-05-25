import { AudioManager } from "./AudioManager.js";

export class FinScene extends Phaser.Scene {
  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  constructor() {
    super({ key: "FinScene" });
  }

  preload() {
    this.load.image("credits", "assets/panneaux/credits.png");
    this.load.image("aveytour-map", "assets/background/uhomapblanc.png");
	this.load.image("aligot", "assets/items/aligot.png");
	this.load.image("roquefort", "assets/items/roquefort.png");
this.load.image("vin", "assets/items/vin.png");
  }

  create(data) {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#081a33");

    // 🔊 SON VICTOIRE
    this.audioManager().stopAll();
    this.audioManager().playSolo();

    // 💡 FLASH LUMIÈRE
    const flash = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0xffffff,
      0
    ).setDepth(1000);

    this.tweens.add({
      targets: flash,
      alpha: { from: 0.0, to: 0.25 },
      duration: 200,
      yoyo: true,
      ease: "Quad.easeOut"
    });

    this.tweens.add({
      targets: flash,
      alpha: { from: 0.0, to: 0.08 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });

    // 🗺️ CARTE
    const map = this.add.image(width / 2, height * 0.25, "aveytour-map");
    map.setScale(0.58);
    map.setDepth(1);

    // 🟡 SCORE
    const score = Number.isFinite(data?.score) ? data.score : 0;

    const scoreText = this.add.text(
      width / 2,
      height * 0.42,
      `SCORE FINAL\n${score}`,
      {
        fontFamily: "Courier",
        fontSize: "28px",
        color: "#ffe066",
        fontStyle: "bold",
        stroke: "#081a33",
        strokeThickness: 6,
        align: "center"
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: scoreText,
      scale: { from: 0.8, to: 1 },
      duration: 500,
      ease: "Back.easeOut"
    });
	
	// 🧀🍷 ITEMS AVEYRON
const itemY = scoreText.y + 120;

const roquefort = this.add.image(
  width / 2 - 180,
  itemY,
  "roquefort"
);

const aligot = this.add.image(
  width / 2,
  itemY,
  "aligot"
);

const vin = this.add.image(
  width / 2 + 180,
  itemY,
  "vin"
);
roquefort.setScale(0.12);
aligot.setScale(0.16);
vin.setScale(0.20);

[roquefort, aligot, vin].forEach((item) => {
  item.setDepth(2);

  this.tweens.add({
    targets: item,
    y: item.y + 10,
    duration: 800,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut"
  });
});


    // 📝 TEXTE PRINCIPAL
    const bravoText = `A SUIVRE...\n\nDe nouveaux niveaux arrivent bientôt\navec la tournée UHO 2026 !`;

    this.add.text(width / 2, height * 0.65, bravoText, {
      fontFamily: "Courier",
      fontSize: "26px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#081a33",
      strokeThickness: 7,
      align: "center",
      wordWrap: { width: width - 40 }
    }).setOrigin(0.5);

    // 📣 TEXTE AU-DESSUS DU BOUTON
    this.add.text(
      width / 2,
      height * 0.75,
      "Retrouve toutes les infos dans CREDITS :",
      {
        fontFamily: "Courier",
        fontSize: "22px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#081a33",
        strokeThickness: 5,
        align: "center"
      }
    ).setOrigin(0.5);

    // 🎯 BOUTON CREDITS
    const creditsBtn = this.add.image(width / 2, height * 0.8, "credits");
    creditsBtn.setScale(0.18);
    creditsBtn.setDepth(3);
    creditsBtn.setInteractive({ useHandCursor: true });

    creditsBtn.on("pointerdown", async () => {
      await this.audioManager().startMenuLoopFromGesture();
      this.scene.start("CreditsScene");
    });

    creditsBtn.on("pointerover", () => {
      creditsBtn.setScale(0.195);
    });

    creditsBtn.on("pointerout", () => {
      creditsBtn.setScale(0.18);
    });

    // 🔗 RÉSEAUX (SOUS LE BOUTON)
    const linksY = height * 0.85;

    this.createInlineLink(width * 0.20, linksY, "INSTAGRAM", "https://www.instagram.com/uho12000/");
    this.createInlineLink(width * 0.43, linksY, "FACEBOOK", "https://www.facebook.com/uHo12000");
    this.createInlineLink(width * 0.63, linksY, "TIKTOK", "https://www.tiktok.com/@unhommeorchestre12");
    this.createInlineLink(width * 0.83, linksY, "YOUTUBE", "https://www.youtube.com/@unHommeorchestre");

    // 🔙 RETOUR MENU
    const back = this.add.text(width / 2, height * 0.90, "RETOUR MENU", {
      fontFamily: "Courier",
      fontSize: "22px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#081a33",
      strokeThickness: 6
    }).setOrigin(0.5);

    back.setInteractive({ useHandCursor: true });

    back.on("pointerdown", async () => {
      await this.audioManager().startMenuLoopFromGesture();
      this.scene.start("MenuScene");
    });

    back.on("pointerover", () => back.setScale(1.05));
    back.on("pointerout", () => back.setScale(1));
	
	this.tweens.add({
  targets: back,
  alpha: { from: 1, to: 0.3 },
  duration: 600,
  yoyo: true,
  repeat: -1,
  ease: "Sine.easeInOut"
});

    // 🌧️ PLUIE DE NOTES
    this.noteTextures = ["jaune", "bleue", "rouge", "verte"];

    this.time.addEvent({
      delay: 550,
      loop: true,
      callback: this.spawnSideNote,
      callbackScope: this
    });
  }

  spawnSideNote() {
    const { width, height } = this.scale;
    const isLeft = Phaser.Math.Between(0, 1) === 0;

    const x = isLeft
      ? Phaser.Math.Between(18, Math.floor(width * 0.16))
      : Phaser.Math.Between(Math.floor(width * 0.84), width - 18);

    const texture = Phaser.Utils.Array.GetRandom(this.noteTextures);
    const note = this.add.image(x, -30, texture);

    note.setScale(0.24);
    note.setAlpha(0.9);
    note.setAngle(Phaser.Math.Between(-20, 20));
    note.setDepth(0);

    const duration = Phaser.Math.Between(3200, 4700);
    const drift = Phaser.Math.Between(-12, 12);

    this.tweens.add({
      targets: note,
      y: height + 40,
      x: x + drift,
      angle: note.angle + Phaser.Math.Between(-20, 20),
      duration: duration,
      ease: "Linear",
      onComplete: () => note.destroy()
    });
  }

  createInlineLink(x, y, label, url) {
    const txt = this.add.text(x, y, label, {
      fontFamily: "Courier",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#081a33",
      strokeThickness: 4,
      align: "center"
    }).setOrigin(0.5);

    txt.setDepth(5);
    txt.setInteractive({ useHandCursor: true });

    const underline = this.add.rectangle(x, y + 14, txt.width + 6, 2, 0xffffff).setOrigin(0.5);
    underline.setDepth(5);

    txt.on("pointerdown", () => {
      try {
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = url;
      } catch (e) {
        window.location.href = url;
      }
    });

    txt.on("pointerover", () => {
      txt.setColor("#ffe066");
      txt.setScale(1.05);
      underline.setFillStyle(0xffe066);
    });

    txt.on("pointerout", () => {
      txt.setColor("#ffffff");
      txt.setScale(1);
      underline.setFillStyle(0xffffff);
    });
  }
}