class world extends Phaser.Scene {
  constructor() 
  {
    super({ key: "world"});
    this.liveCount = 3;
    this.isDead = false;
  }

  // incoming data from scene below
  init(data) {
    this.playerPos = data.player;
  }

  preload() {
    this.load.atlas('right', 'assets/hiro walk.png',
                                 'assets/hiro walk.json')
    this.load.atlas('hiro attack', 'assets/hiro attack.png',
                                   'assets/hiro attack.json')
    this.load.atlas('down', 'assets/hiro front.png',
                                  'assets/hiro front.json')
    this.load.atlas('up', 'assets/hiro back.png',
                                 'assets/hiro back.json')
    this.load.atlas('snake', 'assets/snake.png',
                             'assets/snake.json')
    this.load.atlas('bat','assets/bat.png',
                          'assets/bat.json')

    // Step 1, load JSON
    this.load.tilemapTiledJSON("world","assets/Castaway.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("groundPng", "assets/Pipoya.png");
    //this.load.image("sea","assets/various.png");
    this.load.image("potionPng","assets/various.png");
    this.load.image("portalPng","assets/teleportTile.png");
    this.load.image("grassPng","assets/Grass-ground.png");
    this.load.image('heartPng','assets/heart.png');
  }

  create() {
    console.log("*** world scene");

    //Step 3 - Create the map from main
    let map = this.make.tilemap({key:'world'});
    
    //animation for Hiro
    this.anims.create({
      key:'left',
      frames: [
          {key:'right', frame:'walk 01'},
          {key:'right', frame:'walk 02'},
          {key:'right', frame:'walk 03'},
          {key:'right', frame:'walk 04'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'right',
      frames:[
          {key:'right', frame:'walk 05'},
          {key:'right', frame:'walk 06'},
          {key:'right', frame:'walk 07'},
          {key:'right', frame:'walk 08'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'down',
      frames:[
          {key:'down',frame:'hiro front 01'},
          {key:'down',frame:'hiro front 02'},
          {key:'down',frame:'hiro front 03'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'up',
      frames:[
          {key:'up',frame:'hiro back 01'},
          {key:'up',frame:'hiro back 02'},
          {key:'up',frame:'hiro back 03'},
      ],
      frameRate: 5,
      repeat: -1
  })

  this.anims.create({
    key:'leftAttack',
    frames:[
        {key:'hiro attack',frame:'hiro attack 01'},
        {key:'hiro attack',frame:'hiro attack 02'},
        {key:'hiro attack',frame:'hiro attack 03'},
        {key:'hiro attack',frame:'hiro attack 04'},
    ],
    frameRate: 12,
    repeat: -1
})

  this.anims.create({
  key:'idle',
  frames:[
      {key:'right', frame:'walk 01'},
      {key:'right', frame:'walk 02'},
  ],
  frameRate: 5,
  repeat: -1
})

  //anims for snake
  this.anims.create({
  key:'crawl',
  frames:[
      {key:'snake',frame:'snake 01'},
      {key:'snake',frame:'snake 02'},
      {key:'snake',frame:'snake 03'},
  ],
  frameRate: 3,
  repeat: -1
})

  //anims for bat
  this.anims.create({
  key:'fly',
  frames:[
      {key:'bat',frame:'bat 01'},
      {key:'bat',frame:'bat 02'},
  ],
  frameRate: 7,
  repeat: -1
})

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let groundTiles = map.addTilesetImage("Pipoya", "groundPng");
    let grassTiles = map.addTilesetImage("Grass-ground","grassPng",);
    let portalTiles = map.addTilesetImage("Teleport","portalPng");
    let potionTiles = map.addTilesetImage("various","potionPng");

    let tilesArray = [ groundTiles,grassTiles,portalTiles,potionTiles]

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer",tilesArray,0,0);
    this.waterLayer = map.createLayer("waterLayer",tilesArray,0,0);
    this.treesLayer = map.createLayer("treesLayer",tilesArray,0,0);
    this.itemLayer = map.createLayer("itemLayer",tilesArray,0,0);
    this.roomLayer = map.createLayer("roomLayer",tilesArray,0,0);
    this.potionLayer = map.createLayer("potionLayer",tilesArray,0,0);
    
    //health hearts
    this.heart1 = this.add.image(40,25,'heartPng').setScale(0.3).setScrollFactor(0);
    this.heart2 = this.add.image(75,25,'heartPng').setScale(0.3).setScrollFactor(0);
    this.heart3 = this.add.image(115,25,'heartPng').setScale(0.3).setScrollFactor(0);

    //load snake enemies object
    var snake01 = map.findObject("objectLayer",(obj) => obj.name === "snake01");
    var snake03 = map.findObject("objectLayer",(obj) => obj.name === "snake03");
    var snake04 = map.findObject("objectLayer",(obj) => obj.name === "snake04");
    var snake05 = map.findObject("objectLayer",(obj) => obj.name === "snake05");
    var snake06 = map.findObject("objectLayer",(obj) => obj.name === "snake06");
    var snake07 = map.findObject("objectLayer",(obj) => obj.name === "snake07");
    var snake08 = map.findObject("objectLayer",(obj) => obj.name === "snake08");
    var snake09 = map.findObject("objectLayer",(obj) => obj.name === "snake09");
    var snake10 = map.findObject("objectLayer",(obj) => obj.name === "snake10");

    this.snake1 = this.physics.add.group();

    this.snake1.create(snake01.x, snake01.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake03.x, snake03.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake04.x, snake04.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake05.x, snake05.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake06.x, snake06.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake07.x, snake07.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake08.x, snake08.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake09.x, snake09.y, 'snake').setScale(0.5).setSize(90,60);
    this.snake1.create(snake10.x, snake10.y, 'snake').setScale(0.5).setSize(90,60);//.play("crawl");

    this.snake1.children.iterate(snake => 
    {
      snake.play('crawl');
      snake.flipX = true;
    })

    //load bat enemies object
    var bat01 = map.findObject("objectLayer",(obj) => obj.name === "bat01");
    var bat02 = map.findObject("objectLayer",(obj) => obj.name === "bat02");
    var bat03 = map.findObject("objectLayer",(obj) => obj.name === "bat03");

    this.bat1 = this.physics.add.group();

    this.bat1.create(bat01.x, bat01.y, 'bat').setScale(0.5).setSize(90,60);
    this.bat1.create(bat02.x, bat02.y, 'bat').setScale(0.5).setSize(90,60);
    this.bat1.create(bat03.x, bat03.y, 'bat').setScale(0.5).setSize(90,60);

    this.bat1.children.iterate(bat => 
      {
        bat.play('fly');
      })

    // this.bat01 = this.physics.add.sprite(bat01.x, bat01.y, 'bat').setScale(0.5).setSize(90,60).play("fly");
    // this.bat02 = this.physics.add.sprite(bat02.x, bat02.y, 'bat').setScale(0.5).setSize(90,60).play("fly");
    // this.bat03 = this.physics.add.sprite(bat03.x, bat03.y, 'bat').setScale(0.5).setSize(90,60).play("fly");

    // create the this.playersprite
    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir
    ).setScale(0.5).setSize(50,100);

    // don't go out of the this.map
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.player.setCollideWorldBounds(true);

    // enable debug
    window.player = this.player;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    
    //collect Red
    this.potionLayer.setTileIndexCallback(1332, this.removeRed, this);
    
    //collect Green
    //this.potionLayer.setTileIndexCallback(212, this.removeGreen, this);

    // Add custom properties in Tiled called "mouintain" as bool
    this.waterLayer.setCollisionByProperty({grass: true});
    this.waterLayer.setCollisionByProperty({grass2: true});
    this.roomLayer.setCollisionByProperty({room: true});


    // What will collider with what layers
    this.physics.add.collider(this.waterLayer, this.player);
    this.physics.add.collider(this.roomLayer, this.player);
    this.physics.add.collider(this.potionLayer, this.player);

    this.time.addEvent({
      delay: 3000,
      callback: this.moveRightLeft,
      callbackScope: this,
      loop: false,
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.moveDownUpTween,
      callbackScope: this,
      loop: false,
    });

    //enemy snake follow player
    //left right movement
    this.time.addEvent({ delay: 2000, callback: this.moveLeft, callbackScope: this, loop: true});
    this.time.addEvent({ delay: 3000, callback: this.moveRight, callbackScope: this, loop: true});
    this.time.addEvent({ delay: 2000, callback: this.moveUp, callbackScope: this, loop: true});
    this.time.addEvent({ delay: 3000, callback: this.moveDown, callbackScope: this, loop: true});

    this.physics.add.overlap(this.player, this.snake1, this.minusHealth1, null, this);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } 
  
  /////////////////// end of create //////////////////////////////

  update() {

    // check for cave1
    if (
      this.player.x > 542.5 &&
      this.player.x < 579 &&
      this.player.y > 276 &&
      this.player.y < 319
    ) {
      this.room1();
    }

    // check for cave2
    if (
      this.player.x > 966 &&
      this.player.x < 993 &&
      this.player.y > 326 &&
      this.player.y < 330
    ) {
      this.room2();
    }

    // check for cave3
    if (
      this.player.x > 956 &&
      this.player.x < 986 &&
      this.player.y > 121 &&
      this.player.y < 134
    ) {
      this.room3();
    }

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
      this.player.anims.play("right", true); // walk left
      this.player.flipX = true; // flip the sprite to the left
      //console.log('left');
    }

    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
      this.player.anims.play("right", true);
      this.player.flipX = false; // use the original sprite looking to the right
      //console.log('right');
    }

    else if (this.spaceDown.isDown) { //this.cursors.left.isDown && 
        this.player.body.setVelocityX(0);
        this.player.body.setVelocityY(0);
        this.player.anims.play("leftAttack", true); // walk left
        //this.player.flipX = false; // flip the sprite to the left
    } 
    
    else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-200);
      this.player.anims.play("up", true);
      //console.log('up');
    } 
    
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(200);
      this.player.anims.play("down", true);
      //console.log('down');
    } 
    
    else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
      //console.log('idle');
    }
  }

