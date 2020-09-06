import Phaser from "phaser";
import carrotImg from "../assets/carrot.png";
import backgroundImg from "../assets/bg_layer1.png";

export default class Game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    
    preload() {
        this.load.image('background', backgroundImg);
        this.load.image("carrot", carrotImg);
    }
  
    create() {
        this.add.image(240, 320, 'background')
        const carrot = this.add.image(240, 240, "carrot");
  
        this.tweens.add({
            targets: carrot,
            y: 450,
            duration: 2000,
            ease: "Power2",
            yoyo: true,
            loop: -1
        });
    }
}