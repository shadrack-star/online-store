import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/Products");
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="bg-cover bg-center h-screen relative"
        style={{ 
          backgroundImage: `url('/frontend/src/assets/images/shopping1.jpg')`, // Set the background image URL
        }}
      >
        <div className="flex items-center justify-center h-full bg-opacity-50 bg-gray-900">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
            <p className="text-gray-300 mb-6">
              Discover our latest collection and get amazing deals
            </p>
            <button
              onClick={handleShopNowClick}
              className="bg-yellow-500 text-white px-6 py-3 font-semibold rounded-md"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default HomePage;
