import Phaser from 'phaser';
import Game from './scenes/Game';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 480,
  height: 640,
  scene: Game,
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
