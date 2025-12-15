"use client";

import { cn } from "@/lib/utils";
import { User } from "@/types/api";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  showWallet?: boolean;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  showName = true,
  showWallet = true,
  className,
}) => {
  // Get initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on user ID
  const getAvatarColor = (id: number): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    return colors[id % colors.length];
  };

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {/* Avatar */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center text-white font-medium",
          sizeClasses[size],
          getAvatarColor(user.id)
        )}
      >
        {getInitials(user.name)}
      </div>

      {/* User Info */}
      {showName && (
        <div className="flex flex-col">
          <span
            className={cn("font-medium text-foreground", textSizeClasses[size])}
          >
            {user.name}
          </span>
          {showWallet && user.wallet_address && (
            <span
              className={cn(
                "text-gray-500 dark:text-gray-400",
                textSizeClasses[size]
              )}
            >
              {user.wallet_address.slice(0, 6)}...
              {user.wallet_address.slice(-4)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
