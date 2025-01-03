export const fetchNutrientInfo = async (label) => {
    try {
      const response = await fetch(`https://api.nutrient.com/nutrient?food=${label}`);
      return response.ok ? response.json() : {};
    } catch (error) {
      console.error(`Error fetching nutrient info for ${label}:`, error);
      return {};
    }
  };
  
  export const fetchRecipes = async (label, baseURL, apiID, apiKey) => {
    try {
      const response = await fetch(`${baseURL}recipes/v2?type=public&q=${label}&app_id=${apiID}&app_key=${apiKey}`);
      return response.ok ? (await response.json()).hits.map(hit => hit.recipe) : [];
    } catch (error) {
      console.error(`Error fetching recipes for ${label}:`, error);
      return [];
    }
  };
  