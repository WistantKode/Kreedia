"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { MissionStatus } from "@/types/api";
import {
  faAward,
  faCheckCircle,
  faClock,
  faCoins,
  faEdit,
  faEye,
  faMapPin,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Mission {
  id: number;
  uid: string;
  title: string;
  description: string;
  pictures: string[];
  clean_pictures: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  reward_amount: number | null;
  reward_currency: string | null;
  duration: number;
  status: MissionStatus;
  status_label: string;
  available_actions: string[];
  can_be_updated: boolean;
  can_be_deleted: boolean;
  is_final: boolean;
  is_visible: number;
  proposer: {
    id: number;
    uid: string;
    name: string;
    email: string;
    phone: string | null;
    gender: string | null;
    wallet_address: string | null;
    ens_name: string | null;
    role: string;
    created_at: string;
    updated_at: string;
  };
  ngo: {
    id: number;
    uid: string;
    name: string;
    email: string;
    phone: string | null;
    gender: string | null;
    wallet_address: string | null;
    ens_name: string | null;
    role: string;
    created_at: string;
    updated_at: string;
  } | null;
  created_at: string;
  updated_at: string;
}

interface MissionDetailsModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !mission) return null;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ongoing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rewarded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {mission.title}
              </h2>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(mission.status)}>
                  {mission.status_label}
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDate(mission.created_at)}
                </span>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {mission.description}
                </p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Location
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faMapPin} className="h-4 w-4" />
                  <span>{mission.address}</span>
                </div>
              </div>

              {/* Duration */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Duration
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                  <span>{mission.duration} days</span>
                </div>
              </div>

              {/* Reward */}
              {mission.reward_amount && mission.reward_currency && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Reward
                  </h3>
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <FontAwesomeIcon icon={faCoins} className="h-4 w-4" />
                    <span className="font-semibold">
                      {mission.reward_amount} {mission.reward_currency}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Proposer */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Proposer
                </h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="h-5 w-5 text-white"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {mission.proposer.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {mission.proposer.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* NGO (if accepted) */}
              {mission.ngo && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Assigned NGO
                  </h3>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="h-5 w-5 text-white"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {mission.ngo.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {mission.ngo.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pictures */}
              {mission.pictures.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Pictures
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mission.pictures.map((picture, index) => (
                      <img
                        key={index}
                        src={picture}
                        alt={`Mission picture ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Clean Pictures (if any) */}
              {mission.clean_pictures.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Clean Pictures
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {mission.clean_pictures.map((picture, index) => (
                      <img
                        key={index}
                        src={picture}
                        alt={`Clean picture ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {mission.available_actions.includes("update") && (
                <Button>
                  <FontAwesomeIcon icon={faEdit} className="h-4 w-4 mr-2" />
                  Update
                </Button>
              )}
              {mission.available_actions.includes("delete") && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MissionsPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MissionStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch missions from API
  const fetchMissions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setError("No authentication token found");
        return;
      }

      const response = await fetch("/api/auth-missions/my-missions", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📥 Missions API Response:", data);

        if (data.success && Array.isArray(data.data)) {
          setMissions(data.data);
          console.log("✅ Missions loaded:", data.data.length, "missions");
        } else {
          console.error(
            "API returned success=false or data is not an array:",
            data
          );
          setError("Invalid response format from server");
          setMissions([]);
        }
      } else {
        const errorText = await response.text();
        console.error(
          "Failed to fetch missions:",
          response.status,
          response.statusText,
          errorText
        );
        setError(
          `Failed to fetch missions: ${response.status} ${response.statusText}`
        );
        setMissions([]);
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
      setError("Network error while fetching missions");
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [user]);

  // Filter missions by status and search term
  const filteredMissions = missions.filter((mission) => {
    const matchesStatus = activeTab === "all" || mission.status === activeTab;
    const matchesSearch =
      !searchTerm ||
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Group missions by status for counts
  const missionCounts = {
    all: missions.length,
    pending: missions.filter((m) => m.status === "pending").length,
    accepted: missions.filter((m) => m.status === "accepted").length,
    rejected: missions.filter((m) => m.status === "rejected").length,
    ongoing: missions.filter((m) => m.status === "ongoing").length,
    completed: missions.filter((m) => m.status === "completed").length,
    rewarded: missions.filter((m) => m.status === "rewarded").length,
    cancelled: missions.filter((m) => m.status === "cancelled").length,
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString));
  };

  const getStatusColor = (status: MissionStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ongoing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rewarded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleViewMission = (mission: Mission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const tabs = [
    { key: "all", label: "All", count: missionCounts.all },
    { key: "pending", label: "Pending", count: missionCounts.pending },
    { key: "accepted", label: "Accepted", count: missionCounts.accepted },
    { key: "rejected", label: "Rejected", count: missionCounts.rejected },
    { key: "ongoing", label: "Ongoing", count: missionCounts.ongoing },
    { key: "completed", label: "Completed", count: missionCounts.completed },
    { key: "rewarded", label: "Rewarded", count: missionCounts.rewarded },
    { key: "cancelled", label: "Cancelled", count: missionCounts.cancelled },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Mission Propositions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your mission propositions and track their status
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => router.push("/missions/create")}
            className="flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            <span>Propose a Mission</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faAward}
                  className="h-4 w-4 text-primary-600 dark:text-primary-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Propositions
                </p>
                <p className="text-xl font-bold text-foreground">
                  {missions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faClock}
                  className="h-4 w-4 text-yellow-600 dark:text-yellow-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-xl font-bold text-foreground">
                  {missionCounts.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Accepted
                </p>
                <p className="text-xl font-bold text-foreground">
                  {missionCounts.accepted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faAward}
                  className="h-4 w-4 text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-xl font-bold text-foreground">
                  {missionCounts.completed + missionCounts.rewarded}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search missions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Mission Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as MissionStatus | "all")}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-primary-500 text-primary-600 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <span>{tab.label}</span>
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Mission Grid */}
      <div>
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading missions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faTimes}
                  className="h-8 w-8 text-red-500"
                />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Error Loading Missions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button
                onClick={() => {
                  setError(null);
                  fetchMissions();
                }}
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Mission Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMissions.map((mission) => (
              <Card
                key={mission.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {mission.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(mission.status)}>
                          {mission.status_label}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(mission.created_at)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMission(mission)}
                    >
                      <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {mission.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faMapPin} className="h-4 w-4" />
                      <span className="truncate">{mission.address}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                      <span>{mission.duration} days</span>
                    </div>

                    {mission.reward_amount && mission.reward_currency && (
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <FontAwesomeIcon icon={faCoins} className="h-4 w-4" />
                        <span className="font-semibold">
                          {mission.reward_amount} {mission.reward_currency}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {mission.available_actions.includes("update") && (
                      <Button variant="outline" size="sm">
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="h-4 w-4 mr-2"
                        />
                        Update
                      </Button>
                    )}
                    {mission.available_actions.includes("delete") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="h-4 w-4 mr-2"
                        />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMissions.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="h-8 w-8 text-gray-400"
                />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                No missions found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {activeTab === "all"
                  ? "You haven't created any missions yet"
                  : `No missions with status "${activeTab}" found`}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mission Details Modal */}
      <MissionDetailsModal
        mission={selectedMission}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMission(null);
        }}
      />
    </div>
  );
};

export default MissionsPage;
