import { API_CONFIG } from '@/lib/api/config';
import { User } from '@/types/api';

// Interface pour la mise à jour du profil
interface UpdateProfileData {
    name?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    wallet_address?: string | null;
    ens_name?: string | null;
}

export class UserService {
    private static getAuthHeaders(): HeadersInit {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    /**
     * Mettre à jour le profil utilisateur
     */
    static async updateProfile(data: UpdateProfileData): Promise<User> {
        try {
            console.log('📤 Updating user profile via API:', data);

            const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const result = await response.json();
            console.log('✅ Profile updated successfully:', result);

            return result.data;
        } catch (error) {
            console.error('❌ Error updating profile:', error);
            throw error;
        }
    }

    /**
     * Obtenir les statistiques de l'utilisateur
     */
    static async getUserStats(): Promise<any> {
        try {
            console.log('📊 Fetching user stats via API');

            const response = await fetch(`${API_CONFIG.BASE_URL}/user/stats`, {
                method: 'GET',
                headers: this.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user stats');
            }

            const result = await response.json();
            console.log('✅ User stats fetched successfully:', result);

            return result.data;
        } catch (error) {
            console.error('❌ Error fetching user stats:', error);
            throw error;
        }
    }

    /**
     * Changer le mot de passe
     */
    static async changePassword(data: {
        current_password: string;
        new_password: string;
        new_password_confirmation: string;
    }): Promise<void> {
        try {
            console.log('🔐 Changing password via API');

            const response = await fetch(`${API_CONFIG.BASE_URL}/user/change-password`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to change password');
            }

            console.log('✅ Password changed successfully');
        } catch (error) {
            console.error('❌ Error changing password:', error);
            throw error;
        }
    }
}