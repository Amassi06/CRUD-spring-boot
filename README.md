# CRUD Spring Boot + React

Application complète avec :
- **Backend** Spring Boot (CRUD `User`) + PostgreSQL
- **Frontend** React + Tailwind CSS

## Structure

```text
backend/   # API Spring Boot
frontend/  # UI React + Tailwind
```

## Backend (Spring Boot)

### Configuration PostgreSQL
Le backend utilise ces variables d'environnement (avec valeurs par défaut) :

- `DB_URL` (défaut: `jdbc:postgresql://localhost:5432/crud_db`)
- `DB_USERNAME` (défaut: `postgres`)
- `DB_PASSWORD` (défaut: `postgres`)

Fichier : `backend/src/main/resources/application.properties`

### Lancer l'API

```bash
cd backend
mvn spring-boot:run
```

API CRUD disponible sur `http://localhost:8080/api/users` :
- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

### Tests unitaires (Spring Boot uniquement)

```bash
cd backend
mvn test
```

## Frontend (React + Tailwind)

### Lancer le frontend

```bash
cd frontend
npm install
npm run dev
```

Par défaut, le frontend consomme `http://localhost:8080/api/users`.
Vous pouvez changer l'URL via `VITE_API_URL`.

### Build frontend

```bash
cd frontend
npm run build
```
