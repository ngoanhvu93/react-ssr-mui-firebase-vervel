import { useNavigate } from "react-router";
import { CustomButton } from "~/components/CustomButton";

export const RoomNotFound = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Không tìm thấy phòng</p>
          <CustomButton
            variant="primary"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate("/")}
          >
            Quay về trang chủ
          </CustomButton>
        </div>
      </div>
    </div>
  );
};
