.PHONY: help db dev-back dev-front build up down restart deploy logs ps test backup

COMPOSE_PROD := docker compose -f docker-compose.prod.yml --env-file .env

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ── Local development ──────────────────────────────────────────────────────────

db: ## Start local PostgreSQL only
	docker compose up -d

dev-back: ## Run the Spring Boot backend (requires db)
	cd backend && ./mvnw spring-boot:run

dev-front: ## Run the Vite dev server (proxies /api → localhost:8080)
	cd frontend && npm run dev

# ── Production ─────────────────────────────────────────────────────────────────

build: ## Build production Docker images
	$(COMPOSE_PROD) build

up: ## Start the production stack (detached)
	$(COMPOSE_PROD) up -d

down: ## Stop the production stack
	$(COMPOSE_PROD) down

restart: ## Rebuild and recreate app + nginx without touching postgres
	$(COMPOSE_PROD) up -d --build --force-recreate app nginx

deploy: ## Pull latest code and restart the production stack (use on VM)
	git pull
	$(COMPOSE_PROD) up -d --build

logs: ## Tail all production logs (Ctrl-C to exit)
	$(COMPOSE_PROD) logs -f

ps: ## Show production container status
	$(COMPOSE_PROD) ps

# ── Utilities ──────────────────────────────────────────────────────────────────

test: ## Run backend tests
	cd backend && ./mvnw test

backup: ## Dump the production database to ./backup.sql
	docker exec gss-inventory-postgres pg_dump \
	  -U "$${POSTGRES_USER:-gss_inventory}" \
	  "$${POSTGRES_DB:-gss_inventory}" > backup.sql
	@echo "Backup written to backup.sql"
