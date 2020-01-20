import 'phaser';
import Player from '../Sprites/Player';
import Portal from '../Sprites/Portal';

export default class GameScene extends Phaser.Scene {
    constructor (key){
        super(key);
    }

    preload () {
    };

    create(){
        // resize listener
        this.events.on('resize', this.resize, this);

        // listen input
        this.cursors = this.input.keyboard.createCursorKeys();

        // create tilemap
        this.createMap();
        //create player
        this.createPlayer();
        // create portal
        this.createPortal();

        //add collisions
        this.addCollisions();

        // update camera
        this.cameras.main.startFollow(this.player);
    };

    update(){
        this.player.update(this.cursors);
    }

    addCollisions(){
        this.physics.add.collider(this.player, this.blockedLayer);
    }

    createPlayer(){
        this.map.findObject('Player', (obj) => {
            console.log(obj);
            if(obj.type === 'StartingPosition')
                this.player = new Player(this, obj.x, obj.y);
        });
        
    }

    createPortal(){
        this.map.findObject('Portal', (obj) => {
            console.log(obj);
            this.portal = new Portal(this, obj.x, obj.y);
        });
    }

    resize(width, heigth){
        width = width || this.sys.game.width;
        heigth = heigth || this.sys.game.heigth;
        this.cameras.resize(width, heigth);
    }

    createMap () {
        // create tilemap
        this.map = this.make.tilemap({ key: 'level1' });
        // add tileset image
        this.tiles = this.map.addTilesetImage('RPGpack_sheet');
        // create layers
        this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
        this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0);
        this.blockedLayer.setCollisionByExclusion([-1]);
    }
};