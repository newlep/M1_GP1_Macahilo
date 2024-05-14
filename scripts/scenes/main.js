import TitleScene from './TitleScene.js';
import GameScene from './game.js';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [TitleScene] // Add TitleScene to scene list
};

const game = new Phaser.Game(config);
