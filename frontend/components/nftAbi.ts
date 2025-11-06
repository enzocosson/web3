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
    name: "Bronze Vault Certificate",
    price: "0.000222",
    color: "#CD7F32",
    template: "/nft-templates/bronze-reserve.png",
    description: "Entry-level vault access (~1€)",
    goldBacking: "0.0001g",
    feeDiscount: "0%",
    stakingBonus: "0%",
    votingPower: 1,
    benefits: "Early Supporter badge • Dashboard access • Monthly newsletter"
  },
  [Rarity.SILVER]: {
    name: "Silver Vault Certificate",
    price: "0.000444",
    color: "#C0C0C0",
    template: "/nft-templates/silver-reserve.png",
    description: "Enhanced vault member (~2€)",
    goldBacking: "0.0005g",
    feeDiscount: "5%",
    stakingBonus: "0%",
    votingPower: 5,
    benefits: "5% fee reduction • Priority access • Quarterly audit reports • Minor governance votes"
  },
  [Rarity.GOLD]: {
    name: "Gold Vault Certificate",
    price: "0.000666",
    color: "#FFD700",
    template: "/nft-templates/gold-reserve.png",
    description: "Premium vault member (~3€)",
    goldBacking: "0.001g",
    feeDiscount: "15%",
    stakingBonus: "10%",
    votingPower: 10,
    benefits: "15% fee reduction • +10% staking rewards • Gold Council access • Major governance votes • Annual audit certificate"
  },
  [Rarity.DIAMOND]: {
    name: "Diamond Vault Certificate",
    price: "0.001111",
    color: "#B9F2FF",
    template: "/nft-templates/diamond-reserve.png",
    description: "Elite vault member (~5€)",
    goldBacking: "0.002g",
    feeDiscount: "100%",
    stakingBonus: "25%",
    votingPower: 30,
    benefits: "FREE fees forever • +25% staking rewards • x3 voting power • Exclusive airdrops • Real-time audit access • Whitelist priority"
  }
};
