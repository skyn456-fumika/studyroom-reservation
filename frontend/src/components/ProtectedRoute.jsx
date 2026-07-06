import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly = false }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const alertedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      if (!alertedRef.current) {
        alertedRef.current = true;
        alert('로그인이 필요합니다.');
      }

      navigate('/login', { replace: true });
      return;
    }

    if (adminOnly && userRole !== 'ADMIN') {
      if (!alertedRef.current) {
        alertedRef.current = true;
        alert('관리자만 접근할 수 있습니다.');
      }

      navigate('/', { replace: true });
      return;
    }

    setAllowed(true);
  }, [adminOnly, navigate]);

  if (!allowed) {
    return null;
  }

  return children;
}

export default ProtectedRoute;