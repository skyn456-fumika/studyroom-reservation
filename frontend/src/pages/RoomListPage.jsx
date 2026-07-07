import { useEffect, useState } from 'react';
import { getRooms } from '../api/roomApi';
import { useNavigate } from 'react-router-dom';

function RoomListPage() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }
      
      alert('공간 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="page-title">스터디룸 목록</h1>
        <div className="card">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">스터디룸 목록</h1>

      {rooms.length === 0 ? (
        <div className="card">
          예약 가능한 공간이 없습니다.
        </div>
      ) : (
        <div className="room-grid">
          {rooms.map((room) => (
            <div
                className="room-card"
                key={room.id}
                onClick={() => navigate(`/rooms/${room.id}`)}
                >
              <div className="room-image-box">
                {room.imageUrl ? (
                  <img src={room.imageUrl} alt={room.name} className="room-image" />
                ) : (
                  <div className="room-image-placeholder">이미지 없음</div>
                )}
              </div>
              <h2>{room.name}</h2>

              <p className="room-description">{room.description}</p>

              <div className="room-info">
                <p>위치: {room.location}</p>
                <p>수용 인원: {room.capacity}명</p>
                <p>시간당 가격: {room.hourlyPrice.toLocaleString()}원</p>
                <p>
                  운영 시간: {room.openHour}:00 ~ {room.closeHour}:00
                </p>
              </div>

              <span className="room-status">{room.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RoomListPage;