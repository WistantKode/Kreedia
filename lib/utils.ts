import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(amount: number, currency: string = 'ETH'): string {
    return `${amount.toFixed(2)} ${currency}`;
}

// Format dates
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

// Generate random ID
export function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}
