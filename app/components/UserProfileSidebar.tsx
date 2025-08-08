import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import CreditCard from "@mui/icons-material/CreditCard";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Notifications from "@mui/icons-material/Notifications";
import Security from "@mui/icons-material/Security";
import Help from "@mui/icons-material/Help";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { signOut, type User } from "firebase/auth";
import { useEffect } from "react";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ThemeModeSelector from "./ThemeModeSelector";
import { auth } from "firebase/firebase";
import toast from "react-hot-toast";

const UserProfileSidebar = ({
  isOpen,
  onClose,
  user,
  setShowAuthModal,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setShowAuthModal: (show: boolean) => void;
}) => {
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", handleEscapeKey);
      }
    };
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onClose();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      toast.error("Lỗi đăng xuất");
    }
  };

  // Menu items for App Store-like interface
  const menuItems = [
    {
      icon: <ShoppingBag sx={{ color: "#3B82F6" }} />,
      title: "Ứng dụng đã mua",
      description: "Xem và quản lý ứng dụng đã mua",
      action: () => {
        toast.error("Vui lòng đăng nhập để sử dụng chức năng này");
      },
    },
    {
      icon: <CreditCard sx={{ color: "#10B981" }} />,
      title: "Đăng ký & nạp tiền",
      description: "Quản lý đăng ký và phương thức thanh toán",
      action: () => {},
    },
    {
      icon: <CardGiftcard sx={{ color: "#8B5CF6" }} />,
      title: "Phiếu quà tặng",
      description: "Đổi hoặc mua phiếu quà tặng",
      action: () => {},
    },
    {
      icon: <Notifications sx={{ color: "#F59E0B" }} />,
      title: "Thông báo",
      description: "Tùy chỉnh cài đặt thông báo",
      action: () => {},
    },
    {
      icon: <Security sx={{ color: "#EF4444" }} />,
      title: "Bảo mật",
      description: "Quản lý quyền riêng tư và bảo mật",
      action: () => {},
    },
    {
      icon: <Help sx={{ color: "#F97316" }} />,
      title: "Hỗ trợ",
      description: "Nhận trợ giúp và liên hệ với chúng tôi",
      action: () => {},
    },
    {
      icon: <Settings sx={{ color: "#6B7280" }} />,
      title: "Cài đặt",
      description: "Tùy chỉnh ứng dụng theo ý bạn",
      action: () => {},
    },
  ];

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          minWidth: { xs: "100%", sm: 360 },
          width: { xs: "100%", sm: 360 },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="flex items-center justify-between w-full px-4 py-1">
          <Box sx={{ flexShrink: 0 }}>
            {user?.photoURL ? (
              <div className="flex items-center gap-4">
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={user.photoURL || ""}
                  alt={user.displayName || "User"}
                />
                <span className="font-semibold">{user.displayName}</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <IconButton
                  onClick={() => {
                    setShowAuthModal(true);
                  }}
                  size="small"
                  sx={{
                    border: "1px solid",
                    width: 32,
                    height: 32,
                  }}
                >
                  <Person />
                </IconButton>
              </div>
            )}
          </Box>
          <Button
            sx={{
              textTransform: "none",
            }}
            onClick={onClose}
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Đóng
          </Button>
        </div>
        <Divider />

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!user && (
            <>
              <div className="flex flex-col items-start p-4 gap-1">
                <span className="text-sm font-semibold">
                  Tài khoản App Việt
                </span>
                <span className="text-xs">
                  Đăng nhập để trải nghiệm nhiều tính năng hơn
                </span>
                <Button
                  fullWidth
                  onClick={() => {
                    setShowAuthModal(true);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Đăng nhập
                </Button>
              </div>
              <Divider />
            </>
          )}

          <ThemeModeSelector />
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={item.action}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box sx={{ width: 40, height: 40 }}>{item.icon}</Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                  />
                  <ChevronRight />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
        {/* Footer with sign out button */}
        <div className="flex justify-between items-center px-4 p-2">
          {user && (
            <Button
              sx={{
                textTransform: "none",
              }}
              onClick={handleSignOut}
              startIcon={<Logout />}
            >
              Đăng xuất
            </Button>
          )}
          <div className="flex-1" />
          <Button
            sx={{
              textTransform: "none",
            }}
            onClick={onClose}
            endIcon={<KeyboardDoubleArrowRightIcon />}
          >
            Đóng
          </Button>
        </div>
      </Box>
    </Drawer>
  );
};

export default UserProfileSidebar;
