import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Products.module.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddProduct = () => {
    navigate('/product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/product/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/product/${productId}`);
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>; // Display loading message

  return (
    <div className={styles.container}>
      <h2>Available Products</h2>
      <ul className={styles.productList}>
        {products.map(product => (
          <li key={product.id} className={styles.productItem}>
            {product.name}
            <div className={styles.buttonGroup}>
              <button className={styles.viewButton} onClick={() => handleProductSelect(product.id)}>View BOM</button>
              <button className={styles.editButton} onClick={() => handleEditProduct(product.id)}>Edit</button>
              <button className={styles.deleteButton} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <button className={styles.addButton} onClick={handleAddProduct}>Add New Product</button>
    </div>
  );
};

export default Products;
