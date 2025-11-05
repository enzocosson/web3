# 🐛 Checklist de débogage - Transaction ne passe pas

## Vous avez 20 USDC mais la TX ne passe pas ?

Suivez cette checklist dans l'ordre :

### ✅ Étape 1 : Ouvrir le panneau de débogage

1. Sur la page web, cliquez sur **"🔍 Debug Information"** en haut
2. Vérifiez CHAQUE ligne et notez les problèmes

### 🔴 Problèmes fréquents et solutions

#### Problème 1 : Network Match = ❌ WRONG NETWORK!

**Symptôme :**
```
Wallet Network: ethereum (1)  ← Mauvais !
Expected Network: Sepolia (11155111)
Network Match: ❌ WRONG NETWORK!
```

**Solution :**
1. Ouvrez MetaMask
2. Cliquez sur le sélecteur de réseau (en haut)
3. Sélectionnez **"Sepolia test network"**
4. Rechargez la page

---

#### Problème 2 : Has Contract Code = ❌ No

**Symptôme :**
```
Has Contract Code: ❌ No
```

**Causes possibles :**
- Vous êtes sur le mauvais réseau
- L'adresse du contrat est incorrecte
- Le contrat n'est pas déployé

**Solution :**
1. Vérifiez que vous êtes sur Sepolia
2. Vérifiez l'adresse du contrat dans `.env.local`
3. Vérifiez sur Etherscan que le contrat existe : https://sepolia.etherscan.io/address/VOTRE_ADRESSE

---

#### Problème 3 : Collateral Token = undefined ou mauvaise adresse

**Symptôme :**
```
Collateral Token: undefined
```

**Cause :** Le contrat n'est pas lisible (mauvais réseau ou mauvaise adresse)

**Solution :**
1. Vérifiez le réseau
2. Vérifiez l'adresse du contrat

---

#### Problème 4 : USDC Balance = 0 (mais vous dites avoir 20 USDC)

**Symptôme :**
```
USDC Balance: 0 USDC
```

**Causes possibles :**
- Vous avez de l'USDC sur un AUTRE réseau (pas Sepolia)
- Vous regardez une autre adresse
- Le token USDC n'est pas le bon

**Vérifications :**

1. **Vérifiez dans MetaMask :**
   - Êtes-vous sur Sepolia ?
   - Est-ce la bonne adresse de wallet ?
   - Avez-vous ajouté le token USDC à MetaMask ?

2. **Vérifiez sur Etherscan :**
   ```
   https://sepolia.etherscan.io/address/VOTRE_ADRESSE_WALLET
   ```
   - Regardez la section "Token Holdings"
   - Voyez-vous vos 20 USDC ?
   - Notez l'adresse du contrat USDC

3. **Comparez l'adresse USDC :**
   - Dans le debug panel : `Collateral Token: 0xABC...`
   - Sur Etherscan : L'adresse de votre USDC
   - **Sont-elles identiques ?**

---

#### Problème 5 : La transaction est rejetée par le wallet

**Symptôme :**
- Le bouton passe à "Processing..."
- MetaMask ne s'ouvre PAS
- Ou MetaMask s'ouvre puis se ferme immédiatement
- Le hash apparaît mais n'existe pas sur Etherscan

**Solution :**

1. **Ouvrez la console du navigateur (F12)**
   - Allez dans l'onglet "Console"
   - Cliquez sur le bouton "Approve" ou "Mint"
   - Regardez les messages en rouge

2. **Messages d'erreur typiques :**

   ```
   Error: User rejected the request
   ```
   → Vous avez cliqué sur "Rejeter" dans MetaMask

   ```
   Error: insufficient funds for gas
   ```
   → Vous n'avez pas assez d'ETH pour les frais de gas

   ```
   Error: execution reverted
   ```
   → La transaction smart contract a échoué
   → Regardez le message détaillé

   ```
   ChainMismatchError
   ```
   → Mauvais réseau

---

### 📋 Checklist complète

Cochez chaque point :

- [ ] Je suis connecté à MetaMask
- [ ] Mon adresse wallet est correcte
- [ ] Je suis sur le réseau Sepolia (chainId 11155111)
- [ ] Le panneau debug montre "Network Match: ✅ Correct"
- [ ] Le panneau debug montre "Has Contract Code: ✅ Yes"
- [ ] Mon USDC Balance montre 20 USDC (ou plus)
- [ ] L'adresse du Collateral Token correspond à mon USDC sur Etherscan
- [ ] J'ai au moins 0.01 ETH pour les frais de gas
- [ ] J'ai entré un montant (ex: 0.001)
- [ ] Required Collateral est calculé et <= à mon USDC balance
- [ ] La console (F12) ne montre pas d'erreur en rouge

---

### 🎯 Test complet étape par étape

1. **Ouvrir la console (F12)**

2. **Entrer un PETIT montant : `0.001`**
   - Vérifiez "Required Collateral"
   - Devrait être ~2.4 USDC

3. **Cliquer sur "1. Approve Collateral"**
   - Regardez la console
   - Devrait afficher :
     ```
     === APPROVE DEBUG ===
     Collateral balance: 20 USDC
     Required collateral: 2.4 USDC
     ...
     Calling writeContract for approval...
     ```

4. **MetaMask doit s'ouvrir**
   - Si MetaMask ne s'ouvre pas → Problème avec le wallet/connexion
   - Si MetaMask s'ouvre → Vérifiez les détails de la transaction

5. **Dans MetaMask, vérifiez :**
   - Type de transaction : "Approve"
   - Spender : Votre adresse de contrat GOF
   - Amount : Le montant requis
   - Network : Sepolia
   - Estimated gas fee : Devrait être < 0.01 ETH

6. **Cliquez sur "Confirmer"**

7. **Attendez 5-30 secondes**
   - La console devrait afficher :
     ```
     ✅ Approval writeContract SUCCESS!
     Transaction hash: 0x...
     ```

8. **Vérifiez sur Etherscan**
   - Cliquez sur "View on Etherscan"
   - La transaction DOIT apparaître
   - Statut : Pending → Success

9. **Répétez pour "2. Mint with collateral"**

---

### 🆘 Si ça ne fonctionne TOUJOURS pas

**Copiez et envoyez-moi :**

1. **Toutes les informations du panneau debug** (capture d'écran)

2. **Tous les logs de la console** après avoir cliqué sur le bouton :
   - Ouvrez la console (F12)
   - Videz la console (icône 🚫)
   - Cliquez sur le bouton
   - Copiez TOUT le texte de la console

3. **L'adresse de votre wallet Sepolia**

4. **Le hash de transaction** (s'il y en a un)

5. **Capture d'écran de MetaMask** montrant :
   - Votre réseau actuel
   - Votre balance ETH
   - Vos tokens (si USDC est visible)

---

### 💡 Causes les plus probables (par ordre de fréquence)

1. **Mauvais réseau** (90% des cas)
   → Vous n'êtes pas sur Sepolia

2. **USDC sur un autre réseau**
   → Vos 20 USDC sont sur Mainnet ou un autre testnet

3. **Mauvaise adresse de contrat**
   → Le contrat dans `.env.local` n'existe pas sur Sepolia

4. **Pas assez d'ETH pour les frais**
   → Besoin de 0.01-0.05 ETH

5. **Adresse USDC différente**
   → Le contrat attend un USDC différent de celui que vous avez
