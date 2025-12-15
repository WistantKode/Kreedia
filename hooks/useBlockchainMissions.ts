import { useWallet } from '@/hooks/useWallet';
import { contractService, MissionDetails } from '@/lib/blockchain/services/contract';
import { useEffect, useState } from 'react';

export const useBlockchainMissions = () => {
    const { address, isConnected } = useWallet();
    const [missions, setMissions] = useState<Record<string, MissionDetails>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Charger les détails d'une mission
    const loadMissionDetails = async (missionId: string) => {
        if (!address || !isConnected) return null;

        setLoading(true);
        setError(null);

        try {
            const details = await contractService.getMissionDetails(missionId);
            if (details) {
                setMissions(prev => ({
                    ...prev,
                    [missionId]: details,
                }));
            }
            return details;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load mission details';
            setError(errorMessage);
            console.error('❌ Error loading mission details:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Vérifier si l'utilisateur a un NFT pour une mission
    const checkUserMissionNFT = async (missionId: string) => {
        if (!address || !isConnected) return false;

        try {
            return await contractService.hasUserMissionNFT(address, missionId);
        } catch (err) {
            console.error('❌ Error checking user mission NFT:', err);
            return false;
        }
    };

    // Obtenir le progrès d'une mission
    const getMissionProgress = async (missionId: string) => {
        try {
            return await contractService.getMissionProgress(missionId);
        } catch (err) {
            console.error('❌ Error getting mission progress:', err);
            return null;
        }
    };

    return {
        missions,
        loading,
        error,
        loadMissionDetails,
        checkUserMissionNFT,
        getMissionProgress,
    };
};

// Hook pour une mission spécifique
export const useBlockchainMission = (missionId: string) => {
    const { loadMissionDetails, checkUserMissionNFT, getMissionProgress, loading, error } = useBlockchainMissions();
    const [missionDetails, setMissionDetails] = useState<MissionDetails | null>(null);
    const [hasNFT, setHasNFT] = useState<boolean>(false);
    const [progress, setProgress] = useState<any>(null);

    useEffect(() => {
        if (missionId) {
            const loadData = async () => {
                const details = await loadMissionDetails(missionId);
                const nftStatus = await checkUserMissionNFT(missionId);
                const missionProgress = await getMissionProgress(missionId);

                setMissionDetails(details);
                setHasNFT(nftStatus);
                setProgress(missionProgress);
            };

            loadData();
        }
    }, [missionId, loadMissionDetails, checkUserMissionNFT, getMissionProgress]);

    return {
        missionDetails,
        hasNFT,
        progress,
        loading,
        error,
        refresh: () => {
            if (missionId) {
                const loadData = async () => {
                    const details = await loadMissionDetails(missionId);
                    const nftStatus = await checkUserMissionNFT(missionId);
                    const missionProgress = await getMissionProgress(missionId);

                    setMissionDetails(details);
                    setHasNFT(nftStatus);
                    setProgress(missionProgress);
                };

                loadData();
            }
        },
    };
};
