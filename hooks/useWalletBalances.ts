"use client";

import { useUserNFTs, useWorkerEarnings } from "@/hooks/useBlockchainData";
import { useWallet } from "@/hooks/useWallet";
import { BLOCKCHAIN_CONFIG } from "@/lib/api/config";
import { useEffect, useState } from "react";

interface TokenBalance {
    symbol: string;
    balance: string;
    decimals: number;
    contractAddress: string;
}

interface WalletBalances {
    USDC: TokenBalance | null;
    USDT: TokenBalance | null;
    DAI: TokenBalance | null;
    NFT: {
        count: number;
        collections: string[];
    } | null;
    loading: boolean;
    error: string | null;
}

export const useWalletBalances = (): WalletBalances => {
    const { address, isConnected } = useWallet();
    const { earnings, loading: earningsLoading, error: earningsError } = useWorkerEarnings();
    const { totalNFTs, loading: nftLoading, error: nftError } = useUserNFTs();

    const [balances, setBalances] = useState<WalletBalances>({
        USDC: null,
        USDT: null,
        DAI: null,
        NFT: null,
        loading: false,
        error: null,
    });

    useEffect(() => {
        const updateBalances = () => {
            if (!address || !isConnected) {
                setBalances({
                    USDC: null,
                    USDT: null,
                    DAI: null,
                    NFT: null,
                    loading: false,
                    error: null,
                });
                return;
            }

            const loading = earningsLoading || nftLoading;
            const error = earningsError || nftError;

            setBalances({
                USDC: {
                    symbol: "USDC",
                    balance: earnings.USDC,
                    decimals: 6,
                    contractAddress: BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDC,
                },
                USDT: {
                    symbol: "USDT",
                    balance: earnings.USDT,
                    decimals: 6,
                    contractAddress: BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.USDT,
                },
                DAI: {
                    symbol: "DAI",
                    balance: earnings.DAI,
                    decimals: 18,
                    contractAddress: BLOCKCHAIN_CONFIG.TOKEN_ADDRESSES.DAI,
                },
                NFT: {
                    count: totalNFTs,
                    collections: ["Kreedia Impact"],
                },
                loading,
                error,
            });

            if (!loading && !error) {
                console.log("✅ Wallet balances updated from blockchain:", {
                    USDC: earnings.USDC,
                    USDT: earnings.USDT,
                    DAI: earnings.DAI,
                    totalNFTs,
                });
            }
        };

        updateBalances();
    }, [address, isConnected, earnings, totalNFTs, earningsLoading, nftLoading, earningsError, nftError]);

    return balances;
};
