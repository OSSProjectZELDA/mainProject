import React, { useState, useEffect } from 'react';
// 🚨 [수정]: useNavigate를 추가하여 페이지 이동 기능을 사용합니다.
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Level3.css'; // 통합 CSS 파일 사용 가정

function Level3Game() {
    const [searchParams, setSearchParams] = useSearchParams();
    // 🚨 [추가]: useNavigate 훅을 초기화합니다.
    const navigate = useNavigate(); 
    const [showModal, setShowModal] = useState(false);
    
    // 🛡️ [Security] 매번 바뀌는 CSRF 토큰 (서버 세션 흉내)
    const [csrfToken, setCsrfToken] = useState("");

    // 🌎 API Data State (List/Search/Filter 기능 구현용)
    const [exchangeData, setExchangeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // 통화명/코드 검색
    const API_KEY = 'bEuMBC96ilXgr5ohrSKVLUWzi4FakoAT'; // 발급된 인증키 반영

    // 피해자(일반 사용자 / 공격 목표) 상태
    const [user, setUser] = useState({
        name: 'Normal_User',
        role: 'Premium Member',
        password: 'secure_password_99'
    });

    // 📜 분석용 DVWA 소스코드 (PHP 원본 유지)
    const sourceCode = `<?php
// vulnerabilities/csrf/source/medium.php

if( isset( $_GET[ 'Change' ] ) ) {
    // 1. Anti-CSRF Token 검증 (핵심)
    if( $_GET[ 'user_token' ] == $_SESSION[ 'session_token' ] ) {
        $p_new = $_GET[ 'password_new' ];
        $p_conf = $_GET[ 'password_conf' ];

        if( $p_new == $p_conf ) {
            // Update DB...
            echo "<pre>Password Changed.</pre>";
        }
    } else {
        echo "<pre>CSRF token is incorrect. Access Denied.</pre>";
    }
}
?>`;
    
    // **API 호출 실패 시 사용될 풍부한 예시 데이터 목록**
    const MOCK_DATA = [
        { cur_unit: 'USD', cur_nm: '미국 달러', deal_bas_r: '1,380.00' },
        { cur_unit: 'JPY(100)', cur_nm: '일본 옌', deal_bas_r: '9.30' },
        { cur_unit: 'EUR', cur_nm: '유로', deal_bas_r: '1,490.00' },
        { cur_unit: 'CNH', cur_nm: '위안화', deal_bas_r: '190.00' },
        { cur_unit: 'GBP', cur_nm: '영국 파운드', deal_bas_r: '1,700.50' },
        { cur_unit: 'CAD', cur_nm: '캐나다 달러', deal_bas_r: '1,050.20' },
        { cur_unit: 'AUD', cur_nm: '호주 달러', deal_bas_r: '950.00' },
        { cur_unit: 'CHF', cur_nm: '스위스 프랑', deal_bas_r: '1,550.00' },
        { cur_unit: 'HKD', cur_nm: '홍콩 달러', deal_bas_r: '175.00' },
        { cur_unit: 'SGD', cur_nm: '싱가포르 달러', deal_bas_r: '1,010.80' },
        { cur_unit: 'NZD', cur_nm: '뉴질랜드 달러', deal_bas_r: '880.00' },
        { cur_unit: 'THB', cur_nm: '태국 바트', deal_bas_r: '35.50' },
        { cur_unit: 'VND', cur_nm: '베트남 동', deal_bas_r: '0.05' },
    ];


    // --------------------------------------------------------
    // [1] API 데이터 로드 및 CSRF 토큰 생성
    // --------------------------------------------------------
    useEffect(() => {
        const fetchExchangeRate = async () => {
            setLoading(true);
            const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${API_KEY}&searchdate=${today}&data=AP01`;

            try {
                const response = await axios.get(url);
                if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].result !== 4) {
                    setExchangeData(response.data);
                } else {
                    setExchangeData(MOCK_DATA);
                }
            } catch (err) {
                setExchangeData(MOCK_DATA);
            } finally {
                setLoading(false);
            }
        };
        
        const randomToken = Math.random().toString(36).substring(2, 12);
        setCsrfToken(randomToken);
        
        fetchExchangeRate();
    }, [API_KEY]);

    // --------------------------------------------------------
    // [2] 콘솔 해킹 도구 등록 및 미션 설정 (변경 없음)
    // --------------------------------------------------------
    useEffect(() => {
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

    // --------------------------------------------------------
    // [3] 서버 동작 로직 (토큰 검증 및 비밀번호 변경 -> 리디렉션 추가)
    // --------------------------------------------------------
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
                    // 🚨 [추가]: 미션 성공 시 /final 페이지로 이동합니다.
                    setTimeout(() => {
                        alert("🎉 Level 3 Clear! 토큰 우회 성공!");
                        navigate('/final'); // 최종 페이지로 리디렉션
                    }, 500);
                }
            } else {
                alert("System: Passwords did not match.");
            }
        }
    }, [searchParams, csrfToken, navigate]); // navigate를 의존성 배열에 추가
    
    // List/Search 기능 구현: 데이터 필터링 (검색 기능)
    const filteredData = exchangeData.filter(item => {
        const search = searchTerm.toUpperCase();
        const matchesSearch = (item.cur_nm && item.cur_nm.toUpperCase().includes(search)) || 
                              (item.cur_unit && item.cur_unit.toUpperCase().includes(search));
        return matchesSearch;
    });

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
                    {/* 🕵️‍♂️ [핵심] 숨겨진 토큰 필드 (Elements 탭에서만 보임) */}
                    <form className="hidden-security-form">
                        <input type="hidden" name="user_token" value={csrfToken} id="token_field" />
                    </form>

                    {/* API 데이터 (List/Search) - 전체 목록 표시 */}
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


                    {/* 원래 미션 UI (비밀번호 변경) */}
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

                    {/* 초심자용 힌트 영역 */}
                    <div style={{background:'#fff3cd', padding:'15px', borderRadius:'8px', border: '1px solid #ffeeba', marginTop:'20px'}}>
                        <strong style={{color: '#856404'}}>💡 미션 수행 힌트 (CSRF Medium)</strong>
                        <ol style={{color: '#856404', marginTop: '5px', paddingLeft: '20px', fontSize: '0.9rem'}}>
                            <li>**공격 목표 찾기:** 현재 페이지는 비밀번호 변경 요청을 처리하는 페이지입니다. (PHP 소스코드 참고)</li>
                            <li>**토큰 위치 확인:** 브라우저 **F12**를 눌러 **Elements 탭**에서 숨겨진(Hidden) 입력 필드(<code>&lt;input type="hidden" name="user_token"...&gt;</code>)의 **value** 값을 찾으세요.</li>
                            <li>**공격 명령어 조합:** 찾은 토큰 값을 아래 공격 명령어의 `[토큰 값]` 부분에 복사하여 넣으세요.
                                <div style={{fontFamily:'monospace', background:'#f8f9fa', padding:'8px', borderRadius:'4px', marginTop:'5px', overflowX:'auto'}}>
                                    <code>hack('?Change=1&password_new=hacker123&password_conf=hacker123&user_token=[토큰 값]')</code>
                                </div>
                            </li>
                            <li>**실행:** 조합된 명령어를 **Console 탭**에 붙여넣고 Enter를 누르세요.</li>
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