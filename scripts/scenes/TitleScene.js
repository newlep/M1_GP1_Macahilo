export default class TitleScene extends Phaser.Scene {
    constructor() {
      super({ key: "titleScene" });
    }
  
    preload() {
      // Load your background image and any other assets here
      this.load.image("mainbg", "./assets/backgrounds/mainbg.jpg");
    }
  
    create() {
      let bg = this.add.sprite(0, 0, "mainbg");
      bg.setOrigin(0, 0);
  
      let startText = this.add.text(100, 100, "Start Game");
      startText.setInteractive({ useHandCursor: true });
      startText.on("pointerdown", () => this.startButton());
  
      let creditsText = this.add.text(100, 200, "Credits");
      creditsText.setInteractive({ useHandCursor: true });
      creditsText.on("pointerdown", () => this.creditsButton());
    }
  
    startButton() {
      console.log("Starting Game");
      this.scene.start("GameScene");
    }
  
    creditsButton() {
      console.log("Showing Credits");
      this.scene.start("CreditsScene");
    }
  }
  