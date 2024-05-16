class BootScene extends Phaser.Scene {

    constructor(){
        super('BootScene');
    }

    preload(){
        this.load.image('logo', './assets/images/logo.png');
    }

    create() {
        this.add.text(20,20,"Loading Game...");
        this.scene.start("GameScene1");
    }
}