function AdminRoomForm({
  roomForm,
  editingRoomId,
  roomSaving,
  onChange,
  onSubmit,
  onCancelEdit,
}) {
  return (
    <div className="card admin-room-form-card">
      <h3 className="admin-form-title">
        {editingRoomId ? '공간 수정' : '공간 등록'}
      </h3>

      <form onSubmit={onSubmit}>
        <div className="admin-room-form-grid">
          <div className="form-group">
            <label>공간 이름</label>
            <input
              type="text"
              name="name"
              value={roomForm.name}
              onChange={onChange}
              placeholder="A 스터디룸"
            />
          </div>

          <div className="form-group">
            <label>위치</label>
            <input
              type="text"
              name="location"
              value={roomForm.location}
              onChange={onChange}
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
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label>시간당 가격</label>
            <input
              type="number"
              name="hourlyPrice"
              min="0"
              value={roomForm.hourlyPrice}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>이미지 URL</label>
          <input
            type="text"
            name="imageUrl"
            value={roomForm.imageUrl}
            onChange={onChange}
            placeholder="https://example.com/room-image.jpg"
          />
        </div>

        <div className="form-group">
          <label>공간 설명</label>
          <textarea
            name="description"
            value={roomForm.description}
            onChange={onChange}
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
              onClick={onCancelEdit}
            >
              수정 취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminRoomForm;