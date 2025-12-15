"use client";

import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  useBlockchainData,
  useDynamicWorkerEarnings,
} from "@/hooks/useBlockchainData";
import { useBlockchainMissions } from "@/hooks/useBlockchainMissions";
import { useWallet } from "@/hooks/useWallet";
import { BLOCKCHAIN_CONFIG } from "@/lib/api/config";
import { contractService } from "@/lib/blockchain/services/contract";
import React, { useState } from "react";

const BlockchainTest: React.FC = () => {
  const { address, isConnected } = useWallet();
  const { workerEarnings, nftData, loading, error, refreshData } =
    useBlockchainData();
  const {
    tokens,
    loading: dynamicLoading,
    error: dynamicError,
  } = useDynamicWorkerEarnings();
  const { loadMissionDetails, checkUserMissionNFT, getMissionProgress } =
    useBlockchainMissions();

  const [testMissionId, setTestMissionId] = useState("");
  const [missionDetails, setMissionDetails] = useState<any>(null);
  const [hasNFT, setHasNFT] = useState<boolean>(false);
  const [progress, setProgress] = useState<any>(null);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [loadingTest, setLoadingTest] = useState(false);

  const handleTestMission = async () => {
    if (!testMissionId) return;

    setLoadingTest(true);
    try {
      const details = await loadMissionDetails(testMissionId);
      const nftStatus = await checkUserMissionNFT(testMissionId);
      const missionProgress = await getMissionProgress(testMissionId);

      setMissionDetails(details);
      setHasNFT(nftStatus);
      setProgress(missionProgress);
    } catch (err) {
      console.error("Error testing mission:", err);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleGetTotalSupply = async () => {
    setLoadingTest(true);
    try {
      const supply = await contractService.getTotalSupply();
      setTotalSupply(supply);
    } catch (err) {
      console.error("Error getting total supply:", err);
    } finally {
      setLoadingTest(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Connect your wallet to test blockchain functionality
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Test</CardTitle>
          <p className="text-sm text-gray-500">Wallet: {address}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration */}
          <div>
            <h3 className="font-semibold mb-2">Configuration</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>Contract:</strong>{" "}
                {BLOCKCHAIN_CONFIG.KREEDIA_CONTRACT_ADDRESS || "Not configured"}
              </p>
              <p>
                <strong>RPC:</strong> {BLOCKCHAIN_CONFIG.RPC_URL}
              </p>
              <p>
                <strong>Chain ID:</strong> {BLOCKCHAIN_CONFIG.CHAIN_ID}
              </p>
            </div>
          </div>

          {/* Worker Earnings (Compatible) */}
          <div>
            <h3 className="font-semibold mb-2">Worker Earnings (Compatible)</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {workerEarnings.USDC}
                  </p>
                  <p className="text-sm text-gray-500">USDC</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {workerEarnings.USDT}
                  </p>
                  <p className="text-sm text-gray-500">USDT</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {workerEarnings.DAI}
                  </p>
                  <p className="text-sm text-gray-500">DAI</p>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Worker Earnings */}
          <div>
            <h3 className="font-semibold mb-2">
              Dynamic Worker Earnings (from acceptedTokens)
            </h3>
            {dynamicLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : dynamicError ? (
              <p className="text-red-500">Error: {dynamicError}</p>
            ) : tokens.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tokens.map((token, index) => (
                    <div
                      key={token.address}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {token.earnings}
                        </p>
                        <p className="text-sm text-gray-500">{token.symbol}</p>
                        <p className="text-xs text-gray-400">
                          {token.address.slice(0, 6)}...
                          {token.address.slice(-4)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {token.decimals} decimals
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Total Tokens:</strong> {tokens.length}
                  </p>
                  <p>
                    <strong>Total Earnings:</strong>{" "}
                    {Object.keys(tokens).length} different tokens
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No accepted tokens found</p>
            )}
          </div>

          {/* NFT Data */}
          <div>
            <h3 className="font-semibold mb-2">NFT Data</h3>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {nftData.totalNFTs}
                </p>
                <p className="text-sm text-gray-500">Total NFTs</p>
              </div>
              <Button onClick={handleGetTotalSupply} disabled={loadingTest}>
                {loadingTest ? "Loading..." : "Get Total Supply"}
              </Button>
              {totalSupply > 0 && (
                <Badge variant="secondary">Supply: {totalSupply}</Badge>
              )}
            </div>
          </div>

          {/* Mission Test */}
          <div>
            <h3 className="font-semibold mb-2">Mission Test</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={testMissionId}
                onChange={(e) => setTestMissionId(e.target.value)}
                placeholder="Enter mission ID"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              />
              <Button
                onClick={handleTestMission}
                disabled={loadingTest || !testMissionId}
              >
                {loadingTest ? "Testing..." : "Test Mission"}
              </Button>
            </div>

            {missionDetails && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Mission Details</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Token:</strong> {missionDetails.token}
                  </p>
                  <p>
                    <strong>Amount:</strong> {missionDetails.amount}
                  </p>
                  <p>
                    <strong>NGO:</strong> {missionDetails.ngo}
                  </p>
                  <p>
                    <strong>Worker:</strong> {missionDetails.worker}
                  </p>
                  <p>
                    <strong>Locked:</strong>{" "}
                    {missionDetails.locked ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Completed:</strong>{" "}
                    {missionDetails.completed ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Before NFT:</strong> {missionDetails.beforeNFTId}
                  </p>
                  <p>
                    <strong>After NFT:</strong> {missionDetails.afterNFTId}
                  </p>
                </div>
              </div>
            )}

            {progress && (
              <div className="bg-blue-50 p-4 rounded-md mt-2">
                <h4 className="font-medium mb-2">Mission Progress</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Exists:</strong> {progress.exists ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Locked:</strong> {progress.locked ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Completed:</strong>{" "}
                    {progress.completed ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Before NFT ID:</strong> {progress.beforeNFTId}
                  </p>
                  <p>
                    <strong>After NFT ID:</strong> {progress.afterNFTId}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-2">
              <Badge variant={hasNFT ? "default" : "secondary"}>
                Has NFT: {hasNFT ? "Yes" : "No"}
              </Badge>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="pt-4 border-t">
            <Button onClick={refreshData} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainTest;
