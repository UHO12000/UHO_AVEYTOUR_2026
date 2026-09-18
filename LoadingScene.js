export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super("LoadingScene");
  }

  preload() {
    // Le chargement est lancé dans create()
    // afin que l'écran de chargement soit affiché
    // avant le début du chargement réel.
  }

  create() {
    const { width, height } = this.scale;

    // --------------------------------------------------
    // FOND
    // --------------------------------------------------

    this.cameras.main.setBackgroundColor("#071a2b");

    // --------------------------------------------------
    // TITRE
    // --------------------------------------------------

    // --------------------------------------------------
// TITRE ANIMÉ
// --------------------------------------------------

this.loadingTitle = this.add.text(
  width / 2,
  55,
  "CHARGEMENT",
  {
    fontFamily: "Arial",
    fontSize: "28px",
    fontStyle: "bold",
    color: "#ffffff",
    align: "center"
  }
).setOrigin(0.5);

// Animation des pointillés
this.loadingDots = 0;

this.loadingDotsTimer = this.time.addEvent({
  delay: 400,
  loop: true,
  callback: () => {
    this.loadingDots = (this.loadingDots + 1) % 4;

    this.loadingTitle.setText(
      "CHARGEMENT" + ".".repeat(this.loadingDots)
    );
  }
});

    // --------------------------------------------------
    // CARTE AVEYRON
    // --------------------------------------------------

    const map = this.add.image(
      width / 2,
      height / 2,
      "aveytour-map"
    );

    map.setOrigin(0.5);

    const maxMapWidth = width * 0.55;
    const maxMapHeight = height * 0.55;

    const scaleX = maxMapWidth / map.width;
    const scaleY = maxMapHeight / map.height;
    const mapScale = Math.min(scaleX, scaleY);

    map.setScale(mapScale);

    // --------------------------------------------------
    // CERCLE DE CHARGEMENT
    // --------------------------------------------------

    const centerX = width / 2;
    const centerY = height / 2;

    const radius = Math.min(width, height) * 0.28;

    // Cercle extérieur
    this.loadingCircle = this.add.graphics();

    this.loadingCircle.lineStyle(
      8,
      0xffffff,
      0.20
    );

    this.loadingCircle.strokeCircle(
      centerX,
      centerY,
      radius
    );

    // Cercle de progression
    this.loadingProgress = this.add.graphics();

 
    // --------------------------------------------------
    // FONCTION DESSIN DU CERCLE
    // --------------------------------------------------

    const drawProgress = (value) => {
      this.loadingProgress.clear();

      this.loadingProgress.lineStyle(
        10,
        0xffd43b,
        1
      );

      const startAngle = -Math.PI / 2;
      const endAngle =
        startAngle + Math.PI * 2 * value;

      if (value > 0) {
        this.loadingProgress.beginPath();

        this.loadingProgress.arc(
          centerX,
          centerY,
          radius,
          startAngle,
          endAngle,
          false
        );

        this.loadingProgress.strokePath();
      }


    };

    // Initialisation
    drawProgress(0);

    // --------------------------------------------------
    // PROGRESSION RÉELLE DU CHARGEMENT
    // --------------------------------------------------

    this.load.on("progress", (value) => {
      drawProgress(value);
    });

    // --------------------------------------------------
    // FIN DU CHARGEMENT
    // --------------------------------------------------

// --------------------------------------------------
// FIN DU CHARGEMENT
// --------------------------------------------------

this.load.once("complete", () => {
  drawProgress(1);

  // Arrête l'animation des pointillés
  if (this.loadingDotsTimer) {
    this.loadingDotsTimer.remove(false);
    this.loadingDotsTimer = null;
  }

  // Petite pause avant de lancer le jeu
  this.time.delayedCall(100, () => {
    this.scene.start("PlayScene");
  });
});

    // ==================================================
    // CHARGEMENT DES ASSETS DU JEU
    // ==================================================

    // --------------------------------------------------
    // PLAYER / HUD
    // --------------------------------------------------

    this.load.image(
      "uho",
      "assets/player/uho.png"
    );

    this.load.image(
      "uhoelec1",
      "assets/player/uho-elec1.png"
    );

    this.load.image(
      "uhoelec2",
      "assets/player/uho-elec2.png"
    );

    this.load.image(
      "uhoprotect",
      "assets/player/uho-protect.png"
    );

    this.load.image(
      "coeur",
      "assets/vies/coeur.png"
    );

    // --------------------------------------------------
    // PADS TACTILES
    // --------------------------------------------------

    this.load.image(
      "padU",
      "assets/pads/padU.png"
    );

    this.load.image(
      "padO",
      "assets/pads/padO.png"
    );

    this.load.image(
      "pouceU",
      "assets/pads/pouceU.png"
    );

    this.load.image(
      "pouceO",
      "assets/pads/pouceO.png"
    );

    // --------------------------------------------------
    // NOTES
    // --------------------------------------------------

    this.load.image(
      "rouge",
      "assets/notes/rouge.png"
    );

    this.load.image(
      "jaune",
      "assets/notes/jaune.png"
    );

    this.load.image(
      "bleue",
      "assets/notes/bleue.png"
    );

    this.load.image(
      "verte",
      "assets/notes/verte.png"
    );

    // --------------------------------------------------
    // FAUSSES NOTES
    // --------------------------------------------------

    this.load.image(
      "fn-rouge",
      "assets/fausses-notes/fn-rouge.png"
    );

    this.load.image(
      "fn-jaune",
      "assets/fausses-notes/fn-jaune.png"
    );

    this.load.image(
      "fn-verte",
      "assets/fausses-notes/fn-verte.png"
    );

    this.load.image(
      "fn-bleue",
      "assets/fausses-notes/fn-bleue.png"
    );

    // --------------------------------------------------
    // ITEMS / BONUS
    // --------------------------------------------------

    this.load.image(
      "aligot",
      "assets/items/aligot.png"
    );

    this.load.image(
      "roquefort",
      "assets/items/roquefort.png"
    );

    this.load.image(
      "vin",
      "assets/items/vin.png"
    );

    this.load.image(
      "moules",
      "assets/items/moules.png"
    );

    this.load.image(
      "viande",
      "assets/items/viande.png"
    );

    this.load.image(
      "soupe",
      "assets/items/soupe.png"
    );

    this.load.image(
      "farcous",
      "assets/items/farcous.png"
    );

    this.load.image(
      "charcut",
      "assets/items/charcut.png"
    );

    this.load.image(
      "gateau",
      "assets/items/gateau.png"
    );

    this.load.image(
      "guitarelec",
      "assets/items/guitarelec.png"
    );

    this.load.image(
      "guitarelec1",
      "assets/items/guitarelec1.png"
    );

    this.load.image(
      "guitarelec2",
      "assets/items/guitarelec2.png"
    );

    // --------------------------------------------------
    // AUDIO
    // --------------------------------------------------

    this.load.audio(
      "uho-melodie",
      "assets/audio/uho-melodie.mp3"
    );

    this.load.audio(
      "uho-solo",
      "assets/audio/uho-solo.mp3"
    );

    this.load.audio(
      "gameover",
      "assets/audio/gameover.mp3"
    );

    // ==================================================
    // 26 NIVEAUX AVEYRON
    // ==================================================

    this.levels = [
      { mapName: "steradegonde", panelName: "steradegonde" },
      { mapName: "ceyrac", panelName: "ceyrac" },
      { mapName: "montbazens", panelName: "montbazens" },
      { mapName: "requista", panelName: "requista" },
      { mapName: "pontdesalars", panelName: "pontdesalars" },
      { mapName: "marcillac", panelName: "marcillac" },
      { mapName: "arvieu", panelName: "arvieu" },
      { mapName: "staffrique", panelName: "staffrique" },
      { mapName: "compolibat", panelName: "compolibat" },
      { mapName: "sallescuran", panelName: "sallescuran" },
      { mapName: "boissepenchot", panelName: "boissepenchot" },
      { mapName: "severac", panelName: "severac" },
      { mapName: "monastere", panelName: "monastere" },
      { mapName: "tremouilles", panelName: "tremouilles" },
      { mapName: "galgan", panelName: "galgan" },
      { mapName: "stcomedolt", panelName: "stcomedolt" },
      { mapName: "stchely", panelName: "stchely" },
      { mapName: "letheron", panelName: "letheron" },
      { mapName: "laissac", panelName: "laissac" },
      { mapName: "lavernhe", panelName: "lavernhe" },
      { mapName: "cransac", panelName: "cransac" },
      { mapName: "millau", panelName: "millau" },
      { mapName: "privezac", panelName: "privezac" },
      { mapName: "stfelix", panelName: "stfelix" },
      { mapName: "peyrusse", panelName: "peyrusse" },
      { mapName: "combelles", panelName: "combelles" }
    ];

    // --------------------------------------------------
    // CARTES DES NIVEAUX
    // --------------------------------------------------

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

    // --------------------------------------------------
    // DÉCORS DE FOND
    // --------------------------------------------------

    this.decorFiles = [
      "D1-steradegonde.png",
      "D2-ceyrac.png",
      "D3-montbazens.png",
      "D4-requista.png",
      "D5-pontdesalars.png",
      "D6-marcillac.png",
      "D7-arvieu.png",
      "D8-staffrique.png",
      "D9-compolibat.png",
      "D10-sallescuran.png",
      "D11-boissepenchot.png",
      "D12-severac.png",
      "D13-monastere.png",
      "D14-tremouilles.png",
      "D15-galgan.png",
      "D16-stcomedolt.png",
      "D17-stchely.png",
      "D18-letheron.png",
      "D19-laissac.png",
      "D20-lavernhe.png",
      "D21-cransac.png",
      "D22-millau.png",
      "D23-privezac.png",
      "D24-stfelix.png",
      "D25-peyrusse.png",
      "D26-combelles.png"
    ];

    this.decorFiles.forEach((fileName, index) => {
      this.load.image(
        `decor-niv${index + 1}`,
        `assets/background/decors/${fileName}`
      );
    });

    // --------------------------------------------------
    // LANCEMENT DU CHARGEMENT
    // --------------------------------------------------

    this.load.start();
  }
}