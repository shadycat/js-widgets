import recipeReducer from './recipeReduxReducer';
import { PropTypes, Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { addRecipe,
  updateRecipeName, deleteRecipe,
  addIngredient, updateIngredient,
  deleteIngredient, showModal,
  hideModal, highlightToggle
} from './recipeReduxActions';
var Modal = require('react-modal');

class GenericForm extends Component {
  constructor(props) {
    super(props)
    this.state = {field: ""};
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }
  changeHandler(e) {
    this.setState({
      field: e.target.value
    });
  }
  submitHandler() {
    const { formData, formType } = this.props;
    switch(formType) {
      case 'ADD_RECIPE':
        store.dispatch(addRecipe(this.state.field));
        break;
      case 'UPDATE_RECIPE_NAME':
        store.dispatch(updateRecipeName(formData.recipe, this.state.field));
        break;
      case 'ADD_INGREDIENT':
        store.dispatch(addIngredient(formData.recipe, this.state.field));
        break;
      case 'UPDATE_INGREDIENT':
        store.dispatch(updateIngredient(formData.recipe, formData.ingredient, this.state.field));
        break;
      default:
        console.log("Form Submit Handler not recognized")
    }
    store.dispatch(hideModal());
  }
  render() {
    return (
      <div>
          <input type="text" onChange={this.changeHandler} value={this.state.item} />
          <button onClick={this.submitHandler}> dumbSubmit </button>
      </div>
    )
  }
};

GenericForm.propTypes = {
  formData: PropTypes.object.isRequired,
  formType: PropTypes.string.isRequired
};

class IngredientItem extends Component {
  constructor(props) {
    super(props)
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.updateIngredientModal = this.updateIngredientModal.bind(this);
  }
  deleteIngredient() {
    const { recipe, ingredient } = this.props;
    console.log("del ingredient called" + recipe + ingredient);
    store.dispatch(deleteIngredient(recipe, ingredient));
  }
  updateIngredientModal() {
    const { recipe, ingredient } = this.props;
    store.dispatch(showModal("UPDATE_INGREDIENT", recipe, ingredient));
  }
  render() {
    const { ingredient } = this.props;
    return (
      <div className="ingredientBlock">
        <div className="ingredient" onClick={this.updateIngredientModal}>
          {ingredient}
        </div>
        <button onClick={this.deleteIngredient} class="btn btn-danger"> Remove </button>
      </div>  
    )
  }
};

IngredientItem.propTypes = {
  ingredient: PropTypes.string.isRequired
}

class RecipeItem extends Component {
  constructor(props) {
    super(props);
    this.addIngredientModal = this.addIngredientModal.bind(this) ;
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.updateRecipeModal = this.updateRecipeModal.bind(this);
    this.highlightToggle = this.highlightToggle.bind(this);
  }
  addIngredientModal() {
    store.dispatch(showModal('ADD_INGREDIENT', this.props.name));
  }
  deleteRecipe() {
    store.dispatch(deleteRecipe(this.props.name));
  }
  updateRecipeModal() {
    store.dispatch(showModal('UPDATE_RECIPE_NAME', this.props.name));
  }
  highlightToggle() {
    store.dispatch(highlightToggle(this.props.name));
  }
  render() {
    const {ingredients, name} = this.props;
    var ingredientNodes = ingredients.map(ingredient => 
        <IngredientItem ingredient={ingredient} key={Date.now().toString()} recipe={name} />
    );
    return (
      <div className = "recipeBlock" onClick={this.highlightToggle}>
        <div className = "titleBar" onClick={this.updateRecipeModal}>
          Recipe Name
          {name}
        </div>
        <div className = "ingredientList">
          Recipe Ingredients
          {ingredientNodes}
        </div>
          Recipe Buttons
        <button onClick={this.addIngredientModal}> Add Ingredient </button>
        <button onClick={this.deleteRecipe}> Delete Recipe </button>
      </div>
    )
  }
};

RecipeItem.propTypes = {
  ingredients: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired
};

class RecipeBox extends Component {
  constructor(props) {
    super(props);
    this.state = props.appState;
    this.hideModal = this.hideModal.bind(this);
    this.addRecipeModal = this.addRecipeModal.bind(this);
  }
  hideModal() {
    store.dispatch(hideModal());
  }
  addRecipeModal() {
    store.dispatch(showModal('ADD_RECIPE'));
  }
  render() {
    if (this.props.appState) {
      const { appState } = this.props;
      console.log("This is the state we are recieving");
      var recipeNodes = appState.recipeBoxReducer.recipes.map(function(recipes) {
        console.log("recipe object recieved in recipe map");
        console.log(recipes);
        return (
          <RecipeItem ingredients={recipes.ingredients} key={Date.now().toString()} name={recipes.name} active={recipes.active} />
        )
      })
      if (appState.modalReducer.modalType) {
        var activeModal = true;
      }
      else {
        var activeModal = false;
      }
      console.log(appState);
      return (
        <div className="recipeBox">
          Welcome To Recipe Box 
          <button onClick={this.addRecipeModal}> Add Recipe </button>
          {recipeNodes}
          The Non Loading Page
          <Modal
            isOpen={activeModal}
          >
            <button onClick={this.hideModal}> Close Modal </button>
            Modal Content
            Form Type{appState.modalReducer.modalType}
            <GenericForm
              formType={appState.modalReducer.modalType}
              formData={appState.modalReducer.modalProps}
            />
          </Modal>
        </div>
      )
    }
    else {
      return (
        <div>
          Recipe Box Loading Page
        </div>
      )
    }
  }
};

var DynamicRecipeBox = connect(
  function mapStateToProps(state) {
    return {appState: state};
  },
  function mapDispatchToProps(dispatch) {
    return {
      addRecipe: recipe => dispatch(addRecipe(recipe));
    }
  }
)(RecipeBox);

//Middleware Declarations
const logger = store => next => action => {
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    throw err;
  }
};


/* APP Driver */
let store = createStore(recipeReducer, applyMiddleware(logger, crashReporter))
ReactDOM.render(
  <Provider store={store}>
    <DynamicRecipeBox />
  </Provider>,
  document.getElementById('content')
);
