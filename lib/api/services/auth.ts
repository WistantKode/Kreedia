import type {
    LoginData,
    LoginResponse,
    RegisterContributorData,
    RegisterNgoData,
    User,
} from '../../../types/api';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class AuthService {
    static async registerNgo(data: RegisterNgoData): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.NGO_REGISTER, data);
    }

    static async registerContributor(data: RegisterContributorData): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.CONTRIBUTOR_REGISTER, data);
    }

    static async loginNgo(data: LoginData): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.NGO_LOGIN, data);
    }

    static async loginContributor(data: { name: string; email: string }): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.CONTRIBUTOR_LOGIN, data);
    }

    static async getCurrentUser(): Promise<{ success: boolean; data: User }> {
        return apiClient.get<{ success: boolean; data: User }>(API_ENDPOINTS.AUTH.ME);
    }

    static async logout(): Promise<void> {
        return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
    }

    static setAuthToken(token: string | null) {
        apiClient.setAuthToken(token);
    }

    static getStoredToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    static clearStoredToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
        apiClient.setAuthToken(null);
    }

    static clearAuthToken(): void {
        this.clearStoredToken();
    }
}