  minusHealth1 (player, snake1)
  {
    if (this.spaceDown.isDown)
  {
    snake1.disableBody(true,true);
  } else if (this.spaceDown.isDown === false)
  {
    snake1.disableBody(true,true);
    this.liveCount = 1;
    this.cameras.main.shake(100);
  }
 
    if (this.liveCount === 2)
  {
      this.heart3.setVisible(true);
  } else if (this.liveCount === 1)
  {
    this.heart2.setVisible(false);
  } else if (this.liveCount === 0)
  {
    this.cameras.main.shake(200);
    this.heart1.setVisible(false);
    this.isDead = true;
  }
    if (this.isDead){
    console.log("Player Dies")
    this.time.delayCall(1000,function(){
      this.isDead = false
      this.liveCount = 3;
      this.scene.stop('world');
      this.scene.start('gameoverScene');
    },[], this);
    }
 }

   moveRightLeft() {
    console.log("moveDownUp tween");
    this.tweens.timeline
    ({
      targets: this.snake1.getChildren(this.snake01, this.snake03, this.snake04), //[this.snake01,this.snake03,this.snake04],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 180,}, {x: 120,},],
      flipX: true,
    });

    this.tweens.timeline
    ({
      targets: this.snake1.getChildren(this.snake05, this.snake09),//[this.snake05,this.snake09],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 480,}, {x: 530,},],
      flipX: true,
    });

    this.tweens.timeline
    ({
      targets: this.snake1.getChildren(this.snake06, this.snake08), //[this.snake06,this.snake08],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 600,}, {x: 680,},],
      flipX: true,
    });

    this.tweens.timeline
    ({
      targets: this.snake1.getChildren(this.snake07, this.snake10), // [this.snake07,this.snake10],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 880,}, {x: 960,},],
      flipX: true,
    });
  }

