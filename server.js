const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express(); // Initialize the express app
const port = process.env.PORT || 3308; // Use the port from Render or default to 3308

app.use(cors()); // Use CORS middleware
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

// Determine if using local or hosted database
const isLocal = process.env.DB_ENV === 'local'; // Set this environment variable accordingly

// Create connection to MySQL using environment variables
const connection = mysql.createConnection({
    host: isLocal ? 'localhost' : 'sql12.freemysqlhosting.net', // Use localhost for local, hosted server otherwise
    user: isLocal ? 'root' : 'sql12732788', // Update as necessary for local username
    password: isLocal ? '' : 'iQzDlzu7vQ', // Replace with your local password
    database: isLocal ? 'portfolio_api' : 'sql12732788', // Replace with your local database name
    port: isLocal ? 3307 : 3306 // Use 3307 for local MySQL, 3306 for hosted
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        process.exit(1); // Exit if the connection fails
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
