import { formatCurrency } from "@/lib/utils";
import { faArrowTrendUp, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface BalanceCardProps {
  totalBalance: number;
  weeklyGains: number;
  currency?: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  totalBalance,
  weeklyGains,
  currency = "ETH",
}) => {
  const isPositiveGrowth = weeklyGains > 0;

  return (
    <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0 shadow-lg animate-pulse-glow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-primary-100">
          Total Balance
        </CardTitle>
        <FontAwesomeIcon icon={faWallet} className="h-4 w-4 text-primary-200" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">
          {formatCurrency(totalBalance, currency)}
        </div>
        <div className="flex items-center space-x-2 text-primary-100">
          <FontAwesomeIcon
            icon={faArrowTrendUp}
            className={`h-4 w-4 ${
              isPositiveGrowth ? "text-green-300" : "text-red-300"
            }`}
          />
          <span className="text-sm">
            {isPositiveGrowth ? "+" : ""}
            {formatCurrency(weeklyGains, currency)} this week
          </span>
        </div>
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-primary-100">Available</span>
            <span className="font-medium">
              {formatCurrency(totalBalance * 0.8, currency)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-primary-100">Staked</span>
            <span className="font-medium">
              {formatCurrency(totalBalance * 0.2, currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
