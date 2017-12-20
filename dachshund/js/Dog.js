var DogGame = DogGame || {};

DogGame.Dog = function(game, x, y, key, paddle){

   this.game = game;
   this.paddle = paddle;
   this.shadow = this.game.add.sprite(0,340,'shadow');
   this.shadow.anchor.setTo(0.5, 0.5);
   this.shadowTween = this.game.add.tween(this.shadow.scale).to({ x: 0.8, y: 0.8}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);
   
	Phaser.Sprite.call(this, game, x, y, key);
	
	this.animations.add('walking',[1,2,3,4,5,6,7,8,9,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],100,false);
	this.anchor.setTo(0.5);
	this.game.physics.arcade.enable(this);

    this.body.setSize(30, 94, 15, 10);//size 114x60
    this.body.onCollide = new Phaser.Signal();
    this.body.onCollide.add(this.jump.bind(this));

    this.inWater = false;
    this.isCounted = false;


    this.body.angularVelocity = 0;
    this.body.maxAngular = 20;
    this.body.angularDrag = 50;

};


DogGame.Dog.prototype = Object.create(Phaser.Sprite.prototype);
DogGame.Dog.prototype.constructor = DogGame.Dog;

DogGame.Dog.prototype.update = function() {



    if ((this.body.velocity.y < 0))
    {
        this.body.angularVelocity -=2;
    } else {
    	 this.body.angularVelocity +=2;
    }

	if(this.body.velocity.x < 0){
        this.body.velocity.setTo((this.body.velocity.x != 0 ? this.body.velocity.x *-1 : 10), this.body.velocity.y);
    }


	if(this.top > this.game.world.height){
		this.kill();
	}

    this.shadow.position.x = this.body.position.x+5;
    if ((this.body.position.x < 185)||(this.body.position.x> 825)){
        this.shadow.position.y=340;
        this.shadow.visible = true;
    }else if ((this.body.position.x -20> this.paddle.body.position.x)&&(this.body.position.x  < this.paddle.body.position.x +60) && (this.body.position.y<545)){
        this.shadow.position.y=550;
        this.shadow.visible = true;
    }else {                                
        this.shadow.visible = false;          
    } 
};
DogGame.Dog.prototype.jump = function() {
	this.play('walking');
    this.shadowTween.start();
}

DogGame.Dog.prototype.reset = function(x, y, speedX){
    Phaser.Sprite.prototype.reset.call(this, x, y);
    
    this.isCounted = false;
    this.inWater = false;
    this.body.velocity.x = speedX;
    this.body.angularVelocity = 0;
    this.angle = 0;
    this.rotation = 0;
};

