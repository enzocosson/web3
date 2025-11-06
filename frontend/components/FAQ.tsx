"use client";

import React, { useState } from "react";
import styles from "./FAQ.module.scss";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is GoldStable?",
      answer: "GoldStable is a revolutionary blockchain platform that combines the stability of gold-backed tokens (GOF) with cutting-edge Chainlink oracle technology. Our platform allows you to mint, trade, and redeem GOF tokens that are pegged to real-time gold prices, providing a secure and transparent digital asset experience.",
    },
    {
      question: "How do I start using GoldStable?",
      answer: "Getting started is easy! First, connect your Web3 wallet (like MetaMask) using the 'Connect Wallet' button. Make sure you're on the Sepolia testnet. Then, you'll need some USDC collateral to mint GOF tokens. You can get test USDC from the Circle faucet. Once you have collateral, simply approve the contract and mint your GOF tokens!",
    },
    {
      question: "What are Golden Reserves NFTs?",
      answer: "Golden Reserves NFTs are exclusive certificate NFTs that you can mint using your GOF tokens. They come in four tiers (Bronze, Silver, Gold, and Diamond), each requiring a different stake amount. These NFTs serve as proof of your participation in the GoldStable ecosystem and come with unique benefits depending on the tier.",
    },
    {
      question: "How does the Chainlink oracle integration work?",
      answer: "Our platform uses Chainlink Price Feeds to get real-time, tamper-proof gold price data directly on-chain. This ensures that your GOF tokens always reflect the accurate market value of gold. The oracle updates are automatic and decentralized, providing maximum security and reliability.",
    },
    {
      question: "Is my wallet secure on GoldStable?",
      answer: "Absolutely! GoldStable never stores your private keys. All transactions are executed directly from your wallet using industry-standard Web3 protocols. Our smart contracts have been designed with security best practices and use audited libraries from OpenZeppelin. Always make sure you're on the correct website and never share your seed phrase with anyone.",
    },
    {
      question: "What networks does GoldStable support?",
      answer: "Currently, GoldStable is deployed on Ethereum Sepolia testnet for testing purposes. We plan to expand to Ethereum mainnet and other EVM-compatible chains in the future. Stay tuned for announcements about mainnet deployment and multi-chain support!",
    },
  ];

  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Have a Questions?
            <br />
            We&apos;ve Got Your Answers.
          </h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.featured}>
            <div className={styles.featuredCard}>
              <h3>What is GoldStable?</h3>
              <p>
                GoldStable is a blockchain-based platform that revolutionizes digital transactions through secure,
                transparent, and gold-backed token solutions. Our ecosystem combines DeFi innovation with traditional
                asset stability.
              </p>
            </div>
            <div className={styles.featuredCard}>
              <h3>How do I start using GoldStable?</h3>
              <p>
                Getting started is simple: connect your wallet, acquire some test USDC, approve the collateral
                contract, and mint your GOF tokens. Our platform guides you through each step with clear instructions
                and real-time feedback.
              </p>
            </div>
          </div>

          <div className={styles.accordion}>
            {faqs.map((faq, index) => (
              <div key={index} className={`${styles.item} ${openIndex === index ? styles.open : ""}`}>
                <button className={styles.question} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  <span>{faq.question}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={styles.icon}
                  >
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className={styles.answer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.contact}>
          <div className={styles.contactCard}>
            <h3>Need More Help?</h3>
            <p>Our support team is here 24/7 to answer your questions</p>
            <button className={styles.contactButton}>
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
