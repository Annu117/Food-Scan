import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchNutrientInfo, fetchRecipes } from './apiUtils';
import { prepareChartData, drawBoundingBoxes } from './chartUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

const RECIPE_BASE_API_URL = "https://api.edamam.com/api/";
const RECIPE_API_ID = process.env.REACT_APP_APP_ID_1;
const RECIPE_API_KEY = process.env.REACT_APP_APP_KEY_1;

const FoodDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [detections, setDetections] = useState([]);
  const [nutrientInfo, setNutrientInfo] = useState({});
  const [recipes, setRecipes] = useState({});
  const [expandedLabels, setExpandedLabels] = useState([]);
  const canvasRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setSelectedImage(imageURL);

    const img = new Image();
    img.src = imageURL;
    img.onload = () => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });

    const formData = new FormData();
    formData.append('file', file);
    try {
      const detectResponse = await fetch(
        'https://detect.roboflow.com/indianfoodnet/1?api_key=orsqAoMQlUpr4dg2Mdr5',
        { method: 'POST', body: formData }
      );
      const detectResult = await detectResponse.json();
      const predictions = detectResult?.predictions || []; // Ensure predictions is always an array
      setDetections(predictions);
      
      const nutrients = {};
      const recipeData = {};
      for (const { class: label } of predictions) {
        if (!nutrients[label]) nutrients[label] = await fetchNutrientInfo(label);
        if (!recipeData[label]) recipeData[label] = await fetchRecipes(label, RECIPE_BASE_API_URL, RECIPE_API_ID, RECIPE_API_KEY);
      }
      setNutrientInfo(nutrients);
      setRecipes(recipeData);
    } catch (error) {
      console.error('Error fetching detection results:', error);
    }
  };
  useEffect(() => {
    if (Array.isArray(detections) && detections.length > 0) {
      drawBoundingBoxes(canvasRef, selectedImage, detections, imageDimensions);
    }
  }, [detections, imageDimensions]);
  
 
  const aggregatedResults = detections.reduce((acc, { class: label, confidence }) => {
    if (!acc[label]) acc[label] = { count: 0, totalConfidence: 0 };
    acc[label].count += 1;
    acc[label].totalConfidence += confidence;
    return acc;
  }, {});

  return (
    <section className="min-h-screen py-10 text-gray-600 body-font bg-purple-50">
      <div className="container px-5 py-24 mx-auto">
        <div className="text-center w-full mb-20">
          <h2 className="title-font text-3xl sm:text-4xl font-bold text-gray-900 mb-4">FOOD DETECTION</h2>
          <h1 className="text-m text-gray-500 font-medium">Enhance the Way You See and Understand Food</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Typography>Upload Image</Typography>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center w-full bg-indigo-50">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-indigo-100">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, or GIF (MAX. 800x400px)</p>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
              {selectedImage && (
                <div className="relative mt-4">
                  <img id="uploaded-image" src={selectedImage} alt="Uploaded food" className="max-w-full h-auto rounded-lg" />
                  <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none" />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Typography variant="h6" className="font-bold">Detection Results</Typography>
            </CardHeader>
            <CardContent>
              {Object.entries(aggregatedResults).length === 0 ? (
                <Typography className="text-gray-500">No detections available.</Typography>
              ) : (
                <ul className="space-y-6">
                  {Object.entries(aggregatedResults).map(([label, { count, totalConfidence }]) => (
                    <li key={label} className="p-4 rounded-lg bg-white">
                      <Typography variant="subtitle1" className="font-semibold text-indigo-600">{count} {label}</Typography>
                      <Typography className="text-gray-700">
                        Accuracy <span className="text-purple-600 font-bold">{(totalConfidence / count).toFixed(1)}%</span>
                      </Typography>
                      {nutrientInfo[label] && nutrientInfo[label].length > 0 && (
                        <div className="mt-4">
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <div style={{ width: '300px', height: '300px' }}>
                              <Pie data={prepareChartData(nutrientInfo[label])} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                            </div>
                          </div>
                          <Typography variant="subtitle2" className="font-bold text-gray-800 mt-6">Nutrients:</Typography>
                          <table className="table-auto w-full text-sm text-left text-gray-600 border-collapse mt-2">
                            <tbody>
                              {Object.entries(nutrientInfo[label][0]).filter(([_, value]) => value !== "Only available for premium subscribers.").map(([key, value]) => (
                                <tr key={key} className="border-t">
                                  <td className="py-1 font-medium capitalize">{key.replace(/_/g, " ")}</td>
                                  <td className="py-1">{value || "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {recipes[label] && recipes[label].length > 0 && (
                        <div className="mt-8">
                          <Typography variant="subtitle2" className="font-bold text-gray-800 mt-6">Recipes:</Typography>
                          <ul className="space-y-4">
                            {recipes[label].slice(0, expandedLabels.includes(label) ? recipes[label].length : 1).map((recipe, index) => (
                              <li key={index} className="p-4 border rounded-lg shadow bg-white">
                                <Typography variant="h6" className="font-bold text-indigo-600 mb-4">{recipe.label}</Typography>
                                <Typography variant="h6">Ingredients</Typography>
                                <ul className="list-disc ml-6 text-sm text-gray-600">
                                  {recipe.ingredientLines.map((ingredient, idx) => <li key={idx}>{ingredient}</li>)}
                                </ul>
                                <Typography variant="h6">Instructions <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Click here</a></Typography>
                              </li>
                            ))}
                          </ul>
                          <button onClick={() => setExpandedLabels((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label])} className="mt-4 text-sm text-indigo-600 underline">
                            {expandedLabels.includes(label) ? "Show Less" : "Show More"}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FoodDetection;
