const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "express_blog_sql",
});


// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the database.");
});


module.exports = connection;
