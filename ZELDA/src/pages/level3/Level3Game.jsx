import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './Level3.css'; 
import { fetchExchangeRateList } from './OpenApi'; 

function Level3Game() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showSource, setShowSource] = useState(false); // 소스코드 토글
    
    const [csrfToken, setCsrfToken] = useState("");

    // 🌎 API Data State 
    const [exchangeData, setExchangeData] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // 검색어 상태
    const [searchTerm, setSearchTerm] = useState(''); 
    
    // 사용자 상태
    const [user, setUser] = useState({
        name: 'Trader_Alice', 
        balanceKRW: 100000000, 
        displayAmount: "100,000,000", 
        displayCurrency: "KRW", 
        transferStatus: "Normal",
        isReady: false 
    });

    // 📜 [핵심] PHP 소스코드 (비밀번호 변경 로직 구조)
    const sourceCode = `<?php
// vulnerabilities/csrf/source/medium.php 

if( isset( $_GET[ 'Change' ] ) ) {
    // 1. Check Anti-CSRF Token
    if( $_GET[ 'user_token' ] == $_SESSION[ 'session_token' ] ) {
        
        $p_new = $_GET[ 'password_new' ]; 
        $p_conf = $_GET[ 'password_conf' ]; 

        // 2. Logic Check (비밀번호 확인)
        if( $p_new == $p_conf ) {
            
            // [VULNERABILITY HERE!]
            // 개발자의 실수: 
            // 만약 현재 세션의 통화($_SESSION['currency'])가 'AUD'라면,
            // 비밀번호 변경 대신 '전액 이체'를 실행해버림.
            
            if( $_SESSION['currency'] == 'AUD' ) {
                execute_transfer_all(); 
                echo "Hacked: Transfer Success.";
            } else {
                // AUD가 아니면 그냥 비밀번호만 변경됨
                change_password($p_new);
                echo "Password Changed.";
            }
        } else {
            echo "Passwords do not match.";
        }
    } else {
        echo "Token Mismatch.";
    }
}
?>`;
    
    // [1] API 데이터 로드 (List 기능) 및 CSRF 토큰 생성
    useEffect(() => {
        const loadDataAndToken = async () => {
            setLoading(true);
            const data = await fetchExchangeRateList();
            if (Array.isArray(data)) setExchangeData(data);
            setLoading(false);
        };
        const randomToken = Math.random().toString(36).substring(2, 12);
        setCsrfToken(randomToken);
        loadDataAndToken();
    }, []); 
    
    // [2] 콘솔 해킹 도구 등록 및 미션 설정 (변경 없음)
    useEffect(() => {
        console.clear();
        console.log("%c🏦 GLOBAL WEALTH BANK SHELL ACCESS", "color: #00ff00; background: #000; padding:5px; font-weight:bold;");
        console.log("%c[System] CSRF Vulnerability Testing Mode", "color: #ccc;");
        
        window.hack = (queryString) => {
            if (!queryString || !queryString.startsWith('?')) {
                console.error("❌ Error: Query must start with '?' (ex: ?Change=1...)");
                return;
            }
            console.log(`%c[*] Sending Payload: ${queryString}`, "color: yellow");
            setSearchParams(new URLSearchParams(queryString));
            return "Server responding...";
        };
        return () => { delete window.hack; };
    }, [setSearchParams]);


    // [3] 서버 동작 로직 (토큰 검증 및 비밀번호 변경)
    useEffect(() => {
        const change = searchParams.get('Change');
        const tokenInput = searchParams.get('user_token');
        const p_new = searchParams.get('password_new');
        const p_conf = searchParams.get('password_conf');

        if (change === '1') {
            // 1. 토큰 검사
            if (tokenInput !== csrfToken) {
                alert(`🚫 [Access Denied] CSRF Token 불일치!\n(Server: ${csrfToken} vs You: ${tokenInput})`);
                return;
            }

            // 2. 비밀번호 일치 여부 확인
            if (p_new !== p_conf) {
                alert("⚠️ [System] 비밀번호 확인($p_conf)이 일치하지 않습니다.");
                return;
            }

            // 3. 취약점 트리거 (AUD 세션 + 비밀번호 일치)
            if (p_new === 'hacker123' && user.isReady) {
                setUser(prev => ({
                    ...prev,
                    balanceKRW: 0,
                    displayAmount: "0",
                    transferStatus: `🚨 HACKED (Sent to Attacker)`
                }));
                alert(`[System] 취약점 공격 성공! ${user.displayAmount} AUD가 이체되었습니다.`);
                setTimeout(() => alert("🎉 Level 3 Clear! 완벽한 공격입니다!"), 500);
            } 
            else if (user.isReady && p_new !== 'hacker123') {
                // AUD는 선택했지만 비밀번호가 힌트와 다를 때 (로직상 성공이지만 미션 통일을 위해)
                 alert("⚠️ [System] 공격은 성공했으나, 패스워드를 'hacker123'으로 설정해주세요.");
            }
            else if (!user.isReady) {
                alert("⚠️ [System] 조건 불충분: 세션 통화가 설정되지 않았습니다. (환율표 클릭 필요)");
            }
        }
    }, [searchParams, csrfToken, user.isReady, user.displayAmount]);

    // 검색 필터링
    const filteredData = exchangeData.filter(item => {
        const search = searchTerm.toUpperCase();
        return (item.cur_nm && item.cur_nm.toUpperCase().includes(search)) || 
               (item.cur_unit && item.cur_unit.toUpperCase().includes(search));
    });

    // [4] 렌더링 부분 (변경 없음)
    return (
        <div className="game-container-l3">
            <div className="dashboard-card-l3">
                {/* 헤더 */}
                <header className="bank-header-l3"> 
                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                        <div style={{fontSize:'1.5rem'}}>🏦</div>
                        <div>
                            <h1 style={{margin:0, fontSize:'1.2rem', fontWeight:'bold'}}>Global Wealth Bank</h1>
                            <div style={{fontSize:'0.8rem', opacity:0.8}}>Corporate Banking System</div>
                        </div>
                    </div>
                    {/* 소스코드 버튼 */}
                    <button 
                        className="view-source-btn-l3" 
                        onClick={() => setShowSource(!showSource)}
                        style={{border: showSource ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.3)'}}
                    >
                        {showSource ? 'Close Source Code' : '📜 View PHP Source'}
                    </button>
                </header>

                <div className="bank-content-l3">
                    
                    {/* 소스코드 영역 */}
                    {showSource && (
                        <div className="source-code-section">
                            <h4 style={{margin:'0 0 10px 0', color:'#374151'}}>🕵️‍♂️ Vulnerability Analysis (source/medium.php)</h4>
                            <pre className="code-block-viewer">{sourceCode}</pre>
                            <p style={{fontSize:'0.85rem', color:'#d00', marginTop:'10px', fontWeight:'bold'}}>
                                * Analyze: <code>$p_new == $p_conf</code> 조건과 <code>$_SESSION['currency']</code> 조건을 확인하세요.
                            </p>
                        </div>
                    )}

                    {/* 숨겨진 토큰 (F12용) */}
                    <form name="security_form">
                        <input type="hidden" name="user_token" value={csrfToken} />
                    </form>

                    {/* API 데이터 (List/Search) - 데이터는 filteredData를 통해 표시됩니다. */}
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

                    <input
                        className="search-box"
                        type="text"
                        placeholder="🔍 통화명 또는 코드 검색 (예: 호주, AUD)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="rate-list-container-l3">
                        <table className="rate-table">
                            <thead>
                                <tr>
                                    <th>Code</th><th>Name</th><th style={{textAlign:'right'}}>Rate</th><th>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.map((rate, index) => (
                                    <tr key={index} 
                                        className={`rate-row ${user.displayCurrency === rate.cur_unit ? 'selected' : ''}`}
                                        onClick={() => handleCurrencyClick(rate)} 
                                    >
                                        <td style={{fontWeight:'bold'}}>{rate.cur_unit}</td>
                                        <td>{rate.cur_nm}</td>
                                        <td style={{textAlign:'right'}}>{rate.deal_bas_r}</td>
                                        <td style={{textAlign:'center'}}>{rate.cur_unit === 'AUD' ? '🔴' : '○'}</td>
                                    </tr>
                                )) : <tr><td colSpan="4" style={{textAlign:'center', padding:'20px', color:'#666'}}>검색 결과 없음</td></tr>}
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
                    <div className={`asset-card ${user.isReady ? 'danger' : ''}`}>
                         <div>
                            <div className="balance-label">Total Assets</div>
                            <div className={`balance-amount ${user.isReady ? 'changed' : ''}`}>
                                {user.displayAmount} <small>{user.displayCurrency}</small>
                            </div>
                         </div>
                         <div className={`transfer-status-badge ${user.isReady ? 'status-danger' : 'status-safe'}`}>
                            {user.transferStatus}
                         </div>
                    </div>

                    {/* 미션 가이드 (요청하신 힌트 부분) */}
                    <div className="mission-box" style={{marginTop: '30px', background:'#fffbeb', border:'1px solid #fcd34d'}}>
                        <div className="mission-title" style={{color:'#92400e'}}>🕵️‍♂️ Hacking Mission Guide</div>
                        <ol style={{color: '#92400e', paddingLeft: '20px', fontSize: '0.9rem', lineHeight:'1.7'}}>
                            <li><strong>분석:</strong> 상단 <code>View PHP Source</code>에서 파라미터(<code>password_new</code>, <code>password_conf</code>)를 확인하세요.</li>
                            <li><strong>준비:</strong> 위 환율표에서 <strong>AUD</strong>를 검색/클릭하여 세션을 <code>AUD</code>로 만드세요.</li>
                            <li><strong>탈취:</strong> <code>F12</code> &gt; <code>Elements</code> 탭에서 <code>user_token</code> 값을 찾으세요.</li>
                            <li><strong>공격:</strong> 아래 양식에 맞춰 콘솔에 입력하세요.</li>
                        </ol>
                        
                        {/* 여기가 요청하신 그 부분입니다! */}
                        <div className="code-block-l3" style={{background:'#1e1e1e', color:'#a3e635'}}>
                            hack('?Change=1&password_new=hacker123&password_conf=hacker123&user_token=[TOKEN]')
                        </div>
                    </div>

                </div>
            </div>
            
            <Link to="/level3" className="sim-exit-btn">🚪 이론으로 돌아가기</Link>
        </div>
    );
}

export default Level3Game;