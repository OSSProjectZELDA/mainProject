// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Trophy, ShieldCheck, MessageSquare, Send, Save, X, Edit2, Trash2 } from 'lucide-react';
// // ✅ [중요] 아이콘 패키지 임포트 (에러 해결됨)
// import './FinalPage.css';

// // ⚠️ 본인의 MockAPI 주소로 변경 (제공해주신 주소 적용함)
// const API_URL = "https://693868724618a71d77d02e81.mockapi.io/reviews"; 

// const FinalPage = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   const [newName, setNewName] = useState('');
//   const [newMessage, setNewMessage] = useState('');

//   const [editingId, setEditingId] = useState(null);
//   const [editMessage, setEditMessage] = useState('');

//   // READ
//   const fetchReviews = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(API_URL);
//       const data = await res.json();
//       // 최신순 정렬
//       const sortedData = data.sort((a, b) => Number(b.id) - Number(a.id));
//       setReviews(sortedData);
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, []);

//   // CREATE
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!newName || !newMessage) return alert("이름과 내용을 모두 입력해주세요.");

//     // 랜덤 아바타 생성 (파란색 계열의 깔끔한 아바타)
//     const randomAvatarId = Math.floor(Math.random() * 70) + 1;
//     const avatarUrl = `https://i.pravatar.cc/150?img=${randomAvatarId}`;

//     try {
//       await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: newName,
//           message: newMessage,
//           createdAt: new Date().toISOString(),
//           avatar: avatarUrl
//         })
//       });
//       setNewName('');
//       setNewMessage('');
//       fetchReviews();
//     } catch (error) {
//       alert("등록 실패!");
//     }
//   };

//   // DELETE
//   const handleDelete = async (id) => {
//     if (!window.confirm("정말 삭제하시겠습니까?")) return;
//     try {
//       await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
//       fetchReviews();
//     } catch (error) {
//       alert("삭제 실패!");
//     }
//   };

//   // UPDATE
//   const startEdit = (review) => {
//     setEditingId(review.id);
//     setEditMessage(review.message);
//   };

//   const saveEdit = async (id) => {
//     try {
//       await fetch(`${API_URL}/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: editMessage })
//       });
//       setEditingId(null);
//       fetchReviews();
//     } catch (error) {
//       alert("수정 실패!");
//     }
//   };

//   return (
//     <div className="final-container">
      
//       {/* 1. 축하 헤더 (밝은 블루 그라데이션) */}
//       <header className="celebration-card">
//         <div className="icon-wrapper">
//           <Trophy size={48} className="trophy-icon" />
//         </div>
//         <h1>MISSION COMPLETE!</h1>
//         <p className="main-desc">모든 보안 레벨을 성공적으로 통과하셨습니다.</p>
//         <div className="badge-container">
//           <span className="clear-badge">
//             <ShieldCheck size={14} style={{marginRight:'4px'}}/> White Hacker Certified
//           </span>
//         </div>
        
//         <Link to="/" className="home-btn">메인으로 돌아가기</Link>
//       </header>

//       {/* 2. 방명록 섹션 (화이트 카드 스타일) */}
//       <section className="guestbook-section">
//         <div className="guestbook-header">
//           <div className="header-left">
//             <h2><MessageSquare className="w-6 h-6 inline mr-2 text-blue-600"/> Hall of Fame</h2>
//             <span className="sub-title">명예의 전당 (Guestbook)</span>
//           </div>
//           <div className="total-count">
//             Total Heroes: <strong>{reviews.length}</strong>
//           </div>
//         </div>

//         {/* 입력 폼 */}
//         <form className="write-form" onSubmit={handleSubmit}>
//           <div className="form-inner">
//             <input 
//               type="text" 
//               placeholder="Your Name" 
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               maxLength={10}
//               className="input-name"
//             />
//             <input 
//               type="text" 
//               placeholder="Leave a clear message..." 
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               className="input-msg"
//             />
//             <button type="submit" className="submit-btn">
//               <Send size={16} /> 등록
//             </button>
//           </div>
//         </form>

//         {/* 리뷰 리스트 */}
//         <div className="review-list">
//           {loading ? (
//             <div className="loading-state">데이터를 불러오는 중입니다...</div>
//           ) : (
//             reviews.map((review) => (
//               <div key={review.id} className="review-card">
                
//                 {/* 아바타 */}
//                 <div className="review-left">
//                    {review.avatar ? (
//                      <img src={review.avatar} alt="avatar" className="user-avatar-img" />
//                    ) : (
//                      <div className="default-avatar">👤</div>
//                    )}
//                 </div>

//                 {/* 내용 */}
//                 <div className="review-right">
//                     <div className="review-info">
//                       <span className="hacker-name">{review.name}</span>
//                       <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
//                     </div>

//                     {editingId === review.id ? (
//                       <div className="edit-mode">
//                         <input 
//                           type="text" 
//                           value={editMessage} 
//                           onChange={(e) => setEditMessage(e.target.value)}
//                           autoFocus
//                           className="edit-input"
//                         />
//                         <div className="edit-actions">
//                           <button onClick={() => saveEdit(review.id)} className="btn-save"><Save size={16}/></button>
//                           <button onClick={() => setEditingId(null)} className="btn-cancel"><X size={16}/></button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="review-content">
//                         <p>{review.message}</p>
//                         <div className="card-actions">
//                           <button onClick={() => startEdit(review)} className="btn-icon edit"><Edit2 size={14}/></button>
//                           <button onClick={() => handleDelete(review.id)} className="btn-icon delete"><Trash2 size={14}/></button>
//                         </div>
//                       </div>
//                     )}
//                 </div>
//               </div>
//             ))
//           )}
//           {reviews.length === 0 && !loading && (
//             <div className="empty-state">아직 등록된 영웅이 없습니다. 첫 번째 주인공이 되어보세요!</div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default FinalPage;
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header/Header.jsx'; 
import { useAuth } from '../../context/AuthContext';
import { Trophy, ShieldCheck } from 'lucide-react';
import './FinalPage.css'; 

const FinalPage = () => {
  const { user } = useAuth();

  return (
    <>
      <Header user={user} />
      
      <div className="final-container">
        
        {/* 축하 카드 */}
        <div className="celebration-card">
          <div className="icon-wrapper">
            <Trophy size={40} className="trophy-icon" />
          </div>
          
          <h1>MISSION COMPLETE!</h1>
          
          <p className="main-desc">
            모든 보안 레벨을 성공적으로 통과하셨습니다.<br/>
            당신은 이제 진정한 <strong>White Hacker</strong>입니다.
          </p>

          <div className="badge-container">
            <span className="clear-badge">
              <ShieldCheck size={16} style={{marginRight:'6px'}}/> Certified Defender
            </span>
          </div>
          
          {/* 홈으로 가는 버튼 */}
          <Link to="/" className="home-btn">
            메인으로 돌아가기
          </Link>
        </div>

      </div>
    </>
  );
};

export default FinalPage;