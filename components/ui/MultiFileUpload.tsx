"use client";

import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadedFile } from "@/lib/upload/api";
import { File, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "./Button";

interface MultiFileUploadProps {
  onUploadComplete: (files: UploadedFile[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number; // en MB
  acceptedTypes?: string[];
  existingFiles?: UploadedFile[];
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onUploadComplete,
  onUploadError,
  className = "",
  disabled = false,
  placeholder = "Click to add files",
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = [],
  existingFiles = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook d'upload personnalisé
  const {
    isUploading,
    uploadedFiles,
    error: uploadError,
    progress,
    uploadMultipleFiles,
    validateFile,
    formatFileSize,
    removeFile,
    clearFiles,
    reset,
  } = useFileUpload({
    maxFiles,
    maxFileSize,
    acceptedTypes,
    onSuccess: (files) => {
      onUploadComplete([...existingFiles, ...files]);
    },
    onError: (error) => {
      onUploadError?.(error);
    },
  });

  const allFiles = [...existingFiles, ...uploadedFiles];

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // Vérifier le nombre total de fichiers
    if (allFiles.length + fileArray.length > maxFiles) {
      onUploadError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    try {
      await uploadMultipleFiles(fileArray);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
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

  const handleRemoveFile = (index: number) => {
    if (index < existingFiles.length) {
      // Fichier existant - on ne peut pas le supprimer via l'upload
      return;
    }

    const uploadIndex = index - existingFiles.length;
    removeFile(uploadIndex);
  };

  const handleClearAll = () => {
    clearFiles();
    reset();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
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
        `}
      >
        {allFiles.length > 0 ? (
          <div className="p-4">
            {/* Header avec actions */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-foreground">
                Uploaded Files ({allFiles.length}/{maxFiles})
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  disabled={
                    disabled || isUploading || allFiles.length >= maxFiles
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add More
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearAll();
                  }}
                  disabled={disabled || isUploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Liste des fichiers */}
            <div className="space-y-2">
              {allFiles.map((file, index) => (
                <div
                  key={`${file.file_name}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.original_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)} •{" "}
                        {file.extension.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    disabled={
                      disabled || isUploading || index < existingFiles.length
                    }
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Indicateur de chargement */}
            {isUploading && (
              <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                  <div className="flex-1">
                    <p className="text-sm text-primary-700 dark:text-primary-300">
                      Uploading files...
                    </p>
                    {progress > 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
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
                  Uploading files...
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
                  <File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {placeholder}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop files here, or click to select
                </p>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Maximum {maxFiles} files</p>
                  <p>Maximum size: {maxFileSize}MB per file</p>
                  {acceptedTypes.length > 0 && (
                    <p>Accepted types: {acceptedTypes.join(", ")}</p>
                  )}
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
      {dragActive && allFiles.length === 0 && (
        <div className="absolute inset-0 border-2 border-primary-500 border-dashed rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <p className="text-primary-600 dark:text-primary-400 font-medium">
              Drop files to upload
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
