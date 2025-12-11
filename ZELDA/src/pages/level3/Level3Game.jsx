// Level3Game.js
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Level3.css'; 
// 파일 경로 확인: './api'로 올바르게 import 되어야 합니다.
import { fetchExchangeRateList } from './api'; 

function Level3Game() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    
    // 🛡️ [Security] 매번 바뀌는 CSRF 토큰
    const [csrfToken, setCsrfToken] = useState("");

    // 🌎 API Data State 
    const [exchangeData, setExchangeData] = useState([]); // <--- 데이터가 여기에 저장됩니다.
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // 피해자(일반 사용자 / 공격 목표) 상태
    const [user, setUser] = useState({
        name: 'Normal_User', 
        role: 'Premium Member', 
        password: 'secure_password_99'
    });

    // 📜 분석용 DVWA 소스코드 (생략)
    const sourceCode = `<?php
// ... (PHP 코드 유지) ...
?>`;
    
    // --------------------------------------------------------
    // [1] API 데이터 로드 (List 기능) 및 CSRF 토큰 생성
    // --------------------------------------------------------
    useEffect(() => {
        const loadDataAndToken = async () => {
            setLoading(true);
            
            // API 모듈을 사용하여 데이터 로드. MOCK_DATA 또는 실제 데이터 반환.
            const data = await fetchExchangeRateList();
            
            // 데이터를 상태에 저장합니다.
            if (Array.isArray(data) && data.length > 0) {
                 setExchangeData(data);
            } else {
                 // 데이터가 없거나 배열이 아니면 빈 배열로 초기화 (혹시 모를 오류 방지)
                 setExchangeData([]);
            }

            setLoading(false);
        };
        
        // CSRF 토큰 생성
        const randomToken = Math.random().toString(36).substring(2, 12);
        setCsrfToken(randomToken);
        
        loadDataAndToken();
    }, []); 
    
    // --------------------------------------------------------
    // [2] 콘솔 해킹 도구 등록 및 [3] 서버 동작 로직 (변경 없음)
    // --------------------------------------------------------
    useEffect(() => {
        // ... (기존 콘솔 로직 유지) ...
        console.clear();
        console.log("%c🔵 SHIELD BANK SYSTEM SHELL", "color: #00aaff; font-size: 20px; font-weight: bold; padding: 10px; border: 2px solid #00aaff;");
        console.log("%c[Mission] 로그인된 사용자(Normal_User)의 비밀번호를 CSRF 공격으로 'hacker123'으로 변경하시오.", "color: white;");
        console.log("%c[Hint] URL: ?Change=1&password_new=hacker123&password_conf=hacker123&user_token=...", "color: #fbbf24;");
        console.log("%c👉 사용법: hack('?파라미터=값&...')", "color: lime; font-weight:bold;");

        window.hack = (queryString) => {
            if (!queryString || !queryString.startsWith('?')) {
                console.error("❌ Error: Query must start with '?'");
                return;
            }
            console.log(`%c[*] Payload Sent: ${queryString}`, "color: yellow");
            setSearchParams(new URLSearchParams(queryString));
            return "Request Sent.";
        };

        return () => { delete window.hack; };
    }, [setSearchParams]);


    useEffect(() => {
        const change = searchParams.get('Change');
        const p_new = searchParams.get('password_new');
        const p_conf = searchParams.get('password_conf');
        const tokenInput = searchParams.get('user_token');

        if (change) {
            // 1. 토큰 검사
            if (tokenInput !== csrfToken) {
                console.error(`❌ CSRF token mismatch. (Server expected: HIDDEN, You sent: ${tokenInput || 'null'})`);
                alert("🚫 보안 경고: CSRF Token이 일치하지 않습니다.");
                return;
            }

            // 2. 비번 변경
            if (p_new && p_conf && p_new === p_conf) {
                setUser(prev => ({ ...prev, password: p_new }));
                console.log("%c✅ Password Changed Successfully.", "color: #00ff00; background: #003300; padding: 4px;");
                alert("System: Password Changed.");

                if (p_new === 'hacker123') {
                    setTimeout(() => alert("🎉 Level 3 Clear! 토큰 우회 성공!"), 500);
                }
            } else {
                alert("System: Passwords did not match.");
            }
        }
    }, [searchParams, csrfToken]);
    
    // List/Search 기능 구현: 데이터 필터링 (검색 기능)
    // 이 로직은 `exchangeData` 상태에 데이터가 있다면 정상 작동합니다.
    const filteredData = exchangeData.filter(item => {
        const search = searchTerm.toUpperCase();
        const matchesSearch = (item.cur_nm && item.cur_nm.toUpperCase().includes(search)) || 
                              (item.cur_unit && item.cur_unit.toUpperCase().includes(search));
        return matchesSearch;
    });

    // --------------------------------------------------------
    // [4] 렌더링 부분 (변경 없음)
    // --------------------------------------------------------
    return (
        <div className="game-container-l3">
            <div className="dashboard-card-l3">
                <header className="bank-header-l3">
                    <div style={{display:'flex', alignItems:'center'}}>
                        <h1 style={{margin:0, fontSize:'1.3rem', fontWeight:'bold'}}>🔒 계정 보안 관리</h1>
                        <span className="admin-tag-l3">USER</span>
                    </div>
                    <button className="view-source-btn-l3" onClick={() => setShowModal(true)}>&lt;/&gt; Source</button>
                </header>

                <div className="bank-content-l3">
                    {/* 🕵️‍♂️ [핵심] 숨겨진 토큰 필드 */}
                    <form className="hidden-security-form">
                        <input type="hidden" name="user_token" value={csrfToken} id="token_field" />
                    </form>

                    {/* -------------------------------------------------------- */}
                    {/* API 데이터 (List/Search) - 데이터는 filteredData를 통해 표시됩니다. */}
                    {/* -------------------------------------------------------- */}
                    <h3 style={{marginTop:'10px', marginBottom:'8px'}}>📈 거래소 현황 (시스템 상태 모니터링)</h3>
                    <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                        <input
                            type="text"
                            placeholder="통화 검색 (USD, JPY, 위안화 등)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{padding:'6px', border:'1px solid #ccc', borderRadius:'4px', flexGrow: 1, fontSize:'0.9rem'}}
                        />
                         <span style={{alignSelf:'center', fontSize:'0.8rem', color: exchangeData.length > 10 ? '#16a34a' : '#ef4444'}}>
                            Status: {loading ? 'Loading...' : (exchangeData.length > 10 ? 'API OK (Full List)' : 'Local/Partial Data')}
                        </span>
                    </div>
                    
                    {/* API List Table (List 기능) */}
                    <div className="rate-list-container-l3" style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius:'6px' }}>
                        <table style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{backgroundColor: '#f1f5f9'}}>
                                    <th style={{padding:'5px', fontSize:'0.8rem', textAlign: 'left'}}>코드</th>
                                    <th style={{padding:'5px', fontSize:'0.8rem', textAlign: 'left'}}>통화명</th>
                                    <th style={{padding:'5px', fontSize:'0.8rem', textAlign: 'right'}}>기준율</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* List 기능 구현: 필터링된 전체 목록 표시 */}
                                {filteredData.length > 0 ? filteredData.map((rate, index) => (
                                    <tr key={rate.cur_unit || index} style={{borderBottom: '1px solid #f1f5f9'}}>
                                        <td style={{padding:'5px', fontSize:'0.8rem', textAlign: 'left'}}>{rate.cur_unit}</td>
                                        <td style={{padding:'5px', fontSize:'0.8rem', textAlign: 'left'}}>{rate.cur_nm}</td>
                                        <td style={{padding:'5px', fontSize:'0.8rem', fontWeight:'bold', textAlign: 'right'}}>{rate.deal_bas_r}</td>
                                    </tr>
                                )) : <tr><td colSpan="3" style={{padding:'5px', textAlign:'center', fontSize:'0.8rem'}}>검색 결과 없음</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    {/* -------------------------------------------------------- */}


                    {/* ... (비밀번호 변경 UI 및 힌트 영역 유지) ... */}
                    <h2 style={{fontSize: '1.2rem', color: '#1e293b', marginTop:'30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px'}}>
                        🔐 비밀번호 변경 (공격 목표)
                    </h2>
                    <div className="user-profile-l3">
                        <div className="avatar-l3">👤</div>
                        <div>
                            <h3 style={{margin:0, color:'#1e293b'}}>{user.name}</h3>
                            <p style={{margin:0, fontSize:'0.85rem', color:'#64748b'}}>{user.role}</p>
                        </div>
                    </div>

                    <div className="security-status-l3">
                        <div className="status-item-l3">
                            <span>Security Level</span>
                            <span className="value-l3 medium">Medium (Token Protected)</span>
                        </div>
                        <div className="status-item-l3">
                            <span>Current Password</span>
                            <span className="value-l3 password">{user.password}</span>
                        </div>
                    </div>

                    <div style={{background:'#fff3cd', padding:'15px', borderRadius:'8px', border: '1px solid #ffeeba', marginTop:'20px'}}>
                        <strong style={{color: '#856404'}}>💡 미션 수행 힌트 (CSRF Medium)</strong>
                        <ol style={{color: '#856404', marginTop: '5px', paddingLeft: '20px', fontSize: '0.9rem'}}>
                            <li>**공격 목표 찾기:** 현재 페이지는 비밀번호 변경 요청을 처리하는 페이지입니다. (PHP 소스코드 참고)</li>
                            <li>**토큰 위치 확인:** 브라우저 **F12**를 눌러 **Elements 탭**에서 숨겨진(Hidden) 입력 필드(<code>&lt;input type="hidden" name="user_token"...&gt;</code>)의 **value** 값을 찾으세요. </li>
                            <li>**공격 명령어 조합:** 찾은 토큰 값을 아래 공격 명령어의 `[토큰 값]` 부분에 복사하여 넣으세요.
                                <div style={{fontFamily:'monospace', background:'#f8f9fa', padding:'8px', borderRadius:'4px', marginTop:'5px', overflowX:'auto'}}>
                                    <code>hack('?Change=1&password_new=hacker123&password_conf=hacker123&user_token=[토큰 값]')</code>
                                </div>
                            </li>
                            <li>**실행:** 조합된 명령어를 **Console 탭**에 붙여넣고 Enter를 누르세요. </li>
                        </ol>
                    </div>

                </div>
            </div>

            {/* 소스코드 모달 (PHP 원본 유지) */}
            {showModal && (
                <div className="modal-overlay-l3" onClick={() => setShowModal(false)}>
                    <div className="modal-box-l3" onClick={e => e.stopPropagation()}>
                        <div className="modal-top-l3">
                            <span>vulnerabilities/csrf/source/medium.php</span>
                            <button onClick={() => setShowModal(false)} style={{background:'none',border:'none',color:'#fff',cursor:'pointer'}}>✕</button>
                        </div>
                        <pre className="code-block-l3">{sourceCode}</pre>
                    </div>
                </div>
            )}

            <Link to="/level3" className="sim-exit-btn">🚪 이론으로 돌아가기</Link>
        </div>
    );
}

export default Level3Game;