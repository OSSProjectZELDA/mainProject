// LoginPage.js
import React, { useState } from 'react';
import { loginAPI } from './MockApi';
import './Auth.css'

const LoginPage = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginAPI(email, password);
      console.log('로그인 성공:', response);
      onLoginSuccess(response.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>이메일</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="input-group">
          <label>비밀번호</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        {error && <p className="error-msg">{error}</p>}
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? '확인 중...' : '로그인'}
        </button>
      </form>
      <p className="switch-text">
        계정이 없으신가요? <span onClick={onSwitchToSignup}>회원가입</span>
      </p>
    </div>
  );
};

export default LoginPage;