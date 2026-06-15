import { AudioManager } from "./AudioManager.js";
export class PlayScene extends Phaser.Scene {
  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
    const barWidth = Math.min(this.scale.width * 0.72, 420);
    const barHeight = 22;
    const barX = (this.scale.width - barWidth) / 2;
    const barY = this.scale.height / 2 - barHeight / 2;

    this.cameras.main.setBackgroundColor("#ffffff");

    const box = this.add.graphics();
    const fill = this.add.graphics();

    box.lineStyle(4, 0x0b2a52, 1);
    box.strokeRoundedRect(barX, barY, barWidth, barHeight, 8);

    const loadingText = this.add.text(
      this.scale.width / 2,
      barY - 34,
      "CHARGEMENT...",
      {
        fontSize: "20px",
        color: "#0b2a52",
        fontStyle: "bold"
      }
    ).setOrigin(0.5);

    this.load.on("progress", (value) => {
      fill.clear();
      fill.fillStyle(0x0b2a52, 1);
      fill.fillRoundedRect(
        barX + 4,
        barY + 4,
        Math.max(0, (barWidth - 8) * value),
        barHeight - 8,
        5
      );
    });

    this.load.once("complete", () => {
      fill.destroy();
      box.destroy();
      loadingText.destroy();
    });

    // PLAYER / HUD
    this.load.image("uho", "assets/player/uho.png");
    this.load.image("uhoelec1", "assets/player/uho-elec1.png");
    this.load.image("uhoelec2", "assets/player/uho-elec2.png");
    this.load.image("uhoprotect", "assets/player/uho-protect.png");
    this.load.image("coeur", "assets/vies/coeur.png");

    // PADS TACTILES
    this.load.image("padU", "assets/pads/padU.png");
    this.load.image("padO", "assets/pads/padO.png");
    this.load.image("pouceU", "assets/pads/pouceU.png");
    this.load.image("pouceO", "assets/pads/pouceO.png");

    // NOTES
    this.load.image("rouge", "assets/notes/rouge.png");
    this.load.image("jaune", "assets/notes/jaune.png");
    this.load.image("bleue", "assets/notes/bleue.png");
    this.load.image("verte", "assets/notes/verte.png");

    // FAUSSES NOTES
    this.load.image("fn-rouge", "assets/fausses-notes/fn-rouge.png");
    this.load.image("fn-jaune", "assets/fausses-notes/fn-jaune.png");
    this.load.image("fn-verte", "assets/fausses-notes/fn-verte.png");
    this.load.image("fn-bleue", "assets/fausses-notes/fn-bleue.png");

    // ITEMS / BONUS
    this.load.image("aligot", "assets/items/aligot.png");
    this.load.image("roquefort", "assets/items/roquefort.png");
    this.load.image("vin", "assets/items/vin.png");
    this.load.image("couteau", "assets/items/couteau.png");
    this.load.image("guitarelec", "assets/items/guitarelec.png");
    this.load.image("guitarelec1", "assets/items/guitarelec1.png");
    this.load.image("guitarelec2", "assets/items/guitarelec2.png");

    this.load.audio("uho-melodie", "assets/audio/uho-melodie.mp3");
    this.load.audio("uho-solo", "assets/audio/uho-solo.mp3");
    this.load.audio("gameover", "assets/audio/gameover.mp3");

    // NIVEAUX AVEYRON : MAPS + PANNEAUX
   this.levels = [
  { mapName: "steradegonde", panelName: "steradegonde" },
  { mapName: "ceyrac", panelName: "ceyrac" },
  { mapName: "montbazens", panelName: "montbazens" },
  { mapName: "requista", panelName: "requista" },
  { mapName: "pontdesalars", panelName: "pontdesalars" },
  { mapName: "marcillac", panelName: "marcillac" },
  { mapName: "arvieu", panelName: "arvieu" },
  { mapName: "staffrique", panelName: "staffrique" }
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

    // DECORS DE FOND PAR NIVEAU
  this.decorFiles = [
  "D1-steradegonde.png",
  "D2-ceyrac.png",
  "D3-montbazens.png",
  "D4-requista.png",
  "D5-pontdesalars.png",
  "D6-marcillac.png",
  "D7-arvieu.png",
  "D8-staffrique.png",
];

    this.decorFiles.forEach((fileName, index) => {
      this.load.image(
        `decor-niv${index + 1}`,
        `assets/background/decors/${fileName}`
      );
    });
  }

