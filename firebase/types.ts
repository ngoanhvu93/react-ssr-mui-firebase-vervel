export const DEFAULT_ROOM_SETTINGS: RoomSettings = {
  rankFirst: 3,
  rankSecond: 2,
  rankThird: 1,
  rankFourth: 0,
  whiteWin: 9,
};

export interface RoomSettings {
  rankFirst: number;
  rankSecond: number;
  rankThird: number;
  rankFourth: number;
  whiteWin: number;
}
export interface Player {
  id: string;
  name: string;
  avatar: string;
  scores: number[];
  totalScore: number;
  index?: number;
  tied?: boolean;
}

export interface Room {
  id: string;
  name: string;
  password: string;
  createdAt: Date | null;
  currentRound: number;
  players: Player[];
  gameCount: number;
  winningScore: number;
  isCompleted?: boolean;
  isRankingDialogOpen?: boolean;
  endTime?: string | null;
  currentGameId?: string;
  roomSettings: RoomSettings;
  fcmToken?: string;
}

export interface LottoPlayer {
  id: string;
  name: string;
  avatar?: string;
  joinedAt?: Date;
  isCallerNumber: boolean;
  fiveWinNumbers: number[];
  pendingNumbers?: number[];
  index?: number;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface WinningPlayer {
  id: string;
  name: string;
  avatar?: string;
  fiveWinNumbers: number[];
}

export interface ILottoRoom {
  id: string;
  name: string;
  password: string;
  createdAt: Date | null;
  status: "waiting" | "playing" | "ended";
  calledNumbers: number[];
  lastCalledNumber?: number | null;
  endTime?: string | null;
  isCalling?: boolean;
  players?: LottoPlayer[];
  winner?: WinningPlayer[];
}

export interface GameHistory {
  id: string;
  roomId: string;
  name: string;
  players: Player[];
  endTime: string;
  winningScore?: number;
  createdAt: Date;
  totalRounds: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface Team {
  id: string;
  name: string;
  avatar?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
  createdAt: Date;
  updatedAt?: Date;
  headToHead: {
    teams: string[];
    season: number;
  }[];
}

export interface TeamRef {
  id: string;
  name: string;
  avatar?: string;
}

export interface Match {
  id: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  homeScore?: number;
  awayScore?: number;
  date: Date;
  status: "scheduled" | "in_progress" | "finished";
  round: number;
  createdAt: Date;
  updatedAt: Date;
  // Head-to-head data for easier querying
  headToHead?: {
    teams: string[];
    season: number;
  };
}

export interface Tournament {
  id: string;
  name: string;
  createdAt: Date;
  teams: Team[];
  matches: Match[];
  tournamentType: "round robin" | "knockout" | "group";
  password: string;
  status: "waiting" | "playing" | "ended";
  startDate: Date;
  endDate?: Date;
  currentRound?: number;
  totalRounds: number;
  description?: string;
  includeReturnMatches?: boolean;
  numberOfRounds?: number;
  isSaved?: boolean;
  season?: number;
  isLoading?: boolean;
  updatingMatch?: string; // ID của trận đấu đang được cập nhật kết quả
  seasonStartDate?: Date; // Ngày bắt đầu mùa giải hiện tại
  seasonEndDate?: Date; // Ngày kết thúc mùa giải hiện tại
  matchResults?: Record<
    string,
    { homeScore?: number; awayScore?: number; isSaved?: boolean }
  >; // Kết quả trận đấu để đồng bộ giữa các thiết bị
  savedMatches?: Record<string, boolean>; // Trạng thái lưu của trận đấu để đồng bộ giữa các thiết bị
  isPrivate?: boolean; // Trạng thái riêng tư của giải đấu, nếu true thì không yêu cầu mật khẩu
  createdBy?: string; // ID của người tạo giải đấu
}
