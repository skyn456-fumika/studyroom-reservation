import { useEffect, useState } from 'react';

import {
  getAdminReservations,
  approveReservation,
  rejectReservation,
  getAdminRooms,
  createRoom,
  updateRoom,
  activateRoom,
  deactivateRoom,
} from '../api/adminApi';

import AdminRoomForm from '../components/admin/AdminRoomForm';
import AdminRoomList from '../components/admin/AdminRoomList';
import AdminReservationList from '../components/admin/AdminReservationList';

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
    const response = await getAdminReservations();
    setReservations(response.data);
  };

  const fetchRooms = async () => {
    const response = await getAdminRooms();
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

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

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

      await approveReservation(reservationId);

      alert('예약이 승인되었습니다.');
      fetchReservations();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

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

      await rejectReservation(reservationId);

      alert('예약이 거절되었습니다.');
      fetchReservations();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

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
        await updateRoom(editingRoomId, payload);
        alert('공간이 수정되었습니다.');
      } else {
        await createRoom(payload);
        alert('공간이 등록되었습니다.');
      }

      setRoomForm(initialRoomForm);
      setEditingRoomId(null);
      fetchRooms();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

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
      if (isActive) {
        await deactivateRoom(room.id);
        alert('공간이 비활성화되었습니다.');
      } else {
        await activateRoom(room.id);
        alert('공간이 활성화되었습니다.');
      }

      fetchRooms();
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

      const message =
        error.response?.data?.message || '공간 상태 변경에 실패했습니다.';

      alert(message);
    }
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

        <AdminRoomForm
          roomForm={roomForm}
          editingRoomId={editingRoomId}
          roomSaving={roomSaving}
          onChange={handleRoomFormChange}
          onSubmit={handleRoomSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <AdminRoomList
          rooms={rooms}
          onEditRoom={handleEditRoom}
          onToggleRoomStatus={handleToggleRoomStatus}
        />
      </section>

      <section className="admin-section admin-reservation-section">
        <div className="section-header">
          <h2 className="section-title">예약 관리</h2>
          <span className="section-count">총 {reservations.length}건</span>
        </div>

        <AdminReservationList
          reservations={reservations}
          actionLoadingId={actionLoadingId}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </section>
    </div>
  );
}

export default AdminPage;