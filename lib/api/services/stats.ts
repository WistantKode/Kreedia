import type {
    GlobalStats,
    MissionsByStatus,
    TopContributor,
    TopNgo,
} from '../../../types/api';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class StatsService {
    static async getGlobalStats(): Promise<GlobalStats> {
        return apiClient.get<GlobalStats>(API_ENDPOINTS.STATS.GLOBAL);
    }

    static async getMissionsByStatus(): Promise<MissionsByStatus> {
        return apiClient.get<MissionsByStatus>(API_ENDPOINTS.STATS.MISSIONS_BY_STATUS);
    }

    static async getTopContributors(limit = 10): Promise<TopContributor[]> {
        return apiClient.get<TopContributor[]>(API_ENDPOINTS.STATS.TOP_CONTRIBUTORS, { limit });
    }

    static async getTopNgos(limit = 10): Promise<TopNgo[]> {
        return apiClient.get<TopNgo[]>(API_ENDPOINTS.STATS.TOP_NGOS, { limit });
    }
}
