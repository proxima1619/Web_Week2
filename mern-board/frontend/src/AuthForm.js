import React, { useState } from 'react';
import axios from 'axios';

function AuthForm() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const url = `http://localhost:5001/api/auth/${mode}`;
      const res = await axios.post(url, { username, password }, { withCredentials: true });
      alert(res.data.msg);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || '오류 발생');
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>{mode === 'login' ? '로그인' : '회원가입'}</h3>
      <input placeholder="아이디" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleSubmit}>
        {mode === 'login' ? '로그인' : '회원가입'}
      </button>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ marginLeft: 10 }}>
        {mode === 'login' ? '회원가입으로 전환' : '로그인으로 전환'}
      </button>
    </div>
  );
}

export default AuthForm;
