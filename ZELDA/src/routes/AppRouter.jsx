import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 위에서 만든 훅 가져오기

// 페이지들 임포트
import StartPage from '../pages/startpage/StartPage';
import LoginPage from '../pages/startpage/LoginPage';
import SignupPage from '../pages/startpage/SignupPage';


// 게임 페이지들
import Level1 from '../pages/level1/Level1';
import Level2 from '../pages/level2/Level2';
import Level3 from '../pages/level3/Level3';
import Level1Game from '../pages/level1/Level1Game';
import Level2Game from '../pages/level2/Level2Game';
import Level3Game from '../pages/level3/Level3Game';
import AdminPage from '../pages/level1/AdminPage';

import FinalPage from '../pages/finalpage/FinalPage';

const AppRouter = () => {
  const { user } = useAuth(); // 로그인 여부 확인

  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 화면: 로그인 여부 상관없이 접속 가능 */}
        <Route path="/" element={<StartPage />} />

        {/* 로그인/회원가입: 이미 로그인했다면 메인으로 튕겨내기 */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />

        {/* 게임 레벨들 */}
        <Route path="/level1" element={<Level1 />} />
        <Route path="/level1Game" element={<Level1Game />} />
        <Route path="/admin-secret" element={<AdminPage />} />
        <Route path="/level2" element={<Level2 />} />
        <Route path="/level2Game" element={<Level2Game />} />
        <Route path="/level3" element={<Level3 />} />
        <Route path="/level3Game" element={<Level3Game />} />

        <Route path="/final" element={<FinalPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;