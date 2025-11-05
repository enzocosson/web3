"use client";

import React from "react";
import styles from "./TrustedBy.module.scss";

export default function TrustedBy() {
  const partners = [
    { name: "TRON", logo: "🚀" },
    { name: "COSMOS", logo: "⚛️" },
    { name: "Stellar", logo: "⭐" },
    { name: "ONIX", logo: "💎" },
    { name: "Ethereum", logo: "Ξ" },
    { name: "Vortex", logo: "🌀" },
  ];

  return (
    <section className={styles.trusted}>
      <div className={styles.container}>
        <p className={styles.label}>Leading the Way in Crypto Trust with GoldStable</p>
        <div className={styles.partners}>
          {partners.map((partner, index) => (
            <div key={index} className={styles.partner}>
              <span className={styles.logo}>{partner.logo}</span>
              <span className={styles.name}>{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
