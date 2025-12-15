import { cn } from "@/lib/utils";
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};

export default LoadingSpinner;
