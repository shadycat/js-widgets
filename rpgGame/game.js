import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { Button } from 'react-bootstrap';
var _ = require('lodash');
var gameLogic = require('./gameLogic.js');
require('./game.css');


//Everything is almost working i need to find a way to import functions 
//use webpack, or module.exports the important functions,


//Redux Logic
//Constants and Actions 
const MOVE_UP = 'MOVE_UP'; 
const MOVE_DOWN = 'MOVE_DOWN';
const MOVE_LEFT = 'MOVE_LEFT';
const MOVE_RIGHT = 'MOVE_RIGHT';
const INVALID = 'INVALID'; //This constant might not be needed based on a re-design
const RESET_GAME = 'RESET_GAME';

var makeMove = function(playerInput) {
  console.log(playerInput)
  switch (playerInput) {
    case 38:
    case 87:
      return {type: MOVE_UP}
    case 40:
    case 83:
      return {type: MOVE_DOWN}
    case 37:
    case 65:
      return {type: MOVE_LEFT}
    case 39:
    case 68:
      return {type: MOVE_RIGHT}
    default:
      return {type: INVALID}
  }
}

var resetGame = function() {
	return {type: RESET_GAME}
}

//We can use webpack, to just add the file to it and compile it in
//Reducer Logic, this is where most of the stuff happens

function gameReducer(state, action) {
  //TO optimize i should have 1 variable that is not repeated
	var currX = state.playerX;
	var currY = state.playerY;
  console.log("Here are the current positions")
  console.log(currX)
  console.log(currY)
  console.log(action.type)
	switch(action.type) {
		case 'MOVE_UP':
			//This could also be implemented with return statements
			var newState = _.cloneDeep(state);
			gameLogic.interact(newState, currX, currY, currX, currY + 1);
			return newState
		case 'MOVE_DOWN':
      var newState = _.cloneDeep(state);
			gameLogic.interact(newState, currX, currY, currX, currY - 1);
			return newState
		case 'MOVE_LEFT':
      var newState = _.cloneDeep(state);
			gameLogic.interact(newState, currX, currY, currX - 1, currY);
			return newState
		case 'MOVE_RIGHT':
      var newState = _.cloneDeep(state);
      gameLogic.interact(newState, currX, currY, currX + 1, currY);
			return newState
		//Some code to reset the state
		case 'RESET_GAME':
      alert("Need to replace with object with called reset on")
      var newState = _.cloneDeep(state);
    //Something must be returned, even if basic state would work
    case 'INVALID':
      console.log("dont do anything")
      return state
		default:
			console.log("Not a valid or known action type")
      return state
	}
}

//React Logic
var GRID_SIZE = 10; 
var GameTile = React.createClass({
 render: function() {
   var color;
   switch (this.props.value) {
     case 'player':
       color = 'purple';
       break;
     case 1:
       color = "black";
       break;
     case 'weapon':
       color = "blue";
       break;
     case 'health':
       color = 'green';
       break;
     case 'enemy':
       color = 'red';
       break;
     case 'boss':
       color = 'orange';
       break;
     default:
       color = 'white';
   }   
   var style = { 
     top: this.props.row * GRID_SIZE,
     left: this.props.col * GRID_SIZE,
     width: GRID_SIZE,
     height: GRID_SIZE,
     background: color,
     border: "solid",
     position: 'absolute'
   }   
   return (
     <div className="gameTile" style={style}>
       {this.props.value}
     </div>
   )   
 }   
}); 


var WorldView = React.createClass({
 render: function() {
  console.log("this is what was passed down to world view")
  console.log(this.props.gameState)

   var gameTiles = []; 
   var counter = 0;
   for (var i = 0; i < this.props.gameState.size; i++) {
     for (var j = 0; j < this.props.gameState.size; j++) {
       var tileValue;
       //Process the the value, make to pass in the next step
       //Error because I did not have this.props.world i had this.world
       //But it is react, so it does not have a world array naturally
       //array needs to be this.props.world.world
       var item = this.props.gameState.world[i][j];
       if (item.hasOwnProperty('type')) {
         tileValue = item['type'];
       }
       else if (typeof this.props.gameState.world[i][j] === 'number') {
         tileValue = this.props.gameState.world[i][j];
       }
       else {
         tileValue = '?'
         console.log("Don't really know what type")
       }
       gameTiles.push(
         <GameTile
           world={this.props.gameState}
           value={tileValue}
           row = {i}
           col = {j}
           key = {counter}
         >
         </GameTile>
       );
       counter = counter + 1;
       }
     }
     var style = {
       width: this.props.gameState.size * GRID_SIZE,
       height: this.props.gameState.size * GRID_SIZE,
       background: 'yellow',
       position: 'absolute'
     }
   return (
     <div id="world" style={style}>
       {gameTiles}
     </div>
   )
 }
});
 
var GameContainer = React.createClass({
  getInitialState: function() {
    return {gameState: this.props.gameState, playerAction: false, interval: null}
  },
  gameTick: function() {
    //I am going to call a single action where the action takes care of the re-reading work
    console.log("Game is ticking, calling dispatch with a state switch statement send the right action or be generic")
    store.dispatch(makeMove(this.state.playerAction));
    console.log("action was dispatched")
  },
  keyHandler: function(e) {
    console.log("key is pressed")
    console.log("key press detected as" + e.keyCode)
    this.setState({playerAction: e.keyCode})
    console.log("the new state is here");
    console.log(this.state.playerAction);
  },
  clickHandler: function() {
    console.log("I have been clicked");
  },
  componentDidMount: function() {
    window.addEventListener('keydown', this.keyHandler);
    var interval = setInterval(this.gameTick, 1000);
    this.setState({interval: interval})
  },
  componentWillUnmount: function() {
    window.removeEventListener('keydown', this.keyHandler);
  },
  resetGame: function() {
    //I might need a start game button
    //Call A reset dispatch here to solve the issues
  },
  render: function() {
    console.log("This is the game container prop")
    console.log(this.props)
    return (
      <div className="GameContainer" onClick={this.clickHandler}>
        <WorldView gameState={this.props.gameState} />
      </div>
    )
  }
})

var GameState = function(size) {
  this.size = size;
  this.world = createWorld(size);
  this.playerX = 0;
  this.playerY = 0;
  this.playerHealth = 0;
  this.playerAttack = 0;
  this.enemyHealth = 0;
  this.enemyAttack = 0;
  this.futureMoveX = 0;
  this.futureMoveY = 0;
}

var createWorld = function(size) {
  var gameWorld = [];     
  for (var i = 0; i < size; i++) {
   gameWorld[i] = []
   for (var j = 0; j < size; j++) {
     gameWorld[i][j] = 0   
   }   
  }   
return gameWorld
}

//Dynamic updates and redux come later
var DynamicGameContainer = connect(
  function mapStateToProps(state) {
    console.log("map state to props called here is the update state")
    console.log(state)
    return {gameState: state}
  }
)(GameContainer)

console.log("starting everything")
console.log(gameLogic)
var initalGameState = new GameState(100)
//See if Pree seed is known
gameLogic.seedWorld(initalGameState);
console.log("The inital game state is below")
console.log(initalGameState)
let store = createStore(gameReducer, initalGameState)

ReactDOM.render( 
  <Provider store={store}>
    <DynamicGameContainer />
  </Provider>,
  document.getElementById('content')
)
