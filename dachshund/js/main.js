var DogGame = DogGame || {};

DogGame.game = new Phaser.Game(1024,640, Phaser.AUTO);

DogGame.game.state.add('GameState', DogGame.GameState);
DogGame.game.state.add('MenuState', DogGame.MenuState);
DogGame.game.state.start('MenuState');