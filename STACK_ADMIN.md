# Stack Admin SportHub

Cette documentation décrit la stack réelle de la partie `web_admin` de SportHub, son organisation et son mode de déploiement.

## 1. Vue d'ensemble

La partie admin est le frontend d'administration de SportHub, développé comme une application Next.js séparée du backend Spring Boot.

Elle sert d'interface d'administration pour consulter et gérer les utilisateurs, les terrains, les réservations, les coachs, les paiements et les avis.

Le navigateur ne contacte pas l'API de production directement. Les appels passent par une route locale `/backend`, réécrite côté Next.js vers l'API distante.

## 2. Stack technique

### Frontend principal

- Next.js `16.2.9`
- React `19.2.4`
- TypeScript `5`
- Axios `1.17.0`
- React Hook Form
- Zod
- Tailwind CSS `4`
- shadcn/ui, basé sur Radix UI
- lucide-react
- TanStack React Query
- Recharts

### Intégration backend

- Backend Spring Boot séparé
- Authentification JWT
- Route proxy locale `/backend`

## 3. Architecture du projet

L'application suit l'App Router de Next.js.

- `app/` contient les pages métier et les layouts.
- `components/` contient les blocs réutilisables, y compris la structure admin.
- `services/` contient les appels API et la normalisation des réponses.
- `lib/` contient les utilitaires partagés et la configuration Axios.
- `types/` regroupe les contrats TypeScript du domaine admin.

Les pages principales de l'admin sont structurées autour des domaines métier suivants:

- `dashboard`
- `users`
- `clients`
- `coaches`
- `managers`
- `fields`
- `bookings`
- `coach-sessions`
- `payments`
- `reviews`
- `settings`
- `login`

## 4. Authentification

Le login admin est géré côté front par `services/auth.service.ts`.

- Le formulaire envoie `email` et `motDePasse` vers `POST /api/auth/login`.
- La réponse est normalisée pour récupérer un token et l'utilisateur.
- Le compte est accepté seulement si le rôle retourné est `ADMIN`.
- La session est stockée dans `localStorage` sous `sporthub_admin_token` et `sporthub_admin_user`.
- Les requêtes suivantes ajoutent automatiquement le header `Authorization: Bearer <token>`.
- En cas de `401` ou `403`, la session est purgée et l'utilisateur est renvoyé vers `/login`.

## 5. Couche API

La couche HTTP est centralisée dans `lib/api.ts`.

- `API_BASE_URL` vaut toujours `/backend` dans le navigateur.
- Les requêtes sont ensuite réécrites par Next.js vers le backend réel.

Cette approche évite les appels cross-origin directs depuis le navigateur et limite les problèmes de CORS côté client.

## 6. Déploiement

La partie admin est déployée séparément du backend.

- Frontend hébergé sur Vercel.
- Backend Spring Boot hébergé à part sur `https://api.sporthubsn.com`.
- La rewrite Next.js envoie `/backend/:path*` vers l'URL du backend définie par `BACKEND_API_URL`.

Variable d'environnement utilisée par le serveur Next.js:

- `BACKEND_API_URL=https://api.sporthubsn.com`

`NEXT_PUBLIC_API_URL` n'est plus nécessaire. Sur Vercel, `BACKEND_API_URL`
doit être configurée pour les environnements Production, Preview et
Development, puis un nouveau déploiement doit être lancé.

Après déploiement, cette URL doit répondre avec un statut `200`:

`https://<domaine-vercel>/backend/actuator/health`

## 7. Scripts disponibles

Depuis `web_admin`:

- `npm run dev` pour lancer le front en développement.
- `npm run build` pour produire le build de production.
- `npm run start` pour servir le build.
- `npm run lint` pour lancer ESLint.

## 8. Points importants à retenir

- Le front admin dépend d'un backend déjà déployé et ne doit pas appeler l'API publique directement depuis le navigateur.
- Si le login échoue en production, la cause peut venir soit de la rewrite Vercel, soit des identifiants ou du compte admin côté backend.
- La page `dashboard` charge ses statistiques depuis l'API admin; si le backend ne répond pas, les compteurs restent à zéro.

## 9. Fichiers de référence

- [README.md](README.md)
- [lib/api.ts](lib/api.ts)
- [services/auth.service.ts](services/auth.service.ts)
- [next.config.ts](next.config.ts)
- [.env](.env)
