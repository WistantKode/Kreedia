"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'Kreedia',
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    chains: [
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        ...(process.env.NODE_ENV === 'development' ? [sepolia] : []),
    ],
    ssr: true, // Si votre dApp utilise le rendu côté serveur (SSR)
});
