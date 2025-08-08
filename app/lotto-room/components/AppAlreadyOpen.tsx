const AppAlreadyOpen = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-yellow-50">
      <div className="  p-6 rounded-lg shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Ứng dụng đã được mở
        </h2>
        <p className="mb-4">
          Ứng dụng này đã được mở trong một tab khác. Vui lòng sử dụng tab đó
          hoặc đóng tab đó trước khi mở tab mới.
        </p>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại trang chủ
        </button>
      </div>
    </div>
  );
};

export default AppAlreadyOpen;
