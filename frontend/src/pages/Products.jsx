import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {server_url} from "../../config"

export default function Products() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    // Example array of product IDs to fetch
    const productIds = [1, 2, 3, 4,5, 6]; // Replace with your desired product IDs or fetch dynamically

    // Fetch products by IDs
    const fetchProducts = () => {
      fetch(`${server_url}/api/products?ids=${productIds.join(',')}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch products');
          }
        })
        .then((data) => {
          setProductList(data); // Update local state with fetched products
        })
        .catch((error) => {
          console.log('Error fetching products:', error);
        });
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      <h2 className="w-full text-center text-2xl mb-4">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {productList.map((product) => (
          <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div>
              <img className="rounded-t-lg w-full h-48 object-cover" src={product.image_url} alt={product.name} />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="text-gray-700 dark:text-gray-300">Price: ${product.price}</p>
              <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            </div>
            <div className="flex justify-between p-4">
      <Link
        to={`/order`} // Replace with your desired order page route
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900"
      >
        Order
      </Link>
    </div>
          </div>
        ))}
      </div>
    </div>
  );
}
