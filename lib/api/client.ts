"use client";

import { API_CONFIG } from './config';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

interface ApiError {
    message: string;
    status?: number;
    errors?: Record<string, string[]>;
}

class ApiClient {
    private baseURL: string;
    private timeout: number;
    private token: string | null = null;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;

        // Charger le token depuis le localStorage au démarrage
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    setAuthToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('auth_token', token);
            } else {
                localStorage.removeItem('auth_token');
            }
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const defaultHeaders: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (this.token) {
            defaultHeaders['Authorization'] = `Bearer ${this.token}`;
        }

        const config: RequestInit = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data: ApiResponse<T> = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || 'Une erreur est survenue',
                    status: response.status,
                    errors: data.errors,
                } as ApiError;
            }

            // Si c'est une réponse de succès, retourner data.data, sinon data
            return data.success && data.data !== undefined ? data.data as T : data as T;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw {
                    message: 'Timeout: La requête a pris trop de temps',
                    status: 408,
                } as ApiError;
            }

            // Si l'erreur a déjà le bon format, on la relance
            if (error.message && error.status) {
                throw error as ApiError;
            }

            // Sinon, on crée une nouvelle erreur
            throw {
                message: error.message || 'Erreur de connexion',
                status: 0,
            } as ApiError;
        }
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        const url = new URL(endpoint, this.baseURL);

        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, String(params[key]));
                }
            });
        }

        return this.request<T>(url.pathname + url.search);
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    async uploadFile<T>(endpoint: string, file: File): Promise<T> {
        const formData = new FormData();
        formData.append('file', file);

        const headers: Record<string, string> = {
            'Accept': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return this.request<T>(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    }

    async uploadFiles<T>(endpoint: string, files: File[]): Promise<T> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files[]', file);
        });

        const headers: Record<string, string> = {
            'Accept': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return this.request<T>(endpoint, {
            method: 'POST',
            headers,
            body: formData,
        });
    }
}

// Instance singleton
export const apiClient = new ApiClient();
