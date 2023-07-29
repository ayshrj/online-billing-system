const bcrypt = require("bcrypt");
const User = require("../models/user");

// User registration
async function register(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// User login
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // User authentication successful

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during user login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  register,
  login,
};
