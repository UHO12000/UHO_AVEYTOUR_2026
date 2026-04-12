import { AudioManager } from "./AudioManager.js";
export default class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#081a33");

    this.audioManager().tryAutoStartMenuMusic();

    this.input.once("pointerdown", async () => {
      await this.audioManager().startMenuLoopFromGesture();
    });

    if (this.input.keyboard) {
      this.input.keyboard.once("keydown", async () => {
        await this.audioManager().startMenuLoopFromGesture();
      });
    }

    const map = this.add.image(width / 2, height * 0.25, "aveytour-map");
    map.setScale(0.58);
    map.setDepth(2);

    const uho = this.add.image(width / 2, height * 0.68, "uho");
    uho.setScale(0.42);
    uho.setDepth(2);

    const zoneTop = map.y + map.displayHeight / 2;
    const zoneBottom = uho.y - uho.displayHeight / 2;
    const centerY = (zoneTop + zoneBottom) / 2;

    const panneau = this.add.image(width / 2, centerY - 0, "panneau-aveytour");
    panneau.setScale(0.36);
    panneau.setDepth(3);
    panneau.setInteractive({ useHandCursor: true });

    panneau.on("pointerdown", async () => {
      await this.audioManager().startMenuLoopFromGesture();
      if (navigator.vibrate) {
        navigator.vibrate([40, 30, 60]);
      }
      this.scene.start("PlayScene");
    });

    panneau.on("pointerover", () => {
      panneau.setScale(0.39);
    });

    panneau.on("pointerout", () => {
      panneau.setScale(0.36);
    });

    const creditsBtn = this.add.image(width / 2, centerY + 480, "credits");
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
    note.setDepth(4);

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
}
