# Script PowerShell pour ajouter les variables d'environnement à Vercel
# Exécutez ce script : .\add-vercel-env.ps1

Write-Host "🚀 Ajout des variables d'environnement à Vercel..." -ForegroundColor Green

# Naviguer dans le dossier frontend
Set-Location -Path "D:\dev-web\web3\frontend"

# Variables à ajouter
$envVars = @{
    "NEXT_PUBLIC_PINATA_API_KEY" = "5f29f3573981215fc4fe"
    "NEXT_PUBLIC_PINATA_API_SECRET" = "03f0444827ad5a3ec0e04f558e9ad2572c547a001718fb6c64b2f645ace70f4e"
    "NEXT_PUBLIC_PINATA_JWT" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5NzZhZWExYy1jZGUwLTQ5MGYtYjlkMi1kMTUwZWVmZDg3OTgiLCJlbWFpbCI6ImVuem9sZW1lcmNpZXJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjVmMjlmMzU3Mzk4MTIxNWZjNGZlIiwic2NvcGVkS2V5U2VjcmV0IjoiMDNmMDQ0NDgyN2FkNWEzZWMwZTA0ZjU1OGU5YWQyNTcyYzU0N2EwMDE3MThmYjZjNjRiMmY2NDVhY2U3MGY0ZSIsImV4cCI6MTc5MzkxMzI0NH0.MR0Ugj0Y9IWEbArPgCnKoAbCwIAL6XjgmLO-KXSh-aI"
    "NEXT_PUBLIC_PINATA_GATEWAY" = "https://gateway.pinata.cloud"
    "NEXT_PUBLIC_NFT_CONTRACT_ADDRESS" = "0x1230F65EfFb7518A25aAe9C974aC7890F65B0d1E"
}

Write-Host "`n⚠️  IMPORTANT: Pour chaque variable, vous devrez:" -ForegroundColor Yellow
Write-Host "  1. Coller la valeur quand demandé" -ForegroundColor Yellow
Write-Host "  2. Sélectionner les environnements (Production, Preview, Development)" -ForegroundColor Yellow
Write-Host "`nLes valeurs à copier seront affichées ci-dessous.`n" -ForegroundColor Yellow

foreach ($key in $envVars.Keys) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "📌 Variable: $key" -ForegroundColor Green
    Write-Host "📋 Valeur à copier:" -ForegroundColor Yellow
    Write-Host $envVars[$key] -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
    
    # La commande vercel env add nécessite une interaction manuelle
    # On affiche juste les infos pour que l'utilisateur puisse copier-coller
}

Write-Host "`n✅ Maintenant, exécutez manuellement pour CHAQUE variable:" -ForegroundColor Green
Write-Host "   vercel env add VARIABLE_NAME" -ForegroundColor Cyan
Write-Host "`nOu utilisez le dashboard Vercel (plus simple):" -ForegroundColor Green
Write-Host "   https://vercel.com/dashboard → Votre Projet → Settings → Environment Variables`n" -ForegroundColor Cyan
