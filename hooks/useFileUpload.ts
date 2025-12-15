"use client";

import { UploadService, UploadedFile } from "@/lib/upload/api";
import { useCallback, useState } from "react";

interface UseFileUploadOptions {
    maxFiles?: number;
    maxFileSize?: number; // en MB
    acceptedTypes?: string[];
    onSuccess?: (files: UploadedFile[]) => void;
    onError?: (error: string) => void;
}

interface UseFileUploadReturn {
    // État
    isUploading: boolean;
    uploadedFiles: UploadedFile[];
    error: string | null;
    progress: number;

    // Actions
    uploadSingleFile: (file: File) => Promise<void>;
    uploadMultipleFiles: (files: File[]) => Promise<void>;
    clearFiles: () => void;
    removeFile: (index: number) => void;
    reset: () => void;

    // Utilitaires
    validateFile: (file: File) => { valid: boolean; error?: string };
    formatFileSize: (bytes: number) => string;
    isImageFile: (file: File) => boolean;
    generateImagePreview: (file: File) => Promise<string>;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
    const {
        maxFiles = 10,
        maxFileSize = 10,
        acceptedTypes = [],
        onSuccess,
        onError,
    } = options;

    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Validation personnalisée
    const validateFile = useCallback(
        (file: File): { valid: boolean; error?: string } => {
            // Vérification de la taille
            const maxSizeBytes = maxFileSize * 1024 * 1024;
            if (file.size > maxSizeBytes) {
                return {
                    valid: false,
                    error: `File size must be less than ${maxFileSize}MB. Current size: ${UploadService.formatFileSize(file.size)}`,
                };
            }

            // Vérification du type de fichier
            if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
                return {
                    valid: false,
                    error: `File type not allowed. Accepted types: ${acceptedTypes.join(", ")}`,
                };
            }

            return UploadService.validateFile(file);
        },
        [maxFileSize, acceptedTypes]
    );

    // Upload d'un seul fichier
    const uploadSingleFile = useCallback(
        async (file: File): Promise<void> => {
            try {
                setError(null);
                setIsUploading(true);
                setProgress(0);

                // Validation
                const validation = validateFile(file);
                if (!validation.valid) {
                    throw new Error(validation.error);
                }

                // Simulation de progression
                const progressInterval = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 100);

                // Upload
                const uploadedFile = await UploadService.uploadSingleFile(file);

                clearInterval(progressInterval);
                setProgress(100);

                // Mise à jour de l'état
                setUploadedFiles([uploadedFile]);
                onSuccess?.([uploadedFile]);

                // Reset du progress après un délai
                setTimeout(() => setProgress(0), 1000);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Upload failed";
                setError(errorMessage);
                onError?.(errorMessage);
                setProgress(0);
            } finally {
                setIsUploading(false);
            }
        },
        [validateFile, onSuccess, onError]
    );

    // Upload de plusieurs fichiers
    const uploadMultipleFiles = useCallback(
        async (files: File[]): Promise<void> => {
            try {
                setError(null);
                setIsUploading(true);
                setProgress(0);

                // Validation du nombre de fichiers
                if (files.length > maxFiles) {
                    throw new Error(`Maximum ${maxFiles} files allowed`);
                }

                // Validation de chaque fichier
                for (const file of files) {
                    const validation = validateFile(file);
                    if (!validation.valid) {
                        throw new Error(validation.error);
                    }
                }

                // Simulation de progression
                const progressInterval = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= 90) {
                            clearInterval(progressInterval);
                            return 90;
                        }
                        return prev + 10;
                    });
                }, 100);

                // Upload
                const uploadedFiles = await UploadService.uploadMultipleFiles(files);

                clearInterval(progressInterval);
                setProgress(100);

                // Mise à jour de l'état
                setUploadedFiles(uploadedFiles);
                onSuccess?.(uploadedFiles);

                // Reset du progress après un délai
                setTimeout(() => setProgress(0), 1000);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Upload failed";
                setError(errorMessage);
                onError?.(errorMessage);
                setProgress(0);
            } finally {
                setIsUploading(false);
            }
        },
        [maxFiles, validateFile, onSuccess, onError]
    );

    // Supprimer un fichier de la liste
    const removeFile = useCallback((index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    }, []);

    // Vider la liste des fichiers
    const clearFiles = useCallback(() => {
        setUploadedFiles([]);
        setError(null);
        setProgress(0);
    }, []);

    // Reset complet
    const reset = useCallback(() => {
        setUploadedFiles([]);
        setError(null);
        setProgress(0);
        setIsUploading(false);
    }, []);

    // Utilitaires
    const formatFileSize = useCallback((bytes: number) => {
        return UploadService.formatFileSize(bytes);
    }, []);

    const isImageFile = useCallback((file: File) => {
        return UploadService.isImageFile(file);
    }, []);

    const generateImagePreview = useCallback((file: File) => {
        return UploadService.generateImagePreview(file);
    }, []);

    return {
        // État
        isUploading,
        uploadedFiles,
        error,
        progress,

        // Actions
        uploadSingleFile,
        uploadMultipleFiles,
        clearFiles,
        removeFile,
        reset,

        // Utilitaires
        validateFile,
        formatFileSize,
        isImageFile,
        generateImagePreview,
    };
};
