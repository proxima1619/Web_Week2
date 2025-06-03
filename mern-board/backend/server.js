const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// 테스트용 라우터
app.get('/', (req, res) => {
  res.send('연결됐죠?');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const Post = require('./models/Post');

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

app.post('/api/posts', async (req, res) => {
  const { title, content, secret } = req.body;
  const newPost = new Post({ title, content, secret });
  await newPost.save();
  res.json(newPost);
});

app.put('/api/posts/:id', async (req, res) => {
  const { title, content, secret } = req.body;
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content, secret },
    { new: true }
  );
  res.json(updatedPost);
});

app.delete('/api/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Post deleted' });
});
