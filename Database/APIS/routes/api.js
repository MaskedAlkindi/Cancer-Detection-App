const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const fs = require('fs');
const multer = require('multer');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
require('dotenv').config();

const caCertificate = fs.readFileSync('certificates/ca-certificate.crt');
const firebaseConfig = require('./firebaseConfig'); // Adjust the path as needed

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    ssl: {
        ca: caCertificate
    }
});

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
// Utility function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Utility function to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).send('Access Denied: No Token Provided!');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
};

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { username, password, email, role } = req.body;

  if (!(username && password && email && role)) {
      return res.status(400).send('All input is required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)', 
      [username, hashedPassword, email, role], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).send('Error during user registration');
        }
          res.status(201).send('User registered successfully');
  });
});

// Login Endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (!(username && password)) {
        return res.status(400).send('All input is required');
    }
  
    pool.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error || results.length === 0 || !await bcrypt.compare(password, results[0].password)) {
            return res.status(400).send('Invalid credentials');
        }
        const user = results[0];
        const token = generateToken(user.id);
  
        // Send the token, username, and the user's role in the response
        res.status(200).json({ 
            token, 
            username: user.username, // Include the username in the response
            role: user.role
        });
    });
  });

// Get Logs Endpoint
router.get('/logs', verifyToken, (req, res) => {
  pool.query('SELECT * FROM logs', (error, results) => {
      if (error) {
          return res.status(500).send('Error fetching logs');
      }
      res.status(200).json(results);
  });
});

// Get Pharmacies Endpoint
router.get('/pharmacies', verifyToken, (req, res) => {
  pool.query('SELECT * FROM pharmacies', (error, results) => {
      if (error) {
          return res.status(500).send('Error fetching pharmacies');
      }
      res.status(200).json(results);
  });
});

router.delete('/deletepharmacy/:id', verifyToken, (req, res) => {
    // Check if the user is an admin
   
  
    const pharmacyId = req.params.id;
  
    if (!pharmacyId) {
        return res.status(400).send('Pharmacy ID is required');
    }
  
    pool.query('DELETE FROM pharmacies WHERE id = ?', [pharmacyId], (error, results) => {
        if (error) {
            console.error("Database error:", error);
            return res.status(500).send('Error deleting pharmacy');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Pharmacy not found');
        }
        res.status(200).send('Pharmacy deleted successfully');
    });
  });

  



  const uploadFileToFirebase = async (file) => {
    const storageRef = ref(storage, `pharmacies/${file.originalname}`);
    await uploadBytes(storageRef, file.buffer);
    return getDownloadURL(storageRef);
};

// Create Pharmacy Endpoint (Admin only)
router.post('/addpharmacy', verifyToken, upload.single('image'), async (req, res) => {
    // Check if the user is an admin
   

    const { name, location, specialization, added_by } = req.body;
    const image = req.file;
    if (!(name && location && image && specialization)) {
        return res.status(400).send('All fields are required');
    }

    try {
        const imageUrl = await uploadFileToFirebase(image);

        pool.query('INSERT INTO pharmacies (name, location, picture_url, specialization, added_by) VALUES (?, ?, ?, ?, ?)', 
            [name, location, imageUrl, specialization, added_by], (error, results) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).send('Error adding pharmacy');
                }
                res.status(201).send('Pharmacy added successfully');
        });
    } catch (error) {
        console.error("Firebase upload error:", error);
        return res.status(500).send('Error uploading image to Firebase');
    }
});




// Create Log Endpoint
router.post('/addlog', verifyToken, (req, res) => {
    const { action } = req.body;
    if (!action) {
        return res.status(400).send('Action is required');
    }
  
    const userId = req.user.id; // Get user ID from the verified token
  
    pool.query('INSERT INTO logs (user_id, action) VALUES (?, ?)', 
        [userId, action], (error, results) => {
            if (error) {
                console.error("Database error:", error);
                return res.status(500).send('Error creating log');
            }
            res.status(201).send('Log created successfully');
    });
  });

// Test Database Connection Endpoint
router.get('/test-db', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Database connection error:", err);
            return res.status(500).send('Error connecting to the database');
        }
        connection.query('SELECT 1', (error, results) => {
            connection.release(); // Always release the connection back to the pool

            if (error) {
                console.error("Database query error:", error);
                return res.status(500).send('Error executing test query');
            }
            res.status(200).send('Successfully connected to the database');
        });
    });
});

// Test Endpoint
router.get('/', async (req, res) => {
  return res.status(200).json({
    title: 'Express Testing',
    message: 'The app is working properly!',
  });
});

module.exports = router;
