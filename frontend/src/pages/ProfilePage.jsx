import React, { useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Link } from 'react-router-dom';
//import './ProfilePage.css'; // Ensure you have this CSS file for styles

const ProfilePage = () => {
  const { products, error } = useContext(ProductContext);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="header">
        <h1>Online Store</h1>
      </div>

      <div className="profile-container">
        <div className="profile-info">
          <img src="profile-placeholder.png" alt="Profile" />
          <h2>Enock</h2>
          <p>Amazon customer</p>
        </div>
        
        <div className="payment-info">
          <h3>Payment Method</h3>
          <p>Visa ending in 1234 <a href="#">(Add/Edit Payment Method)</a></p>
          <h3>Balance</h3>
          <p>$120.00 <a href="#">(Deposit/Withdraw)</a></p>
        </div>
        
        <div className="trade-history">
          <h3>Trade History</h3>
          <ul>
            <li>
              <p>Item: Samsung Galaxy S21</p>
              <p>Date: 2024-07-01</p>
              <p>Amount: $800.00</p>
              <p>Status: Completed</p>
            </li>
            <li>
              <p>Item: Apple MacBook Pro</p>
              <p>Date: 2024-06-25</p>
              <p>Amount: $1,200.00</p>
              <p>Status: Completed</p>
            </li>
            <li>
              <p>Item: Sony WH-1000XM4 Headphones</p>
              <p>Date: 2024-06-20</p>
              <p>Amount: $350.00</p>
              <p>Status: Completed</p>
            </li>
          </ul>
          <a href="#">View All Trades</a>
        </div>

        <a href="#" className="logout-button">Logout</a>
      </div>

      <div className="products-section">
        <h2>Products</h2>
        <div className="product-list">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded shadow">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <img
                      className="w-full h-48 object-cover mt-2"
                      src={product.image_url}
                      alt={product.name}
                    />
                    <p className="mt-2">Price: ${product.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
