import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../Css/ManageRecipe.css';

const DeleteRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("/Recipe/all");
      setRecipes(response.data);
    } catch (error) {
      toast.error("Failed to fetch recipes");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(recipe => {
    const searchLower = searchTerm.toLowerCase();
    return (
      recipe.id.toString().includes(searchLower) ||  // Match by ID
      recipe.recipeName.toLowerCase().includes(searchLower)  // Match by Recipe Name
    );
  });

  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`/Recipe/delete/${recipeId}`);
      toast.success("Recipe deleted successfully");
      setRecipes((prev) => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <div className="manage-recipe">
      <h2>Manage Recipes</h2>

      {/* Search input */}
      <input 
        type="text" 
        placeholder="Search by Recipe Name or ID" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Recipe Name</th>
            <th>Chef Id</th>
            <th>Chef</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredRecipes.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: 'center' }}>No recipes found.</td>
    </tr>
  ) : (
    filteredRecipes.map(recipe => (
      <tr key={recipe.id}>
        <td>{recipe.id}</td>
        <td>{recipe.recipeName}</td>
        <td>{recipe.userId}</td>
        <td>{recipe.chefFullName}</td>
        <td>
          <button onClick={() => handleDelete(recipe.id)}>Delete</button>
        </td>
      </tr>
    ))
  )}
</tbody>

</table>
      <ToastContainer />
    </div>
  );
};

export default DeleteRecipe;
