// src/AppRoutes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products';
import ProductForm from './ProductForm';
import BOMTable from './BOMTable';
import Login from './Login';
import ProductEdit from './ProductEdit';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:productId" element={<BOMTable />} />
      <Route path="/product" element={<ProductForm />} />
      <Route path="/product/edit/:productId" element={<ProductEdit />} />
    </Routes>
  );
};

export default AppRoutes;
