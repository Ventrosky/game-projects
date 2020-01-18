import 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor (key){
        super(key);
    }

    preload () {
        //load tilemap
        this.load.tilemapTiledJSON('level1','assets/tilemaps/level1.json');
        // load spritesheet
        this.load.spritesheet('RPGpack_sheet','assets/images/RPGpack_sheet.png', { frameWidth: 64, frameHeight: 64});
    };

    create(){
        this.scene.start('Game');
    };


};