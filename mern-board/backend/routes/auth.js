const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ msg: '이미 존재하는 아이디입니다' });

  const hash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hash });
  await newUser.save();
  res.json({ msg: '회원가입 완료' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: '존재하지 않는 아이디입니다' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: '비밀번호가 틀립니다' });

  const token = jwt.sign(
    { id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, { httpOnly: true }).json({ msg: '로그인 성공', username: user.username });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ msg: '로그아웃 완료' });
});

router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.json({ loggedIn: false });
    res.json({ loggedIn: true, username: user.username, isAdmin: user.isAdmin });
  });
});

module.exports = router;
