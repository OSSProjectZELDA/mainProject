import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// 기존 게임 컴포넌트들
import StartPage from './components/startpage/StartPage.jsx' 
import Level1 from './components/level1/Level1.jsx' 
import Level2 from './components/level2/Level2.jsx' 
import Level1Game from './components/level1/Level1Game.jsx' 
import Level2Game from './components/level2/Level2Game.jsx'
import AdminPage from './components/level1/AdminPage.jsx'
import Level3 from './components/level3/Level3.jsx'
import Level3Game from './components/level3/Level3Game.jsx' 

// 인증 관련 컴포넌트 (경로 확인 필요)
import LoginPage from './components/startpage/LoginPage.jsx'
import SignupPage from './components/startpage/SignupPage.jsx'

function App() {
  // isLoading 대신 user 데이터로 로그인 여부 확인 (null이면 로그아웃 상태)
  const [user, setUser] = useState(null);
  
  // 로그인 화면인지 회원가입 화면인지 구분 ('login' | 'signup')
  const [authView, setAuthView] = useState('login');

  // 로그인 성공 시 실행되는 함수
  const handleLoginSuccess = (userData) => {
    setUser(userData); // 유저 정보 저장 -> 게임 화면으로 전환됨
    console.log(`로그인 환영합니다: ${userData.name}`);
  };

  // 로그아웃 함수 (필요 시 StartPage 등으로 전달하여 사용)
  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
  };

  return (
    <React.StrictMode>
      {/* user 정보가 없으면(비로그인) 로그인/회원가입 페이지 보여주기 */}
      {!user ? (
        <div className="auth-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
          {authView === 'login' ? (
            <LoginPage 
              onLoginSuccess={handleLoginSuccess} 
              onSwitchToSignup={() => setAuthView('signup')} 
            />
          ) : (
            <SignupPage 
              onSwitchToLogin={() => setAuthView('login')} 
            />
          )}
        </div>
      ) : (
        // user 정보가 있으면(로그인됨) 게임 라우터 보여주기
        <BrowserRouter>
          <Routes>
            {/* StartPage에 user 정보나 로그아웃 기능을 넘겨줄 수도 있습니다 */}
            <Route path="/" element={<StartPage user={user} onLogout={handleLogout} />} />
            
            <Route path="/level1" element={<Level1 />} />
            <Route path="/level1Game" element={<Level1Game />} />
            <Route path="/admin-secret" element={<AdminPage />} />
            <Route path="/level2" element={<Level2 />} />
            <Route path="/level2Game" element={<Level2Game />} />
            <Route path="/level3" element={<Level3 />} />
            <Route path="/level3Game" element={<Level3Game />} />
          </Routes>
        </BrowserRouter>
      )}
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);