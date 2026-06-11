const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Items table
    db.run(`CREATE TABLE IF NOT EXISTS Items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      date TEXT NOT NULL,
      image TEXT,
      type TEXT NOT NULL, -- 'lost' or 'found'
      status TEXT DEFAULT 'active' -- 'active', 'claimed'
    )`);

    // Create Claims table (simplified without foreign keys to users)
    db.run(`CREATE TABLE IF NOT EXISTS Claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      itemId INTEGER NOT NULL,
      claimerName TEXT NOT NULL,
      claimerEmail TEXT NOT NULL,
      answer TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      FOREIGN KEY(itemId) REFERENCES Items(id)
    )`);
  }
});

module.exports = db;
