"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useApiAuth } from "@/hooks/useApiAuth";
import { useApiNotifications } from "@/hooks/useApiNotifications";
import { Bell, Settings, User, Wallet } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const NgoTopbar: React.FC = () => {
  const { user } = useApiAuth();
  const { unreadCount } = useApiNotifications();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page title - This will be dynamic based on the current page */}
        <div className="lg:ml-0 ml-16">
          <h2 className="text-xl font-semibold text-foreground">
            Dashboard NGO
          </h2>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Wallet Connection */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2"
          >
            <Wallet className="h-4 w-4" />
            <span>Connecter Wallet</span>
          </Button>

          {/* Notifications */}
          <Link href="/ngo/notifications">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full p-0">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </button>
          </Link>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">
                  {user?.name || "NGO User"}
                </p>
                <p className="text-xs text-gray-500">Organisation</p>
              </div>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <Link
                      href="/ngo/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Paramètres</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NgoTopbar;
