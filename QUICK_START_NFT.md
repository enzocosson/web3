# 🚀 Guide de Déploiement Rapide - Golden Reserves NFT

## Prérequis

- ✅ Avoir déployé le contrat GOF sur Sepolia
- ✅ Avoir des tokens GOF dans votre wallet
- ✅ Avoir un compte Pinata (gratuit)
- ✅ Wallet MetaMask configuré sur Sepolia

## Étape 1 : Configuration Pinata (5 min)

1. Allez sur https://pinata.cloud et créez un compte gratuit
2. Dans le dashboard, allez à **API Keys** → **New Key**
3. Permissions à activer :
   - ✅ `pinFileToIPFS`
   - ✅ `pinJSONToIPFS`
4. Nommez la clé "GOF NFT Collection"
5. **COPIEZ LE JWT** (vous ne pourrez plus le voir !)
6. Sauvegardez-le dans un endroit sûr

## Étape 2 : Déploiement du Smart Contract (10 min)

### Option A : Avec Remix (Recommandé)

1. Ouvrez https://remix.ethereum.org
2. Créez un nouveau fichier `GoldenReservesNFT.sol`
3. Copiez le code depuis `GoldenReservesNFT.sol`
4. Cliquez sur l'icône **Compiler** (à gauche)
5. Sélectionnez compiler version `0.8.20`
6. Cliquez **Compile GoldenReservesNFT.sol**
7. Allez dans l'onglet **Deploy & Run Transactions**
8. Sélectionnez :
   - Environment: **Injected Provider - MetaMask**
   - Account: Votre wallet
   - Contract: **GoldenReservesNFT**
9. Dans les paramètres du constructeur :
   ```
   _gofToken: 0x857bd5b87658dc4976a4f515fb78d06192f5e9b5
   _treasury: VOTRE_ADRESSE_WALLET
   ```
10. Cliquez **Deploy**
11. Confirmez dans MetaMask
12. **COPIEZ L'ADRESSE DU CONTRAT DEPLOYÉ** (elle apparaît en bas)

### Option B : Vérification sur Etherscan (Optionnel mais recommandé)

1. Allez sur https://sepolia.etherscan.io
2. Cherchez votre adresse de contrat
3. Attendez quelques blocs
4. Vous devriez voir le contrat avec le code

## Étape 3 : Configuration Frontend (3 min)

1. Dans `frontend/`, copiez `.env.local.example` vers `.env.local`:
   ```bash
   cd frontend
   copy .env.local.example .env.local
   ```

2. Éditez `.env.local` et remplissez :
   ```env
   NEXT_PUBLIC_PINATA_JWT=votre_jwt_pinata_ici
   NEXT_PUBLIC_PINATA_GATEWAY=https://gateway.pinata.cloud
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x857bd5b87658dc4976a4f515fb78d06192f5e9b5
   NEXT_PUBLIC_COLLAT_TOKEN_ADDRESS=0x1c7d4b196cb0c7b01d743fbc6116a902379c7238
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=adresse_de_votre_contrat_nft
   ```

3. Sauvegardez le fichier

## Étape 4 : Test de l'application (5 min)

1. Redémarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez http://localhost:3000

3. **Testez la connexion Pinata** :
   - Sélectionnez un tier (ex: Bronze Reserve)
   - Cliquez "Upload to IPFS"
   - ✅ Vous devriez voir "Uploaded to IPFS"

4. **Testez le mint** :
   - Cliquez "Approve GOF" (transaction 1)
   - Attendez la confirmation
   - Cliquez "Mint NFT" (transaction 2)
   - Attendez la confirmation
   - ✅ Vous avez votre premier NFT !

## Étape 5 : Vérification du NFT (2 min)

### Dans MetaMask

1. Ouvrez MetaMask
2. Allez dans l'onglet **NFTs**
3. Cliquez "Import NFT"
4. Entrez :
   - Address: `votre_adresse_contrat_nft`
   - Token ID: `0` (pour le premier NFT)
5. Le NFT devrait apparaître !

### Sur Etherscan

1. Allez sur https://sepolia.etherscan.io/address/VOTRE_WALLET
2. Onglet **ERC-721 Tokens Txns**
3. Vous devriez voir votre transaction de mint

## 🎯 Checklist de Vérification

- [ ] Compte Pinata créé avec JWT
- [ ] Contrat NFT déployé sur Sepolia
- [ ] Adresse du contrat copiée
- [ ] `.env.local` configuré avec tous les paramètres
- [ ] Application redémarrée
- [ ] Upload IPFS fonctionne
- [ ] Approval GOF réussie
- [ ] Mint NFT réussi
- [ ] NFT visible dans MetaMask

## 🐛 Troubleshooting

### "Failed to upload to IPFS"
- Vérifiez que `NEXT_PUBLIC_PINATA_JWT` est correct
- Vérifiez que le JWT a les bonnes permissions
- Redémarrez le serveur dev après modification `.env.local`

### "Insufficient GOF balance"
- Mintez des tokens GOF d'abord dans la section "Contract Actions"
- Vous avez besoin de 10 GOF minimum pour un Bronze Reserve

### "GOF allowance too low"
- Cliquez d'abord sur "1️⃣ Approve GOF"
- Attendez la confirmation de la transaction
- Puis cliquez sur "2️⃣ Mint NFT"

### "Contract not configured"
- Vérifiez que `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` est rempli
- Vérifiez que l'adresse commence par `0x` et fait 42 caractères
- Redémarrez le serveur dev

### NFT ne s'affiche pas dans MetaMask
- Attendez quelques minutes (propagation blockchain)
- Essayez "Import NFT" manuellement
- Vérifiez sur Etherscan que la transaction est confirmée

## 📊 Coûts estimés (Sepolia testnet)

- Déploiement du contrat NFT: ~0.01 ETH Sepolia
- Approval GOF: ~0.0005 ETH Sepolia
- Mint NFT: ~0.002 ETH Sepolia
- Upload IPFS (Pinata): GRATUIT (jusqu'à 1GB)

**Total pour tester:** ~0.0125 ETH Sepolia (gratuit via faucet)

## 🎉 Prochaines étapes

1. Mintez différents tiers (Bronze, Silver, Gold, Diamond)
2. Vérifiez que les designs SVG sont corrects
3. Partagez vos NFTs sur les réseaux sociaux
4. Explorez les métadonnées sur IPFS
5. (Optionnel) Déployez sur Polygon/Arbitrum pour des frais plus bas

## 💡 Conseils Pro

- **Testez d'abord avec Bronze** (10 GOF) avant de mint des tiers supérieurs
- **Gardez votre JWT Pinata secret** - ne le commitez jamais sur Git
- **Vérifiez toujours les transactions** sur Etherscan avant de confirmer
- **Le treasury** peut être votre wallet personnel ou un multi-sig pour plus de sécurité

---

**Besoin d'aide ?** Consultez `NFT_COLLECTION_README.md` pour plus de détails techniques.
