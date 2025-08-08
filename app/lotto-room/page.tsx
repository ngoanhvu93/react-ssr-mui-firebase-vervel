import { useState, useEffect, useRef, useMemo } from "react";
import type {
  LottoPlayer,
  WinningPlayer,
  ILottoRoom,
  User,
} from "firebase/types";
import {
  collection,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import CustomLoading from "~/components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getRandomTicketColor } from "./components/get-random-ticket-color";
import CallingButton from "./components/CallingButton";
import CalledNumbers from "./components/CalledNumbers";
import PlayerPendingNumbers from "./components/PlayerPendingNumbers";
import LottoLoading from "./components/LottoLoading";
import PlayersList from "./components/LottoPlayersList";
import FirstTicket from "./components/FirstTicket";
import SecondTicket from "./components/SecondTicket";
import ChangeTicket from "./components/ChangeTicket";
import CreatePlayerInfoModal from "./components/CreatePlayerInfoModal";
import UpdatePlayerInfoModal from "./components/UpdatePlayerInfoModal";
import ConfirmCreateTicket from "./components/ConfirmCreateTicket";
import ConfirmCreateTickets from "./components/ConfirmCreateTickets";
import PendingModal from "./components/PendingModal";
import PasswordModal from "./components/PasswordModal";
import NewGameDialog from "./components/NewGameDialog";
import CongratulationsDialog from "./components/CongratulationsDialog";
import LottoRoomInfomation from "./components/LottoRoomInfomation";
import MusicOnOff from "./components/SoundOnOff";
import {
  onValue,
  set,
  onDisconnect,
  serverTimestamp as rtdbServerTimestamp,
  getDatabase,
  ref,
} from "firebase/database";
import AppAlreadyOpen from "./components/AppAlreadyOpen";
import AuthModal from "~/components/AuthModal";
import { TopAppBar } from "~/components/TopAppBar";
import { Share2, Users } from "lucide-react";
import { Dialog, IconButton } from "@mui/material";
import ReviewResultsButton from "./components/ReviewResultsButton";
import CreateNewGameButton from "./components/CreateNewGameButton";
import { cn } from "~/utils/cn";
import Confetti from "react-confetti";

type ColumnIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type ColumnsType = {
  [K in ColumnIndex]: number[];
};

type TicketCell = {
  col: ColumnIndex;
  num: number;
};

// Add this shuffle function at the beginning of your component or outside as a utility
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const LottoRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lottoRoom, setLottoRoom] = useState<ILottoRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStartGame, setIsLoadingStartGame] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isPairMode, setIsPairMode] = useState<boolean>(false);
  const [secondTicket, setSecondTicket] = useState<(number | null)[][]>([]);
  const [showPairTicketModal, setShowPairTicketModal] =
    useState<boolean>(false);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [winningRows, setWinningRows] = useState<number[]>([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState<boolean>(false);
  const [winners, setWinners] = useState<WinningPlayer[] | null>(null);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [pendingRows, setPendingRows] = useState<number[]>([]);
  const [pendingNumbers, setPendingNumbers] = useState<
    Record<number, { marked: number[]; waiting: number }>
  >({});
  const [showPendingModal, setShowPendingModal] = useState<boolean>(false);
  const [shownPendingRows, setShownPendingRows] = useState<number[]>([]);
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState<boolean>(false);
  const [isCallingNumber, setIsCallingNumber] = useState<boolean>(false);
  const [showNewGameModal, setShowNewGameModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreatePlayerInfoModal, setShowCreatePlayerInfoModal] =
    useState(false);
  const [playerName, setPlayerName] = useState("");
  const [ticketChannel, setTicketChannel] = useState<BroadcastChannel | null>(
    null
  );
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [playerToRemove, setPlayerToRemove] = useState<string | null>(null);
  const [showUpdatePlayerInfoModal, setShowUpdatePlayerInfoModal] =
    useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<{
    id: string;
    name: string;
    avatar?: string;
  } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUpdatingPlayer, setIsUpdatingPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [showPendingPlayers, setShowPendingPlayers] = useState(true);
  const [ticketColor, setTicketColor] = useState<string>("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isAppAlreadyOpen, setIsAppAlreadyOpen] = useState(false);
  const tabControlChannel = useRef<BroadcastChannel | null>(null);
  const tabId = useRef<string>(crypto.randomUUID());
  const callerOfflineTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cập nhật useEffect để theo dõi trạng thái đăng nhập realtime
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Cập nhật trạng thái đăng nhập realtime
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [ticketChannel]);

  // Check if the lorttoRoom exists from the Firestore data
  const roomExists = useRef(false);

  useEffect(() => {
    if (lottoRoom?.id) {
      roomExists.current = true;
    }
  }, [lottoRoom]);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      toast.error("ID phòng không hợp lệ");
      navigate("/");
      return;
    }
  }, [id]);

  useEffect(() => {
    let unsubscribe = () => {};
    let roomStatusUnsubscribe = () => {};
    let isMounted = true;

    const setupRoomListener = async () => {
      try {
        // Single query to get room data
        const lottoRoomsRef = collection(db, "lotto-rooms");
        const lottoRoomQuery = query(lottoRoomsRef, where("id", "==", id));

        unsubscribe = onSnapshot(lottoRoomQuery, (snapshot) => {
          if (!isMounted) return;

          if (snapshot.empty) {
            setLottoRoom(null);
            setIsLoading(false);
            toast.error("Không tìm thấy phòng");
            navigate("/");
            return;
          }

          const lottoRoomDoc = snapshot.docs[0];
          const data = {
            ...lottoRoomDoc.data(),
            id: lottoRoomDoc.id,
            createdAt:
              lottoRoomDoc.data().createdAt?.toDate().toISOString() || null,
          } as ILottoRoom;

          // Set multiple states from a single listener response
          const lottoRoomData = data;
          setLottoRoom(lottoRoomData);
          setIsLoading(false);
          setIsCalling(lottoRoomData.isCalling === true);
          // Handle other state updates based on room data
          if (lottoRoomData.status === "waiting") {
            setWinners(lottoRoomData.winner || null);
            setShowCongratulationsModal(true);
            localStorage.removeItem("lottoSelectedNumbers");
            localStorage.removeItem("lottoPendingRows");
            localStorage.removeItem("lottoPendingNumbers");
            localStorage.removeItem("lottoShowPendingRows");
          }
        });
      } catch (error) {
        console.error("Error fetching lotto room:", error);
        setIsLoading(false);
      }
    };

    setupRoomListener();

    return () => {
      isMounted = false;
      unsubscribe();
      roomStatusUnsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (lottoRoom?.status === "waiting") {
      localStorage.removeItem("lottoSelectedNumbers");
      localStorage.removeItem("lottoPendingRows");
      localStorage.removeItem("lottoPendingNumbers");
      localStorage.removeItem("lottoShowPendingRows");
    }
  }, [lottoRoom?.status]);

  // Hàm tạo vé lô tô theo chuẩn 9 hàng x 9 cột
  const generateLotoTicket = () => {
    let validTicket = false;
    let finalTicket: (number | null)[][] = [];

    while (!validTicket) {
      const columns: ColumnsType = {
        0: Array.from({ length: 9 }, (_, i) => i + 1), // 1-9
        1: Array.from({ length: 10 }, (_, i) => i + 10), // 10-19
        2: Array.from({ length: 10 }, (_, i) => i + 20), // 20-29
        3: Array.from({ length: 10 }, (_, i) => i + 30), // 30-39
        4: Array.from({ length: 10 }, (_, i) => i + 40), // 40-49
        5: Array.from({ length: 10 }, (_, i) => i + 50), // 50-59
        6: Array.from({ length: 10 }, (_, i) => i + 60), // 60-69
        7: Array.from({ length: 10 }, (_, i) => i + 70), // 70-79
        8: Array.from({ length: 11 }, (_, i) => i + 80), // 80-90
      };

      // Trộn số trong từng cột để tạo sự ngẫu nhiên
      ([0, 1, 2, 3, 4, 5, 6, 7, 8] as const).forEach((key) => {
        columns[key] = shuffleArray(columns[key]);
      });

      // Mỗi hàng cần có 5 số
      const ticket: TicketCell[][] = Array(9)
        .fill([])
        .map(() => []);
      const usedColumnsPerRow = Array(9)
        .fill(null)
        .map(() => new Set<ColumnIndex>());
      let remainingNumbersPerRow = Array(9).fill(5);

      // Phân phối số cho mỗi hàng
      for (let row = 0; row < 9; row++) {
        let validDistribution = false;

        while (!validDistribution) {
          // Reset row data for retry
          ticket[row] = [];
          usedColumnsPerRow[row] = new Set<ColumnIndex>();
          remainingNumbersPerRow[row] = 5;

          // Try to distribute numbers
          while (remainingNumbersPerRow[row] > 0) {
            let col: ColumnIndex;
            do {
              col = Math.floor(Math.random() * 9) as ColumnIndex;
            } while (
              usedColumnsPerRow[row].has(col) ||
              columns[col].length === 0
            );

            const num = columns[col].shift()!;
            ticket[row].push({ col, num });
            usedColumnsPerRow[row].add(col);
            remainingNumbersPerRow[row]--;
          }

          // Check if the distribution is valid (no more than 3 consecutive empty cells)
          const rowPattern = Array(9).fill(false);
          ticket[row].forEach(({ col }) => (rowPattern[col] = true));

          // Check consecutive empty cells
          let maxConsecutiveEmpty = 0;
          let currentConsecutiveEmpty = 0;

          // Check consecutive filled cells (numbers)
          let maxConsecutiveNumbers = 0;
          let currentConsecutiveNumbers = 0;

          for (let i = 0; i < 9; i++) {
            if (!rowPattern[i]) {
              currentConsecutiveEmpty++;
              maxConsecutiveEmpty = Math.max(
                maxConsecutiveEmpty,
                currentConsecutiveEmpty
              );
              currentConsecutiveNumbers = 0;
            } else {
              currentConsecutiveNumbers++;
              maxConsecutiveNumbers = Math.max(
                maxConsecutiveNumbers,
                currentConsecutiveNumbers
              );
              currentConsecutiveEmpty = 0;
            }
          }

          validDistribution =
            maxConsecutiveEmpty <= 3 && maxConsecutiveNumbers <= 3;

          // If not valid, we need to return the numbers to their columns
          if (!validDistribution) {
            ticket[row].forEach(({ col, num }) => {
              columns[col].push(num);
            });
          }
        }
      }

      // Sắp xếp lại các số theo đúng thứ tự cột
      ticket.forEach((row) => row.sort((a, b) => a.col - b.col));

      // Định dạng lại thành bảng 9x9
      const formattedTicket = ticket.map((row) => {
        const formattedRow = Array(9).fill(null);
        row.forEach(({ col, num }) => (formattedRow[col] = num));
        return formattedRow;
      });

      // Kiểm tra các cột không có quá 4 ô trống liên tục
      let columnsValid = true;

      // Kiểm tra từng cột
      for (let col = 0; col < 9; col++) {
        let maxConsecutiveEmpty = 0;
        let currentConsecutiveEmpty = 0;

        let maxConsecutiveNonEmpty = 0;
        let currentConsecutiveNonEmpty = 0;

        // Count total numbers in this column
        let totalNumbersInColumn = 0;

        // Duyệt từng hàng trong cột
        for (let row = 0; row < 9; row++) {
          if (formattedTicket[row][col] === null) {
            currentConsecutiveEmpty++;
            maxConsecutiveEmpty = Math.max(
              maxConsecutiveEmpty,
              currentConsecutiveEmpty
            );
            currentConsecutiveNonEmpty = 0;
          } else {
            currentConsecutiveNonEmpty++;
            maxConsecutiveNonEmpty = Math.max(
              maxConsecutiveNonEmpty,
              currentConsecutiveNonEmpty
            );
            currentConsecutiveEmpty = 0;
            totalNumbersInColumn++;
          }
        }

        // Nếu có cột vi phạm điều kiện
        if (
          maxConsecutiveEmpty > 4 ||
          maxConsecutiveNonEmpty > 4 ||
          totalNumbersInColumn < 4 || // Ensure at least 4 numbers per column
          totalNumbersInColumn > 6 // NEW: Ensure at most 6 numbers per column
        ) {
          columnsValid = false;
          break;
        }
      }

      // Nếu tất cả cột đều hợp lệ
      if (columnsValid) {
        validTicket = true;
        finalTicket = formattedTicket;
      }
    }

    return finalTicket;
  };
  const [ticket, setTicket] =
    useState<(number | null)[][]>(generateLotoTicket());

  // Function to generate a pair of non-duplicating tickets
  const generateTicketPair = () => {
    // Generate first ticket
    const firstTicket = generateLotoTicket();

    // Get all numbers from first ticket (excluding nulls)
    const firstTicketNumbers = new Set<number>();
    firstTicket.forEach((row) => {
      row.forEach((num) => {
        if (num !== null) {
          firstTicketNumbers.add(num);
        }
      });
    });

    // Tạo một mảng chứa các số chưa được sử dụng (từ 1-90)
    const unusedNumbers: number[] = [];
    for (let i = 1; i <= 90; i++) {
      if (!firstTicketNumbers.has(i)) {
        unusedNumbers.push(i);
      }
    }

    // Tạo một cột cho vé thứ hai, không được sử dụng các số từ vé đầu tiên
    const createSecondTicketColumns = () => {
      const columns: ColumnsType = {
        0: [], // 1-9
        1: [], // 10-19
        2: [], // 20-29
        3: [], // 30-39
        4: [], // 40-49
        5: [], // 50-59
        6: [], // 60-69
        7: [], // 70-79
        8: [], // 80-90
      };

      // Phân loại các số chưa sử dụng vào các cột
      unusedNumbers.forEach((num) => {
        if (num >= 1 && num <= 9) columns[0].push(num);
        else if (num >= 10 && num <= 19) columns[1].push(num);
        else if (num >= 20 && num <= 29) columns[2].push(num);
        else if (num >= 30 && num <= 39) columns[3].push(num);
        else if (num >= 40 && num <= 49) columns[4].push(num);
        else if (num >= 50 && num <= 59) columns[5].push(num);
        else if (num >= 60 && num <= 69) columns[6].push(num);
        else if (num >= 70 && num <= 79) columns[7].push(num);
        else if (num >= 80 && num <= 90) columns[8].push(num);
      });

      // Trộn số trong từng cột để tạo sự ngẫu nhiên
      ([0, 1, 2, 3, 4, 5, 6, 7, 8] as const).forEach((key) => {
        columns[key] = shuffleArray(columns[key]);
      });

      return columns;
    };

    // Tạo vé thứ hai bằng cách sử dụng các số chưa được sử dụng
    const generateSecondTicket = () => {
      let validTicket = false;
      let finalTicket: (number | null)[][] = [];
      let maxAttempts = 1000; // Giới hạn số lần thử để tránh vòng lặp vô hạn
      let attempts = 0;

      while (!validTicket && attempts < maxAttempts) {
        attempts++;
        const columns = createSecondTicketColumns();

        // Mỗi hàng cần có 5 số
        const ticket: TicketCell[][] = Array(9)
          .fill([])
          .map(() => []);
        const usedColumnsPerRow = Array(9)
          .fill(null)
          .map(() => new Set<ColumnIndex>());
        let remainingNumbersPerRow = Array(9).fill(5);

        // Cố gắng phân phối số cho mỗi hàng
        let validDistribution = true;

        // Phân phối số cho mỗi hàng
        for (let row = 0; row < 9 && validDistribution; row++) {
          let rowValidDistribution = false;
          let rowAttempts = 0;
          const maxRowAttempts = 100;

          while (!rowValidDistribution && rowAttempts < maxRowAttempts) {
            rowAttempts++;

            // Reset row data for retry
            ticket[row] = [];
            usedColumnsPerRow[row] = new Set<ColumnIndex>();
            remainingNumbersPerRow[row] = 5;

            // Try to distribute numbers
            let canDistribute = true;
            while (remainingNumbersPerRow[row] > 0 && canDistribute) {
              // Tìm cột có số còn lại
              let availableColumns: ColumnIndex[] = [];
              for (let c = 0 as ColumnIndex; c <= 8; c++) {
                if (!usedColumnsPerRow[row].has(c) && columns[c].length > 0) {
                  availableColumns.push(c);
                }
              }

              if (availableColumns.length === 0) {
                canDistribute = false;
                break;
              }

              // Chọn ngẫu nhiên một cột có sẵn
              const randomIndex = Math.floor(
                Math.random() * availableColumns.length
              );
              const col = availableColumns[randomIndex];

              const num = columns[col].shift()!;
              ticket[row].push({ col, num });
              usedColumnsPerRow[row].add(col);
              remainingNumbersPerRow[row]--;
            }

            if (!canDistribute) {
              // Trả lại các số đã lấy vào columns
              ticket[row].forEach(({ col, num }) => {
                columns[col].push(num);
              });
              continue;
            }

            // Kiểm tra phân phối hợp lệ (không quá 3 ô trống liên tiếp và không quá 3 ô có số liên tiếp)
            const rowPattern = Array(9).fill(false);
            ticket[row].forEach(({ col }) => (rowPattern[col] = true));

            let maxConsecutiveEmpty = 0;
            let currentConsecutiveEmpty = 0;

            // Add check for consecutive numbers (not just empty cells)
            let maxConsecutiveNumbers = 0;
            let currentConsecutiveNumbers = 0;

            for (let i = 0; i < 9; i++) {
              if (!rowPattern[i]) {
                currentConsecutiveEmpty++;
                maxConsecutiveEmpty = Math.max(
                  maxConsecutiveEmpty,
                  currentConsecutiveEmpty
                );
                currentConsecutiveNumbers = 0;
              } else {
                currentConsecutiveNumbers++;
                maxConsecutiveNumbers = Math.max(
                  maxConsecutiveNumbers,
                  currentConsecutiveNumbers
                );
                currentConsecutiveEmpty = 0;
              }
            }

            rowValidDistribution =
              maxConsecutiveEmpty <= 3 && maxConsecutiveNumbers <= 3;

            if (!rowValidDistribution) {
              // Trả lại các số đã lấy
              ticket[row].forEach(({ col, num }) => {
                columns[col].push(num);
              });
            }
          }

          if (rowAttempts >= maxRowAttempts) {
            validDistribution = false;
            break;
          }
        }

        if (!validDistribution) {
          continue;
        }

        // Sắp xếp lại các số theo đúng thứ tự cột
        ticket.forEach((row) => row.sort((a, b) => a.col - b.col));

        // Định dạng lại thành bảng 9x9
        const formattedTicket = ticket.map((row) => {
          const formattedRow = Array(9).fill(null);
          row.forEach(({ col, num }) => (formattedRow[col] = num));
          return formattedRow;
        });

        // Kiểm tra các cột không có quá 4 ô trống liên tục
        let columnsValid = true;

        // Kiểm tra từng cột
        for (let col = 0; col < 9; col++) {
          let maxConsecutiveEmpty = 0;
          let currentConsecutiveEmpty = 0;

          let maxConsecutiveNonEmpty = 0;
          let currentConsecutiveNonEmpty = 0;

          // Count total numbers in this column
          let totalNumbersInColumn = 0;

          // Duyệt từng hàng trong cột
          for (let row = 0; row < 9; row++) {
            if (formattedTicket[row][col] === null) {
              currentConsecutiveEmpty++;
              maxConsecutiveEmpty = Math.max(
                maxConsecutiveEmpty,
                currentConsecutiveEmpty
              );
              currentConsecutiveNonEmpty = 0;
            } else {
              currentConsecutiveNonEmpty++;
              maxConsecutiveNonEmpty = Math.max(
                maxConsecutiveNonEmpty,
                currentConsecutiveNonEmpty
              );
              currentConsecutiveEmpty = 0;
              totalNumbersInColumn++;
            }
          }

          // Nếu có cột vi phạm điều kiện
          if (
            maxConsecutiveEmpty > 4 ||
            maxConsecutiveNonEmpty > 4 ||
            totalNumbersInColumn < 4 || // Ensure at least 4 numbers per column
            totalNumbersInColumn > 6 // NEW: Ensure at most 6 numbers per column
          ) {
            columnsValid = false;
            break;
          }
        }

        // Nếu tất cả cột đều hợp lệ
        if (columnsValid) {
          validTicket = true;
          finalTicket = formattedTicket;
        }
      }

      // Nếu không thể tạo được vé thứ hai sau nhiều lần thử,
      // chỉ đơn giản tạo một vé ngẫu nhiên mới
      if (!validTicket) {
        console.warn(
          "Không thể tạo vé thứ hai không trùng lặp. Tạo vé ngẫu nhiên mới."
        );
        return generateLotoTicket();
      }

      return finalTicket;
    };

    // Tạo vé thứ hai
    const secondTicket = generateSecondTicket();

    return { firstTicket, secondTicket };
  };

  // Modify createTicketPair to verify no duplicates with retry logic
  const createTicketPair = async () => {
    console.log("createTicketPair");
    let attempts = 0;
    const maxAttempts = 20; // Limit attempts to prevent infinite loops

    // Only generate a new color if we don't have one
    const newTicketColor = getRandomTicketColor();

    while (attempts < maxAttempts) {
      attempts++;
      const { firstTicket, secondTicket } = generateTicketPair();

      // Always verify there are no duplicate numbers between tickets
      const firstNumbers = new Set<number>();
      const secondNumbers = new Set<number>();

      firstTicket.forEach((row) =>
        row.forEach((num) => num !== null && firstNumbers.add(num))
      );
      secondTicket.forEach((row) =>
        row.forEach((num) => num !== null && secondNumbers.add(num))
      );

      // Check for duplicates
      const duplicates = [...firstNumbers].filter((num) =>
        secondNumbers.has(num)
      );

      if (duplicates.length === 0) {
        // Success! No duplicates found
        setTicket(firstTicket);
        setSecondTicket(secondTicket);
        setTicketColor(newTicketColor);
        setIsPairMode(true);
        setSelectedNumbers([]);
        setWinningRows([]);
        setLastCalledNumber(null);
        setShownPendingRows([]);

        // Save both tickets to localStorage
        localStorage.setItem(
          "lottoTickets",
          JSON.stringify({
            firstTicket,
            secondTicket,
            deviceId: getDeviceId(),
            ticketColor: newTicketColor,
          })
        );

        // Also save the color separately
        saveTicketColor(newTicketColor);

        // Clear selected numbers from localStorage
        localStorage.removeItem("lottoSelectedNumbers");

        setShowPairTicketModal(false);

        // Broadcast changes to other tabs
        ticketChannel?.postMessage({
          type: "TICKET_UPDATE",
          data: {
            firstTicket,
            secondTicket,
            deviceId: getDeviceId(),
            ticketColor: newTicketColor,
          },
        });

        return; // Exit function after success
      }

      // If we found duplicates, try again
      console.log(`Found ${duplicates.length} duplicate numbers, retrying...`);
    }

    // If we've tried too many times without success
    toast.error(
      "Không thể tạo cặp vé không trùng lặp sau nhiều lần thử. Vui lòng thử lại."
    );
  };

  // Modify resetGame to store deviceId
  const resetGame = () => {
    const newTicket = generateLotoTicket();
    const newTicketColor = getRandomTicketColor();
    setTicket(newTicket);
    setTicketColor(newTicketColor);
    setIsPairMode(false);
    setSelectedNumbers([]);
    setWinningRows([]);
    setLastCalledNumber(null);
    setShownPendingRows([]);

    const currentDeviceId = getDeviceId();
    // Lưu vé mới với deviceId và ticketColor
    const ticketData = {
      firstTicket: newTicket,
      secondTicket: [],
      deviceId: currentDeviceId,
      ticketColor: newTicketColor,
    };

    localStorage.setItem("lottoTickets", JSON.stringify(ticketData));
    saveTicketColor(newTicketColor); // Add this line to ensure color is saved separately too

    // Broadcast thay đổi đến các tab khác
    ticketChannel?.postMessage({
      type: "TICKET_UPDATE",
      data: ticketData,
    });

    // Xóa selected numbers khỏi localStorage
    localStorage.removeItem("lottoSelectedNumbers");
    localStorage.removeItem("lottoPendingRows");
    localStorage.removeItem("lottoPendingNumbers");
    localStorage.removeItem("lottoShowPendingRows");

    // Close modal after action
    setShowNewTicketModal(false);
    setPendingRows([]);
    setPendingNumbers({});
    setShowPendingModal(false);
  };

  // Thêm hàm lưu màu vé
  const saveTicketColor = (color: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ticketColor", color);
    }
  };

  // Thêm hàm lấy màu vé đã lưu
  const getSavedTicketColor = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("ticketColor");
    }
    return getRandomTicketColor();
  };

  // Cập nhật hàm loadSavedOrGenerateTicket để nạp cả màu vé
  const loadSavedOrGenerateTicket = () => {
    // Ưu tiên lấy từ localStorage.lottoTickets trước
    const savedTickets = localStorage.getItem("lottoTickets");
    if (savedTickets) {
      try {
        const parsedTickets = JSON.parse(savedTickets);
        setTicket(parsedTickets.firstTicket);

        // Chỉ đặt màu vé nếu có trong dữ liệu vé đã lưu
        if (parsedTickets.ticketColor) {
          setTicketColor(parsedTickets.ticketColor);
        } else {
          // If no color in saved tickets, check if we have a separate saved color
          const savedColor = getSavedTicketColor();
          if (savedColor) {
            setTicketColor(savedColor);
          } else {
            // Only generate a new color if absolutely no saved color exists
            const newColor = getRandomTicketColor();
            setTicketColor(newColor);
            saveTicketColor(newColor);
          }
        }

        if (
          parsedTickets.secondTicket &&
          parsedTickets.secondTicket.length > 0
        ) {
          setSecondTicket(parsedTickets.secondTicket);
          setIsPairMode(true);
        } else {
          setIsPairMode(false);
        }

        return true;
      } catch (error) {
        console.error("Lỗi khi phân tích vé đã lưu:", error);
      }
    }

    // Nếu không có vé đã lưu hoặc có lỗi, tạo vé mới
    // But first check if we have a saved color to use
    const savedColor = getSavedTicketColor();
    if (savedColor) {
      setTicketColor(savedColor);
    }
    // Then generate new tickets
    generateTicketPair();
    return false;
  };

  useEffect(() => {
    if (lottoRoom?.status === "ended") {
      setShowCongratulationsModal(true);
    }
  }, [lottoRoom]);

  // Load user preferences when component mounts
  useEffect(() => {
    if (!isBrowser) return;
    loadSavedOrGenerateTicket();
  }, []);

  // Modify checkWinningRows to prevent duplicate winners
  const checkWinningRows = (numbers: number[]) => {
    const currentWinningRows: number[] = [];
    const currentPendingRows: number[] = [];
    const currentPendingNumbers: Record<
      number,
      { marked: number[]; waiting: number }
    > = {};

    // Get the last called number
    const lastCalledNumber = lottoRoom?.lastCalledNumber;

    // Check each row of the first ticket
    ticket.forEach((row, rowIndex) => {
      const allRowNumbers = row.filter((num) => num !== null) as number[];
      const markedNumbers = allRowNumbers.filter((num) =>
        numbers.includes(num)
      );

      if (markedNumbers.length === 5) {
        // Check if the last called number is included in the winning numbers
        if (lastCalledNumber && markedNumbers.includes(lastCalledNumber)) {
          currentWinningRows.push(rowIndex);

          // Check if the player is already a winner
          const isAlreadyWinner = lottoRoom?.winner?.some(
            (winner) => winner.id === userId
          );

          if (!isAlreadyWinner && lottoRoom?.id) {
            updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
              status: "ended",
              winner: [
                ...(lottoRoom.winner || []).filter(
                  (winner) => winner.id !== userId
                ),
                {
                  id: userId,
                  name: playerName,
                  fiveWinNumbers: markedNumbers,
                },
              ],
            });
          }
        }
      } else if (markedNumbers.length === 4) {
        const waitingNumber = allRowNumbers.find(
          (num) => !numbers.includes(num)
        )!;
        currentPendingNumbers[rowIndex] = {
          marked: markedNumbers,
          waiting: waitingNumber,
        };
        currentPendingRows.push(rowIndex);
      }
    });

    // Kiểm tra vé thứ hai nếu đang ở chế độ pair mode
    if (isPairMode) {
      secondTicket.forEach((row, rowIndex) => {
        const allRowNumbers = row.filter((num) => num !== null) as number[];
        const markedNumbers = allRowNumbers.filter((num) =>
          numbers.includes(num)
        );

        if (markedNumbers.length === 5) {
          // Check if the last called number is included in the winning numbers
          if (lastCalledNumber && markedNumbers.includes(lastCalledNumber)) {
            const ticketRowIndex = rowIndex + 100;
            currentWinningRows.push(ticketRowIndex);
            // Change game status to "ended" and update Firestore
            if (lottoRoom?.id) {
              updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
                status: "ended",
                winner: [
                  ...(lottoRoom.winner || []).filter(
                    (winner) => winner.id !== userId
                  ),
                  {
                    id: userId,
                    name: playerName,
                    fiveWinNumbers: markedNumbers,
                  },
                ],
              });
            }
          }
        } else if (markedNumbers.length === 4) {
          // Chỉ kiểm tra khi có đúng 4 số
          const waitingNumber = allRowNumbers.find(
            (num) => !numbers.includes(num)
          )!;
          const ticketRowIndex = rowIndex + 100;
          currentPendingNumbers[ticketRowIndex] = {
            marked: markedNumbers,
            waiting: waitingNumber,
          };
          currentPendingRows.push(ticketRowIndex);
        }
      });
    }

    // Extract waiting numbers for broadcast to other players
    const waitingNumbers = currentPendingRows.map(
      (rowIndex) => currentPendingNumbers[rowIndex]?.waiting
    );

    // Update player's pending numbers in Firestore
    if (lottoRoom?.id) {
      updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
        players: (lottoRoom.players || []).map((player, index) => ({
          ...player,
          index,
          pendingNumbers:
            player.id === userId ? waitingNumbers : player.pendingNumbers || [],
        })),
      });
    }

    // Show congratulations modal if we have winning rows
    if (currentWinningRows.length > 0 && winningRows.length === 0) {
      setShowCongratulationsModal(true);
      setShowPendingModal(false);
    }
    // Show pending modal only for new pending rows that haven't been shown before
    else if (currentPendingRows.length > 0 && currentWinningRows.length === 0) {
      const newPendingRows = currentPendingRows.filter(
        (row) => !shownPendingRows.includes(row)
      );

      if (newPendingRows.length > 0) {
        setShowPendingModal(true);
        setShownPendingRows((prev) => [...prev, ...newPendingRows]);
      }
    } else {
      setShowPendingModal(false);
    }

    setWinningRows(currentWinningRows);
    setPendingRows(currentPendingRows);
    setPendingNumbers(currentPendingNumbers);
  };

  // Thêm hàm để lưu selected numbers vào localStorage
  const saveSelectedNumbers = (numbers: number[]) => {
    if (!isBrowser) return;
    localStorage.setItem("lottoSelectedNumbers", JSON.stringify(numbers));
  };

  // Sửa đổi handleNumberClick để lưu số được chọn
  const handleNumberClick = (num: number | null) => {
    if (!num) return;
    // Kiểm tra xem số đã được gọi chưa
    if (!lottoRoom?.calledNumbers?.includes(num)) {
      toast.error(`Số ${num} chưa được gọi!`);
      return;
    }

    // Chỉ thêm số mới nếu chưa được chọn
    if (!selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => {
        const newSelected = [...prev, num];
        localStorage.setItem(
          "lottoSelectedNumbers",
          JSON.stringify(newSelected)
        );
        saveSelectedNumbers(newSelected);
        localStorage.setItem("lottoPendingRows", JSON.stringify([]));
        localStorage.setItem("lottoPendingNumbers", JSON.stringify({}));
        localStorage.setItem("lottoShowPendingRows", JSON.stringify([]));
        checkWinningRows(newSelected);
        return newSelected;
      });
    }
  };

  // Sửa đổi useEffect để tải thông tin hàng chờ khi component mount
  useEffect(() => {
    if (!isBrowser) return;

    // Load saved tickets
    const savedTickets = localStorage.getItem("lottoTickets");
    if (savedTickets) {
      try {
        const parsedTickets = JSON.parse(savedTickets);
        setTicket(parsedTickets.firstTicket);

        // Load saved ticket color if available
        if (parsedTickets.ticketColor) {
          setTicketColor(parsedTickets.ticketColor);
        } else {
          setTicketColor(getRandomTicketColor());
        }

        if (
          parsedTickets.secondTicket &&
          parsedTickets.secondTicket.length > 0
        ) {
          setSecondTicket(parsedTickets.secondTicket);
          setIsPairMode(true);
        } else {
          setIsPairMode(false);
        }
      } catch (error) {
        console.error("Error loading saved tickets:", error);
      }
    }

    // Load saved selected numbers
    const savedNumbers = localStorage.getItem("lottoSelectedNumbers");
    if (savedNumbers) {
      try {
        const parsedNumbers = JSON.parse(savedNumbers);
        setSelectedNumbers(parsedNumbers);

        // Load saved pending information
        const savedPendingRows = localStorage.getItem("lottoPendingRows");
        const savedPendingNumbers = localStorage.getItem("lottoPendingNumbers");
        const savedShowPendingRows = localStorage.getItem(
          "lottoShowPendingRows"
        );

        if (savedPendingRows && savedPendingNumbers && savedShowPendingRows) {
          setPendingRows(JSON.parse(savedPendingRows));
          setPendingNumbers(JSON.parse(savedPendingNumbers));
          setShownPendingRows(JSON.parse(savedShowPendingRows));
        } else {
          // If pending info not found, recalculate
          checkWinningRows(parsedNumbers);
        }
      } catch (error) {
        console.error("Error loading saved game state:", error);
      }
    }
  }, []); // Chỉ chạy một lần khi component mount

  // Add this flag to track our own updates
  const userInitiatedUpdateRef = useRef(false);

  const callRandomNumber = async () => {
    // Set loading state
    setIsCallingNumber(true);

    // Set flag to indicate this is a user-initiated update
    userInitiatedUpdateRef.current = true;

    // Only try to update status if we confirmed the room exists
    if (id && roomExists.current && lottoRoom?.id) {
      try {
        const roomRef = doc(db, "lotto-rooms", lottoRoom.id);

        // Cập nhật trạng thái phòng và đánh dấu người hô số
        await updateDoc(roomRef, {
          status: "playing",
          lastUpdated: new Date(),
          isCalling: true,
          players: (lottoRoom.players || []).map((player) => ({
            ...player,
            isCallerNumber: player.id === userId,
          })),
        });
      } catch (error) {
        console.error("Error updating room status:", error);
      }
    }

    // Create an array of numbers from 1-90 that haven't been called yet
    const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1).filter(
      (num) => !lottoRoom?.calledNumbers?.includes(num)
    );

    // If all numbers have been called, show a warning
    if (availableNumbers.length === 0) {
      setIsCallingNumber(false);
      return;
    }

    // Shuffle the available numbers and pick the first one
    const shuffledNumbers = shuffleArray(availableNumbers);
    const finalNumber = shuffledNumbers[0];

    // Add random number animation effect
    let duration = 500; // 1 seconds
    let interval = 50; // Change number every 50ms
    let startTime = Date.now();

    const animateNumbers = () => {
      const elapsedTime = Date.now() - startTime;

      if (elapsedTime < duration) {
        // Generate a random number between 1 and 90
        const tempNumber = Math.floor(Math.random() * 90) + 1;
        setLastCalledNumber(tempNumber);

        // Schedule next animation frame
        setTimeout(animateNumbers, interval);
      } else {
        // Animation complete, show final number
        setLastCalledNumber(finalNumber);

        // Start the dropping animation

        // After the animation completes
        setTimeout(() => {
          // Update the lottoRoom document with the last called number
          if (lottoRoom?.id) {
            try {
              const lottoRoomRef = doc(db, "lotto-rooms", lottoRoom.id);
              updateDoc(lottoRoomRef, {
                lastCalledNumber: finalNumber,
                calledNumbers: [
                  ...(lottoRoom.calledNumbers || []),
                  finalNumber,
                ],
                isCalling: false,
                lastUpdated: new Date(),
              });
            } catch (error) {
              console.error("Error updating called number:", error);
            } finally {
              setTimeout(() => {
                userInitiatedUpdateRef.current = false;
              }, 500);
              setIsCallingNumber(false);
              setIsCalling(false);
            }
          } else {
            setIsCallingNumber(false);
            setIsCalling(false);
          }
        }, 500);
      }
    };

    // Start the animation
    animateNumbers();
  };

  // Add proper type for the ref
  const roomListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!id || !lottoRoom?.id) return;

    // Hủy listener cũ nếu có
    if (roomListenerRef.current) {
      roomListenerRef.current();
      roomListenerRef.current = null;
    }

    // Tạo listener mới
    const roomRef = doc(db, "lotto-rooms", lottoRoom.id);
    roomListenerRef.current = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        // Chỉ cập nhật state cần thiết để tránh re-render không cần thiết
        setIsCalling(data.isCalling === true);
      }
    });

    // Cleanup
    return () => {
      if (roomListenerRef.current) {
        roomListenerRef.current();
        roomListenerRef.current = null;
      }
    };
  }, [id, lottoRoom?.id]);

  // Sửa đổi useEffect theo dõi lottoRoom để loại bỏ đánh dấu tự động
  useEffect(() => {
    // Skip processing if this was triggered by our own update
    if (userInitiatedUpdateRef.current) {
      return;
    }

    if (
      lottoRoom &&
      lottoRoom.lastCalledNumber &&
      lastCalledNumber !== lottoRoom.lastCalledNumber
    ) {
      // Chỉ cập nhật số được gọi gần nhất
      setLastCalledNumber(lottoRoom.lastCalledNumber);
    }
  }, [lottoRoom]);

  // Sửa đổi createNewGame để xóa thông tin hàng chờ
  const createNewGame = async () => {
    if (lottoRoom?.id) {
      try {
        const batch = writeBatch(db);
        const lottoRoomRef = doc(db, "lotto-rooms", lottoRoom.id);

        batch.update(lottoRoomRef, {
          status: "waiting",
          calledNumbers: [],
          lastCalledNumber: null,
          lastUpdated: new Date(),
          isCalling: false,
          players: (lottoRoom.players || []).map((player) => ({
            ...player,
            fiveWinNumbers: [],
            isCallerNumber: false,
            pendingNumbers: [],
          })),
          winner: [],
        });
        await batch.commit();
      } catch (error) {
        console.error("Error creating new game:", error);
      }
    }
  };

  useEffect(() => {
    if (lottoRoom?.status === "waiting") {
      createNewGame();
    }
  }, [lottoRoom?.status]);

  useEffect(() => {
    if (lottoRoom?.id) {
      updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
        isCalling: false,
      });
    }
  }, [lottoRoom?.id]);

  // Add this helper function near the top of the file
  const isBrowser = typeof window !== "undefined";

  // Modify getDeviceId function
  const getDeviceId = () => {
    if (typeof window !== "undefined") {
      // Use Firebase Auth user.uid if available
      const currentUser = auth.currentUser;
      if (currentUser) {
        return currentUser.uid;
      }

      // Fallback to localStorage if user not authenticated yet
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = uuidv4();
        localStorage.setItem("deviceId", deviceId);
      }
      return deviceId;
    }
    return null;
  };

  // Sửa đổi useEffect để kiểm tra và load thông tin người dùng từ localStorage
  useEffect(() => {
    if (!isBrowser) return;

    // Kiểm tra thông tin người dùng trong localStorage
    const savedUserId = localStorage.getItem("lottoUserId");
    const savedPlayerName = localStorage.getItem("lottoPlayerName");
    const savedPlayerAvatar = localStorage.getItem("lottoPlayerAvatar");

    if (savedUserId && savedPlayerName) {
      // Nếu đã có thông tin, sử dụng lại
      setUserId(savedUserId);
      setPlayerName(savedPlayerName);
      if (savedPlayerAvatar) {
        setAvatarUrl(savedPlayerAvatar);
      }
      setShowCreatePlayerInfoModal(false);

      // Cập nhật thông tin người chơi vào room nếu cần
      if (lottoRoom?.id) {
        // Kiểm tra xem người chơi đã có trong phòng chưa
        const playerExists = lottoRoom.players?.some(
          (player) => player.id === savedUserId
        );

        if (!playerExists) {
          // Kiểm tra giới hạn số lượng người chơi (tối đa 10 người)
          const currentPlayerCount = lottoRoom.players?.length || 0;
          if (currentPlayerCount >= 10) {
            toast.error(
              "Phòng đã đạt tối đa 10 người chơi. Không thể tham gia phòng này!"
            );
            navigate("/");
            return;
          }

          updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
            players: [
              ...(lottoRoom.players || []),
              {
                id: savedUserId,
                name: savedPlayerName,
                avatar: savedPlayerAvatar || "",
                joinedAt: new Date(),
                fiveWinNumbers: [],
              },
            ],
          });
        }
      }
    } else {
      // Nếu chưa có thông tin, kiểm tra giới hạn người chơi trước khi hiển thị modal
      if (lottoRoom?.id) {
        const currentPlayerCount = lottoRoom.players?.length || 0;
        if (currentPlayerCount >= 10) {
          toast.error(
            "Phòng đã đạt tối đa 10 người chơi. Không thể tham gia phòng này!"
          );
          navigate("/");
          return;
        }
      }

      // Nếu chưa có thông tin, tạo mới
      const newUserId = crypto.randomUUID();
      setUserId(newUserId);
      setShowCreatePlayerInfoModal(true);
    }
  }, [lottoRoom?.id]);

  // Thêm useEffect để tự động đóng modal tạo người chơi khi phòng đã đầy
  useEffect(() => {
    if (
      lottoRoom &&
      (lottoRoom.players?.length || 0) >= 10 &&
      showCreatePlayerInfoModal
    ) {
      setShowCreatePlayerInfoModal(false);
      toast.error(
        "Phòng đã đạt tối đa 10 người chơi. Không thể thêm người chơi mới!"
      );
    }
  }, [lottoRoom?.players?.length, showCreatePlayerInfoModal]);

  // Sửa đổi hàm xử lý submit form
  const handleCreatePlayer = async (e: React.FormEvent) => {
    createTicketPair();
    setIsLoadingStartGame(true);
    e.preventDefault();
    if (!playerName.trim()) return;

    // Kiểm tra giới hạn số lượng người chơi (tối đa 10 người)
    const currentPlayerCount = lottoRoom?.players?.length || 0;
    if (currentPlayerCount >= 10) {
      toast.error(
        "Phòng đã đạt tối đa 10 người chơi. Không thể thêm người chơi mới!"
      );
      setIsLoadingStartGame(false);
      return;
    }

    // Kiểm tra tên trùng
    const existingNames =
      lottoRoom?.players?.map((player) => player.name.toLowerCase()) || [];
    if (existingNames.includes(playerName.toLowerCase())) {
      toast.error("Tên này đã được sử dụng. Vui lòng chọn tên khác!");
      setIsLoadingStartGame(false);
      return;
    }

    // Lưu thông tin vào localStorage
    localStorage.setItem("lottoUserId", userId!);
    localStorage.setItem("lottoPlayerName", playerName);
    localStorage.setItem("lottoPlayerAvatar", avatarUrl);

    // Cập nhật thông tin người chơi vào Firestore
    if (lottoRoom?.id) {
      await updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
        players: [
          ...(lottoRoom.players || []),
          {
            id: userId,
            name: playerName,
            avatar: avatarUrl,
            joinedAt: new Date(),
            fiveWinNumbers: [],
          },
        ],
      });
    }
    setIsLoadingStartGame(false);
    setShowCreatePlayerInfoModal(false);
  };

  // Thêm component hiển thị danh sách người chơi
  const removePlayer = async (playerId: string) => {
    if (!lottoRoom?.id) return;

    try {
      const roomRef = doc(db, "lotto-rooms", lottoRoom.id);
      await updateDoc(roomRef, {
        players: (lottoRoom.players || []).filter(
          (player) => player.id !== playerId
        ),
      });
      setShowUpdatePlayerInfoModal(false);
      toast.success("Người chơi đã được xoá khỏi phòng.");

      // Remove player info from localStorage if the removed player is the current user
      if (playerId === userId) {
        localStorage.removeItem("lottoUserId");
        localStorage.removeItem("lottoPlayerName");
        localStorage.removeItem("lottoPlayerAvatar");
      }
    } catch (error) {
      console.error("Error removing player:", error);
      toast.error("Không thể xoá người chơi. Vui lòng thử lại.");
    }
  };

  // Function to handle password submission
  const handlePasswordSubmit = () => {
    if (enteredPassword === lottoRoom?.password) {
      removePlayer(playerToRemove!);
      setShowPasswordModal(false);
      setEnteredPassword("");
      setPlayerToRemove(null);
    } else {
      toast.error("Mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  // Modify removePlayer to show password modal
  const promptRemovePlayer = (playerId: string) => {
    setPlayerToRemove(playerId);
    setShowPasswordModal(true);
  };

  const handlePlayerClick = (player: LottoPlayer) => {
    setNewPlayerName(player.name);
    setAvatarUrl(player?.avatar || "");
    setSelectedPlayer(player);
    setShowUpdatePlayerInfoModal(true);
  };

  // Thêm useEffect để theo dõi trạng thái phòng
  useEffect(() => {
    if (lottoRoom?.status === "waiting") {
      // Reset all marks and related states
      setSelectedNumbers([]);
      setWinningRows([]);
      setLastCalledNumber(null);
      setShownPendingRows([]);
      setPendingRows([]);
      setPendingNumbers({});
      setShowCongratulationsModal(false);
      setShowPendingModal(false);
    }
  }, [lottoRoom?.status]);

  // Thêm useEffect để lắng nghe thay đổi winner từ Firestore
  useEffect(() => {
    if (lottoRoom?.winner) {
      setWinners(lottoRoom.winner);
      setShowCongratulationsModal(true);
    }
  }, [lottoRoom?.winner]);

  // Khởi tạo BroadcastChannel khi component mount
  useEffect(() => {
    if (!isBrowser) return;

    const channel = new BroadcastChannel("lottoTicketSync");
    setTicketChannel(channel);

    // Lắng nghe sự kiện từ các tab khác
    channel.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === "TICKET_UPDATE" && data.deviceId === getDeviceId()) {
        // Cập nhật vé cho tab hiện tại
        setTicket(data.firstTicket);
        if (data.secondTicket && data.secondTicket.length > 0) {
          setSecondTicket(data.secondTicket);
          setIsPairMode(true);
        } else {
          setIsPairMode(false);
        }
        // Reset các state liên quan
        setSelectedNumbers([]);
        setWinningRows([]);
        setLastCalledNumber(null);
        setShownPendingRows([]);
        setPendingRows([]);
        setPendingNumbers({});
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Thêm hàm kiểm tra số trong vé
  const isNumberInTickets = useMemo(
    () =>
      (number: number): boolean => {
        // Kiểm tra trong vé đầu tiên
        const inFirstTicket = ticket.some((row) =>
          row.some((num) => num === number)
        );

        // Kiểm tra trong vé thứ hai nếu đang ở chế độ pair mode
        const inSecondTicket =
          isPairMode &&
          secondTicket.some((row) => row.some((num) => num === number));

        return inFirstTicket || inSecondTicket;
      },
    [ticket, secondTicket, isPairMode]
  );

  // Update player info
  const updatePlayerInfo = async () => {
    if (!selectedPlayer || !lottoRoom?.id) return;
    setIsUpdatingPlayer(true);

    try {
      // Input validation
      if (newPlayerName.trim().length === 0) {
        toast.error("Tên người chơi không được để trống.");
        setIsUpdatingPlayer(false);
        return;
      }

      // Name uniqueness check
      const existingNames =
        lottoRoom?.players?.map((player) => player.name.toLowerCase()) || [];

      if (
        existingNames.includes(newPlayerName.toLowerCase()) &&
        newPlayerName !== selectedPlayer.name
      ) {
        toast.error("Tên này đã được sử dụng. Vui lòng chọn tên khác!");
        setIsUpdatingPlayer(false);
        return;
      }

      // Create a batch for multiple operations
      const batch = writeBatch(db);
      const roomRef = doc(db, "lotto-rooms", lottoRoom.id);

      // Update player in the room document
      const updatedPlayers = (lottoRoom.players || []).map((player) =>
        player.id === selectedPlayer.id
          ? {
              ...player,
              name: newPlayerName,
              avatar: avatarUrl || "",
            }
          : player
      );

      batch.update(roomRef, { players: updatedPlayers });

      // Execute the batch
      await batch.commit();

      // Update localStorage if needed
      if (selectedPlayer.id === userId) {
        localStorage.setItem("lottoPlayerName", newPlayerName);
        localStorage.setItem("lottoPlayerAvatar", avatarUrl);
      }

      toast.success("Thông tin người chơi đã được cập nhật.");
      setIsUpdatingPlayer(false);
      setIsEditingName(false);
      setShowUpdatePlayerInfoModal(false);
    } catch (error) {
      console.error("Error updating player name:", error);
      toast.error("Không thể cập nhật thông tin người chơi. Vui lòng thử lại.");
      setIsUpdatingPlayer(false);
    }
  };

  const cellRefs = useRef<Map<number, HTMLTableCellElement>>(new Map());

  const smoothScroll = (target: HTMLTableCellElement) => {
    if (!target) return;
    const start = window.scrollY;
    const end =
      target.getBoundingClientRect().top +
      window.scrollY -
      window.innerHeight / 2 +
      target.offsetHeight / 2;
    const distance = Math.abs(end - start);

    // Tự động tính toán thời gian cuộn dựa trên khoảng cách
    const duration = Math.min(1000 + distance / 2, 2200); // Thời gian tối đa là 2,2 giây
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Sử dụng hàm easeInOut để tạo hiệu ứng mượt mà
      const easeInOut =
        progress < 0.5
          ? 2 * progress ** 2
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      window.scrollTo(0, start + (end - start) * easeInOut);

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Function to scroll to a specific number
  const scrollToNumber = (number: number) => {
    const cell = cellRefs.current.get(number);
    if (cell) {
      smoothScroll(cell);
    }
  };

  // Modify useEffect to scroll to the last called number
  useEffect(() => {
    if (lottoRoom?.lastCalledNumber) {
      scrollToNumber(lottoRoom.lastCalledNumber);
    }
  }, [lottoRoom?.lastCalledNumber]);

  // Add function to handle avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh hợp lệ");
        return;
      }

      try {
        setIsUploadingAvatar(true);
        const uniqueFileName = `avatars/${userId}-${Date.now()}-${file.name}`;
        const fileRef = storageRef(storage, uniqueFileName);

        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);
        setAvatarUrl(downloadUrl);
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Không thể tải lên ảnh đại diện. Vui lòng thử lại.");
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Update any locally stored tickets with the new deviceId
        const savedTickets = localStorage.getItem("lottoTickets");
        if (savedTickets) {
          try {
            const parsedTickets = JSON.parse(savedTickets);
            // Update deviceId to user.uid
            parsedTickets.deviceId = user.uid;
            localStorage.setItem("lottoTickets", JSON.stringify(parsedTickets));

            // Broadcast the updated deviceId to other tabs
            ticketChannel?.postMessage({
              type: "TICKET_UPDATE",
              data: parsedTickets,
            });
          } catch (error) {
            console.error("Error updating tickets with user.uid:", error);
          }
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [ticketChannel]);

  useEffect(() => {
    const audioInstance = new Audio("/asian-new-year-celebration.mp3");
    audioInstance.loop = true;
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        cancelAnimationFrame(animationRef.current as number);
      }
    };
  }, []);

  // Hàm để bật/tắt nhạc nền
  const toggleMusic = () => {
    if (!musicRef.current) {
      musicRef.current = new Audio("/asian-new-year-celebration.mp3");
      musicRef.current.loop = true;
    }

    if (isMusicPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play().catch((error) => {
        console.log("Music playback failed:", error);
      });
    }

    setIsMusicPlaying(!isMusicPlaying);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      if (lottoRoom?.id) {
        updateDoc(doc(db, "lotto-rooms", lottoRoom.id), {
          isCalling: false,
        });
      }
    });
  }

  useEffect(() => {
    if (!lottoRoom?.id || !userId || !playerName) return () => {};

    const database = getDatabase(
      undefined,
      import.meta.env.VITE_FIREBASE_DATABASE_URL
    );

    // Tham chiếu đến node của người chơi hiện tại
    const userStatusRef = ref(
      database,
      `rooms/${lottoRoom.id}/players/${userId}`
    );

    // Tham chiếu đến node chứa tất cả người chơi
    const playersRef = ref(database, `rooms/${lottoRoom.id}/players`);

    // Listener cho trạng thái kết nối
    const connectedRef = ref(database, ".info/connected");
    const connectedUnsub = onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }
      // Lưu thông tin người chơi và trạng thái online
      set(userStatusRef, {
        status: "online",
        name: playerName,
        avatar: avatarUrl || "",
        lastSeen: rtdbServerTimestamp(),
      });
    });

    // Khi người dùng ngắt kết nối, cập nhật trạng thái offline
    onDisconnect(userStatusRef).update({
      status: "offline",
      lastSeen: rtdbServerTimestamp(),
    });

    // Listener cho danh sách người chơi
    const playersUnsub = onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val() || {};
      const onlineUsers: { [key: string]: boolean } = {};

      // Lặp qua tất cả người chơi và kiểm tra trạng thái online
      Object.entries(playersData).forEach(
        ([playerId, playerData]: [string, any]) => {
          if (playerData.status === "online") {
            onlineUsers[playerId] = true;
          }
        }
      );

      setOnlineUsers(onlineUsers);
    });

    // Trả về hàm cleanup
    return () => {
      // Hủy các listeners
      connectedUnsub();
      playersUnsub();

      // Đánh dấu người dùng là offline khi rời đi
      set(userStatusRef, {
        status: "offline",
        name: playerName,
        avatar: avatarUrl,
        lastSeen: rtdbServerTimestamp(),
      });
    };
  }, [lottoRoom?.id, playerName, avatarUrl, userId, isLoggedIn]);

  // Thêm useEffect này để kiểm soát việc mở nhiều tab
  useEffect(() => {
    if (!isBrowser) return;

    // Tạo kênh BroadcastChannel riêng để kiểm soát tab
    const channel = new BroadcastChannel("lottoTabControl");
    tabControlChannel.current = channel;

    let isOriginalTab = true;
    let responseTimeout: NodeJS.Timeout;

    // Gửi thông báo khi tab mở
    const pingOtherTabs = () => {
      channel.postMessage({ type: "TAB_OPENED", tabId: tabId.current });

      // Thiết lập timeout để kiểm tra phản hồi
      responseTimeout = setTimeout(() => {
        // Nếu không có phản hồi sau 100ms, tab này là tab đầu tiên
        isOriginalTab = true;
      }, 100);
    };

    // Xử lý tin nhắn từ các tab khác
    channel.onmessage = (event) => {
      const { type, tabId: sourceTabId } = event.data;

      // Nếu nhận được thông báo tab mở, gửi phản hồi
      if (type === "TAB_OPENED") {
        // Nếu tab này đã mở trước đó, phản hồi để cho tab mới biết
        if (isOriginalTab && sourceTabId !== tabId.current) {
          channel.postMessage({
            type: "TAB_ALREADY_OPEN",
            tabId: tabId.current,
            targetTabId: sourceTabId,
          });
        }
      }

      // Nếu nhận được phản hồi rằng tab đã mở, đánh dấu tab này là trùng lặp
      else if (type === "TAB_ALREADY_OPEN" && sourceTabId !== tabId.current) {
        if (event.data.targetTabId === tabId.current) {
          clearTimeout(responseTimeout);
          isOriginalTab = false;
          setIsAppAlreadyOpen(true);

          // Hiển thị thông báo và có thể chuyển hướng
          toast.error(
            "Ứng dụng đã được mở trong tab khác. Vui lòng sử dụng tab đó."
          );

          // Tùy chọn: chuyển hướng người dùng hoặc vô hiệu hóa các chức năng
          // navigate("/already-open");
        }
      }

      // Nếu nhận được thông báo tab đóng, kiểm tra nếu đây là tab vừa đóng
      else if (type === "TAB_CLOSED") {
        // Có thể xử lý nếu cần
      }
    };

    // Ping các tab khác khi tab này mở
    pingOtherTabs();

    // Dọn dẹp khi component unmount hoặc tab đóng
    return () => {
      // Thông báo cho các tab khác khi tab này đóng
      channel.postMessage({ type: "TAB_CLOSED", tabId: tabId.current });
      channel.close();
    };
  }, []);

  // Add new useEffect to monitor caller status
  useEffect(() => {
    if (!lottoRoom?.id || !lottoRoom?.players?.length) return;

    const players = lottoRoom.players as LottoPlayer[];

    // Find the current caller
    const currentCaller = players.find((player) => player.isCallerNumber);
    if (!currentCaller) return;

    // Check if caller is offline
    const isCallerOnline = onlineUsers[currentCaller.id];

    if (!isCallerOnline) {
      // If caller is offline and we haven't started the timeout yet
      if (!callerOfflineTimeoutRef.current) {
        callerOfflineTimeoutRef.current = setTimeout(async () => {
          // After 10 seconds, check if caller is still offline
          if (!onlineUsers[currentCaller.id]) {
            // Find first online player who isn't the current caller
            const newCaller = players.find(
              (player) =>
                player.id !== currentCaller.id && onlineUsers[player.id]
            );

            if (newCaller) {
              try {
                const roomRef = doc(db, "lotto-rooms", lottoRoom.id);
                await updateDoc(roomRef, {
                  players: players.map((player) => ({
                    ...player,
                    isCallerNumber: player.id === newCaller.id,
                  })),
                });
                toast.success(
                  `Quyền gọi số đã được chuyển cho ${newCaller.name}`
                );
              } catch (error) {
                console.error("Error transferring caller rights:", error);
              }
            }
          }
          // Clear the timeout
          callerOfflineTimeoutRef.current = null;
        }, 10000); // 10 seconds
      }
    } else {
      // If caller is back online, clear any existing timeout
      if (callerOfflineTimeoutRef.current) {
        clearTimeout(callerOfflineTimeoutRef.current);
        callerOfflineTimeoutRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (callerOfflineTimeoutRef.current) {
        clearTimeout(callerOfflineTimeoutRef.current);
        callerOfflineTimeoutRef.current = null;
      }
    };
  }, [lottoRoom, onlineUsers]);

  if (isLoading) {
    return <CustomLoading size={32} />;
  }

  // Thêm render condition kiểm tra xem có phải tab trùng lặp không
  if (isAppAlreadyOpen) {
    return <AppAlreadyOpen onClose={() => navigate("/")} />;
  }

  // Component wrapper để hiển thị PlayersList với realtime updates
  const PlayersListWrapper = () => {
    // Force re-render khi isLoggedIn thay đổi
    const [, forceUpdate] = useState({});

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
        forceUpdate({}); // Force re-render
      });

      return unsubscribe;
    }, []);

    if (!isLoggedIn) {
      return (
        <div
          onClick={() => setShowLoginModal(true)}
          className="w-full mb-4 p-2 bg-yellow-50 border border-yellow-300 rounded-lg cursor-pointer"
        >
          <div className="flex items-center gap-2 text-yellow-700">
            <span className="text-sm font-medium text-center w-full">
              ⚠️ Bạn cần đăng nhập để xem danh sách người chơi
            </span>
          </div>
        </div>
      );
    }

    return (
      <PlayersList
        lottoRoom={lottoRoom as ILottoRoom}
        onlineUsers={onlineUsers}
        handlePlayerClick={handlePlayerClick}
      />
    );
  };

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        title={
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Lô tô</span>
            <span
              className={cn(
                "text-xs flex items-center gap-1",
                (lottoRoom?.players?.length || 0) >= 10
                  ? "text-red-600"
                  : "text-green-600"
              )}
            >
              <Users size={16} />
              {lottoRoom?.players?.length || 0}/{10}
            </span>
          </div>
        }
        onBack={() => navigate("/")}
        actionOne={
          <ReviewResultsButton
            lottoRoom={lottoRoom as ILottoRoom}
            setShowCongratulationsModal={setShowCongratulationsModal}
          />
        }
        actionTwo={
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderRadius: "100%",
            }}
            onClick={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator
                  .share({
                    title: "Lô Tô",
                    text: "Tham gia phòng Lô Tô cùng mình nhé!",
                    url: url,
                  })
                  .catch((error) => {
                    console.error("Error sharing:", error);
                    navigator.clipboard.writeText(url);
                    toast.success("Đã sao chép đường dẫn vào bộ nhớ tạm!");
                  });
              } else {
                navigator.clipboard.writeText(url);
                toast.success("Đã sao chép đường dẫn vào bộ nhớ tạm!");
              }
            }}
          >
            <Share2 className="size-5" />
          </IconButton>
        }
        actionThree={
          <MusicOnOff
            lottoRoom={lottoRoom as ILottoRoom}
            isPlaying={isMusicPlaying}
            togglePlay={toggleMusic}
          />
        }
      >
        {lottoRoom?.status === "playing" && (
          <div className="flex items-center justify-start w-full gap-2">
            <LottoRoomInfomation lottoRoom={lottoRoom as ILottoRoom} />
            <CalledNumbers
              lottoRoom={lottoRoom as ILottoRoom}
              lastCalledNumber={lottoRoom?.lastCalledNumber || 0}
            />
          </div>
        )}

        <ChangeTicket
          lottoRoom={lottoRoom as ILottoRoom}
          setShowNewTicketModal={setShowNewTicketModal}
          setShowPairTicketModal={setShowPairTicketModal}
        />

        <PlayerPendingNumbers
          lottoRoom={lottoRoom as ILottoRoom}
          showPendingPlayers={showPendingPlayers}
          setShowPendingPlayers={setShowPendingPlayers}
        />
      </TopAppBar>
      <PlayersListWrapper />
      <div className="flex flex-col items-center p-1 w-full mx-auto max-w-md">
        {(isCalling || isCallingNumber) && <LottoLoading />}
        <div className="flex flex-col items-center mx-auto w-full overflow-x-auto">
          <FirstTicket
            ticket={ticket as number[][]}
            winningRows={winningRows}
            handleNumberClick={handleNumberClick}
            selectedNumbers={selectedNumbers}
            ticketColor={ticketColor}
            lastCalledNumber={lottoRoom?.lastCalledNumber || 0}
            cellRefs={cellRefs}
            calledNumbers={lottoRoom?.calledNumbers || []}
          />
          {isPairMode && (
            <SecondTicket
              secondTicket={secondTicket as number[][]}
              winningRows={winningRows}
              handleNumberClick={handleNumberClick}
              selectedNumbers={selectedNumbers}
              ticketColor={ticketColor}
              lastCalledNumber={lottoRoom?.lastCalledNumber || 0}
              cellRefs={cellRefs}
              calledNumbers={lottoRoom?.calledNumbers || []}
            />
          )}
        </div>
      </div>
      {/* Modal tạo thông tin người chơi */}
      {showCreatePlayerInfoModal &&
        lottoRoom &&
        (lottoRoom.players?.length || 0) < 10 && (
          <CreatePlayerInfoModal
            lottoRoom={lottoRoom as ILottoRoom}
            showEnterNameModal={showCreatePlayerInfoModal}
            setShowEnterNameModal={setShowCreatePlayerInfoModal}
            playerName={playerName}
            setPlayerName={setPlayerName}
            avatarUrl={avatarUrl}
            handleAvatarChange={handleAvatarChange}
            handleCreatePlayer={handleCreatePlayer}
            isUploadingAvatar={isUploadingAvatar}
            isLoading={isLoadingStartGame}
            setAvatarUrl={setAvatarUrl}
          />
        )}
      {/* Modal cập nhật thông tin người chơi */}
      {showUpdatePlayerInfoModal && (
        <UpdatePlayerInfoModal
          showUpdatePlayerInfoModal={showUpdatePlayerInfoModal}
          selectedPlayer={selectedPlayer as LottoPlayer}
          setSelectedPlayer={setSelectedPlayer}
          setShowUpdatePlayerInfoModal={setShowUpdatePlayerInfoModal}
          setIsEditingName={setIsEditingName}
          isEditingName={isEditingName}
          newPlayerName={newPlayerName}
          setNewPlayerName={setNewPlayerName}
          isUpdatingPlayer={isUpdatingPlayer}
          updatePlayerInfo={updatePlayerInfo}
          userId={userId || ""}
          lottoRoom={lottoRoom as ILottoRoom}
          handleAvatarChange={handleAvatarChange}
          setAvatarUrl={setAvatarUrl}
          promptRemovePlayer={promptRemovePlayer}
          avatarUrl={avatarUrl}
          isUploadingAvatar={isUploadingAvatar}
        />
      )}
      {/* Modal xác nhận tạo một vé mới */}
      {showNewTicketModal && (
        <ConfirmCreateTicket
          showNewTicketModal={showNewTicketModal}
          setShowNewTicketModal={setShowNewTicketModal}
          resetGame={resetGame}
        />
      )}
      {/* Modal xác nhận tạo hai vé */}
      {showPairTicketModal && (
        <ConfirmCreateTickets
          showPairTicketModal={showPairTicketModal}
          setShowPairTicketModal={setShowPairTicketModal}
          createTicketPair={createTicketPair}
        />
      )}
      {/* Modal chờ số cuối */}
      {showPendingModal && (
        <PendingModal
          showPendingModal={showPendingModal}
          setShowPendingModal={setShowPendingModal}
          pendingRows={pendingRows}
          pendingNumbers={pendingNumbers as unknown as { waiting: number }[]}
        />
      )}

      {/* Modal xác nhận mật khẩu */}
      {showPasswordModal && (
        <PasswordModal
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={setShowPasswordModal}
          enteredPassword={enteredPassword}
          setEnteredPassword={setEnteredPassword}
          handlePasswordSubmit={handlePasswordSubmit}
        />
      )}
      {/* Modal xác nhận tạo ván mới trong vòng chơi */}
      {showNewGameModal && (
        <NewGameDialog
          showNewGameModal={showNewGameModal}
          setShowNewGameModal={setShowNewGameModal}
          createNewGame={createNewGame}
        />
      )}

      {/* Modal xác nhận kết thúc ván chơi */}
      {showCongratulationsModal && lottoRoom?.status === "ended" && (
        <CongratulationsDialog
          showCongratulationsModal={showCongratulationsModal}
          setShowCongratulationsModal={setShowCongratulationsModal}
          winners={winners || []}
          lottoRoom={lottoRoom}
          lastCalledNumber={lottoRoom?.lastCalledNumber || 0}
        />
      )}

      {/* Add LoginModal */}
      <AuthModal
        isOpen={showLoginModal}
        setIsOpen={setShowLoginModal}
        description="Vui lòng đăng nhập để sử dụng tính năng này"
      />

      <CallingButton
        lottoRoom={lottoRoom as ILottoRoom}
        isCalling={isCalling}
        isCallingNumber={isCallingNumber}
        setIsCalling={setIsCalling}
        callRandomNumber={callRandomNumber}
        userId={userId || ""}
        isNumberInTickets={isNumberInTickets}
        selectedNumbers={selectedNumbers}
      />
      <CreateNewGameButton
        lottoRoom={lottoRoom as ILottoRoom}
        setShowNewGameModal={setShowNewGameModal}
      />
    </div>
  );
};
{
}

export default LottoRoom;
