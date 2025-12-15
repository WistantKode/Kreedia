"use client";

import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface ProgressChartProps {
  data?: Array<{
    name: string;
    earnings: number;
    missions: number;
  }>;
}

const defaultData = [
  { name: "Week 1", earnings: 0.5, missions: 2 },
  { name: "Week 2", earnings: 0.8, missions: 3 },
  { name: "Week 3", earnings: 1.2, missions: 4 },
  { name: "Week 4", earnings: 1.8, missions: 6 },
  { name: "Week 5", earnings: 2.3, missions: 8 },
  { name: "Week 6", earnings: 3.1, missions: 12 },
  { name: "Week 7", earnings: 3.45, missions: 14 },
];

const ProgressChart: React.FC<ProgressChartProps> = ({
  data = defaultData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FontAwesomeIcon
            icon={faChartLine}
            className="h-5 w-5 text-primary-500"
          />
          <span>Earnings Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                className="text-sm"
                tick={{ fontSize: 12, fill: "currentColor" }}
              />
              <YAxis
                className="text-sm"
                tick={{ fontSize: 12, fill: "currentColor" }}
                label={{ value: "ETH", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--card-foreground)",
                }}
                formatter={(value: any, name: string) => [
                  name === "earnings" ? `${value} ETH` : `${value} missions`,
                  name === "earnings" ? "Total Earnings" : "Missions Completed",
                ]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#16a34a" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary-600">
              {data[data.length - 1]?.earnings.toFixed(2)} ETH
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Earned
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              +
              {(
                data[data.length - 1]?.earnings -
                  data[data.length - 2]?.earnings || 0
              ).toFixed(2)}{" "}
              ETH
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              This Week
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {data[data.length - 1]?.missions || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Missions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
