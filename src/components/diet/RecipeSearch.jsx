import React, { useState, useEffect } from "react";
import RecipeModal from "./RecipeModal";
import { TextField, Select, MenuItem, Checkbox, Menu, FormControlLabel } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { cuisineBasedIngredients, healthLabelOptions} from "./data";

const RECIPE_API_BASE = "https://api.edamam.com/api/recipes/v2";
const API_PARAMS = {
  app_id: process.env.REACT_APP_APP_ID_1,
  app_key: process.env.REACT_APP_APP_KEY_1,
};

const defaultIngredients = ["Tomato", "Onion", "Garlic", "Chicken", "Rice"];
const cuisineOptions = [
  "American", "Asian", "British", "Caribbean", "Central Europe", "Chinese", "Eastern Europe",
  "French", "Greek", "Indian", "Italian", "Japanese", "Korean", "Kosher", "Mediterranean",
  "Mexican", "Middle Eastern", "Nordic", "South American", "South East Asian", "Spanish", "Thai",
];

const RecipeSearch = () => {
  const [state, setState] = useState({
    ingredientsList: [],
    results: [],
    alertMessage: "",
    loading: false,
    cuisineType: "",
    healthLabels: [],
    mealType: "",
    selectedRecipe: null,
  });

  const [searchCuisine, setSearchCuisine] = useState("");
  const [ingredientSuggestions, setIngredientSuggestions] = useState(defaultIngredients);
  const [anchorEl, setAnchorEl] = useState(null);

  const updateState = (key, value) => setState((prev) => ({ ...prev, [key]: value }));

  const handleCheckboxChange = (label) => {
    const updatedLabels = state.healthLabels.includes(label)
      ? state.healthLabels.filter((item) => item !== label)
      : [...state.healthLabels, label];
    updateState("healthLabels", updatedLabels);
  };

  const handleAddIngredient = (ingredient) => {
    if (ingredient && !state.ingredientsList.includes(ingredient)) {
      updateState("ingredientsList", [...state.ingredientsList, ingredient]);
    }
  };

  const handleRemoveIngredient = (index) => {
    updateState("ingredientsList", state.ingredientsList.filter((_, i) => i !== index));
  };

  const fetchRecipes = async () => {
    if (!state.ingredientsList.length) {
      updateState("alertMessage", "Please add at least one ingredient");
      return;
    }

    const params = new URLSearchParams({
      type: "public",
      q: state.ingredientsList.join(","),
      ...API_PARAMS,
      ...(state.cuisineType && { cuisineType: state.cuisineType.toLowerCase() }),
      ...(state.mealType && { mealType: state.mealType }),
    });

    state.healthLabels.forEach((label) => params.append("health", label));

    updateState("loading", true);
    try {
      const response = await fetch(`${RECIPE_API_BASE}?${params}`);
      const data = await response.json();
      updateState("results", data.hits || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      updateState("alertMessage", "An error occurred while fetching recipes.");
    } finally {
      updateState("loading", false);
    }
  };

  useEffect(() => {
    const suggestions = cuisineBasedIngredients[state.cuisineType] || defaultIngredients;
    setIngredientSuggestions(suggestions);
  }, [state.cuisineType]);

  return (
    <section className="min-h-screen py-10 text-gray-600 body-font bg-purple-50">
      <div className="max-w-6xl mx-auto p-4 bg-purple-50 rounded-lg">
        {state.alertMessage && <div className="mb-4 text-red-600 text-center">{state.alertMessage}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Autocomplete
            options={cuisineOptions}
            value={searchCuisine}
            onChange={(e, value) => updateState("cuisineType", value)}
            renderInput={(params) => (
              <TextField {...params} label="Cuisine Type" variant="outlined" fullWidth />
            )}
          />
          <Select
            value={state.mealType}
            onChange={(e) => updateState("mealType", e.target.value)}
            displayEmpty
            className="w-full"
          >
            <MenuItem value="">Select a Meal</MenuItem>
            {["Breakfast", "Lunch", "Snack", "Teatime", "Dinner"].map((meal) => (
              <MenuItem key={meal} value={meal.toLowerCase()}>{meal}</MenuItem>
            ))}
          </Select>
        </div>

        <div className="mt-4">
          <Autocomplete
            freeSolo
            options={ingredientSuggestions}
            onChange={(e, value) => handleAddIngredient(value)}
            renderInput={(params) => (
              <TextField {...params} label="Add Ingredient" variant="outlined" fullWidth />
            )}
          />
          <div className="flex flex-wrap gap-2 mt-4">
            {state.ingredientsList.map((ingredient, index) => (
              <div key={index} className="flex items-center px-3 py-1 bg-purple-100 rounded-full">
                {ingredient}
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <TextField
            label="Health Labels"
            value={state.healthLabels.join(", ") || "Select Health Labels"}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {healthLabelOptions.map((label) => (
              <MenuItem key={label} onClick={() => handleCheckboxChange(label)}>
                <FormControlLabel
                  control={<Checkbox checked={state.healthLabels.includes(label)} />}
                  label={label}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={fetchRecipes}
            className="px-8 py-2 bg-purple-500 text-white rounded-lg"
            disabled={state.loading}
          >
            {state.loading ? "Loading..." : "Search Recipes"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center text-gray-700">Results</h2>
          {state.results.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.results.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-lg">
                  <img src={item.recipe.image} alt={item.recipe.label} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h3 className="text-lg font-bold">{item.recipe.label}</h3>
                  <p>Cuisine: {item.recipe.cuisineType?.[0] || "Unknown"}</p>
                  <p>Calories: {Math.round(item.recipe.calories)}</p>
                  <button
                    onClick={() => updateState("selectedRecipe", item.recipe)}
                    className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-full"
                  >
                    View Recipe
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No recipes found.</p>
          )}
        </div>

        {state.selectedRecipe && (
          <RecipeModal
            isOpen={!!state.selectedRecipe}
            recipe={state.selectedRecipe}
            onClose={() => updateState("selectedRecipe", null)}
          />
        )}
      </div>
    </section>
  );
};

export default RecipeSearch;
