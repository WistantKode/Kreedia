"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import WalletConnectPrompt from "@/components/WalletConnectPrompt";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { UserService } from "@/lib/api/services/user";
import {
  faAward,
  faCheckCircle,
  faClock,
  faCoins,
  faDollarSign,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NgoDashboardPage: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { user, refreshUserData } = useAuth();

  // Load wallet balances
  const {
    USDC,
    USDT,
    DAI,
    NFT,
    loading: balancesLoading,
  } = useWalletBalances();

  // Update user profile with wallet address when wallet connects
  useEffect(() => {
    const updateUserWallet = async () => {
      if (address && user && user.wallet_address !== address) {
        try {
          console.log("Updating NGO wallet address:", address);
          const updatedUser = await UserService.updateProfile({
            wallet_address: address,
          });
          // Les données seront automatiquement rafraîchies par useAuth
          console.log("✅ NGO wallet address updated:", updatedUser);
        } catch (error) {
          console.error("❌ Error updating NGO wallet address:", error);
        }
      }
    };

    updateUserWallet();
  }, [address, user, refreshUserData]);

  // Check if user needs to connect wallet (no wallet_address in profile)
  const needsWalletConnection = !user?.wallet_address;

  return (
    <div className="space-y-8">
      {/* Show wallet connect prompt only if user has no wallet_address */}
      {needsWalletConnection ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <WalletConnectPrompt />
        </div>
      ) : (
        <>
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome{user?.name ? `, ${user.name}` : ""}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your environmental missions and track your impact.
              </p>
            </div>
            <Button
              onClick={() => router.push("/ngo/missions")}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
              <span>View Missions</span>
            </Button>
          </div>

          {/* Wallet Balances */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* USDC Balance */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <img
                      src="/crypto-logos/usdc.svg"
                      className="w-6 h-6"
                      alt="USDC"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      USDC Balance
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {balancesLoading ? "..." : USDC?.balance || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* USDT Balance */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <img
                      src="/crypto-logos/usdt.svg"
                      className="w-6 h-6"
                      alt="USDT"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      USDT Balance
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {balancesLoading ? "..." : USDT?.balance || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DAI Balance */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <img
                      src="/crypto-logos/dai.svg"
                      className="w-6 h-6"
                      alt="DAI"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      DAI Balance
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {balancesLoading ? "..." : DAI?.balance || "0.00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NFT Count */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faAward}
                      className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      NFT Count
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {balancesLoading ? "..." : NFT?.count || "0"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NGO Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Missions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total Missions
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {/* TODO: Add real mission count */}0
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Missions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faClock}
                      className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pending Review
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {/* TODO: Add real pending count */}0
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completed Missions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {/* TODO: Add real completed count */}0
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Rewards Distributed */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faDollarSign}
                      className="h-6 w-6 text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rewards Distributed
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {/* TODO: Add real rewards distributed */}
                      $0.00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Management */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Mission Management
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/ngo/missions?status=pending")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faClock} className="h-4 w-4 mr-2" />
                    Review Pending Missions
                  </Button>
                  <Button
                    onClick={() => router.push("/ngo/missions?status=accepted")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-2" />
                    Manage Active Missions
                  </Button>
                  <Button
                    onClick={() =>
                      router.push("/ngo/missions?status=completed")
                    }
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="h-4 w-4 mr-2"
                    />
                    Review Completed Missions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Financial Overview */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Financial Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total Wallet Value
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {/* TODO: Calculate total wallet value */}
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Available for Rewards
                    </span>
                    <span className="text-lg font-semibold text-green-600">
                      {/* TODO: Calculate available rewards */}
                      $0.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Rewards Distributed
                    </span>
                    <span className="text-lg font-semibold text-purple-600">
                      {/* TODO: Calculate distributed rewards */}
                      $0.00
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="text-center py-8">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="h-12 w-12 text-gray-400 mx-auto mb-4"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  No recent activity to display
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Activity will appear here as you manage missions
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default NgoDashboardPage;
