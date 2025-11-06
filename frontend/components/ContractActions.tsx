"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ABI } from "./abi";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { BrowserProvider, formatUnits, parseUnits } from "ethers";
import type { Eip1193Provider } from "ethers";
import { sepolia } from "wagmi/chains";
import styles from "./ContractActions.module.scss";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x857bd5b87658dc4976a4f515fb78d06192f5e9b5") as `0x${string}`;

const COLLATERAL_TOKEN_ADDRESS = (process.env
  .NEXT_PUBLIC_COLLAT_TOKEN_ADDRESS ||
  "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238") as `0x${string}`;

const EMPTY_CODE_VALUES = new Set(["0x", "0x0", ""]);

function getInjectedProvider(): Eip1193Provider | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { ethereum?: Eip1193Provider }).ethereum;
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function toBigInt(value: unknown): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number") return BigInt(Math.trunc(value));
  if (typeof value === "string" && value) return BigInt(value);
  if (
    value &&
    typeof (value as { toString: () => string }).toString === "function"
  ) {
    const str = (value as { toString: () => string }).toString();
    if (str) return BigInt(str);
  }
  return BigInt(0);
}

export default function ContractActions() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const {
    data: txHash,
    writeContract,
    isPending: isWritePending,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
    });

  // Log transaction hash when it changes
  useEffect(() => {
    if (txHash) {
      console.log("Transaction sent! Hash:", txHash);
      console.log(
        "View on Etherscan:",
        `https://sepolia.etherscan.io/tx/${txHash}`
      );
    }
  }, [txHash]);

  // Log confirmation status
  useEffect(() => {
    if (isConfirming) {
      console.log("Waiting for transaction confirmation...");
    }
  }, [isConfirming]);

  useEffect(() => {
    if (isConfirmed) {
      console.log("Transaction confirmed!");
    }
  }, [isConfirmed]);

  const [inputAmount, setInputAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [hasContract, setHasContract] = useState<boolean | null>(null);
  const [walletNetwork, setWalletNetwork] = useState<{
    chainId: number;
    name?: string;
  } | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Read decimals using useReadContract
  const { data: contractDecimals } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "decimals",
    query: {
      enabled: hasContract === true,
    },
  });

  // Read balance using useReadContract
  const { data: contractBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: hasContract === true && !!address,
    },
  });

  // Read collateral token address
  const { data: collateralAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "collateral",
    query: {
      enabled: hasContract === true,
    },
  });

  // Read collateral token balance
  const { data: collateralBalanceData, refetch: refetchCollateralBalance } =
    useReadContract({
      address: COLLATERAL_TOKEN_ADDRESS,
      abi: [
        {
          name: "balanceOf",
          type: "function",
          stateMutability: "view",
          inputs: [{ name: "account", type: "address" }],
          outputs: [{ name: "", type: "uint256" }],
        },
      ] as const,
      functionName: "balanceOf",
      args: address ? [address as `0x${string}`] : undefined,
      query: {
        enabled: !!address,
      },
    });

  const collateralBalance = useMemo(() => {
    if (collateralBalanceData !== undefined) {
      return toBigInt(collateralBalanceData);
    }
    return BigInt(0);
  }, [collateralBalanceData]);

  const decimals = useMemo(() => {
    if (contractDecimals !== undefined) {
      return Number(contractDecimals);
    }
    return 18;
  }, [contractDecimals]);

  const balance = useMemo(() => {
    if (contractBalance !== undefined) {
      return toBigInt(contractBalance);
    }
    return null;
  }, [contractBalance]);

  // Refresh balance when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && address) {
      refetchBalance();
      refetchCollateralBalance();
    }
  }, [isConfirmed, address, refetchBalance, refetchCollateralBalance]);

  // check if contract is deployed at address on the configured chain
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ethereum = getInjectedProvider();
        if (ethereum) {
          try {
            const provider = new BrowserProvider(ethereum);
            const code = await provider.getCode(CONTRACT_ADDRESS);
            const empty = EMPTY_CODE_VALUES.has(code);
            if (!cancelled) setHasContract(!empty);
            if (empty) {
              console.warn(
                "No contract bytecode found at",
                CONTRACT_ADDRESS,
                "on wallet network"
              );
            }
            return;
          } catch (walletErr) {
            console.warn(
              "getCode via wallet provider failed, fallback to publicClient",
              walletErr
            );
          }
        }
        if (!publicClient) return;
        const code = await publicClient.getBytecode({
          address: CONTRACT_ADDRESS,
        });
        const bytecode = code ?? "";
        const empty = EMPTY_CODE_VALUES.has(bytecode);
        if (!cancelled) setHasContract(!empty);
        if (empty) {
          console.warn(
            "No contract bytecode found at",
            CONTRACT_ADDRESS,
            "on the configured RPC/chain"
          );
        }
      } catch (err) {
        console.error("failed to fetch contract code", err);
        if (!cancelled) setHasContract(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publicClient]);

  // detect wallet's network (for debugging / UI hints)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ethereum = getInjectedProvider();
        if (ethereum) {
          const provider = new BrowserProvider(ethereum);
          const net = await provider.getNetwork();
          if (!cancelled) {
            setWalletNetwork({ chainId: Number(net.chainId), name: net.name });
          }
        } else if (!cancelled) {
          setWalletNetwork(null);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const balanceFormatted = useMemo(() => {
    try {
      if (balance == null) return "0";
      return formatUnits(balance, decimals);
    } catch {
      return "0";
    }
  }, [balance, decimals]);

  const parsedAmount = useMemo(() => {
    try {
      if (!inputAmount) return undefined;
      return parseUnits(inputAmount, decimals);
    } catch {
      return undefined;
    }
  }, [inputAmount, decimals]);

  // Read required collateral for minting (includes fees)
  const { data: requiredCollateralData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "requiredCollateralForMint",
    args: parsedAmount ? [parsedAmount] : undefined,
    query: {
      enabled: hasContract === true && !!parsedAmount,
    },
  });

  // Calculate total collateral needed (including fees)
  const requiredCollateral = useMemo(() => {
    if (!requiredCollateralData) return null;
    const baseCollateral = toBigInt(requiredCollateralData);
    // Add 0.5% mint fee (50 bps / 10000)
    const fee = (baseCollateral * BigInt(50)) / BigInt(10000);
    return baseCollateral + fee;
  }, [requiredCollateralData]);

  // Read collateral allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: COLLATERAL_TOKEN_ADDRESS,
    abi: [
      {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
      },
    ] as const,
    functionName: "allowance",
    args: address ? [address as `0x${string}`, CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const currentAllowance = useMemo(() => {
    if (allowanceData !== undefined) {
      return toBigInt(allowanceData);
    }
    return BigInt(0);
  }, [allowanceData]);

  const needsApproval = useMemo(() => {
    if (!requiredCollateral) return false;
    return currentAllowance < requiredCollateral;
  }, [currentAllowance, requiredCollateral]);

  async function handleApprove() {
    if (!requiredCollateral) {
      console.error("Missing data:", { requiredCollateral });
      return;
    }

    setError(null);
    setIsApproving(true);

    console.log("=== APPROVE DEBUG ===");
    console.log(
      "Collateral balance:",
      formatUnits(collateralBalance, 6),
      "USDC"
    );
    console.log(
      "Required collateral:",
      formatUnits(requiredCollateral, 6),
      "USDC"
    );
    console.log("Collateral address:", COLLATERAL_TOKEN_ADDRESS);
    console.log("Contract address:", CONTRACT_ADDRESS);
    console.log("User address:", address);
    console.log("Wallet network:", walletNetwork);

    // Vérifier que l'utilisateur a assez de collateral
    if (collateralBalance < requiredCollateral) {
      setError(
        `Insufficient collateral balance. You need ${formatUnits(
          requiredCollateral,
          6
        )} USDC but only have ${formatUnits(
          collateralBalance,
          6
        )} USDC. Get test USDC from https://faucet.circle.com/`
      );
      setIsApproving(false);
      return;
    }

    try {
      console.log("Calling writeContract for approval...");

      writeContract(
        {
          address: COLLATERAL_TOKEN_ADDRESS,
          abi: [
            {
              name: "approve",
              type: "function",
              stateMutability: "nonpayable",
              inputs: [
                { name: "spender", type: "address" },
                { name: "amount", type: "uint256" },
              ],
              outputs: [{ name: "", type: "bool" }],
            },
          ] as const,
          functionName: "approve",
          args: [CONTRACT_ADDRESS, requiredCollateral],
        },
        {
          onSuccess: (hash) => {
            console.log("✅ Approval writeContract SUCCESS!");
            console.log("Transaction hash:", hash);
          },
          onError: (error) => {
            console.error("❌ Approval writeContract ERROR:", error);
            setError(toErrorMessage(error));
            setIsApproving(false);
          },
        }
      );
    } catch (err) {
      console.error("❌ Exception during approval:", err);
      setError(toErrorMessage(err));
      setIsApproving(false);
    }
  }

  // Reset approving state when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && isApproving) {
      setIsApproving(false);
      refetchAllowance();
    }
  }, [isConfirmed, isApproving, refetchAllowance]);

  function handleMint() {
    setError(null);
    console.log("=== MINT DEBUG ===");
    console.log("Connected:", isConnected);
    console.log("Address:", address);
    console.log("Input Amount:", inputAmount);
    console.log("Parsed Amount:", parsedAmount?.toString());
    console.log("Required Collateral:", requiredCollateral?.toString());
    console.log("Collateral Balance:", collateralBalance.toString());
    console.log("Current Allowance:", currentAllowance.toString());
    console.log("Needs Approval:", needsApproval);
    console.log("Wallet Network:", walletNetwork);
    console.log("Contract Address:", CONTRACT_ADDRESS);

    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!parsedAmount) {
      setError("Please enter a valid amount to mint.");
      return;
    }

    if (needsApproval) {
      setError("Please approve the collateral first (step 1).");
      return;
    }

    console.log("Calling writeContract for mint...");

    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "mintWithCollateral",
        args: [parsedAmount],
      },
      {
        onSuccess: (hash) => {
          console.log("✅ Mint writeContract SUCCESS!");
          console.log("Transaction hash:", hash);
          setInputAmount("");
        },
        onError: (error) => {
          console.error("❌ Mint writeContract ERROR:", error);
          setError(toErrorMessage(error));
        },
      }
    );
  }

  function handleRedeem() {
    setError(null);
    if (!isConnected || !address) {
      setError("Please connect your wallet first.");
      return;
    }
    if (!parsedAmount) {
      setError("Please enter a valid amount to redeem.");
      return;
    }

    console.log("Calling redeem with amount:", parsedAmount.toString());
    writeContract(
      {
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "redeem",
        args: [parsedAmount],
      },
      {
        onSuccess: () => {
          setInputAmount("");
        },
        onError: (error) => {
          console.error("Redeem error:", error);
          setError(toErrorMessage(error));
        },
      }
    );
  }

  if (hasContract === false) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>💰 GoldStable Contract</h3>
        <div className={`${styles.badge} ${styles.error}`}>
          ⚠️ Contract not found
        </div>
        <div className={styles.note}>
          <strong>No contract detected</strong>
          The contract at <code>{CONTRACT_ADDRESS}</code> was not found on the configured network.
          Please verify the contract address and ensure you&apos;re on the Sepolia testnet.
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${!isConnected ? styles.locked : ''}`}>
      {!isConnected && (
        <div className={styles.lockOverlay}>
          <div className={styles.lockContent}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h4>Wallet Connection Required</h4>
            <p>Please connect your wallet to access the GoldStable Contract</p>
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
      <h3 className={styles.title}>💰 GoldStable Contract</h3>
      <p className={styles.meta}>
        Mint GOF tokens by providing USDC collateral or redeem your GOF for USDC
      </p>

      {/* Balance Overview */}
      <div className={styles.balanceSection}>
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>
            <span style={{ marginRight: "0.5rem" }}>🪙</span>
            GOF Balance
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className={styles.balanceValue}>{balanceFormatted} GOF</span>
            <button
              onClick={() => refetchBalance()}
              className={styles.refreshButton}
              title="Refresh balance"
            >
              🔄
            </button>
          </div>
        </div>
        
        <div className={styles.balanceRow}>
          <span className={styles.balanceLabel}>
            <span style={{ marginRight: "0.5rem" }}>💵</span>
            USDC Balance
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className={styles.balanceValue}>
              {formatUnits(collateralBalance, 6)} USDC
            </span>
            <button
              onClick={() => refetchCollateralBalance()}
              className={styles.refreshButton}
              title="Refresh balance"
            >
              🔄
            </button>
          </div>
        </div>

        {collateralBalance === BigInt(0) && (
          <div className={`${styles.badge} ${styles.warning}`}>
            ⚠️ You need USDC to mint GOF tokens.{" "}
            <a
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Get testnet USDC →
            </a>
          </div>
        )}
      </div>

      {/* Network Status */}
      {walletNetwork && walletNetwork.chainId !== sepolia.id && (
        <div className={`${styles.badge} ${styles.error}`}>
          ❌ Wrong Network! Please switch to Sepolia (chainId {sepolia.id})
        </div>
      )}

      {/* Mint/Redeem Section */}
      <div className={styles.section}>
        <div className={styles.field}>
          <label>Amount (GOF tokens)</label>
          <input
            className={styles.input}
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="Enter amount (e.g., 100)"
            type="number"
            step="any"
          />
        </div>

        {requiredCollateral && parsedAmount && (
          <div className={styles.infoPanel}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Amount to mint</span>
              <span className={styles.infoValue}>{inputAmount} GOF</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Required USDC (with fees)</span>
              <span className={styles.infoValue}>
                {formatUnits(requiredCollateral, 6)} USDC
              </span>
            </div>
            {needsApproval && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Status</span>
                <span className={styles.infoValue} style={{ color: "#ffa500" }}>
                  ⚠️ Approval needed
                </span>
              </div>
            )}
          </div>
        )}

        <div className={styles.row}>
          {needsApproval && parsedAmount ? (
            <button
              className={styles.primary}
              onClick={handleApprove}
              disabled={
                !isConnected ||
                !walletClient ||
                !requiredCollateral ||
                isWritePending ||
                isConfirming ||
                isApproving
              }
            >
              {isWritePending || isConfirming
                ? "⏳ Approving..."
                : "1️⃣ Approve USDC"}
            </button>
          ) : null}

          <button
            className={styles.primary}
            onClick={handleMint}
            disabled={
              !isConnected ||
              !walletClient ||
              !parsedAmount ||
              isWritePending ||
              isConfirming ||
              needsApproval
            }
          >
            {isWritePending || isConfirming
              ? "⏳ Processing..."
              : needsApproval && parsedAmount
              ? "2️⃣ Mint GOF (Approve First)"
              : "✅ Mint GOF Tokens"}
          </button>

          <button
            className={styles.secondary}
            onClick={handleRedeem}
            disabled={
              !isConnected ||
              !walletClient ||
              !parsedAmount ||
              isWritePending ||
              isConfirming
            }
          >
            {isWritePending || isConfirming ? "⏳ Processing..." : "🔄 Redeem GOF"}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {txHash && (
        <div className={`${styles.badge} ${isConfirmed ? styles.success : styles.info}`}>
          {isConfirming && <span>⏳ Waiting for confirmation...</span>}
          {isConfirmed && <span>✅ Transaction confirmed!</span>}
          {!isConfirming && !isConfirmed && <span>📝 Transaction submitted</span>}
          <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            View on Etherscan →
          </a>
        </div>
      )}

      <div className={styles.instructions}>
        <strong>How to mint GOF tokens:</strong>
        <ol>
          <li>Enter the amount of GOF tokens you want to mint</li>
          <li>Approve the contract to spend your USDC (one-time approval)</li>
          <li>Mint your GOF tokens by providing USDC as collateral</li>
          <li>You can redeem GOF tokens back to USDC anytime</li>
        </ol>
      </div>

      {/* Contract Info - Collapsible */}
      <details className={styles.detailsPanel}>
        <summary>📋 Contract Information</summary>
        <div className={styles.detailsContent}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>GOF Contract</span>
            <span className={styles.infoValue}>
              <code>{CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}</code>
              <a
                href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                style={{ marginLeft: "0.5rem" }}
              >
                →
              </a>
            </span>
          </div>
          {collateralAddress && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>USDC Contract</span>
              <span className={styles.infoValue}>
                <code>{(collateralAddress as string).slice(0, 6)}...{(collateralAddress as string).slice(-4)}</code>
                <a
                  href={`https://sepolia.etherscan.io/address/${collateralAddress as string}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  style={{ marginLeft: "0.5rem" }}
                >
                  →
                </a>
              </span>
            </div>
          )}
          {address && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Your Wallet</span>
              <span className={styles.infoValue}>
                <code>{address.slice(0, 6)}...{address.slice(-4)}</code>
                <a
                  href={`https://sepolia.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  style={{ marginLeft: "0.5rem" }}
                >
                  →
                </a>
              </span>
            </div>
          )}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Network</span>
            <span className={styles.infoValue}>
              {sepolia.name} (Chain ID: {sepolia.id})
            </span>
          </div>
        </div>
      </details>
    </div>
  );
}
