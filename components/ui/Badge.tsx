import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-primary-500 text-white",
      secondary:
        "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
      destructive: "bg-red-500 text-white",
      outline: "border border-current text-foreground",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
