import {
    COLLECTIONS,
    CreateUserData,
    UpdateUserData,
    User,
    UserStatus
} from '@/types/firebase';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config';

export class UserService {
    private static collection = collection(db, COLLECTIONS.USERS);

    /**
     * Create a new user
     */
    static async createUser(userData: CreateUserData): Promise<string> {
        const userRef = doc(this.collection);
        const now = serverTimestamp();

        const newUser: Omit<User, 'id'> = {
            ...userData,
            status: userData.status || UserStatus.ACTIVE,
            createdAt: now as Timestamp,
            updatedAt: now as Timestamp,
        };

        await setDoc(userRef, newUser);
        return userRef.id;
    }

    /**
     * Get user by ID
     */
    static async getUserById(userId: string): Promise<User | null> {
        const userRef = doc(this.collection, userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        }
        return null;
    }

    /**
     * Get user by email
     */
    static async getUserByEmail(email: string): Promise<User | null> {
        const q = query(this.collection, where('email', '==', email), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as User;
        }
        return null;
    }

    /**
     * Update user
     */
    static async updateUser(userId: string, updateData: UpdateUserData): Promise<void> {
        const userRef = doc(this.collection, userId);
        await updateDoc(userRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    }

    /**
     * Delete user
     */
    static async deleteUser(userId: string): Promise<void> {
        const userRef = doc(this.collection, userId);
        await deleteDoc(userRef);
    }

    /**
     * Get all users with optional filters
     */
    static async getUsers(
        filters?: {
            status?: UserStatus;
            limit?: number;
            orderByField?: keyof User;
            orderDirection?: 'asc' | 'desc';
        }
    ): Promise<User[]> {
        const constraints: QueryConstraint[] = [];

        if (filters?.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters?.orderByField) {
            constraints.push(orderBy(filters.orderByField, filters.orderDirection || 'desc'));
        }

        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(this.collection, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as User[];
    }

    /**
     * Update user status
     */
    static async updateUserStatus(userId: string, status: UserStatus): Promise<void> {
        await this.updateUser(userId, { status });
    }

    /**
     * Search users by name or email
     */
    static async searchUsers(searchTerm: string, limitResults = 10): Promise<User[]> {
        // Note: Firestore doesn't support full-text search natively
        // This is a simple implementation that searches by exact email match
        // For better search, consider using Algolia or similar service

        const emailQuery = query(
            this.collection,
            where('email', '>=', searchTerm),
            where('email', '<=', searchTerm + '\uf8ff'),
            limit(limitResults)
        );

        const nameQuery = query(
            this.collection,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff'),
            limit(limitResults)
        );

        const [emailResults, nameResults] = await Promise.all([
            getDocs(emailQuery),
            getDocs(nameQuery)
        ]);

        const users = new Map<string, User>();

        // Combine results and remove duplicates
        [...emailResults.docs, ...nameResults.docs].forEach(doc => {
            users.set(doc.id, { id: doc.id, ...doc.data() } as User);
        });

        return Array.from(users.values()).slice(0, limitResults);
    }

    /**
     * Get user statistics
     */
    static async getUserStats(userId: string): Promise<{
        totalMissions: number;
        completedMissions: number;
        totalRewards: number;
        averageRating: number;
    }> {
        // This would typically aggregate data from missions and mission_users collections
        // For now, return mock data - implement based on your needs
        return {
            totalMissions: 0,
            completedMissions: 0,
            totalRewards: 0,
            averageRating: 0,
        };
    }

    /**
     * Check if user exists
     */
    static async userExists(userId: string): Promise<boolean> {
        const user = await this.getUserById(userId);
        return user !== null;
    }

    /**
     * Check if email is already registered
     */
    static async emailExists(email: string): Promise<boolean> {
        const user = await this.getUserByEmail(email);
        return user !== null;
    }
}
