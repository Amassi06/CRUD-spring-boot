# Docker | Examen final : Conteneuriser une application distribuée

L'objectif de ce TP est de conteneuriser l'application Todolist avec Docker.

Todolist est une application de gestion des tâches utilisant Node.js et PostgreSQL.

1. Créer un réseau Docker appelé `todolist`. Ce réseau devra être de type `bridge`.

    ```shell
    docker network create --driver bridge todolist
    ```

2. Créer un volume Docker appelé `todolist-dbdata`.


    ```shell
    docker volume create todolist-dbdata
    ```

3. Créer et démarrer un conteneur de base de données. Le conteneur devra avoir les caractéristiques suivantes :
    - L'image à utiliser est `postgres:17-alpine` ;
    - Le conteneur devra être connecté au réseau `todolist` ;
    - Il faudra définir les variables d'environnement suivantes dans le conteneur :
        - `POSTGRES_DB=todolist`
        - `POSTGRES_USER=todo-user`
        - `POSTGRES_PASSWORD=todo-secret` ;
    - Le conteneur devra stocker le contenu du répertoire `/var/lib/postgresql/data` dans un volume Docker nommé `todolist-dbdata` ; 
    - Il faut publier le port `5430` du conteneur sur le port `5430` de la machine ;
    - Le conteneur devra s'appeler `todolist-db` ;
    - Le conteneur devra s'exécuter en arrière-plan.

    ```shell
    docker run -d \
        --name todolist-db \
        --network todolist \
        -e POSTGRES_DB=todolist \
        -e POSTGRES_USER=todo-user \
        -e POSTGRES_PASSWORD=todo-secret \
        -v todolist-dbdata:/var/lib/postgresql/data \
        -p 5430:5430 \
        postgres:17-alpine
    ```

4. Écrire un `Dockerfile` permettant de conteneuriser l'application Todolist. Ce `Dockerfile` devra exécuter les instructions suivantes pour construire l'image :
    - L'image de base à utiliser est `node:22-alpine` ;
    - Le code de l'application devra être dans le dossier `/app` du conteneur ;
    - Copier les fichiers `package.json` et `package-lock.json` dans `/app`, et installer les dépendances avec la commande `npm install` ;
    - Définir la variable d'environnement `DATABASE_URL` avec pour valeur par défaut `postgresql://user:password@localhost:5430/db?schema=public` ;
    - Copier le dossier `prisma` dans `/app`, et exécuter la commande `npx prisma generate` ;
    - Copier le reste des fichiers source, et exécuter la commande `npm run build` ;
    - Exposer le port `4173` par défaut ;
    - Copier le fichier `docker-entrypoint.sh` dans `/` ;
    - Définir l'entrypoint de l'image à `/docker-entrypoint.sh`.    

5. Compléter le fichier `docker-entrypoint.sh` afin que celui-ci exécute les commandes suivantes dans l'ordre au démarrage du conteneur :
    - `npx prisma migrate deploy`
    - `npm run seed`
    - `/bin/sh -c "npm run preview"`

6. Construire l'image à l'aide du `Dockerfile` nouvellement créé. L'image devra être taguée avec `<username>/todolist:latest` (Remplacer `<username>` par votre nom d'utilisateur Docker Hub).

    ```shell
    docker build -t massi06/todolist:latest .
    
    ```

7. Créer et démarrer un nouveau conteneur applicatif. Le conteneur devra avoir les caractéristiques suivantes :
    - L'image à utiliser est `<username>/todolist:latest` (Remplacer `<username>` par votre nom d'utilisateur Docker Hub) ;
    - Le conteneur devra être connecté au réseau `todolist` ;
    - Il faudra définir les variables d'environnement suivantes dans le conteneur :
        - `DATABASE_URL=postgresql://todo-user:todo-secret@todolist-db:5430/todolist?schema=public` ;
    - Il faut publier le port `4173` du conteneur sur le port `8123` de la machine ;
    - Le conteneur devra s'appeler `todolist-app` ;
    - Le conteneur devra s'exécuter en arrière-plan.

    ```shell
    docker run -d \
        --name todolist-app \
        --network todolist \
        -e DATABASE_URL=postgresql://todo-user:todo-secret@todolist-db:5432/todolist?schema=public \
        -p 8123:4173 \
        massi06/todolist:latest
    
    ```

8. Vérifier le bon fonctionnement de l'application en écrivant ci-dessous le code secret affiché sur le site.

    ```output
    # FIXME: écrire le code secret ici
    ```

9. Une fois que vous vous êtes assuré.e du bon fonctionnement de l'application, il va falloir l'arrêter.

    Arrêtez le conteneur `todolist-app`.

    ```shell
    docker stop todolist-app
    ```

10. Arrêtez le conteneur `todolist-db`.

    ```shell
    docker stop todolist-db
    ```

11. Supprimez tous les conteneurs non utilisés sur votre machine.

    ```shell
    docker container prune -f
    ```

12. Supprimez le volume `todolist-dbdata`.

    ```shell
    docker volume rm todolist-dbdata
    ```

13. Supprimez le réseau `todolist`.

    ```shell
    docker network rm todolist
    ```

14. ⭐ **Bonus :** Pousser tous les tags de votre image sur votre repository Docker Hub.

    ```shell
    # FIXME: écrire la commande ici
    ```

Bon courage !
# CRUD-spring-boot
