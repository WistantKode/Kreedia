"use client";

import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadedFile } from "@/lib/upload/api";
import { Camera, Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "./Button";

interface ImageUploadProps {
  onUploadComplete: (result: UploadedFile) => void;
  onUploadError?: (error: string) => void;
  existingImageUrl?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxFileSize?: number; // en MB
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  onUploadError,
  existingImageUrl,
  className = "",
  disabled = false,
  placeholder = "Click to add an image",
  maxFileSize = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
}) => {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook d'upload personnalisé
  const {
    isUploading,
    error: uploadError,
    progress,
    uploadSingleFile,
    validateFile,
    generateImagePreview,
    reset,
  } = useFileUpload({
    maxFiles: 1,
    maxFileSize,
    acceptedTypes,
    onSuccess: (files) => {
      if (files.length > 0) {
        onUploadComplete(files[0]);
        setPreview(files[0].url);
      }
    },
    onError: (error) => {
      onUploadError?.(error);
      setPreview(existingImageUrl || null);
    },
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validation
    const validation = validateFile(file);
    if (!validation.valid) {
      onUploadError?.(validation.error!);
      return;
    }

    try {
      // Créer une prévisualisation immédiate
      const previewUrl = await generateImagePreview(file);
      setPreview(previewUrl);

      // Upload du fichier
      await uploadSingleFile(file);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
      setPreview(existingImageUrl || null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const removeImage = () => {
    setPreview(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
          ${
            dragActive
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-gray-300 dark:border-gray-600 hover:border-primary-400"
          }
          ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-50 dark:hover:bg-gray-800"
          }
          ${preview ? "border-solid" : ""}
        `}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />

            {/* Overlay avec actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  className="bg-white/90 text-gray-800 hover:bg-white"
                  disabled={disabled || isUploading}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="bg-red-500/90 text-white hover:bg-red-600"
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Indicateur de chargement */}
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Uploading...</p>
                  {progress > 0 && (
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {isUploading ? (
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Uploading...
                </p>
                {progress > 0 && (
                  <div className="w-48 bg-gray-200 rounded-full h-2 mx-auto">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {placeholder}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop your image here, or click to select
                </p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Supported formats: JPG, PNG, WebP</p>
                  <p>Maximum size: {maxFileSize}MB</p>
                </div>

                {/* Affichage des erreurs */}
                {uploadError && (
                  <div className="mt-4 p-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
                    {uploadError}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Indicateur de glisser-déposer actif */}
      {dragActive && !preview && (
        <div className="absolute inset-0 border-2 border-primary-500 border-dashed rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <p className="text-primary-600 dark:text-primary-400 font-medium">
              Drop to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
