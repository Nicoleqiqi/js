class room3 extends Phaser.Scene {
    constructor() {
        super({ key: 'room3' });
        
        // Put global variable here
    }

  init(data) {
    this.playerPos = data.playerPos;
}

  preload() {
    this.load.atlas('hiro walk', 'assets/hiro walk.png',
                                     'assets/hiro walk.json')
    this.load.atlas('hiro attack', 'assets/hiro attack.png',
                                     'assets/hiro attack.json')
    this.load.atlas('hiro front', 'assets/hiro front.png',
                                    'assets/hiro front.json')
    this.load.atlas('hiro back', 'assets/hiro back.png',
                                    'assets/hiro back.json')
    this.load.atlas('bat','assets/bat.png',
                          'assets/bat.json')

    // Step 1, load JSON
    this.load.tilemapTiledJSON("room3","assets/Cave3.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("groundPng", "assets/Pipoya.png");
    this.load.image("teleportPng","assets/teleportTile.png");
  }

  create() {
    console.log("*** room3 scene");

    let map = this.make.tilemap({key:'room3'});

    //animation for Hiro
    this.anims.create({
      key:'left',
      frames: [
          {key:'hiro walk', frame:'walk 01'},
          {key:'hiro walk', frame:'walk 02'},
          {key:'hiro walk', frame:'walk 03'},
          {key:'hiro walk', frame:'walk 04'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'right',
      frames:[
          {key:'hiro walk', frame:'walk 05'},
          {key:'hiro walk', frame:'walk 06'},
          {key:'hiro walk', frame:'walk 07'},
          {key:'hiro walk', frame:'walk 08'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'attack',
      frames:[
          {key:'hiro attack',frame:'hiro attack 01'},
          {key:'hiro attack',frame:'hiro attack 02'},
          {key:'hiro attack',frame:'hiro attack 03'},
          {key:'hiro attack',frame:'hiro attack 04'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'down',
      frames:[
          {key:'hiro front',frame:'hiro front 01'},
          {key:'hiro front',frame:'hiro front 02'},
          {key:'hiro front',frame:'hiro front 03'},
      ],
      frameRate: 6,
      repeat: -1
  })

  this.anims.create({
      key:'up',
      frames:[
          {key:'hiro back',frame:'hiro back 01'},
          {key:'hiro back',frame:'hiro back 02'},
          {key:'hiro back',frame:'hiro back 03'},
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
    let teleportTiles = map.addTilesetImage("Teleport", "teleportPng");

    let tilesArray = [ groundTiles,teleportTiles]

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer",tilesArray,0,0);
    this.plantsLayer = map.createLayer("plantsLayer",tilesArray,0,0);
    this.wallLayer = map.createLayer("wallLayer",tilesArray,0,0);
    this.teleportLayer = map.createLayer("teleportLayer",tilesArray,0,0);

    //load bat enemies object
    var bat01 = map.findObject("objectLayer",(obj) => obj.name === "bat01");
    var bat02 = map.findObject("objectLayer",(obj) => obj.name === "bat02");
    var bat03 = map.findObject("objectLayer",(obj) => obj.name === "bat03");

    //load bat enemies
    this.bat01 = this.physics.add.sprite(bat01.x, bat01.y, 'bat').setScale(0.5).setSize(90,60).play("fly");
    this.bat02 = this.physics.add.sprite(bat02.x, bat02.y, 'bat').setScale(0.5).setSize(90,60).play("fly");
    this.bat03 = this.physics.add.sprite(bat03.x, bat03.y, 'bat').setScale(0.5).setSize(90,60).play("fly");

    // create the this.playersprite
    //this.player = this.physics.add.sprite(200,677,'hiro walk').setScale(0.5).setSize(50,100);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // create the this.playersprite
    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir
    ).setScale(0.5).setSize(50,100);

    this.player.setCollideWorldBounds(true);
    window.player = this.player;

    this.time.addEvent({
      delay: 3000,
      callback: this.moveDownUp,
      callbackScope: this,
      loop: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // What will collider with what layers
    this.wallLayer.setCollisionByProperty({cave3: true});

    this.physics.add.collider(this.wallLayer, this.player);

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {
    //check for BlockA exit
    if (this.player.x > 200 && 
       this.player.x < 233 && 
       this.player.y > 454 
      ) {
       this.world();
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

  moveDownUp() {
    console.log("moveDownUp");
    this.tweens.timeline
    ({
      targets: [this.bat01, this.bat02],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 237,},{ y: 280,},],
    });
    this.tweens.timeline
    ({
      targets: [this.bat03],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 70,},{ y: 150,},],
    });
  }

    removeRed(player, tile) 
    {
      console.log("remove red", tile.index);
      this.potionLayer.removeTileAt(tile.x, tile.y); // remove the item
      return false;
    }
  
  // Function to jump to room1
  world(player, tile) {
    console.log("world function");
    
    let playerPos = {};
    playerPos.x = 970;
    playerPos.y = 166;
    playerPos.dir = "down";

    this.scene.start("world", { player: playerPos }); 
  }
}
