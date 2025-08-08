import { Check, Minus, X } from "lucide-react";
import PlayerAvatar from "~/components/PlayerAvatar";
import { cn } from "~/lib/utils";

interface StandingsTableProps {
  standings: any[];
  tournament: any;
  loading: boolean;
  error: string | null;
}

const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  tournament,
}) => {
  return (
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
              {standings.map((team, index) => (
                <tr
                  key={team.id}
                  className={`
                ${index % 2 === 0 ? " " : "bg-gray-50"}
                ${index < 3 ? "hover:bg-opacity-100" : ""}
                ${index === 0 ? "bg-yellow-50 hover:bg-yellow-100" : ""}
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
                      ${index === 0 ? "bg-yellow-100 text-yellow-800" : ""}
                      ${index === 1 ? "bg-gray-100 text-gray-800" : ""}
                      ${index === 2 ? "bg-amber-100 text-amber-800" : ""}
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
                            avatar: team.avatar,
                          }}
                          index={
                            tournament?.teams.findIndex(
                              (t: any) => t.id === team.id
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
                      {team.form.map((result: any, index: number) => (
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
  );
};

export default StandingsTable;
