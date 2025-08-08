import React from "react";
import clsx from "clsx";

interface ButtonProps {
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "warning"
    | "info"
    | "custom"
    | "cancel"
    | "save"
    | "close"
    | "create"
    | "join"
    | "confirm"
    | "delete"
    | "back"
    | "next"
    | "pay"
    | "reset";
  size?: "small" | "medium" | "large" | "default";
}

export const CustomButton = ({
  onClick,
  disabled,
  children,
  className,
  icon,
  type,
  variant = "primary",
  size = "medium",
  title,
}: ButtonProps) => {
  const baseClasses =
    "group relative overflow-hidden flex items-center justify-center text-white rounded-xl transform transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl before:absolute before:inset-0 before:w-full before:h-full before:  before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20";

  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600",
    secondary: "bg-gradient-to-r from-slate-700 via-gray-600 to-slate-500",
    danger: "bg-gradient-to-r from-red-600 via-rose-500 to-pink-500",
    success: "bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400",
    warning: "bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300",
    info: "bg-gradient-to-r from-cyan-600 via-blue-500 to-sky-400",
    custom: "bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-400",
    cancel: "bg-gradient-to-r from-neutral-600 via-gray-500 to-slate-400",
    save: "bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-400",
    close: "bg-gradient-to-r from-gray-700 via-slate-600 to-neutral-500",
    create: "bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-400",
    join: "bg-gradient-to-r from-indigo-100 via-blue-50 to-sky-50 border-2  border-indigo-500",
    confirm: "bg-gradient-to-r from-teal-600 via-emerald-500 to-green-400",
    delete: "bg-gradient-to-r from-rose-600 via-red-500 to-pink-400",
    back: "bg-gradient-to-r from-gray-700 via-slate-600 to-neutral-500",
    next: "bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400",
    pay: "bg-gradient-to-r from-yellow-600 to-orange-600",
    reset: "bg-gradient-to-r from-red-600 via-rose-500 to-pink-500",
  };

  const sizeClasses = {
    small: "py-2 px-4 text-sm",
    medium: "py-4 px-6 text-base",
    large: "py-4 px-8 text-lg",
    default: "py-4 px-6 text-base",
  };

  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon && <span className="mr-2 relative z-10">{icon}</span>}
      <span className="font-bold relative z-10">{children}</span>
    </button>
  );
};
