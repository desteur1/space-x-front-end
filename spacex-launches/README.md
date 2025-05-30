# Vue 3 + TypeScript + Vite

# SpaceX Launches

Une application Vue 3 affichant les lancements de SpaceX, avec filtrage, compte à rebours et affichage responsive grâce à Tailwind CSS.

## Fonctionnalités

- Liste des lancements SpaceX avec filtre (tous, réussis, échoués)
- Affichage du prochain lancement avec compte à rebours
- Responsive design (mobile, tablette, desktop)
- UI moderne avec Tailwind CSS

## Installation

```bash
git clone https://github.com/<ton-utilisateur>/spacex-launches.git
cd spacex-launches
npm install
```

## Lancer le projet en développement

npm run dev

## Déploiement

### Construction du projet

- Pour générer les fichiers de production :

```bash
npm run build
- Les fichiers optimisés seront dans le dossier dist/

  Netlify :

Connecte ton dépôt à Netlify.
Publish directory : dist
```

## Déploiement manuel

Tu peux aussi héberger le contenu du dossier `dist/` sur n’importe quel hébergeur statique (FTP, GitHub Pages, etc.).

## Contraintes

- Utilise Vue 3, Vite et Tailwind CSS (v4+)
