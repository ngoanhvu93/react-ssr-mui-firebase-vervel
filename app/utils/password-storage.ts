// Lưu mật khẩu phòng
export const saveRoomPassword = (roomId: string, password: string): void => {
  localStorage.setItem(`room_password_${roomId}`, password);
};

// Lấy mật khẩu phòng đã lưu
export const getSavedRoomPassword = (roomId: string): string | null => {
  return localStorage.getItem(`room_password_${roomId}`);
};

// Xóa mật khẩu phòng đã lưu
export const removeSavedRoomPassword = (roomId: string): void => {
  localStorage.removeItem(`room_password_${roomId}`);
};

// Kiểm tra xem mật khẩu phòng có được lưu hay không
export const hasRoomPasswordSaved = (roomId: string): boolean => {
  return localStorage.getItem(`room_password_${roomId}`) !== null;
}; 