const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());

// Serve HTML / CSS / JS from Design folder
app.use(express.static(path.join(__dirname, 'Design')));

// API routes
const mobileRoutes = require('./routes/mobile');
app.use('/api', mobileRoutes);

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Design', 'index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});