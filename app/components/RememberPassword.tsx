import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const RememberPassword = ({
  rememberPassword,
  setRememberPassword,
}: {
  rememberPassword: boolean;
  setRememberPassword: (rememberPassword: boolean) => void;
}) => {
  return (
    <div className="mt-2">
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberPassword}
            onChange={(e) => setRememberPassword(e.target.checked)}
            color="primary"
          />
        }
        label="Ghi nhớ mật khẩu"
      />
    </div>
  );
};

export default RememberPassword;
