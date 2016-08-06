import { createBoard, runBoard } from './lifeLogic.js';
var _ = require('lodash');

const PLAY_BOARD = 'PLAY_BOARD';
const RESET_BOARD = 'RESET_BOARD';
const LOAD_STORE = 'LOAD_STORE';

export function playBoard() {
  return {type: PLAY_BOARD};
};

export function resetBoard(size) {
  return {type: RESET_BOARD, size: size};
};

function lifeReducer(state = {size: 2, board: [[0],[0]]}, action) {
  switch (action.type) {
    case 'LOAD_STORE':
      return action.boardState;
    case 'PLAY_BOARD':
      var newState = _.cloneDeep(state);
      var size = newState.size;
      var newBoard = runBoard(state.board);
      return {
        size: size,
        board: newBoard
      };
    case 'RESET_BOARD':
      console.log('reset board');
      var newState = createBoard(action.size);
      return {
        size: action.size,
        board: newState
      };
    default:
      console.log('reduce state called');
      return state;
  }
};

export default lifeReducer
