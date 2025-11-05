# Guide de configuration - Testnet Sepolia

## ⚠️ Problème : "Transaction Hash not found on Ethereum"

Si vous voyez cette erreur, cela signifie généralement que :

1. **Vous n'avez pas de tokens de collateral (USDC)** sur Sepolia
2. Vous n'êtes pas sur le bon réseau
3. Vous n'avez pas assez d'ETH pour payer les frais de gas

## 📋 Checklist avant de minter

### 1. Vérifier votre réseau
- Ouvrez MetaMask
- Assurez-vous d'être sur **Sepolia Test Network**
- L'UI devrait afficher : `Wallet network: sepolia (chainId 11155111)`

### 2. Obtenir de l'ETH Sepolia (pour les frais de gas)

**Option 1 : Alchemy Faucet (Recommandé)**
1. Allez sur https://sepoliafaucet.com/
2. Connectez-vous avec votre compte (Google, GitHub, etc.)
3. Entrez votre adresse wallet
4. Recevez 0.5 ETH de test

**Option 2 : Infura Faucet**
1. Allez sur https://www.infura.io/faucet/sepolia
2. Créez un compte Infura gratuit
3. Demandez de l'ETH de test

**Option 3 : QuickNode Faucet**
1. Allez sur https://faucet.quicknode.com/ethereum/sepolia
2. Entrez votre adresse
3. Recevez de l'ETH de test

### 3. Obtenir de l'USDC Sepolia (pour le collateral)

**⭐ Circle Testnet Faucet (Recommandé)**
1. Allez sur https://faucet.circle.com/
2. Sélectionnez **"Ethereum Sepolia"**
3. Collez votre adresse wallet
4. Cliquez sur "Get test tokens"
5. Vous recevrez 10,000 USDC de test

**Alternative : Chainlink Faucet**
1. Allez sur https://faucets.chain.link/sepolia
2. Connectez votre wallet
3. Demandez USDC (et d'autres tokens)

### 4. Vérifier vos balances

Une fois que vous avez reçu les tokens, l'interface devrait afficher :

```
GOF Balance: 0
Collateral Balance: 10000 USDC
```

Si vous voyez `0 USDC` avec un avertissement rouge, vous devez obtenir des tokens USDC !

## 🔄 Processus de mint complet

### Étape 1 : Entrer le montant
- Entrez le montant de tokens GOF que vous voulez minter (ex: `1`)
- L'UI calcule automatiquement le collateral requis
- Exemple : pour minter 1 GOF, vous aurez besoin d'environ 2400 USDC (basé sur le prix de l'or + ratio de 120% + frais)

### Étape 2 : Approuver le collateral
- Cliquez sur "1. Approve Collateral"
- MetaMask s'ouvre : **Confirmez** la transaction
- Attendez la confirmation (5-20 secondes)
- ✅ Un lien Etherscan apparaît pour suivre la transaction

### Étape 3 : Minter les tokens
- Le bouton "2. Mint with collateral" devient actif
- Cliquez dessus
- MetaMask s'ouvre : **Confirmez** la transaction
- Attendez la confirmation
- ✅ Vos tokens GOF apparaissent dans votre balance

## 🔍 Diagnostic des problèmes

### Le hash de transaction n'apparaît pas sur Etherscan

**Causes possibles :**

1. **Transaction rejetée par MetaMask**
   - Vérifiez que vous avez cliqué sur "Confirmer" et non "Rejeter"

2. **Pas assez d'ETH pour les frais de gas**
   - Solution : Obtenez plus d'ETH depuis un faucet

3. **Pas assez de USDC**
   - Solution : Obtenez USDC depuis https://faucet.circle.com/

4. **Mauvais réseau**
   - Vérifiez que MetaMask est sur Sepolia (chainId 11155111)
   - Changez de réseau si nécessaire

5. **Nonce error (transaction en attente)**
   - Dans MetaMask : Settings → Advanced → Clear activity tab data
   - Ou attendez que la transaction en attente se confirme

### La transaction est "pending" indéfiniment

1. Dans MetaMask, cliquez sur la transaction en attente
2. Cliquez sur "Speed up" pour augmenter les frais de gas
3. Ou cliquez sur "Cancel" pour l'annuler

### L'approbation fonctionne mais le mint échoue

1. Vérifiez que vous avez **assez d'USDC** pour le montant requis affiché
2. Vérifiez que l'approbation s'est bien confirmée (lien Etherscan vert)
3. Attendez quelques secondes après l'approbation avant de minter

## 📊 Informations techniques

### Adresses de contrats sur Sepolia

Vérifiez dans l'UI les adresses suivantes :

- **GOF Contract** : L'adresse de votre contrat GoldStableChainlink
- **Collateral Token** : L'adresse du token USDC sur Sepolia

Les adresses typiques sur Sepolia :
- USDC : `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` (Circle)
- USDC : `0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8` (alternative)

### Calcul du collateral requis

Pour minter X tokens GOF :
1. Prix de l'or actuel (via Chainlink oracle) × X
2. Multiplié par 120% (ratio de collatéralisation)
3. Plus 0.5% de frais de mint

Exemple pour 1 GOF quand l'or est à ~$2000/oz :
- Base : 2000 USDC
- Ratio 120% : 2400 USDC
- Frais 0.5% : 12 USDC
- **Total : 2412 USDC**

## 🆘 Support

Si vous rencontrez toujours des problèmes :

1. Ouvrez la console du navigateur (F12)
2. Regardez les logs détaillés
3. Copiez les messages d'erreur
4. Vérifiez le hash de transaction sur Etherscan pour voir l'erreur exacte

## 🔗 Liens utiles

- **Sepolia Etherscan** : https://sepolia.etherscan.io/
- **Circle USDC Faucet** : https://faucet.circle.com/
- **Sepolia ETH Faucet** : https://sepoliafaucet.com/
- **Chainlink Faucets** : https://faucets.chain.link/sepolia
- **MetaMask Support** : https://support.metamask.io/
