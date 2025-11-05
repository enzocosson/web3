export const GOLDEN_RESERVES_NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_gofToken", type: "address" },
      { internalType: "address", name: "_treasury", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "minter", type: "address" },
      { indexed: true, internalType: "uint256", name: "tokenId", type: "uint256" },
      { indexed: false, internalType: "enum GoldenReservesNFT.Rarity", name: "rarity", type: "uint8" },
      { indexed: false, internalType: "string", name: "tokenURI", type: "string" },
      { indexed: false, internalType: "uint256", name: "pricePaid", type: "uint256" }
    ],
    name: "NFTMinted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "oldTreasury", type: "address" },
      { indexed: true, internalType: "address", name: "newTreasury", type: "address" }
    ],
    name: "TreasuryUpdated",
    type: "event"
  },
  {
    inputs: [],
    name: "BRONZE_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "DIAMOND_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "GOLD_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "SILVER_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" },
      { internalType: "enum GoldenReservesNFT.Rarity", name: "rarity", type: "uint8" }
    ],
    name: "freeMint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "enum GoldenReservesNFT.Rarity", name: "rarity", type: "uint8" }],
    name: "getPriceForRarity",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [],
    name: "gofToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "tokenURI", type: "string" },
      { internalType: "enum GoldenReservesNFT.Rarity", name: "rarity", type: "uint8" }
    ],
    name: "mintWithGOF",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "nftMetadata",
    outputs: [
      { internalType: "enum GoldenReservesNFT.Rarity", name: "rarity", type: "uint8" },
      { internalType: "uint256", name: "mintedAt", type: "uint256" },
      { internalType: "uint256", name: "pricePaid", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "newTreasury", type: "address" }],
    name: "setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "tokensOfOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

export enum Rarity {
  BRONZE = 0,
  SILVER = 1,
  GOLD = 2,
  DIAMOND = 3
}

export const RARITY_INFO = {
  [Rarity.BRONZE]: {
    name: "Bronze Reserve",
    price: "0.000222",
    color: "#CD7F32",
    template: "/nft-templates/bronze-reserve.svg",
    description: "Entry-level certificate (~1€)"
  },
  [Rarity.SILVER]: {
    name: "Silver Reserve",
    price: "0.000444",
    color: "#C0C0C0",
    template: "/nft-templates/silver-reserve.svg",
    description: "Mid-tier certificate (~2€)"
  },
  [Rarity.GOLD]: {
    name: "Gold Reserve",
    price: "0.000666",
    color: "#FFD700",
    template: "/nft-templates/gold-reserve.svg",
    description: "High-tier certificate (~3€)"
  },
  [Rarity.DIAMOND]: {
    name: "Diamond Reserve",
    price: "0.001111",
    color: "#B9F2FF",
    template: "/nft-templates/diamond-reserve.svg",
    description: "Elite certificate (~5€)"
  }
};
