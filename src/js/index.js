import Search from "./models/Search";
import Recipe from "./models/Recipe";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";

/*
Global state of the app
Search object
Current recipe object
Shopping list object
liked recipes
 */
const state = {};

/**
 *  Search Controler
 */
const controlSearch = async () => {
  // 1) Get query from view
  const query = searchView.getInput();
  //console.log(query);

  if (query) {
    // 2) New search object and add to state
    state.search = new Search(query);

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("Error processing your search.");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/**
 *  Recipe Controler
 */
const controlRecipe = async () => {
  // Get IF from url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    
    // Highlight selected search item
    if (state.search) { 
      searchView.highlightSelected(id);
    };

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);

    } catch (error) {
      alert("Error processing recipe.");
    }
  }
};

window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);
// alt write ['hashchange', 'load;'].forEach(e => window.addEventListener(event, controlRecipe));
