import { formatDate } from "@/lib/utils";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Badge } from "./ui/Badge";
import { Card, CardContent } from "./ui/Card";

export interface NFT {
  id: string;
  name: string;
  image: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  location: string;
  dateEarned: Date;
  description: string;
}

interface NFTCardProps {
  nft: NFT;
  onClick?: () => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, onClick }) => {
  const rarityColors = {
    Common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    Uncommon:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Rare: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Epic: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Legendary:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={nft.image}
            alt={nft.name}
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 right-2">
          <Badge className={rarityColors[nft.rarity]}>{nft.rarity}</Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-foreground">
          {nft.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {nft.description}
        </p>

        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>{nft.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(nft.dateEarned)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
