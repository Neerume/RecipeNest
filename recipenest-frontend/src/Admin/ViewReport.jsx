import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../Css/ViewReport.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewReport = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/User/analytics");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to load dashboard statistics.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Analytics</h1>

      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="card-title">Total Recipes</h3>
            <p className="card-value">{stats.totalRecipes}</p>
          </div>
          <div className="stat-card">
            <h3 className="card-title">Total Chefs</h3>
            <p className="card-value">{stats.totalChefs}</p>
          </div>
          <div className="stat-card">
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3 className="card-title">Total Likes</h3>
            <p className="card-value">{stats.totalLikes}</p>
          </div>
          <div className="stat-card">
            <h3 className="card-title">Total Comments</h3>
            <p className="card-value">{stats.totalComments}</p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default ViewReport;
