import { AudioManager } from "./AudioManager.js";
export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("CreditsScene");
  }

  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#081a33");

    const map = this.add.image(width / 2, height * 0.25, "aveytour-map");
    map.setScale(0.58);
    map.setDepth(1);

   const creditsPanel = this.add.image(width / 2, height * 0.46, "credits");
creditsPanel.setScale(0.22);
creditsPanel.setDepth(2);
    

    const creditsText =
`CREATION, MUSIQUE
ET DEVELOPPEMENT :
UHO - UN HOMME ORCHESTRE

TOUTES LES PHOTOS ET VISUELS
SONT DES CREATIONS ORIGINALES
REALISEES PAR UHO EN AVEYRON.

Les nouveaux niveaux arriveront
avec la suite de la tournée 2026!`;

    this.add.text(width / 2, height * 0.67, creditsText, {
      fontFamily: "Courier",
      fontSize: "22px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#081a33",
      strokeThickness: 5,
      align: "center",
      lineSpacing: 10,
      wordWrap: { width: width - 40 }
    }).setOrigin(0.5);

    const linksY = height * 0.84;
    this.createInlineLink(width * 0.20, linksY, "INSTAGRAM", "https://www.instagram.com/uho12000/");
    this.createInlineLink(width * 0.43, linksY, "FACEBOOK", "https://www.facebook.com/uHo12000");
    this.createInlineLink(width * 0.63, linksY, "TIKTOK", "https://www.tiktok.com/@unhommeorchestre12");
    this.createInlineLink(width * 0.83, linksY, "YOUTUBE", "https://www.youtube.com/@unHommeorchestre");

    const back = this.add.text(width / 2, height * 0.90, "RETOUR MENU", {
  fontFamily: "Courier",
  fontSize: "22px",
  color: "#ffffff",
  fontStyle: "bold",
  stroke: "#081a33",
  strokeThickness: 6
}).setOrigin(0.5);

this.tweens.add({
  targets: back,
  alpha: { from: 1, to: 0.3 },
  duration: 600,
  yoyo: true,
  repeat: -1,
  ease: "Sine.easeInOut"
});

    back.setDepth(5);
    back.setInteractive({ useHandCursor: true });

    back.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });

    back.on("pointerover", () => back.setScale(1.1));
    back.on("pointerout", () => back.setScale(1));
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
      underline.setScale(1.05, 1);
    });

    txt.on("pointerout", () => {
      txt.setColor("#ffffff");
      txt.setScale(1);
      underline.setFillStyle(0xffffff);
      underline.setScale(1, 1);
    });
  }
}
