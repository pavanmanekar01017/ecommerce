const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readData, writeData } = require('./db');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = 'super_secret_key_change_this_in_prod';

app.use(cors());
app.use(bodyParser.json());

// Initialize default admin if not exists
const initData = () => {
    const users = readData('users.json');
    if (users.length === 0) {
        // Create default admin: admin / admin
        const hash = bcrypt.hashSync('admin', 10);
        users.push({ id: 'admin-1', username: 'admin', password: hash, role: 'admin' });
        writeData('users.json', users);
    }
};
initData();

// Middleware to verify Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
};

// --- Auth Routes ---

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const users = readData('users.json');
    const user = users.find(u => u.username === username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, role: user.role, username: user.username });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Admin: Add User
app.post('/api/admin/users', authenticateToken, authorizeAdmin, (req, res) => {
    const { username, password, role } = req.body;
    const users = readData('users.json');

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: uuidv4(), username, password: hashedPassword, role: role || 'user' };
    users.push(newUser);
    writeData('users.json', users);

    // Don't send password back
    const { password: _, ...userWithoutPass } = newUser;
    res.status(201).json(userWithoutPass);
});

// Admin: List Users
app.get('/api/admin/users', authenticateToken, authorizeAdmin, (req, res) => {
    const users = readData('users.json');
    const usersList = users.map(({ password, ...u }) => u);
    res.json(usersList);
});


// --- Product Routes ---

app.get('/api/products', (req, res) => {
    const products = readData('products.json');
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const products = readData('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
});

// Admin Product APIs (Protected)
app.post('/api/admin/products', authenticateToken, authorizeAdmin, (req, res) => {
    const products = readData('products.json');
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    writeData('products.json', products);
    res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', authenticateToken, authorizeAdmin, (req, res) => {
    let products = readData('products.json');
    const index = products.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        writeData('products.json', products);
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/admin/products/:id', authenticateToken, authorizeAdmin, (req, res) => {
    let products = readData('products.json');
    const newProducts = products.filter(p => p.id !== req.params.id);
    if (products.length !== newProducts.length) {
        writeData('products.json', newProducts);
        res.json({ message: 'Product deleted' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// --- Order Routes ---

// Get my orders (User) or All orders (Admin)
app.get('/api/orders', authenticateToken, (req, res) => {
    const orders = readData('orders.json');
    if (req.user.role === 'admin') {
        res.json(orders);
    } else {
        const myOrders = orders.filter(o => o.userId === req.user.username); // using username as link for simplicity or id
        res.json(myOrders);
    }
});

app.post('/api/orders', authenticateToken, (req, res) => {
    const orders = readData('orders.json');
    const newOrder = {
        id: uuidv4(),
        date: new Date().toISOString(),
        userId: req.user.username, // Associate order with user
        ...req.body
    };
    orders.push(newOrder);
    writeData('orders.json', orders);
    res.status(201).json(newOrder);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
