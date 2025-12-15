import type { MultipleUploadResponse, UploadResponse } from '../../../types/api';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export class UploadService {
    static async uploadSingleFile(file: File): Promise<UploadResponse> {
        return apiClient.uploadFile<UploadResponse>(API_ENDPOINTS.UPLOAD.SINGLE, file);
    }

    static async uploadMultipleFiles(files: File[]): Promise<MultipleUploadResponse> {
        return apiClient.uploadFiles<MultipleUploadResponse>(API_ENDPOINTS.UPLOAD.MULTIPLE, files);
    }
}
