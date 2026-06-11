const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/setup');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create an item (lost or found)
router.post('/', upload.single('image'), (req, res) => {
  const { title, description, category, location, date, type } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!title || !description || !category || !location || !date || !type) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'INSERT INTO Items (title, description, category, location, date, image, type) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const params = [title, description, category, location, date, image, type];

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Item reported successfully', itemId: this.lastID });
  });
});

// Get all items (with optional filters)
router.get('/', (req, res) => {
  const { search, category, type } = req.query;
  
  let query = "SELECT * FROM Items WHERE status = 'active'";
  let params = [];

  if (search) {
    query += " AND title LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  query += " ORDER BY id DESC";

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single item by ID
router.get('/:id', (req, res) => {
  db.get("SELECT * FROM Items WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Item not found' });
    res.json(row);
  });
});

module.exports = router;
