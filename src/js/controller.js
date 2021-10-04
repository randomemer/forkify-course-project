import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

if (module.hot) {
	module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2
// http://localhost:1234/#5ed6604591c37cdc054bc886

///////////////////////////////////////
// console.log("test");

const controlRecipes = async function () {
	try {
		const id = window.location.hash.slice(1);
		// console.log(id);

		if (!id) {
			return;
		}

		recipeView.renderSpinner();

		// Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());

		bookmarksView.update(model.state.bookmarks);

		// Loading recipe
		await model.loadRecipe(id);

		// Rendering recipe
		recipeView.render(model.state.recipe);

		//test
		// controlServings();
	} catch (error) {
		// alert(error);
		recipeView.renderError();
	}
};
// showRecipe();

async function controlSearchResults() {
	try {
		resultsView.renderSpinner();

		const query = searchView.getQuery();
		if (!query) {
			return;
		}

		// Load search Results
		await model.loadSearchResults(query);

		// Render search results
		// resultsView.render(model.state.search.results);
		resultsView.render(model.getSearchResultsPage());

		// Render inital pagination buttons
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
}
// controlSearchResults();

function controlPagination(goToPage) {
	// console.log("page control lol", goToPage);

	resultsView.render(model.getSearchResultsPage(goToPage));

	model.state.search.page = goToPage;
	paginationView.render(model.state.search);
}

function controlServings(newServings) {
	// Update the recipe servings  (in state)
	model.updateServings(newServings);
	// Update the recipe view
	recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
	if (!model.state.recipe.bookmarked) {
		model.addBookmark(model.state.recipe);
	} else {
		model.deleteBookmark(model.state.recipe.id);
	}

	// console.log(model.state.bookmarks);
	recipeView.update(model.state.recipe);

	bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
	bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(data) {
	// console.log(data);
	try {
		// Show loading spinner
		addRecipeView.renderSpinner();

		await model.uploadRecipe(data);
		console.log(model.state.recipe);

		recipeView.render(model.state.recipe);

		// Success message
		addRecipeView.renderMessage();

		// Render bookmark view
		bookmarksView.render(model.state.bookmarks);

		// Change ID in url
		window.history.pushState(null, "", `#${model.state.recipe.id}`);

		// Close form window
		setTimeout(() => {
			addRecipeView._toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (error) {
		console.log("🦮", error);
		addRecipeView.renderError(error.message);
	}
}

function newFeature() {
	console.log("Welcome to the application");
}

function init() {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
	newFeature();
}
init();
