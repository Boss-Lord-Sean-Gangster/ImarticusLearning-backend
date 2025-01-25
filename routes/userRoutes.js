// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser } = require('../controllers/userController');

// POST request to register a new user
router.post('/register', registerUser);

// POST request to login
router.post('/login', loginUser);

// PUT request to update a user by ID
router.put('/:id', updateUser);

module.exports = router;
