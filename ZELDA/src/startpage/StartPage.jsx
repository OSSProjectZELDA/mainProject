import { useState } from 'react';
import './StartPage.css';
import { SHA256 } from 'crypto-js';

function StartPage() {
  const [unlockedStage, setUnlockedStage] = useState(1);

  const gameLevels = [
    {
      id: 1,
      code: "L1_BASIC",
      title: "LEVEL 1: SCRIPT KIDDIE",
      subtitle: "Web Hacking / Basic SQLi",
      description: "보안이 허술한 웹사이트의 취약점을 찾아 진입하십시오.",
      url: "/level1",
      passwordHash: null 
    },
    {
      id: 2,
      code: "L2_INTER",
      title: "LEVEL 2: WHITE HAT",
      subtitle: "Crypto / Forensics",
      description: "1단계를 클리어하고 얻은 비밀번호(Flag)를 입력하십시오.",
      url: "https://webhacking.kr/",
      passwordHash: "03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4"
    },
    {
      id: 3,
      code: "L3_ROOT",
      title: "LEVEL 3: BLACK HAT",
      subtitle: "System Pwnable / RCE",
      description: "2단계를 클리어하고 얻은 비밀번호(Flag)를 입력하십시오.",
      url: "https://pwnable.kr/",
      // 원래 정답: FLAG{Keep_Going}
      passwordHash: "94c6328334465d6c59b32d201c107f9c8d19736c013b868e4266e74df3a0cd35"
    },
  ];

  const handleCardClick = (e, level) => {
    if (level.id <= unlockedStage) return;

    e.preventDefault();
    
    if (level.id > unlockedStage + 1) {
      alert("⚠️ 이전 단계를 먼저 클리어하십시오.");
      return;
    }

    const input = prompt(`[SYSTEM] ${level.title} 접근 권한이 필요합니다.\n비밀번호(Flag)를 입력하십시오:`);

    if (input) {
      // 3. 유저가 입력한 값을 똑같이 암호화합니다.
      const inputHash = SHA256(input).toString();

      // 개발자 확인용 (나중에 지우세요): 콘솔창(F12)에 내가 입력한 값의 해시가 뜹니다.
      console.log(`입력값: ${input}`);
      console.log(`변환된 해시: ${inputHash}`);

      // 4. 해시값끼리 비교합니다.
      if (inputHash === level.passwordHash) {
        alert("ACCESS GRANTED. 접근 권한이 승인되었습니다.");
        setUnlockedStage(level.id);
      } else {
        alert("ACCESS DENIED. 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  // ... (return 아래 부분은 기존과 동일하므로 그대로 두시면 됩니다)
  return (
    <div className="terminal-container">
      <div className="overlay-scanline"></div>
      
      <header className="terminal-header">
        <p className="system-log">
          &gt; SYSTEM_BOOT_SEQUENCE_INIT... OK<br/>
          &gt; CONNECTING_TO_SERVER... ESTABLISHED<br/>
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
              target="_blank"
              rel="noopener noreferrer"
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
                  {isLocked ? "./decrypt_password.exe" : "./execute_exploit.sh"}
                </span>
                <span className="blinking-cursor">_</span>
              </div>
            </a>
          );
        })}
      </main>
    </div>
  );
}

export default StartPage;