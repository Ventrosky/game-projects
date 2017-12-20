var Connect4 = Connect4 || {};

Connect4.game = new Phaser.Game(800,600, Phaser.AUTO);

Connect4.game.state.add('GameState', Connect4.GameState);
Connect4.game.state.start('GameState');
