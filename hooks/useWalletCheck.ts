"use client";

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

interface UseWalletCheckReturn {
    needsWalletConnection: boolean;
    walletAddress: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
    isWalletConnected: boolean;
}

export const useWalletCheck = (): UseWalletCheckReturn => {
    const { user, refreshUserData } = useAuth();
    const [needsWalletConnection, setNeedsWalletConnection] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    // Vérifier si l'utilisateur a besoin de connecter son wallet
    useEffect(() => {
        if (user) {
            const hasWallet = user.wallet_address && user.wallet_address !== null;
            setNeedsWalletConnection(!hasWallet);
            setWalletAddress(user.wallet_address || null);
        } else {
            setNeedsWalletConnection(false);
            setWalletAddress(null);
        }
    }, [user]);

    const connectWallet = useCallback(async () => {
        try {
            // Ici vous pouvez intégrer votre logique de connexion wallet
            // Pour l'instant, on simule une connexion
            console.log('🔗 Connecting wallet...');

            // Simuler une adresse wallet
            const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);

            // Mettre à jour l'utilisateur avec la nouvelle adresse
            // Dans un vrai scénario, vous appelleriez l'API pour mettre à jour l'utilisateur
            console.log('✅ Wallet connected:', mockAddress);

            // Rafraîchir les données utilisateur
            await refreshUserData();

        } catch (error) {
            console.error('❌ Error connecting wallet:', error);
        }
    }, [refreshUserData]);

    const disconnectWallet = useCallback(async () => {
        try {
            console.log('🔌 Disconnecting wallet...');

            // Dans un vrai scénario, vous appelleriez l'API pour supprimer l'adresse wallet
            console.log('✅ Wallet disconnected');

            // Rafraîchir les données utilisateur
            await refreshUserData();

        } catch (error) {
            console.error('❌ Error disconnecting wallet:', error);
        }
    }, [refreshUserData]);

    return {
        needsWalletConnection,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isWalletConnected: !!walletAddress,
    };
};
