import Phaser from 'phaser';
import Game from './scenes/Game';
import GameOver from './scenes/GameOver';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 480,
  height: 640,
  scene: [Game, GameOver],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200,
      },
      debug: false,
    },
  },
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);
