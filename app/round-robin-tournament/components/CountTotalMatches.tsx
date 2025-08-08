import type { Tournament } from "firebase/types";

const CountTotalMatches = (props: {
  tournament: Tournament | null;
  numberOfRounds: number;
  rounds: { round: number; matches: { team1: string; team2: string }[] }[];
}) => {
  return (
    <div className="tournament-stats mt-4 bg-gray-50 p-4  rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
        Thống kê lịch đấu
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card   p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Tổng số vòng đấu</p>
          <p className="text-2xl font-bold text-gray-800">
            {props.rounds.length}
          </p>
        </div>
        <div className="stat-card   p-3 rounded-md shadow-sm">
          <p className="text-sm text-gray-500">Tổng số trận đấu</p>
          <p className="text-2xl font-bold text-gray-800">
            {props.rounds.reduce((acc, round) => acc + round.matches.length, 0)}
          </p>
        </div>
        {props.numberOfRounds > 1 && (
          <div className="stat-card   p-3 rounded-md shadow-sm">
            <p className="text-sm text-gray-500">Loại giải đấu</p>
            <p className="text-lg font-medium text-gray-800">
              Vòng tròn {props.numberOfRounds} lượt
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountTotalMatches;
