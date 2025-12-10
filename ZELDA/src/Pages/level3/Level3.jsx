import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Level3.css'; // 공통 CSS (Level 1과 동일한 디자인)

export default function Level3() {
    const [activeSection, setActiveSection] = useState('intro');

    // --- JWT 시뮬레이터 상태 ---
    const [headerJson, setHeaderJson] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    const [payloadJson, setPayloadJson] = useState('{\n  "user": "guest",\n  "role": "user"\n}');
    const [encodedToken, setEncodedToken] = useState('');

    // JSON이 바뀔 때마다 실시간으로 Base64 인코딩하여 토큰 생성
    useEffect(() => {
        try {
            // 1. Header Encode
            const head = btoa(headerJson.replace(/\s/g, '')); // 공백 제거 후 인코딩
            // 2. Payload Encode
            const body = btoa(payloadJson.replace(/\s/g, ''));
            // 3. Signature (가짜)
            const sig = "c2VjcmV0"; 

            setEncodedToken(`${head}.${body}.${sig}`);
        } catch (e) {
            setEncodedToken("Invalid JSON format...");
        }
    }, [headerJson, payloadJson]);

    const handleNavClick = (id) => setActiveSection(id);

    return (
        <div>
            {/* 공통 헤더 */}
            <header className="hacking-header">
                <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: '800' }}>Hacking Lab <span style={{fontWeight:'400', color:'#94a3b8'}}>| Level 3</span></h1>
                <Link to="/" style={{ textDecoration: 'none', color: '#64748b', fontSize:'0.9rem', fontWeight: '500' }}>Exit</Link>
            </header>
            
            <div className="theory-container">
                
                {/* [왼쪽] 사이드바 */}
                <aside className="sidebar">
                    <div className="sidebar-title">Curriculum</div>
                    <ul className="sidebar-list">
                        <li><a href="#intro" className={`sidebar-link ${activeSection === 'intro' ? 'active' : ''}`} onClick={() => handleNavClick('intro')}>01. JWT란?</a></li>
                        <li><a href="#structure" className={`sidebar-link ${activeSection === 'structure' ? 'active' : ''}`} onClick={() => handleNavClick('structure')}>02. 토큰 구조 분석</a></li>
                        <li><a href="#simulation" className={`sidebar-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => handleNavClick('simulation')}>03. 실시간 JWT 실습</a></li>
                        <li><a href="#attack" className={`sidebar-link ${activeSection === 'attack' ? 'active' : ''}`} onClick={() => handleNavClick('attack')}>04. None 알고리즘 공격</a></li>
                    </ul>
                    <Link to="/level3Game" className="game-btn-sidebar">🚀 실전 해킹 (Shadow Bank)</Link>
                </aside>

                {/* [오른쪽] 본문 */}
                <main className="content-panel">
                    <h1 className="section-title1">JWT Logic Flaw</h1>
                    <p className="section-desc">현대 웹 인증의 표준인 JWT(JSON Web Token)의 구조와, 치명적인 설계 결함(None Algorithm)을 학습합니다.</p>
                    
                    <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                    {/* 1. JWT란? */}
                    <div id="intro" style={{ paddingTop: '10px' }}>
                        <h2 className="sub-title1">01. JWT(JSON Web Token)란?</h2>
                        <p className="text-body">
                            JWT는 유저 정보를 JSON 형태로 담아 암호화(또는 인코딩)한 토큰입니다. 
                            로그인 시 서버가 발급해주며, 클라이언트는 이 토큰을 저장했다가 요청할 때마다 제시하여 "나 로그인했어!"라고 증명합니다.
                        </p>
                    </div>

                    {/* 2. 구조 */}
                    <div id="structure" style={{ paddingTop: '20px' }}>
                        <h2 className="sub-title1">02. 토큰의 3단 구조</h2>
                        <p className="text-body">
                            JWT는 점(<code>.</code>)으로 구분된 세 부분으로 이루어져 있습니다.
                        </p>
                        <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#374151' }}>
                            <li><strong style={{color:'#ef4444'}}>Header:</strong> 토큰의 타입과 해시 알고리즘 정보 (예: HS256)</li>
                            <li><strong style={{color:'#8b5cf6'}}>Payload:</strong> 실제 유저 데이터 (아이디, 권한 등)</li>
                            <li><strong style={{color:'#10b981'}}>Signature:</strong> 데이터 변조를 막기 위한 서명</li>
                        </ul>
                    </div>

                    {/* 3. 시뮬레이터 (Interactive) */}
                    <div id="simulation" style={{ paddingTop: '20px' }}>
                        <h2 className="sub-title1">03. JWT 해부기 (Interactive)</h2>
                        <p className="text-body">
                            아래 JSON을 수정해보세요. 자동으로 인코딩되어 토큰이 만들어지는 과정을 볼 수 있습니다.
                        </p>

                        <div className="practice-box">
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{fontWeight:'bold', color:'#ef4444'}}>1. Header (JSON)</label>
                                    <textarea 
                                        className="lab-input" 
                                        style={{ height: '80px', fontFamily: 'monospace' }}
                                        value={headerJson}
                                        onChange={(e) => setHeaderJson(e.target.value)}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{fontWeight:'bold', color:'#8b5cf6'}}>2. Payload (JSON)</label>
                                    <textarea 
                                        className="lab-input" 
                                        style={{ height: '80px', fontFamily: 'monospace' }}
                                        value={payloadJson}
                                        onChange={(e) => setPayloadJson(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="query-viewer" style={{ background: '#fff', border: '2px solid #e5e7eb', color: '#333' }}>
                                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '5px', marginBottom: '10px', fontSize: '12px', color: '#888' }}>
                                    GENERATED TOKEN (Base64 Encoded)
                                </div>
                                <div style={{ wordBreak: 'break-all', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                    {encodedToken.split('.').map((part, i) => (
                                        <span key={i} style={{ 
                                            color: i === 0 ? '#ef4444' : i === 1 ? '#8b5cf6' : '#10b981' 
                                        }}>
                                            {part}{i < 2 ? '.' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. 공격 기법 */}
                    <div id="attack" style={{ paddingTop: '20px' }}>
                        <h2 className="sub-title1">04. None 알고리즘 취약점 (CVE-2015-9235)</h2>
                        <p className="text-body">
                            일부 JWT 라이브러리는 헤더의 <code>alg</code> 값을 <code>none</code>으로 설정하면, 
                            <strong>"서명이 없어도 되는 토큰이구나"</strong>라고 착각하고 검증을 건너뛰는 치명적인 버그가 있었습니다.
                        </p>
                        
                        <div className="info-box" style={{ borderLeft: '4px solid #ef4444', background: '#fef2f2' }}>
                            <strong>🔥 공격 시나리오:</strong><br/>
                            1. 헤더의 <code>"alg": "HS256"</code>을 <code>"none"</code>으로 바꾼다.<br/>
                            2. 페이로드의 <code>"role": "user"</code>를 <code>"admin"</code>으로 바꾼다.<br/>
                            3. 서명 부분(Signature)을 지워서 서버로 보낸다.<br/>
                            4. 서버는 서명 검증 없이 <strong>관리자 권한</strong>을 승인한다!
                        </div>
                    </div>

                    <div style={{ marginTop: '60px', textAlign: 'center' }}>
                        <p style={{ marginBottom: '20px', color: '#64748b' }}>
                            이제 이 원리를 이용하여 'Shadow Bank'의 VIP 금고를 열어보세요.
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