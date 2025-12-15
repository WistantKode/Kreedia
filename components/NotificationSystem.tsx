"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Award, Bell, Check, X } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "./ui/Badge";
import Button from "./ui/Button";

export interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

interface NotificationSystemProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Mission Completed!",
    message:
      "Your Central Park cleanup has been validated. You earned 0.15 ETH!",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    read: false,
    actionLabel: "View Mission",
    actionUrl: "/missions/1",
  },
  {
    id: "2",
    type: "info",
    title: "New NFT Earned",
    message:
      'You received the "Beach Guardian" NFT for your outstanding cleanup work!',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    actionLabel: "View NFT",
    actionUrl: "/nft",
  },
  {
    id: "3",
    type: "warning",
    title: "Mission Deadline",
    message:
      "Your River cleanup mission has 2 days remaining. Complete it soon!",
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    read: true,
    actionLabel: "Continue Mission",
    actionUrl: "/missions/4",
  },
];

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications = mockNotifications,
  onMarkAsRead,
  onDismiss,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "info":
        return <Award className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Notifications Panel */}
          <div className="absolute right-0 top-12 w-80 max-h-96 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-border bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                        !notification.read &&
                          "bg-primary-50 dark:bg-primary-950"
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  {getTimeAgo(notification.timestamp)}
                                </span>
                                {!notification.read && (
                                  <button
                                    onClick={() =>
                                      onMarkAsRead(notification.id)
                                    }
                                    className="text-xs text-primary-600 hover:text-primary-700"
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                              {notification.actionLabel && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 text-xs h-7"
                                >
                                  {notification.actionLabel}
                                </Button>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDismiss(notification.id)}
                              className="ml-2 h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
