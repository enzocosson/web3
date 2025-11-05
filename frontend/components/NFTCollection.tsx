"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PinataSDK } from "pinata-web3";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
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

export default function NFTCollection() {
  const { address, isConnected } = useAccount();
  const [selectedRarity, setSelectedRarity] = useState<Rarity>(Rarity.BRONZE);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFTData[]>([]);
  const [isApproving, setIsApproving] = useState(false);

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
  const requiredAmount = parseUnits(RARITY_INFO[selectedRarity].price, 18);
  const needsApproval = currentAllowance < requiredAmount;

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
          // For now, create NFT data with tokenId
          // Metadata will be fetched from IPFS in next step
          const nftData: NFTData = {
            tokenId: tokenId.toString(),
            tokenURI: "",
            rarity: Rarity.BRONZE, // Will be read from contract
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
    }
  }, [isConfirmed, refetchNFTs, refetchAllowance]);

  const uploadToIPFS = async () => {
    if (!selectedRarity && selectedRarity !== 0) {
      setError("Please select a rarity tier");
      return null;
    }

    setUploading(true);
    setError(null);

    try {
      const rarityInfo = RARITY_INFO[selectedRarity];
      
      // Fetch the SVG template
      const svgResponse = await fetch(rarityInfo.template);
      const svgText = await svgResponse.text();
      
      // Get next token ID for serial number
      const nextTokenId = totalSupplyData ? Number(totalSupplyData) + 1 : 1;
      
      // Update SVG with serial number
      const updatedSvg = svgText.replace('#0000', `#${nextTokenId.toString().padStart(4, '0')}`);
      
      // Convert SVG to Blob
      const svgBlob = new Blob([updatedSvg], { type: 'image/svg+xml' });
      const svgFile = new File([svgBlob], `${rarityInfo.name.toLowerCase().replace(' ', '-')}.svg`, { type: 'image/svg+xml' });
      
      console.log("Uploading image to IPFS...");
      const imageUpload = await pinata.upload.file(svgFile);
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

      setIpfsUrl(metadataUrl);
      return metadataUrl;
    } catch (err) {
      console.error("IPFS upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    if (gofBalance < requiredAmount) {
      setError(`Insufficient GOF balance. You need ${RARITY_INFO[selectedRarity].price} GOF but only have ${formatUnits(gofBalance, 18)} GOF`);
      return;
    }

    setError(null);
    setIsApproving(true);

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
          setIsApproving(false);
        },
      }
    );
  };

  useEffect(() => {
    if (isConfirmed && isApproving) {
      setIsApproving(false);
    }
  }, [isConfirmed, isApproving]);

  const mintNFT = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet");
      return;
    }

    if (needsApproval) {
      setError("Please approve GOF tokens first (step 1)");
      return;
    }

    const tokenURI = ipfsUrl || (await uploadToIPFS());
    if (!tokenURI) {
      setError("Failed to upload to IPFS");
      return;
    }

    console.log("Minting NFT with URI:", tokenURI, "Rarity:", selectedRarity);

    writeContract(
      {
        address: NFT_CONTRACT_ADDRESS,
        abi: GOLDEN_RESERVES_NFT_ABI,
        functionName: "mintWithGOF",
        args: [tokenURI, selectedRarity],
      },
      {
        onSuccess: (hash) => {
          console.log("✅ NFT minted! Hash:", hash);
          setIpfsUrl(null);
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
    <div className={styles.nftCard}>
      <h3 className={styles.nftTitle}>🎨 Golden Reserves NFT</h3>
      
      <p className={styles.meta}>
        Mint exclusive reserve certificates by staking GOF tokens
      </p>

      {/* Rarity Selection */}
      <div className={styles.tierGrid}>
        {Object.entries(RARITY_INFO).map(([key, info]) => {
          const rarityKey = Number(key) as Rarity;
          const isSelected = selectedRarity === rarityKey;
          return (
            <div
              key={key}
              className={`${styles.tierCard} ${isSelected ? styles.selected : ''}`}
              onClick={() => setSelectedRarity(rarityKey)}
            >
              <div className={styles.tierHeader}>
                <div className={styles.tierName} style={{ color: info.color }}>
                  {info.name}
                </div>
                <div className={styles.tierCheckmark} style={{ color: info.color }}>
                  {isSelected && '✓'}
                </div>
              </div>
              <div className={styles.tierPrice} style={{ color: info.color }}>
                {info.price} GOF
              </div>
              <div className={styles.tierDescription}>
                {info.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance Info */}
      <div className={styles.balanceSection}>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Your GOF Balance</span>
          <span className={styles.balanceValue}>{formatUnits(gofBalance, 18)} GOF</span>
        </div>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>Required for {RARITY_INFO[selectedRarity].name}</span>
          <span className={styles.balanceValue} style={{ color: RARITY_INFO[selectedRarity].color }}>
            {RARITY_INFO[selectedRarity].price} GOF
          </span>
        </div>
        {currentAllowance > BigInt(0) && (
          <div className={styles.balanceRow}>
            <span className={styles.balanceLabel}>Current Allowance</span>
            <span className={styles.balanceValue}>{formatUnits(currentAllowance, 18)} GOF</span>
          </div>
        )}
      </div>

      {/* Preview */}
      {RARITY_INFO[selectedRarity] && (
        <div className={styles.previewSection}>
          <div className={styles.previewLabel}>Certificate Preview</div>
          <Image 
            src={RARITY_INFO[selectedRarity].template} 
            alt={RARITY_INFO[selectedRarity].name}
            width={500}
            height={700}
            className={styles.previewImage}
          />
        </div>
      )}

      {ipfsUrl && (
        <div className={`${styles.statusBadge} ${styles.success}`}>
          ✅ Certificate uploaded to IPFS successfully!
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.row}>
        {!ipfsUrl && (
          <button
            className={styles.primary}
            onClick={uploadToIPFS}
            disabled={uploading || !isConnected}
          >
            {uploading ? "⏳ Uploading..." : "📤 Upload Certificate"}
          </button>
        )}

        {needsApproval && ipfsUrl ? (
          <button
            className={styles.primary}
            onClick={handleApprove}
            disabled={!isConnected || isPending || isConfirming || isApproving}
          >
            {isPending || isConfirming ? "⏳ Approving..." : "1️⃣ Approve GOF Tokens"}
          </button>
        ) : null}

        <button
          className={styles.primary}
          onClick={mintNFT}
          disabled={!isConnected || !ipfsUrl || needsApproval || isPending || isConfirming}
        >
          {isPending || isConfirming 
            ? "⏳ Minting..." 
            : needsApproval && ipfsUrl 
            ? "2️⃣ Mint NFT (Approve First)" 
            : "🎨 Mint Reserve Certificate"}
        </button>
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

      <div className={styles.instructions}>
        <strong>How to Mint Your Reserve Certificate:</strong>
        <ol>
          <li>Select your desired reserve tier (Bronze, Silver, Gold, or Diamond)</li>
          <li>Upload the certificate design to IPFS (decentralized storage)</li>
          <li>Approve the NFT contract to spend your GOF tokens</li>
          <li>Mint your exclusive Reserve Certificate NFT</li>
        </ol>
      </div>
    </div>
  );
}
