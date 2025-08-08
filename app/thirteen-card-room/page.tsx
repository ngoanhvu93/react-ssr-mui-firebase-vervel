import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  collection,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
  addDoc,
  writeBatch,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";
import { db } from "firebase/firebase";
import type { Player, Room } from "firebase/types";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router";
import { RoomNotFound } from "./components/RoomNotFound";
import { NoPlayer } from "./components/NoPlayer";
import { QuickGuide } from "./components/QuickGuide";
import { PlayerInfomation } from "./components/PlayerInfomation";
import { GameRoundPointsPerGame } from "./components/GameRoundPointsPerGame";
import { GameRoundProgressive } from "./components/GameRoundProgressive";
import { BaseScoreDialog } from "./components/BaseScoreDialog";
import { SettingModal } from "./components/SettingModal";
import { ShareModal } from "./components/ShareModal";
import { ResetScoreDialog } from "./components/ResetScoreDialog";
import { ScoreSettingModal } from "./components/ScoreSettingModal";
import { NavbarBottom } from "./components/NavbarBottom";
import { AdvancedScoreDialog } from "./components/AdvancedScoreDialog";
import CustomLoading from "~/components/CustomLoading";
import EditPlayerDialog from "./components/EditPlayerDialog";
import { RoomIsCompleted } from "./components/RoomIsCompleted";
import { ConfirmCreateNewGameModal } from "./components/ConfirmCreateNewGameDialog";
import { cn } from "~/lib/utils";
import { RankingDialog } from "./components/RankingDialog";
import AddPlayerDialog from "./components/AddPlayerDialog";
import { TopAppBar } from "~/components/TopAppBar";
import IconButton from "@mui/material/IconButton";
import { HistoryIcon, Settings, Share } from "lucide-react";

export type GameRoundMode = "points-per-game" | "progressive" | "total";
export type ModalMode = "add" | "edit" | "bulk-add";

