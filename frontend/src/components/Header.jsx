import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  const isLogin = !!token;
  const isAdmin = userRole === 'ADMIN';

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');

    alert('로그아웃되었습니다.');
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          StudyRoom
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          ☰
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>공간 목록</Link>

          {isLogin && (
            <Link to="/my-reservations" onClick={closeMenu}>
              내 예약
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin" onClick={closeMenu}>
              관리자
            </Link>
          )}

          {isLogin ? (
            <>
              <span className="user-name">{userName}님</span>
              <button type="button" className="nav-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>로그인</Link>
              <Link to="/signup" onClick={closeMenu}>회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;