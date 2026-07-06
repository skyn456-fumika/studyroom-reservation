import {
  getReservationStatusText,
  canProcessReservation,
} from '../../utils/reservationStatusUtils';

function AdminReservationList({
  reservations,
  actionLoadingId,
  onApprove,
  onReject,
}) {
  if (reservations.length === 0) {
    return (
      <div className="card">
        예약 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="admin-reservation-list">
      {reservations.map((reservation) => (
        <div className="card admin-reservation-item" key={reservation.id}>
          <div className="reservation-main">
            <div>
              <h2>{reservation.roomName}</h2>

              <p className="reservation-date">
                {reservation.reservationDate}
              </p>

              <p className="reservation-time">
                {reservation.startTime.slice(0, 5)} ~ {reservation.endTime.slice(0, 5)}
              </p>

              <p className="admin-reservation-user">
                예약자: {reservation.userName}
              </p>
            </div>

            <span className={`status-badge ${reservation.status.toLowerCase()}`}>
              {getReservationStatusText(reservation.status)}
            </span>
          </div>

          <div className="reservation-actions">
            <p>
              예약 ID: {reservation.id}
            </p>

            {canProcessReservation(reservation.status) ? (
              <div className="admin-action-buttons">
                <button
                  type="button"
                  className="approve-button"
                  onClick={() => onApprove(reservation.id)}
                  disabled={actionLoadingId === reservation.id}
                >
                  {actionLoadingId === reservation.id ? '처리 중...' : '승인'}
                </button>

                <button
                  type="button"
                  className="danger-button"
                  onClick={() => onReject(reservation.id)}
                  disabled={actionLoadingId === reservation.id}
                >
                  {actionLoadingId === reservation.id ? '처리 중...' : '거절'}
                </button>
              </div>
            ) : (
              <span className="processed-text">
                처리 완료
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminReservationList;