"use client";

import { faLock, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { Card, CardContent } from "./ui/Card";

interface WalletConnectPromptProps {
  className?: string;
}

const WalletConnectPrompt: React.FC<WalletConnectPromptProps> = ({
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Contenu flouté en arrière-plan */}
      <div className="blur-sm pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Cartes crypto floutées */}
          {[1, 2, 3].map((index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 animate-pulse" />
                    </div>
                    <div className="mt-2">
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20 animate-pulse" />
                    </div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12 mt-1 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Carte NFT floutée */}
          <Card className="bg-blue-700">
            <CardContent className="p-3">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-4 bg-blue-500 rounded w-24 animate-pulse" />
                  </div>
                  <div className="mt-2">
                    <div className="h-6 bg-blue-500 rounded w-8 animate-pulse" />
                  </div>
                  <div className="h-3 bg-blue-500 rounded w-32 mt-1 animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overlay avec message de connexion */}
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-lg">
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-primary-200 dark:border-primary-800 shadow-xl max-w-md mx-4">
          <CardContent className="p-8 text-center">
            {/* Icône */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faWallet}
                  className="h-12 w-12 text-primary-600 dark:text-primary-400"
                />
                <FontAwesomeIcon
                  icon={faLock}
                  className="h-6 w-6 text-orange-500 absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1"
                />
              </div>
            </div>

            {/* Titre */}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Connect Your Wallet
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              To see your earned balance and interact with the ecosystem, please
              connect your Web3 wallet.
            </p>

            {/* Bouton de connexion RainbowKit */}
            <div className="flex justify-center">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== "loading";
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === "authenticated");

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                            >
                              <FontAwesomeIcon
                                icon={faWallet}
                                className="h-5 w-5"
                              />
                              <span>Connect Wallet</span>
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              Wrong network
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={openChainModal}
                              className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors"
                              type="button"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 12,
                                    height: 12,
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    marginRight: 4,
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? "Chain icon"}
                                      src={chain.iconUrl}
                                      style={{ width: 12, height: 12 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>

                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ""}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Note de sécurité */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              🔒 Your wallet connection is secure and private
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletConnectPrompt;
