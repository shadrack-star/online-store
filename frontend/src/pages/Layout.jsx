import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  // Function to handle logout
  const logout = () => {
    // Implement your logout logic here, such as clearing localStorage
    localStorage.removeItem("access_token"); // Example of clearing access token
    // Redirect or perform any additional cleanup as needed
  };

  return (
    <div className="bg-red-300 min-h-screen">
      <nav className="bg-red-500 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Empty div to push items to the right */}
          <div></div>
          <div className="flex space-x-6 text-lg"> {/* Adjusted text size */}
          <Link to="/amazon" className="hover:text-gray-300">
              Amazon
            </Link>
            
            <Link to="/products" className="hover:text-gray-300">
              Products
            </Link>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
            <Link to="/order" className="hover:text-gray-300">
              Orders
            </Link>
            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>
            {/* Logout Link */}
            
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </div>

      <footer className="bg-gray-800 text-white text-center py-4">
        <div className="max-w-7xl mx-auto">
          <p>&copy; 2024 Amazon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
