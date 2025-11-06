"use client";

import dynamic from "next/dynamic";
import styles from "./page.module.scss";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import TrustedBy from "../components/TrustedBy";
import DashboardSection from "../components/DashboardSection";
import NFTShowcase from "../components/NFTShowcase";
import FAQ from "../components/FAQ";

const ContractActions = dynamic(() => import('../components/ContractActions'), {
  ssr: false,
});

const NFTCollection = dynamic(() => import('../components/NFTCollection'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroSection />
      <TrustedBy />
      <FeaturesSection />
      
      {/* Dashboard Section */}
      <section id="dashboard">
        <DashboardSection />
      </section>

      {/* GOF Token Contract Section */}
      <section className={styles.gofSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>💰 GoldStable Token (GOF)</h2>
          <p className={styles.sectionDescription}>
            Mint and redeem gold-backed GOF tokens using USDC collateral
          </p>
        </div>
        <div className={styles.sectionContent}>
          <ContractActions />
        </div>
      </section>

      {/* NFT Collection Section */}
      <section className={styles.nftSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🎨 Golden Reserves NFT Collection</h2>
          <p className={styles.sectionDescription}>
            Mint exclusive reserve certificates by staking GOF tokens
          </p>
        </div>
        <div className={styles.sectionContent}>
          <NFTCollection />
        </div>
      </section>

      <NFTShowcase />
      <FAQ />
    </div>
  );
}

