import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import './Level3.css'; 
import { getRates, find } from './OpenApi'; 

function Level3Game() {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate(); 
    const [viewCode, setViewCode] = useState(false); 
    
    // 1. 데이터 상태
    const [list, setList] = useState([]);      
    const [search, setSearch] = useState('');  
    const [token, setToken] = useState('');    
    
    // 2. 내 지갑 상태
    const [wallet, setWallet] = useState({
        money: "100,000,000", 
        currency: "KRW",      
        status: "Normal",     
        isAud: false          
    });

    // 초기화
    useEffect(() => {
        getRates().then(data => setList(data));
        
        // 토큰 생성
        const newToken = Math.random().toString(36).substring(2, 10);
        setToken(newToken);
       
    }, []); 
    
    // 3. 환율 클릭 (0원이 아니라 환전된 금액 표시)
    const clickRate = (item) => {
        if (item.code !== 'AUD') {
            alert("⚠️ 타겟은 '호주 달러(AUD)'입니다. AUD를 찾아 클릭하세요.");
            return;
        }
        
        const rateVal = parseFloat(item.rate.replace(/,/g, ''));
        const exchanged = (100000000 / rateVal).toFixed(2);
        const displayVal = parseFloat(exchanged).toLocaleString();

        setWallet({
            money: displayVal,
            currency: "AUD", 
            status: "⚠️ Session: AUD (Ready)",
            isAud: true      
        });
        
        alert("⚠️ [System] 내부 세션이 'AUD'로 변경되었습니다.\n자산이 호주 달러로 표시됩니다.");
    };

    // 4. 해킹 툴
    useEffect(() => {
        window.hack = (query) => {
            console.log(`🚀 Payload Sent: ${query}`);
            setParams(new URLSearchParams(query)); 
        };
        return () => { delete window.hack; };
    }, [setParams]);

    // 5. 서버 로직 (해킹 성공 시 /final 이동)
    useEffect(() => {
        const cmd = params.get('Change'); 
        
        if (cmd === '1') {
            // 토큰 검사
            if (params.get('user_token') !== token) {
                return alert(`🚫 Token Mismatch! (Server: ${token})`);
            }
            // 비밀번호 검사
            if (params.get('password_new') !== 'hacker123') {
                return alert("⚠️ Password Incorrect. (Hint: hacker123)");
            }

            // ★ 취약점 트리거
            if (wallet.isAud) {
                setWallet(prev => ({
                    ...prev,
                    money: "0", 
                    status: "🚨 HACKED (Transfer Complete)"
                }));
                
                alert("🎉 해킹 성공! 자산이 탈취되었습니다!");
                
                // 성공 시 Final 페이지로 이동
                setTimeout(() => {
                    navigate('/final'); 
                }, 500);

            } else {
                alert("실패! 아직 'AUD' 상태가 아닙니다. (환율표에서 AUD를 클릭하세요)");
            }
        }
    }, [params, token, wallet.isAud, navigate]);

    const phpSource = `<?php
// vulnerabilities/csrf/source/medium.php

if( isset( $_GET['Change'] ) ) {
    // 1. CSRF Token Check
    if( $_GET['user_token'] == $_SESSION['token'] ) {
        
        // 2. Password Check
        if( $p_new == $p_conf ) {
            
            // 🚨 Logic Flaw: AUD 상태면 강제 이체
            if( $_SESSION['currency'] == 'AUD' ) {
                transfer_all_money(); // HACKED!
            } else {
                change_password();    // Normal
            }
        }
    }
}
?>`;

    const viewList = find(list, search);

    return (
        <div className="game-container-l3">
            <div className="dashboard-card-l3">
                
                <header className="bank-header-l3"> 
                    <div className="logo-area">
                        <span style={{fontSize:'1.5rem'}}>🏦</span>
                        <div>
                            <h1>Global Wealth Bank</h1>
                            <span className="sub-text">Corporate Banking</span>
                        </div>
                    </div>
                    <button className="view-source-btn-l3" onClick={() => setViewCode(!viewCode)}>
                        {viewCode ? 'Close Code' : '📜 View PHP Source'}
                    </button>
                </header>

                <div className="bank-content-l3">
                    
                    {viewCode && (
                        <div className="source-code-section">
                            <h4 style={{color:'#d4d4d4', margin:'0 0 10px 0'}}>Backend Logic Analysis</h4>
                            <pre className="code-block-viewer">{phpSource}</pre>
                        </div>
                    )}

                    {/* ★★★ [수정됨] 토큰 찾는 곳! ★★★ 
                        F12 -> Elements 탭에서 Ctrl+F 누르고 "user_token" 검색하면 바로 나옵니다.
                    */}
                    <div id="security-token-area" style={{margin: '10px 0', border: '1px dashed #ccc', padding: '5px', display:'none'}}>
                        <label>Security Token (Hidden):</label>
                        <input 
                            id="user_token" 
                            type="hidden" 
                            name="user_token" 
                            value={token} 
                        />
                    </div>

                    {/* 1. 환율 리스트 */}
                    <div className="section-header">1. Select Currency (Set Session)</div>
                    <input
                        className="search-box"
                        placeholder="🔍 통화 검색 (예: AUD, 호주)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="rate-list-container-l3">
                        <table className="rate-table">
                            <thead>
                                <tr><th>Code</th><th>Name</th><th style={{textAlign:'right'}}>Rate</th><th>Select</th></tr>
                            </thead>
                            <tbody>
                                {viewList.map((item, i) => (
                                    <tr key={i} onClick={() => clickRate(item)} className="rate-row">
                                        <td style={{fontWeight:'bold'}}>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td style={{textAlign:'right'}}>{item.rate}</td>
                                        <td style={{textAlign:'center'}}>{item.code === 'AUD' ? '🔴' : '○'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 2. 내 지갑 */}
                    <div className="section-header" style={{marginTop:'30px'}}>2. Wallet Status</div>
                    <div className={`asset-card ${wallet.isAud ? 'danger' : ''}`}>
                         <div>
                            <div className="balance-label">Total Assets</div>
                            <div className="balance-amount">
                                {wallet.money} <small>{wallet.currency}</small>
                            </div>
                         </div>
                         <div className={`transfer-status-badge ${wallet.isAud ? 'status-danger' : 'status-safe'}`}>
                            {wallet.status}
                         </div>
                    </div>

                    {/* 3. 가이드 */}
                    <div className="mission-box">
                        <div className="mission-title">🕵️‍♂️ Hacking Mission Guide</div>
                        <ol style={{paddingLeft:'20px', lineHeight:'1.6', fontSize:'0.9rem', color:'#92400e'}}>
                            <li><strong>분석:</strong> 상단 <code>View PHP Source</code>를 눌러 취약점을 확인하세요.</li>
                            <li><strong>준비:</strong> 리스트에서 <strong>AUD</strong>를 찾아 클릭하세요. (세션 변경)</li>
                            <li><strong>탈취:</strong> <code>F12</code>를 누르고 <code>Elements</code> 탭에서 <code>Ctrl+F</code>로 <strong>user_token</strong>을 검색하세요.</li>
                            <li><strong>공격:</strong> 아래 명령어를 완성하여 <code>Console</code> 탭에 입력하세요.</li>
                        </ol>
                        
                        <div className="code-block-l3">
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