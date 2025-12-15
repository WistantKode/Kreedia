// Configuration pour les appels API
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    TIMEOUT: 30000,
} as const;

// Configuration Blockchain
export const BLOCKCHAIN_CONFIG = {
    // Adresse du contrat Kreedia sur Sepolia testnet
    KREEDIA_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_KREEDIA_CONTRACT_ADDRESS || '',
    // Adresses des tokens sur Sepolia testnet
    TOKEN_ADDRESSES: {
        USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', // USDC sur Sepolia
        USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', // USDT sur Sepolia
        DAI: process.env.NEXT_PUBLIC_DAI_ADDRESS || '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357', // DAI sur Sepolia
    },
    // RPC URL pour Sepolia
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    // Chain ID pour Sepolia
    CHAIN_ID: 11155111,
} as const;

export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        NGO_REGISTER: '/auth/ngo/register',
        NGO_LOGIN: '/auth/ngo/login',
        CONTRIBUTOR_REGISTER: '/auth/contributor/register',
        CONTRIBUTOR_LOGIN: '/auth/contributor/login',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },

    // User Management
    USER: {
        PROFILE: '/user/profile',
        CHANGE_PASSWORD: '/user/change-password',
        STATS: '/user/stats',
    },

    // Missions
    MISSIONS: {
        LIST: '/missions',
        CREATE: '/missions',
        DETAIL: (id: string) => `/missions/${id}`,
        UPDATE: (id: string) => `/missions/${id}`,
        DELETE: (id: string) => `/missions/${id}`,
        ACCEPT: (id: string) => `/missions/${id}/accept`,
        COMPLETE: (id: string) => `/missions/${id}/complete`,
        REWARD: (id: string) => `/missions/${id}/reward`,
        MY_MISSIONS: '/missions/my-missions',
        NGO_MISSIONS: '/missions/ngo-missions',
    },

    // Notifications
    NOTIFICATIONS: {
        LIST: '/notifications',
        UNREAD_COUNT: '/notifications/unread-count',
        MARK_ALL_READ: '/notifications/mark-all-read',
    },

    // Upload
    UPLOAD: {
        SINGLE: '/upload',
        MULTIPLE: '/upload',
    },

    // Statistics
    STATS: {
        GLOBAL: '/stats/global',
        MISSIONS_BY_STATUS: '/stats/missions-by-status',
        TOP_CONTRIBUTORS: '/stats/top-contributors',
        TOP_NGOS: '/stats/top-ngos',
    },
} as const;
