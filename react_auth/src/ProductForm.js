import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ProductForm.module.css';

function ProductForm() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSave = () => {
    if (name) {
      const payload = { name };
      axios.post('http://localhost:5000/addproduct', payload)
        .then(() => navigate('/products'))
        .catch(error => console.error('Failed to save product', error));
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className={styles.container}>
      <h2>Add New Product</h2>
      <div className={styles.formContent}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleSave} className={styles.button}>Save Product</button>
          <button onClick={handleCancel} className={`${styles.button} ${styles.cancel}`}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ProductForm;
