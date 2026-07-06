import axiosInstance from './axiosInstance';

export const getRooms = () => {
  return axiosInstance.get('/api/rooms');
};

export const getRoom = (roomId) => {
  return axiosInstance.get(`/api/rooms/${roomId}`);
};

export const getRoomReservations = (roomId, date) => {
  return axiosInstance.get(`/api/rooms/${roomId}/reservations`, {
    params: {
      date,
    },
  });
};

export const getAvailableTimes = (roomId, date) => {
  return axiosInstance.get(`/api/rooms/${roomId}/available-times`, {
    params: {
      date,
    },
  });
};