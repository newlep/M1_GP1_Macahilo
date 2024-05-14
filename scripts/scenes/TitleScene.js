class TitleScene extends Phaser.Scene {
    constructor() {
      super('TitleScene');
    }
  
    preload() {
      // Load title image and button assets
      this.load.image('titleImage', 'path/to/your/title.png');
      this.load.image('playButton', 'path/to/your/play_button.png');
    }
  
    create() {
      // Add title image
      this.add.image(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'titleImage');
  
      // Create play button
      const playButton = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'playButton');
  
      // Make button interactive (optional: add hover effect)
      playButton.setInteractive();
      playButton.on('pointerover', () => playButton.setAlpha(0.8));
      playButton.on('pointerout', () => playButton.setAlpha(1.0));
  
      // Handle button click to start game.js scene
      playButton.on('pointerdown', () => {
        this.scene.start('GameScene'); // Replace with actual scene name
      });
    }
  }
  
  export default TitleScene;
  