const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'databaseName'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL');
  connection.release();
});

// Helper function to execute a query
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// User authentication route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const results = await queryAsync('SELECT * FROM Users WHERE username = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize database with sample data
app.get('/init', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    await queryAsync('INSERT INTO Users (username, password) VALUES (?, ?)', ['user1', hashedPassword]);
    res.send('Database initialized');
  } catch (err) {
    console.error('Initialization error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add or update product details
app.post('/product', async (req, res) => {
  const { id, name, components } = req.body;

  try {
    if (id) {
      // Update existing product
      await queryAsync('UPDATE Products SET name = ? WHERE id = ?', [name, id]);

      // Delete existing components
      await queryAsync('DELETE FROM Components WHERE product_id = ?', [id]);

      // Insert new components
      await Promise.all(components.map(component =>
        queryAsync('INSERT INTO Components (product_id, name, quantity, unit_price) VALUES (?, ?, ?, ?)', 
          [id, component.name, component.quantity, component.unit_price])
      ));

      res.send('Product details updated');
    } else {
      // Insert new product
      const results = await queryAsync('INSERT INTO Products (name) VALUES (?)', [name]);
      const productId = results.insertId;

      // Insert new components
      await Promise.all(components.map(component =>
        queryAsync('INSERT INTO Components (product_id, name, quantity, unit_price) VALUES (?, ?, ?, ?)', 
          [productId, component.name, component.quantity, component.unit_price])
      ));

      res.send('Product details added');
    }
  } catch (err) {
    console.error('Product operation error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product endpoint
app.post('/addproduct', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  try {
    // Insert new product into the Products table
    await queryAsync('INSERT INTO Products (name) VALUES (?)', [name]);
    res.status(201).send('Product added successfully');
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all products
app.get('/products', async (req, res) => {
  try {
    const results = await queryAsync('SELECT * FROM Products');
    res.json(results);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product details
app.get('/product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const productResults = await queryAsync('SELECT * FROM Products WHERE id = ?', [productId]);

    if (productResults.length === 0) return res.status(404).json({ message: 'Product not found' });

    const product = productResults[0];
    const components = await queryAsync('SELECT * FROM Components WHERE product_id = ?', [productId]);

    res.json({ product, components });
  } catch (err) {
    console.error('Get product details error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
app.delete('/product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    await queryAsync('DELETE FROM Components WHERE product_id = ?', [productId]);
    await queryAsync('DELETE FROM Products WHERE id = ?', [productId]);
    res.send('Product deleted');
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update component
app.put('/component/:id', async (req, res) => {
  const componentId = req.params.id;
  const { name, quantity, unit_price } = req.body;

  try {
    await queryAsync('UPDATE Components SET name = ?, quantity = ?, unit_price = ? WHERE id = ?', 
      [name, quantity, unit_price, componentId]);

    res.send('Component updated');
  } catch (err) {
    console.error('Update component error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add component to a product
app.post('/product/:id/components', async (req, res) => {
  const productId = req.params.id;
  const { name, quantity, unitPrice } = req.body;

  try {
    await queryAsync('INSERT INTO Components (product_id, name, quantity, unit_price) VALUES (?, ?, ?, ?)', 
      [productId, name, quantity, unitPrice]);

    res.send('Component added');
  } catch (err) {
    console.error('Add component error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
