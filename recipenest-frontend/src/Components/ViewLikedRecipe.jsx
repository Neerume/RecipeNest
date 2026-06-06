import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import RecipeCard from "./RecipeCard"; // Assuming RecipeCard is in the same folder

const ViewLikedRecipe = () => {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user ? user.id : null;

  useEffect(() => {
    const fetchLikedRecipes = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`/LikeRecipe/liked-recipes/${userId}`);
        setLikedRecipes(response.data);
      } catch (error) {
        console.error("Error fetching liked recipes:", error);
      }
    };

    fetchLikedRecipes();
  }, [userId]);

  return (
    <div className="recipe-grid">
      {likedRecipes.length > 0 ? (
        likedRecipes.map((item, idx) => {
          // Create a Date object from the LikedAt timestamp
          const likedAt = new Date(item.likedAt); // lowercase!
          const isValidDate = !isNaN(likedAt.getTime()); // Check if the date is valid

          return (
            <div key={idx}>
              <RecipeCard recipe={item.recipe} />
              {/* Display the 'LikedAt' timestamp, but only if it's a valid date */}
              {isValidDate ? (
                <p>Liked on: {likedAt.toLocaleString()}</p>
              ) : (
                <p>Liked on: Invalid Date</p> // Fallback in case the date is invalid
              )}
            </div>
          );
        })
      ) : (
        <p>You haven't liked any recipes yet.</p>
      )}
    </div>
  );
};

export default ViewLikedRecipe;
