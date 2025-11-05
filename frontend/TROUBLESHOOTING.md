# Résolution du problème "Transaction Hash not found on Ethereum"

## Problème identifié

Lorsque vous essayiez de mint des tokens GOF, la transaction échouait avec le message "Transaction Hash not found on Ethereum" sur Etherscan.

## Cause

Le contrat `GoldStableChainlink` utilise `transferFrom` dans la fonction `mintWithCollateral` pour transférer le token de collateral (USDC ou autre ERC20) de votre wallet vers le contrat.

```solidity
function mintWithCollateral(uint256 amountGOF) external nonReentrant {
    uint256 requiredCollateral = requiredCollateralForMint(amountGOF);
    uint256 fee = requiredCollateral * mintFeeBps / BPS_DENOM;
    uint256 totalCollateral = requiredCollateral + fee;
    
    // Cette ligne nécessite une approbation préalable !
    require(collateral.transferFrom(msg.sender, address(this), totalCollateral), "collateral transfer failed");
    
    _mint(msg.sender, amountGOF);
    emit Minted(msg.sender, amountGOF, totalCollateral);
}
```

La fonction `transferFrom` ne peut fonctionner que si vous avez **approuvé** le contrat au préalable à dépenser vos tokens de collateral. Sans cette approbation, la transaction échoue lors de la simulation et n'est jamais envoyée sur la blockchain.

## Solution implémentée

J'ai modifié le composant `ContractActions.tsx` pour :

1. **Calculer le collateral requis** (montant de base + frais de 0.5%)
2. **Vérifier l'allowance actuelle** du contrat sur vos tokens de collateral
3. **Afficher un bouton "Approve Collateral"** si l'allowance est insuffisante
4. **Bloquer le bouton "Mint"** tant que l'approbation n'est pas effectuée
5. **Afficher les informations** sur le montant requis et l'allowance actuelle

## Processus de mint en 2 étapes

Maintenant, pour minter des tokens GOF, vous devez :

### Étape 1 : Approuver le collateral
- Cliquez sur le bouton "1. Approve Collateral"
- Confirmez la transaction dans votre wallet (MetaMask)
- Attendez la confirmation sur la blockchain

### Étape 2 : Minter les tokens
- Une fois l'approbation confirmée, le bouton "2. Mint with collateral" devient actif
- Cliquez dessus pour minter vos tokens GOF
- Confirmez la transaction dans votre wallet
- Attendez la confirmation

## Vérifications additionnelles

Assurez-vous également que :

1. **Vous êtes sur le bon réseau** : Sepolia testnet
2. **Vous avez assez de tokens de collateral** (USDC sur Sepolia)
3. **Vous avez assez d'ETH** pour payer les frais de gas
4. **Le contrat est déployé** à l'adresse configurée

## Liens utiles

- Transaction sur Etherscan : Les liens sont maintenant affichés directement dans l'UI
- Faucet Sepolia ETH : https://sepoliafaucet.com/
- Faucet USDC Sepolia : https://faucet.circle.com/

## Notes techniques

Le contrat assume que le token de collateral a 6 décimales (typique pour USDC). Si vous utilisez un autre token, vérifiez sa configuration.
