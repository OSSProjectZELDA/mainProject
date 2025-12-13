// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Level1.css';

// function Level1AdminPage() {
//     return (
//         <div className="acu-body">
//             {/* ⭐️ 핵심: Game 페이지와 똑같은 980px 래퍼 사용 */}
//             <div className="acu-wrapper">
                
//                 {/* 1. 관리자 전용 헤더 (빨간색) */}
//                 <header className="acu-admin-header">
//                     <div className="acu-admin-title">ADMINISTRATION CONSOLE</div>
//                     <div style={{ fontSize: '12px' }}>
//                         Welcome, <strong>Super Admin</strong>
//                         <Link to="/level1Game" style={{ marginLeft: '15px' }}>
//                             <button className="acu-logout-btn">Logout</button>
//                         </Link>
//                     </div>
//                 </header>

//                 {/* 2. 메인 컨테이너 (사이드바 + 본문) */}
//                 <div className="acu-container">
                    
//                     {/* 관리자 사이드바 */}
//                     <aside className="acu-sidebar">
//                         <div className="acu-sidebar-box">
//                             <div className="acu-sidebar-header">Admin Menu</div>
//                             <ul className="acu-link-list">
//                                 <li><a href="#" className="acu-link-active">User Management</a></li>
//                                 <li><a href="#">System Logs</a></li>
//                                 <li><a href="#">Database Backup</a></li>
//                                 <li><a href="#">Security Settings</a></li>
//                             </ul>
//                         </div>
//                     </aside>

//                     {/* 본문: 털린 정보 보여주기 */}
//                     <main className="acu-main">
//                         <h3>User Database (Confidential Information)</h3>
                        
//                         <p style={{ color: 'green', fontSize: '12px', fontWeight: 'bold', margin: '10px 0' }}>
//                             ✔ Access Granted via Bypass Authentication.
//                         </p>

//                         {/* 유저 테이블 */}
//                         <table className="acu-table">
//                             <thead>
//                                 <tr>
//                                     <th style={{width: '50px'}}>ID</th>
//                                     <th>Username</th>
//                                     <th>Password (Hash)</th>
//                                     <th>Role</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {/* 해킹된 관리자 계정 강조 */}
//                                 <tr style={{ backgroundColor: '#ffdede' }}>
//                                     <td>1</td>
//                                     <td><strong>admin</strong></td>
//                                     <td style={{ fontFamily:'monospace' }}>$2y$10$A9x... (crackable)</td>
//                                     <td><strong>Super Admin</strong></td>
//                                 </tr>
//                                 <tr>
//                                     <td>2</td>
//                                     <td>test</td>
//                                     <td style={{ fontFamily:'monospace' }}>7c4a8d...</td>
//                                     <td>User</td>
//                                 </tr>
//                                 <tr>
//                                     <td>3</td>
//                                     <td>guest</td>
//                                     <td style={{ fontFamily:'monospace' }}>084e03...</td>
//                                     <td>Guest</td>
//                                 </tr>
//                             </tbody>
//                         </table>

//                         {/* FLAG 결과 박스 */}
//                         <div className="acu-secret-panel">
//                             <h4 style={{ margin: '0 0 10px 0', color: '#d00' }}>⚠ MISSION ACCOMPLISHED ⚠</h4>
//                             <p style={{ fontSize: '12px', color: '#555' }}>
//                                 SQL Injection 취약점을 이용하여 인증을 우회했습니다.
//                             </p>
                            
//                             <div className="acu-flag">
//                                 FLAG{'{'}WayMaker{'}'}
//                             </div>
                            
//                             <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
//                                 * Please copy this flag to proceed.
//                             </p>
//                         </div>
//                     </main>
//                 </div>
//             </div>

//             {/* 메인으로 나가기 */}
//             <Link to="/" className="sim-exit-btn">🏆 미션 완료 (홈으로)</Link>
//         </div>
//     );
// }

// export default Level1AdminPage;

import React from 'react';
import { Link } from 'react-router-dom';
import './Level1.css';

function Level1AdminPage() {
    return (
        <div className="level1-wrapper">
            {/* ★ wide-mode 추가: 창 크기 고정 (1000px) */}
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

                {/* ★ horizontal-layout 추가: 가로 배치 (사이드바 - 본문) */}
                <div className="mock-body horizontal-layout">
                    <aside className="mock-sidebar">
                        <div className="mock-widget">
                            <div className="widget-title">CONTROL PANEL</div>
                            <ul className="widget-list">
                                <li><a style={{color:'#ef4444', fontWeight:'bold'}}>👥 User Management</a></li>
                                <li><a>📜 System Logs</a></li>
                                <li><a>💾 Backup & Restore</a></li>
                                <li><a>🔒 Security Settings</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* ★ wide-content 추가: 본문 영역 스타일 적용 */}
                    <main className="mock-content wide-content">
                        
                        <div className="status-alert">
                            <span className="status-icon">✔</span> 
                            <strong>Access Granted:</strong> SQL Injection vulnerability confirmed.
                        </div>

                        <div className="table-container">
                            <h3 className="content-subtitle">User Database Dump</h3>
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
                                        <td style={{fontFamily:'monospace'}}>7c4a8d09ca3762af...</td>
                                        <td><span className="role-badge user">User</span></td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>guest</td>
                                        <td style={{fontFamily:'monospace'}}>084e0343a0486ff0...</td>
                                        <td><span className="role-badge user">Guest</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mission-complete-box">
                            <div className="mission-header">🏆 MISSION ACCOMPLISHED</div>
                            <p>관리자 계정 탈취에 성공하였습니다.</p>
                            <div className="flag-display">
                                FLAG{'{'}WayMaker{'}'}
                            </div>
                            <p className="copy-hint">* 위 코드를 복사하여 제출하세요.</p>
                        </div>

                    </main>
                </div>
            </div>

            <Link to="/" className="sim-exit-btn">🏆 미션 완료 (홈으로 이동)</Link>
        </div>
    );
}

export default Level1AdminPage;