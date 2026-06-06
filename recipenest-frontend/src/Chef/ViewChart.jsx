import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import '../Css/Chart.css';

const ViewChart = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) {
          console.error("User ID is missing or invalid.");
          return;
        }

        // Step 1: Get all recipes by the current user
        const recipeResponse = await axios.get(`/recipe/user/${userId}`);
        const userRecipes = recipeResponse.data;

        // Step 2: Fetch likes and comments for each recipe
        const recipesWithStats = await Promise.all(
          userRecipes.map(async (recipe) => {
            try {
              // Fetch likes and comments concurrently for each recipe
              const [likesRes, commentsRes] = await Promise.all([
                axios.get(`/likerecipe/${recipe.id}`),
                axios.get(`/review/${recipe.id}`)
              ]);

              return {
                ...recipe,
                totalLikes: likesRes.data.length,
                totalComments: commentsRes.data.length
              };
            } catch (err) {
              console.error(`Error fetching likes/comments for recipe ${recipe.id}:`, err);
              return {
                ...recipe,
                totalLikes: 0,
                totalComments: 0
              };
            }
          })
        );

        setRecipes(recipesWithStats);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe summaries:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) return <p>Loading recipe summary...</p>;

  return (
    <div className="recipe-summary">
      <h2>Your Recipe Stats</h2>
      {recipes.length === 0 ? (
        <p>No recipes found.</p>
      ) : (
        recipes.map((recipe) => (
          <div key={recipe.id} className="summary-card">
            <h3>🍽️ {recipe.recipeName}</h3>
            <p>❤️ Likes: {recipe.totalLikes}</p>
            <p>💬 Comments: {recipe.totalComments}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default ViewChart;
