function AdminRoomList({
  rooms,
  totalCount,
  roomStatusFilter,
  roomSearchKeyword,
  onStatusFilterChange,
  onSearchKeywordChange,
  onEditRoom,
  onToggleRoomStatus,
}) {
  return (
    <>
      <div className="card admin-filter-card">
        <div className="admin-filter-row">
          <div className="form-group admin-filter-group">
            <label>공간 상태</label>
            <select
              value={roomStatusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
            >
              <option value="ALL">전체</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
            </select>
          </div>

          <div className="form-group admin-filter-group admin-search-group">
            <label>검색</label>
            <input
              type="text"
              value={roomSearchKeyword}
              onChange={(e) => onSearchKeywordChange(e.target.value)}
              placeholder="공간명 또는 위치 검색"
            />
          </div>
        </div>

        <p className="admin-filter-result">
          전체 {totalCount}개 중 {rooms.length}개 표시
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="card">
          조건에 맞는 공간이 없습니다.
        </div>
      ) : (
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

                <div className="admin-room-image-box">
                  {room.imageUrl ? (
                    <img src={room.imageUrl} alt={room.name} className="admin-room-image" />
                  ) : (
                    <div className="admin-room-image-placeholder">이미지 없음</div>
                  )}
                </div>

                <p className="admin-room-description">{room.description}</p>

                <div className="admin-room-info">
                  <span>📍 {room.location}</span>
                  <span>👥 {room.capacity}명</span>
                  <span>💰 {room.hourlyPrice.toLocaleString()}원</span>
                  <span>🕒 {room.openHour}:00 ~ {room.closeHour}:00</span>
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
      )}
    </>
  );
}

export default AdminRoomList;