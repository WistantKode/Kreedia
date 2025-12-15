"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

// Hook pour détecter les problèmes avec wagmi
export const useWagmiStatus = () => {
    const [isWagmiAvailable, setIsWagmiAvailable] = useState(false);
    const [wagmiError, setWagmiError] = useState<string | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const checkRef = useRef(false);

    const checkWagmiStatus = useCallback(() => {
        // Éviter les vérifications multiples
        if (checkRef.current || isChecked) return;

        checkRef.current = true;

        try {
            // Vérifier si wagmi est disponible de manière statique
            if (typeof window !== 'undefined') {
                // Vérifier si wagmi est dans window (injecté par le provider)
                const wagmi = (window as any).__wagmi__;
                if (wagmi) {
                    setIsWagmiAvailable(true);
                    setWagmiError(null);
                    console.log('✅ Wagmi is available via window');
                } else {
                    // Vérifier via import dynamique
                    import('wagmi').then((wagmiModule) => {
                        if (wagmiModule && typeof wagmiModule.useAccount === 'function') {
                            setIsWagmiAvailable(true);
                            setWagmiError(null);
                            console.log('✅ Wagmi is available via import');
                        } else {
                            setIsWagmiAvailable(false);
                            setWagmiError('Wagmi hooks not available');
                            console.error('❌ Wagmi hooks not available');
                        }
                        setIsChecked(true);
                    }).catch((err) => {
                        setIsWagmiAvailable(false);
                        setWagmiError(err instanceof Error ? err.message : 'Wagmi not available');
                        console.error('❌ Wagmi import error:', err);
                        setIsChecked(true);
                    });
                }
            } else {
                // Server-side: supposer que wagmi est disponible
                setIsWagmiAvailable(true);
                setWagmiError(null);
                setIsChecked(true);
            }
        } catch (err) {
            setIsWagmiAvailable(false);
            setWagmiError(err instanceof Error ? err.message : 'Wagmi not available');
            console.error('❌ Wagmi error:', err);
            setIsChecked(true);
        }
    }, [isChecked]);

    useEffect(() => {
        // Vérifier une seule fois au montage
        if (!isChecked && !checkRef.current) {
            checkWagmiStatus();
        }
    }, [checkWagmiStatus, isChecked]);

    return {
        isWagmiAvailable,
        wagmiError,
        isHealthy: isWagmiAvailable && !wagmiError,
        isChecked
    };
};
