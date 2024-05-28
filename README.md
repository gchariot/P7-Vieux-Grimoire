# Mon Vieux Grimoire - Backend

Ce dépôt GitHub contient le backend pour "Mon Vieux Grimoire", une plateforme en ligne dédiée à la référence et la notation de livres pour une chaîne de librairies basée à Lille. Cette application permet aux utilisateurs d'ajouter des livres et de soumettre des notes visibles par tous.

## Prérequis

Assurez-vous que les logiciels suivants sont installés sur votre système avant de continuer :

- Node.js
- npm

## Installation Backend

Suivez ces instructions pour configurer le projet localement :

1. **Clonez ce dépôt** :
   ```bash
   git clone https://github.com/gchariot/P7-Vieux-Grimoire.git
   ```
2. **Naviguez vers le répertoire du projet**
3. **Installez les dépendances :**

```bash
npm install
```

## Configuration de la Base de Données

1. **Créez un fichier .env à la racine du projet**

```bash
JWT_SECRET=RANDOM_TOKEN_SECRET
JWT_EXPIRATION=24h
BCRYPT_SALT_ROUNDS=10
DB_USER=gchariot
DB_PASSWORD=BkVCTVeYl40E0jXh
DB_CLUSTER=cluster0.3e1lccc.mongodb.net
```

2. **Lancer le serveur**

```bash
nodemon server
```

## Configuration du Frontend

1. **Clonez le dépôt frontend :**

```bash
git clone https://github.com/OpenClassrooms-Student-Center/P7-Dev-Web-livres
```

2. **Installez les dépendances :**

```bash
npm install
```

3. **Démarrez le frontend :**

```bash
npm start
```

Le frontend sera alors accessible à l'adresse http://localhost:3000.
