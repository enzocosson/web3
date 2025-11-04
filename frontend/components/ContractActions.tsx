"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ABI } from "./abi";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;

export default function ContractActions() {
  const { address, isConnected } = useAccount();
  const { data: publicClient } = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [inputAmount, setInputAmount] = useState("");
  const [decimals, setDecimals] = useState<number>(18);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // fetch decimals once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!publicClient) return;
        const d: any = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI as any,
          functionName: "decimals",
          args: [],
        });
        if (mounted) setDecimals(Number(d));
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [publicClient]);

  // fetch balance whenever address or block changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!address || !publicClient) return;
      try {
        const b: any = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: ABI as any,
          functionName: "balanceOf",
          args: [address],
        });
        if (mounted) setBalance(BigInt(b?.toString?.() ?? b ?? 0));
      } catch (e) {
        console.error("read balance failed", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [publicClient, address]);

  const balanceFormatted = useMemo(() => {
    try {
      if (balance == null) return "0";
      return ethers.utils.formatUnits(balance.toString(), decimals);
    } catch (e) {
      return "0";
    }
  }, [balance, decimals]);

  const parsedAmount = useMemo(() => {
    try {
      if (!inputAmount) return undefined;
      return ethers.utils.parseUnits(inputAmount, decimals).toString();
    } catch (e) {
      return undefined;
    }
  }, [inputAmount, decimals]);

  async function handleMint() {
    setError(null);
  if (!walletClient || !publicClient || !parsedAmount || !address) return;
    setLoading(true);
    try {
      const txHash: any = await walletClient.writeContract({
        abi: ABI as any,
        address: CONTRACT_ADDRESS,
        functionName: "mintWithCollateral",
        args: [parsedAmount],
      } as any);
      // wait for receipt
      if (publicClient && txHash) {
        await publicClient.waitForTransactionReceipt({ hash: String(txHash) as `0x${string}` });
      }
      // refresh balance
      const b: any = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI as any,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(BigInt(b?.toString?.() ?? b ?? 0));
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeem() {
    setError(null);
  if (!walletClient || !publicClient || !parsedAmount || !address) return;
    setLoading(true);
    try {
      const txHash: any = await walletClient.writeContract({
        abi: ABI as any,
        address: CONTRACT_ADDRESS,
        functionName: "redeem",
        args: [parsedAmount],
      } as any);
      if (publicClient && txHash) {
        await publicClient.waitForTransactionReceipt({ hash: String(txHash) as `0x${string}` });
      }
      const b: any = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: ABI as any,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(BigInt(b?.toString?.() ?? b ?? 0));
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-200 p-6 bg-white/60 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">Contract actions</h3>
      <p className="mb-3 text-sm text-gray-600">Contract: <code className="break-all text-xs">{CONTRACT_ADDRESS}</code></p>

      <div className="mb-4">
        <div className="text-sm text-gray-700">Connected: {isConnected ? address : "not connected"}</div>
        <div className="mt-2 text-sm">Balance: <strong>{balanceFormatted}</strong></div>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        <label className="text-sm">Amount (displayed in token units)</label>
        <input
          className="rounded border px-3 py-2"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder={`ex: 1.5 (decimals: ${decimals})`}
        />
      </div>

      <div className="flex gap-2">
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
          onClick={() => handleMint()}
          disabled={!isConnected || !walletClient || !parsedAmount || loading}
        >
          {loading ? "Processing..." : "Mint with collateral"}
        </button>

        <button
          className="rounded border px-4 py-2 disabled:opacity-60"
          onClick={() => handleRedeem()}
          disabled={!isConnected || !walletClient || !parsedAmount || loading}
        >
          {loading ? "Processing..." : "Redeem"}
        </button>
      </div>

      <div className="mt-3 text-xs text-red-600">
        {error && <div>Error: {String(error)}</div>}
      </div>

      <div className="mt-3 text-xs text-gray-600">
        <div>Note: this UI assumes the contract uses standard token units (decimals read from contract).</div>
      </div>
    </div>
  );
}
