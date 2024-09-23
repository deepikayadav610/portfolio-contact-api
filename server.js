const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // Initialize the express app
const port = process.env.PORT || 3308; // Use the port from Render or default to 3308

app.use(cors()); // Use CORS middleware
app.use(bodyParser.json()); // Middleware to parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

// Create connection to MySQL using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,     // Use environment variable for the host
    user: process.env.DB_USER,     // Use environment variable for username
    password: process.env.DB_PASSWORD, // Use environment variable for password
    database: process.env.DB_NAME, // Use environment variable for database name
    port: 3306, // MySQL port (default is 3306)
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the MySQL database!');
});

// POST route to handle form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({ error: true, message: 'Please provide all required fields!' });
    }

    const query = 'INSERT INTO contact_info (name, email, message, date_time) VALUES (?, ?, ?, NOW())';
    connection.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error saving contact info:', err);
            return res.status(500).json({ error: true, message: 'Database error!' });
        }
        res.status(200).json({ success: true, message: 'Contact info submitted successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
