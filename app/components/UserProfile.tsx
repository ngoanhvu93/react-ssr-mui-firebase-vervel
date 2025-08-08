import { useState, useEffect, useCallback } from "react";
import UserProfileSidebar from "./UserProfileSidebar";
import { auth } from "firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Avatar, IconButton } from "@mui/material";
import { Person } from "@mui/icons-material";
import AuthModal from "./AuthModal";
import type { User } from "firebase/auth";

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // If user just logged in and the auth modal is open, close it and show the profile
      if (currentUser && showAuthModal) {
        setShowAuthModal(false);
      }
    });

    return () => unsubscribe();
  }, [showAuthModal]);

  const handleCloseSidebar = useCallback(() => {
    setShowProfileSidebar(false);
  }, []);

  const handleUserClick = () => {
    setShowProfileSidebar(true);
  };

  return (
    <div className="w-full flex items-center justify-end">
      <div onClick={handleUserClick} className="cursor-pointer">
        {user ? (
          <>
            {user.photoURL ? (
              <Avatar
                src={user.photoURL}
                alt={user.displayName || ""}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : "U"}
              </Avatar>
            )}
          </>
        ) : (
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              width: 32,
              height: 32,
            }}
          >
            <Person />
          </IconButton>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} setIsOpen={setShowAuthModal} />

      <UserProfileSidebar
        isOpen={showProfileSidebar}
        onClose={handleCloseSidebar}
        user={user}
        setShowAuthModal={setShowAuthModal}
      />
    </div>
  );
};
