import {
    COLLECTIONS,
    CreateMissionData,
    GeoPoint,
    Mission,
    MissionLevel,
    MissionStatus,
    UpdateMissionData
} from '@/types/firebase';
import {
    collection,
    deleteDoc,
    doc,
    DocumentSnapshot,
    GeoPoint as FirestoreGeoPoint,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryConstraint,
    serverTimestamp,
    setDoc,
    startAfter,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config';

export class MissionService {
    private static collection = collection(db, COLLECTIONS.MISSIONS);

    /**
     * Create a new mission
     */
    static async createMission(missionData: CreateMissionData): Promise<string> {
        const missionRef = doc(this.collection);
        const now = serverTimestamp();

        const newMission: Omit<Mission, 'id'> = {
            ...missionData,
            position: new FirestoreGeoPoint(
                missionData.position.latitude,
                missionData.position.longitude
            ) as any,
            status: missionData.status || MissionStatus.PENDING,
            isVisible: missionData.isVisible ?? true,
            currentParticipants: 0,
            createdAt: now as Timestamp,
            updatedAt: now as Timestamp,
        };

        await setDoc(missionRef, newMission);
        return missionRef.id;
    }

    /**
     * Get mission by ID
     */
    static async getMissionById(missionId: string): Promise<Mission | null> {
        const missionRef = doc(this.collection, missionId);
        const missionSnap = await getDoc(missionRef);

        if (missionSnap.exists()) {
            const data = missionSnap.data();
            return {
                id: missionSnap.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as Mission;
        }
        return null;
    }

    /**
     * Update mission
     */
    static async updateMission(missionId: string, updateData: UpdateMissionData): Promise<void> {
        const missionRef = doc(this.collection, missionId);
        const dataToUpdate: any = {
            ...updateData,
            updatedAt: serverTimestamp(),
        };

        // Convert GeoPoint if provided
        if (updateData.position) {
            dataToUpdate.position = new FirestoreGeoPoint(
                updateData.position.latitude,
                updateData.position.longitude
            );
        }

        await updateDoc(missionRef, dataToUpdate);
    }

    /**
     * Delete mission
     */
    static async deleteMission(missionId: string): Promise<void> {
        const missionRef = doc(this.collection, missionId);
        await deleteDoc(missionRef);
    }

    /**
     * Get missions with filters
     */
    static async getMissions(filters?: {
        status?: MissionStatus;
        level?: MissionLevel;
        proposerId?: string;
        isVisible?: boolean;
        limit?: number;
        orderByField?: keyof Mission;
        orderDirection?: 'asc' | 'desc';
        lastDoc?: DocumentSnapshot;
    }): Promise<{ missions: Mission[]; lastDoc?: DocumentSnapshot }> {
        const constraints: QueryConstraint[] = [];

        if (filters?.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters?.level) {
            constraints.push(where('level', '==', filters.level));
        }

        if (filters?.proposerId) {
            constraints.push(where('proposerId', '==', filters.proposerId));
        }

        if (filters?.isVisible !== undefined) {
            constraints.push(where('isVisible', '==', filters.isVisible));
        }

        if (filters?.orderByField) {
            constraints.push(orderBy(filters.orderByField, filters.orderDirection || 'desc'));
        } else {
            constraints.push(orderBy('createdAt', 'desc'));
        }

        if (filters?.lastDoc) {
            constraints.push(startAfter(filters.lastDoc));
        }

        if (filters?.limit) {
            constraints.push(limit(filters.limit));
        }

        const q = query(this.collection, ...constraints);
        const querySnapshot = await getDocs(q);

        const missions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as Mission;
        });

        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

        return { missions, lastDoc };
    }

    /**
     * Get available missions (visible and active)
     */
    static async getAvailableMissions(limitResults = 20): Promise<Mission[]> {
        const { missions } = await this.getMissions({
            status: MissionStatus.ACTIVE,
            isVisible: true,
            limit: limitResults
        });
        return missions;
    }

    /**
     * Get missions by proposer
     */
    static async getMissionsByProposer(proposerId: string, limitResults = 20): Promise<Mission[]> {
        const { missions } = await this.getMissions({
            proposerId,
            limit: limitResults
        });
        return missions;
    }

    /**
     * Get missions near location
     */
    static async getMissionsNearLocation(
        location: GeoPoint,
        radiusKm: number = 10,
        limitResults = 20
    ): Promise<Mission[]> {
        // Note: Firestore doesn't have built-in geospatial queries
        // This is a simplified implementation
        // For production, consider using geohashing or a specialized geospatial database

        const { missions } = await this.getMissions({
            status: MissionStatus.ACTIVE,
            isVisible: true,
            limit: limitResults * 2 // Get more to filter by distance
        });

        // Filter by distance (rough calculation)
        return missions.filter(mission => {
            const distance = this.calculateDistance(
                location,
                mission.position
            );
            return distance <= radiusKm;
        });
    }

    /**
     * Update mission status
     */
    static async updateMissionStatus(
        missionId: string,
        status: MissionStatus,
        validatedBy?: string
    ): Promise<void> {
        const updateData: UpdateMissionData = { status };

        if (status === MissionStatus.VERIFIED && validatedBy) {
            updateData.validatedAt = serverTimestamp() as Timestamp;
        }

        await this.updateMission(missionId, updateData);
    }

    /**
     * Search missions by name or description
     */
    static async searchMissions(searchTerm: string, limitResults = 10): Promise<Mission[]> {
        // Simple text search - for better results use Algolia or similar
        const nameQuery = query(
            this.collection,
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff'),
            where('isVisible', '==', true),
            limit(limitResults)
        );

        const querySnapshot = await getDocs(nameQuery);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as Mission;
        });
    }

    /**
     * Get expired missions
     */
    static async getExpiredMissions(): Promise<Mission[]> {
        const now = Timestamp.now();
        const q = query(
            this.collection,
            where('deadline', '<=', now),
            where('status', '!=', MissionStatus.COMPLETED),
            where('status', '!=', MissionStatus.EXPIRED)
        );

        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                position: {
                    latitude: data.position.latitude,
                    longitude: data.position.longitude
                }
            } as Mission;
        });
    }

    /**
     * Mark expired missions
     */
    static async markExpiredMissions(): Promise<void> {
        const expiredMissions = await this.getExpiredMissions();

        const updatePromises = expiredMissions.map(mission =>
            this.updateMissionStatus(mission.id, MissionStatus.EXPIRED)
        );

        await Promise.all(updatePromises);
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    private static calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(point2.latitude - point1.latitude);
        const dLon = this.toRad(point2.longitude - point1.longitude);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(point1.latitude)) * Math.cos(this.toRad(point2.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private static toRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Get mission statistics
     */
    static async getMissionStats(missionId: string): Promise<{
        totalApplications: number;
        acceptedApplications: number;
        completedApplications: number;
    }> {
        // This would query the mission_users collection
        // For now, return mock data
        return {
            totalApplications: 0,
            acceptedApplications: 0,
            completedApplications: 0,
        };
    }
}
