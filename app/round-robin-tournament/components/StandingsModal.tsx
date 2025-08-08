import { Check, Loader, Minus, Table, X } from "lucide-react";
import type { Team, Tournament } from "firebase/types";
import { cn } from "~/lib/utils";
import StandingsTableSkeleton from "./StandingsTableSkeleton";
import PlayerAvatar from "~/components/PlayerAvatar";

const StandingsModal = (props: {
  showStandingsModal: boolean;
  setShowStandingsModal: (showStandingsModal: boolean) => void;
  loadingStandings: boolean;
  standings: Team[];
  closeStandingsModal: () => void;
  tournament: Tournament | null;
}) => {
  return (
    <div
      onClick={(e) => {
        // Only close if clicking the overlay itself, not its children
        if (e.target === e.currentTarget) {
          props.setShowStandingsModal(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="  w-full max-w-4xl h-[100dvh] flex flex-col">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800">
          <h2 className="text-2xl font-bold text-white">Bảng xếp hạng</h2>
          <div className="flex items-center gap-2">
            {props.loadingStandings && (
              <div className="flex items-center">
                <Loader size={16} className="text-white animate-spin mr-1" />
                <span className="text-white text-sm">Đang tải...</span>
              </div>
            )}
            <button
              title="Đóng"
              onClick={props.closeStandingsModal}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <X />
            </button>
          </div>
        </div>
        <div className="overflow-auto flex-grow">
          <div className="overflow-x-auto p-2">
            {props.loadingStandings ? (
              <StandingsTableSkeleton />
            ) : props.standings.length === 0 ? (
              <div className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Table className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    Chưa có dữ liệu bảng xếp hạng
                  </p>
                  <p className="text-gray-400 text-sm">
                    Hãy bắt đầu trận đấu để xem bảng xếp hạng
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative ">
                <div className="overflow-y-auto max-h-[calc(100dvh-200px)] border border-gray-200 rounded-lg">
                  <div className="min-w-full inline-block align-top">
                    <table className="min-w-full">
                      <thead className="bg-gray-100 sticky top-0 z-20">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b sticky left-0 bg-gray-100 z-30">
                            Hạng
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b sticky left-[60px] bg-gray-100 z-30">
                            Đội
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b sticky top-0 bg-gray-100 z-20">
                            Trận
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b sticky top-0 bg-gray-100 z-20">
                            Hiệu số
                          </th>
                          <th className="px-4 py-3 text-center text-xs  text-blue-500 uppercase tracking-wider border-b font-bold sticky top-0 bg-gray-100 z-20">
                            Điểm
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b sticky top-0 bg-gray-100 z-20">
                            5 trận gần nhất
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {props.standings.map((team, index) => (
                          <tr
                            key={team.id}
                            className={`
                          ${index % 2 === 0 ? " " : "bg-gray-50"}
                          ${index < 3 ? "hover:bg-opacity-100" : ""}
                          ${
                            index === 0
                              ? "bg-yellow-50 hover:bg-yellow-100"
                              : ""
                          }
                          ${index === 1 ? "bg-gray-50 hover:bg-gray-100" : ""}
                          ${index === 2 ? "bg-amber-50 hover:bg-amber-100" : ""}
                          hover:bg-blue-50 transition-colors
                        `}
                          >
                            <td className="px-4 py-3 whitespace-nowrap sticky left-0 z-10 bg-inherit">
                              <div className="flex items-center">
                                <span
                                  className={`
                                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                                ${
                                  index === 0
                                    ? "bg-yellow-100 text-yellow-800"
                                    : ""
                                }
                                ${
                                  index === 1 ? "bg-gray-100 text-gray-800" : ""
                                }
                                ${
                                  index === 2
                                    ? "bg-amber-100 text-amber-800"
                                    : ""
                                }
                                ${index > 2 ? "bg-blue-50 text-blue-800" : ""}
                              `}
                                >
                                  {index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 whitespace-nowrap sticky left-[60px] z-10 bg-inherit">
                              <div className="flex items-center">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                  <PlayerAvatar
                                    player={{
                                      name: team.name,
                                      avatar: team.avatar || "",
                                    }}
                                    index={
                                      props.tournament?.teams.findIndex(
                                        (t) => t.id === team.id
                                      ) || 0
                                    }
                                  />
                                  <span className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {team.name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                              {team.played}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                              <span
                                className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${
                                team.goalsFor - team.goalsAgainst > 0
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                team.goalsFor - team.goalsAgainst < 0
                                  ? "bg-red-100 text-red-800"
                                  : ""
                              }
                              ${
                                team.goalsFor - team.goalsAgainst === 0
                                  ? "bg-gray-100 text-gray-800"
                                  : ""
                              }
                            `}
                              >
                                {team.goalsFor - team.goalsAgainst}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                                {team.points}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-center">
                              <div className="flex items-center gap-1">
                                {team.form.map((result, index) => (
                                  <span
                                    key={index}
                                    className="flex items-center justify-center"
                                  >
                                    {result === "W" ? (
                                      <div
                                        className={cn(
                                          "size-6 flex items-center justify-center bg-green-500 text-white rounded-full ",
                                          {
                                            "border border-white ring-2 ring-green-500":
                                              index === 4,
                                          }
                                        )}
                                      >
                                        <Check className="size-4" />
                                      </div>
                                    ) : result === "D" ? (
                                      <div
                                        className={cn(
                                          "size-6 flex items-center justify-center bg-gray-400 text-white rounded-full ",
                                          {
                                            "border border-white ring-2 ring-gray-400":
                                              index === 4,
                                          }
                                        )}
                                      >
                                        <Minus className="size-4" />
                                      </div>
                                    ) : (
                                      <div
                                        className={cn(
                                          "size-6 flex items-center justify-center bg-red-500 text-white rounded-full ",
                                          {
                                            "border border-white ring-2 ring-red-500":
                                              index === 4,
                                          }
                                        )}
                                      >
                                        <X className="size-4" />
                                      </div>
                                    )}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={props.closeStandingsModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StandingsModal;
