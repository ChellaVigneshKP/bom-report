// src/BOMTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BOMTable.module.css';

function BOMTable() {
  const { productId } = useParams(); // Extract productId from URL parameters
  const [product, setProduct] = useState(null);
  const [components, setComponents] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios.get(`http://localhost:5000/product/${productId}`)
      .then(response => {
        setProduct(response.data.product);
        setComponents(response.data.components);
      })
      .catch(error => console.error('Failed to load product details', error));
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  // Function to convert price and quantity to numbers
  const parseToNumber = (value) => {
    return parseFloat(value) || 0;
  };

  // Function to calculate total price for each component
  const calculateTotalPrice = (quantity, unitPrice) => {
    return (parseToNumber(quantity) * parseToNumber(unitPrice)) || 0;
  };

  // Calculate total cost of all components
  const totalCost = components.reduce((total, component) =>
    total + calculateTotalPrice(component.quantity, component.unit_price), 0);

  return (
    <div className={styles.container}>
      <h1>BILL OF MATERIALS REPORT</h1>
      <h2>PRODUCT NAME: {product.name}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ITEM</th>
            <th>QUANTITY</th>
            <th>UNIT PRICE</th>
            <th>TOTAL PRICE</th>
          </tr>
        </thead>
        <tbody>
          {components.map(component => (
            <tr key={component.id}>
              <td>{component.name}</td>
              <td>{parseToNumber(component.quantity)}</td>
              <td>${parseToNumber(component.unit_price).toFixed(2)}</td>
              <td>${calculateTotalPrice(component.quantity, component.unit_price).toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Cost:</td>
            <td>${totalCost.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <button 
        className={styles.backButton}
        onClick={() => navigate('/products')}
      >
        Back to Products
      </button>
    </div>
  );
}

export default BOMTable;
