import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../Css/ViewProfile.css";

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.id) {
      alert("You must be logged in to view your profile.");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`/user/${currentUser.id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Error fetching profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-photo">
          {user.photo ? (
            <img src={`https://localhost:7296${user.photo}`} alt="recipe" />
          ) : (
            <div className="no-photo">No Profile Picture</div>
          )}
        </div>
        <div className="profile-details">
          <h2>{user.fullName || "N/A"}</h2>
          <p><strong>Username:</strong> {user.username || "N/A"}</p>
          <p><strong>Email:</strong> {user.email || "N/A"}</p>
          <p><strong>Role:</strong> {user.role || "N/A"}</p>
          <p><strong>About Me:</strong></p>
          <p className="bio">{user.aboutMe || "No bio available."}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