  create() {
    this.UHO_SPEED = 7;
    this.UHO_ELEC_SPEED = 11;
    this.UHO_SCALE = 0.4;

    this.NOTE_SCALE = 0.24;
    this.BAD_NOTE_SCALE = 0.24;
    this.PANEL_SCALE = 0.15;

    this.baseFallSpeed = 200;
    this.maxFallSpeed = 520;
    this.speedPer100 = 18;

    this.baseBadChance = 0.25;
    this.maxBadChance = 0.55;
    this.badChancePer200 = 0.03;

    this.spawnDelayBase = 900;
    this.spawnDelayMin = 420;
    this.spawnDelayPer200 = 30;

    this.panelPoints = 50;
    this.pointsPerGoodNote = 10;
    this.pointsPerRepelledBadNote = 10;
    this.electricDuration = 10000;

    this.score = 0;
    this.lives = 3;
    this.maxLives = 10;
    this.isGameOver = false;

    this.currentLevel = 1;
    this.lastCaughtPanelLevel = 1;
    this.finalScoreAtGameOver = 0;
    this.maxLevel = this.levels.length;

    this.notesEnabled = false;
    this.panelMode = false;
    this.openingSequenceDone = false;

    this.nextPanelScore = 200;
    this.nextPanelLevelToSpawn = 2;
    this.pendingPanelLevels = [];

    this.electricMode = false;
    this.electricEndsAt = 0;
    this.electricTimer = null;
    this.electricAnimToggle = false;
    this.electricAnimKey = "uhoelec1";
	

    this.protectMode = false;
    this.isIntroDemoRunning = true;
    this.inputLocked = true;

    this.moveLeftActive = false;
    this.moveRightActive = false;
    this.leftPointerId = null;
    this.rightPointerId = null;

    this.demoEvents = [];

    this.scheduledBonuses = [
      { score: 460, texture: "aligot", bonusType: "life", count: 1 },
      { score: 860, texture: "aligot", bonusType: "life", count: 1 },
      { score: 1260, texture: "aligot", bonusType: "life", count: 1 },
      { score: 1660, texture: "aligot", bonusType: "life", count: 1 },
      { score: 2060, texture: "aligot", bonusType: "life", count: 1 },
      { score: 2460, texture: "aligot", bonusType: "life", count: 1 },
      { score: 2860, texture: "aligot", bonusType: "life", count: 1 },
      { score: 3060, texture: "aligot", bonusType: "life", count: 1 },
      { score: 3460, texture: "aligot", bonusType: "life", count: 1 },
      { score: 3600, texture: "guitarelec", bonusType: "electric", count: 1 }
    ];

    this.levelTriggeredBonuses = {
      4: { texture: "roquefort", bonusType: "life", count: 1 },
	  6: { texture: "vin", bonusType: "life", count: 1 },
	  8: { texture: "guitarelec", bonusType: "electric", count: 1 }
    };

    this.triggeredLevelBonuses = new Set();
    this.nextScheduledBonusIndex = 0;
    this.pendingScheduledBonuses = [];

    this.playSize = this.scale.width;
    this.topHudHeight = Math.floor((this.scale.height - this.playSize) / 2);
    this.bottomControlHeight = this.scale.height - this.playSize - this.topHudHeight;

    this.playTopY = this.topHudHeight;
    this.playBottomY = this.playTopY + this.playSize;
    this.playLeftX = 0;
    this.playRightX = this.scale.width;
    this.playCenterY = this.playTopY + this.playSize / 2;

    this.currentDecorIndex = this.getDecorIndexForLevel(1);

    this.background = this.add.image(
      this.scale.width / 2,
      this.playCenterY,
      `decor-niv${this.currentDecorIndex}`
    )
      .setDisplaySize(this.scale.width, this.playSize)
      .setDepth(-10);

    this.add.rectangle(
      this.scale.width / 2,
      this.topHudHeight / 2,
      this.scale.width,
      this.topHudHeight,
      0x081a33,
      1
    ).setDepth(-4);

    this.add.rectangle(
      this.scale.width / 2,
      this.playBottomY + this.bottomControlHeight / 2,
      this.scale.width,
      this.bottomControlHeight,
      0x081a33,
      1
    ).setDepth(-4);

    this.laneCount = 7;
    this.laneMargin = 60;
    this.laneLeft = this.laneMargin;
    this.laneRight = this.scale.width - this.laneMargin;
    this.laneStep = (this.laneRight - this.laneLeft) / (this.laneCount - 1);
    this.minVerticalGap = 140;

    this.UHO_Y = this.playBottomY - 185;
    this.uhoStartX = this.scale.width / 2;

    this.children.list
      .filter(
        (obj) =>
          obj &&
          obj.texture &&
          ["uho", "uhoelec1", "uhoelec2", "uhoprotect"].includes(obj.texture.key)
      )
      .forEach((obj) => obj.destroy());

    this.uho = this.add.sprite(this.uhoStartX, this.UHO_Y, "uho")
      .setScale(this.UHO_SCALE)
      .setDepth(10);

    this.goodNotes = this.physics.add.group();
    this.badNotes = this.physics.add.group();
    this.panels = this.physics.add.group();
    this.bonusItems = this.physics.add.group();

    this.livesContainer = this.add.container(0, 0).setDepth(50);
    this.hudHeartY = this.topHudHeight / 2 - 16;

    this.scoreText = this.add.text(
      this.scale.width - 24,
      this.topHudHeight / 2,
      "SCORE: 0",
      {
        fontSize: "24px",
        fill: "#fff",
        fontStyle: "bold"
      }
    )
      .setOrigin(1, 0.5)
      .setScrollFactor(0)
      .setDepth(50);

    this.powerText = this.add.text(
      this.scale.width / 2,
      this.scale.height - 18,
      "",
      {
        fontSize: "16px",
        fill: "#fff"
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(50);

    this.aveyronIcon = this.add.image(
      this.scale.width / 2,
      this.topHudHeight / 2,
      "map-niv1"
    )
      .setScrollFactor(0)
      .setDepth(50);

    this.aveyronIcon.setDisplaySize(200, 200);
    this.updateLivesDisplay();

    const padY = this.playBottomY + this.bottomControlHeight / 2;
    const padSize = 200;
    const thumbY = padY - 42;
    const thumbSize = 248;

    this.padLeft = this.add.image(115, padY, "padU")
      .setDisplaySize(padSize, padSize)
      .setDepth(60)
      .setAlpha(1);

    this.padRight = this.add.image(this.scale.width - 115, padY, "padO")
      .setDisplaySize(padSize, padSize)
      .setDepth(60)
      .setAlpha(1);

    this.thumbLeft = this.add.image(115, thumbY, "pouceU")
      .setDisplaySize(thumbSize, thumbSize)
      .setDepth(70)
      .setAlpha(0);

    this.thumbRight = this.add.image(this.scale.width - 115, thumbY, "pouceO")
      .setDisplaySize(thumbSize, thumbSize)
      .setDepth(70)
      .setAlpha(0);

    this.timerText = this.add.text(
      this.scale.width / 2,
      padY + 4,
      "",
      {
        fontSize: "26px",
        fill: "#ffffff",
        fontStyle: "bold",
        stroke: "#081a33",
        strokeThickness: 6
      }
    )
      .setOrigin(0.5)
      .setDepth(80);
	  
	  // 🔥 BOSS TEXT
this.bossText = this.add.text(
  this.scale.width / 2,
  this.playTopY + 40,
  "BOSS !",
  {
    fontFamily: "Courier",
    fontSize: "48px",
    color: "#ffffff",
    fontStyle: "bold",
    stroke: "#081a33",
    strokeThickness: 8
  }
)
.setOrigin(0.5)
.setDepth(200)
.setVisible(false);

    this.input.addPointer(2);

    this.padLeft.setInteractive();
    this.padRight.setInteractive();

    this.bindPadControls();

    this.cursors = this.input.keyboard.createCursorKeys();

    this.flashRect = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xffffff,
      0
    )
      .setDepth(1000)
      .setVisible(true);

    this.spawnEvent = this.time.addEvent({
      delay: this.spawnDelayBase,
      loop: true,
      callback: this.spawnFallingItem,
      callbackScope: this
    });

    this.events.once("shutdown", () => {
      this.clearDemoEvents();
      this.tweens.killTweensOf([
        this.uho,
        this.thumbLeft,
        this.thumbRight,
        this.padLeft,
        this.padRight
      ]);
    });

    this.startIntroDemo();
  }

  clearDemoEvents() {
    if (!this.demoEvents) {
      this.demoEvents = [];
      return;
    }

    this.demoEvents.forEach((ev) => {
      if (ev) ev.remove(false);
    });

    this.demoEvents = [];
  }

  queueDemoCall(delay, callback) {
    const ev = this.time.delayedCall(delay, callback);
    this.demoEvents.push(ev);
    return ev;
  }

  bindPadControls() {
    this.padLeft.on("pointerdown", (pointer) => {
      if (this.inputLocked) return;
      this.leftPointerId = pointer.id;
      this.moveLeftActive = true;
      this.blinkPad(this.padLeft);
      this.refreshProtectMode();
    });

    this.padRight.on("pointerdown", (pointer) => {
      if (this.inputLocked) return;
      this.rightPointerId = pointer.id;
      this.moveRightActive = true;
      this.blinkPad(this.padRight);
      this.refreshProtectMode();
    });

    this.input.on("pointerup", (pointer) => {
      if (pointer.id === this.leftPointerId) {
        this.leftPointerId = null;
        this.moveLeftActive = false;
      }

      if (pointer.id === this.rightPointerId) {
        this.rightPointerId = null;
        this.moveRightActive = false;
      }

      this.refreshProtectMode();
    });

    this.input.on("pointerupoutside", (pointer) => {
      if (pointer.id === this.leftPointerId) {
        this.leftPointerId = null;
        this.moveLeftActive = false;
      }

      if (pointer.id === this.rightPointerId) {
        this.rightPointerId = null;
        this.moveRightActive = false;
      }

      this.refreshProtectMode();
    });

    this.input.on("gameout", () => {
      this.leftPointerId = null;
      this.rightPointerId = null;
      this.moveLeftActive = false;
      this.moveRightActive = false;
      this.refreshProtectMode();
    });
  }

  startIntroDemo() {
    this.clearDemoEvents();

    this.isIntroDemoRunning = true;
    this.inputLocked = true;
    this.leftPointerId = null;
    this.rightPointerId = null;
    this.moveLeftActive = false;
    this.moveRightActive = false;

    this.tweens.killTweensOf([
      this.uho,
      this.thumbLeft,
      this.thumbRight,
      this.padLeft,
      this.padRight
    ]);

    this.exitProtectMode();
    this.uho.setAlpha(1);
    this.uho.setVisible(true);
    this.uho.x = this.uhoStartX;

    this.thumbLeft.setAlpha(0).setY(this.padLeft.y - 100);
    this.thumbRight.setAlpha(0).setY(this.padRight.y - 100);

    const leftTarget = this.uhoStartX - 120;
    const rightTarget = this.uhoStartX + 120;

    this.queueDemoCall(300, () => {
      this.playThumbHint(this.padLeft, this.thumbLeft, 2);

      this.tweens.add({
        targets: this.uho,
        x: leftTarget,
        duration: 520,
        ease: "Sine.easeInOut"
      });
    });

    this.queueDemoCall(1100, () => {
      this.playThumbHint(this.padRight, this.thumbRight, 2);

      this.tweens.add({
        targets: this.uho,
        x: rightTarget,
        duration: 520,
        ease: "Sine.easeInOut"
      });
    });

    this.queueDemoCall(1750, () => {
      this.tweens.add({
        targets: this.uho,
        x: this.uhoStartX,
        duration: 260,
        ease: "Sine.easeInOut"
      });
    });

    this.queueDemoCall(2150, () => {
      this.playDualProtectHint();
      this.enterProtectMode();
    });

    this.queueDemoCall(2350, () => {
      this.spawnDemoProtectBadNote();
    });

    this.queueDemoCall(4200, () => {
      this.exitProtectMode();

      this.tweens.add({
        targets: this.uho,
        x: this.uhoStartX,
        duration: 220,
        ease: "Sine.easeOut",
        onComplete: () => {
          this.isIntroDemoRunning = false;
          this.inputLocked = false;
          this.leftPointerId = null;
          this.rightPointerId = null;
          this.moveLeftActive = false;
          this.moveRightActive = false;
          this.clearDemoEvents();
          this.spawnPanel(1, true);
        }
      });
    });
  }

  playDualProtectHint() {
    this.blinkPad(this.padLeft, 3);
    this.blinkPad(this.padRight, 3);

    this.tweens.killTweensOf([this.thumbLeft, this.thumbRight]);

    this.thumbLeft.setAlpha(1).setY(this.padLeft.y - 100);
    this.thumbRight.setAlpha(1).setY(this.padRight.y - 100);

    this.tweens.add({
      targets: this.thumbLeft,
      y: this.padLeft.y - 40,
      duration: 180,
      yoyo: true,
      repeat: 1,
      ease: "Quad.easeOut",
      onComplete: () => {
        if (this.thumbLeft?.active) {
          this.thumbLeft.setAlpha(0);
          this.thumbLeft.setY(this.padLeft.y - 100);
        }
      }
    });

    this.tweens.add({
      targets: this.thumbRight,
      y: this.padRight.y - 40,
      duration: 180,
      yoyo: true,
      repeat: 1,
      ease: "Quad.easeOut",
      onComplete: () => {
        if (this.thumbRight?.active) {
          this.thumbRight.setAlpha(0);
          this.thumbRight.setY(this.padRight.y - 100);
        }
      }
    });
  }

  playThumbHint(pad, thumb, repeatCount = 4) {
    if (!pad || !pad.active || !thumb || !thumb.active) return;

    this.tweens.killTweensOf([pad, thumb]);

    thumb.setAlpha(0);
    thumb.setY(pad.y - 100);

    this.tweens.add({
      targets: thumb,
      alpha: { from: 0, to: 1 },
      y: pad.y - 40,
      duration: 170,
      yoyo: true,
      repeat: repeatCount - 1,
      ease: "Quad.easeOut",
      onStart: () => this.blinkPad(pad, repeatCount),
      onComplete: () => {
        if (!thumb || !thumb.active) return;
        thumb.setAlpha(0);
        thumb.setY(pad.y - 100);
      }
    });
  }

  blinkPad(pad, repeatCount = 1) {
    if (!pad || !pad.active) return;

    this.tweens.killTweensOf(pad);
    pad.setAlpha(1);

    this.tweens.add({
      targets: pad,
      alpha: { from: 1, to: 0.35 },
      duration: 120,
      yoyo: true,
      repeat: repeatCount - 1,
      ease: "Quad.easeOut"
    });
  }

  blinkUhoWhite() {
    return;
  }

  blinkUhoRed() {
    return;
  }

  showLifeLoss(x, y) {
    const container = this.add.container(x, y).setDepth(220);

    const txt = this.add.text(-18, 0, "-1", {
      fontSize: "24px",
      fill: "#ffffff",
      fontStyle: "bold",
      stroke: "#081a33",
      strokeThickness: 5
    }).setOrigin(1, 0.5);

    const heart = this.add.image(10, 0, "coeur")
      .setScale(0.03)
      .setOrigin(0.5);

    container.add([txt, heart]);

    this.tweens.add({
      targets: container,
      y: y - 45,
      alpha: 0,
      duration: 700,
      ease: "Quad.easeOut",
      onComplete: () => container.destroy()
    });
  }

  showFloatingText(x, y, text, color = "#ffffff", fontSize = "24px") {
    const t = this.add.text(x, y, text, {
      fontSize,
      fill: color,
      fontStyle: "bold",
      stroke: "#081a33",
      strokeThickness: 5
    })
      .setOrigin(0.5)
      .setDepth(200);

    this.tweens.add({
      targets: t,
      y: y - 50,
      alpha: 0,
      duration: 650,
      ease: "Quad.easeOut",
      onComplete: () => t.destroy()
    });
  }

  getDecorIndexForLevel(level) {
    return Phaser.Math.Clamp(level, 1, this.decorFiles.length);
  }

  changeDecor(level) {
    const decorIndex = this.getDecorIndexForLevel(level);

    if (decorIndex === this.currentDecorIndex) return;

    this.currentDecorIndex = decorIndex;
    this.background.setTexture(`decor-niv${decorIndex}`);
    this.background.setDisplaySize(this.scale.width, this.playSize);
  }

  updateLivesDisplay() {
    if (!this.livesContainer) return;

    this.lives = Phaser.Math.Clamp(this.lives, 0, this.maxLives);
    this.livesContainer.removeAll(true);

    const heartScale = 0.03;
    const startX = 12;
    const gapX = 44;
    const rowGap = 34;
    const heartsPerRow = 5;

    for (let i = 0; i < this.lives; i++) {
      const row = Math.floor(i / heartsPerRow);
      const col = i % heartsPerRow;

      const heart = this.add.image(
        startX + col * gapX,
        this.hudHeartY + row * rowGap,
        "coeur"
      )
        .setOrigin(0, 0.5)
        .setScale(heartScale)
        .setDepth(50);

      this.livesContainer.add(heart);
    }
  }

  getBonusScale(texture) {
    switch (texture) {
      case "aligot":
        return 0.16;
      case "couteau":
        return 0.085;
      case "roquefort":
        return 0.12;
      case "vin":
        return 0.22;
      case "guitarelec":
      case "guitarelec1":
      case "guitarelec2":
        return 0.22;
      default:
        return 0.18;
    }
  }

  getFallSpeed() {
    const inc = Math.floor(this.score / 100) * this.speedPer100;
    const rodezBoost = this.currentLevel >= this.maxLevel ? 120 : 0;
    return Phaser.Math.Clamp(
      this.baseFallSpeed + inc + rodezBoost,
      this.baseFallSpeed,
      this.maxFallSpeed + 140
    );
  }

  getBadChance() {
    if (this.electricMode) return 0.88;
    if (this.currentLevel >= this.maxLevel) return 0.75;

    const inc = Math.floor(this.score / 200) * this.badChancePer200;
    return Phaser.Math.Clamp(
      this.baseBadChance + inc,
      this.baseBadChance,
      this.maxBadChance
    );
  }

  getSpawnDelay() {
    if (this.electricMode) return 250;
    if (this.currentLevel >= this.maxLevel) return 240;

    const dec = Math.floor(this.score / 200) * this.spawnDelayPer200;
    return Phaser.Math.Clamp(
      this.spawnDelayBase - dec,
      this.spawnDelayMin,
      this.spawnDelayBase
    );
  }

  getBonusFallSpeed() {
    return Math.max(180, this.getFallSpeed() - 20);
  }

  refreshSpawnRate() {
    const newDelay = this.getSpawnDelay();
    if (this.spawnEvent && this.spawnEvent.delay !== newDelay) {
      this.spawnEvent.delay = newDelay;
    }
  }

  getLaneX(index) {
    return this.laneLeft + index * this.laneStep;
  }

  getCenterLaneIndex() {
    return Math.floor(this.laneCount / 2);
  }

  getAllFallingObjects() {
    return [
      ...this.goodNotes.getChildren(),
      ...this.badNotes.getChildren(),
      ...this.panels.getChildren(),
      ...this.bonusItems.getChildren()
    ].filter((obj) => obj.active);
  }

  isLaneFree(laneIndex, minGap = this.minVerticalGap) {
    const laneX = this.getLaneX(laneIndex);

    return !this.getAllFallingObjects().some((obj) => {
      const objLane = obj.getData("laneIndex");
      if (objLane !== undefined) {
        return objLane === laneIndex && obj.y < this.playTopY + minGap;
      }
      return Math.abs(obj.x - laneX) < this.laneStep * 0.35 && obj.y < this.playTopY + minGap;
    });
  }

  getFreeLaneIndices(minGap = this.minVerticalGap) {
    const lanes = [];
    for (let i = 0; i < this.laneCount; i++) {
      if (this.isLaneFree(i, minGap)) lanes.push(i);
    }
    return lanes;
  }

  getRandomFreeLane(minGap = this.minVerticalGap) {
    const free = this.getFreeLaneIndices(minGap);
    if (free.length === 0) return null;
    return Phaser.Utils.Array.GetRandom(free);
  }

  markLane(sprite, laneIndex) {
    sprite.setData("laneIndex", laneIndex);
  }

  getSpawnY() {
    return this.playTopY + 20;
  }

  rewardFlash() {
    this.tweens.killTweensOf(this.flashRect);
    this.flashRect.setFillStyle(0xffffff, 1);
    this.flashRect.setAlpha(0);

    this.tweens.add({
      targets: this.flashRect,
      alpha: { from: 0.0, to: 0.20 },
      duration: 70,
      yoyo: true,
      hold: 20,
      ease: "Quad.easeOut"
    });
  }

  damageFlash() {
    this.tweens.killTweensOf(this.flashRect);
    this.flashRect.setFillStyle(0xff2d2d, 1);
    this.flashRect.setAlpha(0);
	
    this.tweens.add({
      targets: this.flashRect,
      alpha: { from: 0.0, to: 0.28 },
      duration: 85,
      yoyo: true,
      hold: 40,
      ease: "Quad.easeOut"
    });
  }
  
  showBossWarning() {
  if (!this.bossText) return;

  this.bossText.setVisible(true);

  this.tweens.add({
    targets: this.bossText,
    alpha: { from: 1, to: 0.2 },
    duration: 300,
    yoyo: true,
    repeat: 10
  });

  this.damageFlash();

  this.time.delayedCall(3000, () => {
    if (this.bossText) {
      this.bossText.setVisible(false);
      this.bossText.setAlpha(1);
    }
  });
}

  rewardRing(x, y, color = 0xffffff) {
    const ring = this.add.circle(x, y, 10, color, 0.0).setDepth(999);

    this.tweens.add({
      targets: ring,
      radius: 70,
      alpha: { from: 0.18, to: 0.0 },
      duration: 280,
      ease: "Quad.easeOut",
      onComplete: () => ring.destroy()
    });
  }

  clearNormalFallingObjects() {
    this.goodNotes.clear(true, true);
    this.badNotes.clear(true, true);

    this.bonusItems.getChildren().forEach((item) => {
      if (!item.active) return;
      if (!item.getData("panelLinked")) {
        item.destroy();
      }
    });
  }

  hasActivePanelLinkedBonus() {
    return this.bonusItems.getChildren().some((item) => {
      return item.active && item.getData("panelLinked") === true;
    });
  }

  tryEndPanelMode() {
    const hasPanel = this.panels.countActive(true) > 0;
    const hasPanelBonus = this.hasActivePanelLinkedBonus();

    if (hasPanel || hasPanelBonus) return;

    if (this.pendingPanelLevels.length > 0) {
      const nextLevel = this.pendingPanelLevels.shift();
      this.spawnPanel(nextLevel, false);
      return;
    }

    this.panelMode = false;
    this.notesEnabled = true;
    this.flushPendingScheduledBonuses();
  }

  spawnFallingItem() {
    if (this.isGameOver || !this.notesEnabled || this.isIntroDemoRunning) return;

    this.refreshSpawnRate();

    if (this.pendingScheduledBonuses.length > 0) {
      const pendingBefore = this.pendingScheduledBonuses.length;
      this.flushPendingScheduledBonuses();

      if (this.pendingScheduledBonuses.length < pendingBefore) {
        return;
      }
    }

    const laneIndex = this.getRandomFreeLane();
    if (laneIndex === null) return;

    const x = this.getLaneX(laneIndex);
    const y = this.getSpawnY();
    const fallSpeed = this.getFallSpeed();
    const badChance = this.getBadChance();
    const isBad = Math.random() < badChance;

    if (isBad) {
      const key = Phaser.Utils.Array.GetRandom([
        "fn-rouge",
        "fn-jaune",
        "fn-verte",
        "fn-bleue"
      ]);

      const bad = this.badNotes.create(x, y, key);
      bad.setScale(this.BAD_NOTE_SCALE);
      bad.setVelocityY(this.electricMode ? fallSpeed + 110 : fallSpeed + 20);
      bad.body.setAllowGravity(false);
      this.markLane(bad, laneIndex);
      return;
    }

    const key = Phaser.Utils.Array.GetRandom([
      "rouge",
      "jaune",
      "bleue",
      "verte"
    ]);

    const good = this.goodNotes.create(x, y, key);
    good.setScale(this.NOTE_SCALE);
    good.setVelocityY(fallSpeed);
    good.body.setAllowGravity(false);
    this.markLane(good, laneIndex);
    this.applyGoodNoteSway(good, x);
  }

  queueScheduledBonusesFromScore() {
    while (
      this.nextScheduledBonusIndex < this.scheduledBonuses.length &&
      this.score >= this.scheduledBonuses[this.nextScheduledBonusIndex].score
    ) {
      this.pendingScheduledBonuses.push(this.scheduledBonuses[this.nextScheduledBonusIndex]);
      this.nextScheduledBonusIndex += 1;
    }
  }

  queueLevelTriggeredBonus(level) {
    const bonusConfig = this.levelTriggeredBonuses[level];

    if (!bonusConfig || this.triggeredLevelBonuses.has(level)) return;

    this.triggeredLevelBonuses.add(level);
    this.pendingScheduledBonuses.push({ ...bonusConfig });
  }

  flushPendingScheduledBonuses() {
	  // on laisse tomber les bonus même en mode électrique
   // if (this.electricMode) return;
    if (this.panelMode || !this.notesEnabled || this.pendingScheduledBonuses.length === 0) return;

    let guard = 0;

    while (this.pendingScheduledBonuses.length > 0 && guard < 10) {
      const bonusConfig = this.pendingScheduledBonuses[0];
      const didSpawn = this.spawnMultiBonus(bonusConfig);

      if (!didSpawn) {
        return;
      }

      this.pendingScheduledBonuses.shift();
      guard += 1;
    }
  }

  spawnMultiBonus({ texture, bonusType, count = 1 }) {
    //if (this.electricMode) return false;

    const free = this.getFreeLaneIndices(this.minVerticalGap + 20);
    if (free.length < count) return false;

    const shuffled = Phaser.Utils.Array.Shuffle([...free]);
    const selected = shuffled.slice(0, count);

    selected.forEach((laneIndex) => {
      this.spawnBonusItem({
        texture,
        bonusType,
        scale: this.getBonusScale(texture),
        laneIndex,
        panelLinked: false
      });
    });

    return selected.length > 0;
  }

  spawnBonusItem({ texture, bonusType, scale = null, laneIndex = null, panelLinked = false }) {
    if (this.isGameOver) return null;
    //if (this.electricMode) return null;

    const finalLane = laneIndex ?? this.getRandomFreeLane(this.minVerticalGap + 20);
    if (finalLane === null) return null;

    const spawnX = this.getLaneX(finalLane);
    const spawnY = this.getSpawnY();
    const finalScale = scale ?? this.getBonusScale(texture);

    const item = this.bonusItems.create(spawnX, spawnY, texture);

    item.setScale(finalScale);
    item.setVelocityY(this.getBonusFallSpeed());
    item.body.setAllowGravity(false);
    item.setData("bonusType", bonusType);
    item.setData("panelLinked", panelLinked);
    this.markLane(item, finalLane);

    if (texture === "couteau") {
      item.setAngle(125);
    }

    if (bonusType === "electric") {
      item.setTexture("guitarelec1");
      item.setData("animElectricItem", true);
      item.setData("animElectricToggleAt", 0);
    }

    this.rewardRing(
      spawnX,
      spawnY,
      bonusType === "electric" ? 0x6bd6ff : 0x7dffb3
    );
    return item;
  }

  spawnPanel(level, isOpening = false) {
    if (this.isGameOver) return;
    if (level < 1 || level > this.maxLevel) return;

    this.panelMode = true;

    const laneIndex = this.getCenterLaneIndex();
    const x = this.getLaneX(laneIndex);
    const y = this.getSpawnY();

    const panel = this.panels.create(x, y, `panel-niv${level}`);
    panel.setScale(this.PANEL_SCALE);
    panel.setVelocityY(isOpening ? 180 : Math.max(220, this.getFallSpeed() - 20));
    panel.body.setAllowGravity(false);

    panel.setData("type", "panel");
    panel.setData("level", level);
    panel.setData("points", this.panelPoints);
    panel.setData("opening", isOpening);
    panel.setData("spawnX", x);
    this.markLane(panel, laneIndex);

    this.rewardFlash();
    this.rewardRing(x, y, 0xffffff);
  }

updateMap(level) {
  this.currentLevel = level;
  this.aveyronIcon.setTexture(`map-niv${level}`);
  this.changeDecor(level);

  // 🔥 BOSS au niveau 3
  if (level === 8) {
    this.showBossWarning();
  }
}

  queuePanelsFromScore() {
    while (
      this.openingSequenceDone &&
      this.nextPanelLevelToSpawn <= this.maxLevel &&
      this.score >= this.nextPanelScore
    ) {
      this.pendingPanelLevels.push(this.nextPanelLevelToSpawn);
      this.nextPanelLevelToSpawn += 1;
      this.nextPanelScore += 200;
    }
  }

  tryStartPendingPanel() {
    if (this.panelMode) return;
    if (this.pendingPanelLevels.length <= 0) return;

    const nextLevel = this.pendingPanelLevels.shift();
    this.spawnPanel(nextLevel, false);
  }

  addScore(points) {
    if (this.isGameOver || this.protectMode) return;

    this.score += points;
    this.scoreText.setText("SCORE: " + this.score);
    this.refreshSpawnRate();

    this.queuePanelsFromScore();
    this.queueScheduledBonusesFromScore();

    if (!this.panelMode) {
      this.tryStartPendingPanel();
      this.flushPendingScheduledBonuses();
    }
  }

  gainLife() {
    if (this.isGameOver || this.protectMode) return;
    if (this.lives >= this.maxLives) return;

    this.lives += 1;
    this.updateLivesDisplay();
    this.rewardFlash();
    this.rewardRing(this.uho.x, this.uho.y - 40, 0x7dffb3);
  }

  loseLife() {
    if (this.isGameOver || this.protectMode) return;

    this.lives -= 1;

    if (this.lives < 0) {
      this.lives = 0;
    }

    this.updateLivesDisplay();
    this.damageFlash();

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.notesEnabled = false;
    this.panelMode = true;

    if (this.spawnEvent) {
      this.spawnEvent.remove(false);
      this.spawnEvent = null;
    }

    if (this.electricTimer) {
      this.electricTimer.remove(false);
      this.electricTimer = null;
    }

    this.audioManager().stop("uho-solo");
    this.audioManager().stop("uho-melodie");

    this.clearDemoEvents();

    this.leftPointerId = null;
    this.rightPointerId = null;
    this.moveLeftActive = false;
    this.moveRightActive = false;
    this.protectMode = false;

    this.uho.setAlpha(1);

    this.physics.pause();

    this.finalScoreAtGameOver = this.score;

    this.time.delayedCall(180, () => {
      if (this.currentLevel >= this.maxLevel) {
        this.scene.start("FinScene", {
          score: this.finalScoreAtGameOver
        });
        return;
      }

      this.scene.start("GameOverScene", {
        score: this.finalScoreAtGameOver,
        lastLevel: this.currentLevel,
        lastCaughtPanelLevel: this.lastCaughtPanelLevel
      });
    });
  }

  onPanelCaught(panel) {
    const level = panel.getData("level");
    const points = panel.getData("points") || this.panelPoints;
    const isOpening = panel.getData("opening") === true;

    const px = panel.x;
    const py = panel.y;

    this.lastCaughtPanelLevel = level;
    panel.destroy();

    this.addScore(points);
    this.showFloatingText(px, py - 10, "+50", "#ffffff", "28px");
    this.updateMap(level);
    this.queueLevelTriggeredBonus(level);

    if (isOpening && !this.openingSequenceDone) {
      this.openingSequenceDone = true;
      this.queuePanelsFromScore();
      this.queueScheduledBonusesFromScore();
    }

    this.tryEndPanelMode();
  }

  onPanelMissed(panel) {
    const level = panel.getData("level");
    const isOpening = panel.getData("opening") === true;

    panel.destroy();

    this.updateMap(level);
    this.queueLevelTriggeredBonus(level);

    if (isOpening && !this.openingSequenceDone) {
      this.openingSequenceDone = true;
      this.queuePanelsFromScore();
      this.queueScheduledBonusesFromScore();
    }

    this.tryEndPanelMode();
  }

  activateElectricMode() {
    if (this.isGameOver) return;

    const soloDurationMs = this.audioManager().playSolo(() => {
      if (!this.isGameOver && this.electricMode) {
        this.deactivateElectricMode();
      }
    });

    this.electricDuration = soloDurationMs;
    this.electricMode = true;
    this.electricEndsAt = this.time.now + soloDurationMs;
    this.electricAnimToggle = false;
    this.electricAnimKey = "uhoelec1";

    if (this.protectMode) {
      this.exitProtectMode();
    }

    this.setPlayerTexture();
    this.uho.setAlpha(1);

    if (this.electricTimer) {
      this.electricTimer.remove(false);
    }

    this.electricTimer = null;

    this.bonusItems.clear(true, true);
    this.refreshSpawnRate();
    this.rewardFlash();
    this.rewardRing(this.uho.x, this.uho.y - 40, 0x6bd6ff);
  }

  deactivateElectricMode() {
    this.electricMode = false;
    this.electricEndsAt = 0;
    this.audioManager().stop("uho-solo");
    this.uho.setAlpha(1);
    this.setPlayerTexture();
    this.powerText.setText("");
    this.timerText.setText("");
    this.electricTimer = null;
    this.refreshSpawnRate();

    if (!this.isGameOver) {
      this.audioManager().playMenuMusic();
    }
  }

  setPlayerTexture() {
    if (!this.uho || !this.uho.active) return;

    if (this.protectMode) {
      this.uho.setTexture("uhoprotect");
    } else if (this.electricMode) {
      this.uho.setTexture(this.electricAnimKey || "uhoelec1");
    } else {
      this.uho.setTexture("uho");
    }

    this.uho.setScale(this.UHO_SCALE);
  }

  updateElectricAnimation() {
    if (!this.uho || !this.uho.active) return;
    if (!this.electricMode || this.protectMode) return;

    if (!this.lastElecAnimToggleAt) {
      this.lastElecAnimToggleAt = 0;
    }

    if (this.time.now - this.lastElecAnimToggleAt < 45) {
      return;
    }

    this.lastElecAnimToggleAt = this.time.now;
    this.electricAnimToggle = !this.electricAnimToggle;
    this.electricAnimKey = this.electricAnimToggle ? "uhoelec1" : "uhoelec2";

    if (this.uho.texture.key !== this.electricAnimKey) {
      this.uho.setTexture(this.electricAnimKey);
      this.uho.setScale(this.UHO_SCALE);
    }
  }

  enterProtectMode() {
    if (this.electricMode) return;
    this.protectMode = true;
    this.uho.setAlpha(1);
    this.setPlayerTexture();
  }

  exitProtectMode() {
    this.protectMode = false;
    this.uho.setAlpha(1);
    this.setPlayerTexture();
  }

  refreshProtectMode() {
    if (this.isIntroDemoRunning) return;

    if (this.electricMode) {
      if (this.protectMode) {
        this.exitProtectMode();
      }
      return;
    }

    const keyboardBoth = this.cursors.left.isDown && this.cursors.right.isDown;
    const touchBoth = this.moveLeftActive && this.moveRightActive;
    const shouldProtect = keyboardBoth || touchBoth;

    if (shouldProtect && !this.protectMode) {
      this.enterProtectMode();
    } else if (!shouldProtect && this.protectMode) {
      this.exitProtectMode();
    }
  }

  spawnDemoProtectBadNote() {
    if (!this.uho || !this.uho.active || this.isGameOver) return;

    const y = this.playTopY + 60;
    const bad = this.badNotes.create(this.uho.x, y, "fn-rouge");
    bad.setScale(this.BAD_NOTE_SCALE);
    bad.setVelocityY(420);
    bad.body.setAllowGravity(false);
    this.markLane(bad, this.getCenterLaneIndex());
  }

  repelBadNote(bad) {
    if (!bad || !bad.active || bad.getData("repelling") || this.isGameOver) return;

    bad.setData("repelling", true);

    const dir = bad.x < this.uho.x ? -1 : 1;

    if (bad.body) {
      bad.body.setAllowGravity(false);
    }

    bad.setVelocity(dir * 260, -300);
    bad.setAngularVelocity(360 * dir);

    this.tweens.add({
      targets: bad,
      alpha: 0,
      duration: 220,
      onComplete: () => {
        if (bad && bad.active) {
          bad.destroy();
        }
      }
    });

    const px = bad.x;
    const py = bad.y;

    this.time.delayedCall(0, () => {
      if (!this.sys.isActive() || this.isGameOver || this.protectMode) return;
      this.addScore(this.pointsPerRepelledBadNote);
      this.showFloatingText(px, py - 20, "+10", "#ffffff", "26px");
      this.rewardRing(this.uho.x, this.uho.y - 30, 0x6bd6ff);
    });
  }

  repelBadNoteProtect(bad) {
    if (!bad || !bad.active || bad.getData("repelling") || this.isGameOver) return;

    bad.setData("repelling", true);

    const dir = bad.x < this.uho.x ? -1 : 1;

    if (bad.body) {
      bad.body.setAllowGravity(false);
    }

    bad.setVelocity(dir * 240, -300);
    bad.setAngularVelocity(360 * dir);
    this.rewardRing(this.uho.x, this.uho.y - 30, 0xffffff);

    this.tweens.add({
      targets: bad,
      alpha: 0,
      duration: 240,
      onComplete: () => {
        if (bad && bad.active) {
          bad.destroy();
        }
      }
    });
  }

  repelGoodNoteProtect(note) {
    if (!note || !note.active || note.getData("repelling") || this.isGameOver) return;

    note.setData("repelling", true);

    const dir = note.x < this.uho.x ? -1 : 1;

    if (note.body) {
      note.body.setAllowGravity(false);
    }

    note.setVelocity(dir * 220, -260);
    note.setAngularVelocity(300 * dir);
    this.rewardRing(this.uho.x, this.uho.y - 30, 0xffffff);

    this.tweens.add({
      targets: note,
      alpha: 0,
      duration: 220,
      onComplete: () => {
        if (note && note.active) {
          note.destroy();
        }
      }
    });
  }

  repelPanelProtect(panel) {
    if (!panel || !panel.active || panel.getData("repelling") || this.isGameOver) return;

    panel.setData("repelling", true);

    const dir = panel.x < this.uho.x ? -1 : 1;
    const level = panel.getData("level");
    const isOpening = panel.getData("opening") === true;

    if (panel.body) {
      panel.body.setAllowGravity(false);
    }

    panel.setVelocity(dir * 210, -240);
    panel.setAngularVelocity(220 * dir);
    this.rewardRing(this.uho.x, this.uho.y - 30, 0xffffff);

    this.tweens.add({
      targets: panel,
      alpha: 0,
      duration: 240,
      onComplete: () => {
        if (!panel || !panel.active) return;

        panel.destroy();

        this.updateMap(level);
        this.queueLevelTriggeredBonus(level);

        if (isOpening && !this.openingSequenceDone) {
          this.openingSequenceDone = true;
          this.queuePanelsFromScore();
          this.queueScheduledBonusesFromScore();
        }

        this.tryEndPanelMode();
      }
    });
  }

  applyGoodNoteSway(note, baseX) {
    note.setData("baseX", baseX);
    note.setData("swayAmplitude", Phaser.Math.Between(8, 16));
    note.setData("swaySpeed", Phaser.Math.FloatBetween(0.004, 0.006));
    note.setData("swayOffset", Phaser.Math.FloatBetween(0, Math.PI * 2));
  }

  updateGoodNoteSway(note) {
    const baseX = note.getData("baseX");
    const amp = note.getData("swayAmplitude");
    const speed = note.getData("swaySpeed");
    const offset = note.getData("swayOffset");

    if (
      baseX === undefined ||
      amp === undefined ||
      speed === undefined ||
      offset === undefined
    ) {
      return;
    }

    note.x = baseX + Math.sin(this.time.now * speed + offset) * amp;
  }

  updatePowerText() {
    this.powerText.setText(this.electricMode ? "MODE ÉLEC !" : "");

    if (this.electricMode && this.electricEndsAt > 0) {
      const remainingMs = Math.max(0, this.electricEndsAt - this.time.now);
      const seconds = (remainingMs / 1000).toFixed(1);
      this.timerText.setText(seconds);
    } else {
      this.timerText.setText("");
    }
  }

  onBonusCaught(item) {
    const bonusType = item.getData("bonusType");
    const wasPanelLinked = item.getData("panelLinked") === true;
    const x = item.x;
    const y = item.y;

    item.destroy();

    if (this.protectMode) {
      if (wasPanelLinked) this.tryEndPanelMode();
      return;
    }

    if (bonusType === "life") {
      const hadRoom = this.lives < this.maxLives;
      this.gainLife();
      if (hadRoom) {
        this.showFloatingText(x, y - 10, "+1❤️", "#ffffff", "24px");
        this.rewardRing(x, y, 0x7dffb3);
      }
    } else if (bonusType === "electric") {
      this.activateElectricMode();
      this.rewardRing(x, y, 0x6bd6ff);
    }

    if (wasPanelLinked) {
      this.tryEndPanelMode();
    }
  }

  onBonusMissed(item) {
    const wasPanelLinked = item.getData("panelLinked") === true;
    item.destroy();

    if (wasPanelLinked) {
      this.tryEndPanelMode();
    }
  }

  update() {
    if (!this.uho || this.isGameOver) return;

    this.refreshProtectMode();

    if (!this.isIntroDemoRunning) {
      const moveLeft = this.cursors.left.isDown || this.moveLeftActive;
      const moveRight = this.cursors.right.isDown || this.moveRightActive;

      if (!this.protectMode) {
        const moveSpeed = this.electricMode ? this.UHO_ELEC_SPEED : this.UHO_SPEED;

        if (moveLeft && !moveRight) {
          this.uho.x -= moveSpeed;
        } else if (moveRight && !moveLeft) {
          this.uho.x += moveSpeed;
        }
      }
    }

    this.updateElectricAnimation();

    this.uho.x = Phaser.Math.Clamp(this.uho.x, 40, this.scale.width - 40);

    const catchY = this.playBottomY - 300;

    this.updatePowerText();

    this.goodNotes.getChildren().forEach((note) => {
      if (!note.active) return;

      this.updateGoodNoteSway(note);

      if (note.y >= catchY && Math.abs(note.x - this.uho.x) < 80) {
        if (this.protectMode) {
          this.repelGoodNoteProtect(note);
          return;
        }

        const px = note.x;
        const py = note.y;
        note.destroy();
        this.addScore(this.pointsPerGoodNote);
        this.showFloatingText(px, py - 10, "+10", "#ffffff", "26px");
        return;
      }

      if (note.getBounds().bottom >= this.playBottomY + 100) {
        note.destroy();
      }
    });

    this.badNotes.getChildren().forEach((bad) => {
      if (!bad.active) return;

      if (bad.y >= catchY && Math.abs(bad.x - this.uho.x) < 90) {
        if (this.protectMode) {
          this.repelBadNoteProtect(bad);
        } else if (this.electricMode) {
          this.repelBadNote(bad);
        } else {
          const px = bad.x;
          const py = bad.y;
          bad.destroy();
          this.showLifeLoss(px, py - 10);
          this.loseLife();
        }
        return;
      }

      if (bad.getBounds().bottom >= this.playBottomY + 100) {
        bad.destroy();
      }
    });

    this.bonusItems.getChildren().forEach((item) => {
      if (!item.active) return;

      if (item.y >= catchY && Math.abs(item.x - this.uho.x) < 90) {
        this.onBonusCaught(item);
        return;
      }

      if (item.getBounds().bottom >= this.playBottomY + 100) {
        this.onBonusMissed(item);
      }
    });


    this.bonusItems.getChildren().forEach((item) => {
      if (!item.active) return;

      if (item.getData("animElectricItem") === true) {
        const lastToggle = item.getData("animElectricToggleAt") || 0;

        if (this.time.now - lastToggle >= 45) {
          const nextKey = item.texture.key === "guitarelec1" ? "guitarelec2" : "guitarelec1";
          item.setTexture(nextKey);
          item.setScale(this.getBonusScale(nextKey));
          item.setData("animElectricToggleAt", this.time.now);
        }
      }
    });

    this.panels.getChildren().forEach((panel) => {
      if (!panel.active) return;

      if (panel.y >= catchY && Math.abs(panel.x - this.uho.x) < 110) {
        if (this.protectMode) {
          this.repelPanelProtect(panel);
        } else {
          this.onPanelCaught(panel);
        }
        return;
      }

      if (panel.getBounds().bottom >= this.playBottomY + 100) {
        this.onPanelMissed(panel);
      }
    });
  }
}