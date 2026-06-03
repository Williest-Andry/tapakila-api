# Tapakila API

REST API backend de la plateforme Tapakila - gestion d'événements avec réservation de billets, authentification JWT et contrôle d'accès par rôles.

> Projet académique de groupe (2025- [ancien Tapakila](https://github.com/Williest-Andry/Tapakila.git)) entièrement refactorisé en solo. Cette version constitue une réécriture complète : nouvelle architecture, nouveau contrat OpenAPI, nouvelle base de données.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Langage | TypeScript |
| Base de données | PostgreSQL |
| Authentification | JWT (access token + refresh token) |
| Contrat API | OpenAPI 3 (YAML) |
| Validation | Zod |

---

## Architecture - Modular Layered architecture

```
.
├── doc/
│   └── api.yaml            # Contrat OpenAPI 3
├── prisma/
│   ├── migrations/         # Historique des migrations
│   └── schema.prisma       # Schéma de la base de données
├── src/
│   ├── common/             # Utilitaires partagés
│   ├── config/             # Variables d'environnement, configuration
│   ├── database/           # Client Prisma, connexion DB
│   ├── docs/               # Configuration Swagger UI
│   ├── generated/          # Code généré (types Prisma)
│   ├── middlewares/        # Auth JWT, gestion des erreurs, validation
│   ├── modules/            # Domaines métier (auth, user, events, bookings...)
│   ├── types/              # Types TypeScript globaux
│   ├── utils/              # Fonctions utilitaires
│   ├── server.ts           # Configuration Express
│   └── index.ts            # Point d'entrée
└── prisma.config.ts
```

---

## Fonctionnalités

- **Authentification JWT** avec access token court-lived et refresh token
- **Contrôle d'accès par rôles** : Admin, Organisateur, Utilisateur
- **Gestion des événements** : création, modification, filtrage par catégorie / lieu / date / prix
- **Réservation de billets** : types multiples (VIP, Standard, Early Bird), gestion des stocks
- **Contrat OpenAPI 3** complet, utilisé pour générer les types TypeScript côté frontend

---

## Lancer le projet en local

### Prérequis

- Node.js 18+
- PostgreSQL 14+

### Installation

```bash
git clone https://github.com/Williest-Andry/tapakila-api.git
cd tapakila-api
npm install
```

### Configuration

Crée un fichier `.env` à la racine :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/tapakila
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
PORT=3000
```

### Démarrage

```bash
# Développement
npm run dev

# Production
npm run build && npm start
```

L'API est disponible sur `http://localhost:3000`

---

## Endpoints principaux

| Méthode | Route | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Création de compte | Non |
| POST | `/auth/login` | Connexion | Non |
| POST | `/auth/refresh` | Rafraîchissement du token | Non |
| GET | `/events` | Liste des événements avec filtres | Non |
| GET | `/events/:id` | Détail d'un événement | Non |
| POST | `/events` | Créer un événement | Organisateur |
| POST | `/bookings` | Réserver des billets | Utilisateur |
| GET | `/bookings/me` | Mes réservations | Utilisateur |

---

## Auteur

**Williest ANDRY NY AINA**
[GitHub](https://github.com/Williest-Andry) · [LinkedIn](https://www.linkedin.com/in/williest-andry)
