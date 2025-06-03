const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  secret: { type: Boolean, default: false },
  author: { type: String, default: 'anonymous' }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);