import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Level3.css'; // 같은 폴더의 CSS

export default function Level3Game() {
    const [userInfo, setUserInfo] = useState({ user: 'guest', role: 'user', balance: 1000 });
    const [message, setMessage] = useState("");
    const [flag, setFlag] = useState("");
    const [showHint, setShowHint] = useState(false);

    // 1. 초기 토큰 세팅
    useEffect(() => {
        const storedToken = localStorage.getItem('shadow_token');
        if (!storedToken) {
            const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
            const payload = btoa(JSON.stringify({ user: "guest", role: "user", balance: 1000 }));
            const signature = "c2VjcmV0X3NpZ25hdHVyZV9kb19ub3RfdG91Y2g=";
            localStorage.setItem('shadow_token', `${header}.${payload}.${signature}`);
        } else {
            try {
                const parts = storedToken.split('.');
                const payload = JSON.parse(atob(parts[1]));
                setUserInfo(payload);
            } catch (e) {}
        }
    }, []);

    // 2. 가짜 서버 검증 로직
    const handleEnterVIP = () => {
        setMessage("");
        const token = localStorage.getItem('shadow_token');
        if (!token) return;

        try {
            const parts = token.split('.');
            if (parts.length < 2) throw new Error("Invalid Token");

            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            // 🚨 취약점: alg가 'none'이면 서명 검증 Skip
            if (header.alg === 'none') {
                console.log("[Server] Algorithm 'none' detected. Skipping signature check.");
            } else {
                const validSignature = "c2VjcmV0X3NpZ25hdHVyZV9kb19ub3RfdG91Y2g=";
                if (parts[2] !== validSignature) {
                    setMessage("❌ Access Denied: 서명이 조작되었습니다.");
                    return;
                }
            }

            if (payload.role === 'admin' || payload.role === 'gold') {
                setUserInfo(payload);
                setFlag("FLAG{JWT_None_Algo_Bypass_Success}");
                setMessage("🎉 VIP Access Granted!");
            } else {
                setMessage("⛔ Access Denied: VIP(admin/gold) 권한이 필요합니다.");
            }
        } catch (e) {
            setMessage("❌ Error: 유효하지 않은 토큰입니다.");
        }
    };

    return (
        <div className="bank-body">
            <div className="bank-card">
                <div className="bank-logo">SHADOW BANK</div>
                <div className="bank-subtitle">Private Wealth Management</div>

                <div className="user-info-box">
                    <div className="info-row"><span>USER</span><span className="info-val">{userInfo.user}</span></div>
                    <div className="info-row"><span>BALANCE</span><span className="info-val">${userInfo.balance?.toLocaleString()}</span></div>
                    <div className="info-row" style={{marginBottom:0, alignItems:'center'}}>
                        <span>TIER</span>
                        <span className={`role-badge ${flag ? 'vip' : ''}`}>{userInfo.role?.toUpperCase()}</span>
                    </div>
                </div>

                <button className="vault-btn" onClick={handleEnterVIP}>
                    {flag ? "🔓 VIP VAULT OPENED" : "🔒 ENTER VIP LOUNGE"}
                </button>

                {message && <div style={{ marginTop: '20px', color: message.includes('Granted') ? '#34d399' : '#ef4444', fontWeight: 'bold' }}>{message}</div>}
                {flag && <div className="bank-secret">{flag}</div>}

                <div style={{ marginTop: '30px' }}>
                    <button className="hint-toggle" onClick={() => setShowHint(!showHint)}>{showHint ? "- Close Hint" : "+ Need a Hint?"}</button>
                    {showHint && (
                        <div className="hint-box">
                            <strong>[Hacker's Note]</strong><br/>
                            1. LocalStorage의 <code>shadow_token</code> 확인<br/>
                            2. Header: <code>{`{"alg":"none","typ":"JWT"}`}</code> 로 변경<br/>
                            3. Payload: <code>{`"role":"admin"`}</code> 으로 변경<br/>
                            4. Signature: 제거 (점<code>.</code>은 남길 것)
                        </div>
                    )}
                </div>
                <div style={{ marginTop: '20px' }}>
                    <Link to="/level3" className="exit-link">← Back to Theory</Link>
                </div>
            </div>
        </div>
    );
}