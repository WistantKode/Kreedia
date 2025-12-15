"use client";

import { MissionService } from '@/lib/api/services/missions';
import { AcceptMissionData, CompleteMissionData, CreateMissionData, Mission, MissionQueryParams } from '@/types/api';
import { useEffect, useState } from 'react';

interface UseApiMissionsOptions extends MissionQueryParams {
    enabled?: boolean;
    type?: 'all' | 'my' | 'ngo';
}

interface UseApiMissionsReturn {
    missions: Mission[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    loadMore: () => Promise<void>;
    hasMore: boolean;
    totalPages: number;
    currentPage: number;
}

export const useApiMissions = (options: UseApiMissionsOptions = {}): UseApiMissionsReturn => {
    const {
        enabled = true,
        type = 'all',
        page = 1,
        per_page = 20,
        ...queryParams
    } = options;

    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(page);

    const fetchMissions = async (pageNumber = 1, append = false) => {
        if (!enabled) return;

        try {
            setLoading(true);
            setError(null);

            const params = {
                page: pageNumber,
                per_page,
                ...queryParams
            };

            let response;
            switch (type) {
                case 'my':
                    response = await MissionService.getMyMissions(params);
                    break;
                case 'ngo':
                    response = await MissionService.getNgoMissions(params);
                    break;
                default:
                    response = await MissionService.getAllMissions(params);
            }

            const newMissions = response.data;

            if (append) {
                setMissions(prev => [...prev, ...newMissions]);
            } else {
                setMissions(newMissions);
            }

            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
            setHasMore(response.current_page < response.last_page);

            console.log(`✅ Missions loaded (${type}):`, {
                count: newMissions.length,
                page: response.current_page,
                total: response.total
            });

        } catch (err: any) {
            console.error('❌ Error fetching missions:', err);
            setError(err.message || 'Error loading missions');
        } finally {
            setLoading(false);
        }
    };

    const refetch = async () => {
        await fetchMissions(1, false);
    };

    const loadMore = async () => {
        if (!hasMore || loading) return;
        await fetchMissions(currentPage + 1, true);
    };

    useEffect(() => {
        fetchMissions(1, false);
    }, [enabled, type, JSON.stringify(queryParams), per_page]);

    return {
        missions,
        loading,
        error,
        refetch,
        loadMore,
        hasMore,
        totalPages,
        currentPage,
    };
};

// Hook spécialisé pour les missions disponibles (contributeurs)
export const useAvailableMissions = (options: MissionQueryParams = {}) => {
    return useApiMissions({
        ...options,
        type: 'all',
        status: 'pending', // Missions en attente d'acceptation par les NGOs
    });
};

// Hook spécialisé pour les missions en cours (contributeurs)
export const useOngoingMissions = (options: MissionQueryParams = {}) => {
    return useApiMissions({
        ...options,
        type: 'my',
        status: 'ongoing', // Missions en cours d'exécution
    });
};

// Hook spécialisé pour les missions rejetées (contributeurs)
export const useRejectedMissions = (options: MissionQueryParams = {}) => {
    return useApiMissions({
        ...options,
        type: 'my',
        status: 'rejected', // Missions rejetées par les NGOs
    });
};

// Hook spécialisé pour les missions annulées (contributeurs)
export const useCancelledMissions = (options: MissionQueryParams = {}) => {
    return useApiMissions({
        ...options,
        type: 'my',
        status: 'cancelled', // Missions annulées
    });
};

// Hook spécialisé pour les missions de l'utilisateur (contributeurs)
export const useUserMissions = (options: MissionQueryParams = {}) => {
    return useApiMissions({
        ...options,
        type: 'my',
    });
};

// Hook spécialisé pour les missions NGO
export const useNgoMissions = (options: MissionQueryParams = {}) => {
    return useApiMissions({
        ...options,
        type: 'ngo',
    });
};

// Hook pour une mission spécifique
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
                console.log('✅ Mission loaded:', missionData);
            } catch (err: any) {
                console.error('❌ Error fetching mission:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMission();
    }, [missionId]);

    return { mission, loading, error };
};

// Hook pour les actions sur les missions
export const useMissionActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMission = async (data: CreateMissionData): Promise<Mission | null> => {
        try {
            setLoading(true);
            setError(null);
            const mission = await MissionService.createMission(data);
            console.log('✅ Mission created:', mission);
            return mission;
        } catch (err: any) {
            console.error('❌ Error creating mission:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const acceptMission = async (missionId: string, data: AcceptMissionData): Promise<Mission | null> => {
        try {
            setLoading(true);
            setError(null);
            const mission = await MissionService.acceptMission(missionId, data);
            console.log('✅ Mission accepted:', mission);
            return mission;
        } catch (err: any) {
            console.error('❌ Error accepting mission:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const completeMission = async (missionId: string, data: CompleteMissionData): Promise<Mission | null> => {
        try {
            setLoading(true);
            setError(null);
            const mission = await MissionService.completeMission(missionId, data);
            console.log('✅ Mission completed:', mission);
            return mission;
        } catch (err: any) {
            console.error('❌ Error completing mission:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const rewardMission = async (missionId: string): Promise<Mission | null> => {
        try {
            setLoading(true);
            setError(null);
            const mission = await MissionService.rewardMission(missionId);
            console.log('✅ Mission rewarded:', mission);
            return mission;
        } catch (err: any) {
            console.error('❌ Error rewarding mission:', err);
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        createMission,
        acceptMission,
        completeMission,
        rewardMission,
    };
};
