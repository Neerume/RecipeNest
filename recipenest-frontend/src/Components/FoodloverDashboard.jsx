import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi"; 
import { FaUser } from "react-icons/fa";  
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import RecipeCard from "./RecipeCard";
import '../Css/FoodLover.css';
import foodlover from '../pictures/food lover.jpg';

const FoodLoverDashboard = () => {
  const location = useLocation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("/Recipe/allrecipe");
        console.log("Recipes :", response.data);
        response.data.forEach(recipe => {
          console.log("Image URL: ", recipe.image);
        });
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
  
    fetchRecipes();
  }, []);

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      console.log("Logged out successfully!");
      window.location.href = "/";
    } else {
      console.log("Logout cancelled.");
    }
  };

  return (
    <div className="foodlover">
    <div className="foodloverdashboard">
    <div className="left-section">
              <img src={foodlover} alt="admin.png" />
          <h2>Welcome, Foodie</h2>
          <Link to="/foodlover/profile">Manage Profile</Link>
          <Link to="/foodlover/viewchef">View Chef</Link>
          <Link to="/foodlover/viewlikedrecipe">View Liked Recipe</Link>
          <Link to="/foodlover/viewrecipes">View Recipes</Link>
          <Link to="/foodlover">Home</Link>
          <a href="/" onClick={handleLogout} className="logout-link">
            <FiLogOut size={24} /> Logout
          </a>
        </div>

      <div className="right-section">
        <Link to="/foodlover/profile">
          <FaUser size={24} /> Profile
        </Link>

        {/* If route is not /chefdash, show nested route content */}
        {location.pathname !== "/foodlover" ? (
          <Outlet />
        ) : (
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe, idx) => (
                
                <RecipeCard key ={idx} recipe={recipe}/>
              ))
            ) : (
              <p>No recipes found.</p>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default FoodLoverDashboard;
