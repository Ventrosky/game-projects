var DogGame = DogGame || {};

DogGame.GameState = {

    init: function(highscore, muted){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.game.world.setBounds(0,0,1024,640);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.cursor = this.game.input.keyboard.createCursorKeys();

        var localHighscore = localStorage.highScore;

        this.highscore = highscore ? highscore : (localHighscore? localHighscore: 0);
        this.muted = muted ? muted : false;
        this.waveDogCount=3;

    },

    preload: function(){

        //this.game.load.atlas('mysprite', 'assets/sprites.png', 'assets/sprites.json');


        this.load.image('background','images/background.png');
        this.load.image('paddle','images/paddle.png');
        this.load.image('platform','images/platform.png');
        this.load.image('exit','images/exit.png');
        this.load.image('shadow','images/shadow.png');
        this.load.image('life','images/life1.png');

        this.load.image('paused','images/paused.png');
        this.load.spritesheet('end','images/end.png',165,85,2);
        this.load.image('title','images/title.png');

        this.load.image('pause','images/pause.png');
        this.load.image('menu','images/menu.png');

        this.load.spritesheet('audio','images/audio.png', 48, 48, 2, 0, 0);

        this.load.spritesheet('dog','images/sprite-dog.png', 60, 114, 30, 0, 0);
        //this.load.spritesheet('water','images/water-36-120-127.png', 120, 127, 36, 0, 0);
        this.load.spritesheet('water','images/water-20.png', 113, 120, 20, 0, 0);
        this.load.spritesheet('splash','images/splash.png', 150, 69, 16, 0, 0);

        this.load.audio('song',['audio/song1.mp3','audio/song1.ogg']);
        this.load.audio('sink',['audio/sink.mp3','audio/sink.ogg']);
        this.load.audio('jump',['audio/jump.mp3','audio/jump.ogg']);
        this.load.audio('up',['audio/up.mp3','audio/up.ogg']);
        this.load.audio('down',['audio/up.mp3','audio/down.ogg']);
    },

    create: function(){
        this.ground = this.add.sprite(0,0,'background');

        this.isGameOver = false;
        this.lifeCount = 3;

        this.platforms = this.add.group();
        var platformX = -100;
        for (var i = 0; i < 2; i++){
            var platform = this.add.sprite(platformX,320,'platform');
            this.physics.enable(platform, Phaser.Physics.ARCADE);
            platform.body.setSize(300, 280, 10, 20);//size 320
            platform.body.allowGravity = false;
            platform.body.immovable=true;
            this.platforms.add(platform)
            platformX += 904;

        }
            
        this.paddle = this.add.sprite(this.world.centerX,552,'paddle');
        this.paddle.anchor.setTo(0.5);
        this.physics.enable(this.paddle, Phaser.Physics.ARCADE);
        this.paddle.body.allowGravity = false;
        this.paddle.stopVelocityOnCollide = true;
        this.paddle.body.immovable = true;
        this.bounchePaddleTween = this.add.tween(this.paddle.scale).to({ x: 1.3, y: 0.7}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

        this.initDogs();
        this.loadLevel();

        this.splash = this.game.add.group();
        this.splash.createMultiple(30, 'splash');
        this.splash.forEach(this.setupSplash, this);

        this.sea = this.add.group();
        var waterX = -60;
        for (var i = 0; i < 10; i++){
            var water = this.add.sprite(waterX,555,'water',10);
            water.animations.add('walking',[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],50,true);
            water.play('walking');
            this.physics.enable(water, Phaser.Physics.ARCADE);
            water.body.allowGravity = false;
            water.body.immovable=true;
            this.sea.add(water)
            waterX+=113;
        }

        this.song = this.add.audio('song');
        
        this.sink = this.add.audio('sink');
        this.jump = this.add.audio('jump');
        this.up = this.add.audio('up');
        
        this.score = 0;
        this.scoreBuffer = 0;
        this.createScore();

        this.createUI();

        if(this.muted ==false){
                this.audioButton.frame = 0;
                this.song.loopFull();
        } else {

                this.audioButton.frame = 1;
        }

        this.exit = this.game.add.sprite(835, 200, 'exit');
        this.game.physics.enable(this.exit, Phaser.Physics.ARCADE);
        this.exit.body.allowGravity = false;
        this.exit.body.immovable = true;

        this.pauseImg = this.add.sprite(this.game.width/2,this.game.height/2,'paused');
        this.pauseImg.anchor.setTo(0.5);
        this.pauseImg.visible=false;
    },
    createUI: function(){

        this.pauseButton = this.add.button(930,50, 'pause');
        this.pauseButton.onInputUp.add(function () {
            if (!this.isGameOver){
                this.pauseImg.visible=true;
                this.game.paused = true;
            }
        }, this);
        this.input.onDown.add(function () {
            if (this.isGameOver){
                this.game.paused = false;
                this.song.stop();
                var points;
                if (this.score > this.highscore){
                    localStorage.highScore = this.score;
                    points =this.score;
                } else {
                    points =this.highscore;
                }
                this.game.state.start('GameState', true, false, points, this.muted);
            } else if (this.game.paused) {
                this.game.paused = false;
                this.pauseImg.visible=false;
            }       
        }, this);
        this.pauseButton.fixedToCamera = true;

        
        this.audioButton = this.add.button(860,50,'audio',0);
        this.audioButton.onInputUp.add(this.muteMusic.bind(this));
        this.audioButton.fixedToCamera = true;

        this.lifes = this.add.group();
        this.lifeBuffer = [];
        var lifeX = 75;
        for (var i = 0; i < 3; i++){
            var life = this.add.sprite(lifeX,68,'life');
            life.anchor.setTo(0.5);
            this.lifes.add(life);
            lifeX += 40;
        }
        this.lifes.fixedToCamera = true;

    },

    muteMusic: function(){
        if (this.muted == false){
            this.muted = true;
            this.song.stop();
            this.audioButton.frame = 1;
        } else {
            this.muted = false;
            this.song.loopFull();
            this.audioButton.frame = 0;
        }
    },

    createScore: function(){
 
            var scoreFont = "70px Arial";
            this.scoreLabel = this.game.add.text(this.game.world.centerX, 50, "0", {font: scoreFont, fill: "#f8db68", stroke: "#1a223f", strokeThickness: 8});
            this.scoreLabel.anchor.setTo(0.5, 0);
            this.scoreLabel.align = 'center';
            this.scoreLabelTween = this.add.tween(this.scoreLabel.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

            this.highScoreLabel = this.game.add.text(770, 50, this.highscore, {font: "28px Arial", fill: "#f8db68", stroke: "#1a223f", strokeThickness: 4});
            this.highScoreLabel.anchor.setTo(0.5, 0);
            this.highScoreLabel.align = 'center';
    },
    
    incrementScore: function(){
            this.score += 1;  
            this.scoreLabel.text = this.score;    
    },
    
    createScoreAnimation: function(x, y, message, score){
        var scoreFont = "25px Arial";
        var scoreAnimation = this.game.add.text(x, y, message, {font: scoreFont, fill: "#1a223f", stroke: "#ffffff", strokeThickness: 8});
        scoreAnimation.anchor.setTo(0.5, 0);
        scoreAnimation.align = 'center';
        var scoreTween = this.game.add.tween(scoreAnimation).to({x:this.game.world.centerX, y: 50}, 800, Phaser.Easing.Exponential.In, true);
    
        scoreTween.onComplete.add(function(){
            this.up.play();
            scoreAnimation.destroy();
            this.scoreLabelTween.start();
            this.scoreBuffer += score;
        }, this);
    },

    setupSplash: function(splsh){
        splsh.animations.add('effect');
        splsh.anchor.setTo(0.5);

    },
    addSplash: function(dog, water){
        if (dog.inWater!=true){
            var splsh = this.splash.getFirstExists(false);
            if(!splsh){
                this.splash.createMultiple(5, 'splash');
                this.splash.forEach(this.setupSplash, this);
                splsh = this.splash.getFirstExists(false);
            }
            splsh.reset(dog.body.x + 30, 530);
            splsh.play('effect', 33, false, true);
            dog.inWater=true;
            this.sink.play();
            this.removeHealth();
        }
    },

    removeHealth: function(){
        this.lifeCount--;
        if (this.lifeCount>=0){
            this.lifeBuffer.push(this.lifeCount);
            this.lifesTween = this.add.tween(this.lifes.getAt(this.lifeCount).scale).to({ x: 0.1, y: 0.1}, 200, Phaser.Easing.Linear.In);
            this.lifesTween.onComplete.add(function() {
                this.lifes.getAt(this.lifeBuffer.shift()).visible = false;
            }, this);
            this.lifesTween.start();
        } else {
            this.gameOver();
        }
        
        
    },
    addHealth: function(){
        this.lifeCount++;
        if (this.lifeCount<=3){
            this.lifes.getAt(this.lifeCount-1).visible = true;
            this.lifeAddTween = this.add.tween(this.lifes.getAt(this.lifeCount-1).scale).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
            this.lifeAddTween.start();
        } else {
            this.lifeCount--;
        }
    },

    gameOver: function(){
        if(!this.isGameOver ){
            this.isGameOver = true;
            this.down = this.add.audio('down');
            for (var i = 0; i < 2; i++){
                    item = this.game.add.sprite((this.game.width /2 - 175) + 170 * i, -90, 'end', i);
                    this.game.add.tween(item).to({y: 250}, 1000, Phaser.Easing.Bounce.Out,true);
            }
            this.down.play();
        }
    },

    addPoint: function(trigger,dog){
        if (dog.isCounted!=true){
            var newScore = 1;
            this.createScoreAnimation(dog.body.x, dog.body.y, '+'+newScore, newScore);
            dog.isCounted=true;
        }
    },

    update: function(){
        this.game.physics.arcade.collide(this.dogs, this.platforms, this.landed);
        
        this.game.physics.arcade.overlap(this.platforms, this.paddle);

        this.game.physics.arcade.collide( this.dogs,this.paddle, this.bounchePaddle, null, this);

        this.game.physics.arcade.overlap(this.exit, this.dogs, this.addPoint, null, this);

        this.game.physics.arcade.overlap(this.dogs, this.sea, this.addSplash, null, this);

         if (this.isGameOver!=true) {
            var oldX = this.paddle.position.x;
            this.paddle.position.x = this.input.x;
            if (this.paddle.position.x <= 240){
                this.paddle.position.x = 240;
            } 
            if (this.paddle.x >= 780){
                    this.paddle.position.x = 780;
            }
        }

        if(this.scoreBuffer > 0){
                this.incrementScore();
                this.scoreBuffer--;
        }
    },
    landed: function(){
        //console.log('landed');
    },

    bounchePaddle: function(obj1, obj2){
        this.jump.play();
        this.bounchePaddleTween.start();
    },

    initDogs: function(){
        this.dogs = this.add.group();
        this.dogs.enableBody = true;   
    },

    scheduleNextDog: function(){
        var nextDog = this.levelData.dogs[this.currentDogIndex];
        if(nextDog){
            var nextTime = 1000 * ( nextDog.time - (this.currentDogIndex == 0 ? 0 : this.levelData.dogs[this.currentDogIndex - 1].time));
            
            this.nextDogTimer = this.game.time.events.add(nextTime, function(){
                this.createDog(nextDog.x, nextDog.y, nextDog.speedX);
                this.currentDogIndex++;
                this.scheduleNextDog();
            }, this);
        }
    },
    loadLevel: function(){
        
        this.currentDogIndex = 0;
        
        this.waveDogCount= this.game.rnd.integerInRange(this.waveDogCount, this.waveDogCount+2);
        this.levelData = this.createWave(this.waveDogCount)

        this.scheduleNextDog();

        this.endWaveTimer = this.game.time.events.add(this.levelData.duration * 1000, function (){
            if(!this.isGameOver){
                this.loadLevel();
                this.addHealth(); 
            }
        },this);
    },

    createWave: function(count){
        var timeBetweenWaves =  7;
        var newTime = 0;

        var level = {"duration": 0, "dogs": []};
        for (var i =0; i < count; i++) {
            var newDog = {};
            newTime += (this.game.rnd.integerInRange(5, 15)/10);
            newDog["time"]= newTime;
            newDog["x"]= -1;
            newDog["y"]= this.game.rnd.integerInRange(150, 250);
            newDog["speedX"]= this.game.rnd.integerInRange(150, 250);
            level["dogs"].push(newDog);
        }
        level["duration"] = newTime + timeBetweenWaves;

        return level;
    },

    createDog: function(x, y, speedX){
        var dog = this.dogs.getFirstExists(false);
        if(!dog){
            dog = new DogGame.Dog(this.game,x,y,'dog',this.paddle);
            dog.body.velocity.x = speedX;
            dog.body.bounce.set(1);
            this.dogs.add(dog);
        }
        dog.body.velocity.x = speedX;
        dog.reset(x,y, speedX);
    },
};