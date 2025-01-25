// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");  // Import User model

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB using mongoose
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Error connecting to MongoDB: ", err));

// Define routes

// GET route to return all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route to add a new user
app.post("/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
  });

  try {
    const newUser = await user.save();  // Save new user to the database
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT route to edit a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update user details
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.age = req.body.age || user.age;

    const updatedUser = await user.save();  // Save the updated user
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE route to remove a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);  // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();  // Remove the user from the database
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
