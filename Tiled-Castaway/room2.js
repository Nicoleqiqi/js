class room2 extends Phaser.Scene {
    constructor() {
        super({ key: 'room2' });
        
        // Put global variable here
    }


    init(data) {}
    // {
    //     this.player = data.player
    //     this.inventory = data.inventory
    // }

  preload() {
    this.load.atlas('fire','assets/fire.png',
                            'assets/fire.json')
    this.load.atlas('hiro walk', 'assets/hiro walk.png',
                                     'assets/hiro walk.json')
    this.load.atlas('hiro attack', 'assets/hiro attack.png',
                                     'assets/hiro attack.json')
    this.load.atlas('hiro front', 'assets/hiro front.png',
                                    'assets/hiro front.json')
    this.load.atlas('hiro back', 'assets/hiro back.png',
                                    'assets/hiro back.json')

    // Step 1, load JSON
    this.load.tilemapTiledJSON("room2","assets/Cave2.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("ground", "assets/Pipoya.png");
    this.load.image("potion","assets/various.png");
  }

  create() {
    console.log("*** room2 scene");

    let map = this.make.tilemap({key:'room2'});

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

    //animation for crab
    this.anims.create({
      key:'move',
      frames: [
          {key:'crab', frame:'crab 01'},
          {key:'crab', frame:'crab 02'},
          {key:'crab', frame:'crab 03'},
      ],
      frameRate: 4,
      repeat: -1
  })

    // set the boundaries of our game world
    // this.physics.world.bounds.width = this.groundLayer.width;
    // this.physics.world.bounds.height = this.groundLayer.height;
    
    //animation for crab
    this.anims.create({
      key:'burn',
      frames: [
          {key:'fire', frame:'fire 01'},
          {key:'fire', frame:'fire 02'},
          {key:'fire', frame:'fire 03'},
      ],
      frameRate: 4,
      repeat: -1
  })

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let groundTiles = map.addTilesetImage("Pipoya", "ground");
    let potionTiles = map.addTilesetImage("various","potion");

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer", [groundTiles], 0, 0);
    this.wallLayer = map.createLayer("wallLayer",[groundTiles],0,0);
    this.itemLayer = map.createLayer("itemLayer",[groundTiles],0,0);
    this.potionLayer = map.createLayer("potionLayer",[potionTiles],0,0);


    // create the this.playersprite
    this.enemy2 = this.physics.add.sprite(220, 250, 'fire').setScale(1.3).setSize(40,40).play('burn');
    this.player = this.physics.add.sprite(353,677,'hiro walk').setScale(0.5).setSize(50,80);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.player.setCollideWorldBounds(true);
    window.player = this.player;

    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.delayOneSec,
      callbackScope: this,
      loop: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // get the tileIndex number in json, +1
    //mapLayer.setTileIndexCallback(11, this.room1, this);

    //collect Red
    this.potionLayer.setTileIndexCallback(180, this.removeRed, this);


    // What will collider with what layers
    this.wallLayer.setCollisionByProperty({wall: true});
    this.itemLayer.setCollisionByProperty({tree: true});

    this.physics.add.collider(this.wallLayer, this.player);
    this.physics.add.collider(this.itemLayer, this.player);
    this.physics.add.collider(this.potionLayer, this.player);

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // camera follow player
    //this.cameras.main.startFollow(this.player);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {
    //check for BlockA exit
    if (this.player.x > 300 && 
      this.player.x < 403 && 
      this.player.y > 677 
      ) {
      this.world();
    }

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
      this.player.anims.play("left", true); // walk left
      this.player.flipX = false; // flip the sprite to the left
      //console.log('left');
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
      this.player.anims.play("left", true);
      this.player.flipX = true; // use the original sprite looking to the right
      //console.log('right');
    } else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-200);
      this.player.anims.play("up", true);
      //console.log('up');
    } else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(200);
      this.player.anims.play("down", true);
      //console.log('down');
    } else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
      //console.log('idle');
    }
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
    playerPos.x = 973;
    playerPos.y = 380;

    this.scene.start("world", { player: playerPos }); 
  }
}
