const router = require("express").Router();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");

router.post("/register", async (req, res) => {
  try {
    let { email, password, userType, passwordCheck, displayName } = req.body;
    // validate
    if (!email || !password || !passwordCheck)
      return res.status(400).send({ msg: "Not all fields have been entered." });
    if (password.length < 5)
      return res.status(400).send({
        status: "Error",
        msg: "The password needs to be at least 5 characters long.",
      });
    if (password !== passwordCheck)
      return res.status(400).send({
        status: "Error",
        msg: "Enter the same password twice for verification.",
      });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res.status(400).send({
        status: "Error",
        msg: "An account with this email already exists.",
      });

    if (!displayName) displayName = email;

    if (userType !== "author" && userType !== "admin") {
      return res.status(400).send({
        status: "Error",
        msg: "Please provide User Type",
      });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      userType,
      displayName,
      tokens: [],
    });
    const savedUser = await newUser.save();
    res
      .status(200)
      .send({ status: "Success", msg: "Successfully Registered!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate
    if (!email || !password) {
      return res.status(400).send({ msg: "Not all fields have been entered." });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ msg: "No Account with this email !" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid Password !!!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    let tokens = user.tokens;
    await User.updateOne({ _id: user.id }, { tokens: [...tokens, { token }] });
    res.send({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        userType: user.userType,
      },
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const token = req.header("Authorization");
    req.user.tokens = req.user.tokens.filter(
      (curToken) => curToken.token !== token
    );
    await req.user.save();
    return res.send({ status: "Success", msg: "Successfully Logged Out!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

router.get("/getUser", auth, async (req, res) => {
  let { displayName, userType } = req.user;
  return res
    .status(200)
    .send({ status: "Success", data: { userType, displayName } });
});

module.exports = router;
