import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "firebase/firebase";
import type { Team } from "firebase/types";
import PlayerAvatar from "~/components/PlayerAvatar";
import { CustomButton } from "~/components/CustomButton";
import { X, Loader } from "lucide-react";

interface SelectExistingTeamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeams: (teams: Team[]) => void;
  currentTeams: Team[];
  userId?: string;
}

export default function SelectExistingTeamsModal({
  isOpen,
  onClose,
  onSelectTeams,
  currentTeams,
  userId,
}: SelectExistingTeamsModalProps) {
  const [existingTeams, setExistingTeams] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      fetchExistingTeams();
    }
  }, [isOpen, userId]);

  const fetchExistingTeams = async () => {
    try {
      setLoading(true);
      let teamsQuery;

      if (userId) {
        // If userId is provided, filter teams by this user
        teamsQuery = query(
          collection(db, "existingTeams"),
          where("userId", "==", userId)
        );
      } else {
        // Otherwise fetch all teams
        teamsQuery = collection(db, "existingTeams");
      }

      const snapshot = await getDocs(teamsQuery);
      const teams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Team[];

      // Filter out teams that are already in the current tournament
      const filteredTeams = teams.filter(
        (team) =>
          !currentTeams.some((currentTeam) => currentTeam.id === team.id)
      );

      setExistingTeams(filteredTeams);
    } catch (error) {
      console.error("Error fetching existing teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTeamSelection = (team: Team) => {
    setSelectedTeams((prev) => {
      const isSelected = prev.some((t) => t.id === team.id);

      if (isSelected) {
        setErrorMessage("");
        return prev.filter((t) => t.id !== team.id);
      } else {
        // Check if a team with the same name already exists in selection
        const hasDuplicateName = prev.some((t) => t.name === team.name);

        if (hasDuplicateName) {
          setErrorMessage(
            `Không thể chọn đội "${team.name}" vì tên đội đã tồn tại trong danh sách`
          );
          return prev;
        }

        setErrorMessage("");
        return [...prev, team];
      }
    });
  };

  const handleConfirm = () => {
    onSelectTeams(selectedTeams);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative   rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Chọn đội từ danh sách đã tạo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : existingTeams.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Không có đội nào đã tạo trước đó
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingTeams.map((team) => (
              <div
                key={team.id}
                className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTeams.some((t) => t.id === team.id)
                    ? "bg-blue-50 border-2 border-blue-500"
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
                onClick={() => toggleTeamSelection(team)}
              >
                <PlayerAvatar
                  player={{
                    name: team.name,
                    avatar: team.avatar || "",
                  }}
                  size="large"
                />
                <span className="mt-2 text-sm font-medium text-center">
                  {team.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <CustomButton variant="secondary" onClick={onClose}>
            Hủy
          </CustomButton>
          <CustomButton
            variant="primary"
            onClick={handleConfirm}
            disabled={selectedTeams.length === 0}
          >
            Thêm {selectedTeams.length} đội
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
