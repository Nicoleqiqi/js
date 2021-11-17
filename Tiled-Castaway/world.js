class world extends Phaser.Scene {
  constructor() {
    super({
      key: "world",
    });
  }

  // incoming data from scene below
  init(data) {
    this.playerPos = data.player;
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

    // Step 1, load JSON
    this.load.tilemapTiledJSON("world","assets/Castaway.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("groundPng", "assets/Pipoya.png");
    //this.load.image("sea","assets/various.png");
    this.load.image("potionPng","assets/various.png");
    this.load.image("portalPng","assets/teleportTile.png");
    this.load.image("grassPng","assets/Grass-ground.png");
  }

  create() {
    console.log("*** world scene");

    //Step 3 - Create the map from main
    let map = this.make.tilemap({key:'world'});
    
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
    frameRate: 5,
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

    // create the this.playersprite
    this.player = this.physics.add.sprite(50,150,'hiro walk').setScale(0.5).setSize(50,80);
    // don't go out of the this.map
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.player.setCollideWorldBounds(true);

    // this.player = this.physics.add.sprite(
    //   this.playerPos.x,
    //   this.playerPos.y,
    //   "down"
    //);

    // enable debug
    window.player = this.player;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // get the tileIndex number in json, +1
    // setTileIndexCallback
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

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {

    // check for room1
    if (
      this.player.x > 542.5 &&
      this.player.x < 579 &&
      this.player.y > 276 &&
      this.player.y < 319
    ) {
      this.room1();
    }

    // check for room2
    if (
      this.player.x > 966 &&
      this.player.x < 993 &&
      this.player.y > 326 &&
      this.player.y < 330
    ) {
      this.room2();
    }

    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
      this.player.anims.play("left", true); // walk left
      this.player.flipX = false; // flip the sprite to the left
      //console.log('left');
    }

    else if (this.spaceDown.isDown) { //this.cursors.left.isDown && 
        this.player.body.setVelocityX(-200);
        this.player.anims.play("leftAttack", true); // walk left
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

  // removeGreen(player, potion) 
  //   {
  //     console.log("remove green", tile.index);
  //     this.itemLayer.removeTileAt(tile.x, tile.y); // remove the item
  //     return false;
  //   }

  //Function to jump to room1
  room1(player, tile) {
    console.log("room1 function");
    this.scene.start("room1");
  }

  //Function to jump to room2
  room2(player, tile) {
    console.log("room2 function");
    this.scene.start("room2");
  }

  } /////////////////// end of update //////////////////////////////

 //////////// end of class world ////////////////////////
