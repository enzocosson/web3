"use client";

import React from "react";
import styles from "./FeaturesSection.module.scss";

export default function FeaturesSection() {
  const features = [
    {
      icon: "📊",
      title: "Real-Time Analytics",
      description: "Track real-time gold prices through Chainlink oracles, providing instant GOF token valuations and comprehensive market insights.",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "🔐",
      title: "Advanced Security",
      description: "Enterprise-grade blockchain security with multi-signature wallets, smart contract audits, and decentralized oracle protection.",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: "💡",
      title: "USDT",
      description: "Mint and redeem stable USD-pegged tokens with collateral backing, offering seamless integration with your Web3 wallet.",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "🎨",
      title: "NFT Collection",
      description: "Mint exclusive Golden Reserves NFT certificates using GOF tokens. Four rarity tiers with unique benefits and on-chain proof.",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      icon: "🌐",
      title: "Ecosystem Partnerships",
      description: "Seamlessly integrate with leading DeFi protocols, DEXs, and blockchain ecosystems for maximum interoperability.",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      icon: "💱",
      title: "Multi-Currency Support",
      description: "Support for Ethereum, USDC, USDT, and major cryptocurrencies with real-time conversion and low transaction fees.",
      gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    },
  ];

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.label}>Our Features</p>
          <h2 className={styles.title}>Innovative Features of GoldStable</h2>
          <p className={styles.subtitle}>
            Experience cutting-edge blockchain solutions designed to revolutionize your digital transactions with
            unparalleled security and transparency.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper} style={{ background: feature.gradient }}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
              
              {/* Decorative chart/visual based on feature type */}
              {index === 0 && (
                <div className={styles.miniChart}>
                  <div className={styles.bar} style={{ height: '60%' }}></div>
                  <div className={styles.bar} style={{ height: '40%' }}></div>
                  <div className={styles.bar} style={{ height: '80%' }}></div>
                  <div className={styles.bar} style={{ height: '65%' }}></div>
                </div>
              )}
              {index === 1 && (
                <div className={styles.securityBadge}>
                  <div className={styles.shield}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 6v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
