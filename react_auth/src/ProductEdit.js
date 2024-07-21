import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProductEdit.module.css';

const ProductEdit = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [editedProductName, setEditedProductName] = useState('');
  const [components, setComponents] = useState([]);
  const [newComponent, setNewComponent] = useState({ name: '', quantity: '', unit_price: '' });
  const [editingComponentId, setEditingComponentId] = useState(null);
  const [originalComponents, setOriginalComponents] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/product/${productId}`)
      .then(response => {
        setProduct(response.data.product);
        setEditedProductName(response.data.product.name || '');
        setComponents(response.data.components || []);
        setOriginalComponents([...response.data.components] || []);
      })
      .catch(error => console.error('Failed to load product', error));
  }, [productId]);

  const handleSave = () => {
    axios.post('http://localhost:5000/product', { id: productId, name: editedProductName, components })
      .then(() => {
        setOriginalComponents([...components]);
        setIsDirty(false);
        navigate('/products');
      })
      .catch(error => console.error('Failed to save product', error));
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave without saving?')) {
        setComponents([...originalComponents]);
        setEditedProductName(product.name || '');
        setIsDirty(false);
        navigate('/products');
      }
    } else {
      navigate('/products');
    }
  };

  const handleAddComponent = () => {
    if (newComponent.name && newComponent.quantity && newComponent.unit_price) {
      setComponents([...components, { ...newComponent, id: Date.now() }]);
      setNewComponent({ name: '', quantity: '', unit_price: '' });
      setIsDirty(true);
    }
  };

  const handleEditComponent = (componentId) => {
    setEditingComponentId(componentId);
  };

  const handleSaveComponent = (componentId) => {
    setComponents(components.map(component =>
      component.id === componentId ? { ...component, editing: false } : component
    ));
    setEditingComponentId(null);
    setIsDirty(true);
  };

  const handleDeleteComponent = (componentId) => {
    setComponents(components.filter(component => component.id !== componentId));
    setIsDirty(true);
  };

  const handleComponentChange = (e) => {
    const { name, value } = e.target;
    setNewComponent(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleComponentEditChange = (e, id) => {
    const { name, value } = e.target;
    setComponents(components.map(component =>
      component.id === id ? { ...component, [name]: value || '' } : component
    ));
    setIsDirty(true);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h2>Edit Product</h2>
      <div className={styles.editProduct}>
        <input 
          type="text" 
          value={editedProductName || ''} 
          onChange={(e) => {
            setEditedProductName(e.target.value || '');
            setIsDirty(true);
          }} 
          placeholder="Product Name"
        />
      </div>
      <h3>Components</h3>
      <div className={styles.componentTable}>
        <div className={styles.headerRow}>
          <div className={styles.headerCell}>Component Name</div>
          <div className={styles.headerCell}>Quantity</div>
          <div className={styles.headerCell}>Unit Price</div>
          <div className={styles.headerCell}>Actions</div>
        </div>
        <ul className={styles.componentList}>
          {components.map(component => (
            <li key={component.id} className={styles.componentItem}>
              <div className={styles.componentCell}>
                {editingComponentId === component.id ? (
                  <input
                    name="name"
                    value={component.name || ''}
                    onChange={(e) => handleComponentEditChange(e, component.id)}
                    placeholder="Component Name"
                  />
                ) : (
                  <span>{component.name}</span>
                )}
              </div>
              <div className={styles.componentCell}>
                {editingComponentId === component.id ? (
                  <input
                    name="quantity"
                    type="number"
                    value={component.quantity || ''}
                    onChange={(e) => handleComponentEditChange(e, component.id)}
                    placeholder="Quantity"
                  />
                ) : (
                  <span>{component.quantity}</span>
                )}
              </div>
              <div className={styles.componentCell}>
                {editingComponentId === component.id ? (
                  <input
                    name="unit_price"
                    type="number"
                    step="0.01"
                    value={component.unit_price || ''}
                    onChange={(e) => handleComponentEditChange(e, component.id)}
                    placeholder="Unit Price"
                  />
                ) : (
                  <span>{component.unit_price}</span>
                )}
              </div>
              <div className={styles.componentActions}>
                {editingComponentId === component.id ? (
                  <>
                    <button className={styles.saveAll} onClick={() => handleSaveComponent(component.id)}>Save</button>
                    <button className={styles.cancel} onClick={() => setEditingComponentId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className={styles.edit} onClick={() => handleEditComponent(component.id)}>Edit</button>
                    <button className={styles.delete} onClick={() => handleDeleteComponent(component.id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.addComponentContainer}>
        <input 
          name="name" 
          type="text" 
          value={newComponent.name} 
          onChange={handleComponentChange} 
          placeholder="Component Name" 
        />
        <input 
          name="quantity" 
          type="number" 
          value={newComponent.quantity} 
          onChange={handleComponentChange} 
          placeholder="Quantity" 
        />
        <input 
          name="unit_price" 
          type="number" 
          step="0.01" 
          value={newComponent.unit_price} 
          onChange={handleComponentChange} 
          placeholder="Unit Price" 
        />
        <button className={styles.add} onClick={handleAddComponent}>Add Component</button>
      </div>
      <div className={styles.actionButtons}>
        <button className={styles.saveAll} onClick={handleSave}>Save All</button>
        <button className={styles.cancel} onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default ProductEdit;
