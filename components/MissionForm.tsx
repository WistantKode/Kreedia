"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import {
  faImage,
  faMapMarkerAlt,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import GoogleMapSelector from "./GoogleMapSelector";

interface MissionFormData {
  pictures: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
}

const MissionForm: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<MissionFormData>({
    pictures: [],
    location: { latitude: 0, longitude: 0 },
    address: "",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [useTestMode, setUseTestMode] = useState(false);

  // Gérer la sélection de fichier
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        // Afficher l'image immédiatement sans upload
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setUploadedImages((prev) => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Please select a valid image file");
      }
    }
  };

  // Supprimer une image
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Uploader une image vers le backend
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      if (result.success && result.file?.url) {
        return result.file.url;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Soumettre la proposition de mission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in to submit a mission proposal");
      return;
    }

    if (uploadedImages.length === 0) {
      setError("Please select at least one image");
      return;
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      setError("Please select a location on the map");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Uploader toutes les images
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < uploadedImages.length; i++) {
        const imageUrl = uploadedImages[i];
        if (imageUrl.startsWith("data:")) {
          // Convertir data URL en File
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], `image_${i}.png`, {
            type: "image/png",
          });

          const uploadedUrl = await uploadImage(file);
          if (uploadedUrl) {
            uploadedUrls.push(uploadedUrl);
          }
        } else {
          // URL déjà uploadée
          uploadedUrls.push(imageUrl);
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error("Failed to upload images");
      }

      // Créer la mission
      const missionData = {
        pictures: uploadedUrls,
        location: formData.location,
        address: formData.address,
      };

      console.log("📤 Mission data:", missionData);
      console.log(
        "🔑 Token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );
      console.log("🧪 Test mode:", useTestMode);

      const apiEndpoint = useTestMode
        ? "/api/test-mission"
        : "/api/auth-missions";
      console.log("🌐 API endpoint:", apiEndpoint);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(missionData),
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to parse error response" }));
        console.error("❌ Error creating mission:", errorData);
        throw new Error(errorData.message || "Failed to create mission");
      }

      const result = await response.json();
      console.log("✅ Mission created successfully:", result);
      setSuccess("Mission proposal submitted successfully!");

      // Rediriger vers la page des missions après 2 secondes
      setTimeout(() => {
        router.push("/missions");
      }, 2000);
    } catch (error) {
      console.error("Error submitting mission:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit mission"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // Gérer la sélection de localisation
  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      location: { latitude: location.latitude, longitude: location.longitude },
      address: location.address,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
            Submit Mission Proposal
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Help make the world cleaner by proposing an environmental cleanup
            mission.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faImage} className="mr-2" />
                Mission Photos
              </label>
              <div className="space-y-4">
                {/* Zone de drop */}
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FontAwesomeIcon
                    icon={faUpload}
                    className="text-4xl text-gray-400 mb-2"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    Click to select images or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </p>
                </div>

                {/* Input fichier caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple
                />

                {/* Images sélectionnées */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Mission photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                Mission Location
              </label>
              <GoogleMapSelector
                onLocationSelect={handleLocationSelect}
                initialLocation={
                  formData.location.latitude !== 0
                    ? {
                        latitude: formData.location.latitude,
                        longitude: formData.location.longitude,
                        address: formData.address,
                      }
                    : undefined
                }
              />
            </div>

            {/* Mode Test */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    Test Mode
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Enable to test mission creation without backend
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseTestMode(!useTestMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useTestMode
                      ? "bg-yellow-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useTestMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200">{success}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/missions")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || isUploading || uploadedImages.length === 0
                }
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting
                  ? isUploading
                    ? "Uploading Images..."
                    : "Creating Mission..."
                  : "Submit Proposal"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionForm;
