"use client";

import BlockchainTest from "@/components/BlockchainTest";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import WalletConnectPrompt from "@/components/WalletConnectPrompt";
import { useAvailableMissions, useUserMissions } from "@/hooks/useApiMissions";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { UserService } from "@/lib/api/services/user";
import { faAward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const { user, refreshUserData } = useAuth();

  // Load user missions
  const { missions: userMissions, loading: userMissionsLoading } =
    useUserMissions({ per_page: 10 });

  // Load available missions
  const { missions: availableMissions, loading: availableMissionsLoading } =
    useAvailableMissions({ per_page: 6 });

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
          console.log("Updating user wallet address:", address);
          const updatedUser = await UserService.updateProfile({
            wallet_address: address,
          });
          // Les données seront automatiquement rafraîchies par useAuth
          console.log("✅ User wallet address updated:", updatedUser);
        } catch (error) {
          console.error("❌ Error updating wallet address:", error);
        }
      }
    };

    updateUserWallet();
  }, [address, user, refreshUserData]);

  const handleStartMission = (missionId: string) => {
    console.log("Starting mission:", missionId);
    // TODO: Implement mission start logic
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/missions/${missionId}`);
  };

  // Calculate statistics
  const pendingMissions = (userMissions || []).filter(
    (m) => m.status === "pending"
  ).length;
  const acceptedMissions = (userMissions || []).filter(
    (m) => m.status === "accepted"
  ).length;
  const ongoingMissions = (userMissions || []).filter(
    (m) => m.status === "ongoing"
  ).length;
  const completedMissions = (userMissions || []).filter(
    (m) => m.status === "completed"
  ).length;
  const rewardedMissions = (userMissions || []).filter(
    (m) => m.status === "rewarded"
  ).length;
  const rejectedMissions = (userMissions || []).filter(
    (m) => m.status === "rejected"
  ).length;
  const cancelledMissions = (userMissions || []).filter(
    (m) => m.status === "cancelled"
  ).length;
  const totalEarnings = (userMissions || [])
    .filter((m) => m.status === "rewarded" && m.reward_amount)
    .reduce((sum, m) => sum + (m.reward_amount || 0), 0);

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
                Ready to make a positive impact today?
              </p>
            </div>
            <Button
              onClick={() => router.push("/missions/create")}
              className="flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faAward} className="h-4 w-4" />
              <span>Propose a Mission</span>
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

          {/* Blockchain Test Component */}
          <BlockchainTest />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
