import axios from 'axios';

let isAuthAlertShown = false;
let isRefreshing = false;
let refreshSubscribers = [];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const clearAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url;

    const isLoginRequest = requestUrl === '/api/auth/login';
    const isRefreshRequest = requestUrl === '/api/auth/refresh';

    if (status === 401 && !isLoginRequest && !isRefreshRequest && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        if (!isAuthAlertShown) {
          isAuthAlertShown = true;

          clearAuthStorage();

          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await axiosInstance.post('/api/auth/refresh', {
          refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAuthStorage();

        if (!isAuthAlertShown) {
          isAuthAlertShown = true;

          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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