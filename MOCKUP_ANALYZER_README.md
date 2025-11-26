# 🎨 Analyseur de Mockup - Guide d'utilisation

## 📋 Description

L'analyseur de mockup est un outil web qui permet d'analyser des images de design (mockups), d'extraire automatiquement les couleurs et la typographie, et de générer du code HTML/CSS pixel-perfect.

## 🚀 Utilisation

### Accès à l'outil

1. Démarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez votre navigateur et accédez à :
   ```
   http://localhost:5173/mockup-analyzer.html
   ```
   (Remplacez le port selon votre configuration)

### Étapes d'analyse

1. **Uploader le mockup**
   - Cliquez sur la zone de téléchargement
   - Sélectionnez votre fichier image (PNG, JPG, JPEG, SVG)
   - L'image sera affichée dans l'aperçu

2. **Analyse automatique**
   - L'outil analyse automatiquement l'image
   - Extraction des couleurs dominantes
   - Détection de la typographie
   - Génération du code HTML/CSS

3. **Résultats**
   - **Palette de couleurs** : Les 12 couleurs les plus fréquentes extraites
   - **Typographie** : Styles de texte détectés
   - **Code généré** : HTML/CSS prêt à l'emploi

## 🎯 Fonctionnalités

### Extraction de couleurs

- Analyse de tous les pixels de l'image
- Regroupement des couleurs similaires
- Génération d'une palette optimisée
- Codes hexadécimaux copiables

### Analyse de typographie

- Détection des tailles de police
- Identification des poids de police
- Calcul des hauteurs de ligne
- Suggestions de polices

### Génération de code

- Code HTML/CSS pixel-perfect
- Variables CSS pour les couleurs
- Classes typographiques réutilisables
- Structure responsive

## 💡 Utilisation avancée

### Copier les couleurs

1. Cliquez sur une couleur pour copier son code hex
2. Ou cliquez sur "Copier les couleurs" pour copier toute la palette

### Copier la typographie

1. Cliquez sur "Copier la typographie" pour copier tous les styles

### Télécharger le code

1. Cliquez sur "Télécharger" pour sauvegarder le fichier HTML généré

## 🔧 Intégration avec Tailwind CSS

Le code généré peut être facilement intégré dans votre projet Tailwind :

### 1. Ajouter les couleurs dans `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'mockup-1': '#votre-couleur-1',
        'mockup-2': '#votre-couleur-2',
        // ... autres couleurs
      }
    }
  }
}
```

### 2. Ajouter les styles typographiques dans `index.css`

```css
@layer base {
  .heading-1 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
  }
  
  .heading-2 {
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.3;
  }
  
  /* ... autres styles */
}
```

## 📊 Format des données extraites

### Couleurs

Format : `#RRGGBB`
- Exemple : `#6c2bd9`
- 12 couleurs principales extraites

### Typographie

Format JSON :
```json
{
  "name": "Heading 1",
  "fontSize": "2.5rem",
  "fontWeight": "700",
  "lineHeight": "1.2",
  "fontFamily": "Poppins, sans-serif",
  "color": "#212529"
}
```

## 🎨 Exemple d'utilisation

### Scénario : Analyser un mockup de page d'accueil

1. **Préparer le mockup**
   - Exportez votre design en PNG ou JPG
   - Résolution recommandée : 1920x1080px minimum

2. **Uploader et analyser**
   - Ouvrez l'analyseur
   - Uploader votre mockup
   - Attendez l'analyse (quelques secondes)

3. **Extraire les éléments**
   - Copiez la palette de couleurs
   - Copiez les styles typographiques
   - Téléchargez le code généré

4. **Intégrer dans votre projet**
   - Ajoutez les couleurs dans Tailwind
   - Créez les composants avec les styles extraits
   - Ajustez si nécessaire

## ⚠️ Limitations

### Extraction de couleurs

- L'outil analyse un échantillon de pixels (tous les 100 pixels)
- Les couleurs très similaires sont regroupées
- Les couleurs transparentes sont ignorées

### Typographie

- La détection de typographie est basée sur des estimations
- Pour une précision maximale, utilisez des outils OCR spécialisés
- Les polices personnalisées doivent être identifiées manuellement

### Performance

- Les grandes images (> 5MB) peuvent prendre plus de temps
- Recommandation : optimisez vos images avant l'analyse

## 🔍 Améliorations futures

- [ ] Intégration OCR pour la détection précise de typographie
- [ ] Détection automatique des espacements (marges, paddings)
- [ ] Export vers Figma/Sketch
- [ ] Détection des composants réutilisables
- [ ] Génération de composants React/TypeScript
- [ ] Support des designs responsives (mobile/tablet/desktop)

## 📝 Notes

- L'outil fonctionne entièrement dans le navigateur (pas de serveur requis)
- Les images ne sont pas envoyées à un serveur externe
- Toutes les analyses sont effectuées localement

## 🐛 Dépannage

### L'image ne s'affiche pas
- Vérifiez le format (PNG, JPG, JPEG, SVG uniquement)
- Vérifiez la taille du fichier (< 10MB recommandé)

### L'analyse prend trop de temps
- Réduisez la résolution de l'image
- Utilisez un format optimisé (JPG plutôt que PNG pour les photos)

### Les couleurs ne sont pas précises
- Augmentez la résolution de l'image
- Vérifiez que l'image n'est pas trop compressée

## 📞 Support

Pour toute question ou problème, consultez la documentation du projet ou contactez l'équipe de développement.

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024

