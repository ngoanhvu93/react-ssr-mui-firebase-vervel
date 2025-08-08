import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  Button,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Close,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { auth } from "firebase/firebase";

interface AuthDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  description?: string;
}

export default function AuthModal(props: AuthDialogProps) {
  const { isOpen, setIsOpen } = props;

  const handleGoogleSignIn = async () => {
    if (typeof window !== "undefined") {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast.success("Đăng nhập thành công!");
        setIsOpen(false);
      } catch (error: any) {
        toast.error("Đăng nhập thất bại: " + error.message);
      }
    } else {
      console.warn(
        "Attempted Google sign-in on server. This should not happen."
      );
    }
  };

  const handleFacebookSignIn = async () => {
    if (typeof window !== "undefined") {
      try {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider);
        toast.success("Đăng nhập thành công!");
        setIsOpen(false);
      } catch (error: any) {
        console.log(error.message);
        toast.error("Đăng nhập thất bại: " + error.message);
      }
    } else {
      console.warn(
        "Attempted Facebook sign-in on server. This should not happen."
      );
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="sm">
      <DialogTitle>
        <div className="font-bold">Đăng nhập</div>
      </DialogTitle>
      <IconButton
        onClick={() => setIsOpen(false)}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <div className="flex flex-col gap-4">
          {props.description && (
            <div className="text-xs text-center">{props.description}</div>
          )}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon />}
          >
            Đăng nhập với Google
          </Button>
          {/* Facebook Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleFacebookSignIn}
            startIcon={<FacebookIcon />}
            sx={{
              backgroundColor: "#1877f2",
              color: "white",
              borderColor: "#1877f2",
              "&:hover": {
                backgroundColor: "#166fe5",
                borderColor: "#166fe5",
              },
            }}
          >
            Đăng nhập với Facebook
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        {" "}
        <div className="flex flex-wrap justify-center items-center gap-2 w-full">
          {[
            "Điều khoản và điều kiện",
            "Chính sách bảo mật",
            "Quyền riêng tư",
            "Bảo mật",
            "Liên hệ",
          ].map((link) => (
            <Link
              key={link}
              href="#"
              sx={{
                color: "#58a6ff",
                textDecoration: "none",
                fontSize: "0.75rem",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {link}
            </Link>
          ))}
        </div>
      </DialogActions>
    </Dialog>
  );
}
