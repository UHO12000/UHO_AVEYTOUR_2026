export class AudioManager {
  constructor(game) {
    this.game = game;
    this.scene = null;

    this.menuMusic = new Audio("assets/audio/uho-melodie.mp3");
    this.menuMusic.loop = true;
    this.menuMusic.preload = "auto";
    this.menuMusic.volume = 0.55;

    this.soloMusic = new Audio("assets/audio/uho-solo.mp3");
    this.soloMusic.loop = false;
    this.soloMusic.preload = "auto";
    this.soloMusic.volume = 0.9;

    this.gameOverMusic = new Audio("assets/audio/gameover.mp3");
    this.gameOverMusic.loop = false;
    this.gameOverMusic.preload = "auto";
    this.gameOverMusic.volume = 0.8;

    this.boundScenes = new WeakSet();
    this.isUnlocked = false;
    this.soloTimeoutId = null;
    this.autoStartAttempted = false;
  }

  static get(game) {
    if (!game.__uhoAudioManager) {
      game.__uhoAudioManager = new AudioManager(game);
    }
    return game.__uhoAudioManager;
  }

  attachScene(scene) {
    this.scene = scene;
    this.bindUnlock(scene);
    return this;
  }

  bindUnlock(scene) {
    if (!scene || this.boundScenes.has(scene)) return;
    this.boundScenes.add(scene);

    const unlockOnly = async () => {
      await this.unlock();
    };

    scene.input?.on?.("pointerdown", unlockOnly);
    scene.input?.keyboard?.on?.("keydown", unlockOnly);
  }

  async unlock() {
    if (this.isUnlocked) return true;

    try {
      this.menuMusic.muted = true;
      await this.menuMusic.play();
      this.menuMusic.pause();
      this.menuMusic.currentTime = 0;
      this.menuMusic.muted = false;

      this.soloMusic.muted = true;
      await this.soloMusic.play();
      this.soloMusic.pause();
      this.soloMusic.currentTime = 0;
      this.soloMusic.muted = false;

      this.gameOverMusic.muted = true;
      await this.gameOverMusic.play();
      this.gameOverMusic.pause();
      this.gameOverMusic.currentTime = 0;
      this.gameOverMusic.muted = false;

      this.isUnlocked = true;
      return true;
    } catch (e) {
      console.warn("Déverrouillage HTMLAudio impossible :", e);
      return false;
    }
  }

  stopElement(el) {
    if (!el) return;
    el.pause();
    try {
      el.currentTime = 0;
    } catch (e) {}
  }

  async tryAutoStartMenuMusic() {
    if (this.autoStartAttempted) return;
    this.autoStartAttempted = true;

    try {
      if (!this.menuMusic.paused) return;
      await this.menuMusic.play();
      this.isUnlocked = true;
    } catch (e) {
      console.warn("Autoplay menu bloqué par le navigateur :", e);
    }
  }

  async startMenuLoopFromGesture() {
    await this.unlock();
    await this.playMenuMusic();
  }

  async playMenuMusic() {
    this.clearSoloTimer();
    this.stopElement(this.gameOverMusic);
    this.stopElement(this.soloMusic);

    try {
      if (!this.menuMusic.paused) return;
      await this.menuMusic.play();
      this.isUnlocked = true;
    } catch (e) {
      console.warn("Lecture menu impossible :", e);
    }
  }

  pauseMenuMusic() {
    this.menuMusic.pause();
  }

  stop(key) {
    if (key === "uho-melodie") this.stopElement(this.menuMusic);
    if (key === "uho-solo") this.stopElement(this.soloMusic);
    if (key === "gameover") this.stopElement(this.gameOverMusic);
  }

  stopAll() {
    this.clearSoloTimer();
    this.stopElement(this.menuMusic);
    this.stopElement(this.soloMusic);
    this.stopElement(this.gameOverMusic);
  }

  clearSoloTimer() {
    if (this.soloTimeoutId) {
      clearTimeout(this.soloTimeoutId);
      this.soloTimeoutId = null;
    }
  }

  playSolo(onComplete = null) {
    this.clearSoloTimer();
    this.menuMusic.pause();
    this.stopElement(this.gameOverMusic);
    this.stopElement(this.soloMusic);

    const durationMs = Math.max(100, Math.round((this.soloMusic.duration || 10) * 1000));

    this.soloMusic.play().catch((e) => {
      console.warn("Lecture du solo impossible :", e);
    });

    this.soloTimeoutId = setTimeout(() => {
      this.soloTimeoutId = null;
      this.stopElement(this.soloMusic);
      this.playMenuMusic();
      if (typeof onComplete === "function") onComplete();
    }, durationMs + 60);

    return durationMs;
  }

  stopSoloAndResumeMenu() {
    this.clearSoloTimer();
    this.stopElement(this.soloMusic);
    this.playMenuMusic();
  }

  async playGameOver() {
    this.clearSoloTimer();
    this.stopElement(this.menuMusic);
    this.stopElement(this.soloMusic);
    this.stopElement(this.gameOverMusic);

    try {
      await this.gameOverMusic.play();
      this.isUnlocked = true;
    } catch (e) {
      console.warn("Lecture game over impossible :", e);
    }
  }
}
