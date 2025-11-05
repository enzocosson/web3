# Gold Stable Chainlink - Frontend

Frontend Next.js pour interagir avec le contrat GoldStableChainlink sur Sepolia.

## Déploiement sur Vercel

### Variables d'environnement requises

Dans les paramètres Vercel, ajoutez :

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
```

⚠️ **Important** : Remplacez par l'adresse de VOTRE contrat déployé sur Sepolia !

### Comment trouver votre adresse de contrat

1. Allez dans Remix où vous avez déployé le contrat
2. Copiez l'adresse depuis "Deployed Contracts"
3. Ou trouvez-la dans MetaMask/Rabby dans vos tokens GOF

## Installation locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Technologies

- Next.js 15
- React 19
- Wagmi (Web3)
- Ethers.js
- TypeScript
