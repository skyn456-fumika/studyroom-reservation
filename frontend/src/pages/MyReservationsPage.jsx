import { useEffect, useState } from 'react';
import { getMyReservations, cancelReservation } from '../api/reservationApi';
import {
  getReservationStatusText,
  canCancelReservation,
} from '../utils/reservationStatusUtils';

function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('LATEST');

  const fetchReservations = async () => {
    try {
      const response = await getMyReservations();
      setReservations(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

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

      await cancelReservation(reservationId);

      alert('예약이 취소되었습니다.');
      fetchReservations();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

      const message =
        error.response?.data?.message || '예약 취소에 실패했습니다.';

      alert(message);
    } finally {
      setCancelLoadingId(null);
    }
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

  const filteredReservations = reservations
    .filter((reservation) => {
      const matchesStatus =
        statusFilter === 'ALL' || reservation.status === statusFilter;

      const keyword = searchKeyword.trim().toLowerCase();

      const matchesKeyword =
        !keyword || reservation.roomName.toLowerCase().includes(keyword);

      return matchesStatus && matchesKeyword;
    })
    .sort((a, b) => {
      const dateTimeA = `${a.reservationDate} ${a.startTime}`;
      const dateTimeB = `${b.reservationDate} ${b.startTime}`;

      if (sortOrder === 'LATEST') {
        return dateTimeB.localeCompare(dateTimeA);
      }

      return dateTimeA.localeCompare(dateTimeB);
    });

  return (
    <div>
      <div className="page-hero">
        <div>
          <p className="page-eyebrow">My Reservations</p>
          <h1 className="page-title">내 예약 목록</h1>
          <p className="page-description">
            신청한 예약의 진행 상태를 확인하고, 대기 중인 예약을 취소할 수 있습니다.
          </p>
        </div>

        <span className="page-count-badge">
          전체 예약 {reservations.length}건
        </span>
      </div>

      <div className="card admin-filter-card my-reservation-filter-card">
        <div className="admin-filter-row">
          <div className="form-group admin-filter-group">
            <label>예약 상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="PENDING">대기</option>
              <option value="APPROVED">승인</option>
              <option value="REJECTED">거절</option>
              <option value="CANCELED">취소</option>
            </select>
          </div>

          <div className="form-group admin-filter-group admin-search-group">
            <label>검색</label>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="공간명 검색"
            />
          </div>

          <div className="form-group admin-filter-group">
            <label>정렬</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="LATEST">최신순</option>
              <option value="OLDEST">오래된순</option>
            </select>
          </div>
        </div>

        <p className="admin-filter-result">
          전체 {reservations.length}건 중 {filteredReservations.length}건 표시
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="card">
          예약 내역이 없습니다.
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="card">
          조건에 맞는 예약이 없습니다.
        </div>
      ) : (
        <div className="reservation-list">
          {filteredReservations.map((reservation) => (
            <div className="card reservation-item" key={reservation.id}>
              <div className="reservation-main">
                <div>
                  <h2>{reservation.roomName}</h2>

                  <div className="reservation-meta">
                    <p className="reservation-date">
                      {reservation.reservationDate}
                    </p>

                    <p className="reservation-time">
                      {reservation.startTime.slice(0, 5)} ~ {reservation.endTime.slice(0, 5)}
                    </p>
                  </div>
                </div>

                <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                  {getReservationStatusText(reservation.status)}
                </span>
              </div>

              <div className="reservation-actions">
                <div className="reservation-action-info">
                  <p>
                    예약자: {reservation.userName}
                  </p>

                  {reservation.adminMemo && (
                    <p className="reservation-memo">
                      관리자 메모: {reservation.adminMemo}
                    </p>
                  )}
                </div>

                {canCancelReservation(reservation.status) && (
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