import React, { useState, useEffect } from 'react';
import axios from '../api/axios'; // Axios for API requests
import { useParams, useNavigate } from 'react-router-dom'; // For getting ID and navigation
import chef from '../pictures/Chef2.png'; // Image import
import "../Css/UpdateRecipe.css";
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toastify

const UpdateRecipe = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const navigate = useNavigate(); // For navigation after update

  const [formData, setFormData] = useState({
    RecipeName: '',
    CookingTime: '',
    Ingredients: '',
    Recipee: '',
    Image: null, // Store the image file separately
  });

  // Fetch the recipe details when component mounts
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/Recipe/${id}`);
        console.log("Fetched recipe:", response.data);

        const { recipeName, cookingTime, ingredients, recipee } = response.data;

        setFormData({
          RecipeName: recipeName || '',
          CookingTime: cookingTime || '',
          Ingredients: ingredients || '',
          Recipee: recipee || '',
          Image: null,
        });
      } catch (error) {
        console.error("Error fetching recipe", error);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      Image: file, // Save selected file in state
    });
  };

  // Handle form submission to update the recipe
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    updateData.append('RecipeName', formData.RecipeName);
    updateData.append('CookingTime', formData.CookingTime);
    updateData.append('Ingredients', formData.Ingredients);
    updateData.append('Recipee', formData.Recipee);

    if (formData.Image) {
      updateData.append('ImageFile', formData.Image); // Only append image if it's selected
    }

    try {
      await axios.put(`/Recipe/${id}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure correct content type for form data
        },
      });

      toast.success('Recipe updated successfully!', { autoClose: 6000 }); // Show success toast for 4 seconds

      // After 4 seconds, navigate back to the previous page
      setTimeout(() => {
        navigate(-1); // Navigate back to the previous page (previous URL)
      }, 4000);
    } catch (error) {
      console.error("Error updating recipe", error);
      toast.error('Error updating recipe.', { autoClose: 4000 }); // Show error toast for 4 seconds
    }
  };

  return (
    <div className="update-recipe-container">
      <h1>Update Recipe</h1>
      
      <div className="Chef">
        <img src={chef} alt="chefpic" /> {/* Display chef image */}
      </div>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="RecipeName">Recipe Name</label>
        <input 
          type="text" 
          name="RecipeName" 
          value={formData.RecipeName} 
          onChange={handleChange} 
          placeholder="Recipe Name" 
        />
    
        <label htmlFor="CookingTime">Cooking Time</label>
        <input 
          type="text" 
          name="CookingTime" 
          value={formData.CookingTime} 
          onChange={handleChange} 
          placeholder="Cooking Time" 
        />
    
        <label htmlFor="Ingredients">Ingredients</label>
        <textarea 
          name="Ingredients" 
          rows="4" 
          value={formData.Ingredients} 
          onChange={handleChange} 
          placeholder="Ingredients" 
        />
    
        <label htmlFor="Recipee">Recipe</label>
        <textarea 
          name="Recipee" 
          rows="6" 
          value={formData.Recipee} 
          onChange={handleChange} 
          placeholder="Recipe Instructions" 
        />
    
        <label htmlFor="Image">Upload Image</label>
        <input 
          type="file" 
          name="Image" 
          accept="image/*" 
          onChange={handleImageChange} 
        />
    
        <button type="submit" className="button">Update Recipe</button>
      </form>

      <ToastContainer /> {/* This is where the toast messages will appear */}
    </div>
  );
};

export default UpdateRecipe;
