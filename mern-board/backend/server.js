const verifyToken = require('./middleware/verifyToken');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('연결됐죠?');
});

app.get('/api/posts', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

app.post('/api/posts', verifyToken, async (req, res) => {
  const { title, content, secret } = req.body;
  const newPost = new Post({
    title,
    content,
    secret,
    author: req.user.username  
  });
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

app.delete('/api/posts/:id', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: '글을 찾을 수 없습니다' });

  // 작성자 확인
  if (post.author !== req.user.username && !req.user.isAdmin) {
    return res.status(403).json({ msg: '삭제 권한이 없습니다' });
  }

  await post.deleteOne();
  res.json({ msg: '삭제 완료' });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
