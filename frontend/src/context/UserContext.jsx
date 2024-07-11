import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  // Register User
  const registerUser = (name, email, password, role = 'customer', profile_image = '') => {
    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, profile_image }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          toast.success(data.message);
          navigate('/login');
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('An error occurred');
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        toast.error('Failed to register user');
      });
  };

  // Login User
  const loginUser = (email, password) => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          setAuthToken(data.access_token);
          localStorage.setItem('access_token', data.access_token);
          toast.success('Logged in successfully');
          navigate('/profile');
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('An error occurred');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        toast.error('Failed to log in');
      });
  };

  // Logout User
  const logoutUser = () => {
    fetch('http://localhost:5000/api/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.removeItem('access_token');
          setAuthToken(null);
          setCurrentUser(null);
          toast.success('Logged out successfully');
          navigate('/login');
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('An error occurred');
        }
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        toast.error('Failed to log out');
      });
  };

  // Update User Profile
  const updateUserProfile = (id, username, Password, profile_image) => {
    fetch(`/api/current_user/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ username, Password, profile_image }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.success);
          setCurrentUser((prevUser) => ({
            ...prevUser,
            username: username || prevUser.username,
            Password: Password || prevUser.password,
            profile_image: profile_image || prevUser.profile_image,
          }));
        } else if (data.error) {
          toast.error(data.error);
        } else {
          toast.error('An error occurred');
        }
      })
      .catch((error) => {
        console.log('Error updating profile:', error);
        toast.error('Failed to update profile');
      });
  };

  useEffect(() => {
    if (authToken) {
      fetch('/api/current_user', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.email) {
            setCurrentUser(data);
          } else {
            logoutUser();
          }
        })
        .catch((error) => {
          console.error('Error fetching current user:', error);
          logoutUser();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [authToken]);

  const contextValue = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    updateUserProfile,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
