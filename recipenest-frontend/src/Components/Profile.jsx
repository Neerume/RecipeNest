import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import '../Css/Profile.css';
import { toast, ToastContainer } from 'react-toastify'; // ✅ Toastify imports
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      toast.error("You must be logged in to view your profile.", { autoClose: 5000 });
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/user/${currentUser.id}`);
        setUser(response.data);
        setFullName(response.data.fullName);
        setEmail(response.data.email);
        setDescription(response.data.description || "");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error fetching user profile.", { autoClose: 5000 });
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleFullNameChange = (e) => setFullName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSaveChanges = async () => {
    if (!user) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const formData = new FormData();

    formData.append("FullName", fullName);
    formData.append("Email", email);
    formData.append("Role", user.role);
    formData.append("Username", user.username);
    formData.append("AboutMe", description);
    if (photo) {
      formData.append("PhotoFile", photo);
    }

    try {
      const response = await axios.put(`/User/update/${currentUser.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile updated successfully.", { autoClose: 5000 });
      setUser(response.data);
      setIsEditingFullName(false);
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Error saving profile changes:", error);
      toast.error("Error saving profile.", { autoClose: 5000 });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="profile">
      <h1>Profile</h1>

      <div>
        <strong>Name: </strong>
        {isEditingFullName ? (
          <input
            type="text"
            value={fullName}
            onChange={handleFullNameChange}
            onBlur={() => setIsEditingFullName(false)}
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditingFullName(true)}>{fullName}</span>
        )}
      </div>

      <div>
        <strong>Email: </strong>
        {isEditingEmail ? (
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setIsEditingEmail(false)}
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditingEmail(true)}>{email}</span>
        )}
      </div>

      <div>
        <strong>Role: </strong> <span>{user.role}</span>
      </div>

      <div>
        <strong>About Me: </strong>
        <textarea value={description} onChange={handleDescriptionChange} placeholder="Describe yourself" />
      </div>

      <div>
        <strong>Profile Photo: </strong>
        {user.photo ? <img src={user.photo} alt="Profile" width="100" /> : <p>No photo</p>}
        <input type="file" onChange={handlePhotoChange} />
      </div>

      <button onClick={handleSaveChanges}>Save Changes</button>

      <ToastContainer /> {/* ✅ Toast messages render here */}
    </div>
  );
};

export default Profile;
