import { User } from '@/types/api';

/**
 * Vérifie si l'utilisateur est une NGO
 */
export const isNgo = (user: User | null): boolean => {
    return user?.role === 'ngo' || false;
};

/**
 * Vérifie si l'utilisateur est un contributeur
 */
export const isContributor = (user: User | null): boolean => {
    return user?.role === 'contributor' || false;
};

/**
 * Retourne le type principal de l'utilisateur
 */
export const getUserType = (user: User | null): 'ngo' | 'contributor' | 'unknown' => {
    if (!user) return 'unknown';
    if (isNgo(user)) return 'ngo';
    if (isContributor(user)) return 'contributor';
    return 'unknown';
};

/**
 * Retourne le nom d'affichage du type d'utilisateur
 */
export const getUserTypeLabel = (user: User | null): string => {
    const type = getUserType(user);
    switch (type) {
        case 'ngo': return 'Organisation';
        case 'contributor': return 'Contributeur';
        default: return 'Utilisateur';
    }
};
