var DogGame = DogGame || {};

DogGame.MenuState = {

    init: function(highscore, muted){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.world.setBounds(0,0,1024,640);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.cursor = this.game.input.keyboard.createCursorKeys();

    },

    preload: function(){
        this.load.image('title','images/title.png');
        this.load.image('bkg','images/menuBkg.png');
        this.load.image('xmas','images/play.png');

        this.load.audio('intro',['audio/intro.mp3','audio/intro.ogg']);
        this.load.audio('jump',['audio/jump.mp3','audio/jump.ogg']);
        this.load.audio('up',['audio/up.mp3','audio/up.ogg']);
    },



    create: function(){
        this.ground = this.add.sprite(0,0,'bkg');
        this.title = this.add.sprite(-300,-300,'title');
        this.title.anchor.setTo(0.5);
        this.xmas = this.add.sprite(this.game.width/2,-600,'xmas');
        this.xmas.anchor.setTo(0.5);
        this.jump = this.add.audio('jump');
        this.up = this.add.audio('up');
        this.song = this.add.audio('intro');
        this.song.loopFull();
        this.input.onDown.add(function () {
            this.song.stop();
            this.game.state.start('GameState');      
        }, this);
        this.jump.play();
        this.tween = this.game.add.tween(this.title).to( { x: (this.game.width/2), y: (this.game.height/2) }, 1800, Phaser.Easing.Bounce.Out, true);
        this.tween.onComplete.add(this.tween2, this);
    },

    update: function(){
        
    },

    tween2: function() {
        this.tween = this.game.add.tween(this.xmas).to( { y: 440 }, 1800, Phaser.Easing.Bounce.Out, true);
    },
};