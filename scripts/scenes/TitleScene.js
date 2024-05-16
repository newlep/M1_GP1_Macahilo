class TitleScene extends Phaser.Scene {
    constructor() {
      super('TitleScene');
    }
  
    preload() {
      // Load title image and button assets
      //TITLE IMAGE IS CREDITS NLNG 
      this.load.image('titleImage', 'assets/images/credits.png');
      this.load.image('playButton', 'assets/images/start.png');
    }
  
    create() {
      // Add title image
      const credits = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'titleImage');
      credits.setScale(0.5)
            // Make button interactive (optional: add hover effect)
            credits.setInteractive();
            credits.on('pointerover', () => playButton.setAlpha(0.8));
            credits.on('pointerout', () => playButton.setAlpha(1.0));
        
            // Handle button click to start game.js scene
            credits.on('pointerdown', () => {
              this.scene.start('CreditsScene'); // Replace with actual scene name
            });
      // Create play button
      const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'playButton');
      playButton.setScale(0.5)
      // Make button interactive (optional: add hover effect)
      playButton.setInteractive();
      playButton.on('pointerover', () => playButton.setAlpha(0.8));
      playButton.on('pointerout', () => playButton.setAlpha(1.0));
  
      // Handle button click to start game.js scene
      playButton.on('pointerdown', () => {
        this.scene.start('BootScene'); // Replace with actual scene name
      });
    }
  }
  
TitleScene;
  