import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Level1.css';

function Level1Game() { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // 💡 에러 메시지를 저장할 상태 추가
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(''); // 기존 메시지 초기화
        
        // --- [실전] 보안 필터링 시뮬레이션 ---
        const lowerUser = username.toLowerCase().replace(/\s/g, ''); // 공백제거 소문자
        
        // 1. [SQL Syntax Error 구현] 따옴표(') 개수가 홀수면 문법 에러 발생
        // (사용자가 ' 만 넣었을 때 반응)
        const quoteCount = (username.match(/'/g) || []).length;
        if (quoteCount % 2 !== 0) {
            setMessage("Warning: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 1");
            return;
        }

        // 2. [WAF 작동] 너무 뻔한 '1=1' 공격은 차단함
        if (lowerUser.includes("1=1")) {
            setMessage("[WAF Warning] SQL Injection pattern '1=1' detected and blocked.");
            return;
        }

        // 3. 공격 성공 조건 확인
        // 조건 1: 주석(-- 또는 #)을 사용했는가?
        const hasComment = username.includes('--') || username.includes('#');
        
        // 조건 2: 1=1이 아닌 다른 참 조건(2=2, 'a'='a')을 썼는가?
        const isAdvancedHack = lowerUser.includes("2=2") || lowerUser.includes("'a'='a") || lowerUser.includes("'b'='b");

        if (hasComment && isAdvancedHack) {
            navigate('/admin-secret'); // 관리자 페이지 경로 (이전에 만든 경로 사용)
        } else if (username === 'admin' && password === 'real_complex_password') {
            navigate('/admin-secret');
        } else {
            // 4. 일반 실패
            setMessage("❌ Login Failed: Invalid username or password.");
        }
    };

    return (
        <div className="acu-body">
            <div className="acu-wrapper">
                
                {/* 1. Acunetix 헤더 */}
                <header className="acu-header-top">
                    <div className="acu-logo-box">ZELDA</div>
                    <div style={{ fontWeight:'bold', fontSize:'14px' }}>
                        TEST site for <span style={{color:'black'}}>Web Vulnerability Scanner</span>
                    </div>
                </header>

                <nav className="acu-navbar">
                    <span>home</span> | <span>categories</span> | <span>artists</span> | <span>disclaimer</span> | <span>your cart</span> | <span>guestbook</span>
                </nav>

                <div className="acu-container">
                    
                    {/* 사이드바 */}
                    <aside className="acu-sidebar">
                        <div style={{ background: '#e9e9e9', border: '1px solid #ccc', marginBottom: '15px' }}>
                            <div className="acu-sidebar-header">Search art</div>
                            <div style={{ padding: '10px' }}>
                                <input type="text" style={{width: '90%', border:'1px solid #ccc'}} />
                            </div>
                        </div>
                        <div style={{ background: '#e9e9e9', border: '1px solid #ccc' }}>
                            <div className="acu-sidebar-header">Links</div>
                            <ul style={{ listStyle:'none', padding:'0', margin:'0' }}>
                                <li style={{ padding:'5px 10px', borderBottom:'1px solid #ddd' }}><a href="#" style={{color:'#336699', textDecoration:'none'}}>Your profile</a></li>
                                <li style={{ padding:'5px 10px' }}><a href="#" style={{color:'#336699', textDecoration:'none'}}>Our guestbook</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* 로그인 폼 */}
                    <main className="acu-main">
                        <h3>If you are already registered please enter your login information below:</h3>
                        
                        <div className="acu-login-frame">
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', marginBottom: '10px', alignItems:'center' }}>
                                    <label style={{ width: '80px', fontSize: '11px', fontWeight:'bold' }}>Username:</label>
                                    <input 
                                        type="text" 
                                        value={username} 
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{ border: '1px solid #999', padding: '2px', width: '150px' }}
                                        autoComplete="off"
                                    />
                                </div>
                                <div style={{ display: 'flex', marginBottom: '10px', alignItems:'center' }}>
                                    <label style={{ width: '80px', fontSize: '11px', fontWeight:'bold' }}>Password:</label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ border: '1px solid #999', padding: '2px', width: '150px' }}
                                    />
                                </div>
                                <button type="submit" className="acu-btn">login</button>
                            </form>

                            {/* 🚨 여기에 빨간색 에러 메시지가 표시됩니다 */}
                            {message && (
                                <div style={{ 
                                    marginTop: '15px', 
                                    color: '#d00', 
                                    fontSize: '11px', 
                                    fontWeight: 'bold',
                                    fontFamily: 'Courier New, monospace', // 약간 에러 로그 같은 느낌
                                    lineHeight: '1.4'
                                }}>
                                    {message}
                                </div>
                            )}
                        </div>

                        <div style={{ fontSize: '11px', color: '#666', marginTop: '20px' }}>
                            <p>Signup is currently disabled.</p>
                        </div>
                    </main>
                </div>
            </div>

            <Link to="/level1" className="sim-exit-btn">🚪 이론으로 돌아가기</Link>
        </div>
    );
}

export default Level1Game;