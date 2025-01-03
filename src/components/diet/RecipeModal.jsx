import React from "react";

const RecipeModal = ({ isOpen, recipe, onClose }) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
        {/* Modal Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{recipe.label}</h2>
          <img
            src={recipe.image}
            alt={recipe.label}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <p className="mb-2">
            <span className="font-semibold">Cuisine Type:</span>{" "}
            {recipe.cuisineType?.[0] || "Unknown"}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Calories:</span>{" "}
            {Math.round(recipe.calories)}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Ingredients:</span>
            <ul className="list-disc ml-6">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.text}</li>
              ))}
            </ul>
          </p>
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Full Recipe & Instructions
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
