import React from "react";
import RecipeRetrieval3D from '../assets/Recipe_Retrieval_3d.jpg'
import Nutritional_Insights_3D from '../assets/Nutritional_Insights_3D.jpg'
import Food_detection_3D from '../assets/Food_detection3D.jpg'
import {
  Box,  Card,  CardContent,  CardHeader,  Typography,  TextField,
  Grid,  Button,  Table,  TableBody,  TableCell,  TableContainer,  TableHead,  TableRow,  Paper,
  List,  ListItem,  ListItemButton,  ListItemText,} from '@mui/material';
const Features = () => {
  return (
    <section className=" min-h-screen py-10 text-gray-600 body-font bg-purple-50">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h2 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
            FEATURES
          </h2>
          <h1 className=" text-m font-medium title-font text-gray-500">
            Discover How We Transform Your Food Experience
          </h1>
        </div>
        <div className="flex flex-wrap -m-4">

        {/* <!-- Card 1 --> */}
      <div class="p-4 md:w-1/3 ">
      <Card>
        <Box gap={2} mb={4} height={410}>        
            <img class="lg:h-48 md:h-36 w-full object-cover object-center transition-transform duration-700 hover:scale-110" src={Food_detection_3D} alt="content image"/>
            <div class="p-6">
              <h2 class="tracking-widest text-[11px] title-font font-medium  text-indigo-400 mb-1">AI IMAGE ANALYSIS</h2>
              <h1 class="title-font text-xl font-bold text-gray-900 mb-3">Food Detection</h1>
              <p class="leading-relaxed mb-3">Upload an image of any dish to classify it with a high level of accuracy using our machine learning model.</p>
              <div class="flex items-center flex-wrap">
              <button class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
              onClick={() => {
                document.getElementById("Food-Detection").scrollIntoView({ behavior: "smooth" });
              }}
              >Get Started
                <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
              </div>
            </div>
        </Box>
      </Card>
      </div>
      
      {/* <!-- Card 2 --> */}
      <div class="p-4 md:w-1/3 ">
      <Card >
        <Box gap={2} mb={4} height={410}>
          <img class="lg:h-48 md:h-36 w-full object-cover object-center transition-transform duration-700 hover:scale-110" src={RecipeRetrieval3D} alt="content image"/>
          <div class="p-6">
            <h2 class="tracking-widest text-[11px] title-font font-medium text-indigo-400 mb-1">CULINARY INSPIRATION</h2>
            <h1 class="title-font text-xl font-bold text-gray-900 mb-3">Recipe Retrieval</h1>
            <p class="leading-relaxed mb-3">Get a variety of recipes tailored to the identified dish and explore exciting cooking ideas.</p>
            <div class="flex items-center flex-wrap">
              <button class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
              onClick={() => {
                document.getElementById("Recipe-Retrival").scrollIntoView({ behavior: "smooth" });
              }}
              >Get Started
                <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </Box>
      </Card>
      </div>
      
      {/* <!-- Card 3 --> */}
      <div class="p-4 md:w-1/3">
      <Card >
      <Box gap={2} mb={4} height={410}>
        <img class="lg:h-48 md:h-36 w-full object-cover object-center transition-transform duration-700 hover:scale-110" src={Nutritional_Insights_3D} alt="content image"/>
          <div class="p-6">
            <h2 class="tracking-widest text-[11px] title-font font-medium text-indigo-400 mb-1">HEALTH & NUTRITION</h2>
            <h1 class="title-font text-xl font-bold text-gray-900 mb-3">Nutritional Insights</h1>
            <p class="leading-relaxed mb-3">Analyze macronutrients and micronutrients in detail, and compare with recommended daily intake values.</p>
            <div class="flex items-center flex-wrap">
            <button class="text-indigo-500 inline-flex items-center md:mb-2 lg:mb-0"
              onClick={() => {
                document.getElementById("Nutrition-Comparision").scrollIntoView({ behavior: "smooth" });
              }}
              >Get Started
                <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
          </Box>
        </Card>
        </div>
        </div>
      </div>
    </section>
  );
};
export default Features;
