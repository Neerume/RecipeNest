import React, { useState } from "react";
import axios from '../api/axios';
import chef from '../pictures/Chef2.png';
import '../Css/Recipe.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRecipe = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const userId = user?.id;

  const [formData, setFormData] = useState({
    RecipeName: '',
    CookingTime: '',
    Ingredients: '',
    Recipee: '',
    Image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prevData => ({ ...prevData, Image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("RecipeName", formData.RecipeName);
    form.append("CookingTime", formData.CookingTime);
    form.append("Ingredients", formData.Ingredients);
    form.append("Recipee", formData.Recipee);
    form.append("UserId", userId);
    form.append("ImageFile", formData.Image);

    try {
      const response = await axios.post('/Recipe/Create', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Response from API:', response.data);
      toast.success("Recipe added successfully!");
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error adding recipe.");
    }
  };

  return (
    <div className="add-recipe">
      <ToastContainer />
      <h2>Got a New Recipe?</h2>
      <h3>Keep your Recipe List Growing!</h3>
      <h1>Let's Add!</h1>

      <div className="Chef"><img src={chef} alt="chefpic" /></div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="RecipeName">Recipe Name</label>
        <input type="text" name="RecipeName" placeholder="e.g. Chicken Kabab" value={formData.RecipeName} onChange={handleChange} required />

        <label htmlFor="CookingTime">Cooking Time</label>
        <input type="text" name="CookingTime" placeholder="e.g. 45 minutes" value={formData.CookingTime} onChange={handleChange} required />

        <label htmlFor="Ingredients">Ingredients</label>
        <textarea name="Ingredients" rows="4" placeholder="List ingredients..." value={formData.Ingredients} onChange={handleChange} required />

        <label htmlFor="Recipee">Recipe</label>
        <textarea name="Recipee" rows="6" placeholder="Write the recipe steps..." value={formData.Recipee} onChange={handleChange} required />

        <label htmlFor="Image">Upload Image</label>
        <input type="file" name="Image" accept="image/*" onChange={handleImageChange} required />

        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
