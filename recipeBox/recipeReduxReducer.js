import { combineReducers } from 'redux';
import { ADD_RECIPE, UPDATE_RECIPE_NAME,
  DELETE_RECIPE, UPDATE_INGREDIENT, 
  ADD_INGREDIENT, DELETE_INGREDIENT,
  HIGHLIGHT_TOGGLE, SHOW_MODAL,
  HIDE_MODAL
} from './recipeReduxActions';
var _ = require('lodash');

function modalReducer(state = {modalType: null, modalProps: {}}, action) {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      }
    case 'HIDE_MODAL':
      return {modalType: null, modalProps: {}}
    default:
      return state;
  }
}


var indexFinder = function(array, item) {
  if (typeof array[0] === 'object') {
    console.log("recipe search")
    console.log(array, item)
    for (var i = 0; i < array.length; i++) {
      if (array[i].name === item) {
        return i
      }
    }
  }
  else {
    console.log("ingredient search")
    console.log(array, item)
    for (var i = 0; i < array.length; i++) {
      if (array[i] === item) {
        return i
      }
    }
  }
}

function recipeBoxReducer(state =  {recipes: []}, action) {
  var newState = _.cloneDeep(state);
  switch (action.type) {
    case ADD_RECIPE:
      newState.recipes.push({
        name: action.recipeName,
        ingredients: [],
        active: true
      });
      return newState;

    case UPDATE_RECIPE_NAME:
      var recipeIndex = indexFinder(state.recipes, action.oldRecipeName);
      if (recipeIndex > -1) {
        newState.recipes[recipeIndex].name = action.newRecipeName;
        return newState;
      }
      else {
        console.log("recipe does not exist");
        return state;
      }

    case DELETE_RECIPE:
      var recipeIndex = indexFinder(state.recipes, action.recipeName);
      if (recipeIndex > -1) {
        newState.recipes.splice(recipeIndex, 1);
        return newState;
      }
      else {
        console.log("recipe does not exist");
        return state;
      }

    case ADD_INGREDIENT:
      var recipeIndex = indexFinder(state.recipes, action.recipeName);
      if (recipeIndex > -1) {
        newState.recipes[recipeIndex].ingredients.push(action.ingredient);
        return newState
      }
      else {
        console.log("recipe does not exist");
        return state;
      }

    case UPDATE_INGREDIENT:
      var recipeIndex = indexFinder(state.recipes, action.recipeName);
      if (recipeIndex > -1) {
        var ingredientIndex = indexFinder(state.recipes[recipeIndex].ingredients, action.oldIngredient);
        if (ingredientIndex > -1) {
          newState.recipes[recipeIndex].ingredients[ingredientIndex] = action.newIngredient;
          return newState
        }
        else {
          console.log("ingredient not found");
          return state;
        }
      }
      else {
        console.log("recipe not found");
        return state;
      }

    case DELETE_INGREDIENT:
      var recipeIndex = indexFinder(state.recipes, action.recipeName);
      if (recipeIndex > -1) {
        var ingredientIndex = indexFinder(state.recipes[recipeIndex].ingredients, action.oldIngredient);
        if (ingredientIndex > -1) {
          newState.recipes[recipeIndex].ingredients.splice(ingredientIndex, 1);
          return newState;
        }
        else {
          console.log("ingredient not found");
          return state;
        }
      }
      else {
        console.log("recipe not found");
        return state;
      }

    case HIGHLIGHT_TOGGLE:
      var recipeIndex = indexFinder(newState.recipes, action.recipeName);
      if (recipeIndex > -1) {
        newState.recipes[recipeIndex].active = !newState.recipes[recipeIndex].active;
        return newState;
      }
      else {
        console.log("recipe not found");
        return state;
      }

    default: 
      console.log("default case none were hit")
      return state;
  }
}

const recipeReducer = combineReducers({
  modalReducer,
  recipeBoxReducer
});

export default recipeReducer
