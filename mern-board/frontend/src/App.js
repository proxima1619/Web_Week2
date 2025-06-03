import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/api/posts')
      .then(res => setPosts(res.data));
  }, []);

  const handleSubmit = async () => {
    const res = await axios.post('http://localhost:5001/api/posts', {
      title, content
    });
    setPosts([res.data, ...posts]);
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>게시판</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" /><br />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용" /><br />
      <button onClick={handleSubmit}>글 작성</button>
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
