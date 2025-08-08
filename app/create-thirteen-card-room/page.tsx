import { useNavigate } from "react-router";
import { useState } from "react";
import { collection } from "firebase/firestore";
import { DEFAULT_ROOM_SETTINGS, type Room } from "firebase/types";
import { addDoc } from "firebase/firestore";
import { db } from "firebase/firebase";
import { v4 as uuidv4 } from "uuid";
import { saveRoomPassword } from "../utils/password-storage";
import { TopAppBar } from "~/components/TopAppBar";
import { FormCreateThirteenCardRoom } from "./components/FormCreateThirteenCardRoom";
import toast from "react-hot-toast";

const CreateThirteenCardRoom = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [winningScore, setWinningScore] = useState("");
  const [unlimitedScore, setUnlimitedScore] = useState(true);
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

  const handleCreateRoom = async (data: {
    roomName: string;
    password: string;
    winningScore: string;
    unlimitedScore: boolean;
    rememberPassword: boolean;
  }) => {
    if (!data.roomName.trim()) {
      setError("Vui lòng nhập tên phòng");
      return;
    }

    if (!data.password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    if (
      !data.unlimitedScore &&
      (!data.winningScore || parseInt(data.winningScore) < 1)
    ) {
      setError("Vui lòng nhập số điểm hợp lệ (lớn hơn 0)");
      return;
    }

    try {
      setIsCreating(true);
      setError("");

      const roomId = uuidv4();
      const roomData: Room = {
        id: roomId,
        name: data.roomName.trim(),
        password: data.password.trim(),
        winningScore: data.unlimitedScore ? 0 : parseInt(data.winningScore),
        createdAt: new Date(),
        gameCount: 0,
        currentRound: 0,
        players: [],
        roomSettings: {
          whiteWin: DEFAULT_ROOM_SETTINGS.whiteWin,
          rankFirst: DEFAULT_ROOM_SETTINGS.rankFirst,
          rankSecond: DEFAULT_ROOM_SETTINGS.rankSecond,
          rankThird: DEFAULT_ROOM_SETTINGS.rankThird,
          rankFourth: DEFAULT_ROOM_SETTINGS.rankFourth,
        },
      };

      console.log("Attempting to create room with data:", roomData);
      const docRef = await addDoc(collection(db, "rooms"), roomData);
      await navigate(`/thirteen-card-room/${roomData.id}`);
      console.log("Room created successfully with ID:", docRef.id);

      if (data.rememberPassword) {
        saveRoomPassword(roomId, data.password.trim());
      }
      toast.success("Phòng đã được tạo thành công");
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
    <div className="flex flex-col h-screen mx-auto max-w-4xl overflow-hidden">
      <TopAppBar
        title="Tạo phòng chơi bài"
        onBack={() => navigate("/join-thirteen-card-room")}
      />
      <div className="grow h-full">
        <FormCreateThirteenCardRoom
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
          unlimitedScore={unlimitedScore}
          setUnlimitedScore={setUnlimitedScore}
          winningScore={winningScore}
          setWinningScore={setWinningScore}
        />
      </div>
    </div>
  );
};

export default CreateThirteenCardRoom;
