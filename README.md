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
   pnpm run db:migrate
   ```

5. Seeder la base de données

   ```bash
   pnpm run db:seed
   ```

6. Lancer le serveur en dev

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

- Modifier ou crée un schema dans `/src/db/schemas/...`
- Adapter les seeder en fonction des modifications dans `/src/db/seeds/...`
- Générer la migration avec la commande
  ```bash
  pnpm run db:generate
  ```
- Migrer la base de données avec la commande
  ```bash
  pnpm run db:migrate
  ```

## Autres commandes utiles 👨‍💻

- ### Interface pour la base de données
  ```bash
  pnpm run db:studio
  ```
