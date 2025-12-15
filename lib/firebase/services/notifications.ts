import {
    COLLECTIONS,
    CreateNotificationData,
    Notification,
    NotificationPriority,
    NotificationType,
    UpdateNotificationData,
} from '@/types/firebase';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../config';

export class NotificationService {
    private static collectionRef = collection(db, COLLECTIONS.NOTIFICATIONS);

    /**
     * Create a new notification
     */
    static async createNotification(data: CreateNotificationData): Promise<string> {
        try {
            console.log('📬 Creating notification:', data);

            const docRef = await addDoc(this.collectionRef, {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            console.log('✅ Notification created with ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('❌ Error creating notification:', error);
            throw error;
        }
    }

    /**
     * Get notification by ID
     */
    static async getNotificationById(id: string): Promise<Notification | null> {
        try {
            const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Notification;
            }
            return null;
        } catch (error) {
            console.error('❌ Error getting notification:', error);
            throw error;
        }
    }

    /**
     * Get notifications for a specific user
     */
    static async getUserNotifications(
        userId: string,
        limitCount: number = 20,
        onlyUnread: boolean = false
    ): Promise<Notification[]> {
        try {
            console.log(`📬 Getting notifications for user: ${userId}`);

            let q = query(
                this.collectionRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(limitCount)
            );

            if (onlyUnread) {
                q = query(
                    this.collectionRef,
                    where('userId', '==', userId),
                    where('isRead', '==', false),
                    orderBy('createdAt', 'desc'),
                    limit(limitCount)
                );
            }

            const querySnapshot = await getDocs(q);
            const notifications: Notification[] = [];

            querySnapshot.forEach((doc) => {
                notifications.push({ id: doc.id, ...doc.data() } as Notification);
            });

            console.log(`✅ Found ${notifications.length} notifications`);
            return notifications;
        } catch (error) {
            console.error('❌ Error getting user notifications:', error);
            throw error;
        }
    }

    /**
     * Mark notification as read
     */
    static async markAsRead(notificationId: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
            await updateDoc(docRef, {
                isRead: true,
                updatedAt: serverTimestamp(),
            });

            console.log('✅ Notification marked as read:', notificationId);
        } catch (error) {
            console.error('❌ Error marking notification as read:', error);
            throw error;
        }
    }

    /**
     * Mark all notifications as read for a user
     */
    static async markAllAsRead(userId: string): Promise<void> {
        try {
            console.log(`📬 Marking all notifications as read for user: ${userId}`);

            const q = query(
                this.collectionRef,
                where('userId', '==', userId),
                where('isRead', '==', false)
            );

            const querySnapshot = await getDocs(q);
            const updatePromises = querySnapshot.docs.map((doc) =>
                updateDoc(doc.ref, {
                    isRead: true,
                    updatedAt: serverTimestamp(),
                })
            );

            await Promise.all(updatePromises);
            console.log(`✅ Marked ${querySnapshot.size} notifications as read`);
        } catch (error) {
            console.error('❌ Error marking all notifications as read:', error);
            throw error;
        }
    }

    /**
     * Update notification
     */
    static async updateNotification(
        id: string,
        data: UpdateNotificationData
    ): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            console.log('✅ Notification updated:', id);
        } catch (error) {
            console.error('❌ Error updating notification:', error);
            throw error;
        }
    }

    /**
     * Delete notification
     */
    static async deleteNotification(id: string): Promise<void> {
        try {
            const docRef = doc(db, COLLECTIONS.NOTIFICATIONS, id);
            await deleteDoc(docRef);

            console.log('✅ Notification deleted:', id);
        } catch (error) {
            console.error('❌ Error deleting notification:', error);
            throw error;
        }
    }

    /**
     * Get unread notifications count for a user
     */
    static async getUnreadCount(userId: string): Promise<number> {
        try {
            const q = query(
                this.collectionRef,
                where('userId', '==', userId),
                where('isRead', '==', false)
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.size;
        } catch (error) {
            console.error('❌ Error getting unread count:', error);
            throw error;
        }
    }

    /**
     * Create welcome notification for new user
     */
    static async createWelcomeNotification(userId: string, userName: string): Promise<string> {
        return this.createNotification({
            userId,
            type: NotificationType.WELCOME,
            priority: NotificationPriority.NORMAL,
            title: 'Welcome to Kreedia!',
            message: `Hello ${userName}! Welcome to our environmental mission platform. Start exploring missions to make a positive impact!`,
            isRead: false,
            actionUrl: '/dashboard',
            metadata: {
                welcomeUser: true,
            },
        });
    }

    /**
     * Create mission-related notification
     */
    static async createMissionNotification(
        userId: string,
        type: NotificationType,
        missionId: string,
        title: string,
        message: string,
        priority: NotificationPriority = NotificationPriority.NORMAL
    ): Promise<string> {
        return this.createNotification({
            userId,
            type,
            priority,
            title,
            message,
            isRead: false,
            actionUrl: `/missions/${missionId}`,
            metadata: {
                missionId,
            },
        });
    }

    /**
     * Create reward notification
     */
    static async createRewardNotification(
        userId: string,
        rewardAmount: number,
        title: string,
        message: string
    ): Promise<string> {
        return this.createNotification({
            userId,
            type: NotificationType.REWARD_EARNED,
            priority: NotificationPriority.HIGH,
            title,
            message,
            isRead: false,
            actionUrl: '/profile',
            metadata: {
                rewardAmount,
            },
        });
    }

    /**
     * Create level up notification
     */
    static async createLevelUpNotification(
        userId: string,
        newLevel: number
    ): Promise<string> {
        return this.createNotification({
            userId,
            type: NotificationType.LEVEL_UP,
            priority: NotificationPriority.HIGH,
            title: 'Level Up!',
            message: `Congratulations! You've reached level ${newLevel}. Keep up the great environmental work!`,
            isRead: false,
            actionUrl: '/profile',
            metadata: {
                newLevel,
            },
        });
    }

    /**
     * Delete old notifications (cleanup)
     */
    static async cleanupOldNotifications(userId: string, daysOld: number = 30): Promise<void> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

            const q = query(
                this.collectionRef,
                where('userId', '==', userId),
                where('createdAt', '<', cutoffTimestamp)
            );

            const querySnapshot = await getDocs(q);
            const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

            await Promise.all(deletePromises);
            console.log(`🗑️ Cleaned up ${querySnapshot.size} old notifications for user: ${userId}`);
        } catch (error) {
            console.error('❌ Error cleaning up old notifications:', error);
            throw error;
        }
    }
}
