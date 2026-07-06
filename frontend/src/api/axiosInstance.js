import axios from 'axios';

let isAuthAlertShown = false;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url;

    const isLoginRequest = requestUrl === '/api/auth/login';

    if (status === 401 && !isLoginRequest) {
      if (!isAuthAlertShown) {
        isAuthAlertShown = true;

        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');

        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      if (!isAuthAlertShown) {
        isAuthAlertShown = true;

        alert('접근 권한이 없습니다.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;