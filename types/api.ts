// Types pour les utilisateurs
export interface User {
    id: number;
    uid: string;
    name: string;
    email: string;
    phone?: string | null;
    gender?: 'male' | 'female' | 'other' | null;
    wallet_address?: string | null;
    ens_name?: string | null;
    role: 'contributor' | 'ngo';
    created_at: string;
    updated_at: string;
}

export interface UserStats {
    total_missions: number;
    completed_missions: number;
    pending_missions: number;
    total_earnings?: number;
    total_rewards_given?: number;
}

// Types pour l'authentification
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
}

export interface RegisterNgoData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    wallet_address?: string;
    ens_name?: string;
}

export interface RegisterContributorData {
    name: string;
    email: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    wallet_address?: string;
    ens_name?: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    wallet_address?: string | null;
    ens_name?: string | null;
}

export interface LoginData {
    email: string;
    password?: string; // Optionnel pour les contributeurs (Google Auth)
}

// Types pour les missions
export type MissionStatus = 'pending' | 'accepted' | 'rejected' | 'ongoing' | 'completed' | 'rewarded' | 'cancelled';

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Mission {
    id: number;
    uid: string;
    title: string;
    description: string;
    pictures: string[];
    clean_pictures: string[];
    location: Location;
    address: string;
    duration: number;
    status: MissionStatus;
    status_label?: string;
    available_actions?: string[];
    can_be_updated?: boolean;
    can_be_deleted?: boolean;
    is_final?: boolean;
    reward_amount?: number | null;
    reward_currency?: string | null;
    is_visible: boolean | number;
    proposer?: User;
    ngo?: User;
    created_at: string;
    updated_at: string;
}

export interface CreateMissionData {
    title: string;
    description: string;
    pictures: string[];
    location: Location;
    address: string;
    duration: number;
}

export interface UpdateMissionData {
    title?: string;
    description?: string;
    address?: string;
    duration?: number;
}

export interface AcceptMissionData {
    reward_amount: number;
    reward_currency: string;
}

export interface CompleteMissionData {
    clean_pictures: string[];
}

// Types pour les notifications
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'mission_accepted' | 'mission_completed' | 'mission_rewarded' | 'general';
    read_at?: string;
    data?: Record<string, any>;
    created_at: string;
}

export interface UnreadCount {
    unread_count: number;
}

// Types pour les statistiques
export interface GlobalStats {
    total_missions: number;
    total_contributors: number;
    total_ngos: number;
    total_rewards_distributed: number;
}

export interface MissionsByStatus {
    pending: number;
    accepted: number;
    completed: number;
    rewarded: number;
}

export interface TopContributor {
    id: string;
    name: string;
    missions_count: number;
    total_earnings: number;
}

export interface TopNgo {
    id: string;
    name: string;
    missions_count: number;
    total_rewards_given: number;
}

// Types pour l'upload
export interface UploadResponse {
    url: string;
    filename: string;
    size: number;
}

export interface MultipleUploadResponse {
    files: UploadResponse[];
}

// Types pour les paramètres de requête
export interface PaginationParams {
    page?: number;
    per_page?: number;
}

export interface MissionQueryParams extends PaginationParams {
    status?: MissionStatus;
    latitude?: number;
    longitude?: number;
    radius?: number;
    proposerId?: string;
    isVisible?: boolean;
}

// Types pour les réponses paginées
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
