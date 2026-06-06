import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../Css/ViewBlockedUser.css';

const ViewBlockedUser = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const fetchBlockedUsers = async () => {
    try {
      const response = await axios.get("/BlockedUser/all");
      setBlockedUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch blocked users");
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // Handle unblock logic
  const handleUnblock = async (userId) => {
    try {
      await axios.delete(`/BlockedUser/unblock/${userId}`);
      toast.success("User unblocked successfully");
      setBlockedUsers((prev) => prev.filter(user => user.userId !== userId));
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  // Filter blocked users based on search term
  const filteredBlockedUsers = blockedUsers.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.userId.toString().includes(searchLower) ||  // Match by ID
      user.fullName.toLowerCase().includes(searchLower)  // Match by Name
    );
  });

  return (
    <div className="view-blocked-user">
      <h2>Blocked Users</h2>

      {/* Search input */}
      <input 
        type="text" 
        placeholder="Search by Name or ID" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Remark</th>
            <th>Blocked At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBlockedUsers.map(user => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.fullName}</td>
              <td>{user.role}</td>
              <td>{user.remark}</td>
              <td>{new Date(user.blockedAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleUnblock(user.userId)}>Unblock</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default ViewBlockedUser;
