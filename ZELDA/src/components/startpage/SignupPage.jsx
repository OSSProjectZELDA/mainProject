// SignupPage.js
import React, { useState } from 'react';
import { signupAPI } from './MockApi';
import './Auth.css'

const SignupPage = ({ onSwitchToLogin }) => {
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
      await signupAPI({ 
        email: formData.email, 
        password: formData.password, 
        name: formData.name 
      });
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      onSwitchToLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>이름</label>
          <input name="name" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>이메일</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>비밀번호</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>비밀번호 확인</label>
          <input type="password" name="confirmPassword" onChange={handleChange} required />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : '가입하기'}
        </button>
      </form>
      <p className="switch-text">
        이미 계정이 있으신가요? <span onClick={onSwitchToLogin}>로그인</span>
      </p>
    </div>
  );
};

export default SignupPage;