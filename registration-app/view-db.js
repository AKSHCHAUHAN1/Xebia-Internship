const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'users.db'));

db.all("SELECT id, full_name, email, password_hash, created_at FROM users", [], (err, rows) => {
    if (err) throw err;
    console.table(rows);
});
