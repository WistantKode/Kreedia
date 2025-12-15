"use client";

import { NotificationService } from '@/lib/api/services/notifications';
import { Notification, PaginationParams } from '@/types/api';
import { useEffect, useState } from 'react';

interface UseApiNotificationsReturn {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    unreadCount: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useApiNotifications = (params: PaginationParams = {}): UseApiNotificationsReturn => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const fetchNotifications = async (pageNumber = 1, append = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await NotificationService.getNotifications({
                page: pageNumber,
                per_page: params.per_page || 20,
            });

            const newNotifications = response.data;

            if (append) {
                setNotifications(prev => [...prev, ...newNotifications]);
            } else {
                setNotifications(newNotifications);
            }

            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
            setHasMore(response.current_page < response.last_page);

            console.log('✅ Notifications loaded:', {
                count: newNotifications.length,
                page: response.current_page,
                total: response.total
            });

        } catch (err: any) {
            console.error('❌ Error fetching notifications:', err);
            setError(err.message || 'Error loading notifications');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await NotificationService.getUnreadCount();
            setUnreadCount(response.unread_count);
        } catch (err: any) {
            console.error('❌ Error fetching unread count:', err);
            // Ne pas afficher d'erreur pour le compteur
        }
    };

    const refetch = async () => {
        await Promise.all([
            fetchNotifications(1, false),
            fetchUnreadCount()
        ]);
    };

    const loadMore = async () => {
        if (!hasMore || loading) return;
        await fetchNotifications(currentPage + 1, true);
    };

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            await NotificationService.markAllAsRead();

            // Mettre à jour les notifications localement
            setNotifications(prev =>
                prev.map(notification => ({
                    ...notification,
                    read_at: new Date().toISOString()
                }))
            );

            // Réinitialiser le compteur
            setUnreadCount(0);

            console.log('✅ All notifications marked as read');

        } catch (err: any) {
            console.error('❌ Error marking notifications as read:', err);
            setError(err.message || 'Error marking notifications as read');
        } finally {
            setLoading(false);
        }
    };

    // Charger les notifications au montage du composant
    useEffect(() => {
        refetch();
    }, [params.per_page]);

    // Rafraîchir le compteur périodiquement
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000); // Toutes les 30 secondes

        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        loading,
        error,
        unreadCount,
        hasMore,
        currentPage,
        totalPages,
        refetch,
        loadMore,
        markAllAsRead,
    };
};