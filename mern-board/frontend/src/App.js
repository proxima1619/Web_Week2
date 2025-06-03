import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthForm from './AuthForm'; 

axios.defaults.withCredentials = true;

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    axios.get('http://localhost:5001/api/auth/me')
      .then(res => {
        if (res.data.loggedIn) {
          setUsername(res.data.username);
        }
      });
  }, []);

  // 글 목록 불러오기
  useEffect(() => {
    axios.get('http://localhost:5001/api/posts')
      .then(res => setPosts(res.data));
  }, []);

  // 글 작성
  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5001/api/posts', {
        title, content
      });
      setPosts([res.data, ...posts]);
      setTitle('');
      setContent('');
    } catch (err) {
      alert('로그인이 필요합니다.');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    axios.post('http://localhost:5001/api/auth/logout')
      .then(() => window.location.reload());
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>게시판</h2>

      {username ? (
        <>
          <p>👤 {username}님 환영합니다!</p>
          <button onClick={handleLogout}>로그아웃</button>
          <hr />
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" /><br />
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" /><br />
          <button onClick={handleSubmit}>글 작성</button>
        </>
      ) : (
        <>
          <p>로그인 후 게시글을 작성할 수 있습니다.</p>
          <AuthForm />
        </>
      )}

      <hr />
      {posts.map(post => (
        <div key={post._id} style={{ borderBottom: '1px solid #ccc', marginBottom: 10 }}>
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
