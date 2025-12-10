// src/components/startpage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // 훅 가져오기
import { loginAPI } from './MockApi'; // 파일명 대소문자 확인 (mockApi.js인지 MockApi.js인지)
import './Auth.css';
import { SHA256 } from 'crypto-js';
import { enc } from 'crypto-js';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext에서 login 함수 가져오기
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // 기존 에러 초기화

    try {
      // 1. 이메일로 사용자 정보 가져오기
      const user = await loginAPI(email);

      // 2. 비밀번호 검증
      if (user && user.hashedPassword && user.salt) {
        const hashedInput = SHA256(password + user.salt).toString(enc.Hex);
        
        if (hashedInput === user.hashedPassword) {
          // 3. 전역 상태에 로그인 정보 업데이트 (보안 정보 제외)
          const { hashedPassword, salt, ...userInfo } = user;
          login(userInfo);
          
          // 4. 메인 페이지로 이동
          navigate('/');
        } else {
          setError("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
      } else {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      }
      
    } catch (err) {
      setError(err.message);
    }
  };

// ... (rest of the component)


  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h2>로그인</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="example@email.com"
              required 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">비밀번호</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="비밀번호 입력"
              required 
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          
          <button type="submit">로그인</button>
        </form>


        <p className="switch-text">
          계정이 없으신가요? <span onClick={() => navigate('/signup')}>회원가입</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;