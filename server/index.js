// FILE: server/index.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- THE DEFINITIVE CORS FIX ---
// This is a more explicit and detailed CORS setup.
const corsOptions = {
  origin: 'http://localhost:3000', // Only allow requests from your Next.js app
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));
app.use(express.json());


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));


// --- User Model ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);


// --- NEW: Health Check Route for Testing ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running and healthy!' });
});


// --- API Routes ---

// 1. Register a New User
app.post('/api/register', async (req, res) => {
  console.log("Received a request at /api/register"); // Added for debugging
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log("User successfully registered:", email); // Added for debugging
    res.status(201).json({ msg: 'User registered successfully. Please log in.' });
  } catch (err) {
    console.error("Error in /api/register:", err.message);
    res.status(500).send('Server processing error');
  }
});

// 2. Log In a User
app.post('/api/login', async (req, res) => {
  console.log("Received a request at /api/login"); // Added for debugging
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      console.log("User successfully logged in:", email); // Added for debugging
      res.json({ token });
    });
  } catch (err) {
    console.error("Error in /api/login:", err.message);
    res.status(500).send('Server processing error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));