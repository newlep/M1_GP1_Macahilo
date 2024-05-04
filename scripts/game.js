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
        preload: preload,
        create: create,
        update: update
    }
};
let game = new Phaser.Game(config);

// Variables
let Background, platforms, platform, grass, lava, player,
cursors, jumpKey, coins, coin, pstones, pstone,
jumpSound;
let backgroundMusic;
let coinCount= 4;
let coinsCollectedcount = 0;
let coinsCollectedText = 0;


function preload ()
{
  //background
  this.load
    .image('background','./assets/backgrounds/mainbg.jpg', { frameWidth: 1920, frameHeight: 1080 })
  //obj
    .image('bomb', './assets/objects/mball.png')
    .image('coin', './assets/objects/gold.png')
    .image('powerstone', './assets/objects/stone.png')
  
  //platforms
    .image('grass', './assets/tiles/grass_middle.png')
    .image('grassL', './assets/tiles/grass_left.png')
    .image('grassR', './assets/tiles/grass_right.png')
    .image('lava','./assets/tiles/lava.png')

  //playerSprite
  .spritesheet('playeridle', './assets/characters/pinge/Idle.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerrun', './assets/characters/pinge/Waddling.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerjump', './assets/characters/pinge/Falling.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerhurt', './assets/characters/pinge/Hurt.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerdeath', './assets/characters/pinge/Ducking.png', 
  {frameWidth: 16, frameHeight: 16})

  //Audio
  .audio('backgroundMusic', './assets/audio/bgmusic.mp3')
  .audio('coinSound', './assets/audio/coin.mp3')
  .audio('runSound', './assets/audio/walk.mp3');
}

function create ()
{

  //============start create background=========

  const background = this.add.sprite(600, 300, 'background');
  background.displayWidth = game.config.width;
  background.displayHeight = game.config.height;

  //======bgm====
  
    backgroundMusic = this.sound.add('backgroundMusic', {volume: 0.4} ,{ loop: true });
    backgroundMusic.play();
  //create audio========
  this.coinSound = this.sound.add('coinSound');
  this.runSound = this.sound.add('runSound', {volume: 2});


  //==================start create platform===============
  platforms = this.physics.add.staticGroup();
  //set to bottom screen 600
  platforms.create(0, 550, 'grass').setScale(2).refreshBody();
  platforms.create(30, 550, 'grass').setScale(2).refreshBody();
  platforms.create(60, 550, 'grass').setScale(2).refreshBody();
  platforms.create(90, 550, 'grass').setScale(2).refreshBody();
  platforms.create(120, 550, 'grass').setScale(2).refreshBody();
  platforms.create(150, 550, 'grass').setScale(2).refreshBody();
  platforms.create(180, 550, 'grassR').setScale(2).refreshBody();

  //2nd
  platforms.create(240, 500, 'grassL').setScale(2).refreshBody();
  platforms.create(270, 500, 'grass').setScale(2).refreshBody();
  platforms.create(300, 500, 'grass').setScale(2).refreshBody();
  platforms.create(330, 500, 'grassR').setScale(2).refreshBody();

  //3rd
  platforms.create(420, 500, 'grassL').setScale(2).refreshBody();
  platforms.create(450, 500, 'grassR').setScale(2).refreshBody();
  platforms.create(470, 470, 'grassL').setScale(2).refreshBody();
  platforms.create(500, 470, 'grassR').setScale(2).refreshBody();

  //4th
  platforms.create(570, 450, 'grassL').setScale(2).refreshBody();
  platforms.create(600, 450, 'grassR').setScale(2).refreshBody();

  //5th
  platforms.create(500, 400, 'grassR').setScale(2).refreshBody();
  platforms.create(470, 400, 'grass').setScale(2).refreshBody();
  platforms.create(450, 400, 'grassL').setScale(2).refreshBody();

  //6th
  platforms.create(570, 350, 'grassL').setScale(2).refreshBody();
  platforms.create(600, 350, 'grassR').setScale(2).refreshBody();

  //7th
  platforms.create(650, 250, 'grassR').setScale(2).refreshBody();
  platforms.create(620, 250, 'grassL').setScale(2).refreshBody();

  //wall
  platforms.create(800, 450, 'grass').setScale(10,20).refreshBody();

  //lava
  lava = this.physics.add.image(460, 800, 'lava').setScale(20, 1.5).refreshBody().setCollideWorldBounds(true);
  
  
  //platforms.create(180, 600, 'lava').setScale().refreshBody();
  //^ COPY and CHANGE VALUES for easy access ^



  //========start create PLAYER CHARACTER=========
  //spawn coords
  player = this.physics.add.sprite(60, 500, 'playerrun');
  player.setBounce(0.1);
  player.setScale(1.5);
  player.setCollideWorldBounds(true);
  //anims
  this.anims.create({ key: 'idle', frames: [{ key: 'playeridle', frame: 1 }] });

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('playerrun', { start: 1, end: 6 }),
    frameRate: 10,
    repeat: 0
  });

  this.anims.create({ key: 'jump', frames: [{ key: 'playerjump', frame: 1 }] });

  this.anims.create({ key: 'hurt', frames: [{ key: 'playerhurt', frame: 1 }] });

  this.anims.create({ key: 'death', frames: [{ key: 'playeridle', frame: 1 }] });





  //backup
  // this.anims.create({
  //   key: 'jump',
  //   frames: this.anims.generateFrameNumbers('playerjump', { start: 1, end: 1 }),
  //   frameRate: 10,
  //   repeat: 0
  // });
  // this.anims.create({
  //   key: 'hurt',
  //   frames: this.anims.generateFrameNumbers('playerhurt', { start: 1, end: 1 }),
  //   frameRate: 20,
  //   repeat: 0
  // });
  // this.anims.create({
  //   key: 'death',
  //   frames: this.anims.generateFrameNumbers('playerdeath', { start: 1, end: 1 }),
  //   frameRate: 20,
  //   repeat: 0
  // });


  //=====================start create audio===============

  
 
  //=============start create controls=================
  cursors = this.input.keyboard.createCursorKeys();
  jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //==============start create objects=================
  pstone = this.physics.add.image(630 , 150, 'powerstone' );
  pstone.setScale(0.05);
  pstone.body.setBounce(1);
  pstone.setCollideWorldBounds(true);
  


  //============obj coin================
  coin = this.physics.add.group({
    key:'coin',
    repeat: coinCount,
    setXY: { x: 0, y: 0, stepX: 120}
  });
  coin.children.iterate(function (child) {
    //child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    child.setScale(0.020); // Set the scale to 0.5 (adjust as needed)
    child.y = Phaser.Math.Between(0, 400);
    child.x = Phaser.Math.Between(200, 700);
    child.setCollideWorldBounds(true);
  });
//bomb===========
     bomb = this.physics.add.image(config.width / 2, 0, 'bomb');
    bomb.setScale(.07);
    bomb.setBounce(1,1);
    bomb.setVelocity(200,200);
    bomb.setCollideWorldBounds(true);
    
    coinsCollected = this.add.text(config.width / 1.5, 20, 'Coins Collected: ', 
    { fontSize: '40px', fill: '#23FF00' , fontStyle: 'bold' , fontFamily: 'Courier New'}); // coins collected text

}

function update ()
{
  //collisions
  
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(coin, platforms);
  this.physics.add.collider(pstone, platforms);
  this.physics.add.collider(bomb, platforms,);
  this.physics.add.overlap(player, coin, coinCollect, null, this);
  this.physics.add.overlap(player, bomb, bombHit, null, this);
  this.physics.add.overlap(player, lava, bombHit, null, this);
  this.physics.add.overlap(player, pstone, checkWin, null, this);

  

  //player controls finally
  if (cursors.left.isDown){
    let velocityX = -200;
    player.setVelocityX(velocityX);
        player.anims.play('run', true);
        player.flipX = true;
  }else if (cursors.right.isDown) {
    let velocityX = 200;
    player.setVelocityX(velocityX);
        player.anims.play('run', true);
        player.flipX = false;
  } else {
    player.setVelocityX(0);
        player.anims.play('idle');
  }

  //jumping
  if (cursors.space.isDown && player.body.touching.down){
    player.setVelocityY(-180);
    player.anims.play('jump', true);
  } else if (!player.body.touching.down){
    player.anims.play('jump', true);
  }

  //walk sound
  if (cursors.left.isDown || cursors.right.isDown) {
    if (!this.runSound.isPlaying) {
        this.runSound.play();
    }
} else {
    // Stop the walking sound if the player is not walking
    this.runSound.stop();
}
}

  // coin collect
  function coinCollect(player, coin)
  {
    
    coin.disableBody(true, true); // remove coin
    this.coinSound.play();
    //sound here later ^
    coinsCollectedcount += 1;
    coinsCollectedText += 1;
    coinsCollected.setText('Coins Collected: '+ coinsCollectedText);


    //COLORS NOT WORKING
    //if (coins.countActive(true) < coinCount)
      //{
       // coin.enableBody(true, Phaser.Math.Between(0,config.width-10), 0, true, true);
      //}
     // if (coinsCollectedcount == 1) { player.setTint(0xff4040) }
      //if (coinsCollectedcount == 2) { player.setTint(0xffac40) }
      //if (coinsCollectedcount == 3) { player.setTint(0xfff240) }
      //if (coinsCollectedcount == 4) { player.setTint(0x67ff3d) }
     // if (coinsCollectedcount == 5) { player.setTint(0x4056ff) }
     // if (coinsCollectedcount == 6) { player.setTint(0x4b0082) }
     // if (coinsCollectedcount == 7) { player.setTint(0x8000de); coinsCollectedcount = 0}
  
      //if (coinsCollectedcount % 5 == 0) { player.setScale(player.scaleX * 1.1, player.scaleY * 1.1) }

  }

  // win or lose conditions

  function gameOver(player) {
    //play anim death
    player.anims.play('death', true);
    player.disableBody(true, true);

    //game over text
    let gameOverText = this.add.text(500, 200, 'Game Over\nScore: ' + coinsCollectedText, 
        { fontSize: '55px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier New', align: 'center' });
    gameOverText.setOrigin(0);
    

    // Prompt to start a new game
    let restartText = this.add.text(650, 350, 'Press Enter to Start a New Game', 
        { fontSize: '45px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Courier New', align: 'center' });
    restartText.setOrigin(0.5);
    

    // Event listener for Enter key
    let scene = this;
    this.input.keyboard.on('keydown-ENTER', function () {
        // Restart the game
        scene.scene.restart();
    });

    // Stop background music when the game is over
    if (backgroundMusic && backgroundMusic.isPlaying) {
        backgroundMusic.stop();
    }
  }

  function bombHit(player, bomb,){
    this.physics.pause();
    gameOver.call(this, player);
  }

  function Death(player, lava){
    this.physics.pause();
    gameOver.call(this, player);
  }
  function Victory(player, pstone) {
    checkWin.call(this, player);
}

// check pstone overlap 
function checkWin(player, pstone){
  this.physics.pause();

  //display win msg
      // Display congratulatory message
      let winText = this.add.text(650, 230, 'EVOLUTION TIIIIIIIME!!', 
      { fontSize: '15px', fill: '#FFD700', fontStyle: 'bold' , fontFamily: 'Courier New' , align: 'center' });
  winText.setOrigin(0.5);
  

  // Prompt to start a new game
  let restartText = this.add.text(650, 350, 'Press Enter to Start a New Game', 
  { fontSize: '55px', fill: '#ffffff', fontStyle: 'bold', fontFamiily: 'Courier New', align: 'center' });
  restartText.setOrigin(0.5);
  

  // Event listener for Enter key
  this.input.keyboard.on('keydown-ENTER', function () {
      // Restart the game
      this.scene.restart();
  }, this);

  // Player disappears!
  pstone.disableBody(true, true);

  // Stop background music when the game is won
  if (backgroundMusic && backgroundMusic.isPlaying) {
      backgroundMusic.stop();
  }
}