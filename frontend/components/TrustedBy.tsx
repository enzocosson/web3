"use client";

import React from "react";
import styles from "./TrustedBy.module.scss";
import Image from "next/image";

export default function TrustedBy() {
  const partners = [
    { name: "Ethereum", logo: "/image/eth.svg", size: 180 },
    { name: "Stellar", logo: "/image/stellar.png", size: 180 },
    { name: "OKX", logo: "/image/okx.png", size: 150 },
  ];

  return (
    <section className={styles.trusted}>
      <div className={styles.container}>
        <div className={styles.badge}>Our Partners</div>
        <h2 className={styles.title}>
          Trusted Networks for GOF Token & Golden Reserves NFT
        </h2>
        <div className={styles.partners}>
          {partners.map((partner, index) => (
            <div key={index} className={styles.partner}>
              <div
                className={styles.logoWrapper}
                style={{ width: partner.size, height: partner.size }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.size}
                  height={partner.size}
                  className={styles.logo}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
