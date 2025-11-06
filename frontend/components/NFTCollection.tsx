"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PinataSDK } from "pinata-web3";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { parseUnits, formatUnits } from "ethers";
import { GOLDEN_RESERVES_NFT_ABI, Rarity, RARITY_INFO } from "./nftAbi";
import { ABI as GOF_ABI } from "./abi";
import styles from "./NFTCollection.module.scss";

const NFT_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
const GOF_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x857bd5b87658dc4976a4f515fb78d06192f5e9b5") as `0x${string}`;

interface NFTData {
  tokenId: string;
  tokenURI: string;
  rarity: Rarity;
  metadata?: {
    name: string;
    description: string;
    image: string;
  };
}

interface RarityCardProps {
  rarity: Rarity;
  rarityInfo: typeof RARITY_INFO[Rarity];
  gofBalance: bigint;
  currentAllowance: bigint;
  isConnected: boolean;
  onMint: (rarity: Rarity) => void;
  onApprove: (rarity: Rarity) => void;
  onUpload: (rarity: Rarity) => void;
  isPending: boolean;
  isConfirming: boolean;
  uploadingRarity: Rarity | null;
  approvingRarity: Rarity | null;
  ipfsUrl: string | null;
}

function RarityCard({
  rarity,
  rarityInfo,
  gofBalance,
  currentAllowance,
  onMint,
  onApprove,
  onUpload,
  isPending,
  isConfirming,
  uploadingRarity,
  approvingRarity,
  ipfsUrl,
}: RarityCardProps) {
  const requiredAmount = parseUnits(rarityInfo.price, 18);
  const needsApproval = currentAllowance < requiredAmount;
  const hasEnoughBalance = gofBalance >= requiredAmount;
  const isUploading = uploadingRarity === rarity;
  const isApproving = approvingRarity === rarity;

  return (
    <div className={styles.rarityCard} style={{ borderColor: rarityInfo.color }}>
      <div className={styles.rarityHeader}>
        <h3 className={styles.rarityName} style={{ backgroundColor: rarityInfo.color }}>
          {rarityInfo.name} Certificate
        </h3>
      </div>

      <div className={styles.rarityImage}>
        <Image
          src={rarityInfo.template}
          alt={rarityInfo.name}
          width={600}
          height={840}
          quality={100}
          priority
          className={styles.certificatePreview}
        />
      </div>

      <div className={styles.rarityBenefits}>
        <h4 className={styles.rarityTitle}>
          {rarityInfo.name} Vault<br />Certificate Reserve
        </h4>
        <p className={styles.raritySubtitle}>
          {rarityInfo.description}
        </p>
        
        <div className={styles.stakeInfo}>
          <span className={styles.stakeLabel}>Stake Required</span>
          <span className={styles.stakeAmount}>{rarityInfo.price} GOF</span>
        </div>

        <div className={styles.benefitsTitle}>Benefits:</div>
        <div className={styles.benefitItem}>
          <span className={styles.benefitLabel}>{rarityInfo.goldBacking} Gold Backing</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.benefitLabel}>{rarityInfo.feeDiscount} Fee Discount</span>
        </div>
        <div className={styles.benefitItem}>
          <span className={styles.benefitLabel}>{rarityInfo.stakingBonus} Staking Bonus</span>
        </div>
      </div>

      <div className={styles.rarityActions}>
        {!hasEnoughBalance ? (
          <div className={styles.insufficientBalance}>
            ⚠️ Insufficient GOF Balance
            <div className={styles.balanceInfo}>
              You have: {formatUnits(gofBalance, 18)} GOF
            </div>
          </div>
        ) : (
          <>
            {!ipfsUrl && (
              <button
                className={styles.actionButton}
                onClick={() => onUpload(rarity)}
                disabled={isUploading}
              >
                {isUploading ? "⏳ Uploading..." : `Mint ${rarityInfo.name} Vault Certificate`}
              </button>
            )}

            {ipfsUrl && needsApproval && (
              <button
                className={styles.actionButton}
                onClick={() => onApprove(rarity)}
                disabled={isPending || isConfirming || isApproving}
              >
                {isPending || isConfirming || isApproving ? "⏳ Approving..." : "1️⃣ Approve GOF"}
              </button>
            )}

            {ipfsUrl && !needsApproval && (
              <button
                className={styles.actionButton}
                onClick={() => onMint(rarity)}
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? "⏳ Minting..." : `Mint ${rarityInfo.name} Vault Certificate`}
              </button>
            )}
          </>
        )}
      </div>

      {ipfsUrl && (
        <div className={styles.uploadSuccess}>
          ✅ Certificate ready to mint!
        </div>
      )}
    </div>
  );
}

export default function NFTCollection() {
  const { address, isConnected } = useAccount();
  const [uploadingRarity, setUploadingRarity] = useState<Rarity | null>(null);
  const [approvingRarity, setApprovingRarity] = useState<Rarity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ipfsUrls, setIpfsUrls] = useState<Record<number, string>>({});
  const [ownedNFTs, setOwnedNFTs] = useState<NFTData[]>([]);

  const { data: txHash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read GOF balance
  const { data: gofBalanceData } = useReadContract({
    address: GOF_CONTRACT_ADDRESS,
    abi: GOF_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read GOF allowance for NFT contract
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: GOF_CONTRACT_ADDRESS,
    abi: GOF_ABI,
    functionName: "allowance",
    args: address ? [address, NFT_CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read total supply
  const { data: totalSupplyData } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: GOLDEN_RESERVES_NFT_ABI,
    functionName: "totalSupply",
    query: {
      enabled: NFT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  // Read user's NFT token IDs
  const { data: userTokenIds, refetch: refetchNFTs } = useReadContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: GOLDEN_RESERVES_NFT_ABI,
    functionName: "tokensOfOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && NFT_CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  const gofBalance = gofBalanceData ? BigInt(gofBalanceData.toString()) : BigInt(0);
  const currentAllowance = allowanceData ? BigInt(allowanceData.toString()) : BigInt(0);

  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
  });

  // Fetch NFT metadata when user tokens change
  useEffect(() => {
    if (!userTokenIds || userTokenIds.length === 0) {
      setOwnedNFTs([]);
      return;
    }

    const fetchNFTMetadata = async () => {
      const nfts: NFTData[] = [];
      
      for (const tokenId of userTokenIds as bigint[]) {
        try {
          const nftData: NFTData = {
            tokenId: tokenId.toString(),
            tokenURI: "",
            rarity: Rarity.BRONZE,
          };
          
          nfts.push(nftData);
        } catch (err) {
          console.error(`Error fetching NFT ${tokenId}:`, err);
        }
      }
      
      setOwnedNFTs(nfts);
    };

    fetchNFTMetadata();
  }, [userTokenIds]);

  // Refresh NFTs when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      refetchNFTs();
      refetchAllowance();
      setApprovingRarity(null);
    }
  }, [isConfirmed, refetchNFTs, refetchAllowance]);

  const uploadToIPFS = async (rarity: Rarity) => {
    setUploadingRarity(rarity);
    setError(null);

    try {
      const rarityInfo = RARITY_INFO[rarity];
      
      // Fetch the PNG template
      const imageResponse = await fetch(rarityInfo.template);
      const imageBlob = await imageResponse.blob();
      
      // Get next token ID for serial number
      const nextTokenId = totalSupplyData ? Number(totalSupplyData) + 1 : 1;
      
      // Create file from blob
      const imageFile = new File([imageBlob], `${rarityInfo.name.toLowerCase().replace(/ /g, '-')}.png`, { type: 'image/png' });
      
      console.log("Uploading image to IPFS...");
      const imageUpload = await pinata.upload.file(imageFile);
      const imageUrl = `ipfs://${imageUpload.IpfsHash}`;
      console.log("Image uploaded:", imageUrl);

      // Create NFT metadata
      const metadata = {
        name: `${rarityInfo.name} #${nextTokenId}`,
        description: `${rarityInfo.description} - Stake: ${rarityInfo.price} GOF`,
        image: imageUrl,
        attributes: [
          {
            trait_type: "Rarity",
            value: rarityInfo.name,
          },
          {
            trait_type: "Stake Value",
            value: `${rarityInfo.price} GOF`,
          },
          {
            trait_type: "Owner",
            value: address,
          },
          {
            trait_type: "Certificate Number",
            value: nextTokenId.toString(),
          },
          {
            trait_type: "Minted",
            value: new Date().toISOString().split('T')[0],
          },
        ],
      };

      console.log("Uploading metadata to IPFS...");
      const metadataUpload = await pinata.upload.json(metadata);
      const metadataUrl = `ipfs://${metadataUpload.IpfsHash}`;
      console.log("Metadata uploaded:", metadataUrl);

      setIpfsUrls(prev => ({ ...prev, [rarity]: metadataUrl }));
      return metadataUrl;
    } catch (err) {
      console.error("IPFS upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      return null;
    } finally {
      setUploadingRarity(null);
    }
  };

  const handleApprove = async (rarity: Rarity) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    const requiredAmount = parseUnits(RARITY_INFO[rarity].price, 18);

    if (gofBalance < requiredAmount) {
      setError(`Insufficient GOF balance. You need ${RARITY_INFO[rarity].price} GOF but only have ${formatUnits(gofBalance, 18)} GOF`);
      return;
    }

    setError(null);
    setApprovingRarity(rarity);

    writeContract(
      {
        address: GOF_CONTRACT_ADDRESS,
        abi: GOF_ABI,
        functionName: "approve",
        args: [NFT_CONTRACT_ADDRESS, requiredAmount],
      },
      {
        onSuccess: (hash) => {
          console.log("✅ GOF Approval successful! Hash:", hash);
        },
        onError: (error) => {
          console.error("❌ Approval error:", error);
          setError(error.message);
          setApprovingRarity(null);
        },
      }
    );
  };

  const mintNFT = async (rarity: Rarity) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    const tokenURI = ipfsUrls[rarity] || (await uploadToIPFS(rarity));
    if (!tokenURI) {
      setError("Failed to upload to IPFS");
      return;
    }

    console.log("Minting NFT with URI:", tokenURI, "Rarity:", rarity);

    writeContract(
      {
        address: NFT_CONTRACT_ADDRESS,
        abi: GOLDEN_RESERVES_NFT_ABI,
        functionName: "mintWithGOF",
        args: [tokenURI, rarity],
      },
      {
        onSuccess: (hash) => {
          console.log("✅ NFT minted! Hash:", hash);
          setIpfsUrls(prev => {
            const newUrls = { ...prev };
            delete newUrls[rarity];
            return newUrls;
          });
        },
        onError: (error) => {
          console.error("❌ Mint error:", error);
          setError(error.message);
        },
      }
    );
  };

  if (NFT_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return (
      <div className={styles.nftCard}>
        <h3 className={styles.nftTitle}>🎨 Golden Reserves NFT Collection</h3>
        <div className={`${styles.statusBadge} ${styles.warning}`}>
          ⚠️ NFT Contract not configured
        </div>
        <div className={styles.instructions}>
          <strong>Setup Required:</strong>
          <ol>
            <li>Deploy the GoldenReservesNFT contract</li>
            <li>Update NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in your .env.local file</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.nftCard} ${!isConnected ? styles.locked : ''}`}>
      {!isConnected && (
        <div className={styles.lockOverlay}>
          <div className={styles.lockContent}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h4>Wallet Connection Required</h4>
            <p>Please connect your wallet to access the Golden Reserves NFT Collection</p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button className={styles.connectButton} onClick={openConnectModal}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                  </svg>
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      )}

      {/* Balance Info */}
      <div className={styles.balanceSection}>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>💰 Your GOF Balance</span>
          <span className={styles.balanceValue}>{formatUnits(gofBalance, 18)} GOF</span>
        </div>
      </div>

      {/* Rarity Grid */}
      <div className={styles.raritiesGrid}>
        {Object.entries(RARITY_INFO).map(([key, info]) => {
          const rarityKey = Number(key) as Rarity;
          return (
            <RarityCard
              key={key}
              rarity={rarityKey}
              rarityInfo={info}
              gofBalance={gofBalance}
              currentAllowance={currentAllowance}
              isConnected={isConnected}
              onMint={mintNFT}
              onApprove={handleApprove}
              onUpload={uploadToIPFS}
              isPending={isPending}
              isConfirming={isConfirming}
              uploadingRarity={uploadingRarity}
              approvingRarity={approvingRarity}
              ipfsUrl={ipfsUrls[rarityKey] || null}
            />
          );
        })}
      </div>

      {error && <div className={styles.error}>⚠️ {error}</div>}

      {txHash && (
        <div className={styles.note}>
          {isConfirming && <span>⏳ Transaction processing...</span>}
          {isConfirmed && <span style={{ color: "#28a745", fontWeight: "bold" }}>✅ NFT Certificate Minted Successfully!</span>}
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View Transaction on Etherscan →
          </a>
        </div>
      )}

      {/* Owned NFTs */}
      {ownedNFTs.length > 0 && (
        <div className={styles.nftCollection}>
          <div className={styles.collectionTitle}>
            Your Collection
            <span className={styles.collectionCount}>{ownedNFTs.length}</span>
          </div>
          <div className={styles.nftGrid}>
            {ownedNFTs.map((nft) => (
              <div key={nft.tokenId} className={styles.nftItem}>
                <div className={styles.nftId}>Certificate #{nft.tokenId}</div>
                
                {/* Image du certificat */}
                <div className={styles.nftImageContainer}>
                  <Image
                    src={RARITY_INFO[nft.rarity]?.template || "/nft-templates/bronze-reserve.png"}
                    alt={`${RARITY_INFO[nft.rarity]?.name} Certificate`}
                    width={300}
                    height={420}
                    quality={100}
                    className={styles.nftImage}
                  />
                </div>
                
                <div className={styles.nftRarity} style={{ 
                  background: `${RARITY_INFO[nft.rarity]?.color}15`,
                  color: RARITY_INFO[nft.rarity]?.color 
                }}>
                  {RARITY_INFO[nft.rarity]?.name || "Unknown"}
                </div>
                <div className={styles.nftLinks}>
                  <a
                    href={`https://sepolia.etherscan.io/nft/${NFT_CONTRACT_ADDRESS}/${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Etherscan →
                  </a>
                  <a
                    href={`https://testnets.opensea.io/assets/sepolia/${NFT_CONTRACT_ADDRESS}/${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on OpenSea →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

