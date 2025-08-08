import { useNavigate } from "react-router";
import { useState } from "react";
import { collection } from "firebase/firestore";
import { addDoc } from "firebase/firestore";
import { db } from "firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { saveRoomPassword } from "../utils/password-storage";
import toast from "react-hot-toast";
import { TopAppBar } from "~/components/TopAppBar";
import { FormCreateLottoRoom } from "./components/FormCreateLottoRoom";
import type { ILottoRoom } from "firebase/types";

const CreateLottoRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");

  const checkPasswordStrength = (pass: string) => {
    if (pass.length < 6) return "weak";
    if (pass.length < 8) return "medium";
    return "strong";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomName.trim()) {
      setError("Vui lòng nhập tên phòng");
      return;
    }

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      // Clear localStorage except for ticket
      const ticket = localStorage.getItem("ticket");
      localStorage.clear();
      if (ticket) {
        localStorage.setItem("ticket", ticket);
      }

      const roomId = uuidv4();
      const lotoRoomData: ILottoRoom = {
        id: roomId,
        name: roomName.trim(),
        password: password.trim(),
        createdAt: new Date(),
        status: "waiting",
        calledNumbers: [],
        players: [],
      };

      console.log("Attempting to create room with data:", lotoRoomData);
      const docRef = await addDoc(collection(db, "lotto-rooms"), lotoRoomData);
      console.log("Room created successfully with ID:", docRef.id);

      if (rememberPassword) {
        saveRoomPassword(roomId, password.trim());
      }

      navigate(`/lotto-room/${lotoRoomData.id}`);
      toast.success("Phòng lô tô đã được tạo thành công");
    } catch (err) {
      console.error("Error creating room:", err);
      setError(
        "Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại. Chi tiết: " +
          (err as Error).message
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <TopAppBar
        onBack={() => navigate("/join-lotto-room")}
        title="Tạo phòng lô tô"
      />
      <FormCreateLottoRoom
        error={error}
        handleCreateRoom={handleCreateRoom}
        roomName={roomName}
        setRoomName={setRoomName}
        password={password}
        handlePasswordChange={handlePasswordChange}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        passwordStrength={passwordStrength}
        rememberPassword={rememberPassword}
        setRememberPassword={setRememberPassword}
        isCreating={isCreating}
      />
    </>
  );
};

export default CreateLottoRoomPage;
