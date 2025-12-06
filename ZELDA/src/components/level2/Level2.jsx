import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Level2.css';

function Level2() { 
    // 시뮬레이션 상태
    const [activeSection, setActiveSection] = useState('intro');
    const [simInput, setSimInput] = useState('');
    
    // 위험한 스크립트 감지 (간단한 예시: <script>)
    // 실제로는 인코딩되지 않은 <, > 등이 핵심
    const isScriptPresent = simInput.includes('<script>') || simInput.includes('alert(');

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
    };

    // React의 dangerouslySetInnerHTML을 이용한 비안전한 출력 시뮬레이션
    const unsafeOutput = (
        <p className="sim-output-text" dangerouslySetInnerHTML={{ __html: simInput || "여기에 입력하신 내용이 출력됩니다." }} />
    );

    return (
        <div>
            {/* 헤더 */}
            <header className="hacking-header">
                <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: '800' }}>Hacking Lab <span style={{fontWeight:'400', color:'#94a3b8'}}>| Level 2</span></h1>
                <Link to="/" style={{ textDecoration: 'none', color: '#64748b', fontSize:'0.9rem', fontWeight: '500' }}>Exit</Link>
            </header>
            
            <div className="theory-container">
                
                {/* [왼쪽] 사이드바 */}
                <aside className="sidebar">
                    <div className="sidebar-title">Curriculum</div>
                    <ul className="sidebar-list">
                        <li>
                            <a href="#intro" className={`sidebar-link ${activeSection === 'intro' ? 'active' : ''}`} onClick={() => handleNavClick('intro')}>
                                01. XSS란 무엇인가?
                            </a>
                        </li>
                        <li>
                            <a href="#mechanism" className={`sidebar-link ${activeSection === 'mechanism' ? 'active' : ''}`} onClick={() => handleNavClick('mechanism')}>
                                02. 공격 원리 및 유형
                            </a>
                        </li>
                        <li>
                            <a href="#simulation" className={`sidebar-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => handleNavClick('simulation')}>
                                03. 실시간 실행 시뮬레이터
                            </a>
                        </li>
                        <li>
                            <a href="#defense" className={`sidebar-link ${activeSection === 'defense' ? 'active' : ''}`} onClick={() => handleNavClick('defense')}>
                                04. 올바른 방어법
                            </a>
                        </li>
                    </ul>
                    {/* Level2Game으로 링크 변경 */}
                    <Link to="/level2Game" className="game-btn-sidebar">실전 해킹 (Game Start)</Link>
                </aside>

                {/* [오른쪽] 본문 */}
                <main className="content-panel">
                    <h1 className="section-title">Cross-Site Scripting (XSS)</h1>
                    <p className="section-desc">웹 애플리케이션 보안의 기본 중 하나인 XSS 취약점의 작동 원리를 파헤치고 방어법을 배웁니다.</p>
                    
                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                    {/* 1. 개요 */}
                    <div id="intro">
                        <h2 className="sub-title1">01. XSS란 무엇인가?</h2>
                        <p className="text-body">
                            <strong>Cross-Site Scripting (XSS)</strong>은 공격자가 악성 스크립트(주로 JavaScript)를 
                            다른 사용자(피해자)의 웹 브라우저에 주입(Inject)하여 실행시키는 공격입니다. 
                            공격자가 직접 서버를 해킹하는 것이 아니라, <strong>사용자의 브라우저 권한</strong>을 탈취하는 것이 핵심입니다.
                        </p>
                        
                        <div className="info-box" style={{ borderLeft: '4px solid #3b82f6' }}>
                            <span className="info-title">쉬운 비유: 위조된 신문</span>
                            신문(웹사이트)에 실릴 기사(입력값)에 몰래 광고(악성 스크립트)를 끼워 넣어, 
                            신문을 읽는 모든 독자(사용자)가 그 광고를 보게(스크립트가 실행되게) 만드는 것과 같습니다.
                            광고가 독자의 집(브라우저)에서 실행되므로, 독자의 사적인 정보(쿠키, 세션)에 접근할 수 있게 됩니다.
                        </div>
                    </div>

                    {/* 2. 원리 분석 및 유형 (핵심 컨텐츠) */}
                    <div id="mechanism" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">02. 공격 원리 및 유형</h2>
                        <p className="text-body">
                            XSS는 웹 애플리케이션이 사용자 입력값을 **유효성 검사(Validation)**나 
                            **이스케이프(Escaping, 특수문자 변환)** 없이 그대로 HTML 문서에 포함시킬 때 발생합니다.
                        </p>

                        <h3 className="sub-title2">주요 공격 유형</h3>
                        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>Stored XSS (저장형):</strong><br/>
                                공격자가 악성 스크립트를 서버의 **데이터베이스**에 저장합니다. (예: 게시판 글, 메모). 
                                이 저장된 내용을 열람하는 모든 사용자에게 피해를 줍니다. **(가장 위험)**
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <strong>Reflected XSS (반사형):</strong><br/>
                                악성 스크립트가 URL 등의 입력값을 통해 서버에 전달된 후, **오류 메시지** 등에서 바로 사용자에게 **반사**되어 실행됩니다. 
                                공격자는 피해자에게 악성 URL을 클릭하도록 유도해야 합니다.
                            </li>
                            <li>
                                <strong>DOM-based XSS (DOM 기반):</strong><br/>
                                데이터가 서버를 거치지 않고, 클라이언트 측의 **JavaScript 코드**가 DOM(문서 객체 모델)을 조작하여 발생하는 취약점입니다.
                            </li>
                        </ul>
                    </div>

                    {/* 3. 시뮬레이터 */}
                    <div id="simulation" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">03. 실시간 실행 시뮬레이터 (Reflected XSS)</h2>
                        <p className="text-body">
                            사용자의 입력이 HTML 코드의 일부로 인식되어 위험한 스크립트를 실행하는 상황을 직접 시뮬레이션 해보세요.
                            이 시뮬레이션에서는 React의 <code>dangerouslySetInnerHTML</code>을 사용하여 비안전한 상황을 재현합니다.
                        </p>

                        <div className="practice-box">
                            <label style={{fontWeight:'600', display:'block', marginBottom:'8px', color:'#1e293b', fontSize:'0.9rem'}}>검색 결과 출력 (Simulation)</label>
                            <input 
                                type="text" 
                                className="lab-input"
                                placeholder="여기에 검색어를 입력하세요"
                                value={simInput}
                                onChange={(e) => setSimInput(e.target.value)}
                                style={{marginBottom:'20px'}}
                            />

                            {/* 모니터: 입력값이 HTML로 직접 렌더링되는 비안전한 상황을 재현 */}
                            <div className="query-viewer" style={{minHeight:'100px', padding:'15px', background: '#f8fafc', border: '1px solid #e2e8f0'}}>
                                <div style={{ borderBottom: '1px dashed #334155', paddingBottom: '5px', marginBottom: '10px', color: '#94a3b8', fontSize: '11px' }}>
                                    // BROWSER OUTPUT MONITOR (Unsafe Render)
                                </div>
                                
                                {isScriptPresent && (
                                    <div className="error-msg" style={{color:'#dc2626', fontWeight:'600', marginBottom:'10px'}}>
                                        ⚠️ 악성 스크립트가 실행되었습니다!
                                    </div>
                                )}
                                
                                <div style={{ paddingLeft: '0px', marginTop: '4px', color:'#1e293b' }}>
                                    <span style={{fontWeight:'500'}}>검색 결과:</span>
                                    {unsafeOutput}
                                </div>
                            </div>
                        </div>

                        <div className="info-box" style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', color: '#9a3412' }}>
                            <strong>🎯 직접 해보세요:</strong><br/>
                            입력란에 <span className="code-snippet" style={{background:'#fff', color:'#ea580c'}}>&lt;script&gt;alert('XSS 성공')&lt;/script&gt;</span> 를 입력해보세요.<br/>
                            실제 웹사이트에서는 이 스크립트가 쿠키를 탈취하거나 사용자 모르게 다른 페이지로 이동시킬 수 있습니다.
                        </div>
                    </div>

                    {/* 4. 방어법 */}
                    <div id="defense" style={{ paddingTop: '5px' }}>
                        <h2 className="sub-title1">04. 어떻게 막아야 할까요?</h2>
                        <p className="text-body">
                            해결책은 간단합니다. 사용자의 입력값을 브라우저가 **'HTML 코드'로 인식하지 않도록** 만드는 것입니다.
                            이를 **출력 인코딩(Output Encoding) 또는 이스케이프(Escaping)**라고 합니다.
                        </p>
                        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#374151', marginTop: '15px' }}>
                            <li>
                                <strong>특수 문자 치환 (Escaping):</strong><br/>
                                <span className="code-snippet">&lt;</span> (여는 꺾쇠)를 <span className="code-snippet">&amp;lt;</span>로, 
                                <span className="code-snippet">&gt;</span> (닫는 꺾쇠)를 <span className="code-snippet">&amp;gt;</span>로 변경하여 HTML 코드가 아닌 일반 텍스트로 보이게 합니다.
                            </li>
                            <li>
                                <strong>React/Vue/Angular 사용:</strong><br/>
                                현대적인 프론트엔드 프레임워크는 기본적으로 모든 출력을 **자동으로 이스케이프**합니다. 
                                (예외: <code>dangerouslySetInnerHTML</code> 같은 특정 기능 사용 시에만 위험).
                            </li>
                            <li>
                                <strong>Content Security Policy (CSP) 설정:</strong><br/>
                                웹 페이지에 외부 스크립트 실행을 제한하는 보안 정책을 적용하여 XSS 공격의 위험을 줄입니다.
                            </li>
                        </ul>

                        <div className="query-viewer" style={{ background: '#1e293b', marginTop: '10px' }}>
                            <span style={{color:'#6a9955'}}>// 안전한 React 코드 예시</span><br/>
                            <span className="sql-kw">const</span> safeOutput = &lt;p&gt;{'{'}userInput{'}'}&lt;/p&gt;;<br/>
                            <span style={{color:'#6a9955'}}>// React는 '{'}userInput{'}'이 &lt;script&gt;여도 자동으로 &amp;lt;script&amp;gt;로 변환합니다.</span><br/>
                        </div>
                    </div>

                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '20px', color: '#64748b', fontSize:'0.95rem' }}>
                            원리를 완벽히 이해하셨나요? 이제 XSS 취약점을 이용해 암호화 키를 탈취하는 실전 미션에 도전해봅시다.
                        </p>
                        <Link to="/level2Game" className="btn-action">
                            실전 미션 도전하기 →
                        </Link>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default Level2;