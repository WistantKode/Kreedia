import { useWallet } from '@/hooks/useWallet';
import { contractService, DynamicWorkerEarnings, NFTData, WorkerEarnings } from '@/lib/blockchain/services/contract';
import { useEffect, useState } from 'react';

export const useBlockchainData = () => {
    const { address, isConnected } = useWallet();
    const [workerEarnings, setWorkerEarnings] = useState<WorkerEarnings>({
        USDC: '0',
        USDT: '0',
        DAI: '0',
    });
    const [dynamicEarnings, setDynamicEarnings] = useState<DynamicWorkerEarnings>({
        tokens: [],
        totalEarnings: {},
    });
    const [nftData, setNftData] = useState<NFTData>({
        totalNFTs: 0,
        missionNFTs: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger les données blockchain
    const loadBlockchainData = async () => {
        if (!address || !isConnected) {
            setWorkerEarnings({ USDC: '0', USDT: '0', DAI: '0' });
            setDynamicEarnings({ tokens: [], totalEarnings: {} });
            setNftData({ totalNFTs: 0, missionNFTs: [] });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Charger les gains du worker (version compatible)
            const earnings = await contractService.getWorkerTotalEarned(address);
            setWorkerEarnings(earnings);

            // Charger les gains dynamiques (tous les tokens acceptés)
            const dynamicEarningsData = await contractService.getDynamicWorkerEarnings(address);
            setDynamicEarnings(dynamicEarningsData);

            // Charger le nombre de NFTs
            const totalNFTs = await contractService.getUserNFTCount(address);
            setNftData(prev => ({
                ...prev,
                totalNFTs,
            }));

            console.log('✅ Blockchain data loaded:', {
                earnings,
                dynamicEarnings: dynamicEarningsData,
                totalNFTs
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load blockchain data';
            setError(errorMessage);
            console.error('❌ Error loading blockchain data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Recharger les données
    const refreshData = () => {
        loadBlockchainData();
    };

    // Charger les données au montage et quand l'adresse change
    useEffect(() => {
        loadBlockchainData();
    }, [address, isConnected]);

    return {
        workerEarnings,
        dynamicEarnings,
        nftData,
        loading,
        error,
        refreshData,
    };
};

// Hook spécialisé pour les gains du worker
export const useWorkerEarnings = () => {
    const { workerEarnings, loading, error, refreshData } = useBlockchainData();

    return {
        earnings: workerEarnings,
        loading,
        error,
        refresh: refreshData,
    };
};

// Hook spécialisé pour les NFTs
export const useUserNFTs = () => {
    const { nftData, loading, error, refreshData } = useBlockchainData();

    return {
        totalNFTs: nftData.totalNFTs,
        loading,
        error,
        refresh: refreshData,
    };
};

// Hook spécialisé pour les gains dynamiques (tous les tokens acceptés)
export const useDynamicWorkerEarnings = () => {
    const { dynamicEarnings, loading, error, refreshData } = useBlockchainData();

    return {
        tokens: dynamicEarnings.tokens,
        totalEarnings: dynamicEarnings.totalEarnings,
        loading,
        error,
        refresh: refreshData,
    };
};
