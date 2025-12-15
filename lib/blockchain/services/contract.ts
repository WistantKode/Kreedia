import KreediaContractABI from '@/KreediaContract.json';
import { BLOCKCHAIN_CONFIG } from '@/lib/api/config';
import { ethers } from 'ethers';

// Types pour les données du contrat
export interface WorkerEarnings {
    USDC: string;
    USDT: string;
    DAI: string;
}

export interface TokenInfo {
    address: string;
    symbol: string;
    decimals: number;
    earnings: string;
}

export interface DynamicWorkerEarnings {
    tokens: TokenInfo[];
    totalEarnings: Record<string, string>;
}

export interface NFTData {
    totalNFTs: number;
    missionNFTs: string[];
}

export interface MissionDetails {
    token: string;
    amount: string;
    ngo: string;
    worker: string;
    locked: boolean;
    completed: boolean;
    beforeNFTId: string;
    afterNFTId: string;
    timestamp: string;
}

export class ContractService {
    private provider: ethers.JsonRpcProvider | null = null;
    private contract: ethers.Contract | null = null;

    constructor() {
        this.initializeProvider();
    }

    private initializeProvider() {
        try {
            this.provider = new ethers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
            this.contract = new ethers.Contract(
                BLOCKCHAIN_CONFIG.KREEDIA_CONTRACT_ADDRESS,
                KreediaContractABI.abi,
                this.provider
            );
        } catch (error) {
            console.error('❌ Error initializing blockchain provider:', error);
        }
    }

    // Vérifier si le contrat est initialisé
    private ensureContract(): ethers.Contract {
        if (!this.contract) {
            throw new Error('Contract not initialized. Please check your configuration.');
        }
        return this.contract;
    }

    // Obtenir les tokens acceptés par le contrat
    async getAcceptedTokens(): Promise<string[]> {
        try {
            const contract = this.ensureContract();
            // Note: Cette fonction nécessite d'implémenter une fonction view dans le contrat
            // qui retourne tous les tokens acceptés, ou d'utiliser les adresses par défaut
            // Pour l'instant, on utilise les adresses configurées
            return [
                BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDC,
                BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDT,
                BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.DAI,
            ];
        } catch (error) {
            console.error('❌ Error fetching accepted tokens:', error);
            return [];
        }
    }

    // Obtenir les gains totaux d'un worker pour tous les tokens acceptés (version dynamique)
    async getDynamicWorkerEarnings(walletAddress: string): Promise<DynamicWorkerEarnings> {
        try {
            const contract = this.ensureContract();
            const acceptedTokens = await this.getAcceptedTokens();

            // Récupérer les gains pour chaque token accepté
            const earningsPromises = acceptedTokens.map(async (tokenAddress) => {
                const earnings = await contract.workerTotalEarned(walletAddress, tokenAddress);
                const symbol = this.getTokenSymbol(tokenAddress);
                const decimals = this.getTokenDecimals(tokenAddress);
                const formattedAmount = ethers.formatUnits(earnings, decimals);

                return {
                    address: tokenAddress,
                    symbol,
                    decimals,
                    earnings: formattedAmount,
                };
            });

            const tokens = await Promise.all(earningsPromises);

            // Créer un objet avec les gains par symbole
            const totalEarnings: Record<string, string> = {};
            tokens.forEach(token => {
                totalEarnings[token.symbol] = token.earnings;
            });

            return {
                tokens,
                totalEarnings,
            };
        } catch (error) {
            console.error('❌ Error fetching dynamic worker earnings:', error);
            return {
                tokens: [],
                totalEarnings: {},
            };
        }
    }

    // Obtenir les gains totaux d'un worker pour tous les tokens acceptés (version compatible)
    async getWorkerTotalEarned(walletAddress: string): Promise<WorkerEarnings> {
        try {
            const dynamicEarnings = await this.getDynamicWorkerEarnings(walletAddress);

            return {
                USDC: dynamicEarnings.totalEarnings.USDC || '0',
                USDT: dynamicEarnings.totalEarnings.USDT || '0',
                DAI: dynamicEarnings.totalEarnings.DAI || '0',
            };
        } catch (error) {
            console.error('❌ Error fetching worker earnings:', error);
            return {
                USDC: '0',
                USDT: '0',
                DAI: '0',
            };
        }
    }

