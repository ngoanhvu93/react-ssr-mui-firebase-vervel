import * as React from "react";
import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";

import { motion } from "framer-motion";
import {
  BookOpen,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Edit,
  EditIcon,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { TopAppBar } from "~/components/TopAppBar";
import { useNavigate } from "react-router";

interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed: Date | null;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  userId: string;
  createdAt: Date;
}

export default function FlashCardsVocablary() {
  const navigate = useNavigate();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyMode, setStudyMode] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
  });
  const [editCard, setEditCard] = useState({
    front: "",
    back: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
  });
  const [activeTab, setActiveTab] = useState("study");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          await loadUserCards(user.uid);
        } catch (error) {
          console.error("Failed to load user cards:", error);
          // Retry once after a short delay
          setTimeout(async () => {
            try {
              await loadUserCards(user.uid);
            } catch (retryError) {
              console.error("Retry failed:", retryError);
              toast.error("Không thể tải dữ liệu. Vui lòng tải lại trang.");
            }
          }, 2000);
        }
      } else {
        setCards([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user's cards from Firestore
  const loadUserCards = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.cards && Array.isArray(userData.cards)) {
          // Convert Firestore timestamps back to Date objects
          const cardsWithDates = userData.cards.map((card: any) => ({
            ...card,
            lastReviewed: card.lastReviewed
              ? card.lastReviewed.toDate
                ? card.lastReviewed.toDate()
                : new Date(card.lastReviewed)
              : null,
            createdAt: card.createdAt
              ? card.createdAt.toDate
                ? card.createdAt.toDate()
                : new Date(card.createdAt)
              : new Date(),
          }));
          setCards(cardsWithDates);
        } else {
          setCards([]);
        }
      } else {
        // Create user document if it doesn't exist
        try {
          await setDoc(userDocRef, {
            email: user?.email,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            cards: [],
            createdAt: new Date(),
          });
          setCards([]);
        } catch (createError) {
          console.error("Error creating user document:", createError);
          setError("Lỗi khi tạo tài khoản!");
          toast.error("Lỗi khi tạo tài khoản!");
        }
      }
    } catch (error) {
      console.error("Error loading cards:", error);
      setError("Lỗi khi tải dữ liệu! Vui lòng thử lại.");
      toast.error("Lỗi khi tải dữ liệu! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Save cards to Firestore
  const saveCardsToFirestore = async (updatedCards: FlashCard[]) => {
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          cards: updatedCards.map((card) => ({
            ...card,
            lastReviewed: card.lastReviewed,
            createdAt: card.createdAt,
          })),
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving cards:", error);
      toast.error("Lỗi khi lưu dữ liệu! Vui lòng thử lại.");
      throw error; // Re-throw để component có thể xử lý
    }
  };

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      const result = await signInWithPopup(auth, provider);
      toast.success("Đăng nhập thành công!");
    } catch (error: any) {
      console.error("Error signing in:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Đăng nhập bị hủy");
      } else if (error.code === "auth/popup-blocked") {
        toast.error(
          "Popup bị chặn. Vui lòng cho phép popup cho trang web này."
        );
      } else {
        toast.error("Lỗi đăng nhập: " + error.message);
      }
    }
  };

  const addCard = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    if (!newCard.front.trim() || !newCard.back.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const card: FlashCard = {
        id: Date.now().toString(),
        ...newCard,
        lastReviewed: null,
        reviewCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        userId: user.uid,
        createdAt: new Date(),
      };

      const updatedCards = [card, ...cards];
      setCards(updatedCards);
      await saveCardsToFirestore(updatedCards);

      setNewCard({ front: "", back: "", difficulty: "medium" });
      setShowAddCard(false);
      toast.success("Thêm thẻ thành công!");
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Lỗi khi thêm thẻ! Vui lòng thử lại.");
    }
  };

  const handleEditCard = async () => {
    if (!user || !editingCard) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    if (!editCard.front.trim() || !editCard.back.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const updatedCards = cards.map((card) =>
        card.id === editingCard.id
          ? {
              ...card,
              front: editCard.front,
              back: editCard.back,
              difficulty: editCard.difficulty,
            }
          : card
      );

      setCards(updatedCards);
      await saveCardsToFirestore(updatedCards);

      setEditCard({
        front: "",
        back: "",
        difficulty: "medium" as "easy" | "medium" | "hard",
      });
      setEditingCard(null);
      setShowEditCard(false);
      toast.success("Cập nhật thẻ thành công!");
    } catch (error) {
      console.error("Error editing card:", error);
      toast.error("Lỗi khi cập nhật thẻ! Vui lòng thử lại.");
    }
  };

  const openEditModal = (card: FlashCard) => {
    setEditingCard(card);
    setEditCard({
      front: card.front,
      back: card.back,
      difficulty: card.difficulty,
    });
    setShowEditCard(true);
  };

  const handleCardResponse = async (isCorrect: boolean) => {
    if (cards.length === 0 || currentCardIndex >= cards.length) {
      toast.error("Không có thẻ để học!");
      return;
    }

    try {
      const updatedCards = [...cards];
      const currentCard = updatedCards[currentCardIndex];

      currentCard.reviewCount++;
      if (isCorrect) {
        currentCard.correctCount++;
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("Chính xác! 🎉");
      } else {
        currentCard.incorrectCount++;
        toast.error("Sai rồi, hãy thử lại!");
      }

      currentCard.lastReviewed = new Date();
      setCards(updatedCards);
      await saveCardsToFirestore(updatedCards);

      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setIsFlipped(false);
      } else {
        setStudyMode(false);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        toast.success("Hoàn thành phiên học! 🎊");
      }
    } catch (error) {
      console.error("Error handling card response:", error);
      toast.error("Lỗi khi cập nhật kết quả! Vui lòng thử lại.");
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    try {
      const updatedCards = cards.filter((card) => card.id !== cardId);
      setCards(updatedCards);
      await saveCardsToFirestore(updatedCards);
      toast.success("Xóa thẻ thành công!");
    } catch (error) {
      console.error("Error deleting card:", error);
      toast.error("Lỗi khi xóa thẻ! Vui lòng thử lại.");
    }
  };

  const exportCards = () => {
    if (cards.length === 0) {
      toast.error("Không có thẻ để xuất!");
      return;
    }

    try {
      const dataStr = JSON.stringify(cards, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `flashcards-${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Xuất dữ liệu thành công!");
    } catch (error) {
      console.error("Error exporting cards:", error);
      toast.error("Lỗi khi xuất dữ liệu! Vui lòng thử lại.");
    }
  };

  const importCards = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedCards = JSON.parse(content);

        if (!Array.isArray(importedCards)) {
          toast.error("Định dạng file không hợp lệ!");
          return;
        }

        const newCards = importedCards.map((card) => ({
          ...card,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: user?.uid,
          createdAt: new Date(),
          lastReviewed: null,
          reviewCount: 0,
          correctCount: 0,
          incorrectCount: 0,
        }));

        const updatedCards = [...cards, ...newCards];
        setCards(updatedCards);
        await saveCardsToFirestore(updatedCards);
        toast.success(`Đã nhập ${newCards.length} thẻ thành công!`);
      } catch (error) {
        console.error("Error importing cards:", error);
        toast.error("Lỗi khi nhập dữ liệu! Vui lòng kiểm tra định dạng file.");
      }
    };

    reader.onerror = () => {
      toast.error("Lỗi khi đọc file! Vui lòng thử lại.");
    };

    reader.readAsText(file);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = {
    totalCards: cards.length,
    studiedToday: cards.filter(
      (card) =>
        card.lastReviewed &&
        new Date(card.lastReviewed).toDateString() === new Date().toDateString()
    ).length,
    correctRate:
      cards.length > 0
        ? Math.round(
            cards.reduce(
              (acc, card) =>
                acc + (card.correctCount / Math.max(card.reviewCount, 1)) * 100,
              0
            ) / cards.length
          )
        : 0,
    streak: 7,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="  rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Flash Cards Vocabulary
              </h1>
              <p className="text-gray-600 mb-6">
                Học từ vựng thông minh với flash cards
              </p>
              <div className="space-y-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Đăng nhập với Google</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lưu dữ liệu trên đám mây</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Đồng bộ trên mọi thiết bị</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Xuất/nhập dữ liệu</span>
                </div>
              </div>
              <button
                onClick={signInWithGoogle}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Đăng nhập với Google</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <TopAppBar title="Flash Cards" onBack={() => navigate(-1)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="  rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng thẻ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCards}
                </p>
              </div>
            </div>
          </div>

          <div className="  rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Học hôm nay</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.studiedToday}
                </p>
              </div>
            </div>
          </div>

          <div className="  rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ đúng</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.correctRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="  rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Chuỗi ngày</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.streak}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Custom Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Học tập" value="study" sx={{ fontWeight: "bold" }} />
          <Tab label="Quản lý thẻ" value="cards" sx={{ fontWeight: "bold" }} />
          <Tab label="Tiến độ" value="progress" sx={{ fontWeight: "bold" }} />
        </Tabs>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "study" && (
            <div>
              {cards.length === 0 ? (
                <div className="  rounded-lg shadow p-8 text-center">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có thẻ để học
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Hãy thêm một số thẻ từ vựng để bắt đầu học!
                  </p>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Thêm thẻ đầu tiên
                  </button>
                </div>
              ) : studyMode ? (
                <div className="flex flex-col items-center space-y-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">
                      Thẻ {currentCardIndex + 1} / {cards.length}
                    </p>
                    <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            ((currentCardIndex + 1) / cards.length) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <motion.div
                    key={currentCardIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                  >
                    <div
                      className="  rounded-lg shadow-lg p-8 text-center min-h-[200px] flex items-center justify-center cursor-pointer"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div className="w-full">
                        {!isFlipped ? (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {cards[currentCardIndex]?.front}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Nhấn để xem nghĩa
                            </p>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                              {cards[currentCardIndex]?.back}
                            </h3>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                cards[currentCardIndex]?.difficulty
                              )}`}
                            >
                              {cards[currentCardIndex]?.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleCardResponse(false)}
                      className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Sai
                    </button>
                    <button
                      onClick={() => handleCardResponse(true)}
                      className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Đúng
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="  rounded-lg shadow max-w-md mx-auto p-8">
                    <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sẵn sàng học chưa?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Có {cards.length} thẻ cần ôn tập
                    </p>
                    <button
                      onClick={() => setStudyMode(true)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Bắt đầu học
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "cards" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Quản lý thẻ từ vựng
                </h2>
                <div className="flex space-x-2">
                  <label className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importCards}
                      className="hidden"
                    />
                    Nhập dữ liệu
                  </label>
                  <button
                    onClick={exportCards}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Xuất dữ liệu
                  </button>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Thêm thẻ mới
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="  rounded-lg shadow h-full p-6 relative">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {card.front}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            card.difficulty
                          )}`}
                        >
                          {card.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {card.back}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>Ôn tập: {card.reviewCount}</span>
                        <span>Đúng: {card.correctCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          {card.createdAt
                            ? new Date(card.createdAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : ""}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(card)}
                            className="text-blue-600 hover:text-blue-800 text-sm hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCard(card.id)}
                            className="text-red-600 hover:text-red-800 text-sm hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            title="Xóa"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "progress" && (
            <div className="  rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Thống kê học tập
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tổng thẻ đã học</span>
                    <span className="text-sm text-gray-600">
                      {stats.totalCards}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tỷ lệ đúng</span>
                    <span className="text-sm text-gray-600">
                      {stats.correctRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${stats.correctRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Học hôm nay</span>
                    <span className="text-sm text-gray-600">
                      {stats.studiedToday} thẻ
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width: `${
                          stats.totalCards > 0
                            ? (stats.studiedToday / stats.totalCards) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Chuỗi ngày học</span>
                    <span className="text-sm text-gray-600">
                      {stats.streak} ngày
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(stats.streak / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {cards.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Thẻ gần đây
                    </h3>
                    <div className="space-y-2">
                      {cards.slice(0, 3).map((card) => (
                        <div
                          key={card.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700 truncate">
                            {card.front}
                          </span>
                          <span className="text-gray-500">
                            {card.createdAt
                              ? new Date(card.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add Card Modal */}
        <Dialog
          open={showAddCard}
          onClose={() => setShowAddCard(false)}
          scroll="paper"
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
          fullWidth
          closeAfterTransition
        >
          <DialogTitle id="customized-dialog-title">
            <div className="text-lg font-semibold">Thêm thẻ mới</div>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setShowAddCard(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <X />
          </IconButton>
          <DialogContent dividers={true}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <TextField
                variant="outlined"
                autoFocus
                required
                margin="dense"
                id="Từ vựng"
                name="Từ vựng"
                label="Từ vựng"
                type="text"
                fullWidth
                value={newCard.front}
                onChange={(e) =>
                  setNewCard({ ...newCard, front: e.target.value })
                }
              />
              <TextField
                required
                margin="dense"
                id="Nghĩa"
                name="Nghĩa tiếng Việt"
                label="Nghĩa tiếng Việt"
                type="text"
                fullWidth
                variant="outlined"
                value={newCard.back}
                onChange={(e) =>
                  setNewCard({ ...newCard, back: e.target.value })
                }
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <div className="flex space-x-4">
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <label
                      key={difficulty}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={difficulty}
                        checked={newCard.difficulty === difficulty}
                        onChange={(e) =>
                          setNewCard({
                            ...newCard,
                            difficulty: e.target.value as
                              | "easy"
                              | "medium"
                              | "hard",
                          })
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm capitalize">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              size="large"
              variant="outlined"
              onClick={() => setShowAddCard(false)}
            >
              Hủy
            </Button>
            <Button size="large" variant="contained" onClick={addCard}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Card Modal */}
        <Dialog
          open={showEditCard}
          onClose={() => setShowEditCard(false)}
          scroll="paper"
          aria-labelledby="edit-dialog-title"
          aria-describedby="edit-dialog-description"
          fullWidth
          closeAfterTransition
        >
          <DialogTitle id="edit-dialog-title">
            <div className="text-lg font-semibold">Chỉnh sửa thẻ</div>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setShowEditCard(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <X />
          </IconButton>
          <DialogContent dividers={true}>
            <DialogContentText id="edit-dialog-description" tabIndex={-1}>
              <TextField
                variant="outlined"
                autoFocus
                required
                margin="dense"
                id="edit-front"
                name="Từ vựng"
                label="Từ vựng"
                type="text"
                fullWidth
                value={editCard.front}
                onChange={(e) =>
                  setEditCard({ ...editCard, front: e.target.value })
                }
              />
              <TextField
                required
                margin="dense"
                id="edit-back"
                name="Nghĩa tiếng Việt"
                label="Nghĩa tiếng Việt"
                type="text"
                fullWidth
                variant="outlined"
                value={editCard.back}
                onChange={(e) =>
                  setEditCard({ ...editCard, back: e.target.value })
                }
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó
                </label>
                <div className="flex space-x-4">
                  {["easy", "medium", "hard"].map((difficulty) => (
                    <label
                      key={difficulty}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="edit-difficulty"
                        value={difficulty}
                        checked={editCard.difficulty === difficulty}
                        onChange={(e) =>
                          setEditCard({
                            ...editCard,
                            difficulty: e.target.value as
                              | "easy"
                              | "medium"
                              | "hard",
                          })
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm capitalize">{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              size="large"
              variant="outlined"
              onClick={() => setShowEditCard(false)}
            >
              Hủy
            </Button>
            <Button size="large" variant="contained" onClick={handleEditCard}>
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Fab
        className="fixed bottom-4 right-4 z-50 w-full"
        onClick={() => setShowAddCard(true)}
        color="secondary"
        aria-label="edit"
      >
        <EditIcon />
      </Fab>
    </div>
  );
}
