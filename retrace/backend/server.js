const express = require('express');
const cors = require('cors');
const path = require('path');
const itemsRoutes = require('./routes/items');
const claimsRoutes = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/claims', claimsRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Retrace API is running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
