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
      
      {/* Dashboard Section with Contract Actions */}
      <section id="dashboard" className={styles.dashboardWrapper}>
        <DashboardSection />
        <div className={styles.contractsGrid}>
          <ContractActions />
          <NFTCollection />
        </div>
      </section>

      <NFTShowcase />
      <FAQ />
    </div>
  );
}

