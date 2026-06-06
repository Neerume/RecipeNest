import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import "../Css/Admin.css";
import admin from '../pictures/admin.jpeg';
import axios from '../api/axios';
import RecipeCard from "./RecipeCard";

const AdminDashboard = ({ user }) => {
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
    <div className="admin-dashboard">
      {/* Left Section */}
      <div className="left-section">
        <img src={admin} alt="admin.png" />
        <h2>Welcome Admin</h2>
        <Link to="/admindash/chef">Manage Chef</Link>
        <Link to="/admindash/deleterecipe">Manage Recipe</Link>
        <Link to="/admindash/managefoodLover">Manage Food Lover</Link>
        <Link to="/admindash/blockedUsers">View Blocked Users</Link>
        <Link to="/admindash/viewreport">Report of Engagement</Link>
        <Link to="/admindash" className="home-link">Home</Link>
        <a href="/" onClick={handleLogout} className="logout-link">
          <FiLogOut size={24} />
          Logout
        </a>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <Link to="/profile">
          <FaUser size={24} />
          Profile
        </Link>

         {/* If route is not /chefdash, show nested route content */}
         {location.pathname !== "/admindash" ? (
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
  );
};

export default AdminDashboard;
