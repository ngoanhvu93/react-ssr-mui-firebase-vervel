import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, Eye, EyeOff, Plus, LogIn, Loader } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { Room } from "../../firebase/types";
import toast from "react-hot-toast";
import {
  getSavedRoomPassword,
  saveRoomPassword,
  removeSavedRoomPassword,
} from "../utils/password-storage";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import PlayerAvatar from "~/components/PlayerAvatar";
import { LoadMoreButton } from "~/components/LoadMoreButton";
import { removeAccents } from "~/utils/string-utils";
import { CustomButton } from "~/components/CustomButton";
import CustomSearch from "~/components/CustomSearch";
import { TopAppBar } from "~/components/TopAppBar";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Skeleton component for room loading
const RoomSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="h-5 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="mt-3 flex">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="size-12 rounded-full border border-white bg-gray-200 -mr-4"
                    style={{ zIndex: i }}
                  ></div>
                ))}
            </div>
          </div>
        ))}
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

const JoinRoomPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const ROOMS_PER_PAGE = 10;
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

  useEffect(() => {
    setLoading(true);

    const roomsQuery = query(
      collection(db, "rooms"),
      orderBy("createdAt", "desc"),
      limit(ROOMS_PER_PAGE)
    );

    const unsubscribe = onSnapshot(
      roomsQuery,
      (snapshot) => {
        const roomsList: Room[] = [];
        snapshot.forEach((doc) => {
          roomsList.push({ id: doc.id, ...doc.data() } as Room);
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

  const handleRoomSelect = (room: Room) => {
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

  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleJoinRoom();
    }
  };

  const handleJoinRoom = () => {
    if (!selectedRoom) return;

    if (password === selectedRoom.password) {
      if (rememberPassword) {
        saveRoomPassword(selectedRoom.id, password);
      } else {
        removeSavedRoomPassword(selectedRoom.id);
      }
      setJoiningRoom(true);

      // Add slight delay for better UX - feels more responsive
      setTimeout(() => {
        navigate(`/thirteen-card-room/${selectedRoom.id}`);
      }, 300);
    } else {
      setPasswordError("Mật khẩu không đúng. Vui lòng thử lại.");
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
  };

  const formatCreatedAt = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate(); // Chuyển Firestore Timestamp thành Date
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  };

  const filteredRooms = rooms.filter((room) => {
    // Apply accent-insensitive search
    const normalizedRoomName = removeAccents(room.name.toLowerCase());
    const normalizedQuery = removeAccents(searchQuery.toLowerCase());
    return normalizedRoomName.includes(normalizedQuery);
  });

  const loadMoreRooms = async () => {
    if (!lastVisibleDoc || !hasMoreRooms || loadingMore) return;

    setLoadingMore(true);

    try {
      const nextRoomsQuery = query(
        collection(db, "rooms"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisibleDoc),
        limit(ROOMS_PER_PAGE)
      );

      const snapshot = await getDocs(nextRoomsQuery);

      const newRooms: Room[] = [];
      snapshot.forEach((doc) => {
        const roomData = doc.data();
        newRooms.push({
          id: doc.id,
          ...roomData,
          players: roomData.players || [],
        } as Room);
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
        showSearch={!selectedRoom}
        onSearch={() => {
          setShowSearch(!showSearch);
        }}
      >
        {!selectedRoom && showSearch && (
          <CustomSearch
            placeholder="Tìm kiếm phòng chơi bài"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showClearButton={showClearButton}
            setShowClearButton={setShowClearButton}
            searchInputRef={searchInputRef as React.RefObject<HTMLInputElement>}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRoomSelect(filteredRooms[0]);
              }
            }}
          />
        )}
      </TopAppBar>

      <div className="flex flex-col items-center w-full mx-auto">
        <div className="h-full grow overflow-y-auto w-full p-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          {selectedRoom ? (
            <>
              {selectedRoomLoading ? (
                <SelectedRoomSkeleton />
              ) : (
                <>
                  <div className="text-xl font-bold mb-4">
                    Tham gia phòng chơi bài: "{selectedRoom.name}"
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className=" my-2">
                        {(selectedRoom.players ?? []).length > 0
                          ? `${(selectedRoom.players ?? []).length} người chơi`
                          : "Chưa có người"}
                      </p>
                    </div>
                    <Card className="grid grid-cols-4 gap-4 justify-between rounded-lg p-4">
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
                          <div className="text-sm font-semibold text-center">
                            {player.name}
                          </div>
                        </div>
                      ))}
                    </Card>
                  </div>

                  <div className="mb-4">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="outlined-adornment-password">
                        Mật khẩu
                      </InputLabel>
                      <OutlinedInput
                        onKeyDown={handlePasswordKeyDown}
                        fullWidth
                        placeholder="Nhập mật khẩu"
                        id="outlined-adornment-password"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showPassword
                                  ? "hide the password"
                                  : "display the password"
                              }
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>
                    {passwordError && (
                      <FormHelperText error className="mt-1">
                        {passwordError}
                      </FormHelperText>
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={rememberPassword}
                          onChange={(e) =>
                            setRememberPassword(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Ghi nhớ mật khẩu"
                      className="mt-1 "
                    />
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
              )}
            </>
          ) : (
            <div>
              {loading ? (
                <RoomSkeleton />
              ) : filteredRooms.length > 0 ? (
                <div className="space-y-4">
                  {filteredRooms.map((room, index) => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomSelect(room)}
                      className={`${
                        bgColors[index % bgColors.length]
                      } border border-gray-200 rounded-lg p-4  hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group ${
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
                                className="relative -mr-4"
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
                  {/* {loadingMore && <LoadingMoreSkeleton />} */}
                  <LoadMoreButton
                    searchQuery={searchQuery}
                    hasMore={hasMoreRooms}
                    loadMore={loadMoreRooms}
                    loadingMore={loadingMore}
                  />
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-fade-in">
                  <div className="text-gray-500">
                    {filteredRooms.length === 0 && searchQuery && (
                      <>
                        <div className="mb-4">🔍</div>
                        <p className="mb-2">
                          Không tìm thấy phòng chơi bài nào với từ khóa "
                          {searchQuery}"
                        </p>
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          Xóa từ khóa tìm kiếm
                        </button>
                      </>
                    )}
                    {filteredRooms.length === 0 && !searchQuery && (
                      <>
                        <div className="mb-4">✨</div>
                        <p>Chưa có phòng nào. Hãy tạo phòng mới!</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {!selectedRoom && (
        <div className="flex-none sticky z-10 bottom-0 backdrop-blur-md p-4">
          <CustomButton
            icon={<Plus />}
            variant="primary"
            className="w-full active:scale-[0.98] transition-transform"
            onClick={() => {
              navigate("/create-thirteen-card-room");
            }}
          >
            Tạo phòng chơi bài mới
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default JoinRoomPage;
