// eslint-disable-next-line max-len
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["sprite"] }] */
import Phaser from 'phaser';
import playerStandImg from '../assets/dachshund_stand.png';
import playerJumpImg from '../assets/dachshund_jump.png';
import backgroundImg from '../assets/bg_layer1.png';
import platformImg from '../assets/ground_grass.png';
import boneImg from '../assets/bone.png';
import jumpSfx from '../assets/sfx/phaseJump1.ogg';
import Bone from '../game/Bone';

export default class Game extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init() {
    this.bonesCollected = 0;
    this.facing = 1;
  }

  preload() {
    this.load.image('background', backgroundImg);
    this.load.image('platform', platformImg);
    this.load.image('dog-stand', playerStandImg);
    this.load.image('dog-jump', playerJumpImg);
    this.load.image('bone', boneImg);

    this.load.audio('jump', jumpSfx);// 'src/assets/sfx/phaseJump1.ogg');

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(240, 320, 'background')
      .setScrollFactor(1, 0);

    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; i += 1) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      const platform = this.platforms.create(x, y, 'platform');
      platform.scale = 0.5;

      const { body } = platform;
      body.updateFromGameObject();
    }

    this.player = this.physics.add.sprite(240, 320, 'dog-stand')
      .setScale(0.5);

    this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    // this.player.body.setSize(this.player.width / 2, this.player.height, this.player.width);
    // this.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(100, 150, 100, 300));
    this.player.body.setSize(
      this.player.width * 0.7,
      this.player.height,
      false,
    ); // .setCircle(this.player.width / 2);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.bones = this.physics.add.group({
      classType: Bone,
    });

    this.physics.add.collider(this.platforms, this.bones);

    this.physics.add.overlap(this.player, this.bones, this.handleCollectBone, undefined, this);

    const style = { color: '#000', fontSize: 24 };
    this.bonesCollectedText = this.add.text(240, 10, 'Bones: 0', style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update() {
    this.platforms.children.iterate((child) => {
      const platform = child;
      const { scrollY } = this.cameras.main;

      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        this.addBoneAbove(platform);
      }
    });

    this.bones.children.iterate((child) => {
      const bone = child;
      const { scrollY } = this.cameras.main;

      if (bone.y >= scrollY + 700) {
        this.bones.killAndHide(bone);
        this.physics.world.disableBody(bone.body);
      }
    });

    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.player.setVelocityY(-305);
      this.player.setTexture('dog-jump');
      this.sound.play('jump');
    }

    const vy = this.player.body.velocity.y;
    if (vy > 0 && this.player.texture.key !== 'dog-stand') {
      this.player.setTexture('dog-stand');
    }

    const direction = Math.sign(this.player.body.velocity.x);
    if (direction !== 0 && this.facing !== direction) {
      this.facing *= -1;
      this.player.flipX = this.facing === 1;
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start('game-over');
    }
  }

  /**
  * @param {Phaser.GameObjects.Sprite} sprite
  */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  /**
   *
   * @param {Phaser.GameObjects.Sprite} sprite
   */
  addBoneAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    /** @type {Phaser.Physics.Arcade.Sprite} */
    const bone = this.bones.get(sprite.x, y, 'bone');

    bone.setActive(true);
    bone.setVisible(true);

    bone.body.checkCollision.up = false;
    bone.body.checkCollision.left = false;
    bone.body.checkCollision.right = false;

    this.add.existing(bone);

    bone.body.setSize(bone.width, bone.height);

    this.physics.world.enable(bone);

    return bone;
  }

  /**
   *
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Bone} bone
   */
  handleCollectBone(player, bone) {
    this.bones.killAndHide(bone);
    this.physics.world.disableBody(bone.body);

    this.bonesCollected += 1;
    this.bonesCollectedText.text = `Bones: ${this.bonesCollected}`;
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; i += 1) {
      const platform = platforms[i];
      if (platform.y > bottomPlatform.y) {
        bottomPlatform = platform;
      }
    }
    return bottomPlatform;
  }
}
