import { createStore. applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';


/* REDUX */
const UPDATE_TEXT = 'UPDATE_TEXT';
var updateText = function(text) {
  return {type: UPDATE_TEXT, text};
}

function markDownReducer(state = "InitalValue", action) { 
  switch(action.type) {
    case UPDATE_TEXT:
      return action.text;
    default: 
      return state;
  }
};

/* React */
class MarkDownDisplay extends Component {
  constructor(props) {
    super(props);
  }

  markUp() {
    const { text } = this.props;
    return { __html: marked(text, {sanitize: true}) };
  }

  render() {
    return (
      <div className="markDownDisplay">
        <div className="content" dangerouslySetInnerHTML={this.markUp()} />
      </div>
    )
  }
};

MarkDownDisplay.propTypes = {
  text: PropTypes.string.isRequired
}

class MarkDownInput extends Component {
  constructor(props) {
    super(props);
    const { text } = this.props;
    this.state = {text: text};
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    this.setState({
      text: e.target.value
    }, function() {
      store.dispatch(updateText(this.state.text));
    })
  }

  render() {
   return (
     <div className="markDownInput">
       <input type="text" onChange={this.changeHandler} value={this.state.text} />
     </div>
   )   
  }  
};

MarkDownInput.propTypes = {
  text: PropTypes.string.isRequired
}

class MarkDownApp extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="markDownApp">
        <MarkDownInput text={this.props.text} />
        <MarkDownDisplay text={this.props.text} />
      </div>
    )
  }
};

MarkDownApp.propTypes = {
  text: PropTypes.string.isRequired
};

var MarkDown = connect(
  function mapStateToProps(state) {
    return {text: state};
  }
)(MarkDownApp);


//Middleware Declaration
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    throw err;
  }
};

/*App Driver*/
let store = createStore(markDownReducer, applyMiddleware(logger, crashReporter));

ReactDOM.render(
  <Provider store={store}>
    <MarkDown/>
  </Provider>,
  document.getElementById('content')
);