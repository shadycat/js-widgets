import lifeReducer from './lifeRedux.js';
import { PropTypes, Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { playBoard, resetBoard } from './lifeRedux';
import { Board } from './lifeLogic.js';

var GRID_SIZE = 30;

class BoardTile extends Component {
  render() {
    const {row, col, value} = this.props;
    var color = 'blue';
    if (value === 1) {
     color = 'black';
    }   
    else {
     color = "white";
    }   
    var style = { 
     top: row * GRID_SIZE,
     left: col * GRID_SIZE,
     width: GRID_SIZE,
     height: GRID_SIZE,
     background: color,
     border: "solid",
     position: 'absolute'
    }   
    return (
     <div className="boardTile" style={style}>
       {value}
     </div>
    )   
  }
};

BoardTile.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

class BoardView extends Component {
  render() { 
    const { board } = this.props;
     var tiles = []; 
     var counter = 0;
     for (var i = 0; i < board.size; i++) {
       for (var j = 0; j < board.size; j++) {
         tiles.push(
           <BoardTile board={ board }
             value={board.board[i][j]}
             row = {i}
             col = {j}
             key = {counter}
           >
           </BoardTile>
         );
         counter = counter + 1;
       }
     }
     var style = {
       width: board.size * GRID_SIZE,
       height: board.size * GRID_SIZE,
       background: 'red',
       position: 'absolute'
     }
     return (
       <div id="board" style={style}>
         {tiles}
       </div>
     )
    }
};

BoardView.propTypes = {
  board: PropTypes.object.isRequired
};

class GameContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {boardState: this.props.boardState, interval: false};
    this.runBoard = this.runBoard.bind(this);
    this.startBoard = this.startBoard.bind(this);
    this.stopBoard = this.stopBoard.bind(this);
    this.resetBoard = this.resetBoard.bind(this);
  }

  runBoard() {
   store.dispatch(playBoard());
  }

  componentDidMount() {
    console.log("starting the game")
  }

  startBoard() {
    console.log("Star Board on Click")
    var interval = setInterval(this.runBoard, 1000);
    this.setState({interval: interval});
  }

  stopBoard() {
    alert("Life Progress is being stopped");
    clearInterval(this.state.interval);

  }

  resetBoard() {
    store.dispatch(resetBoard(this.props.boardState.size));
    clearInterval(this.state.interval);
  }

  render() {
    const { boardState } = this.props;
    if (boardState) {
      return (
        <div>
          This is the game board
          <button onClick={this.startBoard}> Start Life </button>
          <button onClick={this.stopBoard}> End Life </button>
          <button onClick={this.resetBoard}> Reset Board </button>
          <BoardView board={boardState} />
        </div>
      )
    }
    else {
      return (
          <div>
          This is the loading page of life 
         </div>
      )
    }
  }
};

GameContainer.propTypes = {
  boardState: PropTypes.object.isRequired
}

var DynamicBoard = connect(
  function mapStateToProps(state) {
    return {boardState: state};
  }
)(GameContainer)

//Middleware Declaration
const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
};

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    throw err
  }
};


var board = new Board(30);
let store = createStore(lifeReducer, board, applyMiddleware(logger, crashReporter));

ReactDOM.render(
  <Provider store={store}>
    <DynamicBoard/>
  </Provider>,
  document.getElementById('content')
);
