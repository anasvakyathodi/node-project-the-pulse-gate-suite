const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .send({ msg: "No Authentication token, Authorization denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res.status(401).send({ msg: "Token verification failed" });
    req.user = await User.findOne({ _id: verified.id });
    if (!req.user) {
      return res.status(401).send({ msg: "Authentication Failed!" });
    }
    next();
  } catch (err) {
    return res.status(401).send({ error: err.message });
  }
};

module.exports = auth;
