"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./HeroSection.module.scss";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>
      
      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Trusted by 1000s
        </div>

        <h1 className={styles.title}>
          Revolutionize Your Transactions
          <br />
          <span className={styles.gradient}>With Secure Blockchain Solutions</span>
        </h1>

        <p className={styles.subtitle}>
          Experience the future of digital transactions with the safety of our blockchain technology. Our platform
          ensures seamless and protected transactions in a transparent, trackable, and trusted digital future.
        </p>

        <div className={styles.cta}>
          <ConnectButton />
          <button className={styles.secondary}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2V5zm0 8h2v2h-2v-2z"/>
            </svg>
            Learn More
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>$2.5B+</div>
            <div className={styles.statLabel}>Total Value Locked</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>50K+</div>
            <div className={styles.statLabel}>Active Users</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>99.9%</div>
            <div className={styles.statLabel}>Uptime</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className={styles.floatingCard} style={{ top: '15%', right: '10%' }}>
        <div className={styles.cardIcon}>🔒</div>
        <div className={styles.cardText}>Advanced Security</div>
      </div>

      <div className={styles.floatingCard} style={{ bottom: '25%', left: '8%' }}>
        <div className={styles.cardIcon}>⚡</div>
        <div className={styles.cardText}>Lightning Fast</div>
      </div>
    </section>
  );
}
