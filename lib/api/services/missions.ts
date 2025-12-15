import type {
    AcceptMissionData,
    CompleteMissionData,
    CreateMissionData,
    Mission,
    MissionQueryParams,
    PaginatedResponse,
    UpdateMissionData,
} from '../../../types/api';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class MissionService {
    static async getAllMissions(params?: MissionQueryParams): Promise<PaginatedResponse<Mission>> {
        return apiClient.get<PaginatedResponse<Mission>>(API_ENDPOINTS.MISSIONS.LIST, params);
    }

    static async createMission(data: CreateMissionData): Promise<Mission> {
        return apiClient.post<Mission>(API_ENDPOINTS.MISSIONS.CREATE, data);
    }

    static async getMissionById(id: string): Promise<Mission> {
        return apiClient.get<Mission>(API_ENDPOINTS.MISSIONS.DETAIL(id));
    }

    static async updateMission(id: string, data: UpdateMissionData): Promise<Mission> {
        return apiClient.put<Mission>(API_ENDPOINTS.MISSIONS.UPDATE(id), data);
    }

    static async deleteMission(id: string): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.MISSIONS.DELETE(id));
    }

    static async acceptMission(id: string, data: AcceptMissionData): Promise<Mission> {
        return apiClient.post<Mission>(API_ENDPOINTS.MISSIONS.ACCEPT(id), data);
    }

    static async completeMission(id: string, data: CompleteMissionData): Promise<Mission> {
        return apiClient.post<Mission>(API_ENDPOINTS.MISSIONS.COMPLETE(id), data);
    }

    static async rewardMission(id: string): Promise<Mission> {
        return apiClient.post<Mission>(API_ENDPOINTS.MISSIONS.REWARD(id));
    }

    static async getMyMissions(params?: MissionQueryParams): Promise<PaginatedResponse<Mission>> {
        return apiClient.get<PaginatedResponse<Mission>>(API_ENDPOINTS.MISSIONS.MY_MISSIONS, params);
    }

    static async getNgoMissions(params?: MissionQueryParams): Promise<PaginatedResponse<Mission>> {
        return apiClient.get<PaginatedResponse<Mission>>(API_ENDPOINTS.MISSIONS.NGO_MISSIONS, params);
    }
}
