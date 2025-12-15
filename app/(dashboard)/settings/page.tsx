"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useApiAuth } from "@/hooks/useApiAuth";
import { useWallet } from "@/hooks/useWallet";
import {
  faBell,
  faChevronRight,
  faCog,
  faGlobe,
  faPalette,
  faShield,
  faSignOutAlt,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SettingsPage: React.FC = () => {
  const { user, signOut, loading } = useApiAuth();
  const { address, isConnected, disconnectWallet } = useWallet();
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    missionsCreated: 0,
    missionsCompleted: 0,
    totalEarnings: 0,
    joinDate: "",
  });
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    language: "en",
    emailUpdates: true,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/auth/signin");
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Wallet disconnect error:", error);
    }
  };

  // Charger les statistiques utilisateur
  useEffect(() => {
    const loadUserStats = async () => {
      if (user) {
        try {
          // Simuler le chargement des statistiques
          setUserStats({
            missionsCreated: 5,
            missionsCompleted: 3,
            totalEarnings: 150.5,
            joinDate: user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "Unknown",
          });
        } catch (error) {
          console.error("Error loading user stats:", error);
        }
      }
    };

    loadUserStats();
  }, [user]);

  // Gérer les changements de préférences
  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const settingsSections = [
    {
      title: "Account",
      icon: faUser,
      items: [
        {
          title: "Profile Information",
          description: "Manage your personal details and profile picture",
          href: "/profile",
          icon: faUser,
        },
        {
          title: "Wallet Connection",
          description: isConnected
            ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
            : "Connect your Web3 wallet",
          action: isConnected
            ? handleDisconnectWallet
            : () => router.push("/dashboard"),
          icon: faWallet,
          badge: isConnected ? "Connected" : "Not Connected",
          badgeColor: isConnected ? "green" : "gray",
        },
      ],
    },
    {
      title: "Preferences",
      icon: faPalette,
      items: [
        {
          title: "Notifications",
          description: "Manage your notification preferences",
          icon: faBell,
          toggle: preferences.notifications,
          onToggle: () =>
            handlePreferenceChange("notifications", !preferences.notifications),
        },
        {
          title: "Dark Mode",
          description: "Toggle dark mode appearance",
          icon: faPalette,
          toggle: preferences.darkMode,
          onToggle: () =>
            handlePreferenceChange("darkMode", !preferences.darkMode),
        },
        {
          title: "Language & Region",
          description: "Set your language and regional preferences",
          icon: faGlobe,
          value: preferences.language === "en" ? "English" : "Français",
          onSelect: () =>
            handlePreferenceChange(
              "language",
              preferences.language === "en" ? "fr" : "en"
            ),
        },
      ],
    },
    {
      title: "Security & Privacy",
      icon: faShield,
      items: [
        {
          title: "Privacy Settings",
          description: "Control your data and privacy",
          href: "/settings/privacy",
          icon: faShield,
        },
        {
          title: "Security",
          description: "Manage your account security",
          href: "/settings/security",
          icon: faShield,
        },
      ],
    },
  ] as const;

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "gray":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <FontAwesomeIcon icon={faCog} className="h-8 w-8 text-primary-600" />
          <span>Settings</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={section.icon}
                  className="h-5 w-5 text-primary-600"
                />
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="h-5 w-5 text-gray-600 dark:text-gray-400"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground">
                          {item.title}
                        </h3>
                        {"badge" in item && item.badge && (
                          <Badge
                            className={getBadgeColor(
                              ("badgeColor" in item
                                ? item.badgeColor
                                : "gray") || "gray"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {"toggle" in item && item.toggle !== undefined ? (
                      <button
                        onClick={item.onToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.toggle
                            ? "bg-green-600"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.toggle ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    ) : "value" in item && item.value ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={item.onSelect}
                        className="flex items-center space-x-1"
                      >
                        <span>{item.value}</span>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="h-4 w-4"
                        />
                      </Button>
                    ) : "href" in item && item.href ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(item.href!)}
                        className="flex items-center space-x-1"
                      >
                        <span>Open</span>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="h-4 w-4"
                        />
                      </Button>
                    ) : "action" in item && item.action ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={item.action}
                        className="flex items-center space-x-1"
                      >
                        <span>{isConnected ? "Disconnect" : "Connect"}</span>
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="h-4 w-4"
                        />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="h-5 w-5 text-red-600 dark:text-red-400"
                />
              </div>
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  Sign Out
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Sign out of your account
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={loading}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
