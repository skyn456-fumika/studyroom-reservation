import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  const fetchReservations = async () => {
    try {
      const response = await axiosInstance.get('/api/reservations/me');
      setReservations(response.data);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '예약 목록을 불러오지 못했습니다.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm('예약을 취소하시겠습니까?')) {
      return;
    }

    try {
      setCancelLoadingId(reservationId);

      await axiosInstance.patch(`/api/reservations/${reservationId}/cancel`);

      alert('예약이 취소되었습니다.');
      fetchReservations();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '예약 취소에 실패했습니다.';

      alert(message);
    } finally {
      setCancelLoadingId(null);
    }
  };

  const getStatusText = (status) => {
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

  const canCancel = (status) => {
    return status === 'PENDING' || status === 'APPROVED';
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="page-title">내 예약 목록</h1>
        <div className="card">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">내 예약 목록</h1>

      {reservations.length === 0 ? (
        <div className="card">
          예약 내역이 없습니다.
        </div>
      ) : (
        <div className="reservation-list">
          {reservations.map((reservation) => (
            <div className="card reservation-item" key={reservation.id}>
              <div className="reservation-main">
                <div>
                  <h2>{reservation.roomName}</h2>

                  <p className="reservation-date">
                    {reservation.reservationDate}
                  </p>

                  <p className="reservation-time">
                    {reservation.startTime.slice(0, 5)} ~ {reservation.endTime.slice(0, 5)}
                  </p>
                </div>

                <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                  {getStatusText(reservation.status)}
                </span>
              </div>

              <div className="reservation-actions">
                <p>
                  예약자: {reservation.userName}
                </p>

                {canCancel(reservation.status) && (
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleCancel(reservation.id)}
                    disabled={cancelLoadingId === reservation.id}
                  >
                    {cancelLoadingId === reservation.id ? '취소 중...' : '예약 취소'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReservationsPage;