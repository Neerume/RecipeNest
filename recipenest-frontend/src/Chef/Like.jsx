import React, { useState, useEffect } from "react"; 
import axios from "../api/axios";

const Like = ({ recipeId }) => {
  const [liked, setLiked] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user ? user.id : null; // Get the logged-in user's ID from localStorage

  useEffect(() => {
    if (userId) {
      // Fetch the liked status for this recipe and the current user
      const checkIfLiked = async () => {
        try {
          const response = await axios.get(`/LikeRecipe/retrieve?recipeId=${recipeId}&userId=${userId}`);
          if (response.data.liked) {
            setLiked(true);
          } else {
            setLiked(false); // Reset if not liked
          }
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      };

      checkIfLiked();
    }
  }, [recipeId, userId]); // Rerun this effect if recipeId or userId changes

  const handleLike = async () => {
    if (!userId) {
      alert("You must be logged in to like a recipe.");
      return;
    }

    try {
      // Send like request to the backend
      await axios.post("/LikeRecipe/create", {
        recipeId: recipeId,
        userId: userId,
      });

      // Update the local state after successfully liking
      setLiked(true); // Mark as liked
    } catch (error) {
      console.error("Error liking recipe:", error);
    }
  };

  return (
    <div className="heart" onClick={handleLike}>
      {liked ? "❤️" : "🤍"}
    </div>
  );
};

export default Like;
