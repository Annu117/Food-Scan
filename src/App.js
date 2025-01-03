import './App.css';
import React, { useState, useEffect } from "react";
import FoodDetection from './components/food_detection/FoodDetection';
import FoodIngredients from './components/RecipeRetrival';
import Home from './components/Home';
import Features from './components/Features';
import Header from './components/Header';
import Footer from './components/Footer'
import DietPlan from './components/diet/DietPlan';
import ComparisonDashboard from './components/ComparisonDashboard';

function App() {
  return (
    <>
    <Header />
    <div id="home" className="min-h-screen mx-auto px-4 bg-blue-50">
      <Home />
    </div>
    <div id="features" className="min-h-screen mx-auto px-4 bg-purple-50">
      <Features />
    </div>
    <div id="Food-Detection" className="min-h-screen mx-auto px-4 bg-purple-50">
      <FoodDetection />
    </div>
    <div id="Recipe-Retrival" className="min-h-screen mx-auto px-4 bg-purple-50">
      <FoodIngredients />
    </div>
    <div id="Nutrition-Comparision" className="min-h-screen mx-auto px-4 bg-purple-50">
      <ComparisonDashboard/>
    </div>
    <div id="diet-plan" className="min-h-screen mx-auto px-4 bg-purple-50">
      <DietPlan />
    </div>
    <div id="diet" className="min-h-screen mx-auto px-4 bg-purple-50">
    </div>  
    <Footer/>
  
    </>
  );
}

export default App;
