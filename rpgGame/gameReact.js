import gameReducer from './gameRedux.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Component, Proptypes} from 'react';
import { Button } from 'react-bootstrap';
import { GameState, createWorld, seedWorld } from './gameLogic';
import { makeMove, resetGameFunction } from './gameRedux.js';
import { closeToPlayer } from './helperFunctions.js'
require('./game.css');

//React Logic
const GRID_SIZE = 30; 
const BLANK_VALUE = 0;
const WALL_VALUE = 1;

//Implement prop checking
class GameTile extends Component {
	render() {
		const { row, col, color } = this.props;
   		var style = { 
				top: row * GRID_SIZE,
				left: col * GRID_SIZE,
				width: GRID_SIZE,
				height: GRID_SIZE,
				background: color,
				border: "solid",
				position: 'absolute'
   		};   
	    return (
		    <div className="gameTile" style={style}>
		    	{value}
		    </div>
	   	);   
	};   
}; 

var colorAssigner = function(value) {
	var color;
	switch (this.props.value) {
		case 'FOG':
			return color = 'grey'
		case 'PLAYER':
			return color = 'purple';
		case BLANK_VALUE:
			return color = 'white';
		case WALL_VALUE:
			return color = "black";
		case 'WEAPON':
			return color = "blue";
		case 'HEALTH':
			return color = 'green';
		case 'ENEMY':
			return color = 'red';
		case 'BOSS':
			return color = 'orange';
		default:
			alert("unknown object type detected")
			return color = 'white';
	};   
};

class WorldView extends Component {
	render() {
		const { gameState } = this.props;
	   	var gameTiles = []; 
	   	var counter = 0;
	   	for (var x = 0; x < gameState.size; x++) {
	    	for (var y = 0; y < gameState.size; y++) {
	    		var tileValue;
	    		//This was player x and player x, need a y
	    		if (closeToPlayer(gameState.playerXLocation, gameState.playerYLocation, x, y, 3)) {
						var gameItem = gameState.world[x][y];
						if (gameItem.hasOwnProperty('type')) {
						 	tileValue = gameItem['type'];
						}
						if (typeof gameState.world[x][y] === 'number') {
							tileValue = gameState.world[x][y];
						}
						console.log("cannot render unknown object type");
						tileValue = null;
	    		};
	    		tileValue = 'FOG';

					gameTiles.push(
						<GameTile
					   	color = {colorAssigner(tileValue)}
					   	col = {x}
					   	row = {y}
					    key = {counter}
						>
					 	</GameTile>
					);
					counter++;
			};
		};
		var style = {
			width: gameState.size * GRID_SIZE,
			height: gameState.size * GRID_SIZE,
			background: 'yellow',
			position: 'absolute'
		};
		return (
			<div id="world" style={style}>
				{gameTiles}
			</div>
		)
	}
};
 
class GameContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {gameState: this.props.gameState, playerAction: false, interval: null, mapFog: true}
		this.gameTick = this.gameTick.bind(this)
		this.keyHandler = this.keyHandler.bind(this)
		this.clickHandler = this.clickHandler.bind(this)
		this.componentDidMount = this.componentDidMount.bind(this)
		this.componentWillUnmount = this.componentWillUnmount.bind(this)
		this.resetGame = this.resetGame.bind(this)
	}
	gameTick() {
		store.dispatch(makeMove(this.state.playerAction));
		this.setState({playerAction: false})
	}
	keyHandler(e) {
		console.log("key press detected as" + e.keyCode)
		this.setState({playerAction: e.keyCode});
	}
	toggleFog() {
		this.setState({mapFog: !this.state.mapFog})
	}
	clickHandler() {
		console.log("I have been clicked");
	}
	startGame() {
		window.addEventListener('keydown', this.keyHandler);
		var interval = setInterval(this.gameTick, 150);
		this.setState({interval: interval});
	}
	resetGame() {
		alert("reset game called")
		clearInterval(this.state.interval);
		store.dispatch(resetGame());
	}
	componentDidMount() {
		window.addEventListener('keydown', this.keyHandler);
		var interval = setInterval(this.gameTick, 150);
		this.setState({interval: interval});
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.keyHandler);
	}
	render() {
		const {gameState} = this.props;
		return (
			<div>
				<div className="infoPanel">
					Ryan's Game
					Player Location: {gameState.playerXLocation}, {gameState.playerYLocation}
					Player Stats: {gameState.playerHealth}, {gameState.playerAttack}
				</div>
				<div className="controlPanel">
					<button onClick={this.startGame}> Start Game </button>
					<button onCLick={this.resetGame}> Reset Game </button>
				</div>
				<div className="GameContainer">
					<WorldView gameState={this.props.gameState} onCLick={this.clickHandler} />
				</div>
			</div>
		)
	}
};

//Map dispatch to props?
var DynamicGameContainer = connect(
  function mapStateToProps(state) {
    return {gameState: state}
  }
)(GameContainer)

//Create Middleware here
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    /*
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    */
    throw err
  }
}

console.log("starting everything")
//Must be an even number - Worry about callbacks here?
var initalGameState = new GameState(30)
seedWorld(initalGameState);
let store = createStore(gameReducer, 
	initalGameState, 
	applyMiddleware(logger, crashReporter));

ReactDOM.render( 
  <Provider store={store}>
    <DynamicGameContainer />
  </Provider>,
  document.getElementById('content')
)
