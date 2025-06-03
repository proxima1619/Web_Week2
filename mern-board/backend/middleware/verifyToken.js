const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ msg: '로그인이 필요합니다' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: '토큰 오류' });
    req.user = user; 
    next(); 
  });
}

module.exports = verifyToken;
