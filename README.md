# GSS Zenica – Inventar i zaduženja

Aplikacija za upravljanje inventarom opreme i zaduženjima ("zaduživanjima") za
Gorsku službu spašavanja Zenica (GSS Zenica). Omogućava potpuno vođenje
inventara spasilačke opreme (CRUD), evidenciju članova i kreiranje zaduženja
opreme s rokom za povrat. Prilikom kreiranja zaduženja oprema se automatski
oduzima sa stanja, a mobilno prilagođena kontrolna tabla prikazuje sva aktivna i
istekla zaduženja.

The project is a full-stack application built with React, Spring Boot, and PostgreSQL.

The repository is structured as a small monorepo:

- `frontend/`: React 19 + Vite UI (na bosanskom jeziku)
- `backend/`: Spring Boot 4 API
- `docker-compose.yml`: local PostgreSQL for development
- `docker-compose.prod.yml`: production stack with PostgreSQL, app, and Nginx
- `Makefile`: common local and production commands

## Funkcionalnosti

- **Inventar** (`/inventar`): potpuni CRUD nad opremom (karabineri, koloture,
  spuštalice, užad, lavinska oprema, medicinska oprema itd.) s praćenjem ukupne i
  dostupne količine.
- **Članovi** (`/clanovi`): registar članova službe kojima se dodjeljuju zaduženja.
- **Zaduženja** (`/zaduzenja`): kreiranje zaduženja za određenog člana s više
  stavki opreme i rokom za povrat. Oprema se pri kreiranju oduzima sa stanja, a
  pri povratu vraća na stanje.
- **Kontrolna tabla**: mobilno prilagođen pregled svih zaduženja s isticanjem
  aktivnih, zaduženja kojima rok uskoro ističe i onih kojima je rok već istekao.

## Stack

- Frontend: React, TypeScript, Vite, Vitest
- Backend: Spring Boot 4, Java 17, Maven, JPA
- Database: PostgreSQL 16
- Production runtime: Docker Compose + Nginx

## Prerequisites

For local development you will typically want:

- Java 17
- Node.js 22
- Docker Desktop or Docker Engine

## Local Development

### 1. Start the database

From the repository root:

```bash
make db
```

This starts the local PostgreSQL container from `docker-compose.yml`.

Default local database settings:

- database: `gss_inventory`
- user: `gss_inventory`
- password: `gss_inventory`
- port: `5432`

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

On first start the backend seeds a realistic GSS equipment catalogue, members,
and example orders (including overdue ones).

### 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` requests to the backend on `localhost:8080`.

## Tests

### Backend tests

```bash
cd backend
./mvnw test
```

### Frontend tests

```bash
cd frontend
npm ci
npm test
```

### Frontend production build

```bash
cd frontend
npm run build
```

## Helpful Commands

From the repository root:

```bash
make help
make db
make build
make up
make down
make restart
make deploy
make logs
make ps
make backup
```

## Environment

For production, copy `.env.example` to `.env` and set real values:

```bash
cp .env.example .env
```

Important rules:

- `POSTGRES_PASSWORD` and `SPRING_DATASOURCE_PASSWORD` must match
- `SPRING_DATASOURCE_URL` must use `postgres` as the host inside Docker Compose

## Deployment

Production deployment uses Docker Compose with three services:

- `postgres`
- `app`
- `nginx`

Short version:

1. Prepare a VM with Docker and Git.
2. Clone this repository on the server, usually into `/opt/gss-zenica`.
3. Create a server-side `.env` from `.env.example`.
4. Build and start the stack with:

```bash
make build
make up
```

5. Verify the stack:

```bash
make ps
curl http://localhost/api/inventory
```

6. For updates:

```bash
make deploy
```

## Notes

- Production Nginx configuration is selected automatically depending on whether Let's Encrypt certificates exist for `PUBLIC_DOMAIN`.
- The backend health endpoint is `/actuator/health`.
- PostgreSQL and the Spring datasource passwords must stay in sync.
