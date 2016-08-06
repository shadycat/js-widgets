import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { interact, resetGame } from './gameLogic.js'
var _ = require('lodash');
require('./game.css');

const MOVE_UP = 'MOVE_UP'; 
const MOVE_DOWN = 'MOVE_DOWN';
const MOVE_LEFT = 'MOVE_LEFT';
const MOVE_RIGHT = 'MOVE_RIGHT';
const RESET_GAME = 'RESET_GAME';
const INVALID = 'INVALID';

export function makeMove(userInput) {
  console.log(userInput)
  switch (userInput) {
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
  };
};

export function resetGameFunction() {
	return {type: RESET_GAME}
};

function gameReducer(state, action) {
  var newState = _.cloneDeep(state);
	var currX = state.playerXLocation;
	var currY = state.playerYLocation;
	switch(action.type) {
		case 'MOVE_UP':
			interact(newState, currX, currY, currX, currY - 1);
			return newState
		case 'MOVE_DOWN':
			interact(newState, currX, currY, currX, currY + 1);
			return newState
		case 'MOVE_LEFT':
			interact(newState, currX, currY, currX - 1, currY);
			return newState
		case 'MOVE_RIGHT':
      interact(newState, currX, currY, currX + 1, currY);
			return newState
		case 'RESET_GAME':
      resetGame(newState);
      return newState
    case 'INVALID':
      return state
		default:
			console.log("Not a known reducer trigger")
      return state
	};
};

export default gameReducer;
