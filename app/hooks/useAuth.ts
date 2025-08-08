import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "firebase/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Đăng ký thành công!");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Đăng xuất thành công!");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Đăng xuất thất bại!");
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
