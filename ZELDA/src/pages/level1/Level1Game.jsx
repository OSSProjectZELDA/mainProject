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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 
        const lowerUser = username.toLowerCase().replace(/\s/g, ''); 
        
        // 정답 로직
        const isStringInjection = /'([^']+)'='\1'/.test(lowerUser);
        const hasOr = lowerUser.includes('or');
        const hasComment = username.includes('--') || username.includes('#');

        if (hasOr && hasComment && isStringInjection) {
            await updateLevel(2);
            navigate('/admin-secret');
            return;
        }
        if (/[\d]+=[']?[\d]+/.test(lowerUser)) { 
            setMessage("[WAF Blocked] Numeric Logic Injection (1=1) is not allowed.");
            return;
        }
        const quoteCount = (username.match(/'/g) || []).length;
        if (quoteCount % 2 !== 0) {
            setMessage("ERROR 1064 (42000): You have an error in your SQL syntax near '' at line 1");
            return;
        }
        if (username === 'admin' && password === 'real_complex_password') {
            await updateLevel(2);
            navigate('/admin-secret');
        } else {
            setMessage("Login Failed: Invalid username or password.");
        }
    };

    return (
        <div className="level1-wrapper">
            {/* 와이드 모드 적용 */}
            <div className="mock-browser wide-mode">
                <header className="mock-header">
                    <div className="mock-logo">ZELDA <span className="mock-tag">Vulnerability Test</span></div>
                    <div style={{color:'#94a3b8', fontSize:'0.8rem', fontWeight:'bold'}}>ADMIN PORTAL</div>
                </header>

                {/* 가로 배치 적용 */}
                <div className="mock-body horizontal-layout">
                    <aside className="mock-sidebar">
                        <div className="sidebar-title" style={{color:'#94a3b8'}}>QUICK LINKS</div>
                        <ul className="widget-list">
                            <li><a>Home</a></li>
                            <li><a>About Us</a></li>
                            <li><a>Contact</a></li>
                        </ul>
                    </aside>

                    {/* 본문 중앙 정렬 */}
                    <main className="mock-content wide-content center">
                        <div className="login-card">
                            <h2 className="login-title">Admin Login</h2>
                            <p className="login-desc">Secure Login Area</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div style={{marginBottom:'20px'}}>
                                    <label style={{display:'block', marginBottom:'8px', fontWeight:'bold'}}>USERNAME</label>
                                    <input type="text" className="input-field" 
                                        value={username} onChange={(e) => setUsername(e.target.value)} 
                                        placeholder="Enter username" />
                                </div>
                                <div style={{marginBottom:'20px'}}>
                                    <label style={{display:'block', marginBottom:'8px', fontWeight:'bold'}}>PASSWORD</label>
                                    <input type="password" className="input-field" 
                                        value={password} onChange={(e) => setPassword(e.target.value)} 
                                        placeholder="Enter password" />
                                </div>
                                <button type="submit" className="mock-btn-primary">LOGIN</button>
                            </form>

                            {message && (
                                <div style={{marginTop:'20px', padding:'15px', background:'#fee2e2', color:'#b91c1c', borderRadius:'8px', fontFamily:'monospace'}}>
                                    &gt; {message}
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
                <Link to="/level1" className="sim-exit-btn">이론으로 돌아가기</Link>
        </div>
    );
}
export default Level1Game;