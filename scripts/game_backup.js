const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let game = new Phaser.Game(config);
let Background, platforms, platform, iceBlock, player,
cursors, jumpKey, fruits, fruit, coins, coin, stardrops, stardrop,
jumpSound;

let fruitCount = 4;
let fruitsCollectedcount = 0;
let fruitsCollectedText = 0;


const centerX = game.config.width / 2;

// Preload all game assets
function preload() {
  // Background
  this.load.image('mountain', './assets/backgrounds/mainbg.jpg', { frameWidth: 1920, frameHeight: 1080 });
  // Platforms
  this.load.image('snow', './assets/tiles/snowplatform.png');
  this.load.image('ice', './assets/tiles/iceplatform.png');
  this.load.image('iceblock', './assets/tiles/ice.png');
  this.load.image('block', './assets/tiles/platform block.png');
  // Objects
  this.load.image('bomb', './assets/objects/mball.png');
  this.load.image('stardrop', './assets/objects/gold.png');
  this.load.image('fruit', './assets/objects/stone.png');
  //Player Sprites
  this.load.spritesheet('playeridle', './assets/characters/pinge/Idle.png', 
    {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('playerrun', './assets/characters/pinge/Run.png', 
    {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('playerjump', './assets/characters/pinge/Jump.png', 
    {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('playerhurt', './assets/characters/pinge/Damage.png', 
    {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet('playerdeath', './assets/characters/pinge/Dead.png', 
    {frameWidth: 16, frameHeight: 16});

  
  // Audio
  this.load.audio('backgroundMusic', './assets/audio/bgmusic.mp3');
  //this.load.audio('jumpSound', 'Assets/Audio/jumpSound.mp3');
  //this.load.audio('runSound', 'Assets/Audio/runSound.mp3');
  //this.load.audio('deathSound', 'Assets/Audio/deathSound.mp3');
  //this.load.audio('stardropSound', 'Assets/Audio/stardropSound.mp3');
  //this.load.audio('fruitCollectSound', 'Assets/Audio/fruitCollectSound.mp3');
  //this.load.audio('bombBounceSound', 'Assets/Audio/bombBounceSound.mp3');
}

function create() {
  // Background
  const background = this.add.sprite(centerX, 300, 'mountain');
  background.displayWidth = game.config.width;
  background.displayHeight = game.config.height;

  // Player animations
  const playerAnims = this.anims;
  playerAnims.create({ key: 'idle', frames: [{ key: 'playeridle', frame: 1 }] });

  playerAnims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('playerrun', { start: 1, end: 14 }),
    frameRate: 60,
    repeat: 0
  });
  playerAnims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('playerjump', { start: 0, end: 11 }),
    frameRate: 10,
    repeat: 0
  });
  playerAnims.create({
    key: 'hurt',
    frames: this.anims.generateFrameNumbers('playerhurt', { start: 0, end: 3 }),
    frameRate: 20,
    repeat: 0
  });
  playerAnims.create({
    key: 'death',
    frames: this.anims.generateFrameNumbers('playerdeath', { start: 0, end: 6 }),
    frameRate: 20,
    repeat: 0
  });
  //test if hindi to mag work mag cry ako
  cursors = this.input.keyboard.createCursorKeys();
  
  // Jump key (space bar) for jumping
    jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Background music
  const backgroundMusic = this.sound.add('backgroundMusic', { loop: true });
  backgroundMusic.play();

  // Sounds
  //this.runSound = this.sound.add('runSound');
  //this.jumpSound = this.sound.add('jumpSound');
  //this.deathSound = this.sound.add('deathSound');
  // Platforms
  const platforms = this.physics.add.staticGroup();
  platforms.create(90, 600, 'snow').setScale().refreshBody();
  platforms.create(410, 580, 'snow').setScale().refreshBody();
  platforms.create(810, 580, 'snow').setScale().refreshBody();
  platforms.create(1130, 600, 'snow').setScale().refreshBody();
  platforms.create(100, 450, 'snow').setScale(.75).refreshBody();
  platforms.create(300, 420, 'block').setScale(.50).refreshBody();
  platforms.create(400, 360, 'block').setScale(.50).refreshBody();
  platforms.create(900, 300, 'block').setScale(.50).refreshBody();
  platforms.create(1100, 130, 'block').setScale(.50).refreshBody();
  platforms.create(950, 130, 'block').setScale(.50).refreshBody();
  platforms.create(800, 130, 'block').setScale(.50).refreshBody();
  platforms.create(650, 130, 'block').setScale(.50).refreshBody();
  platforms.create(100, 130, 'block').setScale(.50).refreshBody();

  // Player
  player = this.physics.add.sprite(50, 490, 'playerrun');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setScale(3);

  // Fruits
  const fruits = this.physics.add.group({
    key: 'fruit',
    repeat: fruitCount,
    setXY: { x: 0, y: 0, stepX: 135 }
  });
  fruits.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    child.setScale(0.09); // Set the scale to 0.5 (adjust as needed)
    child.y = Phaser.Math.Between(0, 600);
    child.x = Phaser.Math.Between(100, config.width - 10);
  });

  // Bomb
  const bomb = this.physics.add.image(config.width / 2, 0, 'bomb');
  bomb.setScale(.07);
  bomb.setBounce(1, 1);
  bomb.setVelocity(200, 200);
  bomb.setCollideWorldBounds(true);

  // Text
  const fruitCollectedText = this.add.text(config.width / 1.5, 20, 'Fruits Collected: ', { fontSize: '40px', fill: '#FFD700', fontStyle: 'bold', fontFamily: 'tahoma' }); // fruits collected text
  fruitCollectedText.setShadow(2, 2, '#f890e7', 3, true, true);


this.physics.add.collider(player, platforms);
this.physics.add.collider(fruits, platforms);
this.physics.add.collider(player, bomb, function () {
  hitBomb();
}, null);
this.physics.add.overlap(player, fruits, collectFruit, null);

}

function collectFruit(player, fruit) {
  fruit.destroy();
  fruitCollected += 1;
  fruitCollectedText.setText('Fruits Collected: ' + fruitCollected);
  fruitCollectSound.play();
}

function hitBomb() {
  player.setTint(0xff0000);
  player.anims.play('hurt', true);
  player.setVelocityY(-200);
  deathSound.play();
  this.time.addEvent({ delay: 1000, callback: resetGame, callbackScope: this });
}

function resetGame() {
  player.setTint(0xffffff);
  player.anims.play('idle', true);
  player.setPosition(50, 490);
  bomb.setPosition(config.width / 2, 0);
  fruits.children.iterate(function (child) {
    child.enableBody(true);
  });
}

function update() {
if (cursors.left.isDown) {
        let velocityX = -160;
        if (player.body.touching.down && (player.body.blocked.down || player.body.touching.down)) {
           velocityX = -80; // Reduced velocity on ice
            
        }
        player.setVelocityX(velocityX);
        player.anims.play('run', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        let velocityX = 160;
        if (player.body.touching.down && (player.body.blocked.down || player.body.touching.down)) {

                velocityX = 80; // Reduced velocity on ice
            
        }
        player.setVelocityX(velocityX);
        player.anims.play('run', true);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
        player.anims.play('idle');
    }

  if (cursors.space.isDown && player.body.touching.down) {
    player.setVelocityY(-350);
    jumpSound.play();
  }
      // Jump Logic
      if (cursors.space.isDown && player.body.touching.down) {
        player.setVelocityY(-280);
        player.anims.play('jump', true);
       // this.jumpSound.play(); // Use this.jumpSound to refer to the jump sound
    } else if (!player.body.touching.down) {
        player.anims.play('jump', true);
    }    


}

