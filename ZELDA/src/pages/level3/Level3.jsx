import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Level3.css'; // 통합 CSS 파일 사용
import Header from '../../components/header/Header.jsx';
import { useAuth } from '../../context/AuthContext';

function Level3() { 
    const [activeSection, setActiveSection] = useState('intro');
    const [balance, setBalance] = useState(1000000); // 100만원
    const [msg, setMsg] = useState("정상 로그인 상태");
    const { user } = useAuth();

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    // CSRF 공격 시뮬레이션
    const attack = () => {
        if (balance > 0) {
            setBalance(0);
            setMsg("🚨 [ALERT] 비정상적인 이체 발생! 잔고가 0원이 되었습니다.");
        }
    };

    const reset = () => {
        setBalance(1000000);
        setMsg("정상 로그인 상태");
    };

    return (
        <div>
            {/* 헤드 */}
            <Header level={3} user = {user}/>
            
            <div className="theory-container">
                {/* 사이드바 */}
                <aside className="sidebar">
                    <div className="sidebar-title">Curriculum</div>
                    <ul className="sidebar-list">
                        <li><a href="#intro" className={`sidebar-link ${activeSection === 'intro' ? 'active' : ''}`} onClick={() => handleNavClick('intro')}>01. CSRF란?</a></li>
                        <li><a href="#mechanism" className={`sidebar-link ${activeSection === 'mechanism' ? 'active' : ''}`} onClick={() => handleNavClick('mechanism')}>02. 공격 원리</a></li>
                        <li><a href="#simulation" className={`sidebar-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => handleNavClick('simulation')}>03. 피해 체험</a></li>
                        <li><a href="#defense" className={`sidebar-link ${activeSection === 'defense' ? 'active' : ''}`} onClick={() => handleNavClick('defense')}>04. 방어 기법</a></li>
                    </ul>
                    <Link to="/level3Game" className="game-btn-sidebar">실전 해킹 (Game Start)</Link>
                </aside>

                {/* 본문 */}
                <main className="content-panel">
                    <h1 className="section-title">CSRF (Cross-Site Request Forgery)</h1>
                    <p className="section-desc">사용자의 의지와 무관하게, 해커가 의도한 행위를 웹사이트에 요청하게 만드는 공격입니다.</p>
                    
                    <hr style={{ margin: '30px 0', borderTop: '1px solid #e2e8f0' }} />

                    {/* 1. 개요 */}
                    <div id="intro">
                        <h2 className="sub-title1">01. CSRF란?</h2>
                        <p className="text-body">
                            사용자가 특정 사이트(예: 은행)에 로그인되어 있다는 점을 악용합니다. 
                            해커가 보낸 링크를 클릭하는 순간, 브라우저는 사용자의 <strong>권한(쿠키/세션)</strong>을 실어서 해커가 원하는 명령(송금, 비번 변경)을 서버로 보냅니다.
                        </p>
                        <div className="info-box" style={{borderLeft: '4px solid #f59e0b'}}>
                            <strong>비유:</strong><br/>
                            여러분이 졸고 있을 때, 도둑이 여러분의 손가락(지문)을 가져다가 스마트폰 잠금을 풀고 송금해버리는 것과 같습니다.
                        </div>
                    </div>

                    {/* 2. 원리 */}
                    <div id="mechanism">
                        <h2 className="sub-title1">02. 공격 원리</h2>
                        <p className="text-body">브라우저는 요청을 보낼 때, 해당 도메인의 쿠키를 <strong>자동으로 포함</strong>합니다. 이게 핵심 취약점입니다.</p>
                        <div style={{background:'#1e293b', padding:'15px', borderRadius:'8px', color:'#fff', fontFamily:'monospace', fontSize:'0.9rem'}}>
                            &lt;!-- 해커가 만든 가짜 이미지 태그 --&gt;<br/>
                            &lt;img src="<span style={{color:'#facc15'}}>http://bank.com/transfer?to=hacker&amount=100</span>" width=0 height=0 /&gt;
                        </div>
                        <p className="text-body" style={{marginTop:'10px'}}>사용자가 이 이미지를 로딩하는 순간, 브라우저는 <code>bank.com</code>으로 송금 요청을 보냅니다.</p>
                    </div>

                    {/* 3. 시뮬레이션 */}
                    <div id="simulation">
                        <h2 className="sub-title1">03. 피해 시뮬레이션</h2>
                        <p className="text-body">오른쪽 '이벤트 당첨' 버튼은 해커가 심어놓은 함정입니다. 눌러보세요.</p>

                        <div className="practice-box" style={{display:'flex', gap:'20px', alignItems:'center'}}>
                            {/* 피해자 화면 */}
                            <div style={{flex:1, background:'#f1f5f9', padding:'15px', borderRadius:'8px'}}>
                                <div style={{fontWeight:'bold', color:'#2563eb'}}>🏦 내 통장</div>
                                <div style={{fontSize:'1.5rem', fontWeight:'bold', color: balance > 0 ? '#16a34a' : '#dc2626'}}>
                                    {balance.toLocaleString()} 원
                                </div>
                                <div style={{fontSize:'0.8rem', color:'#666'}}>{msg}</div>
                                <button onClick={reset} style={{marginTop:'10px', fontSize:'0.7rem'}}>초기화</button>
                            </div>

                            {/* 공격자 함정 */}
                            <div style={{flex:1, textAlign:'center'}}>
                                <div style={{fontSize:'0.8rem', color:'#64748b', marginBottom:'5px'}}>▼ 피싱 이메일 ▼</div>
                                <button onClick={attack} style={{
                                    background: 'linear-gradient(45deg, #ff00cc, #333399)',
                                    color: 'white', border:'none', padding:'10px 20px', 
                                    borderRadius:'20px', cursor:'pointer', fontWeight:'bold',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                }}>
                                    🎁 100만원 당첨금 받기 (Click)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4. 방어 */}
                    <div id="defense">
                        <h2 className="sub-title1">04. 방어: CSRF Token</h2>
                        <p className="text-body">
                            서버가 랜덤한 <strong>난수(Token)</strong>를 생성해서 화면의 숨겨진 필드에 넣어줍니다.
                            요청이 들어올 때 이 Token이 없거나 틀리면 거부합니다. 해커는 이 랜덤 값을 알 수 없기 때문입니다.
                        </p>
                    </div>

                    <div style={{marginTop:'40px', textAlign:'center'}}>
                        <Link to="/level3Game" className="btn-action">실전 미션 도전하기 →</Link>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Level3;