  moveDownUp() {
    console.log("moveDownUp tween");
    this.tweens.timeline
    ({
      targets: this.bat1.getChildren(this.bat01, this.bat04, this.bat06), //[this.bat01, this.bat04, this.bat06],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 80,},{ y: 160,},],
    });

    this.tweens.timeline
    ({
      targets: this.bat1.getChildren(this.bat02, this.bat03, this.bat05), //[this.bat02, this.bat03, this.bat05],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 570,},{ y: 650,},],
    });
  }

  removeRed(player, tile) 
    {
      console.log("remove red", tile.index);
      this.potionLayer.removeTileAt(tile.x, tile.y); // remove the item
      return false;
    }

  // removeGreen(player, potion) 
  //   {
  //     console.log("remove green", tile.index);
  //     this.itemLayer.removeTileAt(tile.x, tile.y); // remove the item
  //     return false;
  //   }

  //Function to jump to room1
  room1(player, tile) {
    console.log("room1 function");
    let playerPos = {};
    playerPos.x = 340;
    playerPos.y = 526;
    playerPos.dir = "up";
    this.scene.start("room1",{playerPos:playerPos});
  }

  //Function to jump to room2
  room2(player, tile) {
    console.log("room2 function");
    let playerPos = {};
    playerPos.x = 353;
    playerPos.y = 677;
    playerPos.dir = "up";
    this.scene.start("room2",{playerPos:playerPos});
  }

  //Function to jump to room2
  room3(player, tile) {
    console.log("room3 function");
    let playerPos = {};
    playerPos.x = 200;
    playerPos.y = 677;
    playerPos.dir = "up";
    this.scene.start("room3",{playerPos:playerPos});
  }

  } /////////////////// end of update //////////////////////////////

 //////////// end of class world ////////////////////////
