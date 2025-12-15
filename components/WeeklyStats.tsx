import { faCamera, faLeaf, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface WeeklyStatsProps {
  missionsCompleted: number;
  areasImpacted: number;
  photosSubmitted: number;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({
  missionsCompleted,
  areasImpacted,
  photosSubmitted,
}) => {
  const stats = [
    {
      title: "Missions Completed",
      value: missionsCompleted,
      icon: faTrophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
    },
    {
      title: "Areas Impacted",
      value: areasImpacted,
      icon: faLeaf,
      color: "text-primary-500",
      bgColor: "bg-primary-50 dark:bg-primary-950",
    },
    {
      title: "Photos Submitted",
      value: photosSubmitted,
      icon: faCamera,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <div
              className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}
            >
              <FontAwesomeIcon
                icon={stat.icon}
                className={`h-4 w-4 ${stat.color}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WeeklyStats;
