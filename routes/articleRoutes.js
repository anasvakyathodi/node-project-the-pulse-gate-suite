const router = require("express").Router();
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const auth = require("../middlewares/auth");

// get articles
router.get("/", auth, async (req, res) => {
  try {
    let { limit, page } = req.query;
    let query = {};
    let count = 0;
    if (!limit) {
      limit = 10;
    }
    if (!page) {
      page = 0;
    }
    query.skip = limit * page;
    query.limit = limit;
    let articles = [];
    if (!req.user) {
      return res
        .status(400)
        .json({ status: "Error", msg: "Oops! User not found!" });
    }
    if (req.user.userType === "admin") {
      // Send all articles if that is an Admin
      count = await Article.count();
      articles = await Article.find({}, {}, query);
    } else {
      // Send articles corresponding to that user
      articles = await Article.find({ authorId: req.user._id }, {}, query);
      count = await Article.count({ authorId: req.user._id });
    }
    return res.status(200).json({
      status: "Success",
      data: articles ? articles : [],
      count,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

//  Create an Article
router.post("/create", auth, async (req, res) => {
  try {
    let { title, content } = req.body;
    // validate content
    if (!title || !content)
      return res
        .status(400)
        .json({ status: "Error", msg: "Please insert title and content" });
    let submissionDate = new Date();

    const newArticle = new Article({
      title,
      content,
      authorId: req.user._id,
      authorName: req.user.displayName,
      submissionTime: Number(submissionDate).toString(),
      status: "no action",
      remarks: null,
    });
    await newArticle.save();
    return res.json({ status: "Success", msg: "Successfully Saved!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: "Error", msg: err.message });
  }
});

// Update an Article
router.patch("/update", auth, async (req, res) => {
  try {
    const { id, title, content } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ status: "Error", msg: "Post ID not Provided!" });
    }
    if (!title && !content) {
      return res.status(400).json({
        status: "Error",
        msg: "Article Title and Content cannot be Empty!!",
      });
    }
    //validate
    let payload = {};
    if (title) {
      payload.title = title;
    }
    if (content) {
      payload.content = content;
    }
    let updatedTime = new Date();
    payload.submittedTime = Number(updatedTime).toString();
    payload.status = "no action";
    payload.remarks = null;
    await Article.updateOne({ _id: id }, payload);
    return res.status(200).json({
      status: "Success",
      msg: "Successfully Updated",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

// Review an Article
router.post("/review", auth, async (req, res) => {
  try {
    const { action, id, remarks } = req.body;
    if (req.user.userType !== "admin") {
      return res.status(401).json({ status: "Error", msg: "Access Denied!" });
    }
    //validate
    if (!action || !id) {
      return res
        .status(400)
        .json({ status: "Error", msg: "Oops! Something went wrong!" });
    }
    const article = await Article.findOne({ _id: id });
    if (!article) {
      return res
        .status(401)
        .json({ status: "Error", msg: "Article Not Found!" });
    }
    let payload = {
      status: action,
    };
    if (remarks) {
      payload.remarks = remarks;
    }
    await Article.updateOne({ _id: id }, payload);
    return res.status(200).json({
      status: "Success",
      msg: "Successfully Submitted",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
