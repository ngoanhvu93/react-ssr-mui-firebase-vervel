import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  onSnapshot,
  updateDoc,
  addDoc,
  orderBy,
  limit,
  setDoc,
} from "firebase/firestore";
import { db } from "firebase/firebase";
import { auth } from "firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import type { Tournament, Match, Team } from "firebase/types";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { Check, Loader, RefreshCcw, Lock, Unlock } from "lucide-react";
import PlayerAvatar from "~/components/PlayerAvatar";
import { disableBodyScroll, enableBodyScroll } from "~/utils/modal-utils";
import TeamList from "./components/TeamList";
import NumberOfRounds from "./components/NumberOfRounds";
import { v4 as uuidv4 } from "uuid";
import { TopAppBar } from "~/components/TopAppBar";
import AuthModal from "~/components/AuthModal";
import ResetModal from "./components/ResetModal";
import AddTeamModal from "./components/AddTeamModal";
import StandingsModal from "./components/StandingsModal";
import TeamAddLockConfirmationModal from "./components/TeamAddLockConfirmationModal";
import LockPasswordModal from "./components/LockPasswordModal";
import SeasonHistoryModal from "./components/SeasonHistoryModal";
import HeadToHeadHistory from "./components/HeadToHeadHistory";
import Title from "./components/Title";
import SearchSection from "./components/SearchSection";
import TournamentName from "./components/TournamentName";
import DeleteTeamModal from "./components/DeleteTeamModal";
import EditTeamModal from "./components/EditTeamModal";
import CountTotalMatches from "./components/CountTotalMatches";
import SearchQueryNotFound from "./components/SearchQueryNotFound";
import BottomBar from "./components/BottomBar";
import { getDownloadURL } from "firebase/storage";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "firebase/firebase";

export default function RoundRobinTournament() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [rounds, setRounds] = useState<
    { round: number; matches: { team1: string; team2: string }[] }[]
  >([]);
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [matchResults, setMatchResults] = useState<{
    [key: string]: {
      homeScore?: number;
      awayScore?: number;
      isSaved?: boolean;
    };
  }>({});
  const [savingMatch, setSavingMatch] = useState<string | null>(null);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [standings, setStandings] = useState<Team[]>([]);
  const [loadingStandings, setLoadingStandings] = useState(true); // Start with true to show loading immediately
  const [savingRounds, setSavingRounds] = useState(false);
  const [roundsUpdateSuccess, setRoundsUpdateSuccess] = useState(false);
  const [savedMatches, setSavedMatches] = useState<Record<string, boolean>>({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [addingTeam, setAddingTeam] = useState(false);
  const [addTeamError, setAddTeamError] = useState<string | null>(null);
  // Add localUpdatingMatches state here
  const [localUpdatingMatches, setLocalUpdatingMatches] = useState<
    Record<string, boolean>
  >({});

  // Add these new state variables for edit/delete functionality
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editTeamName, setEditTeamName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [showEditTeam, setShowEditTeam] = useState(false);

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editTeamError, setEditTeamError] = useState<string | null>(null);

  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState(false);
  const [deleteTeamError, setDeleteTeamError] = useState<string | null>(null);

  // Add states for round locking functionality
  const [lockedRounds, setLockedRounds] = useState<{
    [roundNumber: number]: boolean;
  }>({});
  const [togglingLock, setTogglingLock] = useState<number | null>(null);

  // Add states for match locking functionality
  const [lockedMatches, setLockedMatches] = useState<{
    [matchId: string]: boolean;
  }>({});
  const [togglingMatchLock, setTogglingMatchLock] = useState<string | null>(
    null
  );

  // Add state for team addition locking functionality
  const [teamAddingLocked, setTeamAddingLocked] = useState<boolean>(false);
  const [togglingTeamAddLock, setTogglingTeamAddLock] =
    useState<boolean>(false);

  // Add states for password protection
  const [showLockPasswordModal, setShowLockPasswordModal] = useState(false);
  const [lockPassword, setLockPassword] = useState("");
  const [lockPasswordError, setLockPasswordError] = useState<string | null>(
    null
  );
  const [lockingItem, setLockingItem] = useState<{
    type: "round" | "match" | "teamAdding";
    id: string | number;
  } | null>(null);

  // Season history states
  const [showSeasonHistoryModal, setShowSeasonHistoryModal] = useState(false);
  const [seasonHistory, setSeasonHistory] = useState<{
    seasons: {
      season: number;
      createdAt: Date;
      lastUpdated: Date;
      seasonStartDate?: Date;
      seasonEndDate?: Date;
    }[];
    isLoading: boolean;
  }>({ seasons: [], isLoading: false });
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [seasonStandings, setSeasonStandings] = useState<Team[]>([]);
  const [loadingSeasonStandings, setLoadingSeasonStandings] = useState(false);
  const [savingSeasonStats, setSavingSeasonStats] = useState(false);

  // Thay đổi khởi tạo showTeamList để đọc từ localStorage
  const [showTeamList, setShowTeamList] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("showTeamList") === "true";
    }
    return false; // Giá trị mặc định khi chạy trên server
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // Thêm mảng các màu nền khác nhau cho mỗi vòng đấu
  const roundColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-purple-50",
    "bg-pink-50",
    "bg-indigo-50",
    "bg-red-50",
    "bg-orange-50",
    "bg-teal-50",
    "bg-cyan-50",
  ];

  // Hàm lấy màu theo số vòng đấu
  const getRoundColor = (roundNumber: number) => {
    const colorIndex = (roundNumber - 1) % roundColors.length;
    return roundColors[colorIndex];
  };

  // Add authentication state
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalPurpose, setAuthModalPurpose] = useState<
    "standings" | "history" | "stats"
  >("standings");

  // Add authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser: FirebaseUser | null) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  // Check if user is already in tournament
  useEffect(() => {
    const checkUserInTournament = async () => {
      if (!user || !id) return;

      try {
        const userTournamentRef = doc(
          db,
          "users",
          user.uid,
          "joinedTournaments",
          id
        );
        const userTournamentDoc = await getDoc(userTournamentRef);

        if (userTournamentDoc.exists()) {
          await updateDoc(userTournamentRef, {
            lastAccessed: new Date(),
          });
        } else if (tournament) {
          // If user is not in the tournament yet, add them to it
          await setDoc(userTournamentRef, {
            tournamentId: id,
            tournamentName: tournament.name,
            joinedAt: new Date(),
            lastAccessed: new Date(),
          });
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thành viên giải đấu:", error);
      }
    };

    checkUserInTournament();
  }, [user, id, tournament]);

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) {
        toast.error("Giải đấu không tồn tại");
        navigate("/");
        return;
      }

      const unsubscribe = onSnapshot(
        doc(db, "tournaments", id),
        (doc) => {
          if (doc.exists()) {
            setTournament(doc.data() as Tournament);
            console.log("Đã cập nhật dữ liệu giải đấu:", doc.id);
          } else {
            console.log("Không tìm thấy giải đấu");
            toast.error("Giải đấu không tồn tại");
            navigate("/");
          }
        },
        (error) => {
          console.error("Lỗi khi lắng nghe cập nhật giải đấu:", error);
          toast.error(`Lỗi: ${error.message}`);
          navigate("/");
        }
      );

      return unsubscribe;
    };

    const unsubscribe = fetchTournament();

    return () => {
      if (unsubscribe instanceof Promise) {
        unsubscribe.then((unsub) => {
          if (typeof unsub === "function") {
            unsub();
          }
        });
      }
    };
  }, [id, navigate]);

  useEffect(() => {
    if (tournament && tournament.teams) {
      const scheduledRounds = generateRoundRobinMultiRound(
        tournament.teams.map((team) => team.name),
        numberOfRounds
      );
      setRounds(scheduledRounds);
    }
  }, [tournament, numberOfRounds]);

  useEffect(() => {
    const fetchMatchResults = async () => {
      if (!id || !tournament) return;

      try {
        // Lấy tất cả các trận đấu từ collection matches
        const matchesRef = collection(db, "tournaments", id, "matches");
        const matchesSnapshot = await getDocs(matchesRef);

        if (!matchesSnapshot.empty) {
          const results: {
            [key: string]: {
              homeScore?: number;
              awayScore?: number;
              isSaved?: boolean;
            };
          } = {};

          matchesSnapshot.docs.forEach((doc) => {
            const matchData = doc.data() as Match;
            if (
              matchData.id &&
              matchData.homeScore !== undefined &&
              matchData.awayScore !== undefined
            ) {
              results[matchData.id] = {
                homeScore: matchData.homeScore,
                awayScore: matchData.awayScore,
                isSaved: matchData.status === "finished",
              };

              // Also update the savedMatches state
              if (matchData.status === "finished") {
                setSavedMatches((prev) => ({
                  ...prev,
                  [matchData.id]: true,
                }));
              }
            }
          });

          setMatchResults(results);
        }
      } catch (error) {
        console.error("Lỗi khi tải kết quả trận đấu:", error);
        toast.error("Không thể tải kết quả trận đấu");
      }
    };

    fetchMatchResults();
  }, [id, tournament]);

  // When loading the tournament, set the number of rounds from database
  useEffect(() => {
    if (tournament) {
      // If tournament has numberOfRounds property, use it, otherwise default to 1
      setNumberOfRounds(tournament.numberOfRounds || 1);
    }
  }, [tournament]);

  // Add effect to load locked rounds from Firestore
  useEffect(() => {
    if (!id || !tournament) return;

    const fetchLockedRounds = async () => {
      try {
        const lockedRoundsRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockedRounds"
        );
        const lockedRoundsSnapshot = await getDoc(lockedRoundsRef);

        if (lockedRoundsSnapshot.exists()) {
          setLockedRounds(lockedRoundsSnapshot.data().rounds || {});
        }
      } catch (error) {
        console.error("Error fetching locked rounds:", error);
      }
    };

    fetchLockedRounds();
  }, [id, tournament]);

  // Replace with a real-time onSnapshot listener for locked rounds
  useEffect(() => {
    if (!id || !tournament) return;

    const lockedRoundsRef = doc(
      db,
      "tournaments",
      id,
      "settings",
      "lockedRounds"
    );

    // Set up real-time listener for locked rounds
    const unsubscribe = onSnapshot(
      lockedRoundsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLockedRounds(snapshot.data().rounds || {});
          console.log("Real-time update: Locked rounds updated");
        } else {
          // If document doesn't exist, set empty locked rounds
          setLockedRounds({});
        }
      },
      (error) => {
        console.error("Error listening to locked rounds updates:", error);
        toast.error("Không thể cập nhật trạng thái khóa vòng đấu");
      }
    );

    return () => unsubscribe();
  }, [id, tournament]);

  // Add a function to update numberOfRounds in the database
  const updateNumberOfRounds = async (rounds: number) => {
    if (!id || !tournament) return;

    setSavingRounds(true);

    try {
      await updateDoc(doc(db, "tournaments", id), {
        numberOfRounds: rounds,
        lastUpdated: new Date(),
      });

      setRoundsUpdateSuccess(true);
      setTimeout(() => setRoundsUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượt đấu:", error);
      toast.error("Không thể cập nhật số lượt đấu");
    } finally {
      setSavingRounds(false);
    }
  };

  // Hàm tạo lịch đấu vòng tròn công bằng với thứ tự trận đấu hợp lý
  const generateRoundRobinMultiRound = (
    teams: string[],
    numOfRounds: number = 1
  ) => {
    const teamsCount = teams.length;
    const actualTeams = [...teams];

    // Thêm đội "bye" nếu số đội là lẻ
    if (teamsCount % 2 !== 0) {
      actualTeams.push("bye");
    }

    const numTeams = actualTeams.length;
    const numRoundsPerSeries = numTeams - 1;
    const result = [];

    // Generate all rounds
    for (let roundSeries = 0; roundSeries < numOfRounds; roundSeries++) {
      // Tạo mảng chứa các chỉ số đội
      const teamIndices = Array.from({ length: numTeams }, (_, i) => i);

      // Theo dõi số trận sân nhà/sân khách của mỗi đội
      const homeAwayBalance = actualTeams.reduce(
        (acc, team) => {
          acc[team] = {
            home: 0,
            away: 0,
            consecutiveHome: 0,
            consecutiveAway: 0,
            lastRoundPlayed: -1,
            opponents: [],
          };
          return acc;
        },
        {} as Record<
          string,
          {
            home: number;
            away: number;
            consecutiveHome: number;
            consecutiveAway: number;
            lastRoundPlayed: number;
            opponents: string[];
          }
        >
      );

      // Generate matches for this round series
      for (let round = 0; round < numRoundsPerSeries; round++) {
        const roundMatches = [];
        const teamsPlayingThisRound = new Set<string>();

        // Ghép cặp: đội đầu với đội cuối, đội thứ hai với đội áp chót,...
        for (let i = 0; i < numTeams / 2; i++) {
          const team1Index = teamIndices[i];
          const team2Index = teamIndices[numTeams - 1 - i];

          const team1 = actualTeams[team1Index];
          const team2 = actualTeams[team2Index];

          // Nếu một trong hai đội là "bye", xử lý đặc biệt
          if (team1 === "bye" || team2 === "bye") {
            if (team1 === "bye") {
              roundMatches.push({ team1: team2, team2: "bye" });
              teamsPlayingThisRound.add(team2);
            } else {
              roundMatches.push({ team1, team2: "bye" });
              teamsPlayingThisRound.add(team1);
            }
            continue;
          }

          // Lưu thông tin đối thủ
          homeAwayBalance[team1].opponents.push(team2);
          homeAwayBalance[team2].opponents.push(team1);

          // Cập nhật thông tin vòng đấu gần nhất
          homeAwayBalance[team1].lastRoundPlayed = round;
          homeAwayBalance[team2].lastRoundPlayed = round;

          // Determine home/away teams based on round series
          let homeTeam, awayTeam;

          // For even-numbered series (0, 2, 4...), use normal order
          // For odd-numbered series (1, 3, 5...), swap home/away
          if (roundSeries % 2 === 0) {
            // Use regular match-making logic for first series
            if (
              homeAwayBalance[team1].consecutiveHome >
              homeAwayBalance[team2].consecutiveHome
            ) {
              homeTeam = team2;
              awayTeam = team1;
            } else if (
              homeAwayBalance[team2].consecutiveHome >
              homeAwayBalance[team1].consecutiveHome
            ) {
              homeTeam = team1;
              awayTeam = team2;
            } else if (
              homeAwayBalance[team1].home - homeAwayBalance[team1].away >
              homeAwayBalance[team2].home - homeAwayBalance[team2].away
            ) {
              homeTeam = team2;
              awayTeam = team1;
            } else {
              homeTeam = team1;
              awayTeam = team2;
            }
          } else {
            // For odd-numbered series, swap home/away
            if (
              homeAwayBalance[team1].consecutiveHome >
              homeAwayBalance[team2].consecutiveHome
            ) {
              homeTeam = team2;
              awayTeam = team1;
            } else if (
              homeAwayBalance[team2].consecutiveHome >
              homeAwayBalance[team1].consecutiveHome
            ) {
              homeTeam = team1;
              awayTeam = team2;
            } else if (
              homeAwayBalance[team1].home - homeAwayBalance[team1].away >
              homeAwayBalance[team2].home - homeAwayBalance[team2].away
            ) {
              homeTeam = team2;
              awayTeam = team1;
            } else {
              homeTeam = team1;
              awayTeam = team2;
            }
            // Swap for odd-numbered round series
            [homeTeam, awayTeam] = [awayTeam, homeTeam];
          }

          // Cập nhật số trận liên tiếp sân nhà/sân khách
          homeAwayBalance[homeTeam].consecutiveHome += 1;
          homeAwayBalance[homeTeam].consecutiveAway = 0;
          homeAwayBalance[awayTeam].consecutiveAway += 1;
          homeAwayBalance[awayTeam].consecutiveHome = 0;

          // Cập nhật tổng số trận sân nhà/sân khách
          homeAwayBalance[homeTeam].home += 1;
          homeAwayBalance[awayTeam].away += 1;

          // Thêm vào danh sách đội thi đấu vòng này
          teamsPlayingThisRound.add(homeTeam);
          teamsPlayingThisRound.add(awayTeam);

          roundMatches.push({ team1: homeTeam, team2: awayTeam });
        }

        // Sắp xếp lại thứ tự trận đấu để phân bố đều các trận trong vòng đấu
        if (round > 0) {
          // Tìm các đội vừa nghỉ vòng trước để ưu tiên xếp trận đầu vòng này
          const teamsRestingLastRound = actualTeams.filter(
            (team) =>
              team !== "bye" &&
              homeAwayBalance[team].lastRoundPlayed < round - 1
          );

          if (teamsRestingLastRound.length > 0) {
            // Sắp xếp lại trận đấu để những đội nghỉ nhiều vòng chơi trước
            roundMatches.sort((a, b) => {
              const aRestPriority =
                (teamsRestingLastRound.includes(a.team1) ? 1 : 0) +
                (teamsRestingLastRound.includes(a.team2) ? 1 : 0);
              const bRestPriority =
                (teamsRestingLastRound.includes(b.team1) ? 1 : 0) +
                (teamsRestingLastRound.includes(b.team2) ? 1 : 0);
              return bRestPriority - aRestPriority;
            });
          }
        }

        // Calculate the global round number
        const globalRoundNumber = roundSeries * numRoundsPerSeries + round + 1;
        result.push({ round: globalRoundNumber, matches: roundMatches });

        // Xoay các đội (trừ đội đầu tiên)
        const lastTeam = teamIndices.pop();
        teamIndices.splice(1, 0, lastTeam!); // Chèn đội cuối vào vị trí thứ hai
      }

      // Optimize this round series
      optimizeSchedule(
        result.slice(-numRoundsPerSeries),
        homeAwayBalance,
        actualTeams
      );
    }

    return result;
  };

  // Hàm tối ưu hóa lịch thi đấu để đảm bảo công bằng
  const optimizeSchedule = (
    rounds: { round: number; matches: { team1: string; team2: string }[] }[],
    homeAwayBalance: Record<string, any>,
    teams: string[]
  ) => {
    // Xác định các vòng đấu có thể hoán đổi vị trí
    for (let i = 0; i < rounds.length - 1; i++) {
      for (let j = i + 1; j < rounds.length; j++) {
        // Kiểm tra nếu hoán đổi hai vòng có cải thiện tính công bằng không
        if (shouldSwapRounds(rounds[i], rounds[j], homeAwayBalance, teams)) {
          // Hoán đổi vị trí hai vòng đấu
          const temp = rounds[i].matches;
          rounds[i].matches = rounds[j].matches;
          rounds[j].matches = temp;

          // Cập nhật lại số liệu theo dõi sau khi hoán đổi
          updateHomeAwayBalanceAfterSwap(rounds[i], rounds[j], homeAwayBalance);
        }
      }
    }
  };

  // Kiểm tra xem có nên hoán đổi hai vòng đấu không
  const shouldSwapRounds = (
    round1: { round: number; matches: { team1: string; team2: string }[] },
    round2: { round: number; matches: { team1: string; team2: string }[] },
    homeAwayBalance: Record<string, any>,
    teams: string[]
  ) => {
    // Tính toán chỉ số không cân bằng hiện tại của lịch thi đấu
    const currentImbalance = calculateScheduleImbalance(homeAwayBalance, teams);

    // Mô phỏng hoán đổi và tính toán chỉ số không cân bằng sau khi hoán đổi
    const simulatedBalance = { ...homeAwayBalance };
    updateHomeAwayBalanceAfterSwap(round1, round2, simulatedBalance);
    const swappedImbalance = calculateScheduleImbalance(
      simulatedBalance,
      teams
    );

    // Nếu hoán đổi làm giảm mức độ không cân bằng, thực hiện hoán đổi
    return swappedImbalance < currentImbalance;
  };

  // Tính toán chỉ số không cân bằng của lịch thi đấu
  const calculateScheduleImbalance = (
    homeAwayBalance: Record<string, any>,
    teams: string[]
  ) => {
    let imbalance = 0;

    // Tính tổng độ lệch của các đội
    for (const team of teams) {
      if (team === "bye") continue;

      // Độ lệch sân nhà/sân khách
      imbalance += Math.abs(
        homeAwayBalance[team].home - homeAwayBalance[team].away
      );

      // Độ lệch các trận liên tiếp
      imbalance += homeAwayBalance[team].consecutiveHome * 2;
      imbalance += homeAwayBalance[team].consecutiveAway * 2;
    }

    return imbalance;
  };

  // Cập nhật thông tin sau khi hoán đổi hai vòng đấu
  const updateHomeAwayBalanceAfterSwap = (
    round1: { round: number; matches: { team1: string; team2: string }[] },
    round2: { round: number; matches: { team1: string; team2: string }[] },
    homeAwayBalance: Record<string, any>
  ) => {
    // Đặt lại thông tin cân bằng sân nhà/sân khách cho các đội liên quan
    const teamsInRound1 = new Set<string>();
    const teamsInRound2 = new Set<string>();

    // Xác định tất cả các đội trong hai vòng đấu
    round1.matches.forEach((match) => {
      if (match.team1 !== "bye") teamsInRound1.add(match.team1);
      if (match.team2 !== "bye") teamsInRound1.add(match.team2);
    });

    round2.matches.forEach((match) => {
      if (match.team1 !== "bye") teamsInRound2.add(match.team1);
      if (match.team2 !== "bye") teamsInRound2.add(match.team2);
    });

    // Đặt lại số trận liên tiếp sân nhà/sân khách cho các đội liên quan
    [...teamsInRound1, ...teamsInRound2].forEach((team) => {
      if (team !== "bye" && homeAwayBalance[team]) {
        // Đặt lại giá trị trận liên tiếp
        homeAwayBalance[team].consecutiveHome = 0;
        homeAwayBalance[team].consecutiveAway = 0;

        // Tính toán lại giá trị dựa trên lịch đấu mới
        let consecutiveHome = 0;
        let consecutiveAway = 0;

        // Kiểm tra trong round1
        round1.matches.forEach((match) => {
          if (match.team1 === team) {
            consecutiveHome += 1;
            consecutiveAway = 0;
          } else if (match.team2 === team) {
            consecutiveAway += 1;
            consecutiveHome = 0;
          }
        });

        // Kiểm tra trong round2
        round2.matches.forEach((match) => {
          if (match.team1 === team) {
            consecutiveHome += 1;
            consecutiveAway = 0;
          } else if (match.team2 === team) {
            consecutiveAway += 1;
            consecutiveHome = 0;
          }
        });

        // Cập nhật giá trị mới
        homeAwayBalance[team].consecutiveHome = consecutiveHome;
        homeAwayBalance[team].consecutiveAway = consecutiveAway;

        // Cập nhật vòng đấu gần nhất
        homeAwayBalance[team].lastRoundPlayed = Math.max(
          round1.round,
          round2.round
        );
      }
    });
  };

  // Hàm đếm tổng số trận đấu (không tính trận "bye")
  const countTotalMatches = (
    rounds: { round: number; matches: { team1: string; team2: string }[] }[]
  ) => {
    return rounds.reduce((total, round) => {
      const actualMatches = round.matches.filter(
        (match) => match.team1 !== "bye" && match.team2 !== "bye"
      );
      return total + actualMatches.length;
    }, 0);
  };

  // Hàm để cập nhật kết quả trận đấu
  const updateMatchResult = async (
    matchId: string,
    homeScore: number,
    awayScore: number
  ) => {
    if (!tournament || !id) return;

    setSavingMatch(matchId);

    try {
      // Cập nhật trạng thái đang cập nhật lên Firestore để tất cả thiết bị đều thấy
      await updateDoc(doc(db, "tournaments", id), {
        updatingMatch: matchId,
        lastUpdated: new Date(),
      });

      // Kiểm tra tính hợp lệ của dữ liệu đầu vào
      if (homeScore < 0 || awayScore < 0) {
        throw new Error("Số bàn thắng không thể là số âm");
      }

      // Tách matchId để lấy thông tin vòng đấu và đội bóng
      const [roundStr, homeTeamName, awayTeamName] = matchId.split("-");

      // Tìm thông tin trận đấu
      const matchesRef = collection(db, "tournaments", id, "matches");
      const matchQuery = query(matchesRef, where("id", "==", matchId));
      const matchSnapshot = await getDocs(matchQuery);

      if (matchSnapshot.empty) {
        // Nếu không tìm thấy trận đấu trong collection matches, tạo mới
        return await createAndSaveMatch(
          matchId,
          homeScore,
          awayScore,
          roundStr,
          homeTeamName,
          awayTeamName
        );
      }

      const matchDoc = matchSnapshot.docs[0];
      const matchData = matchDoc.data() as Match;

      // Kiểm tra xem trận đấu đã kết thúc chưa
      if (matchData.status === "finished") {
        // Nếu đã kết thúc, cần rollback điểm số cũ trước khi cập nhật mới
        await rollbackPreviousResult(matchData);
      }

      // Tạo batch để cập nhật nhiều documents đồng thời (atomic operations)
      const batch = writeBatch(db);

      // Get information about both teams for head-to-head data
      const homeTeamRef = doc(
        db,
        "tournaments",
        id,
        "teams",
        matchData.homeTeam.id
      );
      const awayTeamRef = doc(
        db,
        "tournaments",
        id,
        "teams",
        matchData.awayTeam.id
      );

      const homeTeamDoc = await getDoc(homeTeamRef);
      const awayTeamDoc = await getDoc(awayTeamRef);

      if (homeTeamDoc.exists() && awayTeamDoc.exists()) {
        const homeTeam = homeTeamDoc.data() as Team;
        const awayTeam = awayTeamDoc.data() as Team;

        // Cập nhật kết quả trận đấu with enhanced head-to-head information
        batch.update(matchDoc.ref, {
          homeScore,
          awayScore,
          status: "finished",
          updatedAt: new Date(),
          // Add head-to-head info for easier querying
          headToHead: {
            teams: [homeTeam.id, awayTeam.id],
            season: tournament.season || 1,
          },
        });

        // Cập nhật thống kê
        const homeTeamUpdate = updateTeamStats(
          homeTeam,
          homeScore,
          awayScore,
          true
        );
        const awayTeamUpdate = updateTeamStats(
          awayTeam,
          awayScore,
          homeScore,
          false
        );

        batch.update(homeTeamRef, homeTeamUpdate);
        batch.update(awayTeamRef, awayTeamUpdate);

        // Thêm log cập nhật điểm
        const logsRef = collection(db, "tournaments", id, "pointsLogs");
        batch.set(doc(logsRef), {
          matchId,
          homeTeam: {
            id: homeTeam.id,
            name: homeTeam.name,
            prevPoints: homeTeam.points,
            newPoints: homeTeamUpdate.points,
            pointsGained: homeTeamUpdate.points - homeTeam.points,
          },
          awayTeam: {
            id: awayTeam.id,
            name: awayTeam.name,
            prevPoints: awayTeam.points,
            newPoints: awayTeamUpdate.points,
            pointsGained: awayTeamUpdate.points - awayTeam.points,
          },
          timestamp: new Date(),
          // Thêm thông tin lịch sử
          history: {
            previousHomeScore: matchData.homeScore || 0,
            previousAwayScore: matchData.awayScore || 0,
            newHomeScore: homeScore,
            newAwayScore: awayScore,
          },
        });

        // Lưu trận đấu vào lịch sử kết quả (để tiện tra cứu sau)
        const historyRef = collection(db, "tournaments", id, "matchHistory");
        batch.set(doc(historyRef), {
          matchId,
          roundNumber: parseInt(roundStr),
          homeTeam: {
            id: homeTeam.id,
            name: homeTeam.name,
            score: homeScore,
          },
          awayTeam: {
            id: awayTeam.id,
            name: awayTeam.name,
            score: awayScore,
          },
          updatedAt: new Date(),
          updatedBy: "user", // Có thể thay bằng ID người dùng thực tế nếu có
        });
      }

      // Update local states for match results and saved matches before committing batch
      // This helps prevent UI flickering
      const updatedMatchResults = {
        ...matchResults,
        [matchId]: {
          homeScore,
          awayScore,
          isSaved: true,
        },
      };

      const updatedSavedMatches = {
        ...savedMatches,
        [matchId]: true,
      };

      // Set local state first for smoother UI updates
      setMatchResults(updatedMatchResults);
      setSavedMatches(updatedSavedMatches);

      // Only include minimal updates in the tournament document to reduce listener overhead
      batch.update(doc(db, "tournaments", id), {
        lastUpdated: new Date(),
        // We'll clear the updatingMatch flag separately
      });

      // Commit batch to update teams, matches, and logs
      await batch.commit();

      // Now update just the tournament updatingMatch flag and notify other clients
      await updateDoc(doc(db, "tournaments", id), {
        updatingMatch: null,
      });

      // Add notification for all devices
      await addNotification(
        `Đã cập nhật kết quả trận đấu: ${homeTeamName} ${homeScore} - ${awayScore} ${awayTeamName}`,
        "success"
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật kết quả trận đấu:", error);
      toast.error(
        `Lỗi: Không thể cập nhật kết quả. ${
          (error as Error).message || "Không xác định"
        }`
      );

      // Add error notification for all devices
      await addNotification(
        `Lỗi cập nhật kết quả trận đấu: ${
          (error as Error).message || "Không xác định"
        }`,
        "error"
      );
    } finally {
      // Xóa trạng thái đang cập nhật trên Firestore nếu có lỗi
      try {
        await updateDoc(doc(db, "tournaments", id), {
          updatingMatch: null,
        });
      } catch (err) {
        console.error("Lỗi khi xóa trạng thái cập nhật:", err);
      }

      // Clear the saving state with a slight delay to prevent UI flickering
      setTimeout(() => {
        setSavingMatch(null);
      }, 200);
    }
  };

  // Hàm để rollback kết quả trận đấu cũ
  const rollbackPreviousResult = async (matchData: Match) => {
    if (!id) return;

    try {
      const batch = writeBatch(db);

      // Lấy thông tin team hiện tại
      const homeTeamRef = doc(
        db,
        "tournaments",
        id,
        "teams",
        matchData.homeTeam.id
      );
      const awayTeamRef = doc(
        db,
        "tournaments",
        id,
        "teams",
        matchData.awayTeam.id
      );

      const homeTeamDoc = await getDoc(homeTeamRef);
      const awayTeamDoc = await getDoc(awayTeamRef);

      if (
        homeTeamDoc.exists() &&
        awayTeamDoc.exists() &&
        matchData.homeScore !== undefined &&
        matchData.awayScore !== undefined
      ) {
        const homeTeam = homeTeamDoc.data() as Team;
        const awayTeam = awayTeamDoc.data() as Team;

        // Rollback thống kê home team
        const homeUpdate: Record<string, any> = {
          played: Math.max(0, homeTeam.played - 1),
          goalsFor: Math.max(0, homeTeam.goalsFor - matchData.homeScore),
          goalsAgainst: Math.max(
            0,
            homeTeam.goalsAgainst - matchData.awayScore
          ),
        };

        // Rollback thống kê away team
        const awayUpdate: Record<string, any> = {
          played: Math.max(0, awayTeam.played - 1),
          goalsFor: Math.max(0, awayTeam.goalsFor - matchData.awayScore),
          goalsAgainst: Math.max(
            0,
            awayTeam.goalsAgainst - matchData.homeScore
          ),
        };

        // Cập nhật điểm số và kết quả thắng/hòa/thua
        if (matchData.homeScore > matchData.awayScore) {
          // Home team thắng
          homeUpdate["won"] = Math.max(0, homeTeam.won - 1);
          homeUpdate["points"] = Math.max(0, homeTeam.points - 3);
          awayUpdate["lost"] = Math.max(0, awayTeam.lost - 1);
        } else if (matchData.homeScore < matchData.awayScore) {
          // Away team thắng
          homeUpdate["lost"] = Math.max(0, homeTeam.lost - 1);
          awayUpdate["won"] = Math.max(0, awayTeam.won - 1);
          awayUpdate["points"] = Math.max(0, awayTeam.points - 3);
        } else {
          // Hòa
          homeUpdate["drawn"] = Math.max(0, homeTeam.drawn - 1);
          homeUpdate["points"] = Math.max(0, homeTeam.points - 1);
          awayUpdate["drawn"] = Math.max(0, awayTeam.drawn - 1);
          awayUpdate["points"] = Math.max(0, awayTeam.points - 1);
        }

        // Cập nhật hiệu số bàn thắng
        homeUpdate["goalDifference"] =
          homeTeam.goalsFor -
          homeUpdate["goalsFor"] -
          (homeTeam.goalsAgainst - homeUpdate["goalsAgainst"]);
        awayUpdate["goalDifference"] =
          awayTeam.goalsFor -
          awayUpdate["goalsFor"] -
          (awayTeam.goalsAgainst - awayUpdate["goalsAgainst"]);

        // Rollback form (loại bỏ kết quả cuối cùng nếu có)
        if (homeTeam.form?.length > 0) {
          homeUpdate["form"] = [...homeTeam.form.slice(0, -1)];
        }

        if (awayTeam.form?.length > 0) {
          awayUpdate["form"] = [...awayTeam.form.slice(0, -1)];
        }

        batch.update(homeTeamRef, homeUpdate);
        batch.update(awayTeamRef, awayUpdate);

        await batch.commit();

        console.log("Đã rollback kết quả cũ thành công");
      }
    } catch (error) {
      console.error("Lỗi khi rollback kết quả cũ:", error);
      throw error;
    }
  };

  // Hàm tạo và lưu trận đấu mới (khi trận đấu chưa tồn tại trong collection matches)
  const createAndSaveMatch = async (
    matchId: string,
    homeScore: number,
    awayScore: number,
    roundStr: string,
    homeTeamName: string,
    awayTeamName: string
  ) => {
    if (!id || !tournament) return;

    try {
      // Cập nhật trạng thái đang cập nhật lên Firestore để tất cả thiết bị đều thấy
      await updateDoc(doc(db, "tournaments", id), {
        updatingMatch: matchId,
        lastUpdated: new Date(),
      });

      // Tìm thông tin đội bóng từ tên
      const teamsRef = collection(db, "tournaments", id, "teams");
      const homeTeamQuery = query(teamsRef, where("name", "==", homeTeamName));
      const awayTeamQuery = query(teamsRef, where("name", "==", awayTeamName));

      const [homeTeamSnapshot, awayTeamSnapshot] = await Promise.all([
        getDocs(homeTeamQuery),
        getDocs(awayTeamQuery),
      ]);

      if (homeTeamSnapshot.empty || awayTeamSnapshot.empty) {
        throw new Error("Không tìm thấy thông tin đội bóng");
      }

      const homeTeamDoc = homeTeamSnapshot.docs[0];
      const awayTeamDoc = awayTeamSnapshot.docs[0];

      const homeTeam = homeTeamDoc.data() as Team;
      const awayTeam = awayTeamDoc.data() as Team;

      // Tạo batch
      const batch = writeBatch(db);

      // Tạo trận đấu mới
      const matchesRef = collection(db, "tournaments", id, "matches");
      const newMatchRef = doc(matchesRef);

      // Create match date (current date or from roundDate if available)
      const matchDate = new Date();

      // Enhanced match data with more detailed team information for better head-to-head tracking
      const matchData: Partial<Match> & {
        createdAt: Date;
        updatedAt: Date;
        date: Date;
      } = {
        id: matchId,
        homeTeam: {
          id: homeTeam.id,
          name: homeTeam.name,
          avatar: homeTeam.avatar || "",
        } as any,
        awayTeam: {
          id: awayTeam.id,
          name: awayTeam.name,
          avatar: awayTeam.avatar || "",
        } as any,
        homeScore,
        awayScore,
        date: matchDate,
        status: "finished",
        round: parseInt(roundStr),
        createdAt: new Date(),
        updatedAt: new Date(),
        // Store head-to-head info for quicker retrieval
        headToHead: {
          teams: [homeTeam.id, awayTeam.id],
          season: tournament.season || 1,
        },
      };

      batch.set(newMatchRef, matchData);

      // Cập nhật thống kê cho 2 đội
      const homeTeamUpdate = updateTeamStats(
        homeTeam,
        homeScore,
        awayScore,
        true
      );
      const awayTeamUpdate = updateTeamStats(
        awayTeam,
        awayScore,
        homeScore,
        false
      );

      batch.update(homeTeamDoc.ref, homeTeamUpdate);
      batch.update(awayTeamDoc.ref, awayTeamUpdate);

      // Thêm log
      const logsRef = collection(db, "tournaments", id, "pointsLogs");
      batch.set(doc(logsRef), {
        matchId,
        homeTeam: {
          id: homeTeam.id,
          name: homeTeam.name,
          prevPoints: homeTeam.points,
          newPoints: homeTeamUpdate.points,
          pointsGained: homeTeamUpdate.points - homeTeam.points,
        },
        awayTeam: {
          id: awayTeam.id,
          name: awayTeam.name,
          prevPoints: awayTeam.points,
          newPoints: awayTeamUpdate.points,
          pointsGained: awayTeamUpdate.points - awayTeam.points,
        },
        timestamp: new Date(),
      });

      // Update local states for match results and saved matches before committing the batch
      const updatedMatchResults = {
        ...matchResults,
        [matchId]: {
          homeScore,
          awayScore,
          isSaved: true,
        },
      };

      const updatedSavedMatches = {
        ...savedMatches,
        [matchId]: true,
      };

      // Cập nhật tournament data
      const updatedMatches = [...tournament.matches, matchData as Match];

      batch.update(doc(db, "tournaments", id), {
        matches: updatedMatches,
        lastUpdated: new Date(),
        updatingMatch: null, // Xóa trạng thái đang cập nhật khi hoàn thành
        matchResults: updatedMatchResults, // Add match results to tournament document
        savedMatches: updatedSavedMatches, // Add saved matches to tournament document
      });

      await batch.commit();

      // Update local states
      setMatchResults(updatedMatchResults);
      setSavedMatches(updatedSavedMatches);

      // Add notification for all devices
      await addNotification(
        `Đã lưu kết quả trận đấu: ${homeTeamName} ${homeScore} - ${awayScore} ${awayTeamName}`,
        "success"
      );
    } catch (error) {
      console.error("Lỗi khi tạo và lưu trận đấu:", error);
      toast.error(
        `Lỗi: Không thể tạo trận đấu. ${
          (error as Error).message || "Không xác định"
        }`
      );

      // Add error notification for all devices
      await addNotification(
        `Lỗi lưu kết quả trận đấu: ${
          (error as Error).message || "Không xác định"
        }`,
        "error"
      );

      // Xóa trạng thái đang cập nhật trên Firestore nếu có lỗi
      try {
        await updateDoc(doc(db, "tournaments", id), {
          updatingMatch: null,
        });
      } catch (err) {
        console.error("Lỗi khi xóa trạng thái cập nhật:", err);
      }

      throw error;
    }
  };

  // Hàm cập nhật thống kê đội bóng
  const updateTeamStats = (
    team: Team,
    goalsScored: number,
    goalsConceded: number,
    isHome: boolean
  ) => {
    let won = team.won;
    let drawn = team.drawn;
    let lost = team.lost;
    let points = team.points;
    let form = [...team.form];

    // Xác định kết quả
    if (goalsScored > goalsConceded) {
      won += 1;
      points += 3;
      form.push("W");
    } else if (goalsScored === goalsConceded) {
      drawn += 1;
      points += 1;
      form.push("D");
    } else {
      lost += 1;
      form.push("L");
    }

    // Giữ tối đa 5 kết quả gần nhất
    if (form.length > 5) {
      form = form.slice(form.length - 5);
    }

    return {
      played: team.played + 1,
      won,
      drawn,
      lost,
      goalsFor: team.goalsFor + goalsScored,
      goalsAgainst: team.goalsAgainst + goalsConceded,
      goalDifference:
        team.goalsFor + goalsScored - (team.goalsAgainst + goalsConceded),
      points,
      form,
    };
  };

  // Hàm xử lý khi người dùng nhập kết quả
  const handleScoreChange = (
    matchId: string,
    isHome: boolean,
    score: number
  ) => {
    if (score !== undefined && score !== null) {
      const updatedScores = { ...matchResults };
      if (isHome) {
        updatedScores[matchId] = {
          ...updatedScores[matchId],
          homeScore: score,
        };
      } else {
        updatedScores[matchId] = {
          ...updatedScores[matchId],
          awayScore: score,
        };
      }
      setMatchResults(updatedScores);
    }
  };

  // Hàm lưu kết quả trận đấu
  const saveMatchResult = (matchId: string) => {
    // Check if the match is locked
    if (lockedMatches[matchId]) {
      toast.error("Trận đấu này đã bị khoá. Không thể cập nhật kết quả.");
      return;
    }

    // Kiểm tra xem có thiết bị khác đang cập nhật trận đấu này không
    if (tournament?.updatingMatch === matchId) {
      toast.error(
        "Trận đấu này đang được cập nhật từ thiết bị khác. Vui lòng đợi."
      );
      return;
    }

    const match = matchResults[matchId];
    if (match) {
      const { homeScore, awayScore } = match;

      // Set loading state for standings before saving the match result
      setLoadingStandings(true);

      // Mark this match as being locally updated to prevent UI flickering
      setLocalUpdatingMatches((prev) => ({
        ...prev,
        [matchId]: true,
      }));

      // Also update tournament document to indicate this match is being updated
      if (tournament && tournament.id) {
        const tournamentRef = doc(db, "tournaments", tournament.id);
        updateDoc(tournamentRef, {
          updatingMatch: matchId,
          lastUpdated: new Date(),
        }).catch((error) => {
          console.error("Error marking match as updating:", error);
        });
      }

      updateMatchResult(matchId, homeScore ?? 0, awayScore ?? 0)
        .then(() => {
          // The standings will update automatically via the real-time listener
          // Clear the updating match flag
          if (tournament && tournament.id) {
            const tournamentRef = doc(db, "tournaments", tournament.id);
            updateDoc(tournamentRef, {
              updatingMatch: null,
              lastUpdated: new Date(),
            }).catch((error) => {
              console.error("Error clearing updating match:", error);
            });
          }

          // Clear the local updating state with a slight delay to ensure smooth UI transition
          setTimeout(() => {
            setLocalUpdatingMatches((prev) => {
              const updated = { ...prev };
              delete updated[matchId];
              return updated;
            });
          }, 500);
        })
        .catch((error) => {
          console.error("Error saving match result:", error);
          setLoadingStandings(false); // Reset loading state if error occurs

          // Clear the local updating state
          setLocalUpdatingMatches((prev) => {
            const updated = { ...prev };
            delete updated[matchId];
            return updated;
          });

          // Also clear the updating match flag in case of error
          if (tournament && tournament.id) {
            const tournamentRef = doc(db, "tournaments", tournament.id);
            updateDoc(tournamentRef, {
              updatingMatch: null,
              lastUpdated: new Date(),
            }).catch((error) => {
              console.error("Error clearing updating match:", error);
            });
          }
        });
    }
  };

  const openStandingsModal = () => {
    // Check if user is authenticated
    if (!user) {
      setAuthModalPurpose("standings");
      setShowAuthModal(true);
      return;
    }

    setShowStandingsModal(true);
    disableBodyScroll();

    // Scroll to top of modal when opened
    setTimeout(() => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 100);
  };

  const closeStandingsModal = () => {
    setShowStandingsModal(false);
    enableBodyScroll();
  };

  /**
   * Reset the tournament for a new season
   *
   * This function:
   * 1. Saves the current season stats for historical reference
   * 2. Resets all team statistics (points, goals, etc.)
   * 3. Deletes all match data
   * 4. Unlocks all matches by clearing the lockedMatches collection
   * 5. Unlocks all rounds by clearing the lockedRounds collection
   * 6. Updates the tournament document with the new season information
   * 7. Creates log entries for the reset action
   * 8. Resets UI state for match results
   *
   * Requires password confirmation to execute.
   */
  const resetTournament = async () => {
    if (!id || !tournament) return;

    // Skip password check if tournament is private
    if (!tournament.isPrivate) {
      // Kiểm tra mật khẩu (sử dụng mật khẩu mặc định là "reset123")
      const correctPassword = tournament.password;

      if (resetPassword !== correctPassword) {
        setResetPasswordError("Mật khẩu không chính xác");
        return;
      }
    }

    setResetting(true);
    setResetPasswordError(null);

    try {
      // Create a batch to handle multiple operations
      const batch = writeBatch(db);

      // Get current season end date (now)
      const currentSeasonEndDate = new Date();

      // Set new season start date (now)
      const newSeasonStartDate = new Date();

      // 1. Reset all team statistics
      const teamsRef = collection(db, "tournaments", id, "teams");
      const teamsSnapshot = await getDocs(teamsRef);

      teamsSnapshot.docs.forEach((teamDoc) => {
        batch.update(teamDoc.ref, {
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
          form: [],
        });
      });

      // 2. Delete all match data
      const matchesRef = collection(db, "tournaments", id, "matches");
      const matchesSnapshot = await getDocs(matchesRef);

      matchesSnapshot.docs.forEach((matchDoc) => {
        batch.delete(matchDoc.ref);
      });

      // 3. Clear all locked matches
      const lockedMatchesRef = doc(
        db,
        "tournaments",
        id,
        "settings",
        "lockedMatches"
      );
      batch.set(lockedMatchesRef, { matches: {} }, { merge: true });

      // Clear all locked rounds
      const lockedRoundsRef = doc(
        db,
        "tournaments",
        id,
        "settings",
        "lockedRounds"
      );
      batch.set(lockedRoundsRef, { rounds: {} }, { merge: true });

      // Clear match lock status fields from tournament document
      const tournamentDoc = await getDoc(doc(db, "tournaments", id));
      if (tournamentDoc.exists()) {
        const tournamentData = tournamentDoc.data();
        const fieldsToUpdate: Record<string, any> = {
          matches: [],
          lastUpdated: new Date(),
          lastReset: new Date(),
          season: (tournament.season || 1) + 1,
          createdAt: new Date(),
          seasonStartDate: newSeasonStartDate,
          seasonEndDate: null, // Reset end date for new season
          matchResults: {}, // Add this to reset match results on all devices
          savedMatches: {}, // Add this to reset saved matches on all devices
        };

        // Find and clear all matchLockStatus_ and roundLockStatus_ fields
        Object.keys(tournamentData).forEach((key) => {
          if (
            key.startsWith("matchLockStatus_") ||
            key.startsWith("roundLockStatus_")
          ) {
            fieldsToUpdate[key] = "unlocked";
          }
        });

        batch.update(doc(db, "tournaments", id), fieldsToUpdate);
      } else {
        // Just update normal fields if document doesn't exist (should never happen)
        batch.update(doc(db, "tournaments", id), {
          matches: [],
          lastUpdated: new Date(),
          lastReset: new Date(),
          season: (tournament.season || 1) + 1,
          createdAt: new Date(),
          seasonStartDate: newSeasonStartDate,
          seasonEndDate: null, // Reset end date for new season
          matchResults: {}, // Add this to reset match results on all devices
          savedMatches: {}, // Add this to reset saved matches on all devices
        });
      }

      // 4. Add log entry for the reset
      const logsRef = collection(db, "tournaments", id, "seasonLogs");
      batch.set(doc(logsRef), {
        action: "season_reset",
        previousSeason: tournament.season || 1,
        newSeason: (tournament.season || 1) + 1,
        previousSeasonStartDate: tournament.seasonStartDate || null,
        previousSeasonEndDate: currentSeasonEndDate,
        newSeasonStartDate: newSeasonStartDate,
        timestamp: new Date(),
      });

      // 5. Add log for unlocking all matches
      const lockLogsRef = collection(db, "tournaments", id, "lockLogs");
      batch.set(doc(lockLogsRef), {
        action: "all_locks_cleared",
        timestamp: new Date(),
        reason: "season_reset",
        lockedBy: "system",
        details: "All matches and rounds unlocked for new season",
      });

      // Execute all operations
      await batch.commit();

      // Update local state
      setMatchResults({});
      setSavedMatches({});
      setSeasonStartDate(newSeasonStartDate);
      setSeasonEndDate(null);
      setLockedMatches({}); // Clear local locked matches state
      setLockedRounds({}); // Clear local locked rounds state

      // Add notification for all devices
      await addNotification(
        `Đã bắt đầu mùa giải mới (Mùa ${(tournament.season || 1) + 1})`,
        "success"
      );
      setShowResetModal(false);
    } catch (error) {
      console.error("Lỗi khi đặt lại giải đấu:", error);
      toast.error(`Không thể đặt lại giải đấu: ${(error as Error).message}`);

      // Add error notification for all devices
      await addNotification(
        `Lỗi đặt lại giải đấu: ${(error as Error).message || "Không xác định"}`,
        "error"
      );
    } finally {
      setResetting(false);
      setResetPassword(""); // Xóa mật khẩu sau khi hoàn thành
    }
  };

  // Function to save current season statistics for historical reference
  const saveCurrentSeasonStats = async () => {
    if (!id || !tournament) return;

    // Check for user authentication
    if (!user) {
      setAuthModalPurpose("stats");
      setShowAuthModal(true);
      return;
    }

    setSavingSeasonStats(true);

    try {
      // First get current standings
      const teamsRef = collection(db, "tournaments", id, "teams");
      const teamsSnapshot = await getDocs(teamsRef);

      if (!teamsSnapshot.empty) {
        const teamsData = teamsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Team[];

        // Skip saving if there are no completed matches (no stats)
        const hasStats = teamsData.some((team) => team.played > 0);
        if (!hasStats) {
          console.log("No stats to save for this season");
          return;
        }

        // Sort by points, goal difference, goals for
        const sortedTeams = teamsData.sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points;
          if (a.goalDifference !== b.goalDifference)
            return b.goalDifference - a.goalDifference;
          return b.goalsFor - a.goalsFor;
        });

        // Get current season number
        const currentSeason = tournament.season || 1;

        // Set current season end date to now
        const currentSeasonEndDate = new Date();

        // Update tournament with season end date
        await updateDoc(doc(db, "tournaments", id), {
          lastStatsSave: new Date(),
          seasonEndDate: currentSeasonEndDate,
        });

        // Update local state
        setSeasonEndDate(currentSeasonEndDate);

        // Save to seasonStats collection
        const seasonStatsRef = doc(
          db,
          "tournaments",
          id,
          "seasonStats",
          `season-${currentSeason}`
        );

        await setDoc(seasonStatsRef, {
          season: currentSeason,
          standings: sortedTeams,
          savedAt: new Date(),
          tournamentName: tournament.name,
          seasonStartDate: tournament.seasonStartDate || null,
          seasonEndDate: currentSeasonEndDate,
        });

        toast.success(`Đã lưu thống kê Mùa ${currentSeason}`);

        // Add to logs
        const logsRef = collection(db, "tournaments", id, "seasonLogs");
        await addDoc(logsRef, {
          action: "season_stats_saved",
          season: currentSeason,
          seasonStartDate: tournament.seasonStartDate || null,
          seasonEndDate: currentSeasonEndDate,
          timestamp: new Date(),
          teamsCount: sortedTeams.length,
          matchesPlayed:
            sortedTeams.reduce((sum, team) => sum + team.played, 0) / 2,
        });
      } else {
        console.log("No teams data to save");
      }
    } catch (error) {
      console.error("Lỗi khi lưu thống kê mùa giải:", error);
      toast.error(`Không thể lưu thống kê: ${(error as Error).message}`);
    } finally {
      setSavingSeasonStats(false);
    }
  };

  // Function to fetch season history
  const fetchSeasonHistory = async () => {
    if (!id || !tournament) return;

    setSeasonHistory((prev) => ({ ...prev, isLoading: true }));

    try {
      // Fetch all season stats documents
      const seasonStatsRef = collection(db, "tournaments", id, "seasonStats");
      const seasonStatsSnapshot = await getDocs(seasonStatsRef);

      if (!seasonStatsSnapshot.empty) {
        const seasons = seasonStatsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            season: data.season,
            createdAt: data.savedAt?.toDate() || new Date(),
            lastUpdated: data.savedAt?.toDate() || new Date(),
            seasonStartDate: data.seasonStartDate
              ? data.seasonStartDate.toDate()
              : null,
            seasonEndDate: data.seasonEndDate
              ? data.seasonEndDate.toDate()
              : null,
          };
        });

        // Sort by season number descending (newest first)
        const sortedSeasons = seasons.sort((a, b) => b.season - a.season);

        setSeasonHistory({
          seasons: sortedSeasons,
          isLoading: false,
        });

        // If there are seasons and none is selected, select the most recent one
        if (sortedSeasons.length > 0 && selectedSeason === null) {
          setSelectedSeason(sortedSeasons[0].season);
          fetchSeasonStandings(sortedSeasons[0].season);
        }
      } else {
        setSeasonHistory({
          seasons: [],
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử mùa giải:", error);
      toast.error(
        `Không thể tải lịch sử mùa giải: ${(error as Error).message}`
      );
      setSeasonHistory({
        seasons: [],
        isLoading: false,
      });
    }
  };

  // Function to fetch standings for a specific season
  const fetchSeasonStandings = async (season: number) => {
    if (!id || !tournament) return;

    setLoadingSeasonStandings(true);

    try {
      const seasonStatsRef = doc(
        db,
        "tournaments",
        id,
        "seasonStats",
        `season-${season}`
      );
      const seasonStatsDoc = await getDoc(seasonStatsRef);

      if (seasonStatsDoc.exists()) {
        const data = seasonStatsDoc.data();
        setSeasonStandings(data.standings || []);

        // Scroll to the standings table after it loads
        setTimeout(() => {
          const standingsTable = document.querySelector(
            ".season-standings-table"
          );
          if (standingsTable) {
            standingsTable.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 200);
      } else {
        setSeasonStandings([]);
        toast.error(`Không tìm thấy dữ liệu Mùa ${season}`);
      }
    } catch (error) {
      console.error(`Lỗi khi tải bảng xếp hạng Mùa ${season}:`, error);
      toast.error(`Không thể tải bảng xếp hạng: ${(error as Error).message}`);
      setSeasonStandings([]);
    } finally {
      setLoadingSeasonStandings(false);
    }
  };

  // Function to open the season history modal
  const openSeasonHistoryModal = async () => {
    // Check if user is authenticated
    if (!user) {
      setAuthModalPurpose("history");
      setShowAuthModal(true);
      return;
    }

    setShowSeasonHistoryModal(true);
    disableBodyScroll();

    // Try to save current season stats first (if there are matches played)
    try {
      await saveCurrentSeasonStats();
    } catch (err) {
      console.error("Error auto-saving current season stats:", err);
    }

    // Then fetch season history
    await fetchSeasonHistory();
  };

  // Function to close the season history modal
  const closeSeasonHistoryModal = () => {
    setShowSeasonHistoryModal(false);
    enableBodyScroll();
  };

  // Effect to prevent scrolling when modals are open
  useEffect(() => {
    if (
      showResetModal ||
      showStandingsModal ||
      showAddTeamModal ||
      showEditTeamModal ||
      showDeleteTeamModal ||
      showLockPasswordModal ||
      showSeasonHistoryModal
    ) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }

    // Cleanup function to ensure scrolling is restored when component unmounts
    return () => {
      enableBodyScroll();
    };
  }, [
    showResetModal,
    showStandingsModal,
    showAddTeamModal,
    showEditTeamModal,
    showDeleteTeamModal,
    showLockPasswordModal,
    showSeasonHistoryModal,
  ]);

  // Add this helper function to check if tournament has matches with results
  const checkForCompletedMatches = async () => {
    if (!id) return false;

    try {
      const matchesRef = collection(db, "tournaments", id, "matches");
      const matchQuery = query(matchesRef, where("status", "==", "finished"));
      const matchSnapshot = await getDocs(matchQuery);

      return !matchSnapshot.empty;
    } catch (error) {
      console.error("Lỗi khi kiểm tra trận đấu:", error);
      throw error;
    }
  };

  // Update the addNewTeam function
  const addNewTeam = async () => {
    if (!id || !tournament) return;

    // Check if adding teams is locked
    if (teamAddingLocked) {
      setAddTeamError("Tính năng thêm đội mới đã bị khóa");
      return;
    }

    if (!newTeamName.trim()) {
      setAddTeamError("Tên đội không được để trống");
      return;
    }

    // Check if team name already exists
    const teamExists = tournament.teams.some(
      (team) => team.name.toLowerCase() === newTeamName.trim().toLowerCase()
    );

    if (teamExists) {
      setAddTeamError("Tên đội đã tồn tại trong giải đấu");
      return;
    }

    setAddingTeam(true);
    setAddTeamError(null);

    try {
      // Check if tournament already has matches with results
      // const hasCompletedMatches = await checkForCompletedMatches();
      // if (hasCompletedMatches) {
      //   throw new Error(
      //     "Không thể thêm đội khi giải đấu đã có trận đấu với kết quả. Hãy đặt lại giải đấu trước."
      //   );
      // }

      // Create a new team document in Firestore
      const teamsRef = collection(db, "tournaments", id, "teams");
      const newTeamRef = doc(teamsRef);
      const teamId = newTeamRef.id;

      const newTeam: Team = {
        id: teamId,
        name: newTeamName.trim(),
        avatar: avatarUrl || "",
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
        createdAt: new Date(),
        headToHead: [],
      };

      // Create batch operation
      const batch = writeBatch(db);

      // Add the team to the teams collection
      batch.set(newTeamRef, newTeam);

      // Update the tournament with the new team
      const updatedTeams = [...tournament.teams, newTeam];
      batch.update(doc(db, "tournaments", id), {
        teams: updatedTeams,
        lastUpdated: new Date(),
      });

      // Log the team addition
      const logsRef = collection(db, "tournaments", id, "teamLogs");
      batch.set(doc(logsRef), {
        action: "team_added",
        teamId,
        teamName: newTeamName,
        timestamp: new Date(),
      });

      // Execute all operations
      await batch.commit();

      // Clear form and close modal
      setNewTeamName("");
      setAvatarUrl("");
      setShowAddTeamModal(false);

      toast.success(`Đã thêm đội ${newTeamName} vào giải đấu!`);

      // The tournament should auto-update through the onSnapshot listener
    } catch (error) {
      console.error("Lỗi khi thêm đội mới:", error);
      setAddTeamError(`Không thể thêm đội: ${(error as Error).message}`);
    } finally {
      setAddingTeam(false);
    }
  };

  // Add this function to update a team
  const updateTeam = async () => {
    if (!id || !tournament || !editingTeam || !editingTeamId) return;

    if (!editTeamName.trim()) {
      setEditTeamError("Tên đội không được để trống");
      return;
    }

    // Check if the new name already exists (but skip the team being edited)
    const teamExists = tournament.teams.some(
      (team) =>
        team.id !== editingTeamId &&
        team.name.toLowerCase() === editTeamName.trim().toLowerCase()
    );

    if (teamExists) {
      setEditTeamError("Tên đội đã tồn tại trong giải đấu");
      toast.error("Tên đội đã tồn tại trong giải đấu");
      return;
    }

    setAddingTeam(true); // Reuse this state for editing
    setEditTeamError(null);
    setShowEditTeam(false);

    try {
      // Create batch operation
      const batch = writeBatch(db);

      // Update team fields - use editTeamAvatar directly since it's already been uploaded
      const teamRef = doc(db, "tournaments", id, "teams", editingTeamId);
      batch.update(teamRef, {
        name: editTeamName.trim(),
        avatar: avatarUrl || "",
        updatedAt: new Date(),
      });

      // Update the tournament with the edited team
      const updatedTeams = tournament.teams.map((team) =>
        team.id === editingTeamId
          ? {
              ...team,
              name: editTeamName.trim(),
              avatar: avatarUrl || "",
            }
          : team
      );

      batch.update(doc(db, "tournaments", id), {
        teams: updatedTeams,
        lastUpdated: new Date(),
      });

      // Log the team update
      const logsRef = collection(db, "tournaments", id, "teamLogs");
      batch.set(doc(logsRef), {
        action: "team_updated",
        teamId: editingTeamId,
        previousName: editingTeam.name,
        newName: editTeamName.trim(),
        timestamp: new Date(),
      });

      // Execute all operations
      await batch.commit();

      // Close modal and reset form
      setShowEditTeamModal(false);
      setEditingTeam(null);
      setEditTeamName("");
      setAvatarUrl("");
      setEditingTeamId(null);

      toast.success(`Đã cập nhật đội ${editTeamName}!`);
    } catch (error) {
      console.error("Lỗi khi cập nhật đội:", error);
      setEditTeamError(`Không thể cập nhật đội: ${(error as Error).message}`);
    } finally {
      setAddingTeam(false);
    }
  };

  // Update the deleteTeam function
  const deleteTeam = async () => {
    if (!id || !tournament || !deletingTeamId || !deletingTeam) return;

    setDeletingInProgress(true);
    setDeleteTeamError(null);

    try {
      // Check if tournament already has matches with results
      const hasCompletedMatches = await checkForCompletedMatches();
      if (hasCompletedMatches) {
        throw new Error(
          "Không thể xóa đội khi giải đấu đã có trận đấu với kết quả. Hãy đặt lại giải đấu trước."
        );
      }

      // Create batch operation
      const batch = writeBatch(db);

      // Delete the team from Firestore
      const teamRef = doc(db, "tournaments", id, "teams", deletingTeamId);
      batch.delete(teamRef);

      // Update the tournament by removing the team
      const updatedTeams = tournament.teams.filter(
        (team) => team.id !== deletingTeamId
      );

      batch.update(doc(db, "tournaments", id), {
        teams: updatedTeams,
        lastUpdated: new Date(),
      });

      // Log the team deletion
      const logsRef = collection(db, "tournaments", id, "teamLogs");
      batch.set(doc(logsRef), {
        action: "team_deleted",
        teamId: deletingTeamId,
        teamName: deletingTeam.name,
        timestamp: new Date(),
      });

      // Execute all operations
      await batch.commit();

      // Clean up deleting-related states
      setShowDeleteTeamModal(false);
      setShowEditTeamModal(false);
      setDeletingTeam(null);
      setDeletingTeamId(null);

      toast.success(`Đã xóa đội ${deletingTeam.name} khỏi giải đấu!`);
    } catch (error) {
      console.error("Lỗi khi xóa đội:", error);
      setDeleteTeamError(`Không thể xóa đội: ${(error as Error).message}`);
    } finally {
      setDeletingInProgress(false);
    }
  };

  // Add function to toggle round lock state with password
  const toggleRoundLock = async (roundNumber: number) => {
    if (!id || !tournament) return;

    // If we are locking the round (it's currently unlocked), proceed without password
    if (!lockedRounds[roundNumber]) {
      // Locking without password
      setTogglingLock(roundNumber);

      try {
        const batch = writeBatch(db);

        // 1. Update the locked rounds document
        const lockedRoundsRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockedRounds"
        );

        // Get current data to make sure we're not overwriting other round locks
        const currentLockedRoundsDoc = await getDoc(lockedRoundsRef);
        const currentRounds = currentLockedRoundsDoc.exists()
          ? currentLockedRoundsDoc.data().rounds || {}
          : {};

        const updatedLockedRounds = {
          ...currentRounds,
          [roundNumber]: true,
        };

        batch.set(
          lockedRoundsRef,
          { rounds: updatedLockedRounds },
          { merge: true }
        );

        // 2. Update tournament document to indicate status change
        batch.update(doc(db, "tournaments", id), {
          lastUpdated: new Date(),
          [`roundLockStatus_${roundNumber}`]: "locked",
        });

        // 3. Create log entry for this action
        const logsRef = collection(db, "tournaments", id, "lockLogs");
        batch.set(doc(logsRef), {
          action: "round_locked",
          roundNumber,
          timestamp: new Date(),
          lockedBy: "admin", // You could add user info here if available
        });

        // Execute all operations atomically
        await batch.commit();

        // Add notification for all devices with detailed information
        const roundInfo = rounds.find((r) => r.round === roundNumber);
        const matchesCount = roundInfo
          ? roundInfo.matches.filter(
              (m) => m.team1 !== "bye" && m.team2 !== "bye"
            ).length
          : 0;

        // Create a more detailed notification
        const notificationMessage = `Vòng ${roundNumber} (${matchesCount} trận đấu) đã được khoá cập nhật kết quả`;

        await addNotification(notificationMessage, "error");
      } catch (error) {
        console.error("Error locking round:", error);
        toast.error(`Không thể khoá vòng đấu: ${(error as Error).message}`);
      } finally {
        setTogglingLock(null);
      }
    } else {
      // Unlocking requires password
      setLockingItem({ type: "round", id: roundNumber });
      setLockPassword("");
      setLockPasswordError(null);
      setShowLockPasswordModal(true);
    }
  };

  // Add function to toggle match lock state with password
  const toggleMatchLock = async (matchId: string) => {
    if (!id || !tournament) return;

    // If we are locking the match (it's currently unlocked), proceed without password
    if (!lockedMatches[matchId]) {
      // Locking without password
      setTogglingMatchLock(matchId);

      try {
        const batch = writeBatch(db);

        // 1. Update the locked matches document
        const lockedMatchesRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockedMatches"
        );

        // Get current data to make sure we're not overwriting other match locks
        const currentLockedMatchesDoc = await getDoc(lockedMatchesRef);
        const currentMatches = currentLockedMatchesDoc.exists()
          ? currentLockedMatchesDoc.data().matches || {}
          : {};

        const updatedLockedMatches = {
          ...currentMatches,
          [matchId]: true,
        };

        batch.set(
          lockedMatchesRef,
          { matches: updatedLockedMatches },
          { merge: true }
        );

        // 2. Update tournament document to indicate status change
        batch.update(doc(db, "tournaments", id), {
          lastUpdated: new Date(),
          [`matchLockStatus_${matchId}`]: "locked",
        });

        // 3. Create log entry for this action
        const logsRef = collection(db, "tournaments", id, "lockLogs");
        batch.set(doc(logsRef), {
          action: "match_locked",
          matchId,
          timestamp: new Date(),
          lockedBy: "admin", // You could add user info here if available
        });

        // Execute all operations atomically
        await batch.commit();

        // Extract match details from matchId
        const [roundStr, homeTeamName, awayTeamName] = matchId.split("-");
        const roundNumber = parseInt(roundStr);

        // Add notification for all devices with detailed match information
        const notificationMessage = `Trận đấu: ${homeTeamName} vs ${awayTeamName} (Vòng ${roundNumber}) đã được khoá cập nhật kết quả`;

        await addNotification(notificationMessage, "info");
      } catch (error) {
        console.error("Error locking match:", error);
        toast.error(`Không thể khoá trận đấu: ${(error as Error).message}`);
      } finally {
        setTogglingMatchLock(null);
      }
    } else {
      // Unlocking requires password
      setLockingItem({ type: "match", id: matchId });
      setLockPassword("");
      setLockPasswordError(null);
      setShowLockPasswordModal(true);
    }
  };

  // Add this state for confirmation dialog
  const [showTeamAddLockConfirmation, setShowTeamAddLockConfirmation] =
    useState(false);

  // Update the toggleTeamAddingLock function to show confirmation dialog first
  const toggleTeamAddingLock = async () => {
    if (!id || !tournament) return;

    // If we are locking (it's currently unlocked), show confirmation first
    if (!teamAddingLocked) {
      setShowTeamAddLockConfirmation(true);
      return;
    } else {
      // Unlocking requires password
      setLockingItem({ type: "teamAdding", id: "teamAdding" });
      setLockPassword("");
      setLockPasswordError(null);
      setShowLockPasswordModal(true);
    }
  };

  // Add a new function to handle the actual locking after confirmation
  const confirmTeamAddingLock = async () => {
    if (!id || !tournament) return;

    setTogglingTeamAddLock(true);
    setShowTeamAddLockConfirmation(false);

    try {
      const batch = writeBatch(db);

      // 1. Update the lock settings document
      const lockSettingsRef = doc(
        db,
        "tournaments",
        id,
        "settings",
        "lockSettings"
      );

      batch.set(lockSettingsRef, { teamAddingLocked: true }, { merge: true });

      // 2. Update tournament document to indicate status change
      batch.update(doc(db, "tournaments", id), {
        lastUpdated: new Date(),
        teamAddingLockStatus: "locked",
      });

      // 3. Create log entry for this action
      const logsRef = collection(db, "tournaments", id, "lockLogs");
      batch.set(doc(logsRef), {
        action: "team_adding_locked",
        timestamp: new Date(),
        lockedBy: "admin", // You could add user info here if available
      });

      // Execute all operations atomically
      await batch.commit();

      // Add notification for all devices
      const notificationMessage = "Tính năng thêm đội mới đã bị khóa";
      await addNotification(notificationMessage, "info");
    } catch (error) {
      console.error("Error locking team adding:", error);
      toast.error(
        `Không thể khóa tính năng thêm đội: ${(error as Error).message}`
      );
    } finally {
      setTogglingTeamAddLock(false);
    }
  };

  // Actual implementation of unlocking with password verification
  const handleUnlock = async () => {
    if (!id || !tournament || !lockingItem) return;

    // Verify password against tournament password
    const correctPassword = tournament.password;

    if (lockPassword !== correctPassword) {
      setLockPasswordError("Mật khẩu không chính xác");
      return;
    }

    try {
      if (lockingItem.type === "round") {
        // Handle round unlocking
        const roundNumber = lockingItem.id as number;
        setTogglingLock(roundNumber);

        // Create a batch operation for atomic updates
        const batch = writeBatch(db);

        // 1. Update the locked rounds document
        const lockedRoundsRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockedRounds"
        );

        // Get current data to make sure we're not overwriting other round locks
        const currentLockedRoundsDoc = await getDoc(lockedRoundsRef);
        const currentRounds = currentLockedRoundsDoc.exists()
          ? currentLockedRoundsDoc.data().rounds || {}
          : {};

        const updatedLockedRounds = {
          ...currentRounds,
          [roundNumber]: false,
        };

        batch.set(
          lockedRoundsRef,
          { rounds: updatedLockedRounds },
          { merge: true }
        );

        // 2. Update tournament document to indicate status change
        batch.update(doc(db, "tournaments", id), {
          lastUpdated: new Date(),
          [`roundLockStatus_${roundNumber}`]: "unlocked",
        });

        // 3. Create log entry for this action
        const logsRef = collection(db, "tournaments", id, "lockLogs");
        batch.set(doc(logsRef), {
          action: "round_unlocked",
          roundNumber,
          timestamp: new Date(),
          lockedBy: "admin", // You could add user info here if available
        });

        // Execute all operations atomically
        await batch.commit();

        // Add notification for all devices with detailed information
        const roundInfo = rounds.find((r) => r.round === roundNumber);
        const matchesCount = roundInfo
          ? roundInfo.matches.filter(
              (m) => m.team1 !== "bye" && m.team2 !== "bye"
            ).length
          : 0;

        // Create a more detailed notification
        const notificationMessage = `Vòng ${roundNumber} (${matchesCount} trận đấu) đã được mở khoá cập nhật kết quả`;

        await addNotification(notificationMessage, "success");

        setTogglingLock(null);
      } else if (lockingItem.type === "match") {
        // Handle match unlocking (since locking is handled directly)
        const matchId = lockingItem.id as string;
        setTogglingMatchLock(matchId);

        // Create a batch operation for atomic updates
        const batch = writeBatch(db);

        // 1. Update the locked matches document
        const lockedMatchesRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockedMatches"
        );

        // Get current data to make sure we're not overwriting other match locks
        const currentLockedMatchesDoc = await getDoc(lockedMatchesRef);
        const currentMatches = currentLockedMatchesDoc.exists()
          ? currentLockedMatchesDoc.data().matches || {}
          : {};

        const updatedLockedMatches = {
          ...currentMatches,
          [matchId]: false,
        };

        batch.set(
          lockedMatchesRef,
          { matches: updatedLockedMatches },
          { merge: true }
        );

        // 2. Update tournament document to indicate status change
        batch.update(doc(db, "tournaments", id), {
          lastUpdated: new Date(),
          [`matchLockStatus_${matchId}`]: "unlocked",
        });

        // 3. Create log entry for this action
        const logsRef = collection(db, "tournaments", id, "lockLogs");
        batch.set(doc(logsRef), {
          action: "match_unlocked",
          matchId,
          timestamp: new Date(),
          lockedBy: "admin", // You could add user info here if available
        });

        // Execute all operations atomically
        await batch.commit();

        // Extract match details from matchId
        const [roundStr, homeTeamName, awayTeamName] = matchId.split("-");
        const roundNumber = parseInt(roundStr);

        // Add notification for all devices with detailed match information
        const notificationMessage = `Trận đấu: ${homeTeamName} vs ${awayTeamName} (Vòng ${roundNumber}) đã được mở khoá cập nhật kết quả`;

        await addNotification(notificationMessage, "success");

        setTogglingMatchLock(null);
      } else if (lockingItem.type === "teamAdding") {
        // Handle team adding unlocking
        setTogglingTeamAddLock(true);

        // Create a batch operation for atomic updates
        const batch = writeBatch(db);

        // 1. Update the lock settings document
        const lockSettingsRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockSettings"
        );

        batch.set(
          lockSettingsRef,
          { teamAddingLocked: false },
          { merge: true }
        );

        // 2. Update tournament document to indicate status change
        batch.update(doc(db, "tournaments", id), {
          lastUpdated: new Date(),
          teamAddingLockStatus: "unlocked",
        });

        // 3. Create log entry for this action
        const logsRef = collection(db, "tournaments", id, "lockLogs");
        batch.set(doc(logsRef), {
          action: "team_adding_unlocked",
          timestamp: new Date(),
          lockedBy: "admin", // You could add user info here if available
        });

        // Execute all operations atomically
        await batch.commit();

        // Add notification for all devices
        const notificationMessage = "Tính năng thêm đội mới đã được mở khóa";
        await addNotification(notificationMessage, "success");

        setTogglingTeamAddLock(false);
      }

      // Close modal and reset state
      setShowLockPasswordModal(false);
      setLockingItem(null);
      setLockPassword("");
    } catch (error) {
      console.error("Error unlocking:", error);
      toast.error(`Không thể mở khoá: ${(error as Error).message}`);

      if (lockingItem.type === "round") {
        setTogglingLock(null);
      } else if (lockingItem.type === "match") {
        setTogglingMatchLock(null);
      } else if (lockingItem.type === "teamAdding") {
        setTogglingTeamAddLock(false);
      }
    }
  };

  // Add a file change handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const tempId = editingTeamId || uuidv4();
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file hình ảnh hợp lệ");
        return;
      }
      try {
        setUploadingAvatar(true);
        const storageRef = ref(storage, `team-avatars/${tempId}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        if (!id) {
          toast.error("Tournament ID is missing");
          return;
        }
        setAvatarUrl(downloadURL);
      } catch (error) {
        setUploadingAvatar(false);
        console.error("Error uploading avatar:", error);
        toast.error("Không thể tải lên ảnh đại diện. Vui lòng thử lại.");
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  // Thêm hàm để toggle hiển thị danh sách đội
  const toggleTeamList = () => {
    const newValue = !showTeamList;
    setShowTeamList(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("showTeamList", newValue.toString());
    }
  };

  // Thêm state cho tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Thêm hàm chuyển đổi chuỗi có dấu thành không dấu
  const removeAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Cập nhật hàm lọc trận đấu theo từ khóa tìm kiếm
  const getFilteredRounds = () => {
    if (!searchQuery.trim()) return rounds;

    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/); // Tách các từ khóa tìm kiếm

    const filteredRounds = rounds
      .map((round) => ({
        ...round,
        matches: round.matches.filter((match) => {
          const team1Name = match.team1.toLowerCase();
          const team2Name = match.team2.toLowerCase();

          // Chuyển đổi tên đội thành dạng không dấu
          const team1NameNoAccent = removeAccents(team1Name);
          const team2NameNoAccent = removeAccents(team2Name);

          // Kiểm tra từng từ khóa
          return searchTerms.every((term) => {
            const termNoAccent = removeAccents(term);
            return (
              team1Name.includes(term) || // Tìm kiếm chuỗi gốc
              team2Name.includes(term) ||
              team1NameNoAccent.includes(termNoAccent) || // Tìm kiếm chuỗi không dấu
              team2NameNoAccent.includes(termNoAccent)
            );
          });
        }),
      }))
      .filter((round) => round.matches.length > 0);

    // If we found filtered rounds, store the first one as active for auto-scrolling
    if (filteredRounds.length > 0) {
      activeRoundRef.current = roundRefs.current[filteredRounds[0].round - 1];
    }

    return filteredRounds;
  };

  // Add scrollToActiveRound function
  const scrollToActiveRound = () => {
    if (activeRoundRef.current) {
      activeRoundRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Add effect to scroll to active round when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      // Wait a bit for the DOM to update
      const timer = setTimeout(() => {
        scrollToActiveRound();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Add effect to initialize roundRefs when rounds change
  useEffect(() => {
    roundRefs.current = roundRefs.current.slice(0, rounds.length);
  }, [rounds]);

  // Update document title when tournament loads
  useEffect(() => {
    if (tournament?.name) {
      document.title = `${tournament.name} - Giải đấu vòng tròn`;
    } else {
      document.title = "Giải đấu vòng tròn";
    }

    // Restore original title when component unmounts
    return () => {
      document.title = "Winner App";
    };
  }, [tournament]);

  // Add this useEffect to listen for notifications
  useEffect(() => {
    if (!id) return;

    // Set up listener for notifications
    const notificationsRef = collection(db, "tournaments", id, "notifications");
    const notificationsQuery = query(
      notificationsRef,
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const notification = change.doc.data();
          // Only show notifications that are recent (within the last 10 seconds)
          const notificationTime = notification.timestamp.toDate();
          const currentTime = new Date();
          const timeDiffSeconds =
            (currentTime.getTime() - notificationTime.getTime()) / 1000;

          // Only show notifications that happened in the last 10 seconds
          if (timeDiffSeconds < 10) {
            // Show the toast notification
            if (notification.type === "success") {
              toast.success(notification.message);
            } else if (notification.type === "error") {
              toast.error(notification.message);
            } else {
              toast(notification.message);
            }
          }
        }
      });
    });

    return () => unsubscribe();
  }, [id]);

  // Enhanced real-time standings listener
  useEffect(() => {
    if (!tournament) return;

    setLoadingStandings(true);
    const { id } = tournament;

    // Also listen for tournament updates to track global loading state
    const tournamentRef = doc(db, "tournaments", id);
    const tournamentUnsubscribe = onSnapshot(
      tournamentRef,
      (doc) => {
        const tournamentData = doc.data();
        // If someone is updating a match, set loading to true
        if (tournamentData && tournamentData.updatingMatch) {
          setLoadingStandings(true);
        }
      },
      (error) => {
        console.error("Error listening to tournament updates:", error);
      }
    );

    // Listen to team updates for standings
    const teamsRef = collection(db, "tournaments", id, "teams");

    const teamsUnsubscribe = onSnapshot(
      teamsRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const teamsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Team[];

          // Sort by points, goal difference, goals for
          const sortedTeams = teamsData.sort((a, b) => {
            if (a.points !== b.points) return b.points - a.points;
            if (a.goalDifference !== b.goalDifference)
              return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
          });

          setStandings(sortedTeams);

          // Only set loading to false if no match is being updated
          if (tournament && !tournament.updatingMatch) {
            setLoadingStandings(false);
          }
        } else {
          // Empty standings still means we're done loading
          setLoadingStandings(false);
        }
      },
      (error) => {
        console.error("Error listening to standings updates:", error);
        setLoadingStandings(false);
      }
    );

    return () => {
      teamsUnsubscribe();
      tournamentUnsubscribe();
    };
  }, [tournament]);

  // Function to add a notification that will be shown on all devices
  const addNotification = async (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    if (!id) return;

    try {
      const notificationsRef = collection(
        db,
        "tournaments",
        id,
        "notifications"
      );
      await addDoc(notificationsRef, {
        message,
        type,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  // Add a new useEffect to listen for real-time updates on which rounds are being edited
  useEffect(() => {
    if (!id || !tournament) return;

    // Set up real-time listener for rounds being edited
    const tournamentRef = doc(db, "tournaments", id);

    const unsubscribe = onSnapshot(
      tournamentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          // Check all roundLockStatus fields
          const lockStatusUpdates: Record<number, boolean> = {};
          let hasUpdates = false;

          // Loop through all fields to find roundLockStatus fields
          Object.entries(data).forEach(([key, value]) => {
            if (key.startsWith("roundLockStatus_")) {
              const roundNumber = parseInt(key.split("_")[1]);
              if (!isNaN(roundNumber)) {
                const isLocked = value === "locked";

                // Only update if the value has changed
                if (lockedRounds[roundNumber] !== isLocked) {
                  lockStatusUpdates[roundNumber] = isLocked;
                  hasUpdates = true;
                }
              }
            }
          });

          // If there are updates to locked rounds from other clients, reflect those changes
          if (hasUpdates) {
            setLockedRounds((prev) => ({ ...prev, ...lockStatusUpdates }));
          }

          // Check if a match is being updated
          if (data.updatingMatch) {
            // Extract round number from match ID
            const roundNumber = parseInt(data.updatingMatch.split("-")[0]);
            if (!isNaN(roundNumber)) {
              // You could add UI indicators here for matches being edited
              console.log(`Match in round ${roundNumber} is being updated`);
            }
          }
        }
      },
      (error) => {
        console.error(
          "Error listening to tournament lock status updates:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [id, tournament, lockedRounds]);

  // Add effect to load locked matches from Firestore
  useEffect(() => {
    if (!id || !tournament) return;

    const fetchLockedMatches = async () => {
      try {
        const lockedMatchesRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockedMatches"
        );
        const lockedMatchesSnapshot = await getDoc(lockedMatchesRef);

        if (lockedMatchesSnapshot.exists()) {
          setLockedMatches(lockedMatchesSnapshot.data().matches || {});
        }
      } catch (error) {
        console.error("Error fetching locked matches:", error);
      }
    };

    fetchLockedMatches();
  }, [id, tournament]);

  // Replace with a real-time onSnapshot listener for locked matches
  useEffect(() => {
    if (!id || !tournament) return;

    const lockedMatchesRef = doc(
      db,
      "tournaments",
      id,
      "settings",
      "lockedMatches"
    );

    // Set up real-time listener for locked matches
    const unsubscribe = onSnapshot(
      lockedMatchesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLockedMatches(snapshot.data().matches || {});
          console.log("Real-time update: Locked matches updated");
        } else {
          // If document doesn't exist, set empty locked matches
          setLockedMatches({});
        }
      },
      (error) => {
        console.error("Error listening to locked matches updates:", error);
        toast.error("Không thể cập nhật trạng thái khóa trận đấu");
      }
    );

    return () => unsubscribe();
  }, [id, tournament]);

  // Add a new useEffect to listen for real-time updates on which matches are being edited
  useEffect(() => {
    if (!id || !tournament) return;

    // Set up real-time listener for matches being edited
    const tournamentRef = doc(db, "tournaments", id);

    const unsubscribe = onSnapshot(
      tournamentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          // Check all matchLockStatus fields
          const lockStatusUpdates: Record<string, boolean> = {};
          let hasUpdates = false;

          // Loop through all fields to find matchLockStatus fields
          Object.entries(data).forEach(([key, value]) => {
            if (key.startsWith("matchLockStatus_")) {
              const matchId = key.replace("matchLockStatus_", "");
              const isLocked = value === "locked";

              // Only update if the value has changed
              if (lockedMatches[matchId] !== isLocked) {
                lockStatusUpdates[matchId] = isLocked;
                hasUpdates = true;
              }
            }
          });

          // If there are updates to locked matches from other clients, reflect those changes
          if (hasUpdates) {
            setLockedMatches((prev) => ({ ...prev, ...lockStatusUpdates }));
          }

          // Check if a match is being updated
          if (data.updatingMatch) {
            // You could add UI indicators here for matches being edited
            console.log(`Match ${data.updatingMatch} is being updated`);
          }
        }
      },
      (error) => {
        console.error(
          "Error listening to tournament lock status updates:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [id, tournament, lockedMatches]);

  // After the current useEffect for loading locked matches
  // Add an effect to load team adding lock status from Firestore
  useEffect(() => {
    if (!id || !tournament) return;

    const fetchTeamAddingLockStatus = async () => {
      try {
        const lockSettingsRef = doc(
          db,
          "tournaments",
          id,
          "settings",
          "lockSettings"
        );
        const lockSettingsSnapshot = await getDoc(lockSettingsRef);

        if (lockSettingsSnapshot.exists()) {
          setTeamAddingLocked(
            lockSettingsSnapshot.data().teamAddingLocked || false
          );
        }
      } catch (error) {
        console.error("Error fetching team adding lock status:", error);
      }
    };

    fetchTeamAddingLockStatus();
  }, [id, tournament]);

  // Add real-time listener for team adding lock status
  useEffect(() => {
    if (!id || !tournament) return;

    const lockSettingsRef = doc(
      db,
      "tournaments",
      id,
      "settings",
      "lockSettings"
    );

    // Set up real-time listener for lock settings
    const unsubscribe = onSnapshot(
      lockSettingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setTeamAddingLocked(snapshot.data().teamAddingLocked || false);
          console.log("Real-time update: Team adding lock status updated");
        } else {
          // If document doesn't exist, set to unlocked
          setTeamAddingLocked(false);
        }
      },
      (error) => {
        console.error("Error listening to lock settings updates:", error);
        toast.error("Không thể cập nhật trạng thái khóa thêm đội");
      }
    );

    return () => unsubscribe();
  }, [id, tournament]);

  // Add these new states for season start and end time
  const [seasonStartDate, setSeasonStartDate] = useState<Date | null>(null);
  const [seasonEndDate, setSeasonEndDate] = useState<Date | null>(null);

  // Add this after existing useEffect blocks
  // Effect to load current season dates
  useEffect(() => {
    if (!tournament) return;

    // Handle different ways Firebase might store dates
    const getDateFromFirebase = (firebaseDate: any): Date | null => {
      if (!firebaseDate) return null;

      // If it has a toDate method (Firestore Timestamp)
      if (firebaseDate && typeof firebaseDate.toDate === "function") {
        return firebaseDate.toDate();
      }

      // If it's a Date already
      if (firebaseDate instanceof Date) {
        return firebaseDate;
      }

      // If it's a timestamp number
      if (typeof firebaseDate === "number") {
        return new Date(firebaseDate);
      }

      // If it's an ISO string
      if (typeof firebaseDate === "string") {
        return new Date(firebaseDate);
      }

      return null;
    };

    // Set season start date
    const startDate = getDateFromFirebase(tournament.seasonStartDate);
    if (startDate) {
      setSeasonStartDate(startDate);
    }

    // Set season end date
    const endDate = getDateFromFirebase(tournament.seasonEndDate);
    if (endDate) {
      setSeasonEndDate(endDate);
    }
  }, [tournament]);

  // Formatter for displaying dates in a readable format
  const formatDate = (date: Date | null) => {
    if (!date) return "Chưa có dữ liệu";
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Update the function that opens the reset modal to first check if there are stats to save
  const openResetModal = async () => {
    // Check if there are any completed matches first
    if (!id || !tournament) return;

    try {
      const hasCompletedMatches = await checkForCompletedMatches();

      if (hasCompletedMatches) {
        // Check if statistics for current season have already been saved
        const seasonStatsRef = doc(
          db,
          "tournaments",
          id,
          "seasonStats",
          `season-${tournament.season || 1}`
        );
        const seasonStatsDoc = await getDoc(seasonStatsRef);

        // If stats already saved, set the flag
        if (seasonStatsDoc.exists()) {
          setStatsAlreadySaved(true);
        } else {
          // There are completed matches but stats not yet saved
          setShowSaveStatsConfirmation(true);
          setStatsAlreadySaved(false);
        }
      } else {
        setStatsAlreadySaved(false);
        setShowSaveStatsConfirmation(false);
      }

      // Show the reset modal regardless
      setShowResetModal(true);
    } catch (error) {
      console.error("Lỗi khi kiểm tra trận đấu:", error);
      // Show the reset modal anyway in case of error
      setShowResetModal(true);
    }
  };

  // Add new state for the save stats confirmation
  const [showSaveStatsConfirmation, setShowSaveStatsConfirmation] =
    useState(false);

  // Add these new refs for auto-scrolling functionality
  const roundRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRoundRef = useRef<HTMLDivElement | null>(null);

  // Add a new state variable after seasonStandings state
  const [statsAlreadySaved, setStatsAlreadySaved] = useState(false);

  // Add these new state variables for editing tournament name
  const [showEditTournamentName, setShowEditTournamentName] = useState(false);
  const [editTournamentName, setEditTournamentName] = useState("");
  const [updatingTournamentName, setUpdatingTournamentName] = useState(false);
  const [tournamentNameError, setTournamentNameError] = useState<string | null>(
    null
  );

  // Add this function to update tournament name
  const updateTournamentName = async () => {
    if (!id || !tournament) return;

    if (!editTournamentName.trim()) {
      setTournamentNameError("Tên giải đấu không được để trống");
      return;
    }

    setUpdatingTournamentName(true);
    setTournamentNameError(null);

    try {
      // Update tournament name in Firestore
      await updateDoc(doc(db, "tournaments", id), {
        name: editTournamentName.trim(),
        lastUpdated: new Date(),
      });

      // Create log entry for this action
      const logsRef = collection(db, "tournaments", id, "tournamentLogs");
      await addDoc(logsRef, {
        action: "name_updated",
        previousName: tournament.name,
        newName: editTournamentName.trim(),
        timestamp: new Date(),
      });

      // Add notification for all devices
      await addNotification(
        `Tên giải đấu đã được đổi thành: ${editTournamentName.trim()}`,
        "info"
      );

      // Update local state
      setShowEditTournamentName(false);
      toast.success("Đã cập nhật tên giải đấu thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật tên giải đấu:", error);
      setTournamentNameError(`Không thể cập nhật: ${(error as Error).message}`);
    } finally {
      setUpdatingTournamentName(false);
    }
  };

  // Add a new useEffect to listen for match results updates from the tournament document
  useEffect(() => {
    if (!id || !tournament) return;

    // Check if the tournament document contains matchResults and savedMatches
    if (
      tournament.matchResults &&
      Object.keys(tournament.matchResults).length > 0
    ) {
      // Update local state with match results from tournament document
      setMatchResults(tournament.matchResults as any);
    } else if (
      tournament.matchResults &&
      Object.keys(tournament.matchResults).length === 0
    ) {
      // If tournament has empty matchResults, clear local state
      setMatchResults({});
    }

    if (
      tournament.savedMatches &&
      Object.keys(tournament.savedMatches).length > 0
    ) {
      // Update local state with saved matches from tournament document
      setSavedMatches(tournament.savedMatches as any);
    } else if (
      tournament.savedMatches &&
      Object.keys(tournament.savedMatches).length === 0
    ) {
      // If tournament has empty savedMatches, clear local state
      setSavedMatches({});
    }
  }, [id, tournament]);

  // Add new state for head-to-head history
  const [showHeadToHeadModal, setShowHeadToHeadModal] = useState(false);
  const [headToHeadHomeTeam, setHeadToHeadHomeTeam] = useState<Team | null>(
    null
  );
  const [headToHeadAwayTeam, setHeadToHeadAwayTeam] = useState<Team | null>(
    null
  );
  const [headToHeadHistory, setHeadToHeadHistory] = useState<Match[]>([]);
  const [loadingHeadToHead, setLoadingHeadToHead] = useState(false);
  const [showPrediction, setShowPrediction] = useState(true);

  // Function to fetch head-to-head history between two teams
  const fetchHeadToHeadHistory = async (
    homeTeamId: string,
    awayTeamId: string
  ) => {
    if (!id) return;

    setLoadingHeadToHead(true);

    try {
      // Get both teams' details
      const homeTeamDoc = await getDoc(
        doc(db, "tournaments", id, "teams", homeTeamId)
      );
      const awayTeamDoc = await getDoc(
        doc(db, "tournaments", id, "teams", awayTeamId)
      );

      if (!homeTeamDoc.exists() || !awayTeamDoc.exists()) {
        throw new Error("Không tìm thấy thông tin đội bóng");
      }

      const homeTeam = homeTeamDoc.data() as Team;
      const awayTeam = awayTeamDoc.data() as Team;

      setHeadToHeadHomeTeam(homeTeam);
      setHeadToHeadAwayTeam(awayTeam);

      // Query for matches with headToHead.teams containing both team IDs
      const matchesRef = collection(db, "tournaments", id, "matches");

      // Use the headToHead.teams property to find matches between these two teams
      const matchesQuery = query(
        matchesRef,
        where("headToHead.teams", "array-contains", homeTeamId),
        orderBy("date", "desc")
      );

      const matchesSnapshot = await getDocs(matchesQuery);

      if (matchesSnapshot.empty) {
        setHeadToHeadHistory([]);
      } else {
        // Filter to ensure we only get matches between these exact two teams
        const filteredMatches = matchesSnapshot.docs
          .map((doc) => doc.data() as Match)
          .filter(
            (match) =>
              match.headToHead?.teams?.includes(awayTeamId) &&
              ((match.homeTeam.id === homeTeamId &&
                match.awayTeam.id === awayTeamId) ||
                (match.homeTeam.id === awayTeamId &&
                  match.awayTeam.id === homeTeamId))
          );

        setHeadToHeadHistory(filteredMatches);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đối đầu:", error);
      toast.error(`Không thể tải lịch sử đối đầu: ${(error as Error).message}`);
      setHeadToHeadHistory([]);
    } finally {
      setLoadingHeadToHead(false);
    }
  };

  // Function to open head-to-head modal
  const openHeadToHeadModal = (homeTeamId: string, awayTeamId: string) => {
    setShowHeadToHeadModal(true);
    disableBodyScroll();
    fetchHeadToHeadHistory(homeTeamId, awayTeamId);
  };

  // Function to close head-to-head modal
  const closeHeadToHeadModal = () => {
    setShowHeadToHeadModal(false);
    enableBodyScroll();
  };

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        title={<Title tournament={tournament} />}
        fontSize="text-xl"
        onBack={() => {
          navigate("/join-tournament");
        }}
      >
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showClearButton={showClearButton}
          setShowClearButton={setShowClearButton}
          searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
          scrollToActiveRound={scrollToActiveRound}
        />
      </TopAppBar>

      <div className="flex flex-col items-center p-4 w-full mx-auto overflow-auto overscroll-none">
        {tournament && (
          <div className="w-full">
            <TournamentName
              tournament={tournament}
              showEditTournamentName={showEditTournamentName}
              setShowEditTournamentName={setShowEditTournamentName}
              editTournamentName={editTournamentName}
              setEditTournamentName={setEditTournamentName}
              updatingTournamentName={updatingTournamentName}
              setTournamentNameError={setTournamentNameError}
              updateTournamentName={updateTournamentName}
              tournamentNameError={tournamentNameError}
            />
            <div className="text-sm text-gray-600 mb-3 flex flex-col sm:flex-row sm:gap-4">
              <div>
                <span className="font-medium">Bắt đầu:</span>{" "}
                {formatDate(seasonStartDate)}
              </div>
              <div>
                <span className="font-medium">Kết thúc:</span>{" "}
                {seasonEndDate ? formatDate(seasonEndDate) : "Đang diễn ra"}
              </div>
            </div>
            <NumberOfRounds
              numberOfRounds={numberOfRounds}
              setNumberOfRounds={setNumberOfRounds}
              updateNumberOfRounds={updateNumberOfRounds}
              savingRounds={savingRounds}
              roundsUpdateSuccess={roundsUpdateSuccess}
            />
            <TeamList
              tournament={tournament}
              setEditingTeam={setEditingTeam}
              setEditTeamName={setEditTeamName}
              setEditTeamAvatar={setAvatarUrl}
              setEditingTeamId={setEditingTeamId}
              setShowEditTeamModal={setShowEditTeamModal}
              teamAddingLocked={teamAddingLocked}
              toggleTeamAddingLock={toggleTeamAddingLock}
              togglingTeamAddLock={togglingTeamAddLock}
              setShowAddTeamModal={setShowAddTeamModal}
              showTeamList={showTeamList}
              toggleTeamList={toggleTeamList}
            />
          </div>
        )}

        <div className="mt-4 w-full">
          {rounds.length > 0 && (
            <div className="tournament-section mb-4">
              <div className="flex flex-col gap-2">
                <div className="text-xl font-semibold text-gray-800 border-b pb-2">
                  {numberOfRounds === 1
                    ? "Lịch đấu vòng tròn"
                    : `Lịch đấu vòng tròn (${numberOfRounds} lượt)`}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {getFilteredRounds().map((round) => (
              <div
                key={round.round}
                ref={(el) => {
                  roundRefs.current[round.round - 1] = el;
                  // If this is the first round in filtered results, set it as active
                  if (
                    searchQuery &&
                    getFilteredRounds()[0] &&
                    round.round === getFilteredRounds()[0].round
                  ) {
                    activeRoundRef.current = el;
                  }
                }}
                className={`round ${getRoundColor(
                  round.round
                )} p-2 rounded-lg border border-gray-200 ${
                  searchQuery &&
                  getFilteredRounds()[0] &&
                  round.round === getFilteredRounds()[0].round
                    ? "ring-2 ring-blue-500 ring-opacity-50"
                    : ""
                }`}
              >
                <div className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1 flex justify-between items-center">
                  <div>
                    {(() => {
                      const totalRounds = rounds.length / numberOfRounds;
                      const currentRoundSeries =
                        Math.floor((round.round - 1) / totalRounds) + 1;

                      if (numberOfRounds > 1) {
                        return `Vòng ${round.round} (Lượt ${currentRoundSeries})`;
                      }
                      return `Vòng ${round.round}`;
                    })()}
                  </div>
                </div>
                <div className="matches space-y-4">
                  {round.matches.map((match, idx) => {
                    // Tạo matchId từ thông tin trận đấu và vòng đấu
                    const matchId = `${round.round}-${match.team1}-${match.team2}`;
                    const matchResult = matchResults[matchId];
                    const isCompleted =
                      matchResult?.homeScore !== undefined &&
                      matchResult?.awayScore !== undefined;
                    const isSaved =
                      savedMatches[matchId] || matchResult?.isSaved === true;

                    return (
                      <div
                        key={idx}
                        className={`match p-2 rounded-md border border-gray-200 shadow-md ${
                          isSaved
                            ? "bg-green-50 border-green-200"
                            : isCompleted
                              ? "  border-gray-200"
                              : "bg-gray-50 border-gray-100"
                        } ${
                          lockedMatches[matchId] ? "relative" : ""
                        } hover:border-green-500 transition-all duration-200`}
                      >
                        {/* Lock indicator for match */}
                        {lockedMatches[matchId] && (
                          <div
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                            title="Trận đấu đã bị khoá"
                          >
                            <Lock size={12} />
                          </div>
                        )}

                        {match.team1 === "bye" ? (
                          <p className="text-gray-600 italic">
                            <span className="font-medium">{match.team2}</span>{" "}
                            được nghỉ
                          </p>
                        ) : match.team2 === "bye" ? (
                          <p className="text-gray-600 italic">
                            <span className="font-medium">{match.team1}</span>{" "}
                            được nghỉ
                          </p>
                        ) : (
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2 w-full">
                                <PlayerAvatar
                                  player={{
                                    name: match.team1,
                                    avatar:
                                      tournament?.teams.find(
                                        (t) => t.name === match.team1
                                      )?.avatar || "",
                                  }}
                                  size="medium"
                                  index={
                                    tournament?.teams.findIndex(
                                      (t) => t.name === match.team1
                                    ) || 0
                                  }
                                />
                                <div className="w-full font-semibold text-center">
                                  {match.team1}
                                </div>
                              </div>

                              <div className="flex items-center justify-center 1/3">
                                <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                                  <input
                                    title="Home Score"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    className="font-bold size-8 text-center rounded   border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                    value={
                                      matchResults[matchId]?.homeScore ?? ""
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      handleScoreChange(
                                        matchId,
                                        true,
                                        value ? parseInt(value) : 0
                                      );
                                    }}
                                    maxLength={2}
                                    disabled={lockedMatches[matchId]}
                                  />
                                  <span className="mx-2 text-gray-500 font-bold">
                                    -
                                  </span>
                                  <input
                                    title="Away Score"
                                    type="text"
                                    inputMode="numeric"
                                    className="font-bold size-8 text-center rounded   border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                    value={
                                      matchResults[matchId]?.awayScore ?? ""
                                    }
                                    onChange={(e) => {
                                      const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      handleScoreChange(
                                        matchId,
                                        false,
                                        value ? parseInt(value) : 0
                                      );
                                    }}
                                    maxLength={2}
                                    disabled={lockedMatches[matchId]}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center gap-2 w-full">
                                <div className="w-full font-semibold text-center">
                                  {match.team2}
                                </div>
                                <PlayerAvatar
                                  player={{
                                    name: match.team2,
                                    avatar:
                                      tournament?.teams.find(
                                        (t) => t.name === match.team2
                                      )?.avatar || "",
                                  }}
                                  size="medium"
                                  index={
                                    tournament?.teams.findIndex(
                                      (t) => t.name === match.team2
                                    ) || 0
                                  }
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-gray-500">
                                  {isSaved && (
                                    <span className="inline-flex items-center text-green-700">
                                      <Check size={16} className="mr-1" /> Đã
                                      lưu
                                    </span>
                                  )}
                                </div>

                                {/* Add lock/unlock button for individual match */}
                                <button
                                  onClick={() => toggleMatchLock(matchId)}
                                  disabled={togglingMatchLock === matchId}
                                  className={`p-2 rounded-full transition-colors ${
                                    lockedMatches[matchId]
                                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                                      : "bg-green-100 text-green-600 hover:bg-green-200"
                                  }`}
                                  title={
                                    lockedMatches[matchId]
                                      ? "Mở khoá trận đấu"
                                      : "Khoá trận đấu"
                                  }
                                >
                                  {togglingMatchLock === matchId ? (
                                    <Loader
                                      size={16}
                                      className="animate-spin"
                                    />
                                  ) : lockedMatches[matchId] ? (
                                    <Lock size={16} />
                                  ) : (
                                    <Unlock size={16} />
                                  )}
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    // Find team IDs from the tournament data
                                    const homeTeam = tournament?.teams.find(
                                      (t) => t.name === match.team1
                                    );
                                    const awayTeam = tournament?.teams.find(
                                      (t) => t.name === match.team2
                                    );
                                    if (homeTeam && awayTeam) {
                                      openHeadToHeadModal(
                                        homeTeam.id,
                                        awayTeam.id
                                      );
                                    } else {
                                      toast.error(
                                        "Không tìm thấy thông tin đội bóng"
                                      );
                                    }
                                  }}
                                  className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                >
                                  Đối đầu
                                </button>

                                <button
                                  onClick={() => saveMatchResult(matchId)}
                                  disabled={
                                    savingMatch === matchId ||
                                    tournament?.updatingMatch === matchId ||
                                    matchResults[matchId]?.homeScore ===
                                      undefined ||
                                    matchResults[matchId]?.awayScore ===
                                      undefined ||
                                    lockedMatches[matchId]
                                  }
                                  className={`${
                                    isSaved
                                      ? "bg-green-600 hover:bg-green-700"
                                      : isCompleted
                                        ? "bg-blue-600 hover:bg-blue-700"
                                        : "bg-gray-500 hover:bg-gray-600"
                                  } text-white px-4 py-1.5 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center`}
                                >
                                  {savingMatch === matchId ||
                                  tournament?.updatingMatch === matchId ||
                                  localUpdatingMatches[matchId] ? (
                                    <>
                                      <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                      Đang lưu...
                                    </>
                                  ) : lockedMatches[matchId] ? (
                                    <>
                                      <Lock className="mr-2 h-4 w-4" />
                                      Đã khoá
                                    </>
                                  ) : isSaved ? (
                                    <>
                                      <RefreshCcw className="mr-2 h-4 w-4" />{" "}
                                      Cập nhật kết quả
                                    </>
                                  ) : (
                                    "Lưu kết quả"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {searchQuery && getFilteredRounds().length === 0 && (
            <SearchQueryNotFound
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setShowClearButton={setShowClearButton}
            />
          )}
          {rounds.length > 0 && (
            <CountTotalMatches
              tournament={tournament}
              rounds={rounds}
              numberOfRounds={numberOfRounds}
            />
          )}
        </div>

        {showStandingsModal && (
          <StandingsModal
            showStandingsModal={showStandingsModal}
            setShowStandingsModal={setShowStandingsModal}
            loadingStandings={loadingStandings}
            standings={standings}
            closeStandingsModal={closeStandingsModal}
            tournament={tournament}
          />
        )}

        {showResetModal && (
          <ResetModal
            showResetModal={showResetModal}
            setShowResetModal={setShowResetModal}
            showSaveStatsConfirmation={showSaveStatsConfirmation}
            setShowSaveStatsConfirmation={setShowSaveStatsConfirmation}
            statsAlreadySaved={statsAlreadySaved}
            setStatsAlreadySaved={setStatsAlreadySaved}
            resetTournament={resetTournament}
            resetPassword={resetPassword}
            setResetPassword={setResetPassword}
            resetPasswordError={resetPasswordError}
            setResetPasswordError={setResetPasswordError}
            resetting={resetting}
            tournament={tournament}
            seasonStartDate={seasonStartDate || new Date()}
            seasonEndDate={seasonEndDate || new Date()}
            saveCurrentSeasonStats={saveCurrentSeasonStats}
          />
        )}
      </div>
      {tournament && (
        <BottomBar
          loadingStandings={loadingStandings}
          openStandingsModal={openStandingsModal}
          openSeasonHistoryModal={openSeasonHistoryModal}
          savingSeasonStats={savingSeasonStats}
          saveCurrentSeasonStats={saveCurrentSeasonStats}
          user={user}
          setAuthModalPurpose={setAuthModalPurpose}
          setShowAuthModal={setShowAuthModal}
          standings={standings}
          openResetModal={openResetModal}
        />
      )}
      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        setIsOpen={setShowAuthModal}
        description={
          authModalPurpose === "standings"
            ? "Vui lòng đăng nhập để xem bảng xếp hạng của giải đấu."
            : authModalPurpose === "history"
              ? "Vui lòng đăng nhập để xem lịch sử các mùa giải."
              : "Vui lòng đăng nhập để lưu thống kê mùa giải hiện tại."
        }
      />
      {/* Add Team Modal */}
      {showAddTeamModal && (
        <AddTeamModal
          showAddTeamModal={showAddTeamModal}
          setShowAddTeamModal={setShowAddTeamModal}
          newTeamName={newTeamName}
          setNewTeamName={setNewTeamName}
          newTeamAvatar={avatarUrl}
          setNewTeamAvatar={setAvatarUrl}
          addTeamError={addTeamError}
          setAddTeamError={setAddTeamError}
          addingTeam={addingTeam}
          tournament={tournament}
          addNewTeam={addNewTeam}
          handleFileChange={handleFileChange}
          isUploadingAvatar={uploadingAvatar}
        />
      )}
      {/* Edit Team Modal */}
      {showEditTeamModal && (
        <EditTeamModal
          showEditTeamModal={showEditTeamModal}
          setShowEditTeamModal={setShowEditTeamModal}
          editingTeam={editingTeam}
          setEditingTeam={setEditingTeam}
          editingTeamId={editingTeamId}
          editTeamError={editTeamError}
          setEditTeamError={setEditTeamError}
          editTeamName={editTeamName}
          setEditTeamName={setEditTeamName}
          setAvatarUrl={setAvatarUrl}
          updateTeam={updateTeam}
          addingTeam={addingTeam}
          setDeletingTeam={setDeletingTeam}
          setDeletingTeamId={setDeletingTeamId}
          setShowDeleteTeamModal={setShowDeleteTeamModal}
          tournament={tournament}
          avatarUrl={avatarUrl}
          handleFileChange={handleFileChange}
          showEditTeam={showEditTeam}
          setShowEditTeam={setShowEditTeam}
          setEditingTeamId={setEditingTeamId}
          isUploadingAvatar={uploadingAvatar}
        />
      )}

      {/* Delete Team Confirmation Modal */}
      {showDeleteTeamModal && deletingTeam && (
        <DeleteTeamModal
          deletingInProgress={deletingInProgress}
          setShowDeleteTeamModal={setShowDeleteTeamModal}
          setDeletingTeam={setDeletingTeam}
          setDeletingTeamId={setDeletingTeamId}
          setDeleteTeamError={setDeleteTeamError}
          deletingTeam={deletingTeam}
          deleteTeamError={deleteTeamError}
          deleteTeam={deleteTeam}
        />
      )}
      {/* Season History Modal */}
      {showSeasonHistoryModal && (
        <SeasonHistoryModal
          showSeasonHistoryModal={showSeasonHistoryModal}
          setShowSeasonHistoryModal={setShowSeasonHistoryModal}
          seasonHistory={seasonHistory}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          loadingSeasonStandings={loadingSeasonStandings}
          seasonStandings={seasonStandings}
          fetchSeasonStandings={fetchSeasonStandings}
        />
      )}
      {/* Lock Password Modal */}
      {showLockPasswordModal && lockingItem && (
        <LockPasswordModal
          showLockPasswordModal={showLockPasswordModal}
          setShowLockPasswordModal={setShowLockPasswordModal}
          lockingItem={lockingItem}
          setLockingItem={setLockingItem}
          lockPassword={lockPassword}
          setLockPassword={setLockPassword}
          lockPasswordError={lockPasswordError}
          setLockPasswordError={setLockPasswordError}
          handleUnlock={handleUnlock}
          togglingLock={togglingLock}
          togglingMatchLock={togglingMatchLock}
          togglingTeamAddLock={togglingTeamAddLock}
          isPrivate={tournament?.isPrivate}
        />
      )}
      {/* Team Add Lock Confirmation Modal */}
      {showTeamAddLockConfirmation && (
        <TeamAddLockConfirmationModal
          showTeamAddLockConfirmation={showTeamAddLockConfirmation}
          setShowTeamAddLockConfirmation={setShowTeamAddLockConfirmation}
          confirmTeamAddingLock={confirmTeamAddingLock}
          togglingTeamAddLock={togglingTeamAddLock}
        />
      )}
      {/* Head to Head History Modal */}
      {showHeadToHeadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeHeadToHeadModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="inline-block align-bottom   rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="  rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={closeHeadToHeadModal}
                >
                  <span className="sr-only">Đóng</span>
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="  px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Thống kê đối đầu
                    </h3>

                    <div className="mt-4">
                      <HeadToHeadHistory
                        homeTeam={headToHeadHomeTeam}
                        awayTeam={headToHeadAwayTeam}
                        history={headToHeadHistory}
                        isLoading={loadingHeadToHead}
                        showPrediction={showPrediction}
                      />

                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id="showPrediction"
                          checked={showPrediction}
                          onChange={() => setShowPrediction(!showPrediction)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="showPrediction"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Hiển thị dự đoán trận đấu
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeHeadToHeadModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
