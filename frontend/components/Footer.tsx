"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
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
              <span>GoldStable</span>
            </div>
            <p className={styles.tagline}>
              Stay Ahead with GoldStable Insights
            </p>
            <form className={styles.newsletter}>
              <input type="email" placeholder="Enter Your Email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          {/* Product */}
          <div className={styles.column}>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#nft">NFT Collection</a></li>
              <li><a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer">Analytics (Etherscan)</a></li>
            </ul>
          </div>

          {/* Why We Are */}
          <div className={styles.column}>
            <h4>Why We Are</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#team">Our Team</a></li>
              <li><a href="#roadmap">Roadmap</a></li>
              <li><a href="https://docs.chain.link/" target="_blank" rel="noopener noreferrer">Press Release (Chainlink Docs)</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.column}>
            <h4>Support</h4>
            <ul>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="https://docs.chain.link/data-feeds/price-feeds" target="_blank" rel="noopener noreferrer">Documentation</a></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Documentation */}
          <div className={styles.column}>
            <h4>Documentation</h4>
            <ul>
              <li><a href="https://docs.chain.link/" target="_blank" rel="noopener noreferrer">Whitepaper</a></li>
              <li><a href="https://ethereum.org/en/developers/docs/" target="_blank" rel="noopener noreferrer">Developer Docs</a></li>
              <li><Link href="/api">API Reference</Link></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <p>Copyright © 2025. All Rights Reserved</p>
            <div className={styles.links}>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
          <div className={styles.social}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
