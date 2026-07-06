import axiosInstance from './axiosInstance';

export const createReservation = (data) => {
  return axiosInstance.post('/api/reservations', data);
};

export const getMyReservations = () => {
  return axiosInstance.get('/api/reservations/me');
};

export const cancelReservation = (reservationId) => {
  return axiosInstance.patch(`/api/reservations/${reservationId}/cancel`);
};