"use client";

import { NotificationService } from '@/lib/api/services/notifications';
import { Notification } from '@/types/api';
import { useEffect, useState } from 'react';

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    refreshNotifications: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
}

export const useNotifications = (
    limitCount: number = 10
): UseNotificationsReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Function to refresh notifications manually
    const refreshNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await NotificationService.getNotifications({
                per_page: limitCount,
                page: 1
            });
            const unreadResponse = await NotificationService.getUnreadCount();

            setNotifications(response.data);
            setUnreadCount(unreadResponse.unread_count);
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
            setHasMore(response.current_page < response.last_page);

            console.log('✅ Notifications refreshed:', {
                count: response.data.length,
                page: response.current_page,
                total: response.total,
                unread: unreadResponse.unread_count
            });
        } catch (err) {
            console.error('Error refreshing notifications:', err);
            setError(err instanceof Error ? err.message : 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    // Load notifications on mount
    useEffect(() => {
        refreshNotifications();
    }, [limitCount]);

    // Mark notification as read
    const markAsRead = async (notificationId: string): Promise<void> => {
        try {
            await NotificationService.markAsRead(notificationId);

            // Update local state optimistically
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, read_at: new Date().toISOString() }
                        : notif
                )
            );

            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));

            console.log('✅ Notification marked as read locally');
        } catch (err) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async (): Promise<void> => {
        try {
            await NotificationService.markAllAsRead();

            // Update local state optimistically
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
            );
            setUnreadCount(0);

            console.log('✅ All notifications marked as read locally');
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            throw err;
        }
    };

    // Load more notifications
    const loadMore = async () => {
        if (!hasMore || loading) return;

        try {
            const nextPage = currentPage + 1;
            const response = await NotificationService.getNotifications({
                per_page: limitCount,
                page: nextPage
            });

            setNotifications(prev => [...prev, ...response.data]);
            setCurrentPage(response.current_page);
            setHasMore(response.current_page < response.last_page);

            console.log('✅ More notifications loaded:', {
                count: response.data.length,
                page: response.current_page,
                total: response.total
            });
        } catch (err) {
            console.error('Error loading more notifications:', err);
        }
    };

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
        loadMore,
        hasMore,
        currentPage,
        totalPages,
    };
};
