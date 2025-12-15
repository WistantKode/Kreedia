// Types pour l'API d'upload personnalisée
export interface UploadedFile {
    original_name: string;
    file_name: string;
    extension: string;
    size: number;
    url: string;
    path: string;
}

export interface UploadResponse {
    success: boolean;
    message: string;
    file?: UploadedFile;
    files?: UploadedFile[];
    errors?: Array<{
        file: string;
        error: string;
    }>;
    count?: number;
    type?: 'single' | 'multiple';
}

export interface UploadError {
    success: false;
    message: string;
    errors?: {
        [key: string]: string[];
    };
}

// Configuration de l'API
const UPLOAD_API_URL = process.env.NEXT_PUBLIC_UPLOAD_API_URL || 'http://localhost:8000/api/upload';

// Service d'upload de fichiers
export class UploadService {
    /**
     * Upload d'un seul fichier
     */
    static async uploadSingleFile(file: File): Promise<UploadedFile> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
            });

            const result: UploadResponse | UploadError = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Upload failed');
            }

            if (!result.success) {
                throw new Error(result.message || 'Upload failed');
            }

            if (!result.file) {
                throw new Error('No file returned from upload');
            }

            return result.file;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error(
                error instanceof Error ? error.message : 'Upload failed'
            );
        }
    }

    /**
     * Upload de plusieurs fichiers
     */
    static async uploadMultipleFiles(files: File[]): Promise<UploadedFile[]> {
        if (files.length === 0) {
            throw new Error('No files provided');
        }

        if (files.length > 10) {
            throw new Error('Maximum 10 files allowed');
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const response = await fetch(UPLOAD_API_URL, {
                method: 'POST',
                body: formData,
            });

            const result: UploadResponse | UploadError = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Upload failed');
            }

            if (!result.success) {
                throw new Error(result.message || 'Upload failed');
            }

            if (!result.files || result.files.length === 0) {
                throw new Error('No files returned from upload');
            }

            return result.files;
        } catch (error) {
            console.error('Upload error:', error);
            throw new Error(
                error instanceof Error ? error.message : 'Upload failed'
            );
        }
    }

    /**
     * Validation des fichiers avant upload
     */
    static validateFile(file: File): { valid: boolean; error?: string } {
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File size must be less than 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
            };
        }

        return { valid: true };
    }

    /**
     * Validation de plusieurs fichiers
     */
    static validateFiles(files: File[]): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (files.length === 0) {
            errors.push('No files provided');
        }

        if (files.length > 10) {
            errors.push('Maximum 10 files allowed');
        }

        files.forEach((file, index) => {
            const validation = this.validateFile(file);
            if (!validation.valid) {
                errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }

    /**
     * Formatage de la taille de fichier
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Vérification du type de fichier image
     */
    static isImageFile(file: File): boolean {
        return file.type.startsWith('image/');
    }

    /**
     * Génération d'un aperçu d'image
     */
    static generateImagePreview(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.isImageFile(file)) {
                reject(new Error('File is not an image'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    }
}
