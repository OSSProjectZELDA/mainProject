import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Level3.css';
import Header from '../../components/header/Header.jsx';
import { useAuth } from '../../context/AuthContext';

function Level3() { 

    // --- 1. 네비게이션 상태 ---
    const [activeSection, setActiveSection] = useState('intro');
    const { user } = useAuth();

    // --- 2. 시뮬레이터 상태 (쇼핑몰 포인트 예시) ---
    const [simState, setSimState] = useState('NORMAL');
    const [simPoints, setSimPoints] = useState(100);    
    const [simLog, setSimLog] = useState("// 대기 중...");

    // 스크롤 핸들러
    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    // [함정] 악성 링크 클릭 (상태 변조)
    const triggerTrap = () => {
        setSimState('HACKED'); // 사용자 몰래 상태 변경
        setSimLog("[SERVER] 세션 상태가 'HACKED(관리자권한)'로 변조되었습니다.");
    };

    // [정상] 쿠폰 받기 버튼 (트리거)
    const triggerAction = () => {
        if (simState === 'HACKED') {
            setSimPoints(simPoints + 50000);
            setSimLog("[CRITICAL] 로직 결함 발생! 관리자급 포인트(+50,000) 지급됨.");
        } else {
            setSimPoints(simPoints + 10);
            setSimLog("[INFO] 정상적인 출석 포인트(+10) 지급됨.");
        }
    };

    // 초기화
    const resetSim = () => {
        setSimState('NORMAL');
        setSimPoints(100);
        setSimLog("// 초기화 완료. 다시 시도해보세요.");
    };

    return (
        <div>
            {/* 헤더 */}
            <Header level={3} user={user} />
            
            <div className="theory-container">
                
                {/* [왼쪽] 사이드바 */}
                <aside className="sidebar">
                    <div className="sidebar-title">Curriculum</div>
                    <ul className="sidebar-list">
                        <li>
                            <a href="#intro" className={`sidebar-link ${activeSection === 'intro' ? 'active' : ''}`} onClick={() => handleNavClick('intro')}>
                                01. CSRF & 로직 결함이란?
                            </a>
                        </li>
                        <li>
                            <a href="#mechanism" className={`sidebar-link ${activeSection === 'mechanism' ? 'active' : ''}`} onClick={() => handleNavClick('mechanism')}>
                                02. 공격 원리 해부 (핵심)
                            </a>
                        </li>
                        <li>
                            <a href="#simulation" className={`sidebar-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => handleNavClick('simulation')}>
                                03. 상태 변조 시뮬레이터
                            </a>
                        </li>
                        <li>
                            <a href="#defense" className={`sidebar-link ${activeSection === 'defense' ? 'active' : ''}`} onClick={() => handleNavClick('defense')}>
                                04. 올바른 방어법
                            </a>
                        </li>
                    </ul>
                    <Link to="/level3Game" className="game-btn-sidebar">실전 해킹 (Game Start)</Link>
                </aside>

                {/* [오른쪽] 본문 */}
                <main className="content-panel">
                    <h1 className="section-title">CSRF & Logic Flaws</h1>
                    <p className="section-desc">
                        사용자의 권한을 도용하는 CSRF와 서버의 논리적 허점을 파고드는 상태 의존성 공격을 학습합니다.
                    </p>
                    
                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                    {/* 1. 개요 */}
                    <div id="intro">
                        <h2 className="sub-title1">01. CSRF & 로직 결함이란?</h2>
                        <p className="text-body">
                            <strong>CSRF (Cross-Site Request Forgery)</strong>는 해커가 사용자의 의지와 무관하게, 
                            사용자의 브라우저를 조종하여 서버에 요청을 보내는 공격입니다. 
                            여기에 <strong>서버의 잘못된 로직(순서나 상태 체크 미흡)</strong>이 더해지면 치명적인 결과가 발생합니다.
                        </p>
                        
                        <div className="info-box" style={{ borderLeft: '4px solid #3b82f6' }}>
                            <span className="info-title">쉬운 비유: 졸고 있는 경비원</span>
                            여러분이 <strong>사원증(로그인 쿠키)</strong>을 목에 걸고 졸고 있습니다. 
                            나쁜 사람이 여러분을 휠체어에 태워 '금고 방'으로 밀어 넣습니다.
                            경비원(서버)은 <strong>사원증만 확인</strong>하고 문을 열어줍니다. 여러분은 자의로 간 게 아니지만, 시스템은 이를 구분하지 못합니다.
                        </div>
                    </div>

                    {/* 2. 원리 분석 */}
                    <div id="mechanism" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">02. 공격 원리 해부 (Anatomy)</h2>
                        <p className="text-body">
                            이번 레벨의 핵심인 <strong>'상태 의존성 공격'</strong>은 다음 2단계로 이루어집니다.
                            게임에서도 이 순서를 기억해야 합니다.
                        </p>

                        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>1단계: 상태 변조 (Preparation)</strong><br/>
                                해커는 사용자가 특정 행동(클릭 등)을 하게 유도하여, 서버 내부의 <strong>'상태(State)'</strong>를 공격하기 좋은 상태로 바꿉니다.
                                (예: 쇼핑몰 장바구니 바꾸기, 환전 통화 선택하기 등)
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>2단계: 요청 실행 (Trigger)</strong><br/>
                                상태가 변조된 상황에서, 해커는 <strong>정상적인 요청(비밀번호 변경, 쿠폰 받기 등)</strong>을 보냅니다.
                                서버는 현재 상태가 변조된 줄 모르고, 이 요청을 <strong>'관리자 명령'이나 '송금'</strong>으로 잘못 처리합니다.
                            </li>
                        </ul>
                    </div>

                    {/* 3. 시뮬레이터  */}
                    <div id="simulation" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">03. 상태 변조 시뮬레이터</h2>
                        <p className="text-body">
                            직접 체험해봅시다. 아래는 <strong>'쇼핑몰 포인트 시스템'</strong>입니다. 
                            겉보기엔 평범한 버튼이지만, <strong>순서</strong>에 따라 결과가 완전히 달라집니다.
                        </p>

                        <div className="practice-box">
                            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontWeight:'600', color:'#1e293b'}}>
                                <span>🛒 내 포인트: {simPoints.toLocaleString()} P</span>
                                <button onClick={resetSim} style={{fontSize:'0.8rem', padding:'2px 8px', cursor:'pointer'}}>초기화</button>
                            </div>

                            <div style={{display:'flex', gap:'10px', marginBottom:'15px'}}>
                                <button 
                                    className="lab-input" 
                                    style={{background:'#ef4444', color:'white', border:'none', cursor:'pointer', fontWeight:'bold'}}
                                    onClick={triggerTrap}
                                >
                                    1. [함정] 무료 선물 받기 (클릭)
                                </button>
                                <button 
                                    className="lab-input" 
                                    style={{background:'#3b82f6', color:'white', border:'none', cursor:'pointer', fontWeight:'bold'}}
                                    onClick={triggerAction}
                                >
                                    2. [정상] 출석 쿠폰 받기 (클릭)
                                </button>
                            </div>

                            {/* 모니터 (Level 1의 query-viewer 스타일 재사용) */}
                            <div className="query-viewer">
                                <div style={{ borderBottom: '1px dashed #334155', paddingBottom: '5px', marginBottom: '10px', color: '#94a3b8', fontSize: '11px' }}>
                                    // SERVER SESSION MONITOR (HIDDEN STATE)
                                </div>
                                <div>
                                    <span className="sql-kw">CURRENT_SESSION_STATE</span> = 
                                    <span className="sql-val" style={{color: simState === 'HACKED' ? '#ef4444' : '#10b981'}}> '{simState}'</span>
                                </div>
                                <div style={{ marginTop: '10px', borderTop:'1px solid #334155', paddingTop:'10px', color: '#e2e8f0', fontFamily:'monospace' }}>
                                    &gt; {simLog}
                                </div>
                            </div>
                        </div>

                        <div className="info-box" style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', color: '#9a3412' }}>
                            <strong>게임 공략 힌트:</strong><br/>
                            이번 실전 게임(은행 해킹)도 똑같습니다.<br/>
                            1. 먼저 <strong>환율표(UI)</strong>를 조작하여 서버의 상태를 바꾸세요.<br/>
                            2. 그 다음 <strong>공격 코드(Console)</strong>를 실행하면, 단순한 비밀번호 변경이 <strong>'송금'</strong>으로 바뀝니다.
                        </div>
                    </div>

                    {/* 4. 방어법 */}
                    <div id="defense" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">04. 어떻게 막아야 할까요?</h2>
                        <p className="text-body">
                            두 가지 방어 기법이 동시에 필요합니다.
                        </p>
                        <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#374151', fontSize:'0.95rem' }}>
                            <li style={{marginBottom:'10px'}}><strong>1. CSRF Token 검증:</strong> 서버가 발급한 랜덤 토큰이 없으면 요청을 거부해야 합니다.</li>
                            <li><strong>2. 기능 분리 (Logic Separation):</strong> 하나의 함수(예: 비밀번호 변경) 안에서 다른 중요한 작업(송금 등)을 처리하지 않도록 코드를 분리해야 합니다.</li>
                        </ul>
                        
                        <div className="query-viewer" style={{ background: '#1e293b', marginTop: '15px' }}>
                            <span style={{color:'#6a9955'}}>// 안전한 코드 설계 (Secure Coding)</span><br/>
                            <span className="sql-kw">if</span> (request == <span style={{color:'#ce9178'}}>'password_change'</span>) &#123;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;verify_csrf_token(); <span style={{color:'#6a9955'}}>// 1. 토큰 확인</span><br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;change_pw_only(); <span style={{color:'#6a9955'}}>// 2. 오직 비밀번호만 변경 (송금 로직 제거)</span><br/>
                            &#125;
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '20px', color: '#64748b', fontSize:'0.95rem' }}>
                            원리를 이해하셨나요? Global Wealth Bank 서버에 침투해보세요.
                        </p>
                        <Link to="/level3Game" className="btn-action">
                            실전 미션 도전하기 →
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Level3;