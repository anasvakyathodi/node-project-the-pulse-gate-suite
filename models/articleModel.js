const mongoose = require("mongoose");

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  submissionTime: { type: Date, required: true, default: new Date() },
  status: { type: String, required: true },
  remarks: { type: String },
});

module.exports = Article = mongoose.model("article", articleSchema);
