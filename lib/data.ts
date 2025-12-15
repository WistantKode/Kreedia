import { NFT } from '@/components/NFTCard';

// Type pour les données mock (différent du type Mission de l'API)
interface MockMission {
    id: string;
    title: string;
    description: string;
    location: string;
    reward: number;
    difficulty: string;
    estimatedTime: string;
    status: string;
    nftReward: boolean;
}

export const mockMissions: MockMission[] = [
    {
        id: '1',
        title: 'Clean Central Park',
        description: 'Help clean up the central park area, focusing on plastic waste and litter around the pond.',
        location: 'Central Park, NYC',
        reward: 0.15,
        difficulty: 'Easy',
        estimatedTime: '2-3 hours',
        status: 'Available',
        nftReward: true,
    },
    {
        id: '2',
        title: 'Beach Cleanup Marathon',
        description: 'Join our weekly beach cleanup event. Remove plastic bottles, bags, and other debris.',
        location: 'Santa Monica Beach',
        reward: 0.25,
        difficulty: 'Medium',
        estimatedTime: '4-5 hours',
        status: 'Available',
        nftReward: true,
    },
    {
        id: '3',
        title: 'Urban Garden Restoration',
        description: 'Help restore the community garden by removing invasive plants and replanting native species.',
        location: 'Downtown Community Garden',
        reward: 0.12,
        difficulty: 'Medium',
        estimatedTime: '3-4 hours',
        status: 'In Progress',
        nftReward: false,
    },
    {
        id: '4',
        title: 'River Cleanup Initiative',
        description: 'Clean the riverbank and remove pollution from the water. Specialized equipment provided.',
        location: 'Hudson River',
        reward: 0.35,
        difficulty: 'Hard',
        estimatedTime: '6-8 hours',
        status: 'Available',
        nftReward: true,
    },
    {
        id: '5',
        title: 'City Park Maintenance',
        description: 'General maintenance of city park including trash removal and pathway cleaning.',
        location: 'Washington Square Park',
        reward: 0.08,
        difficulty: 'Easy',
        estimatedTime: '1-2 hours',
        status: 'Completed',
        nftReward: false,
    },
];

export const mockNFTs: NFT[] = [
    {
        id: '1',
        name: 'Central Park Hero',
        image: '/icon.png',
        rarity: 'Rare',
        location: 'Central Park, NYC',
        dateEarned: new Date('2024-03-15'),
        description: 'Awarded for completing the Central Park cleanup mission with outstanding dedication.',
    },
    {
        id: '2',
        name: 'Beach Guardian',
        image: '/icon.png',
        rarity: 'Epic',
        location: 'Santa Monica Beach',
        dateEarned: new Date('2024-03-10'),
        description: 'Exceptional performance in beach cleanup, removing over 50kg of waste.',
    },
    {
        id: '3',
        name: 'River Protector',
        image: '/icon.png',
        rarity: 'Legendary',
        location: 'Hudson River',
        dateEarned: new Date('2024-03-05'),
        description: 'Elite status achieved for leading a major river cleanup operation.',
    },
    {
        id: '4',
        name: 'Urban Gardener',
        image: '/icon.png',
        rarity: 'Uncommon',
        location: 'Downtown Garden',
        dateEarned: new Date('2024-02-28'),
        description: 'Contributed to urban garden restoration and native plant cultivation.',
    },
    {
        id: '5',
        name: 'Eco Warrior',
        image: '/icon.png',
        rarity: 'Common',
        location: 'Various Locations',
        dateEarned: new Date('2024-02-20'),
        description: 'Started the environmental journey with first cleanup mission.',
    },
    {
        id: '6',
        name: 'Waste Reducer',
        image: '/icon.png',
        rarity: 'Rare',
        location: 'City Center',
        dateEarned: new Date('2024-02-15'),
        description: 'Achieved significant waste reduction in urban area.',
    },
];

export const mockUserStats = {
    totalBalance: 3.45,
    weeklyGains: 0.23,
    missionsCompleted: 12,
    areasImpacted: 8,
    photosSubmitted: 24,
    nftCount: mockNFTs.length,
};

export const cryptoBalances = [
    {
        symbol: 'USDT',
        name: 'Tether USD',
        balance: 1250.75,
        logo: '/crypto-logos/usdt.svg',
        change: 15.50,
    },
    {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: 890.25,
        logo: '/crypto-logos/usdc.svg',
        change: 12.80,
    },
    {
        symbol: 'DAI',
        name: 'Dai Stablecoin',
        balance: 567.30,
        logo: '/crypto-logos/dai.svg',
        change: 8.90,
    },
];

export const completedMissions = mockMissions.filter(mission => mission.status === 'Completed');
export const availableMissions = mockMissions.filter(mission => mission.status === 'Available');
export const inProgressMissions = mockMissions.filter(mission => mission.status === 'In Progress');
