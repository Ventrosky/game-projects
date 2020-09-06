import Phaser from 'phaser';
import carrotImg from '../assets/carrot.png';
import backgroundImg from '../assets/bg_layer1.png';
import platformImg from '../assets/ground_grass.png';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    this.load.image('background', backgroundImg);
    this.load.image('platform', platformImg);
    this.load.image('carrot', carrotImg);
  }

  create() {
    this.add.image(240, 320, 'background');

    const platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; i += 1) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = platforms.create(x, y, 'platform');
      platform.scale = 0.5;

      const { body } = platform;
      body.updateFromGameObject();
    }

    const carrot = this.add.image(240, 240, 'carrot');

    this.tweens.add({
      targets: carrot,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1,
    });
  }
}
