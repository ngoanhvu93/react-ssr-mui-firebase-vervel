import { BookOpen, Calendar, Table, X } from "lucide-react";
import { Loader } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";
import { formatDate } from "date-fns";
import StandingsTableSkeleton from "./StandingsTableSkeleton";
import toast from "react-hot-toast";
import PlayerAvatar from "~/components/PlayerAvatar";

const SeasonHistoryModal = (props: {
  showSeasonHistoryModal: boolean;
  setShowSeasonHistoryModal: (show: boolean) => void;
  seasonHistory: {
    seasons: {
      season: number;
      createdAt: Date;
      lastUpdated: Date;
      seasonStartDate?: Date;
      seasonEndDate?: Date;
    }[];
    isLoading: boolean;
  };
  selectedSeason: number | null;
  setSelectedSeason: (season: number) => void;
  loadingSeasonStandings: boolean;
  seasonStandings: any[];
  fetchSeasonStandings: (season: number) => void;
}) => {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          props.setShowSeasonHistoryModal(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="  w-full max-w-4xl h-[100dvh] flex flex-col">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-purple-800">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen size={24} />
            Lịch sử các mùa giải
          </h2>
          <div className="flex items-center gap-2">
            {props.seasonHistory.isLoading && (
              <div className="flex items-center">
                <Loader size={16} className="text-white animate-spin mr-1" />
                <span className="text-white text-sm">Đang tải...</span>
              </div>
            )}
            <button
              title="Đóng"
              onClick={() => props.setShowSeasonHistoryModal(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <X />
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-grow modal-content">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              Chọn mùa giải:
            </h3>
            <div className="relative px-8 group">
              <Swiper
                spaceBetween={12}
                slidesPerView="auto"
                freeMode={{
                  enabled: true,
                  sticky: true,
                  momentumBounce: true,
                  minimumVelocity: 0.1,
                }}
                mousewheel={{
                  forceToAxis: true,
                  sensitivity: 1,
                  releaseOnEdges: true,
                }}
                keyboard={{
                  enabled: true,
                  onlyInViewport: true,
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                className="!w-full py-2"
              >
                {props.seasonHistory.isLoading ? (
                  <SwiperSlide className="!w-auto">
                    <div className="p-2 bg-gray-100 rounded animate-pulse w-20 h-10"></div>
                  </SwiperSlide>
                ) : props.seasonHistory.seasons.length === 0 ? (
                  <SwiperSlide className="!w-full">
                    <p className="text-gray-500 italic">
                      Chưa có dữ liệu mùa giải nào được lưu.
                    </p>
                  </SwiperSlide>
                ) : (
                  props.seasonHistory.seasons.map((season) => (
                    <SwiperSlide key={season.season} className="!w-auto">
                      <button
                        onClick={() => {
                          props.setSelectedSeason(season.season);
                          props.fetchSeasonStandings(season.season);
                        }}
                        className={`flex flex-col p-3 rounded-md transition-colors min-w-[120px] h-full ${
                          props.selectedSeason === season.season
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        <span className="font-medium text-lg">
                          Mùa {season.season}
                        </span>
                        {season.seasonStartDate && (
                          <span className="text-xs mt-1">
                            {new Intl.DateTimeFormat("vi-VN", {
                              month: "numeric",
                              year: "numeric",
                            }).format(season.seasonStartDate)}
                            {season.seasonEndDate && (
                              <>
                                {" "}
                                -{" "}
                                {new Intl.DateTimeFormat("vi-VN", {
                                  month: "numeric",
                                  year: "numeric",
                                }).format(season.seasonEndDate)}
                              </>
                            )}
                          </span>
                        )}
                      </button>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
          </div>

          <div className="p-4">
            {props.selectedSeason ? (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2">
                  Bảng xếp hạng Mùa {props.selectedSeason}
                </h3>

                {props.selectedSeason && (
                  <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
                    {props.seasonHistory.seasons.find(
                      (s) => s.season === props.selectedSeason
                    )?.seasonStartDate && (
                      <p className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          <span className="font-medium">Thời gian: </span>
                          {formatDate(
                            props.seasonHistory.seasons.find(
                              (s) => s.season === props.selectedSeason
                            )?.seasonStartDate || new Date(),
                            "dd/MM/yyyy"
                          )}
                          {props.seasonHistory.seasons.find(
                            (s) => s.season === props.selectedSeason
                          )?.seasonEndDate && (
                            <>
                              {" "}
                              đến{" "}
                              {formatDate(
                                props.seasonHistory.seasons.find(
                                  (s) => s.season === props.selectedSeason
                                )?.seasonEndDate || new Date(),
                                "dd/MM/yyyy"
                              )}
                            </>
                          )}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {props.loadingSeasonStandings ? (
                  <StandingsTableSkeleton />
                ) : props.seasonStandings.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Table className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg mb-2">
                        Không có dữ liệu cho mùa giải này
                      </p>
                      <p className="text-gray-400 text-sm">
                        Có thể mùa giải chưa được lưu hoặc đã bị xóa
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="overflow-y-auto max-h-[calc(100dvh-300px)] border border-gray-200 rounded-lg">
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
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Trận
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Thắng
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Hòa
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Thua
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Bàn thắng
                              </th>
                              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Hiệu số
                              </th>
                              <th className="px-4 py-3 text-center text-xs text-indigo-500 uppercase tracking-wider border-b font-bold">
                                Điểm
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {props.seasonStandings.map(
                              (team: any, index: number) => (
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
                              ${
                                index === 1
                                  ? "bg-gray-50 hover:bg-gray-100"
                                  : ""
                              }
                              ${
                                index === 2
                                  ? "bg-amber-50 hover:bg-amber-100"
                                  : ""
                              }
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
                                      index === 1
                                        ? "bg-gray-100 text-gray-800"
                                        : ""
                                    }
                                    ${
                                      index === 2
                                        ? "bg-amber-100 text-amber-800"
                                        : ""
                                    }
                                    ${
                                      index > 2
                                        ? "bg-blue-50 text-blue-800"
                                        : ""
                                    }
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
                                            avatar: team.avatar,
                                          }}
                                          index={index}
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
                                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-green-600">
                                    {team.won}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-gray-600">
                                    {team.drawn}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium text-red-600">
                                    {team.lost}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                    {team.goalsFor}-{team.goalsAgainst}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm">
                                    <span
                                      className={`
                                  px-2 py-1 rounded-full text-xs font-medium
                                  ${
                                    team.goalDifference > 0
                                      ? "bg-green-100 text-green-800"
                                      : ""
                                  }
                                  ${
                                    team.goalDifference < 0
                                      ? "bg-red-100 text-red-800"
                                      : ""
                                  }
                                  ${
                                    team.goalDifference === 0
                                      ? "bg-gray-100 text-gray-800"
                                      : ""
                                  }
                                `}
                                    >
                                      {team.goalDifference > 0 ? "+" : ""}
                                      {team.goalDifference}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-center">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                                      {team.points}
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  Chọn một mùa giải để xem thống kê
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between">
          {props.selectedSeason && (
            <button
              onClick={() => {
                // Add download functionality in the future if needed
                toast.success("Tính năng đang được phát triển");
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span>Xuất dữ liệu Mùa {props.selectedSeason}</span>
            </button>
          )}
          <button
            onClick={() => props.setShowSeasonHistoryModal(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeasonHistoryModal;
