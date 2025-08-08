import { Loader, Save, Users, Lock, Eye, EyeOff } from "lucide-react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { CustomButton } from "~/components/CustomButton";
import PasswordStrengthIndicator from "~/components/PasswordStrenthIndicator";
import RememberPassword from "~/components/RememberPassword";

export const FormCreateLottoRoom = (props: {
  error: string;
  handleCreateRoom: (e: React.FormEvent) => void;
  roomName: string;
  setRoomName: (roomName: string) => void;
  password: string;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: (showPassword: boolean) => void;
  passwordStrength: string;
  rememberPassword: boolean;
  setRememberPassword: (rememberPassword: boolean) => void;
  isCreating: boolean;
}) => {
  const {
    error,
    handleCreateRoom,
    roomName,
    setRoomName,
    password,
    handlePasswordChange,
    showPassword,
    setShowPassword,
    passwordStrength,
    rememberPassword,
    setRememberPassword,
    isCreating,
  } = props;

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="max-w-md mx-auto p-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <span className="mr-2">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleCreateRoom} className="space-y-4">
        <TextField
          fullWidth
          label="Tên phòng"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          inputProps={{ maxLength: 30 }}
          required
          placeholder="Nhập tên phòng"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Users size={18} className="text-indigo-400" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="medium"
        />

        <div className="h-2" />

        <TextField
          fullWidth
          label="Mật khẩu phòng"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          inputProps={{
            minLength: 1,
            maxLength: 20,
            autoComplete: "new-password",
            autoCorrect: "off",
            spellCheck: "false",
          }}
          required
          placeholder="Nhập mật khẩu"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock size={18} className="text-indigo-400" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="medium"
        />

        {/* Password strength indicator */}
        <PasswordStrengthIndicator
          password={password}
          passwordStrength={passwordStrength}
        />

        <RememberPassword
          rememberPassword={rememberPassword}
          setRememberPassword={setRememberPassword}
        />

        <CustomButton
          variant="save"
          icon={
            isCreating ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save size={20} />
            )
          }
          className="w-full py-3 text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={!roomName || !password}
          type="submit"
        >
          {isCreating ? "Đang tạo phòng..." : "Tạo phòng"}
        </CustomButton>
      </form>
    </div>
  );
};
