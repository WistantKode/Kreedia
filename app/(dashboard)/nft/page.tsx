"use client";

import NFTCard from "@/components/NFTCard";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { mockNFTs } from "@/lib/data";
import { Award, Calendar, Grid3X3, List, MapPin, Search } from "lucide-react";
import React, { useState } from "react";

const NFTPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "rarity" | "name">("date");

  const rarityOrder = {
    Legendary: 5,
    Epic: 4,
    Rare: 3,
    Uncommon: 2,
    Common: 1,
  };

  const filterAndSortNFTs = () => {
    let filtered = mockNFTs.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRarity =
        selectedRarity === "all" || nft.rarity === selectedRarity;

      return matchesSearch && matchesRarity;
    });

    // Sort
    switch (sortBy) {
      case "date":
        filtered.sort(
          (a, b) => b.dateEarned.getTime() - a.dateEarned.getTime()
        );
        break;
      case "rarity":
        filtered.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  };

  const filteredNFTs = filterAndSortNFTs();

  const rarityStats = mockNFTs.reduce((acc, nft) => {
    acc[nft.rarity] = (acc[nft.rarity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleNFTClick = (nft: any) => {
    console.log("Viewing NFT:", nft);
    // Open NFT modal or navigate to detail page
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NFT Collection</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your environmental impact certificates and achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total NFTs
                </p>
                <p className="text-xl font-bold text-foreground">
                  {mockNFTs.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Legendary
                </p>
                <p className="text-xl font-bold text-foreground">
                  {rarityStats.Legendary || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Epic</p>
                <p className="text-xl font-bold text-foreground">
                  {rarityStats.Epic || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Locations
                </p>
                <p className="text-xl font-bold text-foreground">
                  {new Set(mockNFTs.map((nft) => nft.location)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rarity Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedRarity === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedRarity("all")}
            >
              All ({mockNFTs.length})
            </Badge>
            {Object.entries(rarityStats).map(([rarity, count]) => (
              <Badge
                key={rarity}
                variant={selectedRarity === rarity ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedRarity(rarity)}
              >
                {rarity} ({count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="rarity">Sort by Rarity</option>
                <option value="name">Sort by Name</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {filteredNFTs.map((nft) =>
          viewMode === "grid" ? (
            <NFTCard
              key={nft.id}
              nft={nft}
              onClick={() => handleNFTClick(nft)}
            />
          ) : (
            <Card
              key={nft.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleNFTClick(nft)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">
                        {nft.name}
                      </h3>
                      <Badge
                        className={
                          nft.rarity === "Legendary"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : nft.rarity === "Epic"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                            : nft.rarity === "Rare"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : nft.rarity === "Uncommon"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {nft.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{nft.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{nft.dateEarned.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Empty State */}
      {filteredNFTs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No NFTs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or complete more missions to
              earn NFTs
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedRarity("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NFTPage;
