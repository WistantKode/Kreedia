"use client";

import { useApiAuth } from "@/hooks/useApiAuth";
import { useApiNotifications } from "@/hooks/useApiNotifications";
import {
  Award,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const NgoSidebar: React.FC = () => {
  const { signOut } = useApiAuth();
  const { unreadCount } = useApiNotifications();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Tableau de bord",
      href: "/ngo/dashboard",
      icon: Home,
      current: pathname === "/ngo/dashboard",
    },
    {
      name: "Missions en attente",
      href: "/ngo/missions?status=pending",
      icon: Clock,
      current: pathname === "/ngo/missions" && pathname.includes("pending"),
    },
    {
      name: "Missions acceptées",
      href: "/ngo/missions?status=accepted",
      icon: Users,
      current: pathname === "/ngo/missions" && pathname.includes("accepted"),
    },
    {
      name: "Missions terminées",
      href: "/ngo/missions?status=completed",
      icon: CheckCircle,
      current: pathname === "/ngo/missions" && pathname.includes("completed"),
    },
    {
      name: "Missions récompensées",
      href: "/ngo/missions?status=rewarded",
      icon: Award,
      current: pathname === "/ngo/missions" && pathname.includes("rewarded"),
    },
    {
      name: "Notifications",
      href: "/ngo/notifications",
      icon: Bell,
      current: pathname === "/ngo/notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      name: "Statistiques",
      href: "/ngo/stats",
      icon: BarChart3,
      current: pathname === "/ngo/stats",
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg"></div>
          <span className="text-xl font-bold text-foreground">Kreedia NGO</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.current
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/ngo/settings"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
            pathname === "/ngo/settings"
              ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </div>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>
    </>
  );
};

export default NgoSidebar;
