const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
    const { username, email, password, role = "student" } = req.body;

    // check if user exists
    const existingUser = await userModel.findUserByEmailOrUsername(username, email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // insert user
    const result = await userModel.createUser({
      username,
      email,
      password: hash,
      role
    });

    // create token
    const token = jwt.sign(
      {
        id: result.insertId,
        role: role
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: result.insertId,
        username,
        email,
        role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { username, email, password } = req.body;

    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "Please provide credentials" });
    }

    const existingUser = await userModel.findUserByEmailOrUsername(username, email);

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
        role: existingUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: "User logged in successfully!",
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
module.exports = { registerUser,loginUser };