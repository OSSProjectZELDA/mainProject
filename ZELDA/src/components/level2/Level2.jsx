import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Level1.css';

function Level2() { 
    const [activeSection, setActiveSection] = useState('intro');
    const [simUsername, setSimUsername] = useState('');
    const [simPassword, setSimPassword] = useState('');
    
    // 주석 감지
    const isCommented = simUsername.includes('--') || simUsername.includes('#');

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    return (
        <div>
            {/* 헤더 */}
            <header className="hacking-header">
                <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: '800' }}>Hacking Lab <span style={{fontWeight:'400', color:'#94a3b8'}}>| Level 1</span></h1>
                <Link to="/" style={{ textDecoration: 'none', color: '#64748b', fontSize:'0.9rem', fontWeight: '500' }}>Exit</Link>
            </header>
            
            <div className="theory-container">
                
                {/* [왼쪽] 사이드바 */}
                <aside className="sidebar">
                    <div className="sidebar-title">Curriculum</div>
                    <ul className="sidebar-list">
                        <li>
                            <a href="#intro" className={`sidebar-link ${activeSection === 'intro' ? 'active' : ''}`} onClick={() => handleNavClick('intro')}>
                                01. SQL Injection이란?
                            </a>
                        </li>
                        <li>
                            <a href="#mechanism" className={`sidebar-link ${activeSection === 'mechanism' ? 'active' : ''}`} onClick={() => handleNavClick('mechanism')}>
                                02. 공격 원리 분석 (핵심)
                            </a>
                        </li>
                        <li>
                            <a href="#simulation" className={`sidebar-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => handleNavClick('simulation')}>
                                03. 실시간 쿼리 시뮬레이터
                            </a>
                        </li>
                        <li>
                            <a href="#defense" className={`sidebar-link ${activeSection === 'defense' ? 'active' : ''}`} onClick={() => handleNavClick('defense')}>
                                04. 올바른 방어법
                            </a>
                        </li>
                    </ul>
                    <Link to="/level1Game" className="game-btn-sidebar">실전 해킹 (Game Start)</Link>
                </aside>

                {/* [오른쪽] 본문 */}
                <main className="content-panel">
                    <h1 className="section-title">Basic SQL Injection</h1>
                    <p className="section-desc">웹 해킹의 입문이자 가장 위험한 취약점인 SQL Injection의 작동 원리를 파헤칩니다.</p>
                    
                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                    {/* 1. 개요 */}
                    <div id="intro">
                        <h2 className="sub-title1">01. SQL Injection이란?</h2>
                        <p className="text-body">
                            SQL Injection(SQL 삽입)은 해커가 웹 애플리케이션의 입력란에 악의적인 <strong>데이터베이스 명령어(SQL)</strong>를 몰래 집어넣어, 
                            서버가 의도하지 않은 동작을 하게 만드는 공격입니다.
                        </p>
                        
                        <div className="info-box" style={{ borderLeft: '4px solid #3b82f6' }}>
                            <span className="info-title">쉬운 비유: 식당 주문서</span>
                            손님이 주문서에 <em>"짜장면 하나요"</em>라고 쓰는 대신, 
                            <em>"짜장면 하나 주시고, <strong>지금 계산대에 있는 돈도 저한테 다 주세요</strong>"</em>라고 적었더니, 
                            순진한 직원이 그대로 실행해버리는 것과 같습니다.
                        </div>
                    </div>

                    {/* 2. 원리 분석 (핵심 컨텐츠) */}
                    <div id="mechanism" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">02. 공격 원리 해부 (Anatomy)</h2>
                        <p className="text-body">
                            가장 유명한 공격 구문인 <span className="code-snippet">' OR 1=1 --</span> 가 도대체 무슨 뜻인지 하나씩 뜯어봅시다.
                            이것만 이해하면 Level 1은 끝입니다.
                        </p>

                        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>1단계: <span className="code-snippet">'</span> (따옴표)</strong><br/>
                                "내 아이디 입력은 여기서 끝났다"라고 서버에게 알리는 신호입니다. 
                                이걸 넣어야 입력값이 아니라 <strong>명령어</strong>로 인식될 준비가 됩니다.
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>2단계: <span className="code-snippet">OR 1=1</span> (논리 연산)</strong><br/>
                                "또는(OR) 1과 1은 같다"라는 뜻입니다. 1과 1은 언제나 같죠? 즉, <strong>"무조건 참(True)"</strong>을 만듭니다.
                                아이디가 틀려도 이 조건 때문에 로그인이 성공하게 됩니다.
                            </li>
                            <li>
                                <strong>3단계: <span className="code-snippet">--</span> (주석 처리)</strong><br/>
                                "이 뒤로는 다 무시해라"라는 주석(Comment) 기호입니다. 
                                원래 뒤에 있던 <strong>비밀번호 검사 로직을 지워버리는 역할</strong>을 합니다.
                            </li>
                        </ul>
                    </div>

                    {/* 3. 시뮬레이터 */}
                    <div id="simulation" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">03. 실시간 쿼리 시뮬레이터</h2>
                        <p className="text-body">
                            설명만 들어서는 감이 안 오시죠? 직접 입력해보세요.
                            여러분이 입력하는 글자가 서버 내부의 SQL 문장을 어떻게 망가뜨리는지 실시간으로 보여드립니다.
                        </p>

                        <div className="practice-box">
                            <label style={{fontWeight:'600', display:'block', marginBottom:'8px', color:'#1e293b', fontSize:'0.9rem'}}>로그인 폼 (Simulation)</label>
                            <input 
                                type="text" 
                                className="lab-input"
                                placeholder="아이디 입력 (예: admin)"
                                value={simUsername}
                                onChange={(e) => setSimUsername(e.target.value)}
                            />
                            <input 
                                type="text" 
                                className="lab-input"
                                placeholder="비밀번호"
                                value={simPassword}
                                onChange={(e) => setSimPassword(e.target.value)}
                            />

                            {/* 모니터 */}
                            <div className="query-viewer">
                                <div style={{ borderBottom: '1px dashed #334155', paddingBottom: '5px', marginBottom: '10px', color: '#94a3b8', fontSize: '11px' }}>
                                    // LIVE SERVER QUERY MONITOR
                                </div>
                                <div>
                                    <span className="sql-kw">SELECT</span> * <span className="sql-kw">FROM</span> users <span className="sql-kw">WHERE</span>
                                </div>
                                <div style={{ paddingLeft: '20px', marginTop: '4px' }}>
                                    username = '<span className="sql-val">{simUsername}</span>'
                                </div>
                                <div style={{ paddingLeft: '20px' }}>
                                    <span className={isCommented ? "sql-muted" : ""}>
                                        <span className="sql-kw">AND</span> password = '<span className="sql-val">{simPassword}</span>';
                                    </span>
                                    {isCommented && <span className="comment-badge">// 비밀번호 검사 무시됨 (Hacked!)</span>}
                                </div>
                            </div>
                        </div>

                        <div className="info-box" style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', color: '#9a3412' }}>
                            <strong>🎯 직접 해보세요:</strong><br/>
                            아이디 칸에 <span className="code-snippet" style={{background:'#fff', color:'#ea580c'}}>' OR 1=1 --</span> 를 입력해보세요.<br/>
                            비밀번호 검증 줄이 취소선(<s>deleted</s>)으로 바뀌는 게 보이나요? 이제 비밀번호를 몰라도 로그인이 됩니다!
                        </div>
                    </div>

                    {/* 4. 방어법 */}
                    <div id="defense" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">04. 어떻게 막아야 할까요?</h2>
                        <p className="text-body">
                            해결책은 간단합니다. 사용자의 입력을 '명령어'로 해석하지 않도록 분리하면 됩니다.
                            이를 <strong>Prepared Statement</strong>라고 합니다.
                        </p>
                        <div className="query-viewer" style={{ background: '#1e293b', marginTop: '10px' }}>
                            <span style={{color:'#6a9955'}}>// 안전한 코드 예시 (Node.js)</span><br/>
                            <span className="sql-kw">const</span> query = <span style={{color:'#ce9178'}}>"SELECT * FROM users WHERE id = ?"</span>;<br/>
                            <span style={{color:'#6a9955'}}>// 입력값을 쿼리에 붙이지 않고, 별도의 데이터로 전달합니다.</span><br/>
                            db.execute(query, [inputId]); 
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '20px', color: '#64748b', fontSize:'0.95rem' }}>
                            원리를 완벽히 이해하셨나요? 이제 실전 모의해킹을 통해 배워봅시다.
                        </p>
                        <Link to="/level1Game" className="btn-action">
                            실전 미션 도전하기 →
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Level2;