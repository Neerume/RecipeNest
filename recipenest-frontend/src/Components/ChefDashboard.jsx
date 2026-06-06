import React, { useEffect, useState } from "react";
import "../Css/Chef.css";
import { FiLogOut } from "react-icons/fi"; 
import { FaUser } from "react-icons/fa";  
import { Link, Outlet, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import LikeButton from "../Chef/Like";  
import RecipeCard from "./RecipeCard";
import chef from '../pictures/Chef.png';


const ChefDashboard = () => {
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
    <div className="chef">
    <div className="chefdashboard">
      <div className="left-section">
        <h2>Welcome Chef</h2>
        <img src={chef} alt="chef" />
        <Link to="/chefdash/addrecipe">Add Recipe</Link>
        <Link to="/chefdash/managerecipe">Manage Recipe</Link>
        <Link to="/chefdash/profile">Manage Profile</Link>
        <Link to="/chefdash/viewchart">View Chart</Link>
        <Link to="/chefdash/viewlikedrecipe">View Liked Post</Link>
        <Link to="/chefdash">Home</Link>
        <a href="/" onClick={handleLogout} className="logout-link">
          <FiLogOut size={24} /> Logout
        </a>
      </div>

      <div className="right-section">
        <Link to="/chefdash/viewprofile">
          <FaUser size={24} /> Profile
        </Link>

        {/* If route is not /chefdash, show nested route content */}
        {location.pathname !== "/chefdash" ? (
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

export default ChefDashboard;
