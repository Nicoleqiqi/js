class room1 extends Phaser.Scene {
    constructor() {
        super({ key: 'room1' });
        
        // Put global variable here
    }


    init(data) {
        this.playerPos = data.playerPos;
    }

  preload() {
    this.load.atlas('crab','assets/crab.png',
                           'assets/crab.json')
    this.load.atlas('hiro walk', 'assets/hiro walk.png',
                                     'assets/hiro walk.json')
    this.load.atlas('hiro attack', 'assets/hiro attack.png',
                                     'assets/hiro attack.json')
    this.load.atlas('hiro front', 'assets/hiro front.png',
                                    'assets/hiro front.json')
    this.load.atlas('hiro back', 'assets/hiro back.png',
                                    'assets/hiro back.json')

    // Step 1, load JSON
    this.load.tilemapTiledJSON("room1","assets/Cave1.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("ground", "assets/Pipoya.png");
    //this.load.image("grass","assets/Grass-ground.png");
  }

  create() {
    console.log("*** room1 scene");

    //Step 3 - Create the map from main
    let map = this.make.tilemap({key:'room1'});
    
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

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let groundTiles = map.addTilesetImage("Pipoya", "ground");

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer", [groundTiles], 0, 0);
    this.wallLayer = map.createLayer("wallLayer",[groundTiles],0,0);
    this.itemLayer = map.createLayer("itemLayer",[groundTiles],0,0);

    // create the this.playersprite
    this.enemy1 = this.physics.add.sprite(450, 200, 'crab').setScale(1.7).setSize(40,40).play('move');

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir
    ).setScale(0.5).setSize(50,100);

    this.player.setCollideWorldBounds(true);
    window.player = this.player;

    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.delayOneSec,
      callbackScope: this,
      loop: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // get the tileIndex number in json, +1
    //mapLayer.setTileIndexCallback(11, this.room1, this);

    // Add custom properties in Tiled called "mouintain" as bool
    // What will collider with what layers
    this.wallLayer.setCollisionByProperty({caveWall: true});
    this.wallLayer.setCollisionByProperty({wall: true});
    this.wallLayer.setCollisionByProperty({room: true});

    this.physics.add.collider(this.wallLayer, this.player);

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // camera follow player
    //this.cameras.main.startFollow(this.player);

    // set bounds so the camera won't go outside the game world
    //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {
      //check for BlockA exit
    if (this.player.x > 270 && 
        this.player.x < 371 && 
        this.player.y > 550 
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
    } /////////////////// end of update //////////////////////////////
  
  // Function to jump to room1
  world(player, tile) {
    console.log("world function");
    
    let playerPos = {};
    playerPos.x = 556;
    playerPos.y = 353;
    playerPos.dir = "down";

    this.scene.start("world", { player: playerPos });
  }
}
