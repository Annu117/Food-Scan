import React, { useState } from "react";
import RecipeSearch from "./RecipeSearch";

const DietPlan = () => {
  return (
    <section className="min-h-screen py-10 text-gray-600 body-font bg-purple-50">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-10">
          <h2 className="title-font sm:text-5xl text-4xl font-bold text-gray-900 mb-4">
            DIET PLAN
          </h2>
          <h1 className="text-lg font-medium title-font text-gray-500">
            Search & explore a variety of recipes at your fingertips
          </h1>
        </div>
              <RecipeSearch />
      </div>
    </section>
  );
};

export default DietPlan;
