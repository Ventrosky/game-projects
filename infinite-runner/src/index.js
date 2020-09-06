import Phaser from "phaser";
import Game from './scenes/Game.js'

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 480,
  height: 640,
  scene: Game,
};

const game = new Phaser.Game(config);

