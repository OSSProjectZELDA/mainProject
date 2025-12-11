import { Link } from 'react-router-dom';
import './Header.css';
import { useState } from 'react';
import UserDetailModal from '../../pages/startpage/UserDetailModal';

// 1. UserAvatar 컴포넌트를 Header 밖으로 뺐습니다. (성능 최적화)
const UserAvatar = ({ name, onClick }) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';
    
    return (
      <div className="user-avatar-container" onClick={onClick} title="프로필 설정">
        <div className="user-avatar">
          {initial}
        </div>
      </div>
    );
};

// 2. props를 { level, user } 형태로 한 번에 받도록 수정했습니다.
export default function Header({ level, user }) {

    const [isModalOpen, setIsModalOpen] = useState(false); 

    return(
        <div>
            <header className="hacking-header">
                <div className="header-content">
                    <Link to="/" > 
                        <h1 className="hacking-title" >Hacking Lab </h1>
                        {/* level이 있을 때만 표시하도록 안전 장치를 추가하면 더 좋습니다 */}
                        {level && <span className="level-title">| Level {level}</span>} 
                    </Link>

                    {isModalOpen && <UserDetailModal onClose={() => setIsModalOpen(false)} />}

                    <div className="top-nav">
                        {/* 3. props로 받은 user 객체가 존재하는지 확인합니다. */}
                        {user ? (
                            <UserAvatar 
                                name={user.name} 
                                onClick={() => setIsModalOpen(true)} 
                            />
                        ) : (
                            <>
                                <Link to="/login" className="nav-btn">
                                LOGIN
                                </Link>
                                <Link to="/signup" className="nav-btn signup">
                                SIGN UP
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </div>   
    )
}