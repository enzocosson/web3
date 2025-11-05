"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from "./page.module.scss";

const ContractActions = dynamic(() => import('../components/ContractActions'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroLeft}>
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={100} height={20} priority />
        <h1 className={styles.title}>GoldStable — Chainlink Oracle Demo</h1>
        <p className={styles.lead}>
          Connect your wallet and interact with the GoldStable contract: mint GOF tokens with collateral,
          redeem them and monitor your balance. The UI is responsive and secure.
        </p>
        <div className={styles.linksRow}>
          <ConnectButton />
        </div>
      </div>

      <div className={styles.rightCol}>
        <ContractActions />
      </div>
    </div>
  );
}

