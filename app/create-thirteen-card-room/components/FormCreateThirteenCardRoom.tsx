import { Loader, Plus } from "lucide-react";
import toast from "react-hot-toast";
import PasswordStrengthIndicator from "~/components/PasswordStrenthIndicator";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm, Controller } from "react-hook-form";

interface FormData {
  roomName: string;
  password: string;
  winningScore: string;
  unlimitedScore: boolean;
  rememberPassword: boolean;
}

export const FormCreateThirteenCardRoom = (props: {
  error: string;
  handleCreateRoom: (data: FormData) => void;
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
  unlimitedScore: boolean;
  setUnlimitedScore: (unlimitedScore: boolean) => void;
  winningScore: string;
  setWinningScore: (winningScore: string) => void;
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
    unlimitedScore,
    setUnlimitedScore,
    winningScore,
    setWinningScore,
  } = props;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      roomName: roomName,
      password: password,
      winningScore: winningScore,
      unlimitedScore: unlimitedScore,
      rememberPassword: rememberPassword,
    },
  });

  const watchedUnlimitedScore = watch("unlimitedScore");

  const onSubmit = (data: FormData) => {
    // Update parent state
    setRoomName(data.roomName);
    setWinningScore(data.winningScore);
    setUnlimitedScore(data.unlimitedScore);
    setRememberPassword(data.rememberPassword);

    // Call the original handler
    handleCreateRoom(data);
  };

  const handlePasswordChangeWithValidation = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handlePasswordChange(e);
    setValue("password", e.target.value);
  };

  const handleWinningScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) > 0 && parseInt(value) <= 1000)) {
      setWinningScore(value);
      setValue("winningScore", value);
    } else {
      toast.error("Số điểm phải từ 1 đến 1000");
    }
  };

  return (
    <div className="flex flex-col p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col gap-4 md:flex-row">
          <Controller
            name="roomName"
            control={control}
            rules={{
              required: "Tên phòng không được để trống",
              maxLength: {
                value: 30,
                message: "Tên phòng không được quá 30 ký tự",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Tên phòng"
                type="text"
                variant="outlined"
                required
                placeholder="Nhập tên phòng"
                error={!!errors.roomName}
                helperText={errors.roomName?.message}
                inputProps={{
                  maxLength: 50,
                }}
                onChange={(e) => {
                  field.onChange(e);
                  setRoomName(e.target.value);
                }}
              />
            )}
          />

          <FormControl variant="outlined" fullWidth error={!!errors.password}>
            <InputLabel htmlFor="outlined-adornment-password">
              Mật khẩu
            </InputLabel>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Mật khẩu không được để trống",
                maxLength: {
                  value: 20,
                  message: "Mật khẩu không được quá 20 ký tự",
                },
              }}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    handlePasswordChangeWithValidation(e);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                  placeholder="Nhập mật khẩu"
                />
              )}
            />
            {errors.password && (
              <FormHelperText error>{errors.password.message}</FormHelperText>
            )}
          </FormControl>
        </div>

        {/* Password strength indicator */}
        <PasswordStrengthIndicator
          password={password}
          passwordStrength={passwordStrength}
        />

        <Controller
          name="rememberPassword"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    setRememberPassword(e.target.checked);
                  }}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" fontWeight="semibold">
                  Ghi nhớ mật khẩu
                </Typography>
              }
            />
          )}
        />

        <Box>
          <Typography variant="body2" fontWeight="semibold">
            Chế độ chơi
          </Typography>

          <Controller
            name="unlimitedScore"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                value={field.value ? "unlimited" : "limited"}
                exclusive
                color="primary"
                onChange={(_, value) => {
                  if (value !== null) {
                    const isUnlimited = value === "unlimited";
                    field.onChange(isUnlimited);
                    setUnlimitedScore(isUnlimited);
                    // Clear winning score when switching to unlimited
                    if (isUnlimited) {
                      setValue("winningScore", "");
                      setWinningScore("");
                    }
                  }
                }}
                fullWidth
                sx={{ mt: 1 }}
              >
                <ToggleButton
                  value="unlimited"
                  sx={{ flex: 1, textTransform: "none" }}
                >
                  Tự do
                </ToggleButton>
                <ToggleButton
                  value="limited"
                  sx={{ flex: 1, textTransform: "none" }}
                >
                  Giới hạn điểm
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />

          {!watchedUnlimitedScore && (
            <Controller
              name="winningScore"
              control={control}
              rules={{
                required: "Số điểm không được để trống",
                validate: (value) => {
                  if (!value) return "Số điểm không được để trống";
                  const numScore = parseInt(value);
                  if (isNaN(numScore) || numScore <= 0) {
                    return "Số điểm phải là số nguyên dương";
                  }
                  if (numScore > 1000) {
                    return "Số điểm không được quá 1000";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Số điểm để chơi"
                  type="number"
                  inputMode="numeric"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    field.onChange(e);
                    handleWinningScoreChange(e);
                  }}
                  inputProps={{
                    min: 1,
                    max: 1000,
                  }}
                  placeholder="Nhập số điểm để chơi"
                  error={!!errors.winningScore}
                  helperText={errors.winningScore?.message}
                  required
                  sx={{ mt: 2 }}
                />
              )}
            />
          )}
        </Box>

        <div className="mt-4">
          <Button
            size="large"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={!isValid || isCreating}
          >
            {isCreating ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            Tạo phòng
          </Button>
        </div>
      </form>
    </div>
  );
};
