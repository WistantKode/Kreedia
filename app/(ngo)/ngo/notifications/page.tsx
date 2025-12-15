"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useApiNotifications } from "@/hooks/useApiNotifications";
import {
  Award,
  Bell,
  BellOff,
  CheckCircle,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const NgoNotificationsPage: React.FC = () => {
  const router = useRouter();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    hasMore,
    refetch,
    loadMore,
    markAllAsRead,
  } = useApiNotifications({ per_page: 20 });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "mission_proposed":
        return <Bell className="h-5 w-5 text-blue-600" />;
      case "mission_completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "mission_updated":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "reward_sent":
        return <Award className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    const opacity = isRead ? "20" : "40";
    switch (type) {
      case "mission_proposed":
        return `bg-blue-50 dark:bg-blue-900/${opacity} border-blue-200 dark:border-blue-800`;
      case "mission_completed":
        return `bg-green-50 dark:bg-green-900/${opacity} border-green-200 dark:border-green-800`;
      case "mission_updated":
        return `bg-yellow-50 dark:bg-yellow-900/${opacity} border-yellow-200 dark:border-yellow-800`;
      case "reward_sent":
        return `bg-purple-50 dark:bg-purple-900/${opacity} border-purple-200 dark:border-purple-800`;
      default:
        return `bg-gray-50 dark:bg-gray-900/${opacity} border-gray-200 dark:border-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "À l'instant";
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 48) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Rediriger vers la mission concernée si applicable
    if (notification.data?.mission_id) {
      router.push(`/ngo/missions?mission=${notification.data.mission_id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Restez informé des dernières activités
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Tout marquer comme lu</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={refetch}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Bell className="h-4 w-4" />
            <span>Actualiser</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {unreadCount > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Notifications non lues
                </p>
                <p className="text-xl font-bold text-foreground">
                  {unreadCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Chargement des notifications...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={refetch}>Réessayer</Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${getNotificationColor(
                    notification.type,
                    !!notification.read_at
                  )} ${
                    !notification.read_at
                      ? "ring-2 ring-blue-200 dark:ring-blue-800"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-foreground">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>

                            {/* Additional Info */}
                            {notification.data?.mission_title && (
                              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{notification.data.mission_title}</span>
                              </div>
                            )}
                          </div>

                          {/* Status & Time */}
                          <div className="flex flex-col items-end space-y-2 ml-4">
                            <div className="flex items-center space-x-2">
                              {!notification.read_at && (
                                <Badge variant="default" className="text-xs">
                                  Nouveau
                                </Badge>
                              )}
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="text-center pt-6">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        <span>Chargement...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" />
                        <span>Charger plus</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellOff className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Aucune notification
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Vous n'avez pas encore reçu de notifications
                </p>
                <Button onClick={refetch} variant="outline">
                  Actualiser
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default NgoNotificationsPage;