export default function ThirteenCardRoomPage() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const navigate = useNavigate();
  // Room states
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newRoomName, setNewRoomName] = useState(room?.name!);
  const [loadingForSetting, setLoadingForSetting] = useState(false);
  const [isEditingRoomName, setIsEditingRoomName] = useState(false);
  const [isEditingWinningScore, setIsEditingWinningScore] = useState(false);
  const [newWinningScore, setNewWinningScore] = useState(
    room?.winningScore || 0
  );

  // Player states
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [editNameError, setEditNameError] = useState<string | null>(null);
  const [winners, setWinners] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Modal states
  const [modalMode, setModalMode] = useState<ModalMode>("bulk-add");
  const [showModalAddPlayer, setShowModalAddPlayer] = useState(false);
  const [showModalEditPlayer, setShowModalEditPlayer] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isRankingDialogOpen, setIsRankingDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScoreSettingsOpen, setIsScoreSettingsOpen] = useState(false);
  const [isAdvancedScoringOpen, setIsAdvancedScoringOpen] = useState(false);
  const [isScoreSheetOpen, setIsScoreSheetOpen] = useState(false);
  const [hasShownEmptyRoomModal, setHasShownEmptyRoomModal] = useState(false);
  const [hasOpenedEmptyRoomModal, setHasOpenedEmptyRoomModal] = useState(false);
  const [showButtonRanking, setShowButtonRanking] = useState(false);
  const [isConfirmCreateNewGameOpen, setIsConfirmCreateNewGameOpen] =
    useState(false);

  // Score states
  const [scores, setScores] = useState<Record<string, number | boolean>>({});
  const [loadingTotalScore, setLoadingTotalScore] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [editedScores, setEditedScores] = useState<Record<string, number>>({});
  const [currentInput, setCurrentInput] = useState("");
  const [isSavingScores, setIsSavingScores] = useState(false);
  const [isSavingAdvancedScores, setIsSavingAdvancedScores] = useState(false);
  const [isSavingPlayers, setIsSavingPlayers] = useState(false);
  const [customScores, setCustomScores] = useState({
    whiteWin: 9,
    first: 3,
    second: 2,
    third: 1,
    fourth: 0,
  });

  // Display/UI states
  const [showScoreMode, setShowScoreMode] =
    useState<GameRoundMode>("points-per-game");
  const [showAvatars, setShowAvatars] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showAvatars");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [showRoundNumbers, setShowRoundNumbers] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showRoundNumbers");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [showWinningScore, setShowWinningScore] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("showWinningScore");
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  });

  // Avatar states
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatars, setSelectedAvatars] = useState<(File | null)[]>(
    Array(4).fill(null)
  );
  const [avatarPreviews, setAvatarPreviews] = useState<(string | null)[]>(
    Array(4).fill(null)
  );

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      toast.error("ID phòng không hợp lệ");
      navigate("/");
      return;
    }
  }, [id]);

  useEffect(() => {
    let unsubscribe: () => void;
    let isMounted = true;

    const setupRoomListener = async () => {
      if (!id) return;

      try {
        const roomQuery = query(collection(db, "rooms"), where("id", "==", id));
        unsubscribe = onSnapshot(
          roomQuery,
          // Thêm option để chỉ lắng nghe khi có thay đổi thực sự
          { includeMetadataChanges: false },
          (snapshot) => {
            if (!isMounted) return;

            if (snapshot.empty) {
              setRoom(null);
              setIsLoading(false);
              toast.error("Không tìm thấy phòng");
              navigate("/");
              return;
            }

            const roomDoc = snapshot.docs[0];
            const roomData = {
              ...roomDoc.data(),
              id: roomDoc.id,
              createdAt:
                roomDoc.data().createdAt?.toDate().toISOString() ||
                new Date().toISOString(),
              endTime: roomDoc.data().endTime?.toDate().toISOString() || null,
            } as Room;

            setRoom(roomData);
            setNewWinningScore(roomData.winningScore);
            setNewRoomName(roomData.name);
            setIsLoading(false);

            // Đồng bộ trạng thái dialog xếp hạng
            setIsRankingDialogOpen(!!roomData.isRankingDialogOpen);

            // Reset winners khi tất cả điểm số về 0
            const allScoresZero = roomData.players?.every(
              (player) => player.totalScore === 0 && player.scores.length === 0
            );
            if (allScoresZero) {
              setWinners([]);
            }

            // Kiểm tra người chơi đạt điểm chiến thắng
            if (roomData.winningScore && roomData.players?.length > 0) {
              const playersReachedGoal = roomData.players.filter(
                (p) => p.totalScore >= roomData.winningScore!
              );

              if (playersReachedGoal.length > 0 && !roomData.endTime) {
                const roomRef = doc(db, "rooms", roomDoc.id);
                updateDoc(roomRef, {
                  endTime: new Date(),
                });
              }

              if (playersReachedGoal.length > 0) {
                const sortedPlayers = [...roomData.players].sort(
                  (a, b) => b.totalScore - a.totalScore
                );
                setWinners(sortedPlayers);
                setIsRankingDialogOpen(true);
                setShowButtonRanking(true);
              } else {
                setShowButtonRanking(false);
              }
            }

            if (roomData.players?.length === 4) {
              setShowModalAddPlayer(false);
            }
          },
          (error) => {
            if (!isMounted) return;
            console.error("Error listening to room:", error);
            setIsLoading(false);
            toast.error("Không thể tải dữ liệu phòng. Vui lòng thử lại.");
            navigate("/");
          }
        );
      } catch (error) {
        if (!isMounted) return;
        console.error("Error setting up room listener:", error);
        setIsLoading(false);
        toast.error("Không thể tải dữ liệu phòng. Vui lòng thử lại.");
        navigate("/");
      }
    };

    setupRoomListener();

    // Cleanup function để hủy listener khi component unmount
    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [room]);

  useEffect(() => {
    if (
      room &&
      (!room.players || room.players.length === 0) &&
      !hasShownEmptyRoomModal
    ) {
      console.log("Room exists but has no players, opening add player modal");
      setModalMode("bulk-add");
      setShowModalAddPlayer(true);
      setPlayerNames(["", "", "", ""]);
      setHasShownEmptyRoomModal(true);
    }
  }, [room, hasShownEmptyRoomModal]);

  useEffect(() => {
    if (
      room &&
      Array.isArray(room.players) &&
      room.players.length === 0 &&
      !hasOpenedEmptyRoomModal
    ) {
      console.log("Room has empty players array, opening add player modal");
      setModalMode("bulk-add");
      setShowModalAddPlayer(true);
      setPlayerNames(["", "", "", ""]);
      setHasOpenedEmptyRoomModal(true);
    }
  }, [room, hasOpenedEmptyRoomModal]);

  // Reset flag khi component unmount hoặc khi id thay đổi
  useEffect(() => {
    return () => {
      setHasShownEmptyRoomModal(false);
    };
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "showWinningScore",
        JSON.stringify(showWinningScore)
      );
    }
  }, [showWinningScore]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const storage = getStorage();
    const avatarRef = ref(storage, `avatars/${crypto.randomUUID()}`);
    await uploadBytes(avatarRef, file);
    return getDownloadURL(avatarRef);
  };

  const checkEditNameDuplicate = (name: string) => {
    if (!room || !editingPlayer) return false;

    const isDuplicate = room.players.some(
      (player) =>
        player.id !== editingPlayer.id &&
        player.name.toLowerCase() === name.trim().toLowerCase()
    );

    setEditNameError(isDuplicate ? "Tên người chơi đã tồn tại" : null);
    return isDuplicate;
  };

  const handleEditPlayer = async (playerName: string) => {
    if (!room || !editingPlayer) return;
    setLoading(true);

    if (checkEditNameDuplicate(playerName)) {
      return;
    }
    const loadingToast = toast.loading("Đang cập nhật...");

    try {
      let avatarUrl = editingPlayer.avatar; // Keep existing avatar URL by default

      // Only upload new avatar if one was selected
      if (selectedAvatar) {
        avatarUrl = await uploadAvatar(selectedAvatar);
      }

      const updatedPlayers = room.players.map((player) =>
        player.id === editingPlayer.id
          ? {
              ...player,
              name: playerName.trim(),
              avatar: avatarUrl, // Update with new avatar URL or keep existing one
            }
          : player
      );

      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        players: updatedPlayers,
      });

      setRoom((prev) =>
        prev
          ? {
              ...prev,
              players: updatedPlayers,
            }
          : null
      );
      setEditingPlayer(null);
      setSelectedAvatar(null);
      setAvatarPreview(null);
      setLoading(false);
      toast.success("Đã cập nhật thông tin người chơi!", { id: loadingToast });
      setShowModalEditPlayer(false);
    } catch (error) {
      console.error("Error editing player:", error);
      toast.error("Không thể cập nhật. Vui lòng thử lại.", {
        id: loadingToast,
      });
    }
  };

  const handleBulkAddPlayers = async (data: { playerNames: string[] }) => {
    if (!room) {
      toast.error("Không thể tìm thấy phòng");
      return;
    }

    const validNames = data.playerNames.filter((name) => name.trim() !== "");

    if (validNames.length === 0) {
      toast.error("Vui lòng nhập ít nhất một tên người chơi");
      return;
    }

    const currentPlayerCount = room.players?.length || 0;
    if (currentPlayerCount + validNames.length > 4) {
      toast.error("Số lượng người chơi không được vượt quá 4");
      return;
    }

    // Check for duplicates before proceeding
    const hasDuplicates = validNames.some((name, index) =>
      isNameDuplicate(name, index)
    );

    if (hasDuplicates) {
      toast.error("Vui lòng sửa các tên trùng lặp trước khi tiếp tục");
      return;
    }

    const loadingToast = toast.loading("Đang thêm người chơi...");

    try {
      setIsSavingPlayers(true);
      const newPlayers: Player[] = await Promise.all(
        validNames.map(async (name, index) => {
          let avatarUrl = "";
          const selectedAvatar = selectedAvatars[index];

          if (selectedAvatar) {
            avatarUrl = await uploadAvatar(selectedAvatar);
          }

          return {
            id: crypto.randomUUID(),
            name: name.trim(),
            avatar: avatarUrl,
            scores: [],
            totalScore: 0,
          };
        })
      );

      const updatedPlayers = [...(room.players || []), ...newPlayers];

      const batch = writeBatch(db);
      const roomRef = doc(db, "rooms", room.id);

      // Gộp nhiều updates vào 1 batch
      batch.update(roomRef, {
        players: updatedPlayers,
        lastUpdated: new Date(),
      });

      await batch.commit();

      // Reset state
      setPlayerNames(["", "", "", ""]);
      setSelectedAvatars(Array(4).fill(null));
      setAvatarPreviews(Array(4).fill(null));
      setShowModalAddPlayer(false);
      toast.success("Đã thêm người chơi thành công!", { id: loadingToast });
    } catch (error) {
      console.error("Error adding players:", error);
      toast.error("Không thể thêm người chơi. Vui lòng thử lại.", {
        id: loadingToast,
      });
    } finally {
      setIsSavingPlayers(false);
    }
  };

  const handleBulkAvatarChange = (index: number, file: File) => {
    const newSelectedAvatars = [...selectedAvatars];
    newSelectedAvatars[index] = file;
    setSelectedAvatars(newSelectedAvatars);

    const newAvatarPreviews = [...avatarPreviews];
    newAvatarPreviews[index] = null;
    setAvatarPreviews(newAvatarPreviews);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatarPreviews = [...avatarPreviews];
      newAvatarPreviews[index] = reader.result as string;
      setAvatarPreviews(newAvatarPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitScores = async () => {
    setLoadingTotalScore(true);
    if (!room) return;

    // Lưu điểm của người chơi đang được chọn vào scores trước khi submit
    if (selectedPlayerId && currentInput) {
      const newScore = parseInt(currentInput) || 0;
      setScores((prev) => ({
        ...prev,
        [selectedPlayerId]: newScore,
      }));
    }

    setIsSavingScores(true);
    const loadingToast = toast.loading("Đang cập nhật điểm...");

    try {
      const updatedPlayers = room.players.map((player) => {
        const score = scores[player.id] || 0;
        return {
          ...player,
          scores: [...player.scores, score],
          totalScore: player.totalScore + (score as number),
        };
      });

      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        players: updatedPlayers,
      });

      setRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          players: updatedPlayers.map((player) => ({
            ...player,
            scores: player.scores.map((score) =>
              typeof score === "boolean" ? 0 : score
            ),
          })),
        };
      });

      checkWinners(
        updatedPlayers.map((player) => ({
          ...player,
          scores: player.scores.map((score) =>
            typeof score === "boolean" ? 0 : score
          ),
        }))
      );

      // Reset states
      setScores({});
      setCurrentInput("");
      setSelectedPlayerId(null);
      setIsScoreSheetOpen(false);
      toast.success("Đã cập nhật điểm thành công!", { id: loadingToast });

      scrollToBottom();
    } catch (error) {
      console.error("Error updating scores:", error);
      toast.error("Không thể cập nhật điểm. Vui lòng thử lại.", {
        id: loadingToast,
      });
    } finally {
      setIsSavingScores(false);
    }
  };

  const handleAddGameRoundClick = () => {
    if (!room?.players.length) {
      toast.error("Vui lòng thêm người chơi trước");
      return;
    }
    setEditingRound(null);
    setEditedScores({});
    setScores({});
    setCurrentInput("");
    setSelectedPlayerId(null);
    setIsScoreSheetOpen(true);

    setTimeout(() => {
      if (room.players[0]) {
        const firstPlayerId = room.players[0].id;
        setSelectedPlayerId(firstPlayerId);
        const currentScore = scores[firstPlayerId];
        setCurrentInput(currentScore?.toString() || "");

        const firstInput = document.querySelector(
          `[data-player-id="${firstPlayerId}"]`
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const handleEditRoundClick = (roundIndex: number) => {
    setScores({});
    setEditingRound(roundIndex);

    const roundScores = room?.players.reduce(
      (acc, player) => {
        acc[player.id] = player.scores[roundIndex];
        return acc;
      },
      {} as Record<string, number>
    );
    setEditedScores(roundScores || {});

    if (room?.players[0]) {
      const firstPlayerId = room.players[0].id;
      setSelectedPlayerId(firstPlayerId);
      setCurrentInput(roundScores?.[firstPlayerId]?.toString() || "");
    }

    setIsScoreSheetOpen(true);

    setTimeout(() => {
      if (room?.players[0]) {
        const firstInput = document.querySelector(
          `[data-player-id="${room.players[0].id}"]`
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
        }
      }
    }, 100);
  };

  const handleUpdateRoundScores = async () => {
    setLoadingTotalScore(true);
    if (!room || editingRound === null) return;

    if (selectedPlayerId && currentInput) {
      setEditedScores((prev) => ({
        ...prev,
        [selectedPlayerId]: parseInt(currentInput) || 0,
      }));
    }

    setIsSavingScores(true);
    const loadingToast = toast.loading("Đang cập nhật điểm...");

    try {
      const updatedPlayers = room.players.map((player) => {
        const newScore =
          selectedPlayerId === player.id
            ? parseInt(currentInput) || 0
            : (editedScores[player.id] ?? player.scores[editingRound]);
        const oldScore = player.scores[editingRound];

        const newScores = [...player.scores];
        newScores[editingRound] = newScore;

        return {
          ...player,
          scores: newScores,
          totalScore: player.totalScore - oldScore + newScore,
        };
      });

      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        players: updatedPlayers,
      });

      setRoom((prev) => (prev ? { ...prev, players: updatedPlayers } : null));

      setEditingRound(null);
      setEditedScores({});
      setIsScoreSheetOpen(false);
      toast.success("Đã cập nhật điểm thành công!", { id: loadingToast });
      scrollToBottom();
    } catch (error) {
      console.error("Error updating scores:", error);
      toast.error("Không thể cập nhật điểm. Vui lòng thử lại.", {
        id: loadingToast,
      });
    } finally {
      setIsSavingScores(false);
    }
  };

  const handleShareRoom = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Ghi điểm bài tiến lên",
          text: `Tham gia phòng chơi bài tiến lên với ${room?.players
            .map((p) => p.name)
            .join(", ")}`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleInputFocus = (playerId: string) => {
    if (selectedPlayerId && currentInput) {
      if (editingRound !== null) {
        setEditedScores((prev) => ({
          ...prev,
          [selectedPlayerId]: parseInt(currentInput) || 0,
        }));
      } else {
        setScores((prev) => ({
          ...prev,
          [selectedPlayerId]: parseInt(currentInput) || 0,
        }));
      }
    }

    setSelectedPlayerId(playerId);

    const existingScore =
      editingRound !== null ? editedScores[playerId] : scores[playerId];
    setCurrentInput(existingScore?.toString() || "");
  };

  const handleNumberInput = (num: string) => {
    if (selectedPlayerId) {
      setCurrentInput((prev) => {
        // Xử lý trường hợp số âm
        const isNegative = prev.startsWith("-");
        const currentNumber = isNegative ? prev.slice(1) : prev;
        const newValue = currentNumber === "0" ? num : currentNumber + num;

        // Gán đúng điểm cho Nhất/Nhì/Ba (Nhất: 3, Nhì: 2, Ba: 1)
        if (num === "Nhất") {
          setScores((prev) => ({
            ...prev,
            [selectedPlayerId]: 3,
          }));
          return "3";
        }
        if (num === "Nhì") {
          setScores((prev) => ({
            ...prev,
            [selectedPlayerId]: 2,
          }));
          return "2";
        }
        if (num === "Ba") {
          setScores((prev) => ({
            ...prev,
            [selectedPlayerId]: 1,
          }));
          return "1";
        }
        // Kiểm tra giới hạn số
        const numericValue = parseInt(newValue);
        if (numericValue > 999) return prev;

        // Thêm dấu âm nếu cần
        const finalValue = isNegative ? `-${newValue}` : newValue;

        // Cập nhật điểm tạm thời với giá trị đã bao gồm dấu
        setScores((prev) => ({
          ...prev,
          [selectedPlayerId]: parseInt(finalValue),
        }));

        return finalValue;
      });
    }
  };

  // Add this new function to check for duplicate ranks
  const isDuplicateRank = (
    playerId: string,
    rank: number,
    scores: Record<string, number | boolean>
  ) => {
    return Object.entries(scores).some(
      ([id, value]) => id !== playerId && value === rank
    );
  };

  const handleNegative = () => {
    if (!currentInput || !selectedPlayerId) return;

    const newValue = (parseInt(currentInput) * -1).toString();
    setCurrentInput(newValue);

    // Cập nhật scores với giá trị âm
    if (editingRound !== null) {
      setEditedScores((prev) => ({
        ...prev,
        [selectedPlayerId]: parseInt(newValue),
      }));
    } else {
      setScores((prev) => ({
        ...prev,
        [selectedPlayerId]: parseInt(newValue),
      }));
    }
  };

  const handleNext = () => {
    if (!selectedPlayerId || !room) return;

    // Lưu điểm của người chơi hiện tại vào scores
    const currentScore = parseInt(currentInput) || 0;
    setScores((prev) => ({
      ...prev,
      [selectedPlayerId]: currentScore,
    }));

    // Tìm người chơi tiếp theo
    const playerIds = room.players.map((p) => p.id);
    const currentIndex = playerIds.indexOf(selectedPlayerId);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    const nextPlayerId = playerIds[nextIndex];

    // Cập nhật UI cho người chơi tiếp theo
    setSelectedPlayerId(nextPlayerId);
    setCurrentInput(scores[nextPlayerId]?.toString() || "");

    // Focus vào input tiếp theo
    setTimeout(() => {
      const nextInput = document.querySelector(
        `[data-player-id="${nextPlayerId}"]`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }, 100);
  };

  const handlePrevious = () => {
    if (!selectedPlayerId || !room) return;

    // Lưu điểm của người chơi hiện tại vào scores
    const currentScore = parseInt(currentInput) || 0;
    setScores((prev) => ({
      ...prev,
      [selectedPlayerId]: currentScore,
    }));

    // Tìm người chơi trước đó
    const playerIds = room.players.map((p) => p.id);
    const currentIndex = playerIds.indexOf(selectedPlayerId);
    const prevIndex = (currentIndex - 1 + playerIds.length) % playerIds.length;
    const prevPlayerId = playerIds[prevIndex];

    // Cập nhật UI cho người chơi trước đó
    setSelectedPlayerId(prevPlayerId);
    setCurrentInput(scores[prevPlayerId]?.toString() || "");

    // Focus vào input trước đó
    setTimeout(() => {
      const prevInput = document.querySelector(
        `[data-player-id="${prevPlayerId}"]`
      ) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }, 100);
  };

  const handleClear = () => {
    if (selectedPlayerId) {
      setCurrentInput((prev) => {
        if (prev.length <= 1) return "0";
        return prev.slice(0, -1);
      });
    }
  };

  const checkForDuplicates = (names: string[]) => {
    const validNames = names.filter((name) => name.trim() !== "");
    const nameLookup = new Map<string, number>();

    setEditNameError(null);

    validNames.forEach((name, index) => {
      const lowerName = name.toLowerCase();
      if (nameLookup.has(lowerName)) {
        setEditNameError(`Tên "${name}" đã được sử dụng`);
      }
      nameLookup.set(lowerName, index);
    });

    if (room?.players) {
      room.players.forEach((player) => {
        const lowerName = player.name.toLowerCase();
        if (nameLookup.has(lowerName)) {
          setEditNameError(`Tên "${player.name}" đã tồn tại trong phòng`);
        }
      });
    }
  };

  const isNameDuplicate = (nameToCheck: string, index: number) => {
    if (!nameToCheck.trim()) return false;

    const lowerName = nameToCheck.toLowerCase();

    const existingNames = room?.players?.map((p) => p.name.toLowerCase()) || [];
    if (existingNames.includes(lowerName)) return true;

    return playerNames.some(
      (name, idx) =>
        idx !== index && name.trim() && name.toLowerCase() === lowerName
    );
  };

  const getDuplicateErrorMessage = (nameToCheck: string, index: number) => {
    if (!nameToCheck.trim()) return null;

    const lowerName = nameToCheck.toLowerCase();

    const existingNames = room?.players?.map((p) => p.name.toLowerCase()) || [];
    if (existingNames.includes(lowerName)) {
      return "Tên đã tồn tại trong phòng";
    }

    const duplicateIndex = playerNames.findIndex(
      (name, idx) =>
        idx !== index && name.trim() && name.toLowerCase() === lowerName
    );

    if (duplicateIndex >= 0) {
      return "Tên trùng lặp";
    }

    return null;
  };

  const handleResetScores = async () => {
    if (!room) return;

    const loadingToast = toast.loading("Đang xóa điểm...");

    try {
      const updatedPlayers = room.players.map((player) => ({
        ...player,
        scores: [],
        totalScore: 0,
      }));

      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        players: updatedPlayers,
        isRankingDialogOpen: false,
        endTime: null,
      });

      setRoom((prev) =>
        prev
          ? {
              ...prev,
              players: updatedPlayers,
              endTime: null,
            }
          : null
      );
      setWinners([]);
      setIsRankingDialogOpen(false);
      setIsResetDialogOpen(false);
      setShowButtonRanking(false);
      toast.success("Đã xóa tất cả các ván chơi!", { id: loadingToast });
    } catch (error) {
      console.error("Error resetting scores:", error);
      toast.error("Không thể xóa điểm. Vui lòng thử lại.", {
        id: loadingToast,
      });
    }
  };

  const showResetScoresButton =
    room?.players && room?.players.length > 0 && room?.players[0].scores
      ? room?.players[0].scores.length === 0 || room?.isCompleted
        ? false
        : true
      : false;

  const checkWinners = (players: Player[]) => {
    if (!room?.winningScore) return;

    // Sắp xếp người chơi theo tổng điểm từ cao xuống thấp
    const sortedPlayers = [...players].sort(
      (a, b) => b.totalScore - a.totalScore
    );

    // Kiểm tra người chơi đạt điểm chiến thắng
    const playersReachedGoal = sortedPlayers.filter(
      (p) => p.totalScore >= room.winningScore!
    );

    if (playersReachedGoal.length > 0) {
      setWinners(sortedPlayers); // Lưu danh sách đã sắp xếp
      setIsRankingDialogOpen(true);
      setShowButtonRanking(true);
    } else {
      setShowButtonRanking(false);
    }
  };

  const handleCompleteGame = async () => {
    if (!room) return;

    const loadingToast = toast.loading("Đang lưu ván chơi...");

    try {
      // Tạo bản ghi lịch sử trò chơi trong collection riêng
      const gameHistoryRef = collection(db, "gameHistories");
      await addDoc(gameHistoryRef, {
        id: crypto.randomUUID(),
        roomId: room.id,
        name: room.name,
        players: room.players.map((player) => ({
          id: player.id,
          name: player.name,
          avatar: player.avatar,
          scores: player.scores, // Lưu tất cả điểm số của từng ván
          totalScore: player.totalScore,
        })),
        endTime: room.endTime || new Date().toISOString(),
        winningScore: room.winningScore,
        createdAt: new Date(),
        winners: winners.map((player) => ({
          id: player.id,
          name: player.name,
          avatar: player.avatar,
          scores: player.scores,
          totalScore: player.totalScore,
        })),
        totalRounds: room.players[0]?.scores.length || 0,
      });

      // Cập nhật tài liệu phòng
      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        isCompleted: true,
        isRankingDialogOpen: false,
      });

      setIsRankingDialogOpen(false);
      setWinners([]);
      setShowButtonRanking(false);
      toast.success("Đã lưu ván chơi!", { id: loadingToast });
    } catch (error) {
      console.error("Error completing game:", error);
      toast.error("Không thể lưu ván chơi. Vui lòng thử lại.", {
        id: loadingToast,
      });
    }
  };

  const handleAdvancedScoreSubmit = useCallback(async () => {
    setLoadingTotalScore(true);
    if (!room) return;

    setIsSavingAdvancedScores(true);
    const loadingToast = toast.loading("Đang cập nhật điểm...");
    try {
      // Sao chép scores để tránh thay đổi trực tiếp state
      const newScores = { ...scores };

      // Đếm số người đã có thứ hạng
      const rankedPlayers = room.players.filter(
        (player) => newScores[player.id]
      );

      // Nếu đã có 3 người được gán thứ hạng, tự động gán cho người còn lại
      if (rankedPlayers.length === 3) {
        const remainingPlayer = room.players.find(
          (player) => !newScores[player.id]
        );

        if (remainingPlayer) {
          const usedRanks = rankedPlayers.map((p) => newScores[p.id]);
          const remainingRank = [1, 2, 3, 4].find(
            (rank) => !usedRanks.includes(rank)
          )!;
          newScores[remainingPlayer.id] = remainingRank;
        }
      }

      // Tính điểm cuối cùng dựa trên thứ hạng và trạng thái white win
      const finalScores = Object.fromEntries(
        room.players.map((player) => {
          const rank = newScores[player.id] || 4;
          const isWhiteWin = Boolean(newScores[`${player.id}_white`]);

          const score = isWhiteWin
            ? customScores.whiteWin
            : rank === 1
              ? customScores.first
              : rank === 2
                ? customScores.second
                : rank === 3
                  ? customScores.third
                  : customScores.fourth;

          return [player.id, score];
        })
      );

      // Cập nhật danh sách người chơi với điểm mới
      const updatedPlayers = room.players.map((player) => ({
        ...player,
        scores: [...player.scores, finalScores[player.id]],
        totalScore: player.totalScore + finalScores[player.id],
      }));

      // Cập nhật Firestore và UI
      await updateDoc(doc(db, "rooms", room.id), { players: updatedPlayers });
      setRoom((prev) => (prev ? { ...prev, players: updatedPlayers } : null));

      checkWinners(updatedPlayers);
      setIsAdvancedScoringOpen(false);
      setScores({});
      toast.success("Đã cập nhật điểm thành công!", { id: loadingToast });
      scrollToBottom();
    } catch (error) {
      console.error("Error saving advanced scores:", error);
      toast.error("Không thể cập nhật điểm. Vui lòng thử lại.", {
        id: loadingToast,
      });
    } finally {
      setIsSavingAdvancedScores(false);
    }
  }, [room, scores, customScores, setRoom, checkWinners]);

  const handleCreateNewGame = async () => {
    setIsConfirmCreateNewGameOpen(true);
  };

  const handleConfirmCreateNewGame = async () => {
    if (!room) return;

    const loadingToast = toast.loading("Đang tạo ván mới...");

    try {
      // Reset all players' scores
      const newPlayers = room.players.map((player) => ({
        ...player,
        scores: [],
        totalScore: 0,
      }));

      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        players: newPlayers,
        isCompleted: false,
        endTime: null,
        isRankingDialogOpen: false,
        createdAt: new Date(),
      });

      setIsRankingDialogOpen(false);
      setWinners([]);
      setShowButtonRanking(false);
      toast.success("Đã tạo ván mới!", { id: loadingToast });
    } catch (error) {
      console.error("Error creating new game:", error);
      toast.error("Không thể tạo ván mới. Vui lòng thử lại.", {
        id: loadingToast,
      });
    }
  };

  // Thêm hàm helper để lấy index của người chơi
  const getPlayerIndex = (playerId: string) => {
    if (!room?.players) return -1;
    return room.players.findIndex((player) => player.id === playerId);
  };

  // Hàm tính điểm dựa trên cài đặt tùy chỉnh
  const calculatePoints = (rank: number, isWhiteWin: boolean) => {
    if (isWhiteWin) return customScores.whiteWin;
    switch (rank) {
      case 1:
        return customScores.first;
      case 2:
        return customScores.second;
      case 3:
        return customScores.third;
      default:
        return customScores.fourth;
    }
  };

  // Thêm hàm reset về mặc định
  const resetDefaultScores = () => {
    setCustomScores({
      whiteWin: 9,
      first: 3,
      second: 2,
      third: 1,
      fourth: 0,
    });
    toast.success("Đã đặt lại điểm mặc định!");
  };

  // Thêm effect để lưu preferences
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("showAvatars", JSON.stringify(showAvatars));
    }
  }, [showAvatars]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "showRoundNumbers",
        JSON.stringify(showRoundNumbers)
      );
    }
  }, [showRoundNumbers]);

  useEffect(() => {
    if (
      room &&
      (!room.players || room.players.length === 0) &&
      room.players?.length < 4
    ) {
      setModalMode("bulk-add");
      setShowModalAddPlayer(true);
    }
  }, [room, modalMode]);

  // Thêm hàm handleRemoveAvatar vào trong component RoomDetailPage
  const handleRemoveAvatar = (index: number) => {
    const newAvatarPreviews = [...avatarPreviews];
    newAvatarPreviews[index] = null;
    setAvatarPreviews(newAvatarPreviews);

    const newAvatarFiles = [...selectedAvatars];
    newAvatarFiles[index] = null;
    setSelectedAvatars(newAvatarFiles);
  };
  useEffect(() => {
    if (loadingTotalScore) {
      setTimeout(() => {
        setLoadingTotalScore(false);
      }, 1000);
    }
  }, [loadingTotalScore]);

  const hasAnyWhiteWin = useMemo(
    () => Object.keys(scores).some((key) => key.endsWith("_white")),
    [scores]
  );

  const convertWinningScore = (winningScore: number) => {
    if (winningScore === 0) return "";
    return winningScore.toString() + " điểm";
  };

  // Save setting
  const handleSaveSetting = async () => {
    if (!room) return;
    try {
      setLoadingForSetting(true);
      const roomRef = doc(db, "rooms", room.id);
      await updateDoc(roomRef, {
        name: newRoomName,
        winningScore: newWinningScore,
      });
    } catch (error) {
      console.error("Error saving setting:", error);
      toast.error("Không thể cập nhật. Vui lòng thử lại.");
    } finally {
      setIsEditingRoomName(false);
      setIsEditingWinningScore(false);
      setLoadingForSetting(false);
    }
  };

  if (isLoading) {
    return <CustomLoading size={32} />;
  }

  if (!room) {
    return <RoomNotFound />;
  }

  if (room.players && room.players.length === 0) {
    return (
      <div className="w-full flex flex-col max-w-4xl mx-auto">
        <div className="grow overflow-y-auto h-full">
          <NoPlayer
            room={room}
            setModalMode={(mode) =>
              setModalMode(mode as "add" | "edit" | "bulk-add")
            }
            setShowModalAddPlayer={setShowModalAddPlayer}
          />
          {showModalAddPlayer && (
            <AddPlayerDialog
              room={room}
              setShowModalAddPlayer={setShowModalAddPlayer}
              playerNames={playerNames}
              setPlayerNames={setPlayerNames}
              handleBulkAddPlayers={(e) => {
                e.preventDefault();
                handleBulkAddPlayers({ playerNames: playerNames });
              }}
              handleBulkAvatarChange={handleBulkAvatarChange}
              handleRemoveAvatar={handleRemoveAvatar}
              getDuplicateErrorMessage={
                getDuplicateErrorMessage as (
                  name: string,
                  index: number
                ) => string
              }
              isNameDuplicate={isNameDuplicate}
              checkForDuplicates={checkForDuplicates}
              avatarPreviews={avatarPreviews as string[]}
              isSavingPlayers={isSavingPlayers}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col mx-auto max-w-4xl">
      <TopAppBar
        title={showWinningScore ? convertWinningScore(room.winningScore) : ""}
        onBack={() => {
          navigate(`/join-thirteen-card-room`);
        }}
        actionOne={
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderRadius: "100%",
            }}
            onClick={() => {
              navigate(`/thirteen-card-game-history/${room.id}`);
            }}
          >
            <HistoryIcon size={20} />
          </IconButton>
        }
        actionTwo={
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderRadius: "100%",
            }}
            onClick={() => handleShareRoom()}
          >
            <Share size={20} />
          </IconButton>
        }
        actionThree={
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderRadius: "100%",
            }}
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings size={20} />
          </IconButton>
        }
      >
        <PlayerInfomation
          room={room}
          showAvatars={showAvatars}
          setEditingPlayer={setEditingPlayer}
          setModalMode={(mode: string) =>
            setModalMode(mode as "add" | "edit" | "bulk-add")
          }
          setShowModalEditPlayer={setShowModalEditPlayer}
          setSelectedAvatar={(avatar: string | null) =>
            setSelectedAvatar(avatar as File | null)
          }
          setAvatarPreview={(avatar: string | null) =>
            setAvatarPreview(avatar || null)
          }
          setEditNameError={(error: string | null) =>
            setEditNameError(error || null)
          }
        />
      </TopAppBar>

      <div
        className={cn(
          "flex flex-col justify-center items-center w-full mx-auto pb-20"
        )}
      >
        <div className="overflow-y-auto overscroll-none w-full">
          <QuickGuide
            room={room}
            setIsAdvancedScoringOpen={setIsAdvancedScoringOpen}
            handleAddGameRoundClick={handleAddGameRoundClick}
          />
          <GameRoundPointsPerGame
            room={room}
            showScoreMode={showScoreMode}
            showRoundNumbers={showRoundNumbers}
            handleEditRoundClick={handleEditRoundClick}
          />
          <GameRoundProgressive
            room={room}
            showScoreMode={showScoreMode}
            showRoundNumbers={showRoundNumbers}
            handleEditRoundClick={handleEditRoundClick}
          />
          {room?.isCompleted && (
            <RoomIsCompleted
              endTime={room.endTime}
              setIsRankingDialogOpen={setIsRankingDialogOpen}
              handleCreateNewGame={handleCreateNewGame}
            />
          )}
        </div>
      </div>
      <NavbarBottom
        room={room}
        handleCreateNewGame={handleCreateNewGame}
        handleShareRoom={handleShareRoom}
        handleResetScores={() => setIsResetDialogOpen(true)}
        handleAddGameRoundClick={handleAddGameRoundClick}
        winners={winners.map((player) => player.id)}
        handleRankingDialogOpen={() => setIsRankingDialogOpen(true)}
        handleAdvancedScoringOpen={() => setIsAdvancedScoringOpen(true)}
        isResetDialogOpen={isResetDialogOpen}
        setIsResetDialogOpen={setIsResetDialogOpen}
        isRankingDialogOpen={isRankingDialogOpen}
        setIsRankingDialogOpen={setIsRankingDialogOpen}
        isAdvancedScoringOpen={isAdvancedScoringOpen}
        setIsAdvancedScoringOpen={setIsAdvancedScoringOpen}
        showResetScores={showResetScoresButton}
        showCreateNewGame={true}
        showAdvancedScoring={true}
        showRanking={true}
        showButtonRanking={showButtonRanking}
        isComplete={room?.isCompleted}
      />

      <>
        {showModalEditPlayer && (
          <EditPlayerDialog
            setShowModalEditPlayer={setShowModalEditPlayer}
            editingPlayer={editingPlayer as Player}
            setEditingPlayer={
              setEditingPlayer as (
                playerOrUpdater: Player | ((prev: Player) => Player | null)
              ) => void
            }
            handleEditPlayer={handleEditPlayer}
            getPlayerIndex={getPlayerIndex}
            avatarPreview={avatarPreview}
            setAvatarPreview={setAvatarPreview}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={
              setSelectedAvatar as (selectedAvatar: string | null) => void
            }
            editNameError={editNameError as string}
            setEditNameError={setEditNameError}
            handleAvatarChange={handleAvatarChange}
            checkEditNameDuplicate={checkEditNameDuplicate}
            modalMode={modalMode as ModalMode}
            setModalMode={(mode: ModalMode) =>
              setModalMode(mode as "add" | "edit" | "bulk-add")
            }
            isModalOpen={showModalEditPlayer}
            setIsModalOpen={setShowModalEditPlayer}
            room={room}
            loading={loading}
          />
        )}

        {/*Base  Score Modal */}
        <BaseScoreDialog
          isScoreSheetOpen={isScoreSheetOpen}
          setIsScoreSheetOpen={setIsScoreSheetOpen}
          editingRound={editingRound}
          room={room}
          selectedPlayerId={selectedPlayerId}
          setSelectedPlayerId={setSelectedPlayerId}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          handleInputFocus={handleInputFocus}
          handleNumberInput={handleNumberInput}
          handleNegative={handleNegative}
          handleClear={handleClear}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          handleUpdateRoundScores={handleUpdateRoundScores}
          handleSubmitScores={handleSubmitScores}
          isSavingScores={isSavingScores}
          scores={scores}
          editedScores={editedScores}
          setScores={setScores}
          loadingTotalScore={loadingTotalScore}
        />
        {/* Advanced Scoring Modal */}
        <AdvancedScoreDialog
          isAdvancedScoringOpen={isAdvancedScoringOpen}
          setIsAdvancedScoringOpen={setIsAdvancedScoringOpen}
          room={room}
          scores={scores}
          setScores={setScores}
          setIsScoreSettingsOpen={setIsScoreSettingsOpen}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          handleAdvancedScoreSubmit={handleAdvancedScoreSubmit}
          isSavingAdvancedScores={isSavingAdvancedScores}
          calculatePoints={calculatePoints}
          hasAnyWhiteWin={hasAnyWhiteWin}
          isDuplicateRank={isDuplicateRank}
          loadingTotalScore={loadingTotalScore}
        />

        {/* Settings Modal */}
        <SettingModal
          room={room}
          showScoreMode={showScoreMode}
          setShowScoreMode={setShowScoreMode}
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          showAvatars={showAvatars}
          setShowAvatars={setShowAvatars}
          showRoundNumbers={showRoundNumbers}
          setShowRoundNumbers={setShowRoundNumbers}
          showWinningScore={showWinningScore}
          setShowWinningScore={setShowWinningScore}
          newRoomName={newRoomName}
          setNewRoomName={setNewRoomName}
          isEditingRoomName={isEditingRoomName}
          setIsEditingRoomName={setIsEditingRoomName}
          loading={loadingForSetting}
          isEditingWinningScore={isEditingWinningScore}
          setIsEditingWinningScore={setIsEditingWinningScore}
          newWinningScore={newWinningScore}
          setNewWinningScore={setNewWinningScore}
          showSettingName={true}
          showSettingWinningScore={true}
          handleSaveSetting={handleSaveSetting}
        />

        {/* Share Modal */}
        <ShareModal
          isShareModalOpen={isShareModalOpen}
          setIsShareModalOpen={setIsShareModalOpen}
        />
        {/* ResetScoreModal */}
        <ResetScoreDialog
          isResetDialogOpen={isResetDialogOpen}
          setIsResetDialogOpen={setIsResetDialogOpen}
          handleResetScores={handleResetScores}
        />
        {/* Ranking Modal */}
        <RankingDialog
          isRankingDialogOpen={isRankingDialogOpen}
          setIsRankingDialogOpen={setIsRankingDialogOpen}
          room={room}
          handleCompleteGame={handleCompleteGame}
          handleCreateNewGame={handleCreateNewGame}
          setIsResetDialogOpen={setIsConfirmCreateNewGameOpen}
        />
        {/* Score Settings Modal */}
        <ScoreSettingModal
          isScoreSettingsOpen={isScoreSettingsOpen}
          setIsScoreSettingsOpen={setIsScoreSettingsOpen}
          customScores={customScores}
          setCustomScores={setCustomScores}
          resetDefaultScores={resetDefaultScores}
        />
        {/* Confirm Create New Game Modal */}
        <ConfirmCreateNewGameModal
          isConfirmCreateNewGameOpen={isConfirmCreateNewGameOpen}
          setIsConfirmCreateNewGameOpen={setIsConfirmCreateNewGameOpen}
          handleCreateNewGame={handleConfirmCreateNewGame}
        />
      </>
    </div>
  );
}
