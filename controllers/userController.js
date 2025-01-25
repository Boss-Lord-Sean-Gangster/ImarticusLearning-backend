

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();
  
  res.status(201).json({ message: "User registered successfully", user: newUser });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  res.status(200).json({ message: "Login successful", token });
};

// Update User
const updateUser = async (req, res) => {
    const { userId } = req.params; // Get userId from params (from the URL)
    const { name, email, password, role } = req.body;
  
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Check if new email already exists
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }
  
    // If password is provided, hash it and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
  
    // Update other fields if provided
    if (name) user.name = name;
    if (role) user.role = role;
  
    await user.save();
    
    res.status(200).json({ message: "User updated successfully", user });
  };

module.exports = { registerUser, loginUser, updateUser };
