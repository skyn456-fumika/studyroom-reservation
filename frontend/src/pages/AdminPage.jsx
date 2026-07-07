import { useEffect, useState } from 'react';

import {
  getAdminReservations,
  approveReservation,
  rejectReservation,
  getAdminRooms,
  createRoom,
  updateRoom,
  uploadRoomImage,
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
  imageUrl: '',
};

function AdminPage() {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [activeTab, setActiveTab] = useState('rooms');

  const [roomStatusFilter, setRoomStatusFilter] = useState('ALL');
  const [roomSearchKeyword, setRoomSearchKeyword] = useState('');

  const [reservationStatusFilter, setReservationStatusFilter] = useState('ALL');
  const [reservationSearchKeyword, setReservationSearchKeyword] = useState('');
  

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [roomForm, setRoomForm] = useState(initialRoomForm);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomSaving, setRoomSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

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
    const adminMemo = window.prompt(
      '승인 메모를 입력해주세요. 비워두면 메모 없이 승인됩니다.'
    );

    if (adminMemo === null) {
      return;
    }

    if (!window.confirm('예약을 승인하시겠습니까?')) {
      return;
    }

    try {
      setActionLoadingId(reservationId);

      await approveReservation(reservationId, adminMemo.trim());

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
    const adminMemo = window.prompt(
      '거절 사유를 입력해주세요. 비워두면 메모 없이 거절됩니다.'
    );

    if (adminMemo === null) {
      return;
    }

    if (!window.confirm('예약을 거절하시겠습니까?')) {
      return;
    }

    try {
      setActionLoadingId(reservationId);

      await rejectReservation(reservationId, adminMemo.trim());

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

  const handleRoomImageUpload = async (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    try {
      setImageUploading(true);

      const response = await uploadRoomImage(file);

      const uploadedImageUrl = response.data.imageUrl;

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';

      const imageUrl = uploadedImageUrl.startsWith('http')
        ? uploadedImageUrl
        : `${apiBaseUrl}${uploadedImageUrl}`;

      setRoomForm((prev) => ({
        ...prev,
        imageUrl,
      }));

      alert('이미지가 업로드되었습니다.');
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }

      const message =
        error.response?.data?.message || '이미지 업로드에 실패했습니다.';

      alert(message);
    } finally {
      setImageUploading(false);
    }
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
      imageUrl: roomForm.imageUrl,
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
      imageUrl: room.imageUrl || '',
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

  const filteredReservations = reservations.filter((reservation) => {
    const matchesStatus =
      reservationStatusFilter === 'ALL' ||
      reservation.status === reservationStatusFilter;

    const keyword = reservationSearchKeyword.trim().toLowerCase();

    const matchesKeyword =
      !keyword ||
      reservation.roomName.toLowerCase().includes(keyword) ||
      reservation.userName.toLowerCase().includes(keyword);

    return matchesStatus && matchesKeyword;
  });

  const filteredRooms = rooms.filter((room) => {
    const matchesStatus =
      roomStatusFilter === 'ALL' ||
      room.status === roomStatusFilter;

    const keyword = roomSearchKeyword.trim().toLowerCase();

    const matchesKeyword =
      !keyword ||
      room.name.toLowerCase().includes(keyword) ||
      room.location.toLowerCase().includes(keyword);

    return matchesStatus && matchesKeyword;
  });

  return (
    <div>
      <div className="page-hero admin-page-hero">
        <div>
          <p className="page-eyebrow">Admin Dashboard</p>
          <h1 className="page-title">관리자 페이지</h1>
          <p className="page-description">
            공간 정보와 예약 요청을 한 곳에서 관리할 수 있습니다.
          </p>
        </div>

        <div className="admin-summary">
          <div className="admin-summary-card">
            <span className="admin-summary-label">전체 공간</span>
            <strong>{rooms.length}개</strong>
          </div>

          <div className="admin-summary-card">
            <span className="admin-summary-label">전체 예약</span>
            <strong>{reservations.length}건</strong>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          공간 관리
        </button>

        <button
          type="button"
          className={`admin-tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          예약 관리
        </button>
      </div>

      {activeTab === 'rooms' && (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">공간 관리</h2>
            <span className="section-count">
              {filteredRooms.length} / {rooms.length}개
            </span>
          </div>

          <AdminRoomForm
            roomForm={roomForm}
            editingRoomId={editingRoomId}
            roomSaving={roomSaving}
            imageUploading={imageUploading}
            onChange={handleRoomFormChange}
            onSubmit={handleRoomSubmit}
            onCancelEdit={handleCancelEdit}
            onImageUpload={handleRoomImageUpload}
          />

          <AdminRoomList
            rooms={filteredRooms}
            totalCount={rooms.length}
            roomStatusFilter={roomStatusFilter}
            roomSearchKeyword={roomSearchKeyword}
            onStatusFilterChange={setRoomStatusFilter}
            onSearchKeywordChange={setRoomSearchKeyword}
            onEditRoom={handleEditRoom}
            onToggleRoomStatus={handleToggleRoomStatus}
          />
        </section>
      )}

      {activeTab === 'reservations' && (
        <section className="admin-section admin-reservation-section">
          <div className="section-header">
            <h2 className="section-title">예약 관리</h2>
            <span className="section-count">
              {filteredReservations.length} / {reservations.length}건
            </span>
          </div>

          <AdminReservationList
            reservations={filteredReservations}
            totalCount={reservations.length}
            reservationStatusFilter={reservationStatusFilter}
            reservationSearchKeyword={reservationSearchKeyword}
            onStatusFilterChange={setReservationStatusFilter}
            onSearchKeywordChange={setReservationSearchKeyword}
            actionLoadingId={actionLoadingId}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </section>
      )}
    </div>
  );
}

export default AdminPage;