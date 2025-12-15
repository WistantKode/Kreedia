"use client";

// Déclarer les types pour Google Identity Services
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (callback: (notification: any) => void) => void;
                    renderButton: (element: HTMLElement, config: any) => void;
                };
            };
        };
    }
}

import { AuthService } from '@/lib/api/services/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface User {
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

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
}

interface ApiResponseType {
    user: User;
    token: string;
    token_type: string;
}

interface UseAuthReturn {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    loading: boolean; // Alias pour compatibilité
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signOut: () => void;
    refreshUserData: () => Promise<void>;
    clearError: () => void;
    isGoogleLoaded: boolean; // Gardé pour compatibilité
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGoogleLoaded] = useState(true); // Toujours true pour la simulation
    const router = useRouter();

    // Charger les données depuis localStorage au montage
    useEffect(() => {
        const loadStoredData = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');

                if (storedUser && storedToken) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setToken(storedToken);
                    console.log('✅ User data loaded from localStorage:', userData);
                    console.log('✅ Token loaded from localStorage:', storedToken);
                    console.log('✅ isAuthenticated will be:', !!(userData && storedToken));
                }
            } catch (err) {
                console.error('❌ Error loading stored data:', err);
                clearStoredData();
            }
        };

        loadStoredData();
    }, []);

    const clearStoredData = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
    }, []);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    const refreshUserData = useCallback(async (): Promise<void> => {
        if (!token) return;

        try {
            setIsLoading(true);
            const response = await AuthService.getCurrentUser();

            if (response.success) {
                const userData = response.data;
                setUser(userData as User);
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('✅ User data refreshed:', userData);
            }
        } catch (err: any) {
            console.error('❌ Error refreshing user data:', err);
            if (err.status === 401) {
                // Token expiré, déconnecter l'utilisateur
                signOut();
            }
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    const signInWithGoogle = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            // Simulation de sélection de compte Gmail
            const mockAccounts = [
                { name: 'Parfait', email: 'parfait@gmail.com' },
                { name: 'Pakou', email: 'pakou@gmail.com' },
                { name: 'Moukitat', email: 'moukitat@gmail.com' }
            ];

            // Créer le popup de sélection de compte
            const response = await new Promise<any>((resolve, reject) => {
                // Créer le modal
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                `;

                // Créer le contenu du modal
                const modalContent = document.createElement('div');
                modalContent.style.cssText = `
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                `;

                modalContent.innerHTML = `
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="width: 40px; height: 40px; background: #4285f4; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: white; font-weight: bold; font-size: 18px;">G</span>
                        </div>
                        <h2 style="margin: 0; color: #202124; font-size: 20px; font-weight: 400;">Choisir un compte</h2>
                        <p style="margin: 8px 0 0; color: #5f6368; font-size: 14px;">Pour continuer vers Kreedia</p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        ${mockAccounts.map((account, index) => `
                            <div 
                                id="account-${index}"
                                style="
                                    display: flex;
                                    align-items: center;
                                    padding: 12px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    transition: background-color 0.2s;
                                    border: 1px solid #e0e0e0;
                                    margin-bottom: 8px;
                                "
                                onmouseover="this.style.backgroundColor='#f8f9fa'"
                                onmouseout="this.style.backgroundColor='white'"
                            >
                                <div style="width: 32px; height: 32px; background: #4285f4; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                                    <span style="color: white; font-weight: bold; font-size: 14px;">${account.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <div style="font-weight: 500; color: #202124; font-size: 14px;">${account.name}</div>
                                    <div style="color: #5f6368; font-size: 12px;">${account.email}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e0e0e0;">
                        <button 
                            id="cancel-btn"
                            style="
                                background: none;
                                border: none;
                                color: #5f6368;
                                cursor: pointer;
                                padding: 8px 16px;
                                border-radius: 4px;
                                font-size: 14px;
                            "
                            onmouseover="this.style.backgroundColor='#f8f9fa'"
                            onmouseout="this.style.backgroundColor='transparent'"
                        >
                            Annuler
                        </button>
                    </div>
                `;

                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                // Gérer la sélection de compte
                const handleAccountSelect = (account: any) => {
                    document.body.removeChild(modal);
                    resolve(account);
                };

                // Gérer l'annulation
                const handleCancel = () => {
                    document.body.removeChild(modal);
                    reject(new Error('Google sign-in was cancelled'));
                };

                // Ajouter les event listeners
                mockAccounts.forEach((account, index) => {
                    const accountElement = document.getElementById(`account-${index}`);
                    if (accountElement) {
                        accountElement.addEventListener('click', () => handleAccountSelect(account));
                    }
                });

                const cancelBtn = document.getElementById('cancel-btn');
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', handleCancel);
                }

                // Fermer en cliquant à l'extérieur
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        handleCancel();
                    }
                });

                // Fermer avec Escape
                const handleEscape = (e: KeyboardEvent) => {
                    if (e.key === 'Escape') {
                        handleCancel();
                        document.removeEventListener('keydown', handleEscape);
                    }
                };
                document.addEventListener('keydown', handleEscape);
            });

            console.log('✅ Google Auth simulation successful:', response);

            // Envoyer les données à l'API Laravel
            const contributorData = {
                name: response.name,
                email: response.email,
            };

            console.log('📤 Sending contributor data to API:', contributorData);
            const apiResponse = await AuthService.loginContributor(contributorData) as unknown as ApiResponseType;
            console.log('📥 API Response:', apiResponse);

            // Le client API retourne seulement data si success=true, sinon data complet
            // Donc apiResponse contient directement { user, token, token_type }
            if (apiResponse && apiResponse.user && apiResponse.token) {
                const { user: userData, token: userToken } = apiResponse;

                // Stocker les données
                setUser(userData as User);
                setToken(userToken);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('token', userToken);

                console.log('✅ User authenticated:', userData);
                console.log('✅ Token stored:', userToken);
                console.log('✅ localStorage user:', localStorage.getItem('user'));
                console.log('✅ localStorage token:', localStorage.getItem('token'));
                console.log('✅ isAuthenticated will be:', !!(userData && userToken));

                // Rediriger selon le rôle
                if (userData.role === 'contributor') {
                    router.push('/dashboard');
                } else if (userData.role === 'ngo') {
                    router.push('/ngo/dashboard');
                }
            } else {
                throw new Error('Authentication failed - invalid response format');
            }

        } catch (err: any) {
            console.error('❌ Google Auth error:', err);
            setError(err.message || 'Google authentication failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const signOut = useCallback(async (): Promise<void> => {
        try {
            setIsLoggingOut(true);
            setError(null);

            // Appeler l'API de déconnexion
            if (token) {
                console.log('🔄 Calling logout API...');
                await AuthService.logout();
                console.log('✅ Logout API successful');
            }
        } catch (err) {
            console.error('❌ Error during logout:', err);
            setError('Erreur lors de la déconnexion');
        } finally {
            // Nettoyer les données locales
            clearStoredData();
            setIsLoggingOut(false);

            // Rediriger vers la page de connexion
            router.push('/auth/signin');
        }
    }, [token, clearStoredData, router]);

    return {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        loading: isLoading || isLoggingOut, // Alias pour compatibilité
        error,
        signInWithGoogle,
        signOut,
        refreshUserData,
        clearError,
        isGoogleLoaded,
    };
};