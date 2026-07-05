import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const initialRoomForm = {
  name: '',
  description: '',
  location: '',
  capacity: 1,
  hourlyPrice: 0,
  openHour: 9,
  closeHour: 22,
};

function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [roomForm, setRoomForm] = useState(initialRoomForm);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomSaving, setRoomSaving] = useState(false);

  const fetchReservations = async () => {
    const response = await axiosInstance.get('/api/admin/reservations');
    setReservations(response.data);
  };

  const fetchRooms = async () => {
    const response = await axiosInstance.get('/api/admin/rooms');
    setRooms(response.data);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchReservations(),
        fetchRooms(),
      ]);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '관리자 데이터를 불러오지 못했습니다.';

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reservationId) => {
    if (!window.confirm('예약을 승인하시겠습니까?')) {
      return;
    }

    try {
      setActionLoadingId(reservationId);

      await axiosInstance.patch(`/api/admin/reservations/${reservationId}/approve`);

      alert('예약이 승인되었습니다.');
      fetchReservations();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '예약 승인에 실패했습니다.';

      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (reservationId) => {
    if (!window.confirm('예약을 거절하시겠습니까?')) {
      return;
    }

    try {
      setActionLoadingId(reservationId);

      await axiosInstance.patch(`/api/admin/reservations/${reservationId}/reject`);

      alert('예약이 거절되었습니다.');
      fetchReservations();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '예약 거절에 실패했습니다.';

      alert(message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRoomFormChange = (e) => {
    const { name, value } = e.target;

    setRoomForm({
      ...roomForm,
      [name]: value,
    });
  };

  const validateRoomForm = () => {
    if (!roomForm.name.trim()) {
      alert('공간 이름을 입력해주세요.');
      return false;
    }

    if (!roomForm.description.trim()) {
      alert('공간 설명을 입력해주세요.');
      return false;
    }

    if (!roomForm.location.trim()) {
      alert('위치를 입력해주세요.');
      return false;
    }

    if (Number(roomForm.capacity) < 1) {
      alert('수용 인원은 1명 이상이어야 합니다.');
      return false;
    }

    if (Number(roomForm.hourlyPrice) < 0) {
      alert('시간당 가격은 0원 이상이어야 합니다.');
      return false;
    }

    if (Number(roomForm.openHour) >= Number(roomForm.closeHour)) {
      alert('운영 시작 시간은 종료 시간보다 빨라야 합니다.');
      return false;
    }

    return true;
  };

  const getRoomPayload = () => {
    return {
      name: roomForm.name,
      description: roomForm.description,
      location: roomForm.location,
      capacity: Number(roomForm.capacity),
      hourlyPrice: Number(roomForm.hourlyPrice),
      openHour: Number(roomForm.openHour),
      closeHour: Number(roomForm.closeHour),
    };
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    if (!validateRoomForm()) {
      return;
    }

    try {
      setRoomSaving(true);

      const payload = getRoomPayload();

      if (editingRoomId) {
        await axiosInstance.put(`/api/admin/rooms/${editingRoomId}`, payload);
        alert('공간이 수정되었습니다.');
      } else {
        await axiosInstance.post('/api/admin/rooms', payload);
        alert('공간이 등록되었습니다.');
      }

      setRoomForm(initialRoomForm);
      setEditingRoomId(null);
      fetchRooms();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '공간 저장에 실패했습니다.';

      alert(message);
    } finally {
      setRoomSaving(false);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoomId(room.id);

    setRoomForm({
      name: room.name,
      description: room.description,
      location: room.location,
      capacity: room.capacity,
      hourlyPrice: room.hourlyPrice,
      openHour: room.openHour,
      closeHour: room.closeHour,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null);
    setRoomForm(initialRoomForm);
  };

  const handleToggleRoomStatus = async (room) => {
    const isActive = room.status === 'ACTIVE';

    const confirmMessage = isActive
      ? '이 공간을 비활성화하시겠습니까?'
      : '이 공간을 활성화하시겠습니까?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const url = isActive
        ? `/api/admin/rooms/${room.id}/inactive`
        : `/api/admin/rooms/${room.id}/active`;

      await axiosInstance.patch(url);

      alert(isActive ? '공간이 비활성화되었습니다.' : '공간이 활성화되었습니다.');
      fetchRooms();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '공간 상태 변경에 실패했습니다.';

      alert(message);
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

  const canProcess = (status) => {
    return status === 'PENDING';
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="page-title">관리자 페이지</h1>
        <div className="card">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">관리자 페이지</h1>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">공간 관리</h2>
          <span className="section-count">총 {rooms.length}개</span>
        </div>

        <div className="card admin-room-form-card">
          <h3 className="admin-form-title">
            {editingRoomId ? '공간 수정' : '공간 등록'}
          </h3>

          <form onSubmit={handleRoomSubmit}>
            <div className="admin-room-form-grid">
              <div className="form-group">
                <label>공간 이름</label>
                <input
                  type="text"
                  name="name"
                  value={roomForm.name}
                  onChange={handleRoomFormChange}
                  placeholder="A 스터디룸"
                />
              </div>

              <div className="form-group">
                <label>위치</label>
                <input
                  type="text"
                  name="location"
                  value={roomForm.location}
                  onChange={handleRoomFormChange}
                  placeholder="2층 201호"
                />
              </div>

              <div className="form-group">
                <label>수용 인원</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={roomForm.capacity}
                  onChange={handleRoomFormChange}
                />
              </div>

              <div className="form-group">
                <label>시간당 가격</label>
                <input
                  type="number"
                  name="hourlyPrice"
                  min="0"
                  value={roomForm.hourlyPrice}
                  onChange={handleRoomFormChange}
                />
              </div>

              <div className="form-group">
                <label>운영 시작 시간</label>
                <input
                  type="number"
                  name="openHour"
                  min="0"
                  max="23"
                  value={roomForm.openHour}
                  onChange={handleRoomFormChange}
                />
              </div>

              <div className="form-group">
                <label>운영 종료 시간</label>
                <input
                  type="number"
                  name="closeHour"
                  min="1"
                  max="24"
                  value={roomForm.closeHour}
                  onChange={handleRoomFormChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>공간 설명</label>
              <textarea
                name="description"
                value={roomForm.description}
                onChange={handleRoomFormChange}
                placeholder="공간 설명을 입력하세요"
              />
            </div>

            <div className="admin-form-buttons">
              <button
                type="submit"
                className="primary-button admin-submit-button"
                disabled={roomSaving}
              >
                {roomSaving
                  ? '저장 중...'
                  : editingRoomId
                    ? '공간 수정'
                    : '공간 등록'}
              </button>

              {editingRoomId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancelEdit}
                >
                  수정 취소
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-room-list">
          {rooms.map((room) => (
            <div className="card admin-room-item" key={room.id}>
              <div>
                <div className="admin-room-title-row">
                  <h3>{room.name}</h3>
                  <span className={`room-status-badge ${room.status.toLowerCase()}`}>
                    {room.status === 'ACTIVE' ? '활성' : '비활성'}
                  </span>
                </div>

                <p className="admin-room-description">{room.description}</p>

                <div className="admin-room-info">
                  <span>위치: {room.location}</span>
                  <span>인원: {room.capacity}명</span>
                  <span>가격: {room.hourlyPrice.toLocaleString()}원</span>
                  <span>운영: {room.openHour}:00 ~ {room.closeHour}:00</span>
                </div>
              </div>

              <div className="admin-room-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleEditRoom(room)}
                >
                  수정
                </button>

                <button
                  type="button"
                  className={room.status === 'ACTIVE' ? 'danger-button' : 'approve-button'}
                  onClick={() => handleToggleRoomStatus(room)}
                >
                  {room.status === 'ACTIVE' ? '비활성화' : '활성화'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section admin-reservation-section">
        <div className="section-header">
          <h2 className="section-title">예약 관리</h2>
          <span className="section-count">총 {reservations.length}건</span>
        </div>

        {reservations.length === 0 ? (
          <div className="card">
            예약 내역이 없습니다.
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
                  </div>

                  <span className={`status-badge ${reservation.status.toLowerCase()}`}>
                    {getStatusText(reservation.status)}
                  </span>
                </div>

                <div className="reservation-actions">
                  <p>
                    예약 ID: {reservation.id}
                  </p>

                  {canProcess(reservation.status) ? (
                    <div className="admin-action-buttons">
                      <button
                        type="button"
                        className="approve-button"
                        onClick={() => handleApprove(reservation.id)}
                        disabled={actionLoadingId === reservation.id}
                      >
                        {actionLoadingId === reservation.id ? '처리 중...' : '승인'}
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleReject(reservation.id)}
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
      </section>
    </div>
  );
}

export default AdminPage;