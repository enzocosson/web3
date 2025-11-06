# Golden Reserves NFT Collection 🎨

Collection de NFT exclusive pour l'écosystème GoldStable, permettant de mint des certificats d'or numériques en payant avec des tokens GOF.

## 🎯 Concept

Les **Golden Reserves** sont des certificats d'or digitaux représentant différents niveaux de stake dans l'écosystème GOF :

- 💿 **Bronze Reserve** (Common) - 10 GOF
- 🥈 **Silver Reserve** (Rare) - 50 GOF  
- 🥇 **Gold Reserve** (Epic) - 100 GOF
- 💎 **Diamond Reserve** (Legendary) - 500 GOF

Chaque NFT est un certificat unique avec :
- Un design SVG unique selon la rareté
- Un numéro de série unique
- Des métadonnées stockées sur IPFS via Pinata
- Une preuve on-chain de votre stake GOF

## 🚀 Configuration

### 1. Créer un compte Pinata

1. Allez sur [https://pinata.cloud](https://pinata.cloud)
2. Créez un compte gratuit
3. Allez dans **API Keys** > **New Key**
4. Cochez les permissions : `pinFileToIPFS` et `pinJSONToIPFS`
5. Donnez un nom à la clé (ex: "GOF NFT Collection")
6. Copiez le **JWT** (vous ne pourrez plus le voir après!)

### 2. Configuration du Gateway Pinata

1. Dans votre dashboard Pinata, allez dans **Gateways**
2. Créez un nouveau gateway ou utilisez celui par défaut
3. Copiez l'URL du gateway (ex: `https://gateway.pinata.cloud`)

### 3. Variables d'environnement

Ajoutez dans `frontend/.env.local` :

```env
# Pinata Configuration
NEXT_PUBLIC_PINATA_JWT=your_jwt_token_here
NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud

# NFT Contract Address (après déploiement)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...
```

### 4. Déployer le contrat NFT

#### Avec Remix IDE (Recommandé pour débutants)

1. Ouvrez [Remix IDE](https://remix.ethereum.org)
2. Créez un nouveau fichier `GoldenReservesNFT.sol`
3. Copiez le contenu de `GoldenReservesNFT.sol`
4. Compilez avec Solidity 0.8.20
5. Déployez sur Sepolia avec les paramètres :
   - `_gofToken`: Adresse de votre contrat GOF (ex: `0x857bd5b87658dc4976a4f515fb78d06192f5e9b5`)
   - `_treasury`: Votre adresse wallet (qui recevra les GOF tokens)
6. Copiez l'adresse du contrat déployé

#### Avec Hardhat/Foundry

```bash
# Si vous utilisez Hardhat
npx hardhat run scripts/deploy-nft.js --network sepolia

# Si vous utilisez Foundry
forge create GoldenReservesNFT --constructor-args <GOF_ADDRESS> <TREASURY_ADDRESS> --private-key <YOUR_PRIVATE_KEY> --rpc-url https://sepolia.infura.io/v3/YOUR_KEY
```

### 5. Mise à jour de la configuration

Mettez à jour `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` dans `.env.local` avec l'adresse du contrat déployé.

## 📝 Utilisation

### Pour les utilisateurs

1. **Connectez votre wallet** avec RainbowKit
2. **Assurez-vous d'avoir des tokens GOF** (mintez-en avec du collateral USDC)
3. **Sélectionnez un tier de NFT** (Bronze, Silver, Gold, ou Diamond)
4. **Cliquez sur "Upload to IPFS"** - Le design du certificat sera uploadé sur IPFS via Pinata
5. **Approuvez les tokens GOF** - Transaction 1 : autoriser le contrat NFT à dépenser vos GOF
6. **Mintez le NFT** - Transaction 2 : payez avec vos GOF et recevez votre certificat NFT

### Workflow technique

```
User Input
    ↓
[1] Upload SVG template to IPFS (Pinata)
    ↓
[2] Create metadata JSON with IPFS image link
    ↓
[3] Upload metadata to IPFS (Pinata)
    ↓
[4] Approve GOF tokens to NFT contract
    ↓
[5] Call mintWithGOF(tokenURI, rarity)
    ↓
Contract transfers GOF to treasury
    ↓
Contract mints NFT with IPFS metadata
    ↓
NFT appears in user's wallet!
```

## 🎨 Templates SVG

Les templates SVG sont stockés dans `frontend/public/nft-templates/` :

- `bronze-reserve.svg` - Bronze avec dégradé cuivre
- `silver-reserve.svg` - Silver avec effet brillant
- `gold-reserve.svg` - Gold avec effet glow
- `diamond-reserve.svg` - Diamond avec effet lumineux et étoiles

Chaque template est dynamiquement modifié pour inclure :
- Le numéro de série unique (#0001, #0002, etc.)
- Les couleurs selon la rareté
- Le montant de GOF staké

## 🔒 Sécurité

### Smart Contract

- ✅ Utilise OpenZeppelin pour ERC721 et Ownable
- ✅ Vérifie le solde GOF avant le mint
- ✅ Vérifie l'allowance avant le transfert
- ✅ Transfert des GOF vers le treasury (pas stockés dans le contrat)
- ✅ Events émis pour chaque mint

### Frontend

- ✅ Validation côté client avant les transactions
- ✅ Affichage des erreurs utilisateur-friendly
- ✅ Confirmation des transactions avec Etherscan links
- ✅ JWT Pinata sécurisé dans .env.local (jamais commité)

## 📊 Structure des métadonnées NFT

```json
{
  "name": "Gold Reserve #42",
  "description": "High-tier reserve certificate - Stake: 100 GOF",
  "image": "ipfs://QmX...",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Gold Reserve"
    },
    {
      "trait_type": "Stake Value",
      "value": "100 GOF"
    },
    {
      "trait_type": "Owner",
      "value": "0x..."
    },
    {
      "trait_type": "Certificate Number",
      "value": "42"
    },
    {
      "trait_type": "Minted",
      "value": "2025-11-05"
    }
  ]
}
```

## 🎯 Fonctionnalités du contrat

### Fonctions publiques

- `mintWithGOF(string tokenURI, Rarity rarity)` - Mint un NFT en payant avec GOF
- `getPriceForRarity(Rarity rarity)` - Obtenir le prix d'un tier
- `tokensOfOwner(address owner)` - Liste des NFTs d'un utilisateur
- `totalSupply()` - Nombre total de NFTs mintés

### Fonctions owner only

- `freeMint(address to, string tokenURI, Rarity rarity)` - Mint gratuit pour tests
- `setTreasury(address newTreasury)` - Changer l'adresse du treasury

### Events

- `NFTMinted(address minter, uint256 tokenId, Rarity rarity, string tokenURI, uint256 pricePaid)`
- `TreasuryUpdated(address oldTreasury, address newTreasury)`

## 🌐 Intégration Web3

Le frontend utilise :
- **Wagmi** pour les interactions blockchain
- **RainbowKit** pour la connexion wallet
- **Pinata SDK** pour l'upload IPFS
- **Ethers.js** pour le parsing des unités

## 💡 Améliorations futures possibles

1. **Staking de NFTs** - Gagner des rewards en stakant vos certificats
2. **Boost de mint GOF** - Réduction de fees si vous possédez certains NFTs
3. **Rareté dynamique** - Prix qui augmente avec le nombre de mints
4. **Metadata on-chain** - Stocker certaines infos directement dans le contrat
5. **Transferts** - Marketplace pour échanger les certificats
6. **Upgrades** - Fusionner plusieurs Bronze pour créer un Silver

## 📞 Support

- Smart Contract: `GoldenReservesNFT.sol`
- Frontend Component: `frontend/components/NFTCollection.tsx`
- ABI & Types: `frontend/components/nftAbi.ts`

## 🎉 Félicitations !

Vous avez maintenant une collection NFT complète et cohérente avec votre stablecoin GOF ! Les utilisateurs peuvent :
- Staker leurs GOF pour obtenir des certificats NFT
- Afficher leur collection dans leur wallet
- Voir leurs NFTs sur OpenSea/Rarible (une fois déployé sur mainnet)
- Prouver leur engagement dans l'écosystème GOF

---

**Built with** 💎 **Ethereum**, **IPFS**, **Pinata**, **Next.js**, **Wagmi**, **RainbowKit**