    // Obtenir les décimales d'un token basé sur son adresse
    private getTokenDecimals(tokenAddress: string): number {
        const address = tokenAddress.toLowerCase();
        if (address === BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDC.toLowerCase() ||
            address === BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDT.toLowerCase()) {
            return 6; // USDC et USDT ont 6 décimales
        } else if (address === BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.DAI.toLowerCase()) {
            return 18; // DAI a 18 décimales
        }
        return 18; // Par défaut, 18 décimales
    }

    // Obtenir le symbole d'un token basé sur son adresse
    private getTokenSymbol(tokenAddress: string): string {
        const address = tokenAddress.toLowerCase();
        if (address === BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDC.toLowerCase()) {
            return 'USDC';
        } else if (address === BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDT.toLowerCase()) {
            return 'USDT';
        } else if (address === BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.DAI.toLowerCase()) {
            return 'DAI';
        }
        return 'UNKNOWN'; // Par défaut, symbole inconnu
    }

    // Obtenir le nombre total de NFTs d'un utilisateur
    async getUserNFTCount(walletAddress: string): Promise<number> {
        try {
            const contract = this.ensureContract();
            const balance = await contract.balanceOf(walletAddress);
            return Number(balance);
        } catch (error) {
            console.error('❌ Error fetching user NFT count:', error);
            return 0;
        }
    }

    // Obtenir les détails d'une mission
    async getMissionDetails(missionId: string): Promise<MissionDetails | null> {
        try {
            const contract = this.ensureContract();
            const mission = await contract.getMissionDetails(missionId);

            return {
                token: mission.token,
                amount: mission.amount.toString(),
                ngo: mission.ngo,
                worker: mission.worker,
                locked: mission.locked,
                completed: mission.completed,
                beforeNFTId: mission.beforeNFTId.toString(),
                afterNFTId: mission.afterNFTId.toString(),
                timestamp: mission.timestamp.toString(),
            };
        } catch (error) {
            console.error('❌ Error fetching mission details:', error);
            return null;
        }
    }

    // Obtenir le progrès d'une mission
    async getMissionProgress(missionId: string) {
        try {
            const contract = this.ensureContract();
            const progress = await contract.getMissionProgress(missionId);

            return {
                exists: progress.exists,
                locked: progress.locked,
                completed: progress.completed,
                beforeNFTId: progress.beforeNFTId.toString(),
                afterNFTId: progress.afterNFTId.toString(),
            };
        } catch (error) {
            console.error('❌ Error fetching mission progress:', error);
            return null;
        }
    }

    // Vérifier si un utilisateur a un NFT pour une mission spécifique
    async hasUserMissionNFT(walletAddress: string, missionId: string): Promise<boolean> {
        try {
            const contract = this.ensureContract();
            return await contract.hasUserMissionNFT(walletAddress, missionId);
        } catch (error) {
            console.error('❌ Error checking user mission NFT:', error);
            return false;
        }
    }

    // Obtenir les détails d'un NFT
    async getNFTDetails(tokenId: number) {
        try {
            const contract = this.ensureContract();
            const details = await contract.getNFTDetails(tokenId);

            return {
                missionId: details.missionId,
                photoType: Number(details.photoType), // 0 = BEFORE, 1 = AFTER
                owner: details.owner,
            };
        } catch (error) {
            console.error('❌ Error fetching NFT details:', error);
            return null;
        }
    }

    // Obtenir le nombre total de NFTs mintés
    async getTotalSupply(): Promise<number> {
        try {
            const contract = this.ensureContract();
            const totalSupply = await contract.totalSupply();
            return Number(totalSupply);
        } catch (error) {
            console.error('❌ Error fetching total supply:', error);
            return 0;
        }
    }

    // Vérifier si un token est accepté
    async isTokenAccepted(tokenAddress: string): Promise<boolean> {
        try {
            const contract = this.ensureContract();
            return await contract.acceptedTokens(tokenAddress);
        } catch (error) {
            console.error('❌ Error checking if token is accepted:', error);
            return false;
        }
    }
}

// Instance singleton
export const contractService = new ContractService();
