import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts'; 
import {
  Box, Card, Typography, TextField, Grid, MenuItem, Select, FormControl, InputLabel, Button} from '@mui/material';

const app_id = process.env.REACT_APP_APP_ID;
const app_key = process.env.REACT_APP_APP_KEY;

const FoodIngredients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNutrients, setLoadingNutrients] = useState(false);
  const [activeMeal, setActiveMeal] = useState(null);
  const [nutrientData, setNutrientData] = useState({});
  
  useEffect(() => {
    const fetchAllMeals = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();

        if (data.meals) {
          setAllMeals(data.meals);
        } 
        else {
          setAllMeals([]);
        }
      } catch (error) {
        console.error('Error fetching all meals:', error);
      }
    };
    fetchAllMeals();
  }, []);

  const fetchIngredients = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
      const data = await response.json();

      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNutrientData = async (meal) => {
    setActiveMeal(meal);
    const ingredients = Array.from({ length: 20 }, (_, i) => {
      const ingredient = meal[`strIngredient${i + 1}`];
      const measure = meal[`strMeasure${i + 1}`];
      return ingredient && measure ? `${measure} ${ingredient}` : null;
    }).filter(Boolean);
  
    const recipe = ingredients.join(', ');
  
    setLoadingNutrients(true);
    try {
      const response = await fetch(
        `https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&ingr=${encodeURIComponent(recipe)}`
      );
      const data = await response.json();
      setNutrientData((prevData) => ({
        ...prevData,
        [meal.idMeal]: data, 
      }));
    } catch (error) {
      console.error('Error fetching nutrient data:', error);
    } finally {
      setLoadingNutrients(false);
    }
  };  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);

  };

  useEffect(() => {
    // Triggers the search as soon as the query changes
    if (searchQuery) {
      fetchIngredients();
    } else {
      setMeals([]);
    }
  }, [searchQuery]);
  const [suggestions, setSuggestions] = useState([[], []]); // New state for suggestions
  
  return (
    <section className="min-h-screen py-10 text-gray-600 body-font bg-purple-50">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
          RECIPE RETRIEVAL
          </h2>
          <h1 className=" text-m font-medium title-font text-gray-500">
          Search for Food Ingredients
          </h1>
        </div>

        <Box component="form" display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            label="Search food"
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
          >
            {suggestions[0].map((suggestion, index) => (
              <MenuItem key={index} value={suggestion}>
                {suggestion}
              </MenuItem>
            ))}
          </TextField>
           <FormControl Width={1} variant="outlined">
            <InputLabel id="food-select-label"></InputLabel>
            <Select
              labelId="food-select-label"
              value={searchQuery}
              onChange={handleSearchChange}
              label="Select or Search Food"
              displayEmpty
            >
              <MenuItem value="">Select a Food</MenuItem>
              {allMeals.map((meal) => (
                <MenuItem key={meal.idMeal} value={meal.strMeal}>
                  {meal.strMeal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {loading ? (
          <Typography variant="body2" color="textSecondary">
            Loading meals...
          </Typography>
        ) : meals.length > 0 ? (
          <Grid container spacing={3}>
            {meals.map((meal) => (
              <Grid item xs={12} key={meal.idMeal}>
                <Card sx={{ display: 'flex', flexDirection: 'row', borderRadius: 2, boxShadow: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      style={{ width: '100%', objectFit: 'cover', borderRadius: '0 8px 8px 0' }}
                    />
              <Button
                variant="contained"
                sx={{ml:1, mt:2, backgroundColor: 'rgb(138, 77, 255)'}}
                onClick={() => fetchNutrientData(meal)}
                size="small"
              >
                Get Nutritional Info
              </Button>
                {loadingNutrients ? (
              <Typography variant="body2">Fetching nutrient data...</Typography>
            ) : nutrientData[meal.idMeal] ? (
              <Box mb={2}>
                  <PieChart width={300} height={230}>
                    <Pie
                      data={[
                        { name: 'Calories', value: nutrientData[meal.idMeal]?.calories || 0 },
                        { name: 'Protein', value: nutrientData[meal.idMeal]?.totalNutrients?.PROCNT?.quantity || 0 },
                        { name: 'Fat', value: nutrientData[meal.idMeal]?.totalNutrients?.FAT?.quantity || 0 },
                        { name: 'Carbs', value: nutrientData[meal.idMeal]?.totalNutrients?.CHOCDF?.quantity || 0 },
                      ]}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}
                    >
                      <Cell name="Calories" fill="#FF6384" />
                      <Cell name="Protein" fill="#36A2EB" />
                      <Cell name="Fat" fill="#FFCE56" />
                      <Cell name="Carbs" fill="#4BC0C0" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </Box>
              ) : null}
            </Box> 
                  <Box sx={{ flex: 2, p: 2, position: 'relative' }}>
                    <Typography variant="h6" component="h3"   gutterBottom sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'purple' }}>
                    {meal.strMeal}
                    </Typography>

                    {/* Display ingredients and instructions */}
                    <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                      Ingredients
                    </Typography>
                    <Grid container spacing={1}>
                      {Array.from({ length: 20 }, (_, i) => {
                        const ingredient = meal[`strIngredient${i + 1}`];
                        const measure = meal[`strMeasure${i + 1}`];
                        return ingredient ? (
                          <Grid item xs={6} sm={4} md={3} key={i}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                              <img
                                src={`https://www.themealdb.com/images/ingredients/${ingredient}-Small.png`}
                                alt={ingredient}
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '8px',
                                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                  marginBottom: '8px',
                                }}
                              />
                              <Typography variant="body2" align="center" sx={{ fontSize: '0.8rem', color: 'grey' }}>
                                {measure} {ingredient}
                              </Typography>
                            </Box>
                          </Grid>
                        ) : null;
                      })}
                    </Grid>
                    <Box mt={3}>
                      <Typography variant="h6" component="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                        Instructions
                      </Typography>
                      <Typography variant="body1" color="textSecondary" sx={{ fontSize: '0.875rem' }}>
                        {meal.strInstructions || 'No instructions available.'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" component="h6" color="textSecondary">
            No meals found. Try searching for a different food.
          </Typography>
        )}
    </div>
    </section>
  );
};

export default FoodIngredients;
