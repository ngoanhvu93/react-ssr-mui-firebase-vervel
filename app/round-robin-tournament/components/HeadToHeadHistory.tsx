import React from "react";
import { Loader } from "lucide-react";
import PlayerAvatar from "~/components/PlayerAvatar";
import type { Team, Match } from "firebase/types";

interface HeadToHeadHistoryProps {
  homeTeam: Team | null;
  awayTeam: Team | null;
  history: Match[];
  isLoading: boolean;
  showPrediction: boolean;
}

const HeadToHeadHistory: React.FC<HeadToHeadHistoryProps> = ({
  homeTeam,
  awayTeam,
  history,
  isLoading,
  showPrediction,
}) => {
  // Calculate head-to-head stats
  const stats = React.useMemo(() => {
    if (!homeTeam || !awayTeam) return null;

    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;
    let homeGoals = 0;
    let awayGoals = 0;

    history.forEach((match) => {
      const isHomeTeamHome = match.homeTeam.id === homeTeam.id;
      const homeTeamScore = isHomeTeamHome ? match.homeScore : match.awayScore;
      const awayTeamScore = isHomeTeamHome ? match.awayScore : match.homeScore;

      homeGoals += homeTeamScore || 0;
      awayGoals += awayTeamScore || 0;

      if (homeTeamScore && awayTeamScore && homeTeamScore > awayTeamScore) {
        homeWins++;
      } else if (
        homeTeamScore &&
        awayTeamScore &&
        homeTeamScore < awayTeamScore
      ) {
        awayWins++;
      } else {
        draws++;
      }
    });

    return {
      homeWins,
      awayWins,
      draws,
      homeGoals,
      awayGoals,
      totalMatches: history.length,
    };
  }, [homeTeam, awayTeam, history]);

  // Helper function to calculate form score (more recent matches have higher weight)
  const calculateFormScore = (form: string[]): number => {
    if (!form.length) return 0;

    // Weights for W/D/L (most recent matches have higher weight)
    let score = 0;
    const weights = [0.4, 0.3, 0.2, 0.07, 0.03]; // weights should sum to 1

    // Calculate weighted form score
    for (let i = 0; i < Math.min(form.length, weights.length); i++) {
      const result = form[form.length - 1 - i]; // Get results from most recent
      if (result === "W")
        score += weights[i] * 3; // Win = 3 points
      else if (result === "D") score += weights[i] * 1; // Draw = 1 point
    }

    return score / 3; // Normalize to 0-1 range
  };

  // Generate prediction based on head-to-head stats and current form
  const prediction = React.useMemo(() => {
    if (!homeTeam || !awayTeam || !stats || !showPrediction) return null;

    // If no previous matches, use current form and stats
    if (stats.totalMatches === 0) {
      const homeFormScore = calculateFormScore(homeTeam.form || []);
      const awayFormScore = calculateFormScore(awayTeam.form || []);
      const homePointsPerGame =
        homeTeam.played > 0 ? homeTeam.points / homeTeam.played : 0;
      const awayPointsPerGame =
        awayTeam.played > 0 ? awayTeam.points / awayTeam.played : 0;

      // Home advantage factor (1.2 means 20% advantage for home team)
      const homeAdvantage = 1.2;

      const homeScore = (homeFormScore + homePointsPerGame) * homeAdvantage;
      const awayScore = awayFormScore + awayPointsPerGame;

      if (homeScore > awayScore * 1.3) {
        return {
          prediction: "homeWin",
          confidence: "cao",
          text: `${homeTeam.name} được dự đoán sẽ thắng (hệ số tin cậy cao)`,
        };
      } else if (homeScore > awayScore * 1.1) {
        return {
          prediction: "homeWin",
          confidence: "trung bình",
          text: `${homeTeam.name} được dự đoán sẽ thắng (hệ số tin cậy trung bình)`,
        };
      } else if (awayScore > homeScore * 1.3) {
        return {
          prediction: "awayWin",
          confidence: "cao",
          text: `${awayTeam.name} được dự đoán sẽ thắng (hệ số tin cậy cao)`,
        };
      } else if (awayScore > homeScore * 1.1) {
        return {
          prediction: "awayWin",
          confidence: "trung bình",
          text: `${awayTeam.name} được dự đoán sẽ thắng (hệ số tin cậy trung bình)`,
        };
      } else {
        return {
          prediction: "draw",
          confidence: "trung bình",
          text: "Trận đấu được dự đoán sẽ hòa",
        };
      }
    }

    // With previous matches, use head-to-head record as a major factor
    const homeWinRate = stats.homeWins / stats.totalMatches;
    const awayWinRate = stats.awayWins / stats.totalMatches;
    const drawRate = stats.draws / stats.totalMatches;

    const homeFormScore = calculateFormScore(homeTeam.form || []);
    const awayFormScore = calculateFormScore(awayTeam.form || []);

    // Combine historical head-to-head with current form (70% history, 30% current form)
    const homeScore = homeWinRate * 0.7 + homeFormScore * 0.3;
    const awayScore = awayWinRate * 0.7 + awayFormScore * 0.3;
    const drawScore =
      drawRate * 0.7 + Math.min(homeFormScore, awayFormScore) * 0.3;

    if (homeScore > awayScore && homeScore > drawScore) {
      const confidence = homeScore > 0.6 ? "cao" : "trung bình";
      return {
        prediction: "homeWin",
        confidence,
        text: `${homeTeam.name} được dự đoán sẽ thắng (hệ số tin cậy ${confidence})`,
      };
    } else if (awayScore > homeScore && awayScore > drawScore) {
      const confidence = awayScore > 0.6 ? "cao" : "trung bình";
      return {
        prediction: "awayWin",
        confidence,
        text: `${awayTeam.name} được dự đoán sẽ thắng (hệ số tin cậy ${confidence})`,
      };
    } else {
      return {
        prediction: "draw",
        confidence: "trung bình",
        text: "Trận đấu được dự đoán sẽ hòa",
      };
    }
  }, [homeTeam, awayTeam, stats, showPrediction]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader className="animate-spin mr-2" size={20} />
        <span>Đang tải lịch sử đối đầu...</span>
      </div>
    );
  }

  if (!homeTeam || !awayTeam) {
    return null;
  }

  return (
    <div className="  rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 border-b pb-2">
        Lịch sử đối đầu
      </h3>

      <div className="flex justify-center gap-6 items-center mb-4">
        <div className="flex flex-col items-center">
          <PlayerAvatar
            player={{ name: homeTeam.name, avatar: homeTeam.avatar || "" }}
            size="large"
            index={0}
          />
          <span className="font-semibold mt-1">{homeTeam.name}</span>
        </div>

        <div className="text-center">
          <span className="text-2xl font-bold">VS</span>
          {stats && stats.totalMatches > 0 && (
            <div className="text-xs mt-1 text-gray-600">
              {stats.totalMatches} trận đối đầu
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <PlayerAvatar
            player={{ name: awayTeam.name, avatar: awayTeam.avatar || "" }}
            size="large"
            index={1}
          />
          <span className="font-semibold mt-1">{awayTeam.name}</span>
        </div>
      </div>

      {stats && stats.totalMatches > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {stats.homeWins}
              </div>
              <div className="text-xs text-blue-700">Thắng</div>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg">
              <div className="text-lg font-bold text-gray-600">
                {stats.draws}
              </div>
              <div className="text-xs text-gray-700">Hòa</div>
            </div>
            <div className="bg-red-50 p-2 rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {stats.awayWins}
              </div>
              <div className="text-xs text-red-700">Thua</div>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">{homeTeam.name}:</span>{" "}
              {stats.homeGoals} bàn thắng
            </div>
            <div className="text-sm text-gray-700">
              <span className="font-medium">{awayTeam.name}:</span>{" "}
              {stats.awayGoals} bàn thắng
            </div>
          </div>

          {history.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Các trận gần đây:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((match, index) => {
                  const isHomeTeamHome = match.homeTeam.id === homeTeam.id;
                  const homeTeamScore = isHomeTeamHome
                    ? match.homeScore
                    : match.awayScore;
                  const awayTeamScore = isHomeTeamHome
                    ? match.awayScore
                    : match.homeScore;
                  const matchResult =
                    homeTeamScore &&
                    awayTeamScore &&
                    homeTeamScore > awayTeamScore
                      ? "win"
                      : homeTeamScore &&
                          awayTeamScore &&
                          homeTeamScore < awayTeamScore
                        ? "lose"
                        : "draw";

                  return (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded flex justify-between items-center ${
                        matchResult === "win"
                          ? "bg-green-50 border-l-4 border-green-500"
                          : matchResult === "lose"
                            ? "bg-red-50 border-l-4 border-red-500"
                            : "bg-gray-50 border-l-4 border-gray-500"
                      }`}
                    >
                      <div className="flex-1 text-left">{homeTeam.name}</div>
                      <div className="font-bold mx-2">
                        {homeTeamScore} - {awayTeamScore}
                      </div>
                      <div className="flex-1 text-right">{awayTeam.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-600 py-2">
          Chưa có trận đấu nào giữa {homeTeam.name} và {awayTeam.name}
        </div>
      )}

      {showPrediction && prediction && (
        <div
          className={`mt-4 p-3 rounded-lg text-center font-medium ${
            prediction.prediction === "homeWin"
              ? "bg-blue-50 text-blue-800"
              : prediction.prediction === "awayWin"
                ? "bg-red-50 text-red-800"
                : "bg-gray-50 text-gray-800"
          }`}
        >
          <div className="text-sm">Dự đoán</div>
          <div>{prediction.text}</div>
        </div>
      )}
    </div>
  );
};

export default HeadToHeadHistory;
