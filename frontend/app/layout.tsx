"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { Geist, Geist_Mono } from "next/font/google";
import { WagmiProvider } from "wagmi";
import { config } from "../components/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import styles from "./layout.module.scss";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Header from "../components/Header";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <div className={styles.container}>
                <Header />
                <main className={styles.main}>
                  {children}
                </main>
                <Footer />
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
