const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "No Authentication token, Authorization denied" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).json({ msg: "Token verification failed" });
    req.user = await User.findOne({ _id: verified.id });
    if (!req.user) {
      return res.status(401).json({ msg: "Authentication Failed!" });
    }
    next();
  } catch (err) {
    return res.status(401).send({ error: err.message });
  }
};

module.exports = auth;
