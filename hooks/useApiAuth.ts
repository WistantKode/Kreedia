"use client";

import { useWalletSimple } from '@/hooks/useWalletSimple';
import { AuthService } from '@/lib/api/services/auth';
import { User } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface UseApiAuthReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    signInWithGoogle: () => Promise<void>;
    signInAsNgo: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
    refreshUserData: () => Promise<void>;
    clearError: () => void;
    setUser: (user: User | null) => void;
    forceRefreshUserData: () => Promise<void>;
}

export const useApiAuth = (): UseApiAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);
    const router = useRouter();
    const { disconnectWallet } = useWalletSimple();

    // Function to refresh user data from API
    const refreshUserData = useCallback(async (): Promise<void> => {
        const token = AuthService.getStoredToken();
        if (!token) {
            console.log('⚠️ No token found, skipping user data refresh');
            return;
        }

        try {
            console.log('🔄 Refreshing user data from /auth/me...');
            const userData = await AuthService.getCurrentUser();
            setUser(userData.data);
            console.log('✅ User data refreshed successfully:', userData);
        } catch (err: any) {
            console.error('❌ Error refreshing user data:', err);
            if (err.status === 401) {
                // Token expiré, déconnecter l'utilisateur
                console.log('🔒 Token expired, signing out user');
                AuthService.clearAuthToken();
                setUser(null);
                router.push('/');
            } else {
                setError('Error loading user data');
            }
        }
    }, [router]);

    // Function to clear error
    const clearError = useCallback((): void => {
        setError(null);
    }, []);

    // Function to force refresh user data (useful for manual refresh)
    const forceRefreshUserData = useCallback(async (): Promise<void> => {
        setLoading(true);
        try {
            const token = AuthService.getStoredToken();
            if (!token) {
                console.log('⚠️ No token found, skipping user data refresh');
                return;
            }

            console.log('🔄 Force refreshing user data from /auth/me...');
            const userData = await AuthService.getCurrentUser();
            setUser(userData.data);
            console.log('✅ User data force refreshed successfully:', userData);
        } catch (err: any) {
            console.error('❌ Error force refreshing user data:', err);
            if (err.status === 401) {
                AuthService.clearAuthToken();
                setUser(null);
                router.push('/');
            } else {
                setError('Error loading user data');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Function to sign in with Google (Contributor) - API only
    const signInWithGoogle = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // For now, we'll use a mock Google auth flow
            // In a real implementation, you would integrate with Google OAuth
            const contributorData = {
                name: 'Google User',
                email: 'user@gmail.com',
            };

            console.log('✅ Google Auth successful:', contributorData);

            // Send to API endpoint /auth/contributor/login
            const response = await AuthService.loginContributor(contributorData);

            // Store token and user data locally
            AuthService.setAuthToken(response.data.token);
            setUser(response.data.user);

            console.log('✅ Contributor authenticated via API:', response.data.user);

            // Redirect to dashboard after successful authentication
            router.push('/dashboard');

        } catch (err: any) {
            console.error('❌ Google Auth error:', err);
            setError(err.message || 'Google authentication failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [router]);

    // Function to sign in as NGO
    const signInAsNgo = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔐 NGO login attempt:', { email });

            // Send to API endpoint /auth/ngo/login
            const response = await AuthService.loginNgo({ email, password });

            // Store token and user data locally
            AuthService.setAuthToken(response.data.token);
            setUser(response.data.user);

            console.log('✅ NGO authenticated via API:', response.data.user);

        } catch (err: any) {
            console.error('❌ NGO login error:', err);
            setError(err.message || 'NGO authentication failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Function to sign out
    const signOut = useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            console.log('🔄 Starting logout process...');

            // 1. Disconnect wallet first
            try {
                await disconnectWallet();
                console.log('✅ Wallet disconnected successfully');
            } catch (walletErr) {
                console.warn('⚠️ Wallet disconnect warning:', walletErr);
                // Continue with logout even if wallet disconnect fails
            }

            // 2. Call API logout endpoint
            try {
                await AuthService.logout();
                console.log('✅ API logout successful');
            } catch (apiErr: any) {
                console.warn('⚠️ API logout warning:', apiErr);
                // Continue with local cleanup even if API logout fails
            }

            // 3. Clear local storage and state
            AuthService.clearAuthToken();
            setUser(null);

            console.log('✅ Complete logout successful');

            // 5. Redirect to home page
            router.push('/');

        } catch (err: any) {
            console.error('❌ Sign out error:', err);
            setError('Error during sign out');
        } finally {
            setLoading(false);
        }
    }, [disconnectWallet, router]);

    // Initialize authentication state
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setLoading(true);

                // Check if we have a stored token
                const token = AuthService.getStoredToken();
                if (token) {
                    try {
                        const userData = await AuthService.getCurrentUser();
                        setUser(userData.data);
                        console.log('✅ API user data loaded:', userData.data);
                    } catch (err) {
                        console.error('❌ Error loading API user data:', err);
                        // If API token is invalid, clear it
                        AuthService.clearAuthToken();
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('❌ Error initializing auth:', err);
                setUser(null);
            } finally {
                setAuthInitialized(true);
                setLoading(false);
            }
        };

        initializeAuth();
    }, []); // Dépendances vides pour éviter les re-renders

    // Auto-refresh user data when component mounts or page reloads
    useEffect(() => {
        const initializeUserData = async () => {
            if (authInitialized) {
                const token = AuthService.getStoredToken();
                if (token) {
                    try {
                        // Always call /auth/me on page load to get fresh user data
                        const userData = await AuthService.getCurrentUser();
                        setUser(userData.data);
                        console.log('✅ User data refreshed on page load:', userData.data);
                    } catch (err: any) {
                        console.error('❌ Error refreshing user data on page load:', err);
                        if (err.status === 401) {
                            // Token expiré, déconnecter l'utilisateur
                            AuthService.clearAuthToken();
                            setUser(null);
                            router.push('/');
                        }
                    }
                } else {
                    setUser(null);
                }
            }
        };

        initializeUserData();
    }, [authInitialized, router]); // Dépendances stables

    // Mémoriser le retour pour éviter les re-renders
    return useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        signInAsNgo,
        signOut,
        isAuthenticated: !!user,
        refreshUserData,
        clearError,
        setUser,
        forceRefreshUserData,
    }), [
        user,
        loading,
        error,
        signInWithGoogle,
        signInAsNgo,
        signOut,
        refreshUserData,
        clearError,
        forceRefreshUserData
    ]);
};