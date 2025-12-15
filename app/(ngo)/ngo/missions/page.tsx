"use client";

import AcceptMissionModal from "@/components/AcceptMissionModal";
import MissionDetailsModal from "@/components/MissionDetailsModal";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useNgoMissions } from "@/hooks/useApiMissions";
import {
  Award,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const NgoMissionsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "pending";

  const { missions, loading, error, refetch } = useNgoMissions({
    status: statusFilter as any,
    per_page: 20,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMission, setSelectedMission] = useState<number | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState<number | null>(null);

  // Filter missions by search term
  const filteredMissions = missions.filter((mission) => {
    if (!searchTerm) return true;
    return (
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "accepted":
        return Users;
      case "completed":
        return CheckCircle;
      case "rewarded":
        return Award;
      default:
        return Clock;
    }
  };

  const statusTabs = [
    {
      key: "pending",
      label: "En attente",
      count: missions.filter((m) => m.status === "pending").length,
    },
    {
      key: "accepted",
      label: "Acceptées",
      count: missions.filter((m) => m.status === "accepted").length,
    },
    {
      key: "completed",
      label: "Terminées",
      count: missions.filter((m) => m.status === "completed").length,
    },
    {
      key: "rewarded",
      label: "Récompensées",
      count: missions.filter((m) => m.status === "rewarded").length,
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gestion des Missions
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Examinez et gérez les missions proposées par les contributeurs
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher des missions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {statusTabs.map((tab) => {
            const Icon = getStatusIcon(tab.key);
            const isActive = statusFilter === tab.key;

            return (
              <a
                key={tab.key}
                href={`/ngo/missions?status=${tab.key}`}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {tab.count}
                </Badge>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">
            Chargement des missions...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={refetch} className="mt-4">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Missions Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMissions.map((mission) => (
            <Card key={mission.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Mission Images */}
                {mission.pictures && mission.pictures.length > 0 && (
                  <div className="relative h-48">
                    <Image
                      src={mission.pictures[0]}
                      alt={mission.title}
                      fill
                      className="object-cover"
                    />
                    {mission.pictures.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black/50 text-white">
                        +{mission.pictures.length - 1}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                        {mission.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(mission.status)}>
                          {getStatusLabel(mission.status)}
                        </Badge>
                        {mission.reward_amount && (
                          <Badge variant="secondary">
                            ${mission.reward_amount} {mission.reward_currency}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                    {mission.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{mission.address}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{mission.duration}h</span>
                      </div>
                      <span>•</span>
                      <span>Proposé le {formatDate(mission.created_at)}</span>
                    </div>

                    {mission.proposer && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>Par {mission.proposer.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMission(mission.id)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Voir détails</span>
                    </Button>

                    {mission.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => setShowAcceptModal(mission.id)}
                        className="flex items-center space-x-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accepter</span>
                      </Button>
                    )}

                    {mission.status === "completed" && (
                      <Button
                        size="sm"
                        onClick={() => setShowAcceptModal(mission.id)}
                        className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <Award className="h-4 w-4" />
                        <span>Récompenser</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMissions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aucune mission trouvée
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm
                ? "Aucune mission ne correspond à votre recherche"
                : `Aucune mission ${getStatusLabel(
                    statusFilter
                  ).toLowerCase()} pour le moment`}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Effacer la recherche
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {selectedMission && (
        <MissionDetailsModal
          missionId={selectedMission?.toString() || ""}
          isOpen={!!selectedMission}
          onClose={() => setSelectedMission(null)}
        />
      )}

      {showAcceptModal && (
        <AcceptMissionModal
          missionId={showAcceptModal.toString()}
          isOpen={!!showAcceptModal}
          onClose={() => setShowAcceptModal(null)}
          onSuccess={() => {
            setShowAcceptModal(null);
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default NgoMissionsPage;
