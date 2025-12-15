export interface LocationCoordinates {
    lat: number;
    lng: number;
}

export interface LocationData {
    lat: number;
    lng: number;
    address: string;
    neighborhood: string;
}

export type LocationStatus = "pending" | "approved" | "rejected";

export interface SubmittedLocation {
    id: string;
    image: string;
    neighborhood: string;
    fullAddress: string;
    status: LocationStatus;
    submittedAt: Date;
    reviewedAt?: Date;
    rejectionReason?: string;
    location: LocationCoordinates;
    canWork: boolean;
}

export interface LocationSubmissionForm {
    image: File | null;
    location: LocationData | null;
    neighborhood: string;
    fullAddress: string;
    canWork: boolean;
}
