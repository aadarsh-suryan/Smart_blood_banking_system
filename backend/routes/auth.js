const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donation = require("../models/Donation");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Disable cache only for the dashboard fetch route
const disableDashboardCache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

// Signup
router.post("/signup", async (req, res) => {
  const { fullname, username, password, phone, address, preferredHospital } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ fullname, username, password: hashed, phone, address, preferredHospital });
    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get current user
router.get("/me", verifyToken, async (req, res) => {
  console.log("Fetching user details for:", req.user.userId);
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user", error: err.message });
  }
});

// Donate blood
router.post("/donate", verifyToken, async (req, res) => {
  const { blood_type, units, donation_date, hospital } = req.body;
  const userId = req.user.userId;

  try {
    const lastDonation = await Donation.findOne({ donor: userId }).sort({ donation_date: -1 });
    const frequency = lastDonation ? lastDonation.frequency + 1 : 1;

    const newDonation = new Donation({
      donor: userId,
      blood_type,
      units,
      donation_date,
      hospital: hospital || "",
      frequency,
    });
    await newDonation.save();

    const CSV_FILE = path.join(__dirname, "../updated_transfusion.csv");
    const newRow = [
      frequency,
      units,
      "0",
      blood_type,
      userId
    ].join(",");

    fs.appendFile(CSV_FILE, `\n${newRow}`, (err) => {
      if (err) console.error("CSV write failed:", err);
    });

    res.status(201).json({ message: "Donation saved in DB and CSV!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Donation failed", error: err.message });
  }
});

// GET /api/dashboard (dashboard data for logged-in user only)
router.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const donations = await Donation.find({ donor: userId }).populate("donor", "fullname");
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard data", error: err.message });
  }
});


module.exports = router;
