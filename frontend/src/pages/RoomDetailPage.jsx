import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function RoomDetailPage() {
  const { roomId } = useParams();

  const today = new Date().toISOString().split('T')[0];

  const [room, setRoom] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);

  const [roomLoading, setRoomLoading] = useState(true);
  const [timeLoading, setTimeLoading] = useState(false);

  const [selectedTime, setSelectedTime] = useState(null);
  const [reservationLoading, setReservationLoading] = useState(false);

  const fetchRoom = async () => {
    try {
      const response = await axiosInstance.get(`/api/rooms/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '공간 정보를 불러오지 못했습니다.';

      alert(message);
    } finally {
      setRoomLoading(false);
    }
  };

  const fetchAvailableTimes = async (date) => {
    try {
      setTimeLoading(true);

      const response = await axiosInstance.get(
        `/api/rooms/${roomId}/available-times`,
        {
          params: {
            date,
          },
        }
      );

      setAvailableTimes(response.data);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || '예약 가능 시간을 불러오지 못했습니다.';

      alert(message);
      setAvailableTimes([]);
    } finally {
      setTimeLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime(null);
    fetchAvailableTimes(date);
  };

  const handleReservation = async () => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    alert('로그인이 필요합니다.');
    return;
  }

  if (!selectedTime) {
    alert('예약 시간을 선택해주세요.');
    return;
  }

  if (!window.confirm('선택한 시간으로 예약을 신청하시겠습니까?')) {
    return;
  }

  try {
    setReservationLoading(true);

    await axiosInstance.post('/api/reservations', {
      roomId: Number(roomId),
      reservationDate: selectedDate,
      startTime: selectedTime.startTime,
      endTime: selectedTime.endTime,
    });

    alert('예약 신청이 완료되었습니다.');
    window.location.href = '/my-reservations';
  } catch (error) {
    console.error(error);

    const message =
      error.response?.data?.message || '예약 신청에 실패했습니다.';

    alert(message);
  } finally {
    setReservationLoading(false);
  }
};

  useEffect(() => {
    fetchRoom();
    fetchAvailableTimes(selectedDate);
  }, [roomId]);

  if (roomLoading) {
    return (
      <div>
        <h1 className="page-title">스터디룸 상세</h1>
        <div className="card">불러오는 중...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div>
        <h1 className="page-title">스터디룸 상세</h1>
        <div className="card">공간 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{room.name}</h1>

      <div className="card room-detail-card">
        <p className="room-detail-description">{room.description}</p>

        <div className="detail-info">
          <p>
            <strong>위치</strong>
            <span>{room.location}</span>
          </p>

          <p>
            <strong>수용 인원</strong>
            <span>{room.capacity}명</span>
          </p>

          <p>
            <strong>시간당 가격</strong>
            <span>{room.hourlyPrice.toLocaleString()}원</span>
          </p>

          <p>
            <strong>운영 시간</strong>
            <span>
              {room.openHour}:00 ~ {room.closeHour}:00
            </span>
          </p>

          <p>
            <strong>상태</strong>
            <span>{room.status}</span>
          </p>
        </div>
      </div>

      <div className="card reservation-card">
        <h2 className="section-title">예약 가능 시간</h2>

        <div className="date-field">
          <label>예약 날짜</label>
          <input
            type="date"
            value={selectedDate}
            min={today}
            onChange={handleDateChange}
          />
        </div>

        {timeLoading ? (
          <p className="loading-text">시간대를 불러오는 중...</p>
        ) : availableTimes.length === 0 ? (
          <p className="empty-text">조회 가능한 시간대가 없습니다.</p>
        ) : (
          <>
            <div className="time-grid">
              {availableTimes.map((time) => (
                <button
                  type="button"
                  key={`${time.startTime}-${time.endTime}`}
                  className={`time-button 
                    ${time.available ? '' : 'disabled'} 
                    ${selectedTime?.startTime === time.startTime ? 'selected' : ''}
                  `}
                  disabled={!time.available}
                  onClick={() => setSelectedTime(time)}
                >
                  {time.startTime.slice(0, 5)} ~ {time.endTime.slice(0, 5)}
                </button>
              ))}
            </div>

            {selectedTime && (
              <div className="selected-time-box">
                선택 시간: {selectedTime.startTime.slice(0, 5)} ~ {selectedTime.endTime.slice(0, 5)}
              </div>
            )}

            <button
              type="button"
              className="primary-button reservation-submit-button"
              onClick={handleReservation}
              disabled={reservationLoading || !selectedTime}
            >
              {reservationLoading ? '예약 신청 중...' : '예약 신청'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RoomDetailPage;