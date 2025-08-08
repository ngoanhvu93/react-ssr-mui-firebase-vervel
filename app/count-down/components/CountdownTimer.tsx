import Chip from "@mui/material/Chip";
import React, { useEffect, useState } from "react";

interface CountdownUnitProps {
  value: number;
  label: string;
  color?: string;
  textColor?: string;
}

const CountdownUnit: React.FC<CountdownUnitProps> = ({
  value,
  label,
  color = "purple-500",
  textColor = "white",
}) => {
  const [, setIsFlipped] = useState(false);
  const [, setAnimationClass] = useState("");

  useEffect(() => {
    setAnimationClass("bounce");
    const timer = setTimeout(() => {
      setAnimationClass("");
    }, 600);

    setIsFlipped(true);
    const flipTimer = setTimeout(() => {
      setIsFlipped(false);
    }, 600);

    return () => {
      clearTimeout(timer);
      clearTimeout(flipTimer);
    };
  }, [value]);

  // Format the number to add leading zero if less than 10
  const formattedValue = value < 10 ? `0${value}` : value;

  return (
    <div className="w-16 sm:w-20 md:w-24 aspect-square">
      <div className="h-full">
        <div
          className={`front bg-${color} rounded-xl shadow-lg flex flex-col items-center justify-center p-2 relative overflow-hidden h-full`}
        >
          <span
            className={`text-2xl sm:text-3xl font-extrabold text-${textColor} number relative z-10`}
          >
            {formattedValue}
          </span>
          <span
            className={`text-sm sm:text-lg text-${textColor} opacity-80 relative z-10`}
          >
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};

export type EventType =
  | "default"
  | "tet"
  | "christmas"
  | "birthday"
  | "wedding"
  | "independence"
  | "hungkings"
  | "liberation"
  | "laborday"
  | "teachersday"
  | "valentine"
  | "newYear"
  | "midAutumn"
  | "internationalChildrensDay"
  | "internationalWomensDay"
  | "vietnameseWomensDay"
  | "custom";

export interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  eventType?: EventType;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onComplete,
  eventType = "default",
}) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isComplete, setIsComplete] = useState(false);

  // Sử dụng màu đơn cho các sự kiện
  const colorSchemes: Record<EventType, { color: string; textColor: string }> =
    {
      default: { color: "purple-500", textColor: "white" },
      tet: { color: "red-600", textColor: "white" },
      christmas: { color: "green-600", textColor: "white" },
      birthday: { color: "pink-500", textColor: "white" },
      wedding: { color: "blue-400", textColor: "white" },
      independence: { color: "red-600", textColor: "white" },
      hungkings: { color: "emerald-600", textColor: "white" },
      liberation: { color: "red-500", textColor: "white" },
      laborday: { color: "orange-500", textColor: "white" },
      teachersday: { color: "purple-500", textColor: "white" },
      valentine: { color: "rose-600", textColor: "white" },
      newYear: { color: "blue-600", textColor: "white" },
      midAutumn: { color: "yellow-500", textColor: "white" },
      internationalChildrensDay: { color: "green-500", textColor: "white" },
      internationalWomensDay: { color: "pink-500", textColor: "white" },
      vietnameseWomensDay: { color: "purple-500", textColor: "white" },
      custom: { color: "indigo-600", textColor: "white" },
    };

  const selectedColorScheme = colorSchemes[eventType];

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Kiểm tra nếu đếm ngược hoàn thành
      const isFinished =
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0;

      if (isFinished && !isComplete) {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, targetDate, isComplete]);

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex justify-evenly items-center w-full space-x-4 ">
        <div className="flex-1">
          <CountdownUnit
            key={`days-${timeLeft.days}`}
            value={timeLeft.days}
            label="Ngày"
            color={selectedColorScheme.color}
            textColor={selectedColorScheme.textColor}
          />
        </div>
        <div className="flex-1">
          <CountdownUnit
            key={`hours-${timeLeft.hours}`}
            value={timeLeft.hours}
            label="Giờ"
            color={selectedColorScheme.color}
            textColor={selectedColorScheme.textColor}
          />
        </div>
        <div className="flex-1">
          <CountdownUnit
            key={`minutes-${timeLeft.minutes}`}
            value={timeLeft.minutes}
            label="Phút"
            color={selectedColorScheme.color}
            textColor={selectedColorScheme.textColor}
          />
        </div>
        <div className="flex-1">
          <CountdownUnit
            key={`seconds-${timeLeft.seconds}`}
            value={timeLeft.seconds}
            label="Giây"
            color={selectedColorScheme.color}
            textColor={selectedColorScheme.textColor}
          />
        </div>
      </div>

      <Chip
        label={`Đếm ngược đến ${targetDate.toLocaleDateString("vi-VN", {
          weekday: "long",
        })} ${targetDate.toLocaleDateString("vi-VN")} 🎉`}
        className="mt-4 text-lg sm:text-xl md:text-2xl text-center  opacity-70 blinking-text"
      />
    </div>
  );
};

export default CountdownTimer;
