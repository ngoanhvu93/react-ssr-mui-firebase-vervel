import { User } from "lucide-react";
import { cn } from "~/utils/cn";
const PlayerAvatar = ({
  player,
  size = "medium",
  index = 0,
  onClick,
  isShowFullname = false,
}: {
  player: {
    name: string;
    avatar: string;
  };
  size?: "small" | "medium" | "large" | "xlarge";
  index?: number;
  onClick?: () => void;
  isShowFullname?: boolean;
}) => {
  const sizeClasses = {
    small: "size-6 text-xs ",
    medium: "size-10 text-sm ",
    large: "size-12 text-base ",
    xlarge: "size-16 text-lg ",
  };

  const avatarColors = [
    "bg-indigo-100 text-indigo-600",
    "bg-rose-100 text-rose-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-sky-100 text-sky-600",
    "bg-violet-100 text-violet-600",
    "bg-lime-100 text-lime-600",
    "bg-orange-100 text-orange-600",
  ];

  const borderColors = [
    "border-indigo-500 border",
    "border-rose-500 border",
    "border-emerald-500 border",
    "border-amber-500 border",
    "border-sky-500 border",
    "border-violet-500 border",
    "border-lime-500 border",
    "border-orange-500 border",
  ];

  const colorClass = avatarColors[index % avatarColors.length];
  const borderClass = [index % borderColors.length];

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div>
      <div
        className={cn(
          sizeClasses[size],
          "rounded-full flex items-center justify-center overflow-hidden border border-white shadow-md",
          colorClass,
          borderClass
        )}
      >
        {player.avatar ? (
          <img
            loading="lazy"
            src={player.avatar}
            alt={player.name}
            className="w-full h-full object-cover"
            onClick={onClick}
          />
        ) : (
          <span
            className={cn(
              sizeClasses[size],
              "text-center flex items-center justify-center"
            )}
          >
            {isShowFullname
              ? player.name
              : getInitials(player.name) || <User size={20} />}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlayerAvatar;
