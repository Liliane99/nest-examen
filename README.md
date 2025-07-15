# Watchlist 


## Fonctionnalités

### Authentification et Sécurité
- **Inscription** avec validation par email
- **Authentification à 2 facteurs** avec code envoyé par email
- **JWT** pour l'authentification
- **Gestion de rôles** (USER/ADMIN)
- **Endpoints publics et privés**

### Gestion des Films
- **Ajouter des films** à sa watchlist
- **Marquer comme vu** avec date
- **Accès limité** : chaque utilisateur ne voit que ses films
- **Accès admin** : les admins peuvent voir tous les films et tous les utilisateurs


## Installation

**Installé l'application**
- Allumé le docker compose (db + mailer)
- Allumer Nestjs
- Allumer prisma pour une visualisation de la bdd
- Excuter les seeds
- Aler sur `http://localhost:3000/api` pour accèder à Swagger et tester les routes du backend.

## Aide : 

**Créer un utilisateur admin**
```bash
npm run create-admin
```

**Démarrer l'application**
```bash
npm run start:dev
```

**Exécuté les seed :**
```bash
npm run seed-data
```



