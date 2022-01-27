const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");

// Register an User
router.post("/register", async (req, res) => {
  try {
    let { email, password, userType, passwordCheck, displayName } = req.body;
    // validate
    if (!email || !password || !passwordCheck)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res.status(400).json({
        status: "Error",
        msg: "The password needs to be at least 5 characters long.",
      });
    if (password !== passwordCheck)
      return res.status(400).json({
        status: "Error",
        msg: "Enter the same password twice for verification.",
      });

    // check if it's already existing user
    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res.status(400).json({
        status: "Error",
        msg: "An account with this email already exists.",
      });

    if (!displayName) displayName = email;

    if (userType !== "author" && userType !== "admin") {
      return res.status(400).json({
        status: "Error",
        msg: "Please provide User Type",
      });
    }

    // hashing password before storing database
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      userType,
      displayName,
      tokens: [],
    });
    await newUser.save();
    res
      .status(200)
      .json({ status: "Success", msg: "Successfully Registered!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "No Account with this email !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password !!!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    let tokens = user.tokens;
    await User.updateOne({ _id: user.id }, { tokens: [...tokens, { token }] });
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    const token = req.header("Authorization");
    req.user.tokens = req.user.tokens.filter(
      (curToken) => curToken.token !== token
    );
    await req.user.save();
    return res.json({ status: "Success", msg: "Successfully Logged Out!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Details by passing token
router.get("/getUser", auth, async (req, res) => {
  let { displayName, userType } = req.user;
  return res
    .status(200)
    .json({ status: "Success", data: { userType, displayName } });
});

module.exports = router;
