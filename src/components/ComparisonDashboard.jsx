import React, { useState, useEffect } from 'react';
import { Box, CardContent, Typography, TextField, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const app_id = process.env.REACT_APP_APP_ID;
const app_key = process.env.REACT_APP_APP_KEY;

const ComparisonDashboard = () => {
  const [searchQueries, setSearchQueries] = useState(['', '']);
  const [data, setData] = useState([{
    ingredients: [],
    nutrientData: null,
    loading: true,
    error: null,
    showNutrientInfo: true,
    suggestions: []
  }, {
    ingredients: [],
    nutrientData: null,
    loading: true,
    error: null,
    showNutrientInfo: true,
    suggestions: []
  }]);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#66FF66', '#FF4444', '#33B5E5', '#AA66CC'];

  const fetchSuggestions = async (input, index) => {
    if (input.length < 2) return;
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`);
      const { meals } = await response.json();
      setData(prev => {
        const updated = [...prev];
        updated[index].suggestions = meals ? meals.map(meal => meal.strMeal) : [];
        return updated;
      });
    } catch (err) {
      console.error('Error fetching dish suggestions:', err);
    }
  };

  useEffect(() => {
    data.forEach((item, index) => {
      if (item.ingredients.length > 0) {
        fetchNutritionalData(index);
      }
    });
  }, [data]);

  const handleSearchChange = (e, index) => {
    const value = e.target.value;
    setSearchQueries(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    value.length > 1 ? fetchSuggestions(value, index) : setData(prev => prev.map((item, i) => i === index ? { ...item, suggestions: [] } : item));
  };

  const fetchIngredients = async (index) => {
    if (!searchQueries[index]) return;
    setData(prev => prev.map((item, i) => i === index ? { ...item, loading: true } : item));
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQueries[index]}`);
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        const meal = data.meals[0];
        setData(prev => prev.map((item, i) => i === index ? {
          ...item,
          ingredients: Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`] && meal[`strMeasure${i + 1}`] ? `${meal[`strMeasure${i + 1}`]} ${meal[`strIngredient${i + 1}`]}` : null).filter(Boolean),
          nutrientData: null,
          loading: false,
          error: null
        } : item));
      } else {
        setData(prev => prev.map((item, i) => i === index ? { ...item, error: 'No dish found. Try another search.', loading: false } : item));
      }
    } catch (err) {
      setData(prev => prev.map((item, i) => i === index ? { ...item, error: 'Error fetching ingredients. Please try again.', loading: false } : item));
    }
  };

  const fetchNutritionalData = async (index) => {
    if (data[index].ingredients.length === 0) return;
    setData(prev => prev.map((item, i) => i === index ? { ...item, loading: true } : item));
    const recipe = data[index].ingredients.join(', ');
    try {
      const response = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&ingr=${encodeURIComponent(recipe)}`);
      const result = await response.json();
      if (result.calories || result.totalNutrients) {
        setData(prev => prev.map((item, i) => i === index ? { ...item, nutrientData: result, loading: false } : item));
      } else {
        setData(prev => prev.map((item, i) => i === index ? { ...item, error: 'Unable to fetch nutritional data for this dish.', loading: false } : item));
      }
    } catch (err) {
      setData(prev => prev.map((item, i) => i === index ? { ...item, error: 'Error fetching nutritional data. Please try again.', loading: false } : item));
    }
  };

  const getPieChartData = (data) => {
    if (!data) return [];
    return [
      { name: 'Calories', value: data.calories || 0 },
      { name: 'Protein', value: data.totalNutrients?.PROCNT?.quantity || 0 },
      { name: 'Fat', value: data.totalNutrients?.FAT?.quantity || 0 },
      { name: 'Carbs', value: data.totalNutrients?.CHOCDF?.quantity || 0 },
    ];
  };

  const convertToStandardUnit = (value, unit) => {
    if (unit === 'mg') return value / 1000;
    if (unit === 'µg') return value / 1000000;
    return value;
  };

  const transformNutrientData = (data, dishName) =>
    Object.keys(data?.totalNutrients || {}).map(nutrient => ({
      name: `${data.totalNutrients[nutrient].label} (${data.totalNutrients[nutrient].unit || ''})`,
      [dishName]: convertToStandardUnit(data.totalNutrients[nutrient].quantity || 0, data.totalNutrients[nutrient].unit)
    }));

  const getBarChartData = (data1, data2, dishName1, dishName2) => {
    const mergedData = [...transformNutrientData(data1, dishName1), ...transformNutrientData(data2, dishName2)];
    return mergedData.reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.name);
      if (existing) {
        existing[dishName1] = existing[dishName1] || curr[dishName1];
        existing[dishName2] = existing[dishName2] || curr[dishName2];
      } else {
        acc.push(curr);
      }
      return acc;
    }, []).filter(item => (item[dishName1] || 0) > 2 || (item[dishName2] || 0) > 2);
  };

  const renderPieChart = (index) => (
    <PieChart width={300} height={300}>
      <Pie data={getPieChartData(data[index].nutrientData)} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
        {getPieChartData(data[index].nutrientData).map((entry, i) => (
          <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );

  return (
    <section className="min-h-screen py-10 text-gray-600 body-font bg-purple-50">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">NUTRITION COMPARISON</h2>
          <h1 className="text-m font-medium title-font text-gray-500">Compare Food Nutritional Information</h1>
        </div>
        <CardContent>
          <Grid container spacing={4}>
            {[0, 1].map((index) => (
              <Grid item xs={12} md={6} key={index}>
                {/* Search Input */}
                <Box display="flex" gap={2} mb={1}>
                  <TextField
                    fullWidth
                    label={`Enter Dish Name ${index + 1}`}
                    value={searchQueries[index]}
                    onChange={(e) => handleSearchChange(e, index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') fetchIngredients(index);
                    }}
                    onClick={() => fetchIngredients(index)}
                    variant="outlined"
                  />
                </Box>
                
                {/* Suggestions */}
                {data[index].suggestions.length > 0 && (
                  <List>
                    {data[index].suggestions.map((dish, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemButton onClick={() => {
                          setSearchQueries(prev => {
                            const updated = [...prev];
                            updated[index] = dish;
                            return updated;
                          });
                          setData(prev => prev.map((item, i) => i === index ? { ...item, suggestions: [] } : item));
                          fetchIngredients(index);
                        }}>
                          <ListItemText primary={dish} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {/* Ingredients and Nutritional Info */}
                {data[index].ingredients.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom>Ingredients</Typography>
                    <Grid container spacing={1}>
                      {data[index].ingredients.map((ingredient, i) => (
                        <Grid item key={i}>
                          <Typography variant="body2">{ingredient}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                    <Box display="flex" justifyContent="center" mt={2}>
                      {renderPieChart(index)}
                    </Box>
                    <Button variant="contained" onClick={() => fetchNutritionalData(index)} disabled={data[index].loading} sx={{ mt: 2, backgroundColor: 'rgb(138, 77, 255)' }}>
                      {data[index].loading ? 'Fetching Nutrition...' : data[index].showNutrientInfo ? 'Hide Nutritional Info' : 'Get Nutritional Info'}
                    </Button>
                  </Box>
                )}

                {/* Error Display */}
                {data[index].error && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {data[index].error}
                  </Typography>
                )}
                
                {/* Nutritional Information */}
                {data[index].showNutrientInfo && data[index].nutrientData && (
                  <Box mt={3}>
                    <Typography variant="h6">Nutritional Breakdown</Typography>
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Nutrient</strong></TableCell>
                            <TableCell align="right"><strong>Quantity</strong></TableCell>
                            <TableCell align="right"><strong>Unit</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.keys(data[index].nutrientData.totalNutrients).map((key) => (
                            <TableRow key={key}>
                              <TableCell>{data[index].nutrientData.totalNutrients[key].label}</TableCell>
                              <TableCell align="right">
                                {data[index].nutrientData.totalNutrients[key].quantity.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                {data[index].nutrientData.totalNutrients[key].unit}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Grid>
            ))}
            
            {/* Comparison Charts */}
           
          {data[0].nutrientData && data[1].nutrientData && (
            <Box mt={4}>
              <Typography variant="subtitle1" gutterBottom>
                Nutritional Comparison Plot
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '48%' }}>
                  <BarChart
                    width={600}
                    height={400}
                    data={getBarChartData(
                        data[0].nutrientData,
                        data[1].nutrientData,
                      searchQueries[0],
                      searchQueries[1]
                    )}
                    margin={{ top: 20, right: 20, bottom: 140, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="2 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-90} 
                      textAnchor="end" 
                      interval={0} 
                      tick={{ fontSize: 10}} 
                    />      
                    <YAxis
                      domain={[
                        0,
                        Math.ceil(
                          Math.max(
                            ...getBarChartData(
                                data[0].nutrientData,
                                data[1].nutrientData,
                              searchQueries[0],
                              searchQueries[1]
                            ).map((item) => Math.max(item[searchQueries[0]] || 5, item[searchQueries[1]] || 5))
                          )
                        ),
                      ]}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" wrapperStyle={{ marginBottom: '80px'}} />
                    <Bar dataKey={searchQueries[0]} fill="#8884d8" barSize={20} />
                    <Bar dataKey={searchQueries[1]} fill="#82ca9d" barSize={20} />
                  </BarChart>
                </div>

                <div style={{ width: '48%' }}>
                  <RadarChart
                    outerRadius={150} 
                    width={600}      
                    height={500}    
                    data={getBarChartData(
                        data[0].nutrientData,
                        data[1].nutrientData,
                      searchQueries[0],
                      searchQueries[1]
                    )}
                  >
                    <PolarGrid /> 
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis /> 
                    <Radar
                      name={searchQueries[0]} 
                      dataKey={searchQueries[0]}
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6} 
                    />
                    <Radar
                      name={searchQueries[1]} 
                      dataKey={searchQueries[1]} 
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6} 
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" wrapperStyle={{ marginBottom: '40px' }} />
                  </RadarChart>
                </div>
                </div>
            </Box>
          )}
        </Grid>
      </CardContent>
    </div>
    </section>
  );
};

export default ComparisonDashboard;

