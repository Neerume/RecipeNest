import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast, ToastContainer } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import "../Css/ManageChef.css";

const ManageChef = () => {
  const [chefs, setChefs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBlocking, setIsBlocking] = useState(false); // To control the modal visibility
  const [selectedChefId, setSelectedChefId] = useState(null); // Track which chef is being blocked
  const [remark, setRemark] = useState(""); // Track the remark for blocking
  const [blockedChefs, setBlockedChefs] = useState([]); // Track blocked chefs

  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const response = await axios.get("/User/chefs");
        setChefs(response.data);
      } catch (error) {
        console.error("Error fetching chefs:", error);
        toast.error("Error fetching chefs."); // Show error toast
      }
    };

    fetchChefs();
  }, []);

  // Handle Block action with remark input
  const handleBlock = (chefId) => {
    setSelectedChefId(chefId); // Set selected chef id for blocking
    setIsBlocking(true); // Show the modal/input
  };

  // Confirm the block with the remark
  const confirmBlock = async () => {
    if (!remark) {
      toast.error("Please provide a reason for blocking."); // Show toast for error
      return;
    }

    console.log("Attempting to block chef with ID:", selectedChefId, "Remark:", remark);

    try {
      await axios.post(`/BlockedUser/block`, {
        userId: selectedChefId,
        remark: remark,
      });
      toast.success("Chef blocked successfully!"); // Show toast for success

      // Update the blocked chefs list and close modal
      setBlockedChefs((prev) => [...prev, selectedChefId]);
      setIsBlocking(false); // Close the input modal
      setRemark(""); // Reset the remark field
      setChefs((prev) => prev.filter((chef) => chef.id !== selectedChefId)); // Remove blocked chef from the list
    } catch (error) {
      console.error("Error blocking chef:", error);
      if (error.response) {
        toast.error(`Error blocking chef: ${error.response.data}`);
      } else {
        toast.error("Error blocking chef.");
      }
    }
  };

  // Cancel blocking and close the modal
  const cancelBlock = () => {
    setIsBlocking(false);
    setRemark(""); // Reset the remark field
  };

  // Filter chefs based on search query (by ID or Name)
  const filteredChefs = chefs
    .filter((chef) => !blockedChefs.includes(chef.id)) // Exclude blocked chefs
    .filter((chef) => {
      return (
        chef.id.toString().includes(searchQuery) ||
        chef.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="manage-chef">
      <div className="manage-chef-header">
        <h1>Manage Chefs</h1>
        <input
          type="text"
          placeholder="Search by ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Chef Name</th>
            <th>No. of Recipes</th>
            <th>No. of Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredChefs.map((chef) => {
            const recipeCount = chef.recipes.length;
            const likeCount = chef.recipes.reduce((sum, recipe) => sum + recipe.likeCount, 0);

            return (
              <tr key={chef.id}>
                <td>{chef.id}</td>
                <td>{chef.fullName}</td>
                <td>{recipeCount}</td>
                <td>{likeCount}</td>
                <td>
                  <button onClick={() => handleBlock(chef.id)} className="block-btn">
                    Block
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Block confirmation modal */}
      {isBlocking && (
        <div className="block-modal">
          <div className="modal-content">
            <h2>Provide a Reason for Blocking</h2>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter the reason for blocking this chef..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={confirmBlock} className="confirm-btn">
                Confirm
              </button>
              <button onClick={cancelBlock} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default ManageChef;
