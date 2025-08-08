import { useState, useEffect, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  X,
  Plus,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Globe,
  List,
  Loader,
} from "lucide-react";
import PlayerAvatar from "~/components/PlayerAvatar";
import toast from "react-hot-toast";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { db, storage, auth } from "firebase/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import type { Tournament, Team } from "firebase/types";
import { cn } from "~/utils/cn";
import { CustomButton } from "~/components/CustomButton";
import { disableBodyScroll, enableBodyScroll } from "~/utils/modal-utils";
import TeamLists from "./components/TeamLists";
import ReviewModal from "./components/ReviewModal";
import TeamToDelete from "./components/TeamToDelete";
import AuthModal from "~/components/AuthModal";
import { onAuthStateChanged } from "firebase/auth";
import UserProfileSidebar from "../components/UserProfileSidebar";
import { TopAppBar } from "~/components/TopAppBar";
import SelectExistingTeamsModal from "./components/SelectExistingTeamsModal";

export default function CreateTournament() {
  const navigate = useNavigate();
  const [teamError, setTeamError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [formData, setFormData] = useState<Tournament | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [uploadingAvatarId, setUploadingAvatarId] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingTeamId, setPendingTeamId] = useState<string | null>(null);
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [showSelectExistingTeamsModal, setShowSelectExistingTeamsModal] =
    useState(false);

  // Quản lý các đội
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamName, setTeamName] = useState("");
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingTeamName, setEditingTeamName] = useState("");

  // Add ref for team name input to allow focusing
  const teamNameInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Tournament>({
    defaultValues: {
      name: "",
      tournamentType: "round robin",
      password: "",
      teams: [],
      isPrivate: false,
    },
  });

  const tournamentIsPrivate = watch("isPrivate");

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // If user is authenticated and we have a pending file upload, proceed with it
      if (currentUser && pendingFile) {
        if (pendingTeamId) {
          handleTeamAvatarEdit(pendingFile, pendingTeamId);
        } else {
          handleTeamAvatarChange(pendingFile);
        }
        setPendingFile(null);
        setPendingTeamId(null);
      }
    });

    return () => unsubscribe();
  }, [pendingFile, pendingTeamId]);

  const handleTeamAvatarChange = async (file: File) => {
    // Check if user is authenticated
    if (!user) {
      setPendingFile(file);
      setShowAuthModal(true);
      return;
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ");
      return;
    }

    // Check file size (maximum 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước hình ảnh không được vượt quá 2MB");
      return;
    }

    setIsUploadingAvatar(true);
    setUploadingAvatarId("new");

    try {
      // Create a temporary ID for the team if not exists yet
      const tempId = uuidv4();

      // Create a preview URL immediately for better UX
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          // Set temporary data URL for immediate preview
          setAvatarUrl(e.target.result as string);

          try {
            // Upload to Firebase Storage
            const storageRef = ref(storage, `team-avatars/temp-${tempId}`);
            const uploadResult = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            // Update the avatar URL with the Firebase Storage URL
            setAvatarUrl(downloadURL);
            toast.success("Ảnh đại diện đội đã được tải lên thành công");
          } catch (error) {
            console.error("Lỗi khi tải lên ảnh đại diện:", error);
            toast.error(`Không thể tải lên ảnh: ${(error as Error).message}`);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Có lỗi khi xử lý file. Vui lòng thử lại sau.");
    } finally {
      setIsUploadingAvatar(false);
      setUploadingAvatarId(null);
    }
  };

  const handleTeamAvatarEdit = async (file: File, teamId: string) => {
    // Check if user is authenticated
    if (!user) {
      setPendingFile(file);
      setPendingTeamId(teamId);
      setShowAuthModal(true);
      return;
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh hợp lệ");
      return;
    }

    // Check file size (maximum 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước hình ảnh không được vượt quá 2MB");
      return;
    }

    setIsUploadingAvatar(true);
    setUploadingAvatarId(teamId);

    try {
      // Create a preview URL for immediate UX
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const avatarDataUrl = e.target.result as string;

          // Update avatar immediately for better UX
          setTeams(
            teams.map((team) => {
              if (team.id === teamId) {
                return { ...team, avatar: avatarDataUrl };
              }
              return team;
            })
          );

          try {
            // Upload to Firebase Storage
            const storageRef = ref(storage, `team-avatars/${teamId}`);
            const uploadResult = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(uploadResult.ref);

            // Update with permanent URL from Firebase Storage
            setTeams(
              teams.map((team) => {
                if (team.id === teamId) {
                  return { ...team, avatar: downloadURL };
                }
                return team;
              })
            );

            toast.success("Đã cập nhật ảnh đại diện thành công");
          } catch (error) {
            console.error("Lỗi khi tải lên ảnh đại diện:", error);
            toast.error(`Không thể tải lên ảnh: ${(error as Error).message}`);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Có lỗi khi xử lý file. Vui lòng thử lại sau.");
    } finally {
      setIsUploadingAvatar(false);
      setUploadingAvatarId(null);
    }
  };

  const addTeam = () => {
    if (!teamName.trim()) {
      toast.error("Vui lòng nhập tên đội");
      return;
    }

    // Improved validation for duplicate team names
    const trimmedName = teamName.trim();
    const duplicateTeam = teams.find(
      (team) => team.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicateTeam) {
      toast.error(
        `Tên đội "${trimmedName}" đã tồn tại, vui lòng nhập tên đội khác`
      );
      return;
    }

    const newTeam: Team = {
      id: uuidv4(),
      name: trimmedName,
      avatar: avatarUrl, // Use the current team avatar
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

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    setTeamName(""); // Reset input field
    setAvatarUrl(""); // Reset avatar preview

    // Focus the team name input after adding a team
    setTimeout(() => {
      if (teamNameInputRef.current) {
        teamNameInputRef.current.focus();
      }
    }, 0);

    // Clear the error message if we now have at least 2 teams
    if (updatedTeams.length >= 2) {
      setTeamError("");
    }

    // Save team to existingTeams collection
    const saveTeamToExisting = async () => {
      try {
        const teamRef = doc(db, "existingTeams", newTeam.id);
        await setDoc(teamRef, {
          ...newTeam,
          userId: user?.uid, // Associate team with current user
          createdAt: new Date(),
        });
      } catch (error) {
        console.error("Error saving team to existing teams:", error);
      }
    };

    saveTeamToExisting();
    toast.success(`Đã thêm đội ${newTeam.name} thành công`);
  };

  const handleSelectExistingTeams = (selectedTeams: Team[]) => {
    // Check for duplicates by team name (case insensitive)
    const duplicateTeams = selectedTeams.filter((selectedTeam) =>
      teams.some(
        (existingTeam) =>
          existingTeam.name.toLowerCase() === selectedTeam.name.toLowerCase()
      )
    );

    if (duplicateTeams.length > 0) {
      // Found duplicate team names
      const duplicateNames = duplicateTeams
        .map((team) => `"${team.name}"`)
        .join(", ");
      toast.error(`Tên đội đã tồn tại: ${duplicateNames}`);
      return;
    }

    // Add selected teams to current tournament
    const updatedTeams = [...teams, ...selectedTeams];
    setTeams(updatedTeams);

    // Clear the error message if we now have at least 2 teams
    if (updatedTeams.length >= 2) {
      setTeamError("");
    }

    toast.success(`Đã thêm ${selectedTeams.length} đội vào giải đấu`);
  };

  const removeTeam = async (teamId: string, teamName: string) => {
    try {
      // Find the team to get its avatar URL
      const teamToRemove = teams.find((team) => team.id === teamId);

      // Delete the team's avatar from Firebase Storage if it has one
      if (teamToRemove?.avatar && teamToRemove.avatar.includes("firebase")) {
        try {
          // Create a reference to the file to delete
          const storageRef = ref(storage, `team-avatars/${teamId}`);
          await deleteObject(storageRef);
          console.log("Avatar deleted successfully from storage");
        } catch (error) {
          console.error("Error deleting team avatar:", error);
          // Continue with team deletion even if avatar deletion fails
        }
      }

      // Remove the team from the local state
      setTeams(teams.filter((team) => team.id !== teamId));
      toast.success(`Đã xóa đội ${teamName} thành công`);
    } catch (error) {
      console.error("Error removing team:", error);
      toast.error(`Lỗi khi xóa đội ${teamName}`);
    }

    setTeamToDelete(null);
  };

  const startEditingTeam = (teamId: string, currentName: string) => {
    setEditingTeamId(teamId);
    setEditingTeamName(currentName);
  };

  const saveEditedTeam = () => {
    if (!editingTeamName.trim()) {
      toast.error("Tên đội không được để trống");
      return;
    }

    // Improved validation for duplicate team names with case-insensitive comparison
    const trimmedName = editingTeamName.trim();
    const duplicateTeam = teams.find(
      (team) =>
        team.name.toLowerCase() === trimmedName.toLowerCase() &&
        team.id !== editingTeamId
    );

    if (duplicateTeam) {
      toast.error(
        `Tên đội "${trimmedName}" đã tồn tại, vui lòng nhập tên đội khác`
      );
      return;
    }

    setTeams(
      teams.map((team) => {
        if (team.id === editingTeamId) {
          return { ...team, name: trimmedName };
        }
        return team;
      })
    );

    toast.success("Đã cập nhật tên đội thành công");
    cancelEditingTeam();
  };

  const cancelEditingTeam = () => {
    setEditingTeamId(null);
    setEditingTeamName("");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<Tournament> = async (data) => {
    // Check if user is authenticated
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);

    if (data.tournamentType === "group" && teams.length < 4) {
      setTeamError("Giải đấu chia bảng cần ít nhất 4 đội để tạo giải đấu.");
      setIsSubmitting(false);
    } else if (teams.length < 2) {
      setTeamError("Vui lòng thêm ít nhất 2 đội để tạo giải đấu.");
      setIsSubmitting(false);
    } else if (!data.isPrivate && !data.password.trim()) {
      setTeamError("Vui lòng nhập mật khẩu cho giải đấu công khai.");
      setIsSubmitting(false);
    } else {
      // Clear the error message when there are enough teams
      setTeamError("");

      // Save password if remember password is checked
      if (rememberPassword && !data.isPrivate) {
        localStorage.setItem("tournamentPassword", data.password);
      } else {
        localStorage.removeItem("tournamentPassword");
      }

      const tournamentStartDate = new Date();

      // Lưu dữ liệu và hiển thị modal xem trước
      setFormData({
        ...data,
        name: data.name,
        password: data.password,
        teams: data.teams,
        matches: [],
        tournamentType: data.tournamentType,
        status: "waiting",
        startDate: tournamentStartDate,
        seasonStartDate: tournamentStartDate,
        totalRounds: calculateTotalRounds(
          data.teams.length,
          data.tournamentType
        ),
        isPrivate: data.isPrivate,
      });
      setShowReviewModal(true);
      setIsSubmitting(false);
    }
  };

  const handleCreateTournament = async () => {
    // Check if user is authenticated again, in case they logged out between form submit and final creation
    if (!user) {
      setShowAuthModal(true);
      setShowReviewModal(false);
      return;
    }

    setIsCreating(true);
    try {
      const tournamentStartDate = new Date();

      // Prepare the tournament data
      const tournamentData: Tournament = {
        id: uuidv4(),
        name: formData?.name || "",
        createdAt: new Date(),
        teams: teams, // Teams already have Firebase Storage URLs for avatars
        matches: [],
        tournamentType: formData?.tournamentType || "round robin",
        password: formData?.isPrivate ? "" : formData?.password || "",
        status: "waiting",
        startDate: tournamentStartDate,
        seasonStartDate: tournamentStartDate,
        totalRounds: calculateTotalRounds(
          teams.length,
          formData?.tournamentType || ""
        ),
        description: "",
        isPrivate: formData?.isPrivate || false,
        createdBy: user.uid, // Add the user ID who created the tournament
      };

      // Save to Firestore
      const tournamentRef = doc(db, "tournaments", tournamentData.id);
      await setDoc(tournamentRef, tournamentData);

      // Lưu từng đội riêng biệt vào subcollection
      const teamsCollectionRef = collection(tournamentRef, "teams");
      for (const team of teams) {
        await setDoc(doc(teamsCollectionRef, team.id), team);
      }

      // Show success message
      setShowReviewModal(false);
      setIsCreating(false);

      // Redirect to tournament page after a short delay
      if (formData?.tournamentType === "round robin") {
        navigate(`/round-robin-tournament/${tournamentData.id}`);
      } else if (formData?.tournamentType === "group") {
        navigate(`/group-tournament/${tournamentData.id}`);
      } else if (formData?.tournamentType === "knockout") {
        navigate(`/knockout-tournament/${tournamentData.id}`);
      }
      toast.success("Giải đấu đã được tạo thành công!");
    } catch (error) {
      console.error("Error creating tournament: ", error);
      // In chi tiết lỗi để dễ gỡ lỗi
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      toast.error("Có lỗi xảy ra khi tạo giải đấu. Vui lòng thử lại sau.");
    } finally {
      setIsCreating(false);
    }
  };

  // Helper function to calculate total rounds based on tournament type and team count
  const calculateTotalRounds = (teamCount: number, tournamentType: string) => {
    switch (tournamentType) {
      case "round robin":
        return teamCount - 1; // In round-robin, total rounds = n-1 (where n = number of teams)
      case "knockout":
        return Math.ceil(Math.log2(teamCount)); // In knockout, total rounds = log2(n) rounded up
      case "group":
        return Math.ceil(teamCount / 4) + 1; // Group stage + knockout stage (simplified)
      default:
        return teamCount - 1;
    }
  };

  // Chuyển đổi loại giải đấu từ tiếng Anh sang tiếng Việt
  const getTournamentTypeVietnamese = (type: string) => {
    switch (type) {
      case "round robin":
        return "Vòng tròn";
      case "group":
        return "Chia bảng";
      case "knockout":
        return "Loại trực tiếp";
      default:
        return type;
    }
  };

  // Thêm useEffect để khóa cuộn trang khi modal mở
  useEffect(() => {
    if (
      showReviewModal ||
      showUserSidebar ||
      showAuthModal ||
      showSelectExistingTeamsModal
    ) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
    return () => {
      enableBodyScroll();
    };
  }, [
    showReviewModal,
    showUserSidebar,
    showAuthModal,
    showSelectExistingTeamsModal,
  ]);

  // Add useEffect to check for saved password
  useEffect(() => {
    const savedPassword = localStorage.getItem("tournamentPassword");
    if (savedPassword) {
      // Use setValue from react-hook-form to set the password field
      setValue("password", savedPassword);
      setRememberPassword(true);
    }
  }, []);

  const confirmDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
  };

  return (
    <div className="w-full flex flex-col max-w-4xl mx-auto">
      <TopAppBar
        title="Tạo giải đấu"
        onBack={() => navigate("/join-tournament")}
      />

      <div className="flex flex-col w-full p-4 items-center mx-auto max-w-4xl">
        <div className="grid gap-4 w-full">
          {/* Thông tin cơ bản */}
          <div>
            <form className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="tournamentName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tên giải đấu:
                    </label>
                    <input
                      id="tournamentName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ví dụ: Giải bóng đá Mùa hè 2025"
                      type="text"
                      {...register("name", {
                        required: "Vui lòng nhập tên giải đấu",
                      })}
                      autoFocus
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="tournamentType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Loại giải đấu:
                    </label>
                    <div className="relative mt-1">
                      <select
                        id="tournamentType"
                        className="appearance-none block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500  "
                        title="Tournament Type"
                        {...register("tournamentType")}
                      >
                        <option value="round robin">Vòng tròn tính điểm</option>
                        <option value="group">Chia bảng</option>
                        <option value="knockout">Loại trực tiếp</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quyền riêng tư:
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-blue-600"
                          value="public"
                          checked={!tournamentIsPrivate}
                          onChange={() => setValue("isPrivate", false)}
                        />
                        <span className="ml-2 flex items-center">
                          <Globe size={16} className="mr-1 text-gray-600" />
                          Công khai
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-blue-600"
                          value="private"
                          checked={tournamentIsPrivate}
                          onChange={() => setValue("isPrivate", true)}
                        />
                        <span className="ml-2 flex items-center">
                          <Lock size={16} className="mr-1 text-gray-600" />
                          Riêng tư
                        </span>
                      </label>
                    </div>
                  </div>

                  {!tournamentIsPrivate && (
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mật khẩu:
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="password"
                          className="block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                          placeholder="Mật khẩu"
                          type={showPassword ? "text" : "password"}
                          {...register("password", {
                            required: !tournamentIsPrivate
                              ? "Vui lòng nhập mật khẩu"
                              : false,
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <Eye size={18} />
                          ) : (
                            <EyeOff size={18} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          id="remember-password"
                          checked={rememberPassword}
                          onChange={(e) =>
                            setRememberPassword(e.target.checked)
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="remember-password"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Ghi nhớ mật khẩu
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                  <div className="flex items-center gap-3">
                    {/* Team Avatar Upload */}
                    <div>
                      <label
                        htmlFor="team-avatar-input"
                        className="cursor-pointer relative"
                      >
                        <PlayerAvatar
                          player={{
                            name: teamName,
                            avatar: avatarUrl,
                          }}
                          size="large"
                          index={teams.length}
                        />
                        {avatarUrl && (
                          <X
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAvatarUrl("");
                            }}
                            className="text-white absolute -top-3 bg-red-500  rounded-full p-1 -right-3"
                            size={20}
                          />
                        )}
                        {isUploadingAvatar && uploadingAvatarId === "new" && (
                          <Loader className=" animate-spin" />
                        )}
                      </label>
                      <input
                        title="Ảnh đại diện đội"
                        id="team-avatar-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleTeamAvatarChange(file);
                        }}
                      />
                    </div>

                    {/* Team Name Input */}
                    <div className="flex-grow flex gap-2">
                      <input
                        className={cn(
                          "w-full outline-none bg-transparent text-base font-medium",
                          "border-b-2 border-blue-500"
                        )}
                        placeholder="Nhập tên đội"
                        type="text"
                        value={teamName}
                        ref={teamNameInputRef}
                        onChange={(e) => setTeamName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && teamName.trim()) {
                            e.preventDefault();
                            addTeam();
                          }
                        }}
                      />
                      <button
                        className="group relative overflow-hidden flex items-center justify-center text-white rounded-xl transform transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl before:absolute before:inset-0 before:w-full before:h-full before:  before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 p-2 w-20 h-12"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          addTeam();
                        }}
                        disabled={!teamName.trim()}
                        title="Thêm đội"
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>

                  {/* Add button to show select existing teams modal */}
                  {user && (
                    <button
                      type="button"
                      onClick={() => setShowSelectExistingTeamsModal(true)}
                      className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <List className="mr-1" size={16} />
                      Chọn từ đội đã tạo trước đó
                    </button>
                  )}
                </div>
                {teamError && (
                  <p className="text-red-500 text-sm mt-2">{teamError}</p>
                )}
              </div>
            </form>

            {errors.teams && (
              <div className="mt-3 text-red-500 bg-red-50 p-3 rounded-md border border-red-200 text-sm">
                {errors.teams.message}
              </div>
            )}
          </div>

          {/* Danh sách đội */}
          <TeamLists
            teams={teams}
            setTeams={setTeams}
            editingTeamId={editingTeamId || ""}
            editingTeamName={editingTeamName}
            setEditingTeamName={setEditingTeamName}
            startEditingTeam={startEditingTeam}
            saveEditedTeam={saveEditedTeam}
            cancelEditingTeam={cancelEditingTeam}
            confirmDeleteTeam={confirmDeleteTeam}
            handleTeamAvatarEdit={handleTeamAvatarEdit}
            isUploadingAvatar={isUploadingAvatar}
            uploadingAvatarId={uploadingAvatarId || ""}
          />
        </div>
      </div>

      <div className="flex-none sticky z-10 bottom-0  /80 backdrop-blur-md border-t border-gray-100 p-4">
        <CustomButton
          variant="primary"
          icon={isSubmitting ? <Loader className="animate-spin" /> : <Plus />}
          type="submit"
          className="w-full"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : "Tạo giải đấu"}
        </CustomButton>
      </div>

      {/* Modal xem trước */}
      {showReviewModal && formData && (
        <ReviewModal
          showReviewModal={showReviewModal}
          setShowReviewModal={setShowReviewModal}
          formData={formData}
          teams={teams}
          getTournamentTypeVietnamese={getTournamentTypeVietnamese}
          handleCreateTournament={handleCreateTournament}
          isCreating={isCreating}
          editingTeamId={editingTeamId || ""}
          editingTeamName={editingTeamName}
          setEditingTeamName={setEditingTeamName}
          startEditingTeam={startEditingTeam}
          saveEditedTeam={saveEditedTeam}
          cancelEditingTeam={cancelEditingTeam}
          confirmDeleteTeam={confirmDeleteTeam}
          handleTeamAvatarEdit={handleTeamAvatarEdit}
          setTeamToDelete={setTeamToDelete}
        />
      )}

      {/* User Profile Sidebar */}
      <UserProfileSidebar
        user={user}
        isOpen={showUserSidebar}
        onClose={() => setShowUserSidebar(false)}
        setShowAuthModal={setShowAuthModal}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        setIsOpen={setShowAuthModal}
        description="Bạn cần đăng nhập để tạo giải đấu. Giải đấu của bạn sẽ được lưu trong tài khoản để quản lý dễ dàng."
      />

      {teamToDelete && (
        <TeamToDelete
          teamToDelete={teamToDelete}
          setTeamToDelete={setTeamToDelete}
          removeTeam={removeTeam}
        />
      )}

      {/* Select Existing Teams Modal */}
      {showSelectExistingTeamsModal && (
        <SelectExistingTeamsModal
          isOpen={showSelectExistingTeamsModal}
          onClose={() => setShowSelectExistingTeamsModal(false)}
          onSelectTeams={handleSelectExistingTeams}
          currentTeams={teams}
          userId={user?.uid} // Pass the user ID to filter teams
        />
      )}
    </div>
  );
}
