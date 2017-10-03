var Connect4 = Connect4 || {};

Connect4.GameState = {

	//init settings
	init: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 4000;
        this.CHIP_OFFSET = (6+150);
        this.COL_OFFSET = (4+150);
        this.GRID_WIDTH = 7;
        this.GRID_HEIGHT = 6;
        this.AI_MAX_DEPTH = 3;
        this.chickenDinner = false; //someone won
        this.restart = false; //shaking
        this.waitLanding = false; //dropping piece
        this.cpuTurn = false;
	},

	//preload assets
	preload: function() {
        this.load.image('bg', 'assets/bg.png');
        this.load.image('ground', 'assets/ground.png');
		this.load.image('frame','assets/board.png');
        this.load.image('chip1','assets/chipYellow.png');
        this.load.image('chip2','assets/chipRed.png');
        this.load.image('colButton','assets/column.png');
        this.load.image('retButton','assets/return.png');
        this.load.image('particle','assets/diamond.png');
    },

	//exec after loading
	create: function() {
        var margin = 50;
        var x = -margin;
        var y = -margin;
        var w = this.game.world.width + margin * 2;
        var h = this.game.world.height + margin * 2;
        this.game.world.setBounds(x, y, w, h);
        this.game.world.camera.position.set(0);
        this.background = this.add.tileSprite(-margin,0,this.game.world.width, this.game.world.height, 'bg');
        this.ground = this.add.sprite(-50,442,'ground');
        this.game.physics.arcade.enable(this.ground);
        this.ground.body.setSize(900,100,0,62);
        this.ground.body.allowGravity = false;
        this.ground.body.immovable=true;
        this.chips = this.game.add.group();
        this.chips.enableBody = true;
		this.board = new Connect4.Board(this, this.GRID_HEIGHT, this.GRID_WIDTH);
        this.ai = new Connect4.AI(this, this.GRID_HEIGHT, this.GRID_WIDTH, 1, this.board);
        this.frame = this.add.sprite(150,85,'frame');
        this.createOnscreenControls();
	},

	update: function() {
        if(this.restart == false) {
            this.game.physics.arcade.collide(this.chips, this.ground);
            this.game.physics.arcade.collide(this.chips);
        };
        if (this.waitLanding){
            this.updateChip(this.chips.getTop());
        };
        if ((this.cpuTurn == true) && (this.waitLanding == false) && (this.chickenDinner == false)){
            var cpuMove = this.ai.getBestMove(this.board, this.AI_MAX_DEPTH);
            if(this.board.isWinMove(cpuMove)){
                //console.log("WINNER WINNER CHICKEN DINNER!");
                this.chickenDinner = true;
            };
            if(this.board.makeMove(cpuMove)){
                this.waitLanding = true;
                this.cpuTurn = false;
                Connect4.game.state.getCurrentState().dropChip("chip"+this.board.currentPlayer(),cpuMove);
            };
        };
	},

    addChip: function(x, y, key){
        var chip = this.add.sprite(x,y, key);
        this.game.physics.arcade.enable(chip);
        chip.body.enableBody=true;
        chip.body.bounce.y = 0.18;
        chip.body.collideWorldBounds = true;
        chip.body.width = 1;
        chip.body.height = 69;
        return chip;
    },

    dropChip: function(key, col){
        var x_pos = (col*69)+this.CHIP_OFFSET;
        this.chips.add(this.addChip( x_pos, this.game.world.bounds.top, key));
        this.board.nextPlayer();
    },

    updateChip: function(chip) {
        if (chip){
            body = chip.body;
            if (body.moves && (body.blocked.down || body.touching.down) && Math.abs(chip.deltaY) < 1)
            {   
                body.immovable = true;
                body.moves = false;
                body.speed = 0;
                body.velocity.set(0);
                this.waitLanding = false;
                if(this.chickenDinner == true){
                    this.animateVictory(this.board.chickenDinner()["pos"]);
                };
            };
        };
    },

    shackeEffect: function(){
        var offset = 10;
        var properties = {
          x: this.game.camera.x - offset
        };
        var duration = 50;
        var ease = Phaser.Easing.Bounce.InOut;
        var shake = this.game.add.tween(this.game.camera).to(properties, duration, ease,false,1,4,true);
        shake.onComplete.addOnce(this.removeChips, this);
        this.chips.forEachExists(this.fallChip);
        shake.start();
    },

    removeChips: function(){
        this.chips.removeAll(true);
        this.restart = false;
    },

    fallChip: function(chip) {
        if (chip){
            chip.body.immovable = false;
            chip.body.moves = true;
            chip.body.collideWorldBounds = false;
        };
    },

    resetBoard: function(){
        if ((this.cpuTurn == false) && (this.waitLanding == false)){
            this.restart = true;
            this.board.resetGrid();
            this.chickenDinner = false;
            this.shackeEffect();
        };
    },

    createOnscreenControls: function() {
        this.colButtons = this.game.add.group();
        for (var i = 0; i < this.GRID_WIDTH; i++){
            var colBut = this.add.button(this.COL_OFFSET + (70*i), 85,'colButton');
            colBut.alpha = 0;
            colBut.onInputUp.add(this.clicked.bind(this, i));
        }
        this.retBut = this.add.button(700, 500,'retButton');
        this.retBut.alpha = 0.5;
        this.retBut.onInputUp.add(this.resetBoard.bind(this));
    },

    clicked: function(i) {
        if (this.chickenDinner){
            console.log("we already have a winner, restart");
            return false;
        };
        if ((this.waitLanding == false) && (this.restart == false) && (this.cpuTurn == false)){
            if (this.board.canPlay(i, this.board.grid)){
                if(this.board.isWinMove(i)){
                    console.log("WINNER WINNER CHICKEN DINNER!");
                    this.chickenDinner = true;
                };
                if(this.board.makeMove(i)){
                    this.waitLanding = true;
                    Connect4.game.state.getCurrentState().dropChip("chip"+this.board.currentPlayer(),i);
                    if (this.chickenDinner != true){
                        this.cpuTurn = true;
                    };
                    return true;
                };
            };
        } else {
            return false;
        };
    },

    animateVictory: function(pos){
        for(var i = 0; i< pos.length; i++){
            var row = pos[i][0];
            var col = pos[i][1];
            var x_pos = (col*70)+186;
            var y_pos = (row*70)+121;
            this.addDiamond(x_pos, y_pos);
        };
    },

    addDiamond: function(x, y){
        var emitter = this.game.add.emitter(x, y, 10);
        emitter.makeParticles('particle');
        emitter.minParticleSpeed.setTo(-100, -100);
        emitter.maxParticleSpeed.setTo(100, 100);
        emitter.gravity = 0;
        emitter.start(true, 500, null, 10);  
    },
    
};
