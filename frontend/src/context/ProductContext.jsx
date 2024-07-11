// ProductContext.js

import React, { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const add_event = (event_name, location, event_date, description) => {
    fetch(`http://localhost:5001/api/products`, {
        method: 'POST',
        body: JSON.stringify({
            event_name, 
            location, 
            event_date, 
            description
        }),
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${auth_token}`
        },
    })
    .then((response) => response.json())
    .then((res) => {
        console.log(res);
        if (res.success) {
            toast.success(res.success);
            nav("/dashboard");
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

  useEffect(() => {
    fetch(`http://localhost:5001/api/products`, {
      method: 'GET',
      
  
      headers: {
          'Content-type': 'application/json',
  
      },
  })
  .then((response) => response.json())
  .then((res) => {
      console.log(res);
      
  })
  .catch((error) => {
      toast.error("An error occurred");
      console.error('Error:', error);
  });
  
  }, []);
  

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};