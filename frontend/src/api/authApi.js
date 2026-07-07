import axiosInstance from './axiosInstance';

export const signup = (data) => {
  return axiosInstance.post('/api/auth/signup', data);
};

export const login = (data) => {
  return axiosInstance.post('/api/auth/login', data);
};

export const refreshAccessToken = (refreshToken) => {
  return axiosInstance.post('/api/auth/refresh', {
    refreshToken,
  });
};