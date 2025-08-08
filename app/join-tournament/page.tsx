import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, Eye, EyeOff, Plus, LogIn, Loader, Calendar } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import type { Tournament } from "../../firebase/types";
import toast from "react-hot-toast";
import {
  getSavedRoomPassword,
  saveRoomPassword,
  removeSavedRoomPassword,
} from "../utils/password-storage";
import { CustomButton } from "~/components/CustomButton";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import PlayerAvatar from "~/components/PlayerAvatar";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { cn } from "~/utils/cn";
import TournamentSkeleton from "./components/TournamentSkeleton";
import TournamentDetailsSkeleton from "./components/TournamentDetailsSkeleton";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import AuthModal from "~/components/AuthModal";
import AppHeaderSection from "./components/AppHeaderSection";

// Function to normalize text by removing diacritics
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

const JoinTournament: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [myTournamentsLoading, setMyTournamentsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
  const [hasMoreTournaments, setHasMoreTournaments] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tournamentDetailsLoading, setTournamentDetailsLoading] =
    useState(false);
  const [viewMode, setViewMode] = useState<"all" | "my">("all");
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const TOURNAMENTS_PER_PAGE = 10;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const bgColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-purple-50",
    "bg-pink-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-teal-50",
    "bg-indigo-50",
  ];

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && viewMode === "my") {
        loadMyTournaments(currentUser.uid);
      } else if (!currentUser) {
        // Switch to "all" view when user logs out
        setViewMode("all");
      }
    });

    return () => unsubscribe();
  }, [viewMode]);

  useEffect(() => {
    setLoading(true);

    const tournamentsQuery = query(
      collection(db, "tournaments"),
      orderBy("createdAt", "desc"),
      limit(TOURNAMENTS_PER_PAGE)
    );

    const unsubscribe = onSnapshot(
      tournamentsQuery,
      (snapshot) => {
        const tournamentsList: Tournament[] = [];
        snapshot.forEach((doc) => {
          const tournamentData = doc.data();
          // Only add public tournaments to the list in "all" view
          if (!tournamentData.isPrivate) {
            tournamentsList.push({
              id: doc.id,
              ...tournamentData,
            } as Tournament);
          }
        });

        setTournaments(tournamentsList);
        setLoading(false);

        if (snapshot.docs.length > 0) {
          setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
          setHasMoreTournaments(snapshot.docs.length >= TOURNAMENTS_PER_PAGE);
        } else {
          setHasMoreTournaments(false);
        }

        if (selectedTournament) {
          const updatedTournament = tournamentsList.find(
            (tournament) => tournament.id === selectedTournament.id
          );
          if (updatedTournament) {
            setSelectedTournament(updatedTournament);
          }
        }
      },
      (error) => {
        console.error("Error listening to rooms:", error);
        setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Load user's joined tournaments
  const loadMyTournaments = async (userId: string) => {
    if (!userId) return;

    setMyTournamentsLoading(true);
    try {
      const userTournamentsRef = collection(
        db,
        "users",
        userId,
        "joinedTournaments"
      );
      const userTournamentsQuery = query(
        userTournamentsRef,
        orderBy("joinedAt", "desc")
      );

      const snapshot = await getDocs(userTournamentsQuery);

      if (snapshot.empty) {
        setMyTournaments([]);
        setMyTournamentsLoading(false);
        return;
      }

      // Get all tournament IDs
      const tournamentIds = snapshot.docs.map((doc) => doc.id);

      // Fetch the actual tournament data from the tournaments collection
      const tournamentsData: Tournament[] = [];

      for (const tournamentId of tournamentIds) {
        const tournamentDoc = await getDoc(
          doc(db, "tournaments", tournamentId)
        );
        if (tournamentDoc.exists()) {
          tournamentsData.push({
            id: tournamentDoc.id,
            ...tournamentDoc.data(),
          } as Tournament);
        }
      }

      setMyTournaments(tournamentsData);
    } catch (error) {
      console.error("Error loading user tournaments:", error);
      toast.error(
        "Không thể tải danh sách giải đấu của bạn. Vui lòng thử lại sau."
      );
    } finally {
      setMyTournamentsLoading(false);
    }
  };

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setPasswordError("");
    setTournamentDetailsLoading(true);

    // Simulate loading for better UX
    setTimeout(() => {
      setTournamentDetailsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (selectedTournament) {
      const savedPassword = getSavedRoomPassword(selectedTournament.id);
      if (savedPassword) {
        setPassword(savedPassword);
        setRememberPassword(true);
      } else {
        setPassword("");
        setRememberPassword(false);
      }
    }
  }, [selectedTournament]);

  const handleJoinRoom = async () => {
    if (!selectedTournament) return;

    // Không yêu cầu mật khẩu nếu là giải đấu của người dùng (viewMode === "my")
    // hoặc nếu giải đấu được đặt là riêng tư
    if (
      viewMode === "my" ||
      selectedTournament.isPrivate ||
      password === selectedTournament.password
    ) {
      if (rememberPassword && password && !selectedTournament.isPrivate) {
        saveRoomPassword(selectedTournament.id, password);
      } else if (!rememberPassword) {
        removeSavedRoomPassword(selectedTournament.id);
      }
      setJoiningRoom(true);

      // Save to user's joined tournaments if logged in
      if (user) {
        try {
          await setDoc(
            doc(
              db,
              "users",
              user.uid,
              "joinedTournaments",
              selectedTournament.id
            ),
            {
              tournamentId: selectedTournament.id,
              joinedAt: new Date(),
              tournamentName: selectedTournament.name,
            }
          );
        } catch (error) {
          console.error("Error saving to joined tournaments:", error);
          // Don't prevent navigation if this fails
        }
      }

      if (selectedTournament.tournamentType === "round robin") {
        navigate(`/round-robin-tournament/${selectedTournament.id}`);
      } else if (selectedTournament.tournamentType === "knockout") {
        navigate(`/knockout-tournament/${selectedTournament.id}`);
      } else if (selectedTournament.tournamentType === "group") {
        navigate(`/group-tournament/${selectedTournament.id}`);
      }
    } else {
      setPasswordError("Mật khẩu không đúng. Vui lòng thử lại.");
    }
  };

  const formatCreatedAt = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  };

  const handleViewMyTournaments = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setViewMode("my");
    loadMyTournaments(user.uid);
  };

  const handleViewAllTournaments = () => {
    setViewMode("all");
  };

  const filteredTournaments = (
    viewMode === "all" ? tournaments : myTournaments
  ).filter((tournament) => {
    const normalizedName = normalizeText(tournament.name);
    const normalizedQuery = normalizeText(searchQuery);
    return normalizedName.includes(normalizedQuery);
  });

  const loadMoreTournaments = async () => {
    if (!lastVisibleDoc || !hasMoreTournaments || viewMode === "my") return;

    setLoadingMore(true);

    try {
      const nextTournamentsQuery = query(
        collection(db, "tournaments"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisibleDoc),
        limit(TOURNAMENTS_PER_PAGE)
      );

      const snapshot = await getDocs(nextTournamentsQuery);

      const newTournaments: Tournament[] = [];
      snapshot.forEach((doc) => {
        const tournamentData = doc.data();
        // Only add public tournaments to the list in "all" view
        if (!tournamentData.isPrivate) {
          newTournaments.push({
            id: doc.id,
            ...tournamentData,
            teams: tournamentData.teams || [],
          } as Tournament);
        }
      });

      setTournaments((prevTournaments) => [
        ...prevTournaments,
        ...newTournaments,
      ]);

      if (snapshot.docs.length > 0) {
        setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreTournaments(snapshot.docs.length >= TOURNAMENTS_PER_PAGE);
      } else {
        setHasMoreTournaments(false);
      }
    } catch (error) {
      console.error("Error loading more tournaments:", error);
      toast.error("Không thể tải thêm giải đấu. Vui lòng thử lại sau.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <AppHeaderSection
        selectedTournament={selectedTournament}
        setSelectedTournament={setSelectedTournament}
        from={from ?? ""}
        navigate={navigate}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showClearButton={showClearButton}
        setShowClearButton={setShowClearButton}
        searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
        handleTournamentSelect={handleTournamentSelect}
        handleViewAllTournaments={handleViewAllTournaments}
        handleViewMyTournaments={handleViewMyTournaments}
        viewMode={viewMode}
        filteredTournaments={filteredTournaments}
      />

      <div className="flex flex-col items-center mx-auto w-full">
        <div className="h-full grow overflow-y-auto w-full p-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          {selectedTournament ? (
            <>
              {tournamentDetailsLoading ? (
                <TournamentDetailsSkeleton />
              ) : (
                <>
                  <div className="text-xl font-bold mb-4">
                    Tham gia giải đấu: "{selectedTournament.name}"
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-gray-500 my-2">
                        {(selectedTournament.teams ?? []).length > 0
                          ? `${(selectedTournament.teams ?? []).length} đội`
                          : "Chưa có đội"}
                      </p>
                    </div>
                    {selectedTournament.isPrivate && (
                      <div className="flex items-center gap-2 mb-2">
                        <Lock size={16} className="text-gray-500" />
                        <p className="text-gray-500">Giải đấu riêng tư</p>
                      </div>
                    )}
                    {selectedTournament.startDate && (
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-gray-500" />
                        <p className="text-gray-500">
                          Bắt đầu:{" "}
                          {format(
                            typeof selectedTournament.startDate === "object" &&
                              selectedTournament.startDate !== null &&
                              "seconds" in selectedTournament.startDate &&
                              typeof selectedTournament.startDate.seconds ===
                                "number"
                              ? new Date(
                                  selectedTournament.startDate.seconds * 1000
                                )
                              : new Date(selectedTournament.startDate),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </p>
                      </div>
                    )}
                    <div
                      className={cn(
                        "grid grid-cols-4 gap-4 justify-between rounded-lg",
                        {
                          "bg-gray-100 p-3":
                            (selectedTournament.teams ?? []).length > 0,
                        }
                      )}
                    >
                      {selectedTournament.teams?.map((team, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-1"
                        >
                          <PlayerAvatar
                            player={{
                              name: team.name,
                              avatar: team.avatar || "",
                            }}
                            size="medium"
                            index={index}
                          />
                          <div className="text-sm text-center font-semibold text-gray-500">
                            {team.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {viewMode !== "my" && !selectedTournament.isPrivate && (
                    <div className="mb-4">
                      <label
                        htmlFor="password"
                        className="block text-sm  font-medium text-gray-700 mb-1"
                      >
                        Nhập mật khẩu phòng để tham gia{" "}
                        <span className="text-red-500">(*)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError("");
                          }}
                          className={`pl-10 w-full px-4 py-2 border ${
                            passwordError
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-indigo-500"
                          } rounded-md focus:outline-none focus:ring-2`}
                          placeholder="Nhập mật khẩu"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordError}
                        </p>
                      )}

                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={rememberPassword}
                            onChange={(e) =>
                              setRememberPassword(e.target.checked)
                            }
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Ghi nhớ mật khẩu cho lần sau
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                  <CustomButton
                    onClick={handleJoinRoom}
                    className="w-full"
                    disabled={
                      viewMode !== "my" &&
                      !selectedTournament.isPrivate &&
                      (joiningRoom || !!passwordError || !password)
                    }
                    icon={<LogIn size={20} />}
                  >
                    {joiningRoom ? (
                      <div className="flex w-full items-center justify-center">
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Đang vào...
                      </div>
                    ) : (
                      "Tham gia"
                    )}
                  </CustomButton>
                </>
              )}
            </>
          ) : (
            <div>
              {(viewMode === "all" && loading) ||
              (viewMode === "my" && myTournamentsLoading) ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, index) => (
                    <TournamentSkeleton key={index} />
                  ))}
                </div>
              ) : filteredTournaments.length > 0 ? (
                <div className="space-y-4">
                  {filteredTournaments.map((tournament, index) => (
                    <div
                      key={tournament.id}
                      onClick={() => handleTournamentSelect(tournament)}
                      className={`${
                        bgColors[index % bgColors.length]
                      } border border-gray-200 rounded-lg p-4  hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {tournament.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatCreatedAt(tournament.createdAt)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {tournament.isPrivate && (
                            <div className="flex items-center gap-1">
                              <Lock size={14} className="text-gray-500" />
                              <span className="text-xs text-gray-500">
                                Riêng tư
                              </span>
                            </div>
                          )}
                          {tournament.teams && tournament.teams.length > 0 && (
                            <>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm text-gray-500">
                                  {tournament.teams.length} đội
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Hiển thị avatar của người chơi */}
                      <div className="mt-3">
                        {tournament.teams && tournament.teams.length > 7 ? (
                          <div className="relative">
                            {/* Overlapping avatars row */}
                            <div className="flex items-center">
                              {tournament.teams
                                .slice(0, 7)
                                .map((team, index) => (
                                  <div
                                    key={index}
                                    className="relative -mr-4"
                                    style={{ zIndex: index }}
                                  >
                                    <PlayerAvatar
                                      player={{
                                        name: team.name,
                                        avatar: team.avatar || "",
                                      }}
                                      size="large"
                                      index={index}
                                    />
                                  </div>
                                ))}

                              {tournament.teams.length > 7 && (
                                <div
                                  className="relative -mr-4"
                                  style={{ zIndex: 7 }}
                                >
                                  <PlayerAvatar
                                    player={{
                                      name: `${"+"}${
                                        tournament.teams.length - 7
                                      }`,
                                      avatar: "",
                                    }}
                                    size="large"
                                    isShowFullname={true}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {tournament.teams?.map((team, index) => (
                              <div
                                key={index}
                                className="relative -mr-4"
                                style={{ zIndex: index }}
                              >
                                <PlayerAvatar
                                  player={{
                                    name: team.name,
                                    avatar: team.avatar || "",
                                  }}
                                  size="large"
                                  index={index}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {viewMode === "all" && (
                    <LoadMoreButton
                      searchQuery={searchQuery}
                      hasMore={hasMoreTournaments}
                      loadMore={loadMoreTournaments}
                      loadingMore={loadingMore}
                    />
                  )}
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-fade-in">
                  <div className="text-gray-500">
                    {filteredTournaments.length === 0 && searchQuery && (
                      <>
                        <div className="mb-4">🔍</div>
                        <p className="mb-2">
                          Không tìm thấy giải đấu nào với từ khóa "{searchQuery}
                          "
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Xóa từ khóa tìm kiếm
                        </button>
                      </>
                    )}
                    {filteredTournaments.length === 0 &&
                      !searchQuery &&
                      viewMode === "all" && (
                        <>
                          <div className="mb-4">✨</div>
                          <p>Chưa có giải đấu nào. Hãy tạo giải đấu mới!</p>
                        </>
                      )}
                    {filteredTournaments.length === 0 &&
                      !searchQuery &&
                      viewMode === "my" && (
                        <>
                          <div className="mb-4">📃</div>
                          <p>Bạn chưa tham gia giải đấu nào.</p>
                          <button
                            onClick={handleViewAllTournaments}
                            className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                          >
                            Khám phá giải đấu
                          </button>
                        </>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!selectedTournament && (
        <div className="flex-none sticky z-10 bottom-0  /80 backdrop-blur-md border-t border-gray-100 p-4">
          <CustomButton
            icon={<Plus />}
            variant="primary"
            className="w-full active:scale-[0.98] transition-transform"
            onClick={() => {
              if (!user) {
                setShowAuthModal(true);
                return;
              }
              navigate("/create-tournament");
            }}
          >
            Tạo giải đấu mới
          </CustomButton>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        setIsOpen={setShowAuthModal}
        description="Bạn cần đăng nhập để thực hiện tính năng này"
      />
    </div>
  );
};

export default JoinTournament;
