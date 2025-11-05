# 🔴 Problème : Balance affiche 0 mais j'ai des tokens

## Symptôme
Vous avez 1 GOF dans votre wallet (vérifié dans MetaMask ou ailleurs), mais l'interface web affiche **GOF Balance: 0**.

## Causes possibles

### 1. 🔴 Mauvais réseau (TRÈS PROBABLE)
Vos tokens GOF sont sur un réseau différent (ex: mainnet, autre testnet) mais l'interface lit le contrat sur Sepolia.

**Vérification :**
1. Dans MetaMask, quel réseau est sélectionné quand vous voyez vos 1 GOF ?
2. Dans l'interface web, regardez "Wallet Network"
3. Sont-ils identiques ?

**Solution :**
- Si vos GOF sont sur mainnet → Changez MetaMask vers mainnet
- Si vos GOF sont sur Sepolia → Vérifiez que l'interface pointe vers le bon contrat

---

### 2. 🔴 Mauvaise adresse de contrat (TRÈS PROBABLE)
L'interface lit le contrat à l'adresse `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47` mais vos GOF sont dans un autre contrat.

**Vérification :**
1. Cliquez sur "🔍 Debug Information"
2. Notez l'adresse "GOF Contract"
3. Dans MetaMask, cliquez sur vos tokens GOF
4. Regardez "Token Contract Address"
5. **Sont-elles identiques ?**

**Solution si différentes :**
```bash
# Mettez à jour .env.local avec la bonne adresse
NEXT_PUBLIC_CONTRACT_ADDRESS=0xVOTRE_VRAIE_ADRESSE
```

Puis rechargez la page.

---

### 3. 🟡 Cache RPC ou problème de connexion

Le fournisseur RPC ne retourne pas les bonnes données.

**Solution :**
1. Cliquez sur le bouton **🔄 Refresh** à côté de "GOF Balance"
2. Attendez 5 secondes
3. Si toujours 0, passez aux vérifications suivantes

---

### 4. 🟡 Mauvaise adresse de wallet connectée

Vous regardez une adresse différente de celle qui contient les tokens.

**Vérification :**
1. Dans l'interface, regardez "Your Wallet"
2. Cliquez sur "View on Etherscan" à côté
3. Sur Etherscan, regardez "Token Holdings"
4. Voyez-vous vos GOF là ?

**Si non :**
- Vous êtes connecté avec la mauvaise adresse dans MetaMask
- Changez de compte dans MetaMask

---

## 🔍 Diagnostic étape par étape

### Étape 1 : Ouvrir le panneau de debug
Cliquez sur "🔍 Debug Information" et vérifiez :

```
GOF Balance (raw): null  ← Si null = Problème de lecture !
GOF Balance (formatted): 0
```

Si "raw" est `null` → Le contrat ne répond pas ou l'adresse est mauvaise.

---

### Étape 2 : Vérifier sur Etherscan

#### A. Vérifier votre wallet
1. Cliquez sur "View on Etherscan" à côté de "Your Wallet"
2. Regardez la section **"Token Holdings"**
3. Questions :
   - Voyez-vous des tokens GOF listés ?
   - Quelle quantité ?
   - Quelle est l'adresse du contrat GOF ?

#### B. Vérifier le contrat
1. Cliquez sur "View on Etherscan" à côté de "GOF Contract"
2. Vérifiez :
   - Le contrat existe-t-il ? (pas "Address not found")
   - Est-ce un contrat ? (onglet "Contract" visible ?)
   - Quel est le nom du token ? (devrait être "Gold Stable (Chainlink)")

---

### Étape 3 : Vérifier la correspondance

**Cas A : Le contrat Etherscan correspond**
```
Interface montre : 0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
Sur Etherscan, vos GOF sont dans : 0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
→ Même adresse ✅
```

→ Problème de cache RPC. Essayez :
1. Cliquez sur 🔄 Refresh
2. Rechargez la page (F5)
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

**Cas B : Le contrat est différent**
```
Interface montre : 0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
Sur Etherscan, vos GOF sont dans : 0xAUTRE_ADRESSE
→ Adresses différentes ❌
```

→ L'interface pointe vers le mauvais contrat !

**Solution :**
Mettez à jour `.env.local` :
```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xAUTRE_ADRESSE
```

---

### Étape 4 : Vérifier le réseau

Dans le panneau debug :
```
Wallet Network: sepolia (11155111)
Network Match: ✅ Correct
```

Si "Network Match" est rouge ❌ :
→ Changez de réseau dans MetaMask pour correspondre

---

## ✅ Solutions rapides

### Solution 1 : Rafraîchir manuellement
```
1. Cliquez sur 🔄 Refresh à côté de "GOF Balance"
2. Attendez 5 secondes
3. Vérifiez si la balance se met à jour
```

### Solution 2 : Vérifier et corriger l'adresse du contrat
```bash
# Dans d:\dev-web\web3\frontend\.env.local
# Remplacez par la VRAIE adresse de votre contrat GOF
NEXT_PUBLIC_CONTRACT_ADDRESS=0xVOTRE_ADRESSE_REELLE

# Puis rechargez la page
```

### Solution 3 : Vider le cache et recharger
```
1. Ctrl+Shift+Delete (Chrome/Edge)
2. Cochez "Cached images and files"
3. Cliquez "Clear data"
4. Rechargez la page (F5)
```

### Solution 4 : Vérifier que vous êtes sur le bon réseau
```
1. Ouvrez MetaMask
2. Cliquez sur le sélecteur de réseau en haut
3. Sélectionnez "Sepolia test network"
4. Rechargez la page
```

---

## 🎯 Test de validation

Une fois corrigé, vous devriez voir dans le panneau debug :

```
GOF Balance (raw): 1000000000000000000  ← 1 GOF = 10^18 wei
GOF Balance (formatted): 1.0
```

Et dans l'interface :
```
GOF Balance: 1.0 🔄 Refresh
```

---

## 📸 Ce que vous devriez m'envoyer si le problème persiste

1. **Capture d'écran du panneau de debug complet**

2. **URL Etherscan de votre wallet** (avec vos tokens visibles)

3. **Contenu de votre `.env.local` :**
```bash
cat frontend/.env.local
```

4. **Console du navigateur** (F12) après avoir cliqué sur Refresh :
```
Copier tous les logs affichés
```

5. **Dans MetaMask :**
   - Quel réseau est sélectionné ?
   - Quelle adresse est connectée ?
   - Quel est le "Token Contract Address" de vos GOF ?

---

## 💡 Pourquoi ce problème arrive ?

Vous avez probablement déployé plusieurs versions du contrat lors de vos tests, ou vous avez des tokens d'un déploiement précédent. L'interface doit pointer vers le **même contrat** où se trouvent réellement vos tokens.
