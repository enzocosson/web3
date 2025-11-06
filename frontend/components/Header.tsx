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
          <span className={styles.logoText}>Aurexium</span>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.open : ""}`}>
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>
            Features
          </a>
          <a href="#dashboard" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </a>
          <a href="#nft" onClick={() => setMobileMenuOpen(false)}>
            NFT Collection
          </a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
            FAQ
          </a>
        </nav>

        <div className={styles.actions}>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className={styles.connectButton}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17 8h-1V6c0-2.76-2.24-5-5-5S6 3.24 6 6v2H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" />
                          </svg>
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className={styles.wrongNetworkButton}
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className={styles.connectedContainer}>
                        <button
                          onClick={openChainModal}
                          className={styles.chainButton}
                        >
                          {chain.hasIcon && (
                            <div className={styles.chainIcon}>
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? "Chain icon"}
                                  src={chain.iconUrl}
                                  width={20}
                                  height={20}
                                />
                              )}
                            </div>
                          )}
                          {chain.name}
                        </button>

                        <button
                          onClick={openAccountModal}
                          className={styles.accountButton}
                        >
                          <span className={styles.accountAddress}>
                            {account.displayName}
                          </span>
                          {account.displayBalance && (
                            <span className={styles.accountBalance}>
                              {account.displayBalance}
                            </span>
                          )}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
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
