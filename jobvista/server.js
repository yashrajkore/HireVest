const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Resume upload config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/apply.html');
});

// Email sending logic
app.post('/apply', upload.single('resume'), (req, res) => {
  const { fullName, email, phone, message } = req.body;

  if (!req.file) {
  return res.status(400).send('<h2>No resume uploaded. Please upload your resume.</h2>');
}

  const resumePath = req.file.path;

  // Mail transport Setting
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jobvista999@gmail.com',         
      pass: 'petgrnjbogxhzwyk'               
    }
  });

  // Mail options
  
  const mailOptions = {
    from: email,
    to: 'jobvista999@gmail.com',
    subject: `New Job App0lication from ${fullName}`,
    html: `
      <h2>New Application Received</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
    attachments: [
      {
        filename: req.file.originalname,
        path: resumePath
      }
    ]
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email send failed:', error);
      res.status(500).send('Something went wrong.');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('<h2>Application submitted successfully! We have received your details.</h2>');
    }

    // Optional: Delete the uploaded resume file after sending
    fs.unlink(resumePath, (err) => {
      if (err) console.error('Could not delete file:', err);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



const sqlite3 = require('sqlite3').verbose();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// SQLite DB
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite DB.");
});

// Users Table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    user_type TEXT
)`);

// Register user
app.post('/register', (req, res) => {
    const { name, email, password, userType } = req.body;
    const sql = `INSERT INTO users (name, email, password, user_type) VALUES (?, ?, ?, ?)`; 
    db.run(sql, [name, email, password, userType], (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: 'Email already exists!' });
        }
        res.json({ success: true, message: 'User registered successfully!' });
    });
});

// Login user
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
    
    db.get(sql, [email, password], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: 'Server error' });
        
        if (row) {
            return res.json({ 
                success: true, 
                message: 'Login successful!',
                userType: row.user_type 
            });
        }
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
