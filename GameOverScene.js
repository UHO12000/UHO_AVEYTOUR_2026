import { AudioManager } from "./AudioManager.js";
import { supabase } from "./supabase.js";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  audioManager() {
    return AudioManager.get(this.game).attachScene(this);
  }

  preload() {
    // --------------------------------------------------
    // PERSONNAGE
    // --------------------------------------------------

    this.load.image(
      "uhotriste",
      "assets/player/uhotriste.png"
    );

    this.load.image(
      "uho-ref",
      "assets/player/uho.png"
    );

    // --------------------------------------------------
    // NIVEAUX
    // Même ordre que dans LoadingScene
    // --------------------------------------------------

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
  }

  create(data) {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#081a33");

    this.audioManager().playGameOver();

    // --------------------------------------------------
    // DONNEES DE LA PARTIE
    // --------------------------------------------------

    const safeNumber = (value, fallback) =>
      Number.isFinite(value) ? value : fallback;

    const finalScore = safeNumber(
      data?.score,
      0
    );

    const rawLastLevel = safeNumber(
      data?.lastLevel,
      1
    );

    const rawLastCaughtPanelLevel = safeNumber(
      data?.lastCaughtPanelLevel,
      rawLastLevel
    );

    const lastLevel = Phaser.Math.Clamp(
      rawLastLevel,
      1,
      this.levels.length
    );

    const lastCaughtPanelLevel = Phaser.Math.Clamp(
      rawLastCaughtPanelLevel,
      1,
      this.levels.length
    );

    // --------------------------------------------------
    // NOM DU NIVEAU
    // Utilisé uniquement pour Supabase
    // --------------------------------------------------

    const niveauNom =
      this.levels[lastCaughtPanelLevel - 1]?.mapName ||
      `niveau-${lastCaughtPanelLevel}`;

    // --------------------------------------------------
    // POSITION DU PERSONNAGE
    // --------------------------------------------------

    const playSize = width;

    const topHudHeight = Math.floor(
      (height - playSize) / 2
    );

    const playBottomY =
      topHudHeight + playSize;

    const uhoY =
      playBottomY - 140;

    // --------------------------------------------------
    // UHO TRISTE
    // --------------------------------------------------

    const refFrame =
      this.textures
        .get("uho-ref")
        .getSourceImage();

    const targetUhoWidth =
      refFrame.width * 0.4;

    const targetUhoHeight =
      refFrame.height * 0.4;

    const uhoTriste = this.add
      .image(
        width / 2,
        uhoY,
        "uhotriste"
      )
      .setOrigin(0.5)
      .setDisplaySize(
        targetUhoWidth,
        targetUhoHeight
      );

    this.uhoTriste = uhoTriste;

    const uhoTop =
      uhoTriste.y -
      uhoTriste.displayHeight / 2;

    // --------------------------------------------------
    // CARTE
    // --------------------------------------------------

    const map = this.add
      .image(
        width / 2,
        0,
        `map-niv${lastLevel}`
      )
      .setOrigin(0.5);

    const mapTopLimit = 46;
    const reservedBeforeUho = 170;

    const mapBottomLimit =
      uhoTop -
      reservedBeforeUho;

    const availableMapHeight =
      Math.max(
        60,
        mapBottomLimit -
          mapTopLimit
      );

    const mapScale = Math.min(
      (width * 0.76) /
        map.width,

      (availableMapHeight * 0.88) /
        map.height
    );

    map.setScale(mapScale);

    map.setPosition(
      width / 2,
      mapTopLimit +
        availableMapHeight / 2 -
        16
    );

    // --------------------------------------------------
    // PANNEAU DU DERNIER NIVEAU
    // --------------------------------------------------

    const panel = this.add
      .image(
        width / 2,
        map.y +
          map.displayHeight / 2 +
          30,
        `panel-niv${lastCaughtPanelLevel}`
      )
      .setOrigin(0.5);

    panel.setScale(0.16);

    // --------------------------------------------------
    // GAME OVER
    // --------------------------------------------------

    const gameOverText =
      this.add.text(
        width / 2,
        uhoTop - 125,
        "PERDU!",
        {
          fontFamily: "Courier",
          fontSize: "34px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#081a33",
          strokeThickness: 6,
          align: "center"
        }
      )
      .setOrigin(0.5);

    gameOverText.setResolution(1);
    gameOverText.setDepth(5);

    // --------------------------------------------------
    // SCORE
    // --------------------------------------------------

    const scoreText =
      this.add.text(
        width / 2,
        gameOverText.y + 34,
        `SCORE : ${finalScore}`,
        {
          fontFamily: "Arial",
          fontSize: "22px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#081a33",
          strokeThickness: 5,
          align: "center"
        }
      )
      .setOrigin(0.5);

    scoreText.setDepth(5);

    // --------------------------------------------------
    // CHAMP PSEUDO
    // --------------------------------------------------

    const input =
      document.createElement("input");

    input.type = "text";
    input.maxLength = 15;
    input.placeholder = "Ton pseudo";
    input.autocomplete = "off";
    input.spellcheck = false;

    input.style.position = "absolute";
    input.style.zIndex = "1000";
    input.style.boxSizing = "border-box";

    input.style.width = "220px";
    input.style.height = "38px";

    input.style.background = "#ffffff";
    input.style.color = "#081a33";

    input.style.border =
      "3px solid #ffe066";

    input.style.borderRadius = "4px";

    input.style.fontFamily = "Arial";
    input.style.fontSize = "18px";
    input.style.fontWeight = "bold";

    input.style.textAlign = "center";
    input.style.outline = "none";

    document.body.appendChild(input);

    this.pseudoInput = input;

    // --------------------------------------------------
    // POSITIONNEMENT DU CHAMP
    // --------------------------------------------------

    const positionInput = () => {
      if (
        !input ||
        !input.parentNode
      ) {
        return;
      }

      const canvas =
        this.game.canvas;

      const rect =
        canvas.getBoundingClientRect();

      const scaleX =
        rect.width / width;

      const scaleY =
        rect.height / height;

      const inputWidth = 220;
      const inputHeight = 38;

      const gameX =
        width / 2;

      const gameY =
        scoreText.y + 40;

      input.style.left =
        `${rect.left +
          gameX * scaleX -
          (inputWidth * scaleX) / 2}px`;

      input.style.top =
        `${rect.top +
          gameY * scaleY -
          (inputHeight * scaleY) / 2}px`;

      input.style.width =
        `${inputWidth * scaleX}px`;

      input.style.height =
        `${inputHeight * scaleY}px`;

      input.style.fontSize =
        `${18 * scaleX}px`;
    };

    positionInput();

    this.scale.on(
      "resize",
      positionInput
    );

    // --------------------------------------------------
    // BOUTON ENREGISTRER
    // --------------------------------------------------

    const saveButton =
      this.add.text(
        width / 2,
        scoreText.y + 78,
        "ENREGISTRER MON SCORE",
        {
          fontFamily: "Arial",
          fontSize: "15px",
          color: "#081a33",
          backgroundColor: "#ffe066",
          fontStyle: "bold",
          padding: {
            left: 10,
            right: 10,
            top: 7,
            bottom: 7
          },
          align: "center"
        }
      )
      .setOrigin(0.5);

    saveButton.setDepth(10);

    saveButton.setInteractive({
      useHandCursor: true
    });

    // --------------------------------------------------
    // MESSAGE TEMPORAIRE
    // --------------------------------------------------

    const statusText =
      this.add.text(
        width / 2,
        saveButton.y + 32,
        "",
        {
          fontFamily: "Arial",
          fontSize: "15px",
          color: "#ffe066",
          fontStyle: "bold",
          stroke: "#081a33",
          strokeThickness: 4,
          align: "center",
          wordWrap: {
            width: width - 30
          }
        }
      )
      .setOrigin(0.5);

    statusText.setDepth(10);

    // --------------------------------------------------
    // TABLEAU DES SCORES
    // MASQUE AU DEPART
    // --------------------------------------------------

    const leaderboardContainer =
      this.add.container(
        width / 2,
        uhoY - 50
      );

    leaderboardContainer.setDepth(9);
    leaderboardContainer.setVisible(false);

    // --------------------------------------------------
    // FOND DU TABLEAU
    // --------------------------------------------------

    const leaderboardBg =
      this.add.rectangle(
        0,
        0,
        width * 0.88,
        270,
        0x0b2340,
        0.97
      )
      .setOrigin(0.5);

    leaderboardBg.setStrokeStyle(
      3,
      0xffe066,
      1
    );

    // --------------------------------------------------
    // COUPES AUTOUR DU TITRE
    // --------------------------------------------------

    const trophyLeft =
      this.add.text(
        -112,
        -105,
        "🏆",
        {
          fontFamily: "Arial",
          fontSize: "20px"
        }
      )
      .setOrigin(0.5);

    const trophyRight =
      this.add.text(
        112,
        -105,
        "🏆",
        {
          fontFamily: "Arial",
          fontSize: "20px"
        }
      )
      .setOrigin(0.5);

    // --------------------------------------------------
    // TITRE TOP 10
    // --------------------------------------------------

    const leaderboardTitle =
      this.add.text(
        0,
        -105,
        "TOP 10 SCORES",
        {
          fontFamily: "Arial",
          fontSize: "24px",
          color: "#ffe066",
          fontStyle: "bold",
          stroke: "#081a33",
          strokeThickness: 4,
          align: "center"
        }
      )
      .setOrigin(0.5);

    // --------------------------------------------------
    // LISTE DES SCORES
    // --------------------------------------------------

    const leaderboardText =
      this.add.text(
        0,
        20,
        "Chargement...",
        {
          fontFamily: "Courier",
          fontSize: "17px",
          color: "#ffffff",
          fontStyle: "bold",
          stroke: "#081a33",
          strokeThickness: 2,
          align: "center",
          lineSpacing: 2
        }
      )
      .setOrigin(0.5);

    leaderboardContainer.add([
      leaderboardBg,
      trophyLeft,
      trophyRight,
      leaderboardTitle,
      leaderboardText
    ]);

    this.leaderboardContainer =
      leaderboardContainer;

    this.leaderboardText =
      leaderboardText;

    // --------------------------------------------------
    // ENREGISTREMENT SUPABASE
    // --------------------------------------------------

    saveButton.on(
      "pointerdown",
      async () => {
        const pseudo =
          input.value.trim();

        // ----------------------------------------------
        // VERIFICATION
        // ----------------------------------------------

        if (!pseudo) {
          statusText.setColor(
            "#ff6666"
          );

          statusText.setText(
            "Entre ton pseudo !"
          );

          input.focus();

          return;
        }

        if (pseudo.length < 2) {
          statusText.setColor(
            "#ff6666"
          );

          statusText.setText(
            "Pseudo trop court."
          );

          input.focus();

          return;
        }

        // ----------------------------------------------
        // DESACTIVATION PENDANT L'ENVOI
        // ----------------------------------------------

        saveButton.disableInteractive();

        saveButton.setText(
          "ENREGISTREMENT..."
        );

        statusText.setColor(
          "#ffe066"
        );

        statusText.setText(
          "Envoi du score..."
        );

        try {
          const {
            data: insertedData,
            error
          } = await supabase
            .from("scores")
            .insert({
              pseudo: pseudo,
              score: finalScore,
              niveau_nom: niveauNom
            })
            .select();

          // --------------------------------------------
          // ERREUR SUPABASE
          // --------------------------------------------

          if (error) {
            console.error(
              "Erreur Supabase :",
              error
            );

            statusText.setColor(
              "#ff6666"
            );

            statusText.setText(
              "Erreur lors de l'enregistrement."
            );

            saveButton.setText(
              "ENREGISTRER MON SCORE"
            );

            saveButton.setInteractive({
              useHandCursor: true
            });

            return;
          }

          // --------------------------------------------
          // SCORE ENREGISTRE
          // --------------------------------------------

          console.log(
            "Score enregistré :",
            insertedData
          );

          // UHO triste disparaît
          this.uhoTriste.setVisible(false);

          // TOP 10 apparaît
          this.leaderboardContainer.setVisible(
            true
          );

          // Aucun message jaune supplémentaire
          statusText.setText("");

          // Confirmation dans le bouton
          saveButton.setText(
            "SCORE ENREGISTRÉ"
          );

          input.disabled = true;

          saveButton.disableInteractive();

          // Chargement du classement
          await this.loadLeaderboard();

        } catch (error) {
          console.error(
            "Erreur inattendue :",
            error
          );

          statusText.setColor(
            "#ff6666"
          );

          statusText.setText(
            "Impossible d'enregistrer le score."
          );

          saveButton.setText(
            "ENREGISTRER MON SCORE"
          );

          saveButton.setInteractive({
            useHandCursor: true
          });
        }
      }
    );

    // --------------------------------------------------
    // RETOUR MENU
    // --------------------------------------------------

    const replayText =
      this.add.text(
        width / 2,
        uhoTriste.y +
          uhoTriste.displayHeight / 2 +
          18,
        "RETOUR MENU",
        {
          fontFamily: "Arial",
          fontSize: "16px",
          color: "#ffe066",
          fontStyle: "bold",
          stroke: "#081a33",
          strokeThickness: 4
        }
      )
      .setOrigin(0.5);

    replayText.setDepth(10);

    this.tweens.add({
      targets: replayText,
      alpha: {
        from: 1,
        to: 0.35
      },
      duration: 650,
      yoyo: true,
      repeat: -1
    });

    replayText.setInteractive({
      useHandCursor: true
    });

    replayText.on(
      "pointerdown",
      () => {
        this.scene.start(
          "MenuScene"
        );
      }
    );

    replayText.on(
      "pointerover",
      () => {
        replayText.setScale(1.08);
      }
    );

    replayText.on(
      "pointerout",
      () => {
        replayText.setScale(1);
      }
    );

    // --------------------------------------------------
    // NETTOYAGE DU CHAMP HTML
    // --------------------------------------------------

    this.events.once(
      Phaser.Scenes.Events.SHUTDOWN,
      () => {
        if (this.pseudoInput) {
          this.pseudoInput.remove();
          this.pseudoInput = null;
        }

        this.scale.off(
          "resize",
          positionInput
        );
      }
    );
  }

  // --------------------------------------------------
  // CHARGEMENT DU TOP 10
  // --------------------------------------------------

  async loadLeaderboard() {
    if (!this.leaderboardText) {
      return;
    }

    this.leaderboardText.setText(
      "Chargement..."
    );

    try {
      const {
        data,
        error
      } = await supabase
        .from("scores")
        .select("pseudo, score")
        .order("score", {
          ascending: false
        })
        .limit(10);

      if (error) {
        console.error(
          "Erreur classement Supabase :",
          error
        );

        this.leaderboardText.setText(
          "Classement indisponible"
        );

        return;
      }

      if (!data || data.length === 0) {
        this.leaderboardText.setText(
          "Aucun score enregistré"
        );

        return;
      }

      // ------------------------------------------------
      // AFFICHAGE DES SCORES EXISTANTS UNIQUEMENT
      // ------------------------------------------------

      const lines = data.map(
        (entry, index) => {
          const pseudo =
            String(
              entry.pseudo || "Joueur"
            )
              .slice(0, 13)
              .padEnd(13, " ");

          const score =
            String(
              entry.score ?? 0
            )
              .padStart(5, " ");

          const rank =
            String(index + 1)
              .padStart(2, " ");

          return `${rank}. ${pseudo} ${score}`;
        }
      );

      this.leaderboardText.setText(
        lines.join("\n")
      );

    } catch (error) {
      console.error(
        "Erreur classement :",
        error
      );

      this.leaderboardText.setText(
        "Classement indisponible"
      );
    }
  }
}