import type {
    Notification,
    PaginatedResponse,
    PaginationParams,
    UnreadCount,
} from '../../../types/api';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class NotificationService {
    static async getNotifications(params?: PaginationParams): Promise<PaginatedResponse<Notification>> {
        return apiClient.get<PaginatedResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.LIST, params);
    }

    static async getUnreadCount(): Promise<UnreadCount> {
        return apiClient.get<UnreadCount>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    }

    static async markAsRead(notificationId: string): Promise<void> {
        return apiClient.put<void>(`${API_ENDPOINTS.NOTIFICATIONS.LIST}/${notificationId}/read`);
    }

    static async markAllAsRead(): Promise<void> {
        return apiClient.put<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    }
}
