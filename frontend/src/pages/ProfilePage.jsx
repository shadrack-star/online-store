import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";
import {server_url} from "../../config"

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
      fetch(`${server_url}/api/current_user`, {
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
          //toast.error('logged in succesfully');
          toast.success('Logged in successfully');
        });
    };
  
    fetchCurrentUser();
  }, []);
  
   
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${server_url}/api/current_user/${currentUser.id}`, {
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
        toast.success("Profile updated succesfully")
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
        <img src={formData.profile_image } alt ="profile" className="size-1 rounded-full"/>
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
      <a href="/login"
      className="bg-yellow-500 text-white px-6 py-3 font-semibold rounded-md"
              onClick={logoutUser}
              
            >
              Logout
            

            </a>
            
           
            
          
    </div>
  );
};

export default Profile;
