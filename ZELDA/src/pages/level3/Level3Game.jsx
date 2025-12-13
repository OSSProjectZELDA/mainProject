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

    useEffect(() => {
        getRates().then(data => setList(data));
        const newToken = Math.random().toString(36).substring(2, 10);
        setToken(newToken);
    }, []); 
    
    const clickRate = (item) => {
        if (item.code !== 'AUD') {
            alert("타겟은 '호주 달러(AUD)'입니다. AUD를 찾아 클릭하세요.");
            return;
        }
        
        const rateVal = parseFloat(item.rate.replace(/,/g, ''));
        const exchanged = (100000000 / rateVal).toFixed(2);
        const displayVal = parseFloat(exchanged).toLocaleString();

        setWallet({
            money: displayVal,
            currency: "AUD", 
            status: "Session: AUD (Ready)",
            isAud: true      
        });
        
        alert("[System] 내부 세션이 'AUD'로 변경되었습니다.\n자산이 호주 달러로 표시됩니다.");
    };

    useEffect(() => {
        window.hack = (query) => {
            console.log(`Payload Sent: ${query}`);
            setParams(new URLSearchParams(query)); 
        };
        return () => { delete window.hack; };
    }, [setParams]);

    useEffect(() => {
        const cmd = params.get('Change'); 
        if (cmd === '1') {
            if (params.get('user_token') !== token) {
                return alert(`Token Mismatch! (Server: ${token})`);
            }
            if (params.get('password_new') !== 'hacker123') {
                return alert("Password Incorrect. (Hint: hacker123)");
            }
            if (wallet.isAud) {
                setWallet(prev => ({
                    ...prev,
                    money: "0", 
                    status: "HACKED (Transfer Complete)"
                }));
                alert("해킹 성공! 자산이 탈취되었습니다!");
                setTimeout(() => {
                    navigate('/final'); 
                }, 500);
            } else {
                alert("실패! 아직 'AUD' 상태가 아닙니다. (환율표에서 AUD를 클릭하세요)");
            }
        }
    }, [params, token, wallet.isAud, navigate]);

    const phpSource = `<?php
// vulnerabilities/logic/source/medium.php

if( isset( $_GET['Change'] ) ) {
    // 1. CSRF Token Check
    if( $_GET['user_token'] == $_SESSION['token'] ) {
        
        // 2. Password Check
        if( $p_new == $p_conf ) {
            
            // Logic Flaw: 세션이 AUD(호주달러)면 송금 실행
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
        <div className="game-wrapper">
            <div className="mock-browser">
                
                {/* 헤더 */}
                <header className="mock-header bank-mode">
                    <div className="mock-logo">
                        Global Wealth Bank <span className="mock-tag tag-blue">Corporate</span>
                    </div>
                    <button className="code-toggle-btn" onClick={() => setViewCode(!viewCode)}>
                        {viewCode ? 'Hide Source' : 'View Source'}
                    </button>
                </header>

                <div className="mock-body">
                    {/* ★ 세로 레이아웃 컨테이너 (Flex-Column) ★ */}
                    <main className="mock-content vertical-layout">
                        
                        {/* 1. 소스코드 (버튼 누르면 최상단에 표시) */}
                        {viewCode && (
                            <div className="code-viewer-panel">
                                <div className="panel-label">Backend Logic (PHP)</div>
                                <pre className="code-content">{phpSource}</pre>
                            </div>
                        )}

                        {/* 숨겨진 토큰 영역 */}
                        <div id="security-token-area" style={{display:'none'}}>
                            <input id="user_token" type="hidden" name="user_token" value={token} />
                        </div>

                        {/* 2. 환율 선택 테이블 */}
                        <div className="bank-section">
                            <div className="panel-header">
                                <h3>1. Select Currency (Set Session)</h3>
                                <span className="panel-desc">호주 달러(AUD)를 선택하여 서버 세션을 변경하세요.</span>
                            </div>
                            
                            <input
                                className="bank-input"
                                placeholder="Search Currency (e.g. AUD)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <div className="table-scroll-area">
                                <table className="bank-table">
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Name</th>
                                            <th className="text-right">Rate</th>
                                            <th className="text-center">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewList.map((item, i) => (
                                            <tr key={i} onClick={() => clickRate(item)} className={item.code === 'AUD' ? 'target-row' : ''}>
                                                <td className="font-bold">{item.code}</td>
                                                <td>{item.name}</td>
                                                <td className="text-right">{item.rate}</td>
                                                <td className="text-center">
                                                    {item.code === 'AUD' ? 
                                                        <span className="select-dot target">●</span> : 
                                                        <span className="select-dot">○</span>
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. 지갑 상태 카드 */}
                        <div className="bank-section">
                            <div className="panel-header">
                                <h3>2. Wallet Status</h3>
                            </div>
                            <div className={`wallet-card ${wallet.isAud ? 'danger-mode' : ''}`}>
                                <div className="wallet-row">
                                    <div className="wallet-label">TOTAL ASSETS</div>
                                    <div className="wallet-balance">
                                        <span className="currency">{wallet.currency}</span>
                                        <span className="amount">{wallet.money}</span>
                                    </div>
                                </div>
                                <div className={`status-pill ${wallet.isAud ? 'hacked' : 'normal'}`}>
                                    Status: {wallet.status}
                                </div>
                            </div>
                        </div>

                        {/* 4. 미션 가이드 */}
                        <div className="bank-section">
                            <div className="mission-console">
                                <div className="console-header">Hacking Flow</div>
                                <div className="console-body">
                                    <p>1. 위 view source 버튼을 클릭 후, 소스코드를 분석하세요.</p>
                                    <p>2. 위 리스트에서 <strong>AUD</strong>를 찾아 클릭하세요.</p>
                                    <p>3. F12 개발자 도구에서 <code>user_token</code> 값을 찾으세요.</p>
                                    <p>4. 아래 코드를 Console 탭에 입력하세요.</p>
                                    <div className="payload-box">
                                        hack('?Change=1&password_new=hacker123&password_conf=hacker123&user_token=<span style={{color:'yellow'}}>[TOKEN]</span>')
                                    </div>
                                </div>
                            </div>
                        </div>

                    </main>
                </div>
            </div>
            
            <Link to="/level3" className="sim-exit-btn">이론으로 돌아가기</Link>
        </div>
    );
}

export default Level3Game;
