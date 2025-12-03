import { useState, useEffect } from 'react';
//import '../startpage/startPage.css'; 

function Level1() {
  const [inputPassword, setInputPassword] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  // 🕵️‍♂️ 힌트: 페이지가 처음 로딩될 때 개발자 도구(Console)에 비밀번호를 출력함
  useEffect(() => {
    console.log("%c[DEBUG] 관리자 비밀번호: admin1234", "color: yellow; font-size: 14px; background: red;");
    console.log("개발자가 실수로 로그를 안 지웠네요...!");
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === "admin1234") {
      setIsSolved(true);
    } else {
      alert("접근 거부: 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="terminal-container">
      <div className="hacker-card" style={{ width: '400px', margin: '0 auto' }}>
        <h2 className="level-title">LEVEL 1: LOGIN</h2>
        <p className="level-desc">
          이 사이트의 관리자 계정으로 로그인하여<br/>
          <strong>2단계로 가는 플래그(Flag)</strong>를 획득하십시오.
        </p>
        
        {/* 아직 못 풀었을 때: 로그인 폼 보여주기 */}
        {!isSolved ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Admin Password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              style={{ padding: '10px', fontSize: '1rem' }}
            />
            <button type="submit" className="execute-cmd" style={{ cursor: 'pointer' }}>
              LOGIN
            </button>
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
              💡 Hint: 개발자들은 종종 <strong>F12(개발자 도구)</strong>의 흔적을 지우는 걸 깜빡합니다.
            </p>
          </form>
        ) : (
          /* 풀었을 때: 플래그 보여주기 */
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <h3 style={{ color: 'var(--accent-color)' }}>🎉 ACCESS GRANTED!</h3>
            <p>축하합니다. 보안 시스템을 뚫었습니다.</p>
            <div style={{ 
              background: '#eee', 
              padding: '10px', 
              margin: '15px 0', 
              fontWeight: 'bold', 
              fontFamily: 'monospace',
              border: '2px dashed red'
            }}>
              FLAG: {'{Start_The_War}'}
            </div>
            <p style={{ fontSize: '0.8rem' }}>이 플래그를 복사해서 시작 페이지의 2단계에 입력하세요.</p>
            
            {/* 다시 메인으로 돌아가는 버튼 */}
            <button 
              className="execute-cmd" 
              onClick={() => window.location.href = '/'}
            >
              메인으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Level1;