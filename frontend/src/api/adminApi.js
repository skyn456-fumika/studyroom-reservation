import axiosInstance from './axiosInstance';

export const getAdminReservations = () => {
  return axiosInstance.get('/api/admin/reservations');
};

export const approveReservation = (reservationId, adminMemo) => {
  return axiosInstance.patch(`/api/admin/reservations/${reservationId}/approve`, {
    adminMemo,
  });
};

export const rejectReservation = (reservationId, adminMemo) => {
  return axiosInstance.patch(`/api/admin/reservations/${reservationId}/reject`, {
    adminMemo,
  });
};

export const getAdminRooms = () => {
  return axiosInstance.get('/api/admin/rooms');
};

export const createRoom = (data) => {
  return axiosInstance.post('/api/admin/rooms', data);
};

export const updateRoom = (roomId, data) => {
  return axiosInstance.put(`/api/admin/rooms/${roomId}`, data);
};

export const activateRoom = (roomId) => {
  return axiosInstance.patch(`/api/admin/rooms/${roomId}/active`);
};

export const deactivateRoom = (roomId) => {
  return axiosInstance.patch(`/api/admin/rooms/${roomId}/inactive`);
};