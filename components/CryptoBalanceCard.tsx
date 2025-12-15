import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Card, CardContent } from "./ui/Card";

interface CryptoBalanceCardProps {
  symbol: string;
  name: string;
  balance: number;
  logo: string;
  change?: number;
}

const CryptoBalanceCard: React.FC<CryptoBalanceCardProps> = ({
  symbol,
  name,
  balance,
  logo,
  change = 0,
}) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-3">
        <div className="flex items-center space-x-4">
          {/* Logo de la crypto */}
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-8 h-8"
              onError={(e) => {
                // Fallback si l'image ne charge pas
                e.currentTarget.style.display = "none";
                const fallbackElement = e.currentTarget.nextElementSibling;
                if (fallbackElement && "style" in fallbackElement) {
                  (fallbackElement as HTMLElement).style.display = "flex";
                }
              }}
            />
            <div
              className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center text-white font-bold text-sm hidden"
              style={{ display: "none" }}
            >
              {symbol.charAt(0)}
            </div>
          </div>

          {/* Informations de la crypto */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-sm text-foreground">{symbol}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {name}
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="mt-2">
              <p className="text-md text-foreground">
                {formatCurrency(balance, symbol)}
              </p>

              {/* Changement (optionnel) */}
              {change !== 0 && (
                <p
                  className={`text-xs mt-1 ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {formatCurrency(change, symbol)} (24h)
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoBalanceCard;
