# ✅ Checklist Déploiement NFT Collection

## Configuration Pinata - ✅ TERMINÉ

```bash
✅ NEXT_PUBLIC_PINATA_JWT configuré
✅ NEXT_PUBLIC_PINATA_GATEWAY configuré  
✅ Package pinata-web3 installé
```

---

## 🚀 Prochaine étape : Déployer le contrat NFT

### Informations nécessaires pour le déploiement :

**Paramètres du constructeur :**
```
_gofToken: 0x3F5ce890E5f3723e9C484A9cDF2E58dF8eA1feA2
_treasury: VOTRE_ADRESSE_WALLET
```

💡 **_treasury** = l'adresse qui recevra les tokens GOF des ventes de NFT

---

## 📋 Déploiement avec Remix (5 minutes)

### 1. Ouvrir Remix
→ https://remix.ethereum.org

### 2. Créer le fichier
- Nouveau fichier : `GoldenReservesNFT.sol`
- Copier le contenu depuis : `d:\dev-web\web3\GoldenReservesNFT.sol`

### 3. Compiler
- Version Solidity : **0.8.20**
- Cliquer "Compile"

### 4. Déployer sur Sepolia
- Environment : **Injected Provider - MetaMask**
- Réseau MetaMask : **Sepolia**
- Contract : **GoldenReservesNFT**
- Paramètres :
  ```
  _GOFTOKEN: 0x3F5ce890E5f3723e9C484A9cDF2E58dF8eA1feA2
  _TREASURY: [VOTRE ADRESSE ICI]
  ```
- Cliquer **Deploy** → Confirmer dans MetaMask

### 5. Copier l'adresse du contrat
Une fois déployé, copier l'adresse affichée (ex: `0x1234...`)

### 6. Mettre à jour .env.local
```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xADRESSE_COPIEE
```

### 7. Redémarrer le serveur
```bash
# Dans le terminal frontend
npm run dev
```

---

## 🎨 Test de la collection

### Workflow complet :

1. **Connecter le wallet** (RainbowKit)

2. **Avoir des GOF tokens** 
   - Si vous n'en avez pas, mintez-en avec la section "Contract Actions"
   - Minimum 0.001 GOF pour un Bronze Reserve (~$5)
   - Avec 10 USDC, vous pouvez mint ~2 GOF, assez pour tous les tiers !

3. **Sélectionner un tier** dans la section "Golden Reserves NFT Collection"
   - Bronze (0.001 GOF ≈ $5) 💿
   - Silver (0.005 GOF ≈ $24) 🥈
   - Gold (0.01 GOF ≈ $48) 🥇
   - Diamond (0.02 GOF ≈ $96) 💎

4. **Upload to IPFS** 
   - Cliquer le bouton
   - Attendre ~3 secondes
   - ✅ "Uploaded to IPFS" apparaît

5. **Approve GOF** (Transaction 1)
   - Cliquer "1️⃣ Approve GOF"
   - Confirmer dans MetaMask
   - Attendre confirmation (~15 sec)

6. **Mint NFT** (Transaction 2)
   - Cliquer "2️⃣ Mint NFT"
   - Confirmer dans MetaMask
   - Attendre confirmation (~15 sec)

7. **✅ NFT Minté !**
   - Vérifier dans MetaMask > NFTs
   - Vérifier sur Etherscan
   - Le NFT apparaît dans "Your Collection"

---

## 📁 Fichiers créés

### Smart Contract
- ✅ `GoldenReservesNFT.sol` - Contrat ERC721 complet

### Frontend
- ✅ `frontend/components/NFTCollection.tsx` - Interface de mint
- ✅ `frontend/components/nftAbi.ts` - ABI et types
- ✅ `frontend/app/page.tsx` - Intégration page principale

### Assets
- ✅ `frontend/public/nft-templates/bronze-reserve.svg`
- ✅ `frontend/public/nft-templates/silver-reserve.svg`
- ✅ `frontend/public/nft-templates/gold-reserve.svg`
- ✅ `frontend/public/nft-templates/diamond-reserve.svg`

### Documentation
- ✅ `NFT_COLLECTION_README.md` - Documentation complète
- ✅ `QUICK_START_NFT.md` - Guide de déploiement
- ✅ `frontend/.env.local.example` - Template config

---

## 🎯 État actuel

```
✅ Concept défini (Golden Reserves)
✅ Smart contract créé
✅ Frontend développé
✅ Designs SVG créés (4 tiers)
✅ Pinata configuré
✅ Package installé
⏳ Contrat à déployer → PROCHAINE ÉTAPE
⏳ Test du mint → APRÈS DÉPLOIEMENT
```

---

## 🔗 Liens utiles

- **Remix IDE** : https://remix.ethereum.org
- **Votre contrat GOF** : https://sepolia.etherscan.io/address/0x3F5ce890E5f3723e9C484A9cDF2E58dF8eA1feA2
- **Sepolia Faucet** : https://sepoliafaucet.com
- **Pinata Dashboard** : https://app.pinata.cloud

---

## ❓ Questions fréquentes

### Quelle adresse mettre pour _treasury ?
→ Votre adresse wallet personnelle (celle qui connecte à l'app). C'est là que les GOF payés pour les mints iront.

### Puis-je changer le treasury après ?
→ Oui ! Le contrat a une fonction `setTreasury()` (owner only)

### Les prix des NFT sont-ils fixes ?
→ Oui, définis dans le contrat (très accessibles !) :
- Bronze : 0.001 GOF (~$5)
- Silver : 0.005 GOF (~$24)
- Gold : 0.01 GOF (~$48)
- Diamond : 0.02 GOF (~$96)

💡 Avec seulement 10 USDC, vous pouvez mint ~2 GOF et tester tous les tiers !

### Les designs NFT peuvent-ils changer ?
→ Les SVG locaux oui (ils sont juste des previews). Mais une fois minté, le NFT sur IPFS est permanent.

### Combien coûte le déploiement ?
→ ~0.01 ETH Sepolia (gratuit via faucet)

---

**Prêt pour le déploiement ! 🚀**

Une fois le contrat déployé et l'adresse ajoutée dans `.env.local`, tout fonctionnera automatiquement.
