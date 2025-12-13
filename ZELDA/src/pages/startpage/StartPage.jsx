// src/components/startpage/StartPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Context Hook
import Header from '../../components/header/Header.jsx'; // Header 컴포넌트
import './StartPage.css';

// hashString 함수는 그대로 유지
const hashString = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

function StartPage() {
  const { user, updateLevel } = useAuth(); 
  
  // Header 내부에서 처리하므로 StartPage에서는 Modal 관련 상태가 필요 없습니다.
  // const [isModalOpen, setIsModalOpen] = useState(false);  <-- 삭제됨
  
  const [unlockedStage, setUnlockedStage] = useState(1);

  useEffect(() => {
    document.body.classList.add('startpage-body');
    return () => {
        document.body.classList.remove('startpage-body');
    };
  }, []);

  useEffect(() => {
    if (user && user.level) {
      setUnlockedStage(user.level);
    } else {
      setUnlockedStage(1);
    }
  }, [user]);

  const API_ENDPOINT = "https://693408584090fe3bf01eb2cf.mockapi.io/password"; 

  const gameLevels = [
    {
      id: 1,
      code: "L1_BASIC",
      title: "LEVEL 1: SCRIPT KIDDIE",
      subtitle: "Web Hacking / Basic SQLi",
      description: "보안이 허술한 웹사이트의 취약점을 찾아 진입하십시오.",
      url: "/level1",
    },
    {                 
      id: 2,
      code: "L2_STORAGE",      
      title: "LEVEL 2: SECURE STORAGE?",
      subtitle: "Web Storage & Web Crypto API",
      description: "1단계를 클리어하고 얻은 비밀번호(Flag)를 입력하십시오.",
      url: "/level2",
    },
    {
      id: 3,
      code: "L3_ROOT",
      title: "LEVEL 3: BLACK HAT",
      subtitle: "CSRF Attack",
      description: "2단계를 클리어하고 얻은 비밀번호(Flag)를 입력하십시오.",
      url: "/level3",
    },
  ];

  const handleCardClick = async (e, level) => {
    if (level.id <= unlockedStage) return;
    
    e.preventDefault();

    if (level.id > unlockedStage + 1) {
      alert("⚠️ 이전 단계를 먼저 클리어하십시오.");
      return;
    }

    const input = prompt(`[SYSTEM] ${level.title} 접근 권한이 필요합니다.\n비밀번호(Flag)를 입력하십시오:`);

    if (input) {
      try {
        const inputHash = await hashString(input);
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        const targetData = data[level.id - 2]; 

        if (targetData && inputHash === targetData.password) {
          alert("ACCESS GRANTED. 승인되었습니다.");
          
          const newLevel = level.id;
          setUnlockedStage(newLevel); 
          await updateLevel(newLevel); 

        } else {
          alert("ACCESS DENIED. 비밀번호가 일치하지 않습니다.");
        }

      } catch (error) {
        console.error("Error:", error);
        alert("⚠️ 서버 연결 오류: API 주소를 확인해주세요.");
      }
    }
  };

  return (
    <>
      {/* 이곳에 Header를 배치합니다. 
         Header 내부에서 Login/Signup/프로필 모달을 모두 처리합니다.
         level과 user 정보를 넘겨줍니다.
      */}
      <Header user={user} />

      {/* 기존 top-nav 및 Modal 관련 코드는 Header로 이동했으므로 여기서 삭제했습니다. */}

      <div className="terminal-container">
        <div className="overlay-scanline"></div>
        
        <header className="terminal-header">
          <p className="system-log">
            &gt; SYSTEM_BOOT_SEQUENCE_INIT... OK<br/>
            &gt; CONNECTING_TO_AUTH_SERVER... ESTABLISHED<br/>
            &gt; USER_IDENTITY: {user ? user.name : "GUEST_USER"}<br/>
            &gt; CURRENT_ACCESS_LEVEL: {unlockedStage} / 3
          </p>
          <h1 className="glitch-title" data-text="CYBER WARGAME">CYBER WARGAME</h1>
          <p className="sub-title">/// TARGET_SELECTION_REQUIRED ///</p>
        </header>

        <main className="grid-container">
          {gameLevels.map((level) => {
            const isLocked = level.id > unlockedStage;

            return (
              <a 
                key={level.id} 
                href={level.url} 
                className={`hacker-card ${isLocked ? 'locked' : ''}`}
                onClick={(e) => handleCardClick(e, level)}
              >
                <div className="card-header">
                  <span className={`status-dot ${isLocked ? 'red' : 'green'}`}></span>
                  <span className="code-name">
                    {isLocked ? "ACCESS_DENIED" : `Target: ${level.code}`}
                  </span>
                </div>
                
                <div className="card-body">
                  <h2 className="level-title">
                    {isLocked ? "LOCKED" : level.title}
                  </h2>
                  <div className="separator"></div>
                  {isLocked ? (
                    <div className="lock-icon">🔒 RESTRICTED AREA</div>
                  ) : (
                    <>
                      <h3 className="level-subtitle">[{level.subtitle}]</h3>
                      <p className="level-desc">&gt; {level.description}</p>
                    </>
                  )}
                </div>

                <div className="card-footer">
                  <span className="execute-cmd">
                    {isLocked ? "./auth_request.sh" : "./execute_exploit.sh"}
                  </span>
                  <span className="blinking-cursor">_</span>
                </div>
              </a>
            );
          })}
        </main>
      </div>
    </>
  );
}

export default StartPage;