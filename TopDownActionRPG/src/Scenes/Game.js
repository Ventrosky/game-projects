import 'phaser';
//import logoImg from "../assets/logo.png";

export default class GameScene extends Phaser.Scene {
    constructor (key){
        super(key);
    }

    preload () {
    };

    create(){
        // resize listener
        this.events.on('resize', this.resize, this);
        // create tilemap
        this.createMap();
    };

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
  }
};