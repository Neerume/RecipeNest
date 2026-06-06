import React, { useState, useEffect } from 'react';
import axios from '../api/axios';  
import '../Css/HomeChef.css';
import ChefDefaultImage from '../pictures/Chef.png'; // ✅ Correct import

const Chef = () => {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    axios.get('/User/top-chefs')
      .then(response => {
        console.log("API Response:", response.data);
        setChefs(response.data);
      })
      .catch(error => {
        console.error("Error fetching top chefs:", error);
      });
  }, []);

  return (
    <div className="chef-container">
      <h2>Top Chefs</h2>
      <div className="chef-list">
        {chefs.length > 0 ? (
          chefs.map((chef, index) => (
            <div key={chef.id ? chef.id : `chef-${index}`} className="chef-card">
              <img
                src={chef.photo ? `https://localhost:7296${chef.photo}` : ChefDefaultImage}
                alt={chef.fullName}
                className="chef-photo"
              />
              <div className="chef-info">
                <h3 className="chef-name">{chef.fullName}</h3>
                <p className="chef-about">{chef.aboutMe ? chef.aboutMe : 'No description available.'}</p>
                <p className="chef-likes">Likes: {chef.totalLikes}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No top chefs found.</p>
        )}
      </div>
    </div>
  );
};

export default Chef;
