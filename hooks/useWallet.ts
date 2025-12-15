"use client";

import { API_CONFIG } from '@/lib/api/config';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useAuth } from './useAuth';
import { useWagmiStatusSimple as useWagmiStatus } from './useWagmiStatusSimple';

export const useWallet = () => {
    const { isHealthy, wagmiError } = useWagmiStatus();
    const { user, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSyncedAddress, setLastSyncedAddress] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Gestion d'erreur pour useAccount
    let walletData = { address: null as string | null, isConnected: false, isConnecting: false };
    let disconnectFn = () => { };

    if (isHealthy) {
        try {
            const accountData = useAccount();
            const disconnectData = useDisconnect();
            walletData = {
                address: accountData.address || null,
                isConnected: accountData.isConnected,
                isConnecting: accountData.isConnecting
            };
            disconnectFn = disconnectData.disconnect;
        } catch (err) {
            console.error('❌ Error with useAccount/useDisconnect:', err);
            setError('Wagmi connection error');
        }
    } else {
        console.warn('⚠️ Wagmi not healthy, using fallback mode');
        setError(wagmiError || 'Wagmi not available');
    }

    const { address, isConnected, isConnecting } = walletData;

    // Mémoriser les valeurs pour éviter les re-renders inutiles
    const walletState = useMemo(() => ({
        address,
        isConnected,
        isConnecting
    }), [address, isConnected, isConnecting]);

    const userState = useMemo(() => ({
        user,
        authLoading
    }), [user, authLoading]);

    // Synchroniser l'adresse wallet avec l'API Laravel quand elle change
    useEffect(() => {
        const updateWalletAddress = async () => {
            const { user } = userState;
            const { address } = walletState;
            const { authLoading } = userState;

            if (!user || !address || authLoading || isUpdating) return;

            // Éviter les appels répétés pour la même adresse
            if (lastSyncedAddress === address) return;

            // Si l'adresse wallet a changé
            if (user?.wallet_address !== address) {
                setIsUpdating(true);
                setLoading(true);
                setError(null);

                try {
                    console.log('🔗 Updating wallet address via API:', address);

                    const token = localStorage.getItem("token");


                    const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
                        method: 'PUT',
                        body: JSON.stringify({ wallet_address: address }),
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });


                    if (response.ok) {
                        const updatedUser = await response.json();
                        console.log('📥 Profile update response:', updatedUser);

                        // Mettre à jour le localStorage avec les nouvelles données
                        localStorage.setItem('user', JSON.stringify(updatedUser.data));

                        setLastSyncedAddress(address);
                        console.log('✅ Wallet address updated successfully, localStorage updated');

                        // Rediriger vers le dashboard pour recharger la page
                        window.location.href = '/dashboard';
                    } else {
                        console.log('❌ Erreur lors de la mise à jour du profil:', response);
                        setError('Échec de la mise à jour de l\'adresse du wallet');
                    }
                } catch (err) {
                    console.error('❌ Error updating wallet address:', err);
                    setError('Failed to update wallet address');
                } finally {
                    setLoading(false);
                    setIsUpdating(false);
                }
            }
        };

        updateWalletAddress();
    }, [walletState.address, userState.user?.wallet_address, lastSyncedAddress, userState.authLoading, isUpdating]);

    const disconnectWallet = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Supprimer l'adresse wallet via l'API d'abord
            if (userState.user) {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
                    method: 'PUT',
                    body: JSON.stringify({ wallet_address: null }),
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    console.log('📥 Profile update response (disconnect):', updatedUser);

                    // Mettre à jour le localStorage avec les nouvelles données
                    localStorage.setItem('user', JSON.stringify(updatedUser.data));

                    console.log('✅ Wallet address removed from API, localStorage updated');
                } else {
                    console.log('❌ Erreur lors de la mise à jour du profil:', response);
                    setError('Échec de la suppression de l\'adresse du wallet');
                }
            }

            // Déconnecter le wallet
            disconnectFn();

            // Réinitialiser l'état de synchronisation
            setLastSyncedAddress(null);

            console.log('✅ Wallet disconnected successfully');

            // Rediriger vers le dashboard pour recharger la page
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('❌ Error disconnecting wallet:', err);
            setError('Failed to disconnect wallet');
        } finally {
            setLoading(false);
        }
    }, [userState.user, disconnectFn]);

    // Reset de l'état de synchronisation
    const resetSyncState = useCallback(() => {
        setLastSyncedAddress(null);
        setError(null);
    }, []);

    // Mémoriser le retour pour éviter les re-renders
    return useMemo(() => ({
        // État du wallet
        address: walletState.address,
        isConnected: walletState.isConnected,
        isConnecting: walletState.isConnecting,

        // État de synchronisation
        loading: loading || userState.authLoading,
        error: error || wagmiError,

        // Données utilisateur
        hasWalletInAPI: !!userState.user?.wallet_address,
        isSynced: lastSyncedAddress === walletState.address,

        // Debug info
        isWagmiHealthy: isHealthy,
        wagmiError,

        // Actions
        disconnectWallet,
        resetSyncState,
    }), [
        walletState.address,
        walletState.isConnected,
        walletState.isConnecting,
        loading,
        userState.authLoading,
        error,
        wagmiError,
        userState.user?.wallet_address,
        lastSyncedAddress,
        isHealthy,
        disconnectWallet,
        resetSyncState
    ]);
};
