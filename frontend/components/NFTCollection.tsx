"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PinataSDK } from "pinata-web3";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseUnits, formatUnits } from "ethers";
import { GOLDEN_RESERVES_NFT_ABI, Rarity, RARITY_INFO } from "./nftAbi";
import { ABI as GOF_ABI } from "./abi";
import styles from "./ContractActions.module.scss";

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
      <div className={styles.card}>
        <h3 className={styles.title}>🎨 Golden Reserves NFT Collection</h3>
        <div className={styles.note} style={{ background: "#fff3cd", borderColor: "#ffc107", color: "#856404" }}>
          ⚠️ NFT Contract not configured. Please deploy the GoldenReservesNFT contract and update NEXT_PUBLIC_NFT_CONTRACT_ADDRESS in your .env.local file.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>🎨 Golden Reserves NFT Collection</h3>
      
      <p className={styles.meta} style={{ marginBottom: "16px" }}>
        Mint exclusive reserve certificates by paying with GOF tokens
      </p>

      {/* Rarity Selection */}
      <div className={styles.field}>
        <label className={styles.meta}>Select Reserve Tier</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "8px" }}>
          {Object.entries(RARITY_INFO).map(([key, info]) => {
            const rarityKey = Number(key) as Rarity;
            return (
              <div
                key={key}
                onClick={() => setSelectedRarity(rarityKey)}
                style={{
                  padding: "12px",
                  border: `2px solid ${selectedRarity === rarityKey ? info.color : "#ddd"}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: selectedRarity === rarityKey ? `${info.color}15` : "#fff",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontWeight: "bold", color: info.color, marginBottom: "4px" }}>
                  {info.name}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  {info.price} GOF
                </div>
                <div style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}>
                  {info.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Balance Info */}
      <div className={styles.field}>
        <div className={styles.meta}>
          Your GOF Balance: <strong>{formatUnits(gofBalance, 18)} GOF</strong>
        </div>
        <div className={styles.meta}>
          Required: <strong style={{ color: RARITY_INFO[selectedRarity].color }}>
            {RARITY_INFO[selectedRarity].price} GOF
          </strong>
        </div>
        {currentAllowance > BigInt(0) && (
          <div className={styles.meta}>
            Current Allowance: {formatUnits(currentAllowance, 18)} GOF
          </div>
        )}
      </div>

      {/* Preview */}
      {RARITY_INFO[selectedRarity] && (
        <div style={{ marginBottom: "16px", textAlign: "center" }}>
          <div className={styles.meta} style={{ marginBottom: "8px" }}>Preview</div>
          <Image 
            src={RARITY_INFO[selectedRarity].template} 
            alt={RARITY_INFO[selectedRarity].name}
            width={500}
            height={700}
            style={{ 
              maxWidth: "100%", 
              height: "auto", 
              maxHeight: "300px",
              border: `2px solid ${RARITY_INFO[selectedRarity].color}`,
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {ipfsUrl && (
        <div className={styles.note}>
          ✅ Uploaded to IPFS
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.row}>
        {!ipfsUrl && (
          <button
            className={styles.primary}
            onClick={uploadToIPFS}
            disabled={uploading || !isConnected}
            style={{
              opacity: uploading || !isConnected ? 0.5 : 1,
            }}
          >
            {uploading ? "⏳ Uploading to IPFS..." : "📤 Upload to IPFS"}
          </button>
        )}

        {needsApproval && ipfsUrl ? (
          <button
            className={styles.primary}
            onClick={handleApprove}
            disabled={!isConnected || isPending || isConfirming || isApproving}
            style={{
              opacity: !isConnected || isPending || isConfirming || isApproving ? 0.5 : 1,
            }}
          >
            {isPending || isConfirming ? "⏳ Approving..." : "1️⃣ Approve GOF"}
          </button>
        ) : null}

        <button
          className={styles.primary}
          onClick={mintNFT}
          disabled={!isConnected || !ipfsUrl || needsApproval || isPending || isConfirming}
          style={{
            opacity: !isConnected || !ipfsUrl || needsApproval || isPending || isConfirming ? 0.5 : 1,
            backgroundColor: needsApproval && ipfsUrl ? "#666" : undefined,
          }}
        >
          {isPending || isConfirming ? "⏳ Minting..." : needsApproval && ipfsUrl ? "2️⃣ Mint NFT (Approve first)" : "🎨 Mint NFT"}
        </button>
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}

      {txHash && (
        <div className={styles.note}>
          {isConfirming && <span>⏳ Confirming...</span>}
          {isConfirmed && <span style={{ color: "#00cc00" }}>✅ NFT Minted!</span>}
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3" }}
          >
            View on Etherscan
          </a>
        </div>
      )}

      {/* Owned NFTs */}
      {ownedNFTs.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h4 className={styles.title} style={{ fontSize: "18px", marginBottom: "12px" }}>
            Your Collection ({ownedNFTs.length})
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
            {ownedNFTs.map((nft) => (
              <div
                key={nft.tokenId}
                style={{
                  padding: "12px",
                  border: "2px solid #ddd",
                  borderRadius: "12px",
                  textAlign: "center",
                  background: "#fff",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
                  NFT #{nft.tokenId}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                  {RARITY_INFO[nft.rarity]?.name || "Unknown Rarity"}
                </div>
                <div style={{ marginTop: "12px" }}>
                  <a
                    href={`https://sepolia.etherscan.io/nft/${NFT_CONTRACT_ADDRESS}/${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "12px",
                      color: "#0070f3",
                      textDecoration: "underline",
                    }}
                  >
                    View on Etherscan
                  </a>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <a
                    href={`https://testnets.opensea.io/assets/sepolia/${NFT_CONTRACT_ADDRESS}/${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "12px",
                      color: "#2081e2",
                      textDecoration: "underline",
                    }}
                  >
                    View on OpenSea
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.note}>
        <strong>How it works:</strong>
        <br />
        1. Select your desired reserve tier (Bronze, Silver, Gold, or Diamond)
        <br />
        2. Upload the certificate design to IPFS
        <br />
        3. Approve the NFT contract to spend your GOF tokens
        <br />
        4. Mint your NFT certificate by paying with GOF
      </div>
    </div>
  );
}
