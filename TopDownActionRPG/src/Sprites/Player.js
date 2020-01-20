import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'morty', 2);
        this.scene = scene;
        //enable physics
        this.scene.physics.world.enable(this);
        // add player
        this.scene.add.existing(this);
        //scale
        this.setScale(2);
    }

    update(cursors){
        this.setVelocity(0);
        //check key up down
        if (cursors.up.isDown){
            this.setVelocityY(-150);
        } else if (cursors.down.isDown){
            this.setVelocityY(150);
        }
        //check left up rigth
        if (cursors.left.isDown){
            this.setVelocityX(-150);
        } else if (cursors.right.isDown){
            this.setVelocityX(150);
        }
    }
}