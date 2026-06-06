import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../Css/ManageFoodLover.css";

const ManageFoodLover = () => {
  const [foodLovers, setFoodLovers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBlocking, setIsBlocking] = useState(false); // To control the modal visibility
  const [selectedUserId, setSelectedUserId] = useState(null); // Track which user is being blocked
  const [remark, setRemark] = useState(""); // Track the remark for blocking
  const [blockedUsers, setBlockedUsers] = useState([]); // Track blocked users

  const fetchFoodLovers = async () => {
    try {
      const response = await axios.get("/User/foodlovers"); // adjust if your route differs
      setFoodLovers(response.data);
    } catch (error) {
      toast.error("Failed to fetch food lovers");
    }
  };

  useEffect(() => {
    fetchFoodLovers();
  }, []);

  // Handle Block action with remark input
  const handleBlock = (userId) => {
    setSelectedUserId(userId); // Set selected user id for blocking
    setIsBlocking(true); // Show the modal/input
  };

  // Confirm the block with the remark
  const confirmBlock = async () => {
    if (!remark) {
      toast.error("Please provide a reason for blocking."); // Show toast for error
      return;
    }

    console.log("Attempting to block user with ID:", selectedUserId, "Remark:", remark);

    try {
      await axios.post(`/BlockedUser/block`, {
        userId: selectedUserId,
        remark: remark,
      });
      toast.success("Food lover blocked successfully!"); // Show toast for success

      // Update the blocked users list and close modal
      setBlockedUsers((prev) => [...prev, selectedUserId]);
      setIsBlocking(false); // Close the input modal
      setRemark(""); // Reset the remark field
      setFoodLovers((prev) => prev.filter((user) => user.id !== selectedUserId)); // Remove blocked user from the list
    } catch (error) {
      console.error("Error blocking user:", error);
      if (error.response) {
        toast.error(`Error blocking user: ${error.response.data}`);
      } else {
        toast.error("Error blocking user.");
      }
    }
  };

  // Cancel blocking and close the modal
  const cancelBlock = () => {
    setIsBlocking(false);
    setRemark(""); // Reset the remark field
  };

  // Filter food lovers based on search query (by ID, Name, or Email)
  const filteredFoodLovers = foodLovers
    .filter((user) => !blockedUsers.includes(user.id)) // Exclude blocked users
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.id.toString().includes(searchLower) ||
        user.fullName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });

  return (
    <div className="manage-food-lover">
      <h2>Manage Food Lovers</h2>

      <input
        type="text"
        placeholder="Search by name, email, or ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Total Likes</th>
            <th>Total Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoodLovers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.totalLikes}</td>
              <td>{user.totalComments}</td>
              <td>
                <button onClick={() => handleBlock(user.id)} className="block-btn">
                  Block
                </button>
              </td>
            </tr>
          ))}
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
              placeholder="Enter the reason for blocking this food lover..."
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

export default ManageFoodLover;
