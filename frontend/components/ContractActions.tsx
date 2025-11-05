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
        <h3 className={styles.title}>Contract not found</h3>
        <p className={styles.meta}>
          No contract was found at{" "}
          <code className="break-all">{CONTRACT_ADDRESS}</code> on the
          configured network.
        </p>
        <div className={styles.note}>
          Please verify the contract address and network. Your frontend is
          currently configured for Sepolia (see `components/config.ts`).
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Contract actions</h3>

      {/* Diagnostic Panel */}
      <details
        style={{
          marginBottom: "16px",
          padding: "12px",
          background: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
          🔍 Debug Information (click to expand)
        </summary>
        <div
          style={{
            marginTop: "12px",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          <div>
            <strong>Connected:</strong> {isConnected ? "Yes" : "No"}
          </div>
          <div>
            <strong>Address:</strong> {address || "Not connected"}
          </div>
          <div>
            <strong>Wallet Network:</strong>{" "}
            {walletNetwork
              ? `${walletNetwork.name} (${walletNetwork.chainId})`
              : "Not detected"}
          </div>
          <div>
            <strong>Expected Network:</strong> Sepolia (11155111)
          </div>
          <div
            style={{
              color: walletNetwork?.chainId !== 11155111 ? "red" : "green",
            }}
          >
            <strong>Network Match:</strong>{" "}
            {walletNetwork?.chainId === 11155111
              ? "✅ Correct"
              : "❌ WRONG NETWORK!"}
          </div>
          <hr style={{ margin: "8px 0" }} />
          <div>
            <strong>GOF Contract:</strong> {CONTRACT_ADDRESS}
          </div>
          <div>
            <strong>Collateral Token:</strong>{" "}
            {(collateralAddress as string) || "Loading..."}
          </div>
          <div>
            <strong>Has Contract Code:</strong>{" "}
            {hasContract === true
              ? "✅ Yes"
              : hasContract === false
              ? "❌ No"
              : "⏳ Checking..."}
          </div>
          <hr style={{ margin: "8px 0" }} />
          <div>
            <strong>GOF Balance (raw):</strong>{" "}
            {contractBalance?.toString() || "null"}
          </div>
          <div>
            <strong>GOF Balance (formatted):</strong> {balanceFormatted}
          </div>
          <div>
            <strong>USDC Balance (raw):</strong>{" "}
            {collateralBalanceData?.toString() || "null"}
          </div>
          <div>
            <strong>USDC Balance (formatted):</strong>{" "}
            {formatUnits(collateralBalance, 6)} USDC
          </div>
          <div>
            <strong>Required Collateral:</strong>{" "}
            {requiredCollateral
              ? formatUnits(requiredCollateral, 6) + " USDC"
              : "Enter amount first"}
          </div>
          <div>
            <strong>Current Allowance:</strong>{" "}
            {formatUnits(currentAllowance, 6)} USDC
          </div>
          <div style={{ color: needsApproval ? "orange" : "green" }}>
            <strong>Needs Approval:</strong>{" "}
            {needsApproval ? "⚠️ Yes - Click Step 1" : "✅ No - Ready to mint"}
          </div>
          <hr style={{ margin: "8px 0" }} />
          <div>
            <strong>Parsed Amount:</strong> {parsedAmount?.toString() || "None"}
          </div>
          <div>
            <strong>Input Decimals:</strong> {decimals}
          </div>
          <div>
            <strong>Is Pending:</strong> {isWritePending ? "Yes" : "No"}
          </div>
          <div>
            <strong>Is Confirming:</strong> {isConfirming ? "Yes" : "No"}
          </div>
          <div>
            <strong>Last TX Hash:</strong> {txHash || "None"}
          </div>
          <hr style={{ margin: "8px 0" }} />
          <div style={{ marginTop: "8px" }}>
            <strong>⚠️ Balance showing 0 but you have tokens?</strong>
            <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
              <li>Click the 🔄 Refresh buttons above</li>
              <li>Check you&apos;re on the right network (Sepolia)</li>
              <li>Verify the contract address matches your deployment</li>
              <li>
                Check on{" "}
                <a
                  href={`https://sepolia.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0070f3" }}
                >
                  Etherscan
                </a>{" "}
                to confirm your actual balance
              </li>
            </ul>
          </div>
        </div>
      </details>

      <p className={styles.meta}>
        GOF Contract: <code className="break-all">{CONTRACT_ADDRESS}</code>{" "}
        <a
          href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#0070f3",
            textDecoration: "underline",
            fontSize: "12px",
          }}
        >
          View on Etherscan
        </a>
      </p>
      {collateralAddress && (
        <p className={styles.meta}>
          Collateral Token:{" "}
          <code className="break-all">{collateralAddress as string}</code>{" "}
          <a
            href={`https://sepolia.etherscan.io/address/${
              collateralAddress as string
            }`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              fontSize: "12px",
            }}
          >
            View on Etherscan
          </a>
        </p>
      )}
      {address && (
        <p className={styles.meta}>
          Your Wallet: <code className="break-all">{address}</code>{" "}
          <a
            href={`https://sepolia.etherscan.io/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0070f3",
              textDecoration: "underline",
              fontSize: "12px",
            }}
          >
            View on Etherscan
          </a>
        </p>
      )}
      <div className={styles.field}>
        <div className={styles.row}>
          <div>
            Configured network:{" "}
            <strong>
              {sepolia.name} (chainId {sepolia.id})
            </strong>
          </div>
        </div>
        <div className={styles.row}>
          <div>
            Wallet network:{" "}
            <strong>
              {walletNetwork
                ? `${walletNetwork.name ?? "unknown"} (chainId ${
                    walletNetwork.chainId
                  })`
                : "not available"}
            </strong>
          </div>
        </div>
        {walletNetwork && walletNetwork.chainId !== sepolia.id && (
          <div className={styles.note}>
            Warning: wallet network differs from configured frontend network.
            This may cause contract not found errors.
          </div>
        )}
      </div>

      <div className={styles.field}>
        <div className={styles.row}>
          <div>Connected: {isConnected ? address : "not connected"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>
            GOF Balance: <strong>{balanceFormatted}</strong>
          </span>
          <button
            onClick={() => {
              console.log("Refreshing GOF balance...");
              refetchBalance();
            }}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              cursor: "pointer",
              borderRadius: "4px",
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            🔄 Refresh
          </button>
        </div>
        {collateralAddress && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>
              Collateral Balance:{" "}
              <strong>{formatUnits(collateralBalance, 6)} USDC</strong>
            </span>
            <button
              onClick={() => {
                console.log("Refreshing USDC balance...");
                refetchCollateralBalance();
              }}
              style={{
                padding: "4px 8px",
                fontSize: "11px",
                cursor: "pointer",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              🔄 Refresh
            </button>
            {collateralBalance === BigInt(0) && (
              <span style={{ color: "#ff4444", marginLeft: "8px" }}>
                ⚠️ You need USDC! Get it from{" "}
                <a
                  href="https://faucet.circle.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0070f3", textDecoration: "underline" }}
                >
                  Circle Faucet
                </a>
              </span>
            )}
          </div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.meta}>Amount (token units)</label>
        <input
          className={styles.input}
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder={`ex: 1.5 (decimals: ${decimals})`}
        />
        {requiredCollateral && (
          <div className={styles.meta} style={{ marginTop: "8px" }}>
            Required collateral (with fees):{" "}
            {formatUnits(requiredCollateral, 6)} USDC
          </div>
        )}
        {currentAllowance > BigInt(0) && (
          <div className={styles.meta}>
            Current allowance: {formatUnits(currentAllowance, 6)} USDC
          </div>
        )}
      </div>

      <div className={styles.row}>
        {needsApproval && parsedAmount ? (
          <button
            className={styles.primary}
            onClick={() => handleApprove()}
            disabled={
              !isConnected ||
              !walletClient ||
              !requiredCollateral ||
              isWritePending ||
              isConfirming ||
              isApproving
            }
            style={{
              opacity:
                !isConnected ||
                !walletClient ||
                !requiredCollateral ||
                isWritePending ||
                isConfirming ||
                isApproving
                  ? 0.5
                  : 1,
              cursor:
                !isConnected ||
                !walletClient ||
                !requiredCollateral ||
                isWritePending ||
                isConfirming ||
                isApproving
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isWritePending || isConfirming
              ? "⏳ Approving..."
              : "1️⃣ Approve Collateral"}
          </button>
        ) : null}

        <button
          className={styles.primary}
          onClick={() => handleMint()}
          disabled={
            !isConnected ||
            !walletClient ||
            !parsedAmount ||
            isWritePending ||
            isConfirming ||
            needsApproval
          }
          style={{
            opacity:
              !isConnected ||
              !walletClient ||
              !parsedAmount ||
              isWritePending ||
              isConfirming ||
              needsApproval
                ? 0.5
                : 1,
            cursor:
              !isConnected ||
              !walletClient ||
              !parsedAmount ||
              isWritePending ||
              isConfirming ||
              needsApproval
                ? "not-allowed"
                : "pointer",
            backgroundColor: needsApproval ? "#666" : undefined,
          }}
        >
          {isWritePending || isConfirming
            ? "⏳ Processing..."
            : needsApproval
            ? "2️⃣ Mint with collateral (Approve first)"
            : "✅ Mint with collateral"}
        </button>

        <button
          className={styles.secondary}
          onClick={() => handleRedeem()}
          disabled={
            !isConnected ||
            !walletClient ||
            !parsedAmount ||
            isWritePending ||
            isConfirming
          }
          style={{
            opacity:
              !isConnected ||
              !walletClient ||
              !parsedAmount ||
              isWritePending ||
              isConfirming
                ? 0.5
                : 1,
            cursor:
              !isConnected ||
              !walletClient ||
              !parsedAmount ||
              isWritePending ||
              isConfirming
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isWritePending || isConfirming ? "⏳ Processing..." : "🔄 Redeem"}
        </button>
      </div>

      {error && <div className={styles.error}>Error: {String(error)}</div>}

      {txHash && (
        <div className={styles.note}>
          <div style={{ marginBottom: "8px" }}>
            <strong>Transaction Details:</strong>
          </div>
          <div
            style={{
              fontSize: "12px",
              wordBreak: "break-all",
              marginBottom: "8px",
            }}
          >
            Hash: {txHash}
          </div>
          <div>
            {isConfirming && <span>⏳ Waiting for confirmation...</span>}
            {isConfirmed && (
              <span style={{ color: "#00cc00" }}>✅ Confirmed!</span>
            )}
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0070f3", textDecoration: "underline" }}
          >
            View on Etherscan
          </a>
          <div style={{ fontSize: "11px", marginTop: "8px", color: "#666" }}>
            Note: It may take a few seconds for the transaction to appear on
            Etherscan. If it doesn&apos;t appear after 30 seconds, the
            transaction may have been rejected.
          </div>
        </div>
      )}

      <div className={styles.note}>
        Note: Minting requires two transactions:
        <br />
        1. First, approve the contract to spend your collateral token (USDC)
        <br />
        2. Then, mint the GOF tokens with your collateral
      </div>
    </div>
  );
}
