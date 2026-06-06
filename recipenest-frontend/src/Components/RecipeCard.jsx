import React, { useState } from "react";
import LikeButton from "../Chef/Like";
import axios from "../api/axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const RecipeCard = ({ recipe }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false); // 👈 NEW state

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem("currentUser");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id;

  const fetchComments = async () => {
    try {
      const response = await axios.get(`review/${recipe.id}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    if (!userId) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      await axios.post("/review/Create", {
        recipeId: recipe.id,
        comment: newComment,
        userId: userId,
      });

      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) fetchComments();
  };

  //  Display ingredients with Read More
  const renderIngredients = (ingredients) => {
    if (!ingredients) return "Not listed...";

    const ingredientList = ingredients.split(",").map((item) => item.trim());
    const hasMore = ingredientList.length > 4;
    const visibleIngredients = showAllIngredients
      ? ingredientList
      : ingredientList.slice(0, 4);

    return (
      <div>
        <ul>
          {visibleIngredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        {hasMore && (
          <button
            onClick={() => setShowAllIngredients(!showAllIngredients)}
            style={{
              color: "#007bff",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontSize: "0.9rem",
            }}
          >
            {showAllIngredients ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="recipe-card">
      <img src={`https://localhost:7296${recipe.image}`} alt="recipe" />

      <LikeButton recipeId={recipe.id} />

      <h3>{recipe.recipeName || "Untitled Recipe"}</h3>

      <div className="ingredients">
        <p>
          <strong>Cooking time:</strong> {recipe.cookingTime || "Unknown"}
        </p>
        <p><strong>Ingredients:</strong></p>
          {renderIngredients(recipe.ingredients)}

        <p>
          <strong>Recipe:</strong> {recipe.recipee || "Not listed..."}
        </p>
      </div>

      <button onClick={toggleComments}>Comments</button>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <strong>{comment.username}</strong>: {comment.comment}
                  <br />
                  <small style={{ color: "#666" }}>
                    {dayjs(comment.createdAt).fromNow()}
                  </small>
                </div>
              ))
            ) : (
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>

          <div className="add-comment">
            <input
              type="text"
              placeholder="Add your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleCommentSubmit}>➡️</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
