const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // store userId and other info from token
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
