"use client";

import React from "react";
import Image from "next/image";
import { RARITY_INFO, Rarity } from "./nftAbi";
import styles from "./NFTShowcase.module.scss";

export default function NFTShowcase() {
  const tiers = [
    {
      rarity: Rarity.BRONZE,
      info: RARITY_INFO[Rarity.BRONZE],
      benefits: ["Basic Certificate", "On-chain Proof", "Community Access"],
    },
    {
      rarity: Rarity.SILVER,
      info: RARITY_INFO[Rarity.SILVER],
      benefits: ["Silver Certificate", "Priority Support", "Early Access"],
    },
    {
      rarity: Rarity.GOLD,
      info: RARITY_INFO[Rarity.GOLD],
      benefits: ["Gold Certificate", "VIP Support", "Exclusive Events"],
    },
    {
      rarity: Rarity.DIAMOND,
      info: RARITY_INFO[Rarity.DIAMOND],
      benefits: ["Diamond Certificate", "Personal Manager", "Maximum Benefits"],
    },
  ];

  return (
    <section id="nft" className={styles.nft}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.label}>Supply liquidity to leading pools.</p>
          <h2 className={styles.title}>Golden Reserves NFT Collection</h2>
          <p className={styles.subtitle}>
            Diversify your GOF holdings into exclusive NFT certificates. Each tier offers unique benefits and represents
            a stake in the GoldStable ecosystem with on-chain proof of ownership.
          </p>
          <button className={styles.exploreButton}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
              <path d="M10 5v5l4 2-1 1.5-5-3V5h2z"/>
            </svg>
            Explore The Pools
          </button>
        </div>

        <div className={styles.grid}>
          {tiers.map((tier, index) => (
            <div key={index} className={styles.card} style={{ borderColor: tier.info.color }}>
              <div className={styles.badge} style={{ background: tier.info.color }}>
                {tier.info.name}
              </div>
              
              <div className={styles.imageWrapper}>
                <Image
                  src={tier.info.template}
                  alt={tier.info.name}
                  width={400}
                  height={560}
                  className={styles.image}
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.tierName}>{tier.info.name} Reserve</h3>
                <p className={styles.description}>{tier.info.description}</p>

                <div className={styles.price}>
                  <span className={styles.priceLabel}>Stake Required</span>
                  <span className={styles.priceValue} style={{ color: tier.info.color }}>
                    {tier.info.price} GOF
                  </span>
                </div>

                <div className={styles.benefits}>
                  <p className={styles.benefitsTitle}>Benefits:</p>
                  <ul>
                    {tier.benefits.map((benefit, i) => (
                      <li key={i}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.707 7.707l-5 5a.997.997 0 01-1.414 0l-2-2a.999.999 0 111.414-1.414L9 10.586l4.293-4.293a.999.999 0 111.414 1.414z"/>
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={styles.mintButton} style={{ background: tier.info.color }}>
                  Mint {tier.info.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
