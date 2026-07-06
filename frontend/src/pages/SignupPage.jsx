import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/authApi';

function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }

    if (!form.name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (!form.password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (form.password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (form.password !== form.passwordConfirm) {
      alert('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);

      await signup({
        email: form.email,
        name: form.name,
        password: form.password,
      });

      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

      const message =
        error.response?.data?.message || '회원가입에 실패했습니다.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="page-title">회원가입</h1>

      <div className="card form-card">
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;