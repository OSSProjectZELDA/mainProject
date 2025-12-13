import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ShieldCheck} from 'lucide-react';
// ✅ [중요] 아이콘 패키지 임포트 (에러 해결됨)
import './FinalPage.css';

const FinalPage = () => {

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
