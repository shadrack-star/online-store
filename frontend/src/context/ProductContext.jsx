import React, { createContext, useState, useEffect } from 'react';
import { server_url } from "../../config";
import { toast } from 'react-toastify';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Fetch products by IDs
  const fetchProductsByIds = (productIds) => {
    fetch(`${server_url}/api/products?ids=${productIds.join(',')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data); // Update state with fetched products
      })
      .catch((error) => {
        toast.error("Error fetching products: " + error.message);
        console.error('Error:', error);
      });
  };

  // Fetch products on component mount
  useEffect(() => {
    const productIds = [1, 2, 3, 4, 5, 6]; // Example product IDs
    fetchProductsByIds(productIds);
  }, []);

  const addProducts = (name, description, price, stock, category) => {
    const eventData = {
      name,
      description,
      price,
      stock,
      category
    };

    fetch(`${server_url}/api/products`, {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`, // Ensure auth_token is defined
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.success);
          navigate("/dashboard"); // Ensure navigate is defined
        } else if (res.error) {
          toast.error(res.error);
        } else {
          toast.error("An error occurred");
        }
      })
      .catch((error) => {
        toast.error("An error occurred");
        console.error('Error:', error);
      });
  };

  return (
    <ProductContext.Provider value={{ products, addEvent }}>
      {children}
    </ProductContext.Provider>
  );
};
