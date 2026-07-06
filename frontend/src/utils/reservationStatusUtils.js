export const getReservationStatusText = (status) => {
  switch (status) {
    case 'PENDING':
      return '승인 대기';
    case 'APPROVED':
      return '승인 완료';
    case 'REJECTED':
      return '거절됨';
    case 'CANCELED':
      return '취소됨';
    default:
      return status;
  }
};

export const canCancelReservation = (status) => {
  return status === 'PENDING' || status === 'APPROVED';
};

export const canProcessReservation = (status) => {
  return status === 'PENDING';
};