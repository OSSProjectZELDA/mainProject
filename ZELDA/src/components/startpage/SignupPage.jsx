// src/components/startpage/SignupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. 페이지 이동을 위한 훅 가져오기
import { signupAPI } from './MockApi';
import './Auth.css';
import { SHA256 } from 'crypto-js';
import { enc } from 'crypto-js';


const SignupPage = () => { // props(onSwitchToLogin) 제거
  const navigate = useNavigate(); // 2. 이동 함수 생성

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const salt = Math.random().toString(36).substring(2);
      const hashedPassword = SHA256(formData.password + salt).toString(enc.Hex);

      await signupAPI({ 
        email: formData.email, 
        hashedPassword, 
        salt, 
        name: formData.name 
      });
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      
      navigate('/login'); 
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">이름</label>
            <input 
              id="name"
              name="name" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email"
              name="email" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password"
            >비밀번호</label>
            <input 
              type="password" 
              id="password"
              name="password" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input 
              type="password" 
              id="confirmPassword"
              name="confirmPassword" 
              onChange={handleChange} 
              required 
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? '처리 중...' : '가입하기'}
          </button>
        </form>
        
        <p className="switch-text">
          <span onClick={() => navigate('/login')}>로그인</span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;