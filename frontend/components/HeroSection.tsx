"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import styles from "./HeroSection.module.scss";

const TokenGofHero = dynamic(() => import("./TokenGofHero"), {
  ssr: false,
});

export default function HeroSection() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const isClickingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => {
      isClickingRef.current = true;
      if (cursorRef.current) {
        cursorRef.current.classList.add(styles.clicking);
      }
      if (trailRef.current) {
        trailRef.current.classList.add(styles.clicking);
      }
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
      if (cursorRef.current) {
        cursorRef.current.classList.remove(styles.clicking);
      }
      if (trailRef.current) {
        trailRef.current.classList.remove(styles.clicking);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const animate = () => {
      // Calcul de la distance au centre de l'écran
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distanceToCenter = Math.sqrt(
        Math.pow(mousePos.current.x - centerX, 2) + 
        Math.pow(mousePos.current.y - centerY, 2)
      );
      
      // Distance maximale (du coin au centre)
      const maxDistance = Math.sqrt(
        Math.pow(centerX, 2) + Math.pow(centerY, 2)
      );
      
      // Normaliser la distance (0 = centre, 1 = coin)
      const normalizedDistance = Math.min(distanceToCenter / maxDistance, 1);
      
      // Inverser pour avoir 1 au centre et 0 au bord
      const proximity = 1 - normalizedDistance;
      
      // Scale: 1x au bord, jusqu'à 3x au centre
      const scale = 1 + (proximity * 2);
      
      // Intensité de la lueur: 0.8 au bord, jusqu'à 1.5 au centre
      const glowIntensity = 0.8 + (proximity * 0.7);

      // Smooth follow avec ease-out pour le curseur principal
      const dx = mousePos.current.x - cursorPos.current.x;
      const dy = mousePos.current.y - cursorPos.current.y;
      
      cursorPos.current.x += dx * 0.15;
      cursorPos.current.y += dy * 0.15;

      // Traînée encore plus lente
      const tdx = cursorPos.current.x - trailPos.current.x;
      const tdy = cursorPos.current.y - trailPos.current.y;
      
      trailPos.current.x += tdx * 0.08;
      trailPos.current.y += tdy * 0.08;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorPos.current.x}px`;
        cursorRef.current.style.top = `${cursorPos.current.y}px`;
        // N'appliquer le scale que si on ne clique pas (pour laisser l'animation CSS)
        if (!isClickingRef.current) {
          cursorRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
        cursorRef.current.style.opacity = `${glowIntensity}`;
      }

      if (trailRef.current) {
        trailRef.current.style.left = `${trailPos.current.x}px`;
        trailRef.current.style.top = `${trailPos.current.y}px`;
        // N'appliquer le scale que si on ne clique pas (pour laisser l'animation CSS)
        if (!isClickingRef.current) {
          trailRef.current.style.transform = `translate(-50%, -50%) scale(${scale * 1.2})`;
        }
        trailRef.current.style.opacity = `${0.6 * glowIntensity}`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <section className={styles.hero}>
      {/* Cursor personnalisé avec lueur jaune */}
      <div ref={trailRef} className={styles.cursorTrail}></div>
      <div ref={cursorRef} className={styles.cursorGlow}></div>
      <div className={styles.stars}></div>

      {/* Canvas 3D en position absolute qui couvre tout l'écran */}
      <TokenGofHero />

      {/* Halo brillant autour du token 3D */}
      <div className={styles.sphere}></div>

      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot}></span>
          Gold-Backed Cryptocurrency
        </div>

        <h1 className={styles.title}>
          The Next Generation of Gold-Backed Assets on the Blockchain
        </h1>

        <p className={styles.subtitle}>
          Invest in a stable cryptocurrency backed by real gold reserves. Access
          exclusive Golden Reserves NFT collection and secure your digital
          wealth.
        </p>

        <div className={styles.cta}>
          <button className={styles.primary}>Get Started</button>
          <button className={styles.secondary}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13h2v6h-2V5zm0 8h2v2h-2v-2z" />
            </svg>
            Learn More
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>100%</div>
            <div className={styles.statLabel}>Gold-Backed</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>10K+</div>
            <div className={styles.statLabel}>NFTs Minted</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>$5M+</div>
            <div className={styles.statLabel}>Gold Reserves</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className={styles.floatingCard} style={{ top: "15%", right: "10%" }}>
        <div className={styles.cardIcon}>🪙</div>
        <div className={styles.cardText}>Gold-Backed Token</div>
      </div>

      <div
        className={styles.floatingCard}
        style={{ bottom: "25%", left: "8%" }}
      >
        <div className={styles.cardIcon}>🎨</div>
        <div className={styles.cardText}>Exclusive NFTs</div>
      </div>
    </section>
  );
}
