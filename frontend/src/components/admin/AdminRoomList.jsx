function AdminRoomList({
  rooms,
  onEditRoom,
  onToggleRoomStatus,
}) {
  return (
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
              onClick={() => onEditRoom(room)}
            >
              수정
            </button>

            <button
              type="button"
              className={room.status === 'ACTIVE' ? 'danger-button' : 'approve-button'}
              onClick={() => onToggleRoomStatus(room)}
            >
              {room.status === 'ACTIVE' ? '비활성화' : '활성화'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminRoomList;