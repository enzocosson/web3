#!/bin/bash
# Script pour ajouter les variables d'environnement à Vercel
# Exécutez ce script après avoir installé vercel CLI: npm i -g vercel

# Se connecter à Vercel
vercel login

# Naviguer dans le projet
cd frontend

# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_PINATA_API_KEY production
# Coller: 5f29f3573981215fc4fe

vercel env add NEXT_PUBLIC_PINATA_API_SECRET production
# Coller: 03f0444827ad5a3ec0e04f558e9ad2572c547a001718fb6c64b2f645ace70f4e

vercel env add NEXT_PUBLIC_PINATA_JWT production
# Coller: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

vercel env add NEXT_PUBLIC_PINATA_GATEWAY production
# Coller: https://gateway.pinata.cloud

vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS production
# Coller: 0x1230F65EfFb7518A25aAe9C974aC7890F65B0d1E

echo "✅ Variables d'environnement ajoutées ! Redéployez maintenant avec: vercel --prod"
