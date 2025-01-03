import React from "react";
import FoodAnalysis from '../assets/3d_food1.png'

const Home = () => {
  return (
    <section className="min-h-screen py-10 text-gray-600 body-font bg-purple-50 ">
      <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center  ">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 mt-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-bold text-gray-900">
            EMPOWER YOUR FOOD CHOICES
            </h1>
            <h2 className="title-font sm:text-3xl text-2xl mb-4 font-bold text-gray-600">
            WITH <span className="text-violet-500">FOODSCAN</span>
            
          </h2>
          <p className="mb-8 leading-relaxed">
            Upload images of dishes to classify them, get detailed recipes, and explore their nutritional content. Compare against recommended daily intakes to make better dietary decisions effortlessly.
          </p>
          <div className="flex justify-center">
            <button  onClick={() => {
                document.getElementById("features").scrollIntoView({ behavior: "smooth" });
              }}
            className="inline-flex text-white bg-violet-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
              Get Started
            </button>
            {/* <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
              Learn More
            </button> */}
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 relative z-0">
          <img
            className="object-cover object-center rounded animate-verticalMove"
            alt="hero"
            src={FoodAnalysis}
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
