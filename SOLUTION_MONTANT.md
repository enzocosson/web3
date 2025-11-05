# Calcul du montant à minter avec 20 USDC

Vous avez : 20 USDC
Requis pour 1 GOF : 4783.14072 USDC

## Solution : Minter moins !

### Calcul :
- Pour 1 GOF → 4783 USDC
- Pour 0.001 GOF → 4.783 USDC ✅ (vous avez assez !)
- Pour 0.004 GOF → 19.13 USDC ✅ (presque tout votre budget)

### Recommandations :

**Option 1 : Test sécurisé**
```
Montant à entrer : 0.001
USDC requis : ~4.78 USDC
```

**Option 2 : Utiliser presque tout**
```
Montant à entrer : 0.004
USDC requis : ~19.13 USDC
```

**Option 3 : Maximum possible**
```
Montant à entrer : 0.00418
USDC requis : ~19.99 USDC (utilise presque tous vos 20 USDC)
```

## ⚠️ Important

Le prix de l'or change constamment via l'oracle Chainlink. Si le prix monte, vous aurez besoin de plus de USDC.

## 🎯 Action immédiate

Dans le champ "Amount (token units)" de votre interface :
1. Effacez le "1"
2. Entrez "0.001"
3. Attendez que "Required collateral" se mette à jour
4. Vous devriez voir : "Required collateral (with fees): ~4.78 USDC"
5. Maintenant vous pouvez cliquer sur "1. Approve Collateral" !
