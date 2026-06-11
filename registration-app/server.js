const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting for the registration endpoint
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 register requests per `window` (here, per 15 minutes)
    message: { success: false, message: "Too many registration attempts, please try again later." }
});

// Helper function to validate email
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Helper function to validate password
const isStrongPassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
};

// Registration Endpoint
app.post('/api/register', registerLimiter, async (req, res) => {
    const { fullName, email, password } = req.body;

    // 1. Check for empty fields
    if (!fullName || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // 2. Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    // 3. Validate password strength
    if (!isStrongPassword(password)) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number." });
    }

    try {
        // 4. Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 5. Insert into the database
        const sql = `INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)`;
        db.run(sql, [fullName, email, passwordHash], function(err) {
            if (err) {
                // Check for unique constraint violation (duplicate email)
                if (err.message.includes('UNIQUE constraint failed: users.email')) {
                    return res.status(409).json({ success: false, message: "Email is already registered." });
                }
                // Generic server error
                console.error("Database error during registration:", err);
                return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
            }
            
            // Registration successful
            return res.status(201).json({ success: true, message: "Registration successful" });
        });
    } catch (error) {
        console.error("Server error during registration:", error);
        res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
