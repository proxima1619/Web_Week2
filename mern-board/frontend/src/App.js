import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthForm from './AuthForm';

axios.defaults.withCredentials = true;

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/auth/me')
      .then(res => {
        if (res.data.loggedIn) {
          setUsername(res.data.username);
          setIsAdmin(res.data.isAdmin);
        }
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5001/api/posts')
      .then(res => setPosts(res.data));
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await axios.delete(`http://localhost:5001/api/posts/${id}`, { withCredentials: true });
    setPosts(posts.filter(post => post._id !== id));
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/posts/${id}`, {
        title: editTitle,
        content: editContent,
      }, { withCredentials: true });

      const updatedPosts = posts.map(p => p._id === id ? res.data : p);
      setPosts(updatedPosts);
      setEditingId(null);
    } catch (err) {
      alert('수정 실패');
    }
  };

  const handleLogout = () => {
    axios.post('http://localhost:5001/api/auth/logout')
      .then(() => window.location.reload());
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>게시판</h2>

      {username ? (
        <>
          <p>{username}님 환영합니다!</p>
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
          {editingId === post._id ? (
            <>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} />
              <button onClick={() => handleUpdate(post._id)}>저장</button>
              <button onClick={() => setEditingId(null)}>취소</button>
            </>
          ) : (
            <>
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              {(username === post.author || isAdmin) && (
                <>
                  <button onClick={() => {
                    setEditingId(post._id);
                    setEditTitle(post.title);
                    setEditContent(post.content);
                  }}>수정</button>
                  <button onClick={() => handleDelete(post._id)}>삭제</button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
