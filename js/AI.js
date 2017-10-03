var Connect4 = Connect4 || {};

Connect4.AI = function(state, rows, cols, player, board){
	this.state = state;
	this.rows = rows;
	this.cols = cols;
	this.player = player;
	this.token = board.tokens[player];
	this.tokens = [1,2];
	this.MAX = 10000;
	this.MIN = -this.MAX;
	this.WEIGHTS=[1.1,1.2,1.3,1.4,1.3,1.2,1.1];
	this.fours = { "chain": [], "node": {}};//69 possible 4, quick access
	this.board = board;
	this.initFours();

};

Connect4.AI.prototype.getBestMove= function(board, maxDepth) { 
	this.initFours();
	this.clearFours();
	var moves = this.board.getMoves(grid);
	if (moves.length == 1) return moves[0];
	res = this.minmax(maxDepth, 0, board.grid, this.fours, this.player, null);
	//res = this.abMinmax(maxDepth, 0, board.grid, this.fours, this.player, null, this.MIN * 10, this.MAX*10);
	return res.move;
};

Connect4.AI.prototype.copyFours= function(fours){
	fours = fours || this.fours;
	var newFours = JSON.parse(JSON.stringify(fours));  
	for (key in newFours.chain){
		if (newFours.chain[key]== null){
			delete newFours.chain[key];
		}
	}
	return newFours;
};

Connect4.AI.prototype.evaluate= function(grid, chain, player, move) {
	player = player || this.token; 
	grid  = grid || this.board.grid;
	chain = chain || this.fours["chain"];
	var winner = this.filledFours(grid, chain);
	if (winner !=0){ //exist a winner
		return (this.tokens[player] == this.token ? this.MAX*10 : this.MIN*10);
	};
	var val = 0, part;
	var moves = this.board.getMoves(grid);
	var pos;
	for (key in chain){
		pos = chain[key];//count tokens and score
		part = this.lineScore(pos, grid, player);
		if(move != null){// test weight
			part.score *= this.WEIGHTS[move]; 
		};//if opponent win next turn
		if(part.hasOwnProperty("3th")){
			var empty = part["3th"];
			var col = moves.indexOf(empty[1]);
			if (col >= 0){
				if (this.board.topRowCol(col, grid) == empty[0]){
					val += this.MIN/2;
				};// 3th token avaiable
			};
		}else if(part.hasOwnProperty("4th")){
			var empty = part["4th"];
			var col = moves.indexOf(empty[1]);
			if (col >= 0){
				if (this.board.topRowCol(col, grid) == empty[0]){
					val += this.MIN;
				};// 4th token avaiable
			};
		};
		val += part.score;
	};
	//if((this.board.topRowCol(col, grid)+1)%2 == 0){//even row
	//	val += (player==this.player ? 500 : -500);
	//} else {//odd row
	//	val +=(player!= this.player ? 500 : -500);
	//};
	return val;
};
// count tokens in a four row
Connect4.AI.prototype.lineScore= function(pos, grid, player){
	//if (pos == null) return 0;
	grid = grid || this.board.grid;
	var score = 0, part = 0, idx, tok;
	var lastEmpty;
	for (var i = 0; i < pos.length; i++){
		idx = pos[i];
		tok = grid[idx[0]][idx[1]];
		if (tok != 0){
			part+=(tok == this.tokens[player] ? 1 : -1);//player	
		} else {
			lastEmpty = pos[i];
		};
	};
	switch(Math.abs(part)){
		case 2:
			part *= 4;
			break;
		case 3:
			part *= 32;
			break;
		case 4:
			part *= 64;
		default:
			break;
	};
	switch(part){ //ooponent 2or3 in row
		case -16:
			score+=part;
			return {"score": score, "3th": lastEmpty};
		case -96:
			score+=part;
			return {"score": score, "4th": lastEmpty};
		default:
			break;
	};
	score+=part;
    return {"score": score};
};

