import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck, MessageSquare, Send, Save, X, Edit2, Trash2 } from 'lucide-react';
// ✅ [중요] 아이콘 패키지 임포트 (에러 해결됨)
import './FinalPage.css';

// ⚠️ 본인의 MockAPI 주소로 변경 (제공해주신 주소 적용함)
const API_URL = "https://693868724618a71d77d02e81.mockapi.io/reviews"; 

const FinalPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  // READ
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      // 최신순 정렬
      const sortedData = data.sort((a, b) => Number(b.id) - Number(a.id));
      setReviews(sortedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName || !newMessage) return alert("이름과 내용을 모두 입력해주세요.");

    // 랜덤 아바타 생성 (파란색 계열의 깔끔한 아바타)
    const randomAvatarId = Math.floor(Math.random() * 70) + 1;
    const avatarUrl = `https://i.pravatar.cc/150?img=${randomAvatarId}`;

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          message: newMessage,
          createdAt: new Date().toISOString(),
          avatar: avatarUrl
        })
      });
      setNewName('');
      setNewMessage('');
      fetchReviews();
    } catch (error) {
      alert("등록 실패!");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchReviews();
    } catch (error) {
      alert("삭제 실패!");
    }
  };

  // UPDATE
  const startEdit = (review) => {
    setEditingId(review.id);
    setEditMessage(review.message);
  };

  const saveEdit = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: editMessage })
      });
      setEditingId(null);
      fetchReviews();
    } catch (error) {
      alert("수정 실패!");
    }
  };

  return (
    <div className="final-container">
      
      {/* 1. 축하 헤더 (밝은 블루 그라데이션) */}
      <header className="celebration-card">
        <div className="icon-wrapper">
          <Trophy size={48} className="trophy-icon" />
        </div>
        <h1>MISSION COMPLETE!</h1>
        <p className="main-desc">모든 보안 레벨을 성공적으로 통과하셨습니다.</p>
        <div className="badge-container">
          <span className="clear-badge">
            <ShieldCheck size={14} style={{marginRight:'4px'}}/> White Hacker Certified
          </span>
        </div>
        
        <Link to="/" className="home-btn">메인으로 돌아가기</Link>
      </header>


    </div>
  );
};

export default FinalPage;
