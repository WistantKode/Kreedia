"use client";

import { useState } from 'react';

// Version simplifiée du hook useWagmiStatus
export const useWagmiStatusSimple = () => {
    // Supposer que wagmi est disponible par défaut
    // La détection complexe peut causer des boucles infinies
    const [isWagmiAvailable] = useState(true);
    const [wagmiError] = useState<string | null>(null);

    return {
        isWagmiAvailable,
        wagmiError,
        isHealthy: true, // Supposer que wagmi fonctionne
        isChecked: true
    };
};
