import React, { createContext, useState, useContext } from 'react';
import { updateUserAPI } from '../components/startpage/MockApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. 초기값: 로컬 스토리지에서 가져오기 (새로고침 시 유지)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("로컬 스토리지 파싱 에러", e);
      return null;
    }
  });

  // 로그인
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 🔹 [프로필 업데이트] 화면 상태 + 로컬 스토리지 동기화
  const updateProfile = (updatedData) => {
    setUser((prev) => {
      if (!prev) return null; // 유저가 없으면 중단
      const newUser = { ...prev, ...updatedData };
      
      // 여기서 로컬 스토리지도 같이 업데이트해야 새로고침해도 레벨이 유지됨
      localStorage.setItem('user', JSON.stringify(newUser)); 
      return newUser;
    });
  };

  // 🔹 [레벨 업데이트 로직] : 요청하신 핵심 로직
  const updateLevel = async (newLevel) => {
    if (!user) return; // 로그인 안 했으면 무시

    // user.level이 undefined일 경우를 대비해 0으로 처리
    const currentLevel = user.level || 0;

    // 1. 기존 레벨보다 낮거나 같으면 업데이트 안 함 (서버 요청 방지)
    if (currentLevel >= newLevel) {
      console.log(`Update skipped. Current: ${currentLevel}, New: ${newLevel}`);
      return; 
    }

    try {
      // 2. 서버(Mock API)에 업데이트 요청 (DB 저장용)
      // user.id를 사용하므로 '유저마다' 개별적으로 저장됩니다.
      await updateUserAPI(user.id, { level: newLevel });
      
      // 3. 서버 저장이 성공하면 -> 화면과 로컬 스토리지 업데이트
      updateProfile({ level: newLevel });
      console.log(`Level updated successfully to ${newLevel}`);
      
    } catch (error) {
      console.error("Failed to update level:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, updateLevel }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);