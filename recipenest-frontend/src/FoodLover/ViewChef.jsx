import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "../Css/ViewChef.css";

const ViewChefs = () => {
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get("/User/chefs");
        console.log("Chefs:", response.data);
        setChefs(response.data);
      } catch (error) {
        console.error("Error fetching chefs:", error);
      }
    };

    fetchChefs();
  }, []);

  return (
    <div className="view-chefs-container">
      <h2>Our Chefs</h2>
      <div className="chef-grid">
        {chefs.length > 0 ? (
          chefs.map((chef) => {
            const chefKey = chef?.id || `chef-${Math.random()}`;
            return (
              <div className="chef-card" key={chefKey}>
                {/* Only show image if present */}
                {chef.photo ? (
                  <img
                    src={`https://localhost:7296${chef.photo}`}
                    alt="Chef"
                    className="chef-photo"
                  />
                ) : (
                  <div className="no-photo-placeholder">No Image</div>
                )}

                <h3>{chef.fullName || "Unnamed Chef"}</h3>
                <p>{chef.aboutMe || "No bio available."}</p>

                <h4>Recipes:</h4>
                <ul className="recipes-list">
                  {chef.recipes && chef.recipes.length > 0 ? (
                    chef.recipes.map((recipe) => {
                      const recipeKey = recipe?.id || `recipe-${Math.random()}`;
                      return (
                        <li key={recipeKey}>
                          <h5>{recipe.recipeName}</h5>
                        </li>
                      );
                    })
                  ) : (
                    <li>No recipes found.</li>
                  )}
                </ul>
              </div>
            );
          })
        ) : (
          <p>No chefs found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewChefs;
