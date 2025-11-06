# 🪙 Token 3D avec React Three Fiber

## 📁 Fichiers générés

- **`TokenGof.tsx`** - Composant 3D généré automatiquement à partir du fichier GLB
- **`TokenGofViewer.tsx`** - Composant wrapper avec Canvas et contrôles
- **`TokenGof.module.scss`** - Styles pour la scène 3D
- **`public/models/tokenGof-transformed.glb`** - Modèle 3D optimisé (84% de réduction de taille)

## 🚀 Utilisation

### Dans n'importe quelle page ou composant :

```tsx
import TokenGofViewer from '@/components/TokenGofViewer'

export default function MyPage() {
  return (
    <div>
      <TokenGofViewer />
    </div>
  )
}
```

### Exemple d'utilisation dans `app/page.tsx` :

```tsx
import TokenGofViewer from '@/components/TokenGofViewer'

export default function Home() {
  return (
    <main>
      <TokenGofViewer />
    </main>
  )
}
```

## 🎨 Personnalisation

### Modifier la taille du modèle :

```tsx
<Model scale={2} position={[0, 0, 0]} />
```

### Modifier les lumières :

```tsx
<ambientLight intensity={0.8} /> {/* Plus de lumière ambiante */}
<spotLight position={[5, 5, 5]} intensity={2} /> {/* Plus intense */}
```

### Modifier la rotation automatique :

```tsx
<OrbitControls 
  autoRotate
  autoRotateSpeed={4} // Plus rapide
/>
```

### Modifier l'environnement :

```tsx
<Environment preset="city" /> 
{/* Autres options: "sunset", "dawn", "night", "warehouse", "forest", "apartment", "studio", "city", "park", "lobby" */}
```

## 📦 Dépendances installées

- `@react-three/fiber` - Renderer React pour Three.js
- `@react-three/drei` - Helpers et composants utiles
- `three` - Bibliothèque 3D
- `gltfjsx` (dev) - Outil de conversion GLB → JSX

## 🔧 Commandes utiles

### Convertir un autre fichier GLB :

```bash
npx gltfjsx public/models/votremodele.glb --output components/VotreModele.tsx --typescript --transform
```

### Options de conversion :

- `--typescript` : Génère du TypeScript
- `--transform` : Optimise et réduit la taille du fichier
- `--shadows` : Ajoute le support des ombres
- `--meta` : Ajoute les métadonnées

## 💡 Astuces

1. **Performance** : Le fichier a été réduit de 68.35KB à 10.82KB (84%)
2. **Chargement** : Utilisez `Suspense` pour un chargement progressif
3. **Préchargement** : Le modèle est préchargé avec `useGLTF.preload()`
4. **Responsive** : Le canvas s'adapte automatiquement à la taille de l'écran

## 📝 License

Le modèle 3D original :
- **Auteur** : Snowism
- **License** : CC-BY-4.0
- **Source** : [Sketchfab](https://sketchfab.com/3d-models/skechfab-token-c3945295fe5b412f944187b6f2ad9aac)
