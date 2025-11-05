# 🚀 Guide de déploiement Vercel - Gold Stable Chainlink Frontend

## Méthode 1 : Via l'interface web Vercel (RECOMMANDÉ)

### Étape 1 : Pousser le code sur GitHub

1. **Assurez-vous que votre code est sur GitHub** :
   - Si ce n'est pas déjà fait, poussez vos changements :
   ```bash
   cd d:\dev-web\web3
   git add .
   git commit -m "Add improved UI with debug panel and deployment config"
   git push origin main
   ```

### Étape 2 : Connecter à Vercel

1. **Allez sur** : https://vercel.com/
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez sur "Add New Project"**
4. **Importez votre repository** `enzocosson/web3`

### Étape 3 : Configuration du projet

Dans la page de configuration :

**Framework Preset** : Next.js (auto-détecté)

**Root Directory** : Cliquez sur "Edit" et sélectionnez `frontend`

**Build and Output Settings** :
- Build Command : `npm run build` (par défaut)
- Output Directory : `.next` (par défaut)
- Install Command : `npm install` (par défaut)

### Étape 4 : Variables d'environnement

**IMPORTANT** : Ajoutez cette variable d'environnement :

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
```

⚠️ **Remplacez par l'adresse de VOTRE contrat déployé sur Sepolia !**

Pour trouver votre adresse :
1. Ouvrez Remix
2. Allez dans "Deploy & Run Transactions"
3. Regardez "Deployed Contracts"
4. Copiez l'adresse `0x...`

Ou :
1. Dans Rabby Wallet, trouvez vos tokens GOF
2. Regardez "Token Contract Address"

### Étape 5 : Déployer

1. **Cliquez sur "Deploy"**
2. Attendez 1-2 minutes
3. **Votre site est en ligne !** 🎉

---

## Méthode 2 : Via Vercel CLI

### Installation

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Déploiement

```bash
cd d:\dev-web\web3\frontend
vercel
```

Suivez les instructions :
- Set up and deploy? **Y**
- Which scope? **Votre compte**
- Link to existing project? **N**
- What's your project's name? **gold-stable-chainlink**
- In which directory is your code located? **./** (défaut)

### Ajouter les variables d'environnement

```bash
vercel env add NEXT_PUBLIC_CONTRACT_ADDRESS
```

Entrez la valeur : `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47`

Environment: **Production, Preview, Development** (sélectionnez tous)

### Redéployer avec les variables

```bash
vercel --prod
```

---

## Après le déploiement

### URL de votre application

Vous recevrez une URL du type :
```
https://gold-stable-chainlink.vercel.app
```

### Vérifications

1. ✅ **Connectez votre wallet** (Rabby)
2. ✅ **Vérifiez le réseau** : Doit être Sepolia
3. ✅ **Ouvrez le panneau debug** : Network Match doit être ✅
4. ✅ **Vérifiez les balances** : GOF et USDC doivent s'afficher
5. ✅ **Testez un mint** avec 0.001 GOF

### Problèmes courants

#### Variables d'environnement non reconnues

Si `CONTRACT_ADDRESS` n'est pas reconnu :
1. Allez sur vercel.com
2. Sélectionnez votre projet
3. **Settings** → **Environment Variables**
4. Ajoutez `NEXT_PUBLIC_CONTRACT_ADDRESS`
5. **Redéployez** : Settings → Deployments → (dernière) → "..." → Redeploy

#### Erreur de build

Si le build échoue :
- Vérifiez les logs dans Vercel
- Les erreurs TypeScript/ESLint doivent être corrigées

---

## Mettre à jour le déploiement

Chaque fois que vous poussez sur GitHub :
1. **Vercel redéploie automatiquement** (si configuré)
2. Ou manuellement :
   ```bash
   cd d:\dev-web\web3\frontend
   vercel --prod
   ```

---

## Configuration avancée

### Ajouter un domaine custom

1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

### Preview deployments

Chaque branch GitHub peut avoir son propre déploiement :
- `main` → Production
- Autres branches → Preview URLs

---

## Checklist finale

- [ ] Code pushé sur GitHub
- [ ] Projet importé dans Vercel
- [ ] Root Directory = `frontend`
- [ ] Variable `NEXT_PUBLIC_CONTRACT_ADDRESS` ajoutée
- [ ] Déploiement réussi ✅
- [ ] Site accessible via l'URL Vercel
- [ ] Wallet se connecte correctement
- [ ] Debug panel montre "Network Match: ✅"
- [ ] Balances affichées correctement

---

## Support

Si vous rencontrez des problèmes :
1. Consultez les logs de build dans Vercel
2. Vérifiez la console du navigateur (F12)
3. Vérifiez que l'adresse du contrat est correcte
4. Assurez-vous d'être sur Sepolia

---

## URL du projet

Une fois déployé, votre projet sera accessible à :
```
https://[votre-projet].vercel.app
```

Partagez cette URL pour que d'autres puissent utiliser votre dApp ! 🚀
