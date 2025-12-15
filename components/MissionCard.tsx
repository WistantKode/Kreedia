"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Mission } from "@/types/api";
import { Award, Clock, MapPin, User } from "lucide-react";
import Image from "next/image";
import React from "react";

interface MissionCardProps {
  mission: Mission;
  variant?: "default" | "compact" | "detailed";
  showProposer?: boolean;
  onClick?: () => void;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  variant = "default",
  showProposer = true,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ongoing":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rewarded":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDifficultyColor = (duration: number) => {
    if (duration <= 2)
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (duration <= 5)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };

  const getDifficultyLabel = (duration: number) => {
    if (duration <= 2) return "Facile";
    if (duration <= 5) return "Moyen";
    return "Difficile";
  };

  if (variant === "compact") {
    return (
      <div
        className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <Award className="h-4 w-4 text-green-500 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {mission.title}
          </p>
          <p className="text-xs text-gray-500 truncate">{mission.address}</p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {mission.status_label || "En attente"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {mission.duration} jours
              </Badge>
            </div>
            {mission.reward_amount && (
              <span className="text-xs text-green-600 font-medium">
                ${mission.reward_amount} {mission.reward_currency}
              </span>
            )}
          </div>
          {showProposer && mission.proposer && (
            <p className="text-xs text-gray-400 mt-1">
              Proposé par {mission.proposer.name}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {mission.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {mission.address}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={`text-xs ${getStatusColor(mission.status)}`}>
              {mission.status_label || mission.status}
            </Badge>
            {mission.reward_amount && (
              <span className="text-sm font-medium text-green-600">
                ${mission.reward_amount} {mission.reward_currency}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {mission.description}
        </p>

        {/* Images */}
        {mission.pictures && mission.pictures.length > 0 && (
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto">
              {mission.pictures.slice(0, 3).map((picture, index) => (
                <div key={index} className="flex-shrink-0">
                  <Image
                    src={picture}
                    alt={`Mission ${index + 1}`}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
              {mission.pictures.length > 3 && (
                <div className="flex-shrink-0 w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">
                    +{mission.pictures.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {mission.duration} jours
              </span>
            </div>
            <Badge
              className={`text-xs ${getDifficultyColor(mission.duration)}`}
            >
              {getDifficultyLabel(mission.duration)}
            </Badge>
          </div>

          {showProposer && mission.proposer && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {mission.proposer.name}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCard;
