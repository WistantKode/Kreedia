"use client";

import { UserService } from '@/lib/api/services/user';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './useAuth';

// Version simplifiée du hook useWallet sans wagmi
export const useWalletSimple = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    // Mémoriser les valeurs pour éviter les re-renders inutiles
    const walletState = useMemo(() => ({
        address: walletAddress,
        isConnected,
        isConnecting
    }), [walletAddress, isConnected, isConnecting]);

    const userState = useMemo(() => ({
        user,
        authLoading
    }), [user, authLoading]);

    // Synchroniser l'adresse wallet avec l'API Laravel
    useEffect(() => {
        if (user?.wallet_address && user.wallet_address !== walletAddress) {
            setWalletAddress(user.wallet_address);
            setIsConnected(true);
            console.log('✅ Wallet address loaded from API:', user.wallet_address);
        }
    }, [user?.wallet_address, walletAddress]);

    // Fonction pour connecter un wallet (simulée)
    const connectWallet = useCallback(async (address: string) => {
        try {
            setIsConnecting(true);
            setError(null);

            console.log('🔗 Connecting wallet:', address);

            // Mettre à jour l'API
            await UserService.updateProfile({
                wallet_address: address,
            });

            setWalletAddress(address);
            setIsConnected(true);
            console.log('✅ Wallet connected successfully');
        } catch (err) {
            console.error('❌ Error connecting wallet:', err);
            setError('Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    }, []);

    // Fonction pour déconnecter le wallet
    const disconnectWallet = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Supprimer l'adresse wallet via l'API
            if (userState.user) {
                await UserService.updateProfile({
                    wallet_address: null,
                });

                console.log('✅ Wallet address removed from API');
            }

            // Réinitialiser l'état local
            setWalletAddress(null);
            setIsConnected(false);

            console.log('✅ Wallet disconnected successfully');
        } catch (err) {
            console.error('❌ Error disconnecting wallet:', err);
            setError('Failed to disconnect wallet');
        } finally {
            setLoading(false);
        }
    }, [userState.user]);

    // Reset de l'état
    const resetSyncState = useCallback(() => {
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
        error,

        // Données utilisateur
        hasWalletInAPI: !!userState.user?.wallet_address,
        isSynced: walletAddress === userState.user?.wallet_address,

        // Debug info
        isWagmiHealthy: true, // Toujours true pour la version simple
        wagmiError: null,

        // Actions
        connectWallet,
        disconnectWallet,
        resetSyncState,
    }), [
        walletState.address,
        walletState.isConnected,
        walletState.isConnecting,
        loading,
        userState.authLoading,
        error,
        userState.user?.wallet_address,
        walletAddress,
        connectWallet,
        disconnectWallet,
        resetSyncState
    ]);
};
