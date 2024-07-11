import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Profile = () => {
  const {logoutUser}=useContext(UserContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    profile_image: "",
  });

  useEffect(() => {
    const fetchCurrentUser = () => {
      fetch('http://localhost:5000/api/current_user', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch current user');
          }
          return response.json(); // Parse JSON response
        })
        .then(data => {
          setCurrentUser(data);
          setFormData({
            username: data.username || "",
            password: data.password || "",
            profile_image: data.profile_image || "",
          });
        })
        .catch(error => {
          console.error('Error fetching current user:', error);
          toast.error('Failed to fetch current user');
        });
    };
  
    fetchCurrentUser();
  }, []);
  
   
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http:localhost:5000/api/current_user/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        profile_image: formData.profile_image,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile");
        }
        return response.json();
      })
      .then((data) => {
        toast.success(data.success);
        setCurrentUser((prevUser) => ({
          ...prevUser,
          username: formData.username || prevUser.username,
          password: formData.password || prevUser.password,
          profile_image: formData.profile_image || prevUser.profile_image,
        }));
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
        toast.error("Failed to update profile");
      });
  };

  if (!currentUser) {
    return <div>Log in to view your profile</div>
  }

  const { username, password, profile_image } = formData;

  return (
    <div>
      <h2>Profile</h2>
      <div className="rounded-full">
        <img src={formData.profile_image } alt ="profile" className="size-2 rounded-full"/>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <h5>username</h5>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <h5>Password</h5>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <h5>Image url</h5>
        <input
          type="text"
          name="profile_image"
          value={profile_image}
          onChange={handleChange}
          placeholder="Profile Image URL"
        />
        <button type="submit">Update Profile</button>
      </form>
      <p
              onClick={logoutUser}
              className="block cursor-pointer py-2 px-3 text-lg text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Logout
            </p>
    </div>
  );
};

export default Profile;
