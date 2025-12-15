"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Bell, CheckCheck, Clock } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface NotificationDropdownProps {
  userId: string | null;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  userId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotifications(20);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mission_accepted":
      case "mission_completed":
      case "mission_rewarded":
        return "🎯";
      case "general":
        return "🔔";
      default:
        return "🔔";
    }
  };

  // Get notification color based on priority and read status
  const getNotificationStyle = (notification: Notification) => {
    if (!notification.read_at) {
      return "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500";
    }
    return "bg-gray-50 dark:bg-gray-800/50";
  };

  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read_at) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    }

    // Navigate to action URL if available
    if (notification.data?.action_url) {
      setIsOpen(false);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (!userId) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell className="h-6 w-6" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center space-x-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Clock className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Loading notifications...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-sm text-red-600 dark:text-red-400">
                  Failed to load notifications
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${getNotificationStyle(
                      notification
                    )}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {notification.title}
                          </p>
                          {!notification.read_at && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true }
                            )}
                          </p>

                          {notification.data?.action_url && (
                            <Link
                              href={notification.data.action_url}
                              onClick={() => setIsOpen(false)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center space-x-1"
                            >
                              <span>View</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
