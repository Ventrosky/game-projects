var Connect4 = Connect4 || {};

Connect4.Board = function(state, rows, cols){
	this.state = state;
	this.rows = rows;
	this.cols = cols;
	this.tokens = [ 1, 2];
	this.curr = 0;
	this.grid = [];
	this.story = [];

	var i,j;
	for(i = 0; i< rows; i++){
		this.grid.push([]);
		for(j=0; j<cols; j++){
			this.grid[i].push(0);
		}
	}
};

Connect4.Board.prototype.currentPlayer = function(player) {
  player = player || this.curr;
	return this.tokens[player];
};

Connect4.Board.prototype.nextPlayer = function(player) { 
  this.curr = (this.curr+1) %2;
};

Connect4.Board.prototype.consoleLog = function(g, player){
	g = g || this.grid; 
  player = player || this.currentPlayer();
	var i,j;
	var pretty = "";

	for(i = 0; i< this.rows; i++){
		pretty += '\n';
		for(j=0; j<this.cols; j++){
			pretty += ' ' + g[i][j];
		};
	};
	console.log(pretty);
	console.log("turn player:"+player);
};

Connect4.Board.prototype.resetGrid = function(g){
  g = g || this.grid; 
  var i,j;
  for(i = 0; i< this.rows; i++){
    for(j=0; j<this.cols; j++){
      g[i][j] = 0;
    };
  };
  this.curr = 0;
  this.story = [];
};

Connect4.Board.prototype.getGridCopy = function(g) {
    g = g || this.grid; 
    var newGrid = [];
    for (var row = 0; row < this.rows; row++) {
      newGrid.push(g[row].slice(0));
    }
    return newGrid;
};

Connect4.Board.prototype.canPlay = function(col, g){
	g = g || this.grid;
	return(g[0][col] ?  false : true);
};

Connect4.Board.prototype.topRowCol = function(col, g){
	g = g || this.grid;
	var row = -1;
	for(var r = 0; r < g.length; r++){
    	if(g[r][col] == 0){
        	row = r;
    	} else {
    		return row;
    	};
	};
	return row;
};

Connect4.Board.prototype.colRange = function() {
	var appo = [];
    for (var i = 0; i < this.cols; i ++) {
        appo.push(i);
    };
    return appo;
};

Connect4.Board.prototype.getMoves = function(g) { 
	g = g || this.grid;
	var appo = [];
    for (var i = 0; i < this.cols; i ++) {
        if(this.canPlay(i,g)){
        	appo.push(i);
        };
    };
    return appo;
};

Connect4.Board.prototype.makeMove = function(col, g, playerIdx, token){
	g = g || this.grid;
  token = token || this.tokens[this.curr];
  playerIdx = playerIdx || this.curr;
	if (this.canPlay(col,g)){
		var row = this.topRowCol(col,g);
    if (row == -1) return false;
		g[row][col] = ( token ? token : this.currentPlayer(playerIdx));
		this.story.push(col);
		return g;
	}else{
		return [];
	};
};

Connect4.Board.prototype.isGameOver = function(g, move, token) { 
	g = g || this.grid;
  var moves = this.getMoves(g);
  //if (moves.length == 0) return true;
  if (moves.length == 0) return true;
  if (token){                                          // HERE!!!!!!!!!!!!!!!!
    if (this.isWinMove(move, g, token)){
      return true;
    };
  };
  return false;
};

Connect4.Board.prototype.isWinMove = function(col, g, token){
    token = token || this.currentPlayer();
	  g = g || this.grid;
    //var token = this.currentPlayer();
    var row = this.topRowCol(col);
    if (row == -1) return false;
    var rows = this.rows;
    var cols = this.cols;
    var delta_pos;
    var oldToken = g[row][col]
    g[row][col]=token; //init move
    var appo = [[1, 0], [0, 1], [1, 1], [1, -1]];
    for (var i = 0; i < appo.length; i++){
    	delta_pos=appo[i];
        consecutive_items = 1;
        var delta;
        var appo2 = [1, -1];
        for (var j = 0; j < appo2.length; j++){
        	delta = appo2[j];
            delta_pos[0] *= delta;
            delta_pos[1] *= delta;
            var next_row = row + delta_pos[0];
            var next_col = col + delta_pos[1];
            while (((0 <= next_row) && (next_row < rows)) && ((0 <= next_col) && (next_col < cols))){
                if (g[next_row][next_col] == token){
                    consecutive_items += 1;
                }else{
                	break;
                };
                if (consecutive_items == 4){
                	g[row][col]=oldToken;//reset move
                    return true;
                };
                next_row += delta_pos[0];
                next_col += delta_pos[1];
            };
        };
    };
    g[row][col]=oldToken;//reset move
    return false;
};

Connect4.Board.prototype.chickenDinner = function(g) { 
	g = g || this.grid;
    var row, col, token;
    for(row = 0; row < this.rows; row++) {
      for (col = 0; col < this.cols - 3; col++) {
        token = g[row][col]
        if (token) {
          if (g[row][col+1] == token && g[row][col+2] == token && g[row][col+3] == token) {
            return {
              "tok": token,
              "pos": [[row, col], [row, col+1], [row, col+2], [row, col+3]]
            };
          };
        };
      };
    };
    for(col = 0; col < this.cols; col++) {
      for (row = 0; row < this.rows - 3; row++) {
        token = g[row][col]
        if (token) { // four in a row of zeros doesn't count.
          if (g[row+1][col] == token && g[row+2][col] == token && g[row+3][col] == token) {
            return {
              "tok": token,
              "pos": [[row, col], [row+1, col], [row+2, col], [row+3, col]]
            };
          };
        };
      };
    };
    for(col = 0; col < this.cols - 3; col++) {
      for (row = 0; row < this.rows - 3; row++) {
        token = g[row][col]
        if (token) { 
          if (g[row+1][col+1] == token && g[row+2][col+2] == token && g[row+3][col+3] == token) {
            return {
              "tok": token,
              "pos": [[row, col], [row+1, col+1], [row+2, col+2], [row+3, col+3]]
            };
          };
        };
      };
    };
    for(col = 0; col < this.cols - 3; col++) {
      for (row = 3; row < this.rows; row++) {
        token = g[row][col]
        if (token) {
          if (g[row-1][col+1] == token && g[row-2][col+2] == token && g[row-3][col+3] == token) {
            return {
              "tok": token,
              "pos": [[row, col], [row-1, col+1], [row-2, col+2], [row-3, col+3]]
            };
          };
        };
      };
    };
    return {"tok": 0};
  };
