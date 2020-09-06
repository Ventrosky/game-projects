import Phaser from "phaser";
import carrotImg from "./assets/carrot.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("carrot", carrotImg);
}

function create() {
  const carrot = this.add.image(400, 150, "carrot");

  this.tweens.add({
    targets: carrot,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}
