import React from 'react';
import { Link } from 'react-router-dom';
import './Level1.css';

function Level1AdminPage() {
    return (
        <div className="level1-wrapper">
            {/* 창 크기 고정 (1000px) */}
            <div className="mock-browser wide-mode">
                <header className="mock-header admin-header">
                    <div className="mock-logo">
                        ZELDA <span className="admin-badge">ADMIN MODE</span>
                    </div>
                    <div className="admin-profile">
                        <span className="admin-welcome">Welcome, <strong>Super Admin</strong></span>
                        <Link to="/level1" className="logout-btn">LOGOUT</Link>
                    </div>
                </header>

                {/* 사이드바 */}
                <div className="mock-body horizontal-layout">
                    <aside className="mock-sidebar">
                        <div className="mock-widget">
                            <div className="widget-title">CONTROL PANEL</div>
                            <ul className="widget-list">
                                <li><a style={{color: "red", fontWeight:'bold'}}>User Management</a></li>
                                <li><a>System Logs</a></li>
                                <li><a>Backup & Restore</a></li>
                                <li><a>Security Settings</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* 본문 */}
                    <main className="mock-content wide-content">
                        
                        <div className="status-alert">
                            <strong>Access Granted:</strong> SQL Injection vulnerability confirmed.
                        </div>

                        <div className="table-container">
                            <h3 className="content-subtitle">User Database</h3>
                            <table className="hacker-table">
                                <thead>
                                    <tr>
                                        <th style={{width: '60px'}}>ID</th>
                                        <th>USERNAME</th>
                                        <th>PASSWORD_HASH</th>
                                        <th>ROLE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hacked-row">
                                        <td>1</td>
                                        <td><strong>admin</strong></td>
                                        <td style={{fontFamily:'monospace'}}>$2y$10$A9x... (crackable)</td>
                                        <td><span className="role-badge admin">Super Admin</span></td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>test</td>
                                        <td style={{fontFamily:'monospace'}}>7c4a89c72f...</td>
                                        <td><span className="role-badge user">User</span></td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>guest</td>
                                        <td style={{fontFamily:'monospace'}}>084e03a860...</td>
                                        <td><span className="role-badge user">Guest</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mission-complete-box">
                            <div className="mission-header">MISSION ACCOMPLISHED</div>
                            <p>관리자 계정 탈취에 성공하였습니다.</p>
                            <div className="flag-display">
                                FLAG{'{'}WayMaker{'}'}
                            </div>
                            <p className="copy-hint">* Flag의 내용을 2단계 비밀번호에 입력해 접근하세요.</p>
                        </div>

                    </main>
                </div>
            </div>

            <Link to="/" className="sim-exit-btn">미션 완료 (홈으로 이동)</Link>
        </div>
    );
}

export default Level1AdminPage;