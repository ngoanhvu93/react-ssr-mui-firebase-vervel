import React, { useState, useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, Eye, EyeOff, Plus, LogIn, Loader, Icon } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import toast from "react-hot-toast";
import {
  getSavedRoomPassword,
  saveRoomPassword,
  removeSavedRoomPassword,
} from "../utils/password-storage";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { CustomButton } from "~/components/CustomButton";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import PlayerAvatar from "~/components/PlayerAvatar";
import { db } from "firebase/firebase";
import { TopAppBar } from "~/components/TopAppBar";
import CustomSearch from "~/components/CustomSearch";
import AppBar from "@mui/material/AppBar";
import Card from "@mui/material/Card";
import type { ILottoRoom } from "firebase/types";

const ROOMS_PER_PAGE = 10;

// Skeleton component for room loading state
const RoomSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="w-48 h-5 bg-gray-200 rounded mb-2"></div>
          <div className="w-24 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mt-3 flex">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="size-[48px] rounded-full bg-gray-200 -mr-4 border-2 border-white"
            style={{ zIndex: i }}
          ></div>
        ))}
      </div>
    </div>
  );
};

// Skeleton for selected room view
const SelectedRoomSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="w-3/4 h-7 bg-gray-200 rounded mb-4"></div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-gray-200"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="w-64 h-5 bg-gray-200 rounded mb-2"></div>
        <div className="relative h-12 bg-gray-100 rounded-md mb-1"></div>
        <div className="mt-2">
          <div className="w-48 h-5 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div className="w-full h-12 bg-gray-200 rounded-md"></div>
    </div>
  );
};

const JoinLottoRoom = () => {
  const [rooms, setRooms] = useState<ILottoRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<ILottoRoom | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [joiningRoom, setJoiningRoom] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
  const [hasMoreRooms, setHasMoreRooms] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [selectedRoomLoading, setSelectedRoomLoading] = useState(false);
  const [selectingRoomId, setSelectingRoomId] = useState<string | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  // Handle keyboard event for search input
  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setShowClearButton(false);
      setShowSearch(false);
      (e.target as HTMLInputElement).blur();
    }
  };

  // Focus search input when search dialog opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  // Load rooms on component mount with optimized query based on filters
  useEffect(() => {
    setLoading(true);

    const roomsQuery = query(
      collection(db, "lotto-rooms"),
      orderBy("createdAt", "desc"),
      limit(ROOMS_PER_PAGE)
    );

    const unsubscribe = onSnapshot(
      roomsQuery,
      (snapshot) => {
        const roomsList: ILottoRoom[] = [];
        snapshot.forEach((doc) => {
          roomsList.push({ id: doc.id, ...doc.data() } as ILottoRoom);
        });

        setRooms(roomsList);
        setLoading(false);

        if (snapshot.docs.length > 0) {
          setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
          setHasMoreRooms(snapshot.docs.length >= ROOMS_PER_PAGE);
        } else {
          setHasMoreRooms(false);
        }

        if (selectedRoom) {
          const updatedRoom = roomsList.find(
            (room) => room.id === selectedRoom.id
          );
          if (updatedRoom) {
            setSelectedRoom(updatedRoom);
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

  const handleRoomSelect = (room: ILottoRoom) => {
    setSelectingRoomId(room.id);

    // Add a slight delay before transitioning to the room view
    // This creates a smoother visual experience
    setTimeout(() => {
      setSelectedRoomLoading(true);
      setSelectedRoom(room);
      setPasswordError("");

      // Simulate loading delay for better UX
      setTimeout(() => {
        setSelectedRoomLoading(false);
        setSelectingRoomId(null);
      }, 600);
    }, 300);
  };

  useEffect(() => {
    if (selectedRoom) {
      const savedPassword = getSavedRoomPassword(selectedRoom.id);
      if (savedPassword) {
        setPassword(savedPassword);
        setRememberPassword(true);
      } else {
        setPassword("");
        setRememberPassword(false);
      }
    }
  }, [selectedRoom]);

  const handlePasswordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleJoinRoom();
    }
  };

  const saveRoomToUserRooms = async (roomId: string) => {
    try {
      const userId = localStorage.getItem("lottoUserId");
      if (!userId) return;

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        rooms: arrayUnion(roomId),
      });
    } catch (error) {
      console.error("Error saving room to user rooms:", error);
    }
  };

  const handleJoinRoom = () => {
    if (!selectedRoom) return;

    if (selectedRoom.password && password !== selectedRoom.password) {
      setPasswordError("Mật khẩu không đúng. Vui lòng thử lại.");
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    if (selectedRoom.password && rememberPassword) {
      saveRoomPassword(selectedRoom.id, password);
    } else if (selectedRoom.password) {
      removeSavedRoomPassword(selectedRoom.id);
    }

    setJoiningRoom(true);

    // Save room to user's rooms
    saveRoomToUserRooms(selectedRoom.id);

    // Add slight delay for better UX - feels more responsive
    setTimeout(() => {
      navigate(`/lotto-room/${selectedRoom.id}`);
    }, 300);
  };

  const formatCreatedAt = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate(); // Chuyển Firestore Timestamp thành Date
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      return "";
    }
  };

  const removeVietnameseAccents = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const filteredRooms =
    searchQuery.trim() === ""
      ? rooms
      : rooms.filter((room) => {
          const roomNameLower = room.name.toLowerCase();
          const roomNameNoAccent = removeVietnameseAccents(roomNameLower);
          const searchLower = searchQuery.toLowerCase();

          // isLike search - kiểm tra cả có dấu và không dấu
          return searchLower
            .split(/\s+/)
            .some(
              (word) =>
                word &&
                (roomNameLower.includes(word) ||
                  roomNameNoAccent.includes(removeVietnameseAccents(word)))
            );
        });

  const loadMoreRooms = async () => {
    if (!lastVisibleDoc || !hasMoreRooms || loadingMore) return;

    setLoadingMore(true);

    try {
      const nextRoomsQuery = query(
        collection(db, "lotto-rooms"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisibleDoc),
        limit(ROOMS_PER_PAGE)
      );

      // Add slight delay for better UX with skeleton loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      const snapshot = await getDocs(nextRoomsQuery);

      const newRooms: ILottoRoom[] = [];
      snapshot.forEach((doc) => {
        const roomData = doc.data();
        newRooms.push({
          id: doc.id,
          ...roomData,
          players: roomData.players || [],
        } as ILottoRoom);
      });

      setRooms((prevRooms) => [...prevRooms, ...newRooms]);

      if (snapshot.docs.length > 0) {
        setLastVisibleDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMoreRooms(snapshot.docs.length >= ROOMS_PER_PAGE);
      } else {
        setHasMoreRooms(false);
      }
    } catch (error) {
      console.error("Error loading more rooms:", error);
      toast.error("Không thể tải thêm phòng. Vui lòng thử lại sau.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        title={selectedRoom ? "Tham gia phòng" : "Chọn phòng"}
        onBack={() => {
          if (selectedRoom) {
            setSelectedRoom(null);
          } else if (from === "home") {
            navigate("/");
          } else if (from === "games") {
            navigate("/games");
          } else if (from === "search") {
            navigate("/search");
          } else {
            navigate("/");
          }
        }}
        showSearch={true}
        onSearch={() => {
          setShowSearch(!showSearch);
        }}
      >
        {!selectedRoom && showSearch && (
          <CustomSearch
            placeholder="Tìm kiếm phòng lô tô"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showClearButton={showClearButton}
            setShowClearButton={setShowClearButton}
            searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredRooms.length > 0) {
                handleRoomSelect(filteredRooms[0]);
              } else if (e.key === "Escape") {
                setShowSearch(false);
                setSearchQuery("");
                setShowClearButton(false);
              }
            }}
          />
        )}
      </TopAppBar>

      <div className="flex flex-col items-center w-full mx-auto">
        <div className="grow overflow-y-auto w-full p-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          {selectedRoom ? (
            selectedRoomLoading ? (
              <SelectedRoomSkeleton />
            ) : (
              <>
                <div className="text-xl font-bold mb-4">
                  Tên phòng: "{selectedRoom.name}"
                </div>
                <Card className="mb-4 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className=" my-2">
                      {(selectedRoom.players ?? []).length > 0
                        ? `${(selectedRoom.players ?? []).length} người`
                        : "Chưa có người"}
                    </p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 justify-between">
                    {selectedRoom.players?.map((player, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center gap-1"
                      >
                        <PlayerAvatar
                          player={{
                            name: player.name,
                            avatar: player.avatar || "",
                          }}
                          size="medium"
                          index={index}
                        />
                        <div className="text-sm font-semibold ">
                          {player.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium  mb-1"
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
                      ref={passwordInputRef}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError("");
                      }}
                      onKeyDown={handlePasswordKeyDown}
                      className={`pl-10 w-full px-4 py-2 border ${
                        passwordError
                          ? "border-red-500 focus:ring-red-500"
                          : "border focus:ring-indigo-500"
                      } rounded-md focus:outline-none focus:ring-2`}
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center "
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                  )}

                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberPassword}
                        onChange={(e) => setRememberPassword(e.target.checked)}
                        className="rounded border text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm ">
                        Ghi nhớ mật khẩu cho lần sau
                      </span>
                    </label>
                  </div>
                </div>
                <CustomButton
                  onClick={handleJoinRoom}
                  className="w-full"
                  disabled={joiningRoom || !!passwordError || !password}
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
            )
          ) : (
            <>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, index) => (
                    <RoomSkeleton key={index} />
                  ))}
                </div>
              ) : filteredRooms.length > 0 ? (
                <div className="space-y-4">
                  {filteredRooms.map((room, index) => (
                    <div
                      key={room.id}
                      onClick={() => {
                        setShowSearch(false);
                        handleRoomSelect(room);
                      }}
                      className={`${
                        bgColors[index % bgColors.length]
                      } border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group ${
                        selectingRoomId === room.id
                          ? "animate-pulse border-indigo-500 shadow-md"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {room.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatCreatedAt(room.createdAt)}
                          </div>
                        </div>
                        {room.players && room.players.length > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-500">
                              {room.players.length} người
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Hiển thị avatar của người chơi */}
                      <div className="mt-3">
                        {room.players && room.players.length > 7 ? (
                          <div className="relative">
                            {/* Overlapping avatars row */}
                            <div className="flex items-center">
                              {room.players.slice(0, 7).map((player, index) => (
                                <div
                                  key={index}
                                  className="relative -mr-4 "
                                  style={{ zIndex: index }}
                                >
                                  <PlayerAvatar
                                    player={{
                                      name: player.name,
                                      avatar: player.avatar || "",
                                    }}
                                    size="large"
                                    index={index}
                                  />
                                </div>
                              ))}

                              {room.players.length > 7 && (
                                <div
                                  className="relative -mr-4 "
                                  style={{ zIndex: 7 }}
                                >
                                  <PlayerAvatar
                                    player={{
                                      name: `${"+"}${room.players.length - 7}`,
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
                            {room?.players?.map((player, index) => (
                              <div
                                key={index}
                                className="relative -mr-4 "
                                style={{ zIndex: index }}
                              >
                                <PlayerAvatar
                                  player={{
                                    name: player.name,
                                    avatar: player.avatar || "",
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

                  <LoadMoreButton
                    searchQuery={searchQuery}
                    hasMore={hasMoreRooms}
                    loadMore={loadMoreRooms}
                    loadingMore={loadingMore}
                  />
                </div>
              ) : (
                <>
                  {filteredRooms.length === 0 && searchQuery && (
                    <Card className="p-4 flex flex-col items-center justify-center">
                      <div className="mb-4">🔍</div>
                      <p className="mb-2 text-center">
                        Không tìm thấy phòng lô tô nào với từ khóa "
                        {searchQuery}"
                      </p>
                      <CustomButton
                        icon={<Plus />}
                        variant="primary"
                        className="w-full active:scale-[0.98] transition-transform"
                        onClick={() => {
                          navigate("/create-lotto-room");
                        }}
                      >
                        Tạo phòng lô tô mới
                      </CustomButton>
                    </Card>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {!selectedRoom && filteredRooms.length > 0 && (
        <AppBar
          className="flex-none z-10 bottom-0 p-4 w-full"
          position="sticky"
          sx={(theme) => ({
            position: "sticky",
            bottom: 0,
            zIndex: 40,
            width: "100%",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 2px 8px rgba(0,0,0,0.5)"
                : "0 2px 4px rgba(0,0,0,0.08)",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(24, 24, 28, 0.85)"
                : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
            color: theme.palette.text.primary,
            borderTop:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(0,0,0,0.06)",
          })}
        >
          <CustomButton
            icon={<Plus />}
            variant="primary"
            className="w-full active:scale-[0.98] transition-transform"
            onClick={() => {
              navigate("/create-lotto-room");
            }}
          >
            Tạo phòng lô tô mới
          </CustomButton>
        </AppBar>
      )}
    </div>
  );
};

export default JoinLottoRoom;
