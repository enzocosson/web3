"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "./Header.module.scss";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 2L4 8V14C4 22 10 28 16 30C22 28 28 22 28 14V8L16 2Z"
              fill="url(#goldGradient)"
              stroke="currentColor"
              strokeWidth="2"
            />
            <text x="16" y="20" fontSize="14" fontWeight="bold" fill="#000" textAnchor="middle">
              G
            </text>
            <defs>
              <linearGradient id="goldGradient" x1="4" y1="2" x2="28" y2="30">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>
          </svg>
          <span className={styles.logoText}>GoldStable</span>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.open : ""}`}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</a>
          <a href="#nft" onClick={() => setMobileMenuOpen(false)}>NFT Collection</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
        </nav>

        <div className={styles.actions}>
          <ConnectButton />
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
