/*Constants and Actions for Redux */
export const ADD_RECIPE = 'ADD_RECIPE';
export const UPDATE_RECIPE_NAME = 'UPDATE_RECIPE_NAME';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const HIGHLIGHT_TOGGLE = 'HIGHLIGHT_TOGGLE';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

export const addRecipe = (recipeName) => {
  return {type: ADD_RECIPE, recipeName};
};

export const updateRecipeName = (oldRecipeName, newRecipeName) => {
  return {type: UPDATE_RECIPE_NAME, oldRecipeName: oldRecipeName, newRecipeName: newRecipeName};
};

export const deleteRecipe = (recipeName) => {
  return {type: DELETE_RECIPE, recipeName};
};

export const addIngredient = (recipeName, ingredient) => {
  return {type: ADD_INGREDIENT, recipeName: recipeName, ingredient: ingredient};
};

export const updateIngredient = (recipeName, oldIngredient, newIngredient) => {
  return {type: UPDATE_INGREDIENT, recipeName: recipeName, oldIngredient: oldIngredient, newIngredient: newIngredient};
};

export const deleteIngredient = (recipeName, ingredient) => {
  return {type: DELETE_INGREDIENT, recipeName: recipeName, ingredient: ingredient};
};

export const highlightToggle = (recipeName) => {
  return {type: HIGHLIGHT_TOGGLE, recipeName};
};

export const showModal = (action, recipe, ingredient) => {
  console.log("show modals is called")
  return {
    type: SHOW_MODAL,
    modalType: action,
    modalProps: {
      recipe: recipe,
      ingredient: ingredient
    }
  }
}

export const hideModal = () => {
  return {type: HIDE_MODAL};
};