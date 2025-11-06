"use client";

import React from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "ethers";
import { ABI } from "./abi";
import styles from "./DashboardSection.module.scss";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
  "0x857bd5b87658dc4976a4f515fb78d06192f5e9b5") as `0x${string}`;

export default function DashboardSection() {
  const { address, isConnected } = useAccount();

  const { data: balanceData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const balance = balanceData ? formatUnits(BigInt(balanceData.toString()), 18) : "0";
  const balanceUSD = (parseFloat(balance) * 1850).toFixed(2); // Approx gold price

  return (
    <section className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.label}>Multi-Currency Support</p>
          <h2 className={styles.title}>All-in-One Web3 ALM Dashboard</h2>
          <p className={styles.subtitle}>
            Get all the information you need in one secure location for comprehensive Web3 trading. This allows you
            to experience the smoothness of a decentralized, future-proof financial trading environment.
          </p>
          <button className={styles.manageButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
              <path d="M13 9h-2V7c0-.553-.447-1-1-1s-1 .447-1 1v2H7c-.553 0-1 .447-1 1s.447 1 1 1h2v2c0 .553.447 1 1 1s1-.447 1-1v-2h2c.553 0 1-.447 1-1s-.447-1-1-1z"/>
            </svg>
            Manage Your Position
          </button>
        </div>

        <div className={styles.cards}>
          {/* Webtrix Crypto Card */}
          <div className={styles.cryptoCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="url(#goldGrad)" stroke="currentColor" strokeWidth="2"/>
                  <defs>
                    <linearGradient id="goldGrad" x1="4" y1="2" x2="20" y2="22">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>GoldStable Crypto</span>
              </div>
              <div className={styles.menu}>⋯</div>
            </div>

            <div className={styles.balance}>
              {isConnected ? (
                <>
                  <div className={styles.gofAmount}>{parseFloat(balance).toFixed(4)} GOF</div>
                  <div className={styles.usdAmount}>${balanceUSD} USD</div>
                </>
              ) : (
                <>
                  <div className={styles.gofAmount}>0.0000 GOF</div>
                  <div className={styles.usdAmount}>$0.00 USD</div>
                </>
              )}
            </div>

            <div className={styles.chart}>
              <div className={styles.chartLine}></div>
              {[65, 45, 70, 55, 75, 60, 80, 70, 85].map((height, i) => (
                <div key={i} className={styles.chartBar} style={{ height: `${height}%` }}></div>
              ))}
            </div>

            <div className={styles.period}>
              <button className={styles.active}>1 Week</button>
              <button>1 Month</button>
              <button>3 Months</button>
            </div>
          </div>

          {/* Balance Display */}
          <div className={styles.balanceCard}>
            <div className={styles.balanceHeader}>
              <span>Total Balance (USD)</span>
              <select className={styles.currencySelect}>
                <option>Wed</option>
                <option>Thu</option>
                <option>Fri</option>
              </select>
            </div>
            <div className={styles.totalAmount}>${balanceUSD}</div>
            <div className={styles.miniChart}>
              {[40, 60, 45, 70, 55, 75, 65, 80, 70, 85, 90].map((height, i) => (
                <div key={i} className={styles.miniBar} style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Crypto Pairs Table */}
        <div className={styles.pairsTable}>
          <h3 className={styles.tableTitle}>Top Cryptocurrency Pairs</h3>
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Pair</span>
              <span>24h Volume</span>
              <span>Status</span>
              <span>Price (USD)</span>
            </div>
            {[
              { pair: "GOF / ETH", volume: "$100,000,000", status: "Positive", price: "$1,850.00", positive: true },
              { pair: "GOF / USDT", volume: "$85,000,000", status: "Positive", price: "$1,850.00", positive: true },
              { pair: "MATIC / ETH", volume: "$70,000,000", status: "Negative", price: "$0.90", positive: false },
              { pair: "TRX / ETH", volume: "$55,000,000", status: "Positive", price: "$0.08", positive: true },
              { pair: "XLM / ETH", volume: "$40,000,000", status: "Negative", price: "$0.12", positive: false },
            ].map((row, i) => (
              <div key={i} className={styles.tableRow}>
                <span className={styles.pairName}>{row.pair}</span>
                <span className={styles.volume}>{row.volume}</span>
                <span className={`${styles.status} ${row.positive ? styles.positive : styles.negative}`}>
                  {row.positive ? "↗" : "↘"} {row.status}
                </span>
                <span className={styles.price}>{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
