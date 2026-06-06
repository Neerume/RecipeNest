import React, { useState, useEffect } from "react";
import axios from '../api/axios'; // axios to make API requests
import { Link } from "react-router-dom"; // For linking to recipe details or actions
import "../Css/ManageRecipe.css";

const ManageRecipes = () => {
  const [recipes, setRecipes] = useState([]); // State to store recipes
  const [loading, setLoading] = useState(true); // Loading state

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user?.id; // Get the logged-in user's ID from localStorage
  console.log("User id: ", userId);
  
  // Fetch recipes for the logged-in user when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`/Recipe/user/${userId}`); // API call to get recipes for this user
        console.log("Fetched Recipes:", response.data); 
        setRecipes(response.data); // Store the recipes in state
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false); // Stop loading once the data is fetched
      }
    };

    fetchRecipes();
  }, [userId]); // The useEffect will run whenever `userId` changes

  // Handle deletion of a recipe
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
    if (confirmDelete) {
      try {
        // Make an API call to delete the recipe
        await axios.delete(`/Recipe/delete/${id}`);
        
        // Remove the deleted recipe from the state (UI update)
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));

        alert("Recipe deleted successfully!");
      } catch (error) {
        console.error("Error deleting recipe", error);
        alert("Error deleting recipe.");
      }
    }
  };

  return (
    <div className="manage-recipe">
      <h2>Your Recipes</h2>
      {loading ? (
        <p>Loading...</p> // Show a loading message while fetching recipes
      ) : recipes.length === 0 ? (
        <p>No recipes found. Add some new recipes!</p> // Message if no recipes are found
      ) : (
        <table>
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>Cooking Time</th>
              <th>Ingredients</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td>{recipe.recipeName}</td>
                <td>{recipe.cookingTime}</td>
                <td>{recipe.ingredients}</td>
                <td>
                <Link to={`/chefdash/managerecipe/updaterecipe/${recipe.id}`} className="button">Update Recipe</Link>
                <button onClick={() => handleDelete(recipe.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageRecipes;
