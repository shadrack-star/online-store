
import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import React, { useState } from 'react';

const OrderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    paymentMethod: 'creditCard', // Default payment method
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    // Example: send data to backend, process order, etc.
    fetch("http://localhost:5000/api/orders", {
      // Adding method type
      method: "POST",

      // Adding body or contents to send
      body: JSON.stringify({
        formData: formData,

      }),

      // Adding headers to the request
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      // Converting to JSON
      .then((response) => response.json())

      // Displaying results to console
      .then((json) => navigate("/products"));
  };

  return (
    <div className="max-w-md mx-auto bg-blue-400 p-8 my-10 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Order Product</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          <span className="text-gray-700">Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Address</span>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Phone Number</span>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input mt-1 block w-full"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Payment Method</span>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="form-select mt-1 block w-full"
          >
            <option value="creditCard">Credit Card</option>
            <option value="paypal">PayPal</option>
            
          </select>
        </label>
        {formData.paymentMethod === 'creditCard' && (
          <>
            <label className="block mb-2">
              <span className="text-gray-700">Card Number</span>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                className="form-input mt-1 block w-full"
                required
              />
            </label>
            
            
          </>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;


