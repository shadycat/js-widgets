/*Game Board Logic*/

export function Board(size) {
 this.size = size;
 this.board = createBoard(size);
};

export function createBoard(size) {
 var board = [];
 for (var i = 0; i < size; i++) {
   board[i] = [];
   for (var j = 0; j < size; j++) {
     board[i][j] = 0;
   }
 }
 return board
};

var getNeighbors = function(board, i, j) {
 var neighbors = []; 
 for (var x = -1; x <= 1; x++) {
   for (var y = -1; y <= 1; y++) {
     if ( (x != 0) || (y != 0) ) {
       neighbors.push(board[i + x][j+ y]);
     } 
   }   
 }   
 if (neighbors.length === 8) {
  return neighbors;
 }
 else {
  console.log("neigbors is wrong");
 }
};

var editTile = function(board, i, j, value) {
 board[i][j] = value;
 console.log("value changed");
} 

var itemCount = function(array) {
 var counter = 0;
 for (var index = 0; index < array.length; index++) {
   if (array[index] === 1) {
     counter = counter + 1;
   }
 }   
 return counter;
};

var playTile = function(board, i, j) {
   var alive = board[i][j];
   var neighbors = getNeighbors(board, i, j);
   var status = itemCount(neighbors);
   if (alive == 1) {
     switch (status) {
       case 0:
       case 1:
         editTile(board, i, j, 0)
         break;
       case 2:
       case 3:
         break;
       case 4:
       case 5:
       case 6:
       case 7:
       case 8:
         editTile(board, i, j, 0)
         break;
       default:
        console.log("Error in neighbor counting")
        break;
     }
   }
   else if (alive == 0) {
    switch (status) {
      case 0:
      case 3:
        editTile(board, i, j, 1)
      default:
        console.log("No action taken")
    }
   }
   else {
     throw "Illegal Board State in Play Tile Detected"
   }
 };

export function runBoard(board) {
 console.log("play board is called")
 var xSize = board.length - 1;
 var ySize = board[0].length - 1; 
 for (var x = 1; x < xSize; x++) {
   for (var y = 1; y < ySize; y++) {
    playTile(board, x, y);
   } 
 }
 return board;
};

