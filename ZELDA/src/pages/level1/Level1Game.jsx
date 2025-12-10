import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Level1.css';
import { useAuth } from '../../context/AuthContext';

function Level1Game() { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();
    const { updateLevel } = useAuth();

    // 🎲 랜덤 에러 메시지 뱅크 (야무진 리스트)
    const sqlErrors = [
        "Warning: mysql_fetch_array() expects parameter 1 to be resource, boolean given in /var/www/html/login.php on line 32",
        "ERROR 1064 (42000): You have an error in your SQL syntax; check the manual near '' at line 1",
        "Unclosed quotation mark after the character string '''.",
        "Fatal error: Uncaught mysqli_sql_exception: You have an error in your SQL syntax in /index.php:15"
    ];

    const wafErrors = [
        "🚫 [WAF] Malicious Request Blocked (Rule ID: 942100)",
        "⚠️ Security Alert: Numeric SQL Injection pattern detected.",
        "Access Denied: The firewall has blocked your IP due to suspicious activity.",
        "406 Not Acceptable: Tautology attack (e.g., 1=1) is not allowed."
    ];

    const loginErrors = [
        "❌ Login Failed: Invalid username or password.",
        "Error: User not found in database.",
        "Authentication failed. Please try again.",
        "System: Access denied for user 'guest'@'localhost'"
    ];

    // 랜덤 메시지 선택 함수
    const pickRandomError = (errorList) => {
        const randomIndex = Math.floor(Math.random() * errorList.length);
        return errorList[randomIndex];
    };
const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 

        // 1. 분석용 데이터 정제 (소문자 + 공백제거)
        // 예: "' OR 'a'='a' --"  =>  "'or'a'='a'--"
        const lowerUser = username.toLowerCase().replace(/\s/g, ''); 

        // ---------------------------------------------------------
        // 🏆 [정답 체크 1순위] : 완벽한 공격 패턴이면 바로 통과 (프리패스)
        // ---------------------------------------------------------
        // 조건: 
        // 1. OR가 있어야 함
        // 2. 주석(-- 또는 #)이 있어야 함
        // 3. '문자'='문자' 형태가 있어야 함 (숫자 1=1 말고)
        const isStringInjection = /'([^']+)'='\1'/.test(lowerUser); // 'a'='a' 처럼 양쪽이 같는지 확인
        const hasOr = lowerUser.includes('or');
        const hasComment = username.includes('--') || username.includes('#');

        if (hasOr && hasComment && isStringInjection) {
            // 정답이면 다른 에러 체크(WAF, Syntax) 건너뛰고 바로 이동
            await updateLevel(2);
            navigate('/admin-secret');
            return;
        }

        // ---------------------------------------------------------
        // 🛡️ [WAF 방어] : 숫자형 1=1 패턴은 차단
        // ---------------------------------------------------------
        // 입력값에 1=1, 2=2 같은 게 있으면 경고
        if (/[\d]+=[']?[\d]+/.test(lowerUser)) { 
            setMessage("🚫 [WAF Blocked] Numeric Logic Injection (1=1) is not allowed.");
            return;
        }

        // ---------------------------------------------------------
        // 🐞 [Syntax 에러] : 정답이 아닌데 따옴표가 이상하면 에러
        // ---------------------------------------------------------
        // 정답 패턴이 아닌데 따옴표 개수가 홀수면 -> 문법 에러 흉내
        const quoteCount = (username.match(/'/g) || []).length;
        if (quoteCount % 2 !== 0) {
            const sqlErrors = [
                "ERROR 1064 (42000): You have an error in your SQL syntax near '' at line 1",
                "Unclosed quotation mark after the character string.",
                "Warning: mysql_fetch_assoc() expects parameter 1 to be resource, boolean given"
            ];
            setMessage(sqlErrors[Math.floor(Math.random() * sqlErrors.length)]);
            return;
        }

        // ---------------------------------------------------------
        // 🚪 [일반 로그인 시도]
        // ---------------------------------------------------------
        if (username === 'admin' && password === 'real_complex_password') {
            await updateLevel(2);
            navigate('/admin-secret');
        } else {
            setMessage("❌ Login Failed: Invalid username or password.");
        }
    };

    return (
        <div className="acu-body">
            <div className="acu-wrapper">
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

                            {/* 동적 에러 메시지 표시 영역 */}
                            {message && (
                                <div style={{ 
                                    marginTop: '15px', 
                                    color: '#d00', 
                                    fontSize: '11px', 
                                    fontWeight: 'bold',
                                    fontFamily: 'Courier New, monospace',
                                    lineHeight: '1.4',
                                    whiteSpace: 'pre-wrap' // 에러 메시지 줄바꿈 허용
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