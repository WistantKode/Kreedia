"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useMissionById } from "@/hooks/useApiMissions";
import {
  Calendar,
  Clock,
  DollarSign,
  ImageIcon,
  MapPin,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface MissionDetailsModalProps {
  missionId: string;
  isOpen: boolean;
  onClose: () => void;
}

const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({
  missionId,
  isOpen,
  onClose,
}) => {
  const { mission, loading, error } = useMissionById(missionId);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rewarded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "accepted":
        return "Acceptée";
      case "completed":
        return "Terminée";
      case "rewarded":
        return "Récompensée";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-foreground">
                Détails de la Mission
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Chargement...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {mission && (
                <div className="space-y-6">
                  {/* Title and Status */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-foreground">
                        {mission.title}
                      </h3>
                      <Badge className={getStatusColor(mission.status)}>
                        {getStatusLabel(mission.status)}
                      </Badge>
                    </div>

                    {mission.reward_amount && (
                      <div className="flex items-center space-x-2 mb-4">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          {mission.reward_amount} {mission.reward_currency}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Images */}
                  {mission.pictures && mission.pictures.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        Photos de la zone à nettoyer
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mission.pictures.map((picture, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden"
                          >
                            <Image
                              src={picture}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clean Pictures */}
                  {mission.clean_pictures &&
                    mission.clean_pictures.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                          <ImageIcon className="h-5 w-5 mr-2 text-green-600" />
                          Photos de la zone nettoyée
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mission.clean_pictures.map((picture, index) => (
                            <div
                              key={index}
                              className="relative aspect-video rounded-lg overflow-hidden"
                            >
                              <Image
                                src={picture}
                                alt={`Photo nettoyée ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-medium text-foreground mb-3">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Localisation
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {mission.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        Lat: {mission.location.latitude}, Lng:{" "}
                        {mission.location.longitude}
                      </p>
                    </div>

                    {/* Duration */}
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Durée estimée
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {mission.duration} heures
                      </p>
                    </div>

                    {/* Proposer */}
                    {mission.proposer && (
                      <div>
                        <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Proposé par
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">
                          {mission.proposer.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {mission.proposer.email}
                        </p>
                      </div>
                    )}

                    {/* Dates */}
                    <div>
                      <h4 className="text-lg font-medium text-foreground mb-3 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Dates importantes
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">Créée le:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {formatDate(mission.created_at)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Modifiée le:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">
                            {formatDate(mission.updated_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default MissionDetailsModal;
