"use client";

import { UploadService } from '@/lib/api/services/upload';
import { useState } from 'react';

interface UseApiUploadReturn {
    uploading: boolean;
    error: string | null;
    uploadSingle: (file: File) => Promise<string | null>;
    uploadMultiple: (files: File[]) => Promise<string[] | null>;
    clearError: () => void;
}

export const useApiUpload = (): UseApiUploadReturn => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => {
        setError(null);
    };

    const uploadSingle = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            setError(null);

            console.log('📤 Uploading single file:', file.name);

            const response = await UploadService.uploadSingleFile(file);

            console.log('✅ File uploaded successfully:', response.url);
            return response.url;

        } catch (err: any) {
            console.error('❌ Error uploading file:', err);
            setError(err.message || 'Error uploading file');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const uploadMultiple = async (files: File[]): Promise<string[] | null> => {
        try {
            setUploading(true);
            setError(null);

            console.log('📤 Uploading multiple files:', files.map(f => f.name));

            const response = await UploadService.uploadMultipleFiles(files);
            const urls = response.files.map(file => file.url);

            console.log('✅ Files uploaded successfully:', urls);
            return urls;

        } catch (err: any) {
            console.error('❌ Error uploading files:', err);
            setError(err.message || 'Error uploading files');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return {
        uploading,
        error,
        uploadSingle,
        uploadMultiple,
        clearError,
    };
};
