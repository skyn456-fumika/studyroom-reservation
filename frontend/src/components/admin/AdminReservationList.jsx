import {
  getReservationStatusText,
  canProcessReservation,
} from '../../utils/reservationStatusUtils';

function AdminReservationList({
  reservations,
  totalCount,
  reservationStatusFilter,
  reservationSearchKeyword,
  onStatusFilterChange,
  onSearchKeywordChange,
  actionLoadingId,
  onApprove,
  onReject,
}) {
  return (
    <>
      <div className="card admin-filter-card">
        <div className="admin-filter-row">
          <div className="form-group admin-filter-group">
            <label>예약 상태</label>
            <select
              value={reservationStatusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="PENDING">승인 대기</option>
              <option value="APPROVED">승인 완료</option>
              <option value="REJECTED">거절됨</option>
              <option value="CANCELED">취소됨</option>
            </select>
          </div>

          <div className="form-group admin-filter-group admin-search-group">
            <label>검색</label>
            <input
              type="text"
              value={reservationSearchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              placeholder="공간명 또는 예약자 이름 검색"
            />
          </div>
        </div>

        <p className="admin-filter-result">
          전체 {totalCount}건 중 {reservations.length}건 표시
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="card">
          조건에 맞는 예약 내역이 없습니다.
        </div>
      ) : (
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

                  {reservation.adminMemo && (
                    <p className="admin-reservation-memo">
                      관리자 메모: {reservation.adminMemo}
                    </p>
                  )}
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
      )}
    </>
  );
}

export default AdminReservationList;