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
    //.image('grass', '')
    //.image('lava','')

  //playerSprite
  .spritesheet('playeridle', './assets/characters/pinge/Idle.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerrun', './assets/characters/pinge/Run.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerjump', './assets/characters/pinge/Jump.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerhurt', './assets/characters/pinge/Damage.png', 
  {frameWidth: 16, frameHeight: 16})
  this.load.spritesheet('playerdeath', './assets/characters/pinge/Dead.png', 
  {frameWidth: 16, frameHeight: 16})

  //Audio
  .audio('backgroundMusic', './assets/audio/bgmusic.mp3');
}

function create ()
{

  //============start create background=========

  const background = this.add.sprite(600, 300, 'background');
  background.displayWidth = game.config.width;
  background.displayHeight = game.config.height;

  //==================start create platform===============
  platforms = this.physics.add.staticGroup();
  //set to bottom screen 600
  platforms.create(60, 600, 'grass').setScale().refreshBody();
  platforms.create(0, 500, 'grass').setScale().refreshBody();
  platforms.create(180, 600, 'lava').setScale().refreshBody();
  //^ COPY and CHANGE VALUES for easy access ^



  //========start create PLAYER CHARACTER=========
  //spawn coords
  player = this.physics.add.sprite(60, 500, 'playerrun');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  //anims
  this.anims.create({ key: 'idle', frames: [{ key: 'playeridle', frame: 1 }] });

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('playerrun', { start: 1, end: 14 }),
    frameRate: 60,
    repeat: 0
  });
  this.anims.create({
    key: 'jump',
    frames: this.anims.generateFrameNumbers('playerjump', { start: 0, end: 11 }),
    frameRate: 10,
    repeat: 0
  });
  this.anims.create({
    key: 'hurt',
    frames: this.anims.generateFrameNumbers('playerhurt', { start: 0, end: 3 }),
    frameRate: 20,
    repeat: 0
  });
  this.anims.create({
    key: 'death',
    frames: this.anims.generateFrameNumbers('playerdeath', { start: 0, end: 6 }),
    frameRate: 20,
    repeat: 0
  });


  //=====================start create audio===============

  
 
  //=============start create controls=================
  cursors = this.input.keyboard.createCursorKeys();
  jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  //==============start create objects=================
  pstone = this.physics.add.staticSprite(100, 700, 'powerstone' );
  pstone.setScale(0.5);

  //============obj coin================
  coin = this.physics.add.group({
    key:'coin',
    repeat: coinCount,
    setXY: { x: 0, y: 0, stepX: 120}
  });
  coin.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.8, 1));
    child.setScale(0.09); // Set the scale to 0.5 (adjust as needed)
    child.y = Phaser.Math.Between(0, 600);
    child.x = Phaser.Math.Between(100, config.width - 10);
  });

     bomb = this.physics.add.image(config.width / 2, 0, 'bomb');
    bomb.setScale(.07);
    bomb.setBounce(1,1);
    bomb.setVelocity(200,200);
    bomb.setCollideWorldBounds(true);
    
    coinsCollected = this.add.text(config.width / 1.5, 20, 'Coins Collected: ', 
    { fontSize: '40px', fill: '#FFD700' , fontStyle: 'bold' , fontFamily: 'tahoma'}); // coins collected text
    coinsCollected.setShadow(2, 2, '#f890e7', 3, true, true);

}

function update ()
{
  //collisions
  
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(coin, platforms);
  this.physics.add.collider(bomb, platforms,);
  this.physics.add.overlap(player, coin, coinCollect, null, this);
  this.physics.add.overlap(player, bomb, bombHit, null, this);
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
    player
    .setVelocityY(-400)
    .anims.play('jump', true);
  } else if (!player.body.touching.down){
    player.anims.play('jump', true);
  }
}

  // coin collect
  function coinCollect(player, coin)
  {
    coin.disableBody(true, true); // remove coin
    //sound here later ^
    coinsCollectedcount += 1;
    coinsCollectedText += 1;
    coinsCollected.setText('Coins Collected: '+ coinsCollectedText);

    if (coin.countActive(true) < coinCount)
      {
        coin.enableBody(true, Phaser.Math.Between(0,config.width-10), 0, true, true);
      }
      if (coinsCollectedcount == 1) { player.setTint(0xff4040) }
      if (coinsCollectedcount == 2) { player.setTint(0xffac40) }
      if (coinsCollectedcount == 3) { player.setTint(0xfff240) }
      if (coinsCollectedcount == 4) { player.setTint(0x67ff3d) }
      if (coinsCollectedcount == 5) { player.setTint(0x4056ff) }
      if (coinsCollectedcount == 6) { player.setTint(0x4b0082) }
      if (coinsCollectedcount == 7) { player.setTint(0x8000de); coinsCollectedcount = 0}
  
      if (coinsCollectedcount % 5 == 0) { player.setScale(player.scaleX * 1.1, player.scaleY * 1.1) }

  }

  // win or lose conditions

  function gameOver(player) {
    //play anim death
    player.anims.play('death', true);
    player.disableBody(true, true);

    //game over text
    let gameOverText = this.add.text(500, 200, 'Game Over\nScore: ' + coinsCollectedText, 
        { fontSize: '50px', fill: '#FFD700', fontStyle: 'bold', fontFamily: 'tahoma', align: 'center' });
    gameOverText.setOrigin(0);
    gameOverText.setShadow(2, 2, '#f890e7', 3, true, true);

    // Prompt to start a new game
    let restartText = this.add.text(650, 350, 'Press Enter to Start a New Game', 
        { fontSize: '35px', fill: '#89cff0', fontStyle: 'bold', fontFamily: 'tahoma', align: 'center' });
    restartText.setOrigin(0.5);
    restartText.setShadow(3, 3, '#f890e7', 3, true, true);

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

  function bombHit(player, bomb){
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
      let winText = this.add.text(650, 230, 'You found a Stardrop!\nYour mind is filled with thoughts of...\n[Your Favorite Thing]\nMade by: lars / koh', 
      { fontSize: '35px', fill: '#FFD700', fontStyle: 'bold' , fontFamily: 'tahoma' , align: 'center' });
  winText.setOrigin(0.5);
  winText.setShadow(2, 2, '#f890e7', 3, true, true);

  // Prompt to start a new game
  let restartText = this.add.text(650, 350, 'Press Enter to Start a New Game', 
  { fontSize: '35px', fill: '#89cff0', fontStyle: 'bold', fontFamiily: 'tahoma', align: 'center' });
  restartText.setOrigin(0.5);
  restartText.setShadow(3, 3, '#f890e7', 3, true, true);

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