import React from 'react';
import { Link } from 'react-router-dom';
import './Level1.css';

function Level1AdminPage() {
    return (
        <div className="acu-body">
            {/* ⭐️ 핵심: Game 페이지와 똑같은 980px 래퍼 사용 */}
            <div className="acu-wrapper">
                
                {/* 1. 관리자 전용 헤더 (빨간색) */}
                <header className="acu-admin-header">
                    <div className="acu-admin-title">ADMINISTRATION CONSOLE</div>
                    <div style={{ fontSize: '12px' }}>
                        Welcome, <strong>Super Admin</strong>
                        <Link to="/level1Game" style={{ marginLeft: '15px' }}>
                            <button className="acu-logout-btn">Logout</button>
                        </Link>
                    </div>
                </header>

                {/* 2. 메인 컨테이너 (사이드바 + 본문) */}
                <div className="acu-container">
                    
                    {/* 관리자 사이드바 */}
                    <aside className="acu-sidebar">
                        <div className="acu-sidebar-box">
                            <div className="acu-sidebar-header">Admin Menu</div>
                            <ul className="acu-link-list">
                                <li><a href="#" className="acu-link-active">User Management</a></li>
                                <li><a href="#">System Logs</a></li>
                                <li><a href="#">Database Backup</a></li>
                                <li><a href="#">Security Settings</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* 본문: 털린 정보 보여주기 */}
                    <main className="acu-main">
                        <h3>User Database (Confidential Information)</h3>
                        
                        <p style={{ color: 'green', fontSize: '12px', fontWeight: 'bold', margin: '10px 0' }}>
                            ✔ Access Granted via Bypass Authentication.
                        </p>

                        {/* 유저 테이블 */}
                        <table className="acu-table">
                            <thead>
                                <tr>
                                    <th style={{width: '50px'}}>ID</th>
                                    <th>Username</th>
                                    <th>Password (Hash)</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 해킹된 관리자 계정 강조 */}
                                <tr style={{ backgroundColor: '#ffdede' }}>
                                    <td>1</td>
                                    <td><strong>admin</strong></td>
                                    <td style={{ fontFamily:'monospace' }}>$2y$10$A9x... (crackable)</td>
                                    <td><strong>Super Admin</strong></td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>test</td>
                                    <td style={{ fontFamily:'monospace' }}>7c4a8d...</td>
                                    <td>User</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>guest</td>
                                    <td style={{ fontFamily:'monospace' }}>084e03...</td>
                                    <td>Guest</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* FLAG 결과 박스 */}
                        <div className="acu-secret-panel">
                            <h4 style={{ margin: '0 0 10px 0', color: '#d00' }}>⚠ MISSION ACCOMPLISHED ⚠</h4>
                            <p style={{ fontSize: '12px', color: '#555' }}>
                                SQL Injection 취약점을 이용하여 인증을 우회했습니다.
                            </p>
                            
                            <div className="acu-flag">
                                FLAG{'{'}Blind_SQLi_Success_2025{'}'}
                            </div>
                            
                            <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
                                * Please copy this flag to proceed.
                            </p>
                        </div>
                    </main>
                </div>
            </div>

            {/* 메인으로 나가기 */}
            <Link to="/" className="sim-exit-btn">🏆 미션 완료 (홈으로)</Link>
        </div>
    );
}

export default Level1AdminPage;