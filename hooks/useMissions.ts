"use client";

import { MissionService } from '@/lib/api/services/missions';
import { Mission, MissionStatus } from '@/types/api';
import { useEffect, useState } from 'react';

interface UseMissionsOptions {
    status?: MissionStatus;
    proposerId?: string;
    isVisible?: boolean;
    limit?: number;
    enabled?: boolean;
}

interface UseMissionsReturn {
    missions: Mission[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    loadMore: () => Promise<void>;
    hasMore: boolean;
}

export const useMissions = (options: UseMissionsOptions = {}): UseMissionsReturn => {
    const {
        status,
        proposerId,
        isVisible,
        limit: limitCount = 20,
        enabled = true
    } = options;

    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState<any>(null);

    // Fetch missions from API
    const fetchMissions = async () => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);

            const response = await MissionService.getAllMissions({
                status,
                proposerId,
                isVisible,
                per_page: limitCount,
                page: 1
            });

            setMissions(response.data);
            setHasMore(response.current_page < response.last_page);
        } catch (err: any) {
            console.error('Error fetching missions:', err);
            setError(err.message || 'Failed to fetch missions');
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        setHasMore(true);
        fetchMissions();
    };

    useEffect(() => {
        fetchMissions();
    }, [status, proposerId, isVisible, limitCount, enabled]);

    const loadMore = async () => {
        if (!hasMore || loading) return;

        try {
            const response = await MissionService.getAllMissions({
                status,
                proposerId,
                isVisible,
                per_page: limitCount,
                page: Math.floor(missions.length / limitCount) + 1
            });

            if (response.data.length < limitCount) {
                setHasMore(false);
            }

            setMissions(prev => [...prev, ...response.data]);
        } catch (err) {
            console.error('Error loading more missions:', err);
        }
    };

    return {
        missions,
        loading,
        error,
        refetch,
        loadMore,
        hasMore
    };
};

export const useAvailableMissions = (limitCount = 20) => {
    return useMissions({
        status: 'pending',
        isVisible: true,
        limit: limitCount
    });
};

export const useUserMissions = (userId: string, limitCount = 20) => {
    return useMissions({
        proposerId: userId,
        limit: limitCount,
        enabled: !!userId
    });
};

export const useMissionById = (missionId: string | null) => {
    const [mission, setMission] = useState<Mission | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!missionId) {
            setMission(null);
            setLoading(false);
            return;
        }

        const fetchMission = async () => {
            try {
                setLoading(true);
                setError(null);
                const missionData = await MissionService.getMissionById(missionId);
                setMission(missionData);
            } catch (err: any) {
                console.error('Error fetching mission:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMission();
    }, [missionId]);

    return { mission, loading, error };
};