Connect4.AI.prototype.minmax= function(maxDepth, currentDepth, grid, fours, player, currMove) { 
	grid = grid || this.board.grid;
	fours = fours || this.fours;
	fours = fours || this.fours;
	var val;
	var bestMove = null, bestScore;
	var moves = this.board.getMoves(grid);
	//check if done rec
	if (this.board.isGameOver(grid) || (currentDepth == maxDepth)){// || (moves.length == 1)
		val = this.evaluate(grid, fours.chain, player, currMove);
		//bestMove = (moves.length == 1 ? moves[0] : currMove);
		return {
			"score": val,
			"move": bestMove//bestMove	// currMove
		};
	};
	if (player == this.player){
		bestScore = this.MIN*10;
	}else{
		bestScore = this.MAX*10;
	};
	var moves = this.board.getMoves(grid);
	var newGrid, result, row;
	var newPlayer = (player+1) % 2;
	//go trough moves

	for (var i = 0; i < moves.length; i++){
		newGrid = this.board.getGridCopy(grid);
		newGrid = this.board.makeMove(moves[i], newGrid, player, this.tokens[player]);
		var newFours = this.copyFours(fours);
		this.clearFours(newGrid, newFours.node, newFours.chain);
		//recurse
		result = this.minmax(maxDepth, currentDepth+1, newGrid, newFours, newPlayer, moves[i]);
		//update current
		if (player == this.player){
			if (result.score > bestScore){
				bestScore = result.score;
				bestMove = moves[i];
			}else if (result.score == bestScore){
				bestMove = (this.coinToss() ? moves[i] : bestMove);
			};
		} else {
			if (result.score < bestScore){
				bestScore = result.score;
				bestMove = moves[i];
			}else if (result.score == bestScore){
				bestMove = (this.coinToss() ? moves[i] : bestMove);
			};
		};
	};
	//return best score and move
	return {"score": bestScore, "move": bestMove};
};
// TO DO
Connect4.AI.prototype.abMinmax= function(maxDepth, currentDepth, grid, fours, player, currMove, alpha, beta) { 
	grid = grid || this.board.grid;
	fours = fours || this.fours;
	fours = fours || this.fours;
	var val;
	var bestMove = null, bestScore;
	//check if done rec
	if (this.board.isGameOver(grid) || (currentDepth == maxDepth)){
		val = this.evaluate(grid, fours.chain, player, currMove);
		return {
			score: val,
			move: bestMove	
		};
	};
	if (player == this.player){
		bestScore = this.MIN*10;
	}else{
		bestScore = this.MAX*10;
	};
	var moves = this.board.getMoves(grid);
	var newGrid, result, row;
	var newPlayer = (player+1) % 2;
	//go trough moves
	for (var i = 0; i < moves.length; i++){
		newGrid = this.board.getGridCopy(grid);
		newGrid = this.board.makeMove(moves[i], newGrid, player, this.tokens[player]);
		var newFours = this.copyFours(fours);
		this.clearFours(newGrid, newFours.node, newFours.chain);
		//recurse
		result = this.abMinmax(maxDepth, currentDepth+1, newGrid, newFours, newPlayer, moves[i], alpha, beta);
		//update current
		if (player == this.player){
			if (result.score > bestScore){
				bestScore = result.score;
				bestMove = moves[i];
			}else if (result.score == bestScore){
				bestMove = (this.coinToss() ? moves[i] : bestMove);
			};
		} else {
			if (result.score < bestScore){
				bestScore = result.score;
				bestMove = moves[i];
			}else if (result.score == bestScore){
				bestMove = (this.coinToss() ? moves[i] : bestMove);
			};
		};
	};
	//return best score and move
	return {"score": bestScore, "move": bestMove};
};
//init 69 possible fours
Connect4.AI.prototype.initFours= function(){
	this.fours = { "chain": [], "node": {}};
	var idx = -1;
	var node = this.fours.node;
	for(var j=0; j<this.cols; j++){
		for(var i=this.rows-1; i>=this.rows-3; i--){
			this.fours.chain.push([[i,j],[i-1,j],[i-2,j],[i-3,j]]);
			idx++;
			this.addPropNode(i,j, idx, node);
			this.addPropNode(i-1,j, idx, node);
			this.addPropNode(i-2,j, idx, node);
			this.addPropNode(i-3,j, idx, node);
		};
	};
	for(var i=this.rows-1; i>=0; i--){
		for(var j=0; j<this.cols-3; j++){
			this.fours.chain.push([[i,j], [i,j+1], [i,j+2], [i,j+3]]);
			idx++;
			this.addPropNode(i,j, idx, node);
			this.addPropNode(i,j+1, idx, node);
			this.addPropNode(i,j+2, idx, node);
			this.addPropNode(i,j+3, idx, node);
			if(i>=3){
				this.fours.chain.push([[i,j], [i-1,j+1], [i-2,j+2], [i-3,j+3]]);
				idx++;
				this.addPropNode(i,j, idx, node);
				this.addPropNode(i-1,j+1, idx, node);
				this.addPropNode(i-2,j+2, idx, node);
				this.addPropNode(i-3,j+3, idx, node);
			};
		};
	};
	for(var j=this.cols-1; j>=3; j--){
		for(var i=this.rows-1; i>=this.rows-3; i--){
			this.fours.chain.push([[i,j], [i-1,j-1], [i-2,j-2], [i-3,j-3]]);
			idx++;
			this.addPropNode(i,j, idx, node);
			this.addPropNode(i-1,j-1, idx, node);
			this.addPropNode(i-2,j-2, idx, node);
			this.addPropNode(i-3,j-3, idx, node);
		};
	};
	return this.fours;
};
//add idx to node idx list
Connect4.AI.prototype.addPropNode= function(r, c, idx, node){
	node = node || this.fours["node"];
	var key = r+","+c;
	if(node.hasOwnProperty(key)){
    	node[key].push(idx);
	} else {
		node[key] = [idx];
	};
};
//check if line is no more four
Connect4.AI.prototype.discardFour= function(pos, grid ){
	grid  = grid || this.board.grid;
	var line = [], idx;
	for (var i = 0; i < pos.length; i++){
		idx = pos[i];
		line.push(grid[idx[0]][idx[1]]);
	}
	var discard = [1,2].every(function(token) {
    	return line.indexOf(token) !== -1;
	});
	return discard;

};
//check if token causes for obsolete
Connect4.AI.prototype.updateFours= function(row, col, grid , node, chain){
	grid  = grid || this.board.grid;
	node = node || this.fours["node"];
	chain = chain || this.fours["chain"];
	var key = row+","+col;
	if(node.hasOwnProperty(key)){
		var indexs = node[key];
		if (indexs.length != 0){
			for (var i=indexs.length-1; i >= 0; i--){
				if ((chain.hasOwnProperty(indexs[i]))&&(this.discardFour(chain[indexs[i]], grid))){
					delete chain[indexs[i]];
					//indexs.splice(i,1);
				};
			};
		};
	};
	return {"chain": chain, "node": node};
};
// remove all unavaiable fours
Connect4.AI.prototype.clearFours= function(grid, node, chain){
	grid = grid || this.board.grid;
	node = node || this.fours["node"];
	chain = chain || this.fours["chain"];
	for(i = 0; i< this.rows; i++){
		for(j=0; j<this.cols; j++){
			this.updateFours(i,j, grid, node, chain);
		};
	};
	return { "chain": chain, "node": node};
};
// returns available fours
Connect4.AI.prototype.getFours= function(chain){
	chain = chain || this.fours["chain"];
	var appo = [];
	for (key in chain){
		appo.push(chain[key]);
	};
	return appo;
};
// check line for 4 of a kind
Connect4.AI.prototype.winTokens= function(pos, grid){
	grid = grid || this.board.grid;
	var line = [], idx;
	for (var i = 0; i < pos.length; i++){
		idx = pos[i];
		line.push(grid[idx[0]][idx[1]]);
	};
	var winner = !line.some(function(value, index, array){
        return value !== array[0];
    });
    return (winner ? line[0] : 0);
};
//check all fours left for 4 of a kind
Connect4.AI.prototype.filledFours = function(grid, chain){
	grid = grid || this.board.grid;
	chain = chain || this.fours["chain"];
	var currFours = this.getFours(chain);
	var winner;
	for(var i=0; i<currFours.length; i++){
		winner = this.winTokens(currFours[i], grid);
		if(winner>0){
			return winner;
		};
	};
	return 0;
};

Connect4.AI.prototype.coinToss = function() {
    return (Math.floor(Math.random() * 2) == 0);
};