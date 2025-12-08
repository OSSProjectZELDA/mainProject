// src/components/startpage/UserDetailModal.jsx
import React, { useState, useEffect } from 'react'; // useEffect 추가
import { updateUserAPI, deleteUserAPI } from './MockApi'; 
import { useAuth } from '../../context/AuthContext';

const UserDetailModal = ({ onClose }) => {
  const { user, logout, updateProfile } = useAuth();
  
  // ⚡️ [핵심 수정] 로그아웃해서 user가 null이 되면, 
  // 더 이상 이 컴포넌트를 렌더링하지 않고 즉시 종료합니다. (에러 방지)
  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 수정 핸들러
  const handleUpdate = async () => {
    if (!window.confirm("정보를 수정하시겠습니까?")) return;
    setIsLoading(true);
    try {
      const updateData = { name, password };
      if (!password) delete updateData.password; 

      const updatedUser = await updateUserAPI(user.id, updateData);
      
      updateProfile(updatedUser); 
      alert("정보가 수정되었습니다.");
      onClose();
    } catch (error) {
      alert("수정 실패: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 탈퇴 핸들러
  const handleDelete = async () => {
    const input = prompt("탈퇴하려면 'DELETE'라고 입력하세요.");
    if (input !== 'DELETE') return;

    setIsLoading(true);
    try {
      await deleteUserAPI(user.id);
      alert("계정이 삭제되었습니다.");
      
      onClose(); 
      logout(); 
    } catch (error) {
      alert("탈퇴 실패: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 핸들러 (안전하게 처리)
  const handleLogout = () => {
    onClose(); 
    logout(); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content hacker-card">
        <div className="card-header">
          <span className="status-dot green"></span>
          <span className="code-name">USER_PROFILE_CONFIG</span>
          <button onClick={onClose} className="close-btn">X</button>
        </div>

        <h2 className="level-title">AGENT PROFILE</h2>
        <div className="separator"></div>

        <div className="form-section">
          <label>CODENAME (이름)</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="hacker-input"
          />
          
          <label>ACCESS KEY (새 비밀번호)</label>
          <input 
            type="password" 
            placeholder="변경시에만 입력"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="hacker-input"
          />
        </div>

        <div className="modal-actions">
          <button onClick={handleUpdate} disabled={isLoading} className="nav-btn signup">
            UPDATE INFO
          </button>
          <button onClick={handleLogout} className="nav-btn">
            LOGOUT
          </button>

          <button onClick={handleDelete} disabled={isLoading} className="nav-btn logout">
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;