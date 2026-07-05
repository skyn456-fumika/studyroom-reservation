import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    alert('로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== 'ADMIN') {
    alert('관리자만 접근할 수 있습니다.');
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;