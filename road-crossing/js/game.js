let gameScene = new Phaser.Scene('Game');

gameScene.init = function(){
    this.playerSpeed = 3;  
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
    
    this.isTerminating = false;
};

gameScene.preload = function(){
    this.load.image('background', 'assets/backgroundImg.png');  
    this.load.image('player', 'assets/player1.png');  
    this.load.image('enemy', 'assets/creature1.png');    
    this.load.image('goal', 'assets/chest.png');  
};

gameScene.create = function() {
    let bg = this.add.sprite(0,0, 'background');
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;
    
    bg.setPosition(gameW / 2, gameH / 2);
    
    this.player = this.add.sprite(40, gameH/2, 'player');
    this.player.depth = 2;
    this.player.flipX = true;
    
    this.goal = this.add.sprite(gameW-80, gameH/2, 'goal');
    this.goal.setScale(1.1);
    
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 6,
        setXY: {
            x: 90,
            y: 100,
            stepX:70,
            stepY:20
        }
    });
    
    
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), 0.1, 0.1);
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
        enemy.flipX = false;
        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed)
        enemy.velocity = dir * speed;
        enemy.depth = 1;
    }, this);
    
    
};

gameScene.update = function() {
    
    if (this.isTerminating) return;
    
    if(this.input.activePointer.isDown){
        this.player.x += this.playerSpeed;
    }
    
    let playerRect = this.player.getBounds();
    let goalRect = this.goal.getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect,goalRect)){
        console.log('Reached Goal!');
        
        return this.gameOver();
    }
    
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;
    
    for(let i = 0; i < numEnemies; i++){
        enemies[i].y += enemies[i].velocity;
    
        let conditionUp = (enemies[i].velocity < 0 && enemies[i].y <= this.enemyMinY )
        let conditionDown = (enemies[i].velocity > 0 && enemies[i].y >= this.enemyMaxY)
        if ( conditionUp || conditionDown){
            enemies[i].velocity *= -1;
        }
        
        let enemyRect = enemies[i].getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)){
            console.log('Game Over!');
            
            return this.gameOver();
        }
        
        if (enemies[i].flipX == false && enemies[i].x < this.player.x){
            enemies[i].flipX = true;
        }
        
        if ( enemies[i].depth == 3 && enemies[i].y < this.sys.game.config.height / 2){
            enemies[i].depth = 1;
        } else if ( enemies[i].depth == 1 && enemies[i].y > this.sys.game.config.height / 2){
            enemies[i].depth = 3;
        }
    }
    
};

gameScene.gameOver = function(){
    this.isTerminating = true;
    
    this.cameras.main.shake(500);
    
    this.cameras.main.on('camerashakecomplete', (camera, effect) => this.cameras.main.fade(500), this)
    
    this.cameras.main.on('camerafadeoutcomplete', (camera, effect) => this.scene.restart(), this)
}

let config = {
	type: Phaser.AUTO, 
	width: 640,
	height: 360,
	scene: gameScene
};

let game = new Phaser.Game(config);