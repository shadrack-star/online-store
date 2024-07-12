import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  const logout = () => {
    localStorage.removeItem("access_token"); // Clear access token
  };

  return (
    <div className="bg-red-300 min-h-screen">
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Amazon link on the left */}
          <Link to="/amazon" className="text-lg hover:text-gray-300">
            Amazon
          </Link>

          {/* Other links on the right */}
          <div className="flex space-x-6 text-lg">
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
