import {
    COLLECTIONS,
    CreateMissionUserData,
    MissionUser,
    MissionUserStatus,
    UpdateMissionUserData
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

export class MissionUserService {
    private static collection = collection(db, COLLECTIONS.MISSION_USERS);

    /**
     * Apply for a mission
     */
    static async applyForMission(
        userId: string,
        missionId: string,
        additionalData?: Partial<CreateMissionUserData>
    ): Promise<string> {
        const missionUserRef = doc(this.collection);
        const now = serverTimestamp();

        const newMissionUser: Omit<MissionUser, 'id'> = {
            userId,
            missionId,
            status: MissionUserStatus.APPLIED,
            appliedAt: now as Timestamp,
            createdAt: now as Timestamp,
            updatedAt: now as Timestamp,
            ...additionalData,
        };

        await setDoc(missionUserRef, newMissionUser);
        return missionUserRef.id;
    }

    /**
     * Get mission-user relationship by ID
     */
    static async getMissionUserById(missionUserId: string): Promise<MissionUser | null> {
        const missionUserRef = doc(this.collection, missionUserId);
        const missionUserSnap = await getDoc(missionUserRef);

        if (missionUserSnap.exists()) {
            return { id: missionUserSnap.id, ...missionUserSnap.data() } as MissionUser;
        }
        return null;
    }

    /**
     * Get mission-user relationship by user and mission
     */
    static async getMissionUserByUserAndMission(
        userId: string,
        missionId: string
    ): Promise<MissionUser | null> {
        const q = query(
            this.collection,
            where('userId', '==', userId),
            where('missionId', '==', missionId),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as MissionUser;
        }
        return null;
    }

    /**
     * Update mission-user relationship
     */
    static async updateMissionUser(
        missionUserId: string,
        updateData: UpdateMissionUserData
    ): Promise<void> {
        const missionUserRef = doc(this.collection, missionUserId);
        await updateDoc(missionUserRef, {
            ...updateData,
            updatedAt: serverTimestamp(),
        });
    }

    /**
     * Delete mission-user relationship
     */
    static async deleteMissionUser(missionUserId: string): Promise<void> {
        const missionUserRef = doc(this.collection, missionUserId);
        await deleteDoc(missionUserRef);
    }

    /**
     * Get all mission-user relationships with filters
     */
    static async getMissionUsers(filters?: {
        userId?: string;
        missionId?: string;
        status?: MissionUserStatus;
        limit?: number;
        orderByField?: keyof MissionUser;
        orderDirection?: 'asc' | 'desc';
    }): Promise<MissionUser[]> {
        const constraints: QueryConstraint[] = [];

        if (filters?.userId) {
            constraints.push(where('userId', '==', filters.userId));
        }

        if (filters?.missionId) {
            constraints.push(where('missionId', '==', filters.missionId));
        }

        if (filters?.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters?.orderByField) {
            constraints.push(orderBy(filters.orderByField, filters.orderDirection || 'desc'));
        } else {
            constraints.push(orderBy('createdAt', 'desc'));
        }

        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(this.collection, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as MissionUser[];
    }

    /**
     * Get user's missions by status
     */
    static async getUserMissionsByStatus(
        userId: string,
        status: MissionUserStatus
    ): Promise<MissionUser[]> {
        return this.getMissionUsers({
            userId,
            status
        });
    }

    /**
     * Get mission applicants
     */
    static async getMissionApplicants(missionId: string): Promise<MissionUser[]> {
        return this.getMissionUsers({
            missionId,
            status: MissionUserStatus.APPLIED
        });
    }

    /**
     * Get accepted mission participants
     */
    static async getMissionParticipants(missionId: string): Promise<MissionUser[]> {
        return this.getMissionUsers({
            missionId,
            status: MissionUserStatus.ACCEPTED
        });
    }

    /**
     * Get completed mission participants
     */
    static async getCompletedMissionParticipants(missionId: string): Promise<MissionUser[]> {
        return this.getMissionUsers({
            missionId,
            status: MissionUserStatus.COMPLETED
        });
    }

    /**
     * Accept user application for mission
     */
    static async acceptApplication(
        userId: string,
        missionId: string,
        acceptedBy?: string
    ): Promise<void> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);

        if (!missionUser) {
            throw new Error('Mission application not found');
        }

        await this.updateMissionUser(missionUser.id, {
            status: MissionUserStatus.ACCEPTED,
            acceptedAt: serverTimestamp() as Timestamp,
        });
    }

    /**
     * Reject user application for mission
     */
    static async rejectApplication(
        userId: string,
        missionId: string,
        rejectionReason?: string
    ): Promise<void> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);

        if (!missionUser) {
            throw new Error('Mission application not found');
        }

        await this.updateMissionUser(missionUser.id, {
            status: MissionUserStatus.REJECTED,
            rejectedAt: serverTimestamp() as Timestamp,
            rejectionReason,
        });
    }

    /**
     * Start mission (change status to in progress)
     */
    static async startMission(userId: string, missionId: string): Promise<void> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);

        if (!missionUser) {
            throw new Error('Mission participation not found');
        }

        if (missionUser.status !== MissionUserStatus.ACCEPTED) {
            throw new Error('Mission must be accepted before starting');
        }

        await this.updateMissionUser(missionUser.id, {
            status: MissionUserStatus.IN_PROGRESS,
        });
    }

    /**
     * Complete mission with proof
     */
    static async completeMission(
        userId: string,
        missionId: string,
        completionProof?: {
            images?: string[];
            description?: string;
            location?: { latitude: number; longitude: number };
        }
    ): Promise<void> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);

        if (!missionUser) {
            throw new Error('Mission participation not found');
        }

        if (missionUser.status !== MissionUserStatus.IN_PROGRESS) {
            throw new Error('Mission must be in progress to complete');
        }

        const updateData: UpdateMissionUserData = {
            status: MissionUserStatus.COMPLETED,
            completedAt: serverTimestamp() as Timestamp,
        };

        if (completionProof) {
            updateData.completionProof = {
                ...completionProof,
                timestamp: serverTimestamp() as Timestamp,
            };
        }

        await this.updateMissionUser(missionUser.id, updateData);
    }

    /**
     * Withdraw from mission
     */
    static async withdrawFromMission(userId: string, missionId: string): Promise<void> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);

        if (!missionUser) {
            throw new Error('Mission participation not found');
        }

        await this.updateMissionUser(missionUser.id, {
            status: MissionUserStatus.WITHDRAWN,
        });
    }

    /**
     * Rate mission participant
     */
    static async rateMissionParticipant(
        userId: string,
        missionId: string,
        rating: number,
        feedback?: string,
        ratedBy: 'user' | 'proposer' = 'proposer'
    ): Promise<void> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);

        if (!missionUser) {
            throw new Error('Mission participation not found');
        }

        if (missionUser.status !== MissionUserStatus.COMPLETED) {
            throw new Error('Mission must be completed before rating');
        }

        const updateData: UpdateMissionUserData = {
            feedback,
        };

        if (ratedBy === 'proposer') {
            updateData.userRating = rating;
        } else {
            updateData.proposerRating = rating;
        }

        await this.updateMissionUser(missionUser.id, updateData);
    }

    /**
     * Check if user has already applied for mission
     */
    static async hasUserApplied(userId: string, missionId: string): Promise<boolean> {
        const missionUser = await this.getMissionUserByUserAndMission(userId, missionId);
        return missionUser !== null;
    }

    /**
     * Get user's mission history
     */
    static async getUserMissionHistory(userId: string, limitResults = 20): Promise<MissionUser[]> {
        return this.getMissionUsers({
            userId,
            limit: limitResults,
            orderByField: 'appliedAt',
            orderDirection: 'desc'
        });
    }

    /**
     * Get user's active missions
     */
    static async getUserActiveMissions(userId: string): Promise<MissionUser[]> {
        const [inProgress, accepted] = await Promise.all([
            this.getUserMissionsByStatus(userId, MissionUserStatus.IN_PROGRESS),
            this.getUserMissionsByStatus(userId, MissionUserStatus.ACCEPTED)
        ]);

        return [...inProgress, ...accepted];
    }

    /**
     * Get mission statistics for user
     */
    static async getUserMissionStats(userId: string): Promise<{
        totalApplied: number;
        totalAccepted: number;
        totalCompleted: number;
        totalRejected: number;
        averageRating: number;
    }> {
        const allMissions = await this.getMissionUsers({ userId });

        const stats = {
            totalApplied: allMissions.length,
            totalAccepted: allMissions.filter(m => m.status === MissionUserStatus.ACCEPTED).length,
            totalCompleted: allMissions.filter(m => m.status === MissionUserStatus.COMPLETED).length,
            totalRejected: allMissions.filter(m => m.status === MissionUserStatus.REJECTED).length,
            averageRating: 0,
        };

        // Calculate average rating
        const ratingsSum = allMissions
            .filter(m => m.userRating)
            .reduce((sum, m) => sum + (m.userRating || 0), 0);

        const ratingsCount = allMissions.filter(m => m.userRating).length;
        stats.averageRating = ratingsCount > 0 ? ratingsSum / ratingsCount : 0;

        return stats;
    }
}
