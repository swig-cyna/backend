# Backend 📦

## Setup 🔩

1. Installer les packages

   ```bash
   pnpm install && pnpm run prepare
   ```

2. Crée votre .env

   Copier le fichier .env.example et renommer-le en .env

3. Démarrer les containeurs

   ```bash
   docker-compose up -d
   ```

4. Migrer la base de données

   ```bash
   pnpm kysely migrate:latest
   ```

5. Seeder la base de données

   ```bash
   pnpm kysely seed:run
   ```

6. Créez le bucket dans MinIO

   Rendez-vous sur [http://localhost:9001/access-keys](http://localhost:9001/access-keys) et connectez-vous avec les identifiants configurés dans le fichier `.env`.

   En haut à droite, cliquez sur `+ Create access key`, puis laissez les paramètres par défaut et cliquez sur `Create`.

   Une fois l'accès créé, copiez et collez l'`Access Key` ainsi que la `Secret Key` dans le fichier `.env`.

   Pour créer le bucket, lancez le script avec la commande suivante :

   ```bash
    pnpm run s3:create
   ```

7. Configurer umami
   Rendez-vous sur [http://localhost:3002/login](http://localhost:3000/login) et connectez-vous avec les identifiants par defaults.

   - Username: `admin`
   - Password: `umami`

   Aller dans `Settings` dans la bar de navigation et cliquer sur `Add website`

   Donné lui un nom et l'url du frontend

   Une fois ajouté cliquer sur la ligne du site que vous venez d'ajouter et cliquer sur le bouton `Edit` puis aller dans `Tracking Code` et copié coller le `website id` qu'il y a dans `data-website-id`

   Puis mettez le dans la variable d'environnement `UMAMI_WEBSITE_ID` dans le fichier `.env` du frontend

8. Lancer le serveur en dev

   ```bash
   pnpm run dev
   ```

## Commits 🚀

Utiliser les commandes de git et non pas les buttons dans VSCode

- Pour ajouter les fichiers modifiés, vous devez utiliser la commande
  ```bash
  git add .
  ```
- Pour commiter les changements, vous devez utiliser la commande
  ```bash
  git commit -m "<type>(scope): <description>"
  ```

Pour commit les changements, vous devez respecter les conventions suivantes:

- Commits de type `feat` pour les nouvelles fonctionnalités
- Commits de type `fix` pour les corrections de bugs
- Commits de type `chore` pour les changements d'infrastructure
- Commits de type `docs` pour les modifications de documentation
- Commits de type `style` pour les modifications de style
- Commits de type `refactor` pour les modifications de code sans changement de comportement

Exemples de commits:

- `fix(cart): bug fix in cart`
- `feat(users): added user management`
- `docs(readme): updated README.md`

- `chore(deps): updated dependencies`

## Migration de base de données 📚

- Crée une nouvelle migration
  ```bash
  pnpm kysely migrate:make <name>
  ```
- Faire la logique de migration

- Migrer la base de données
  ```bash
  pnpm kysely migrate:up
  ```
- Changer les types de `Database` dans le fichier `src/db/types.ts` en fonction des changement de votre migration

### Extra

- Annuler la migration (si besoin)

  ```bash
  pnpm kysely migrate:down
  ```

- Faire toute les migrations de base de données

  ```bash
  pnpm kysely migrate:latest
  ```

- Annuler toute les migrations de base de données
  ```bash
  pnpm kysely migrate:rollback
  ```

## Seed de base de données 🌱

- Crée une nouvelle seed
  ```bash
  pnpm kysely seed:make <name>
  ```
- Faire la logique de seed

- Seed la base de données
  ```bash
  pnpm kysely seed:
  ```
