# Deployment Guide — GSS Zenica Inventar

Stack: React (Vite) + Spring Boot 4 + PostgreSQL 16, fully containerised with Docker Compose.
Target: single Ubuntu VM (Hetzner or equivalent).

---

## Architecture

```
Internet → VM :80 / :443
               └─ nginx container   (serves React SPA, proxies /api/ → app:8080)
                      └─ app container   (Spring Boot on :8080, internal only)
                             └─ postgres container   (PostgreSQL 16, internal only)
```

Two named Docker volumes persist data on the VM's local disk:

| Volume | Contents |
|---|---|
| `postgres-data` | PostgreSQL database (inventory items, orders, members) |
| `uploads-data` | Uploaded inventory item images (mounted at `/app/uploads` in the app container) |

Both volumes are defined in `docker-compose.prod.yml`. They survive container restarts and
`make down`, but are destroyed by `docker compose down -v` — do not use `-v` in production.

All three services are defined in `docker-compose.prod.yml`. Only Nginx is publicly reachable.

---

## 1. Prerequisites on the VM

```bash
sudo apt update && sudo apt upgrade -y

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker          # or reconnect SSH

# Git
sudo apt install git -y
```

Open firewall ports:

| Port | Purpose            |
|------|--------------------|
| 22   | SSH                |
| 80   | HTTP (Nginx)       |
| 443  | HTTPS (Certbot)    |

Do **not** expose 5432 or 8080 publicly.

---

## 2. Clone the Repository

```bash
git clone <your-repo-url>
cd gss-inventory
```

---

## 3. Create the Environment File

```bash
cp .env.example .env
nano .env
```

Set strong, matching passwords in both PostgreSQL and Spring variables:

```dotenv
POSTGRES_DB=gss_inventory
POSTGRES_USER=gss_inventory
POSTGRES_PASSWORD=replace_with_strong_password

SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/gss_inventory
SPRING_DATASOURCE_USERNAME=gss_inventory
SPRING_DATASOURCE_PASSWORD=replace_with_strong_password

HTTP_PORT=80
PUBLIC_DOMAIN=gss-inventory.yourdomain.com
```

Rules:
- `POSTGRES_PASSWORD` and `SPRING_DATASOURCE_PASSWORD` must be identical.
- `SPRING_DATASOURCE_URL` must use the Compose service name `postgres`, not `localhost`.
- `.env` is gitignored — never commit it.

---

## 4. Build and Start the Stack

```bash
make build   # builds backend and frontend Docker images
make up      # starts postgres → app → nginx in dependency order
make ps      # verify all three containers are healthy
```

Expected output of `make ps`:

```
NAME                       STATUS
gss-inventory-postgres     Up (healthy)
gss-inventory-app          Up (healthy)
gss-inventory-nginx        Up
```

Nginx waits for the app healthcheck (`/actuator/health`) before starting.
The app waits for postgres to be ready (`pg_isready`).
Allow up to ~90 seconds on first boot for Spring Boot to initialise.

Check backend logs if the app container is slow to become healthy:

```bash
make logs
```

---

## 5. Verify the Stack

```bash
# From the VM, hit the API through the nginx proxy:
curl http://localhost/api/inventory

# Hit Spring Boot actuator directly (internal port, only reachable on the VM):
curl http://localhost:8080/actuator/health
```

At this point the app is accessible over HTTP on the VM's public IP.

---

## 6. Optional: HTTPS with Certbot

Point your domain's A record at the VM's IP first.

Install Certbot and the standalone plugin:

```bash
sudo apt install certbot -y
```

Stop Nginx temporarily (so Certbot can bind port 80 for the ACME challenge):

```bash
make down
sudo certbot certonly --standalone -d your.actual.domain
make up
```

> **Note:** `$PUBLIC_DOMAIN` is defined in `.env` but is not automatically exported to your shell.
> Replace `your.actual.domain` with the value you set for `PUBLIC_DOMAIN` in `.env`,
> or export it first and use `sudo -E`:
> ```bash
> export $(grep PUBLIC_DOMAIN .env | xargs)
> sudo -E certbot certonly --standalone -d $PUBLIC_DOMAIN
> ```

The certificates are written to `/etc/letsencrypt/live/$PUBLIC_DOMAIN/`.

This repository already templates the Nginx config from the `PUBLIC_DOMAIN`
value in `.env` at container startup, and `docker-compose.prod.yml` mounts
`/etc/letsencrypt` into the Nginx container read-only. Before certificates
exist, Nginx serves plain HTTP on port 80. Once Certbot has created
`/etc/letsencrypt/live/$PUBLIC_DOMAIN/fullchain.pem` and `privkey.pem`, the same
container automatically switches to HTTPS on the next restart. Version control
the Nginx and Compose changes, but never commit `.env` or the certificate files
themselves.

After Certbot succeeds, rebuild and restart the stack:

```bash
make restart
```

Verify HTTPS through the public domain:

```bash
curl https://$PUBLIC_DOMAIN/api/inventory
```

If you test locally on the VM before DNS is fully in place, expect certificate
validation to fail unless the hostname matches. In that case use the public
domain once DNS has propagated.

Certbot auto-renew:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 7. Updating the Application

```bash
make deploy
```

This is equivalent to:

```bash
git pull
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

To rebuild only the app and nginx containers without touching postgres:

```bash
make restart
```

### Optional: GitHub Actions CD to the server

This repository includes [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which:

- runs backend tests with Maven,
- runs frontend tests and production build,
- deploys to the Hetzner VM over SSH after both jobs pass.

The workflow triggers automatically on pushes to `master` and can also be started manually from the GitHub Actions tab.

#### One-time server setup

On the VM, clone the repository into its long-lived deploy directory and complete the manual deployment steps above first:

```bash
git clone <your-repo-url> /opt/gss-inventory
cd /opt/gss-inventory
cp .env.example .env
nano .env
make up
```

The workflow assumes:

- the repository already exists on the server,
- `.env` is already present in that directory,
- Docker and Docker Compose are installed,
- the SSH user can run `git` and `docker compose` in the deploy directory.

If Docker requires `sudo` for that user, add the user to the `docker` group before using the workflow.

#### Create a deploy SSH key

Generate a dedicated keypair locally:

```bash
ssh-keygen -t ed25519 -C "github-actions-gss-inventory" -f ./gss-inventory-gha
```

Add the public key to the deploy user's `~/.ssh/authorized_keys` on the Hetzner VM.

Capture the host key for strict host checking:

```bash
ssh-keyscan -H your.server.ip.or.domain
```

If your SSH server runs on a non-default port, include it:

```bash
ssh-keyscan -H -p 2222 your.server.ip.or.domain
```

If `ssh-keyscan` on your local machine is incompatible with the server, you can read the public host key directly on the server instead:

```bash
cat /etc/ssh/ssh_host_ed25519_key.pub
```

That prints a line like:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...
```

The workflow accepts either:

- a full `known_hosts` entry from `ssh-keyscan`, or
- the bare public host key from `ssh_host_ed25519_key.pub`.

When you use a custom SSH port, the workflow automatically writes the correct `[host]:port` prefix for the `known_hosts` file.

#### Required GitHub secrets

Add these repository or environment secrets in GitHub:

| Secret | Example | Purpose |
|--------|---------|---------|
| `DEPLOY_HOST` | `203.0.113.10` | Server hostname or IP |
| `DEPLOY_PORT` | `22` | SSH port |
| `DEPLOY_USER` | `deploy` | SSH username on the VM |
| `DEPLOY_APP_DIR` | `/opt/gss-inventory` | Absolute path to the cloned repo on the VM; `~/gss-inventory` also works |
| `DEPLOY_SSH_KEY` | private key contents | Private key generated for GitHub Actions |
| `DEPLOY_KNOWN_HOSTS` | `server ssh-ed25519 AAAA...` or `ssh-ed25519 AAAA...` | Full `known_hosts` line or bare public host key |

Recommended:

- store them in a GitHub Environment named `production`,
- require manual approval for that environment if you want a release gate,
- keep the server `.env` file only on the VM, never in GitHub secrets unless you intentionally want the workflow to rewrite it.

#### What the workflow runs remotely

After SSHing into the VM, the deploy job runs the equivalent of:

```bash
cd /opt/gss-inventory
git fetch origin master
git checkout master
git pull --ff-only origin master
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

That keeps the deployment path aligned with the manual procedure in this guide instead of introducing a separate release mechanism.

---

## 8. Backups

### Database

```bash
make backup          # writes backup.sql to the project root
```

Restore:

```bash
docker exec -i gss-inventory-postgres psql \
  -U "$POSTGRES_USER" "$POSTGRES_DB" < backup.sql
```

### Uploaded images

Inventory item images are stored in the `uploads-data` Docker volume (mounted at `/app/uploads`
inside the app container). Back it up separately with:

```bash
docker run --rm \
  -v gss-inventory_uploads-data:/data \
  -v "$(pwd)":/backup \
  alpine tar czf /backup/uploads-backup.tar.gz -C /data .
```

Restore:

```bash
docker run --rm \
  -v gss-inventory_uploads-data:/data \
  -v "$(pwd)":/backup \
  alpine tar xzf /backup/uploads-backup.tar.gz -C /data
```

> **Warning:** `docker compose down -v` destroys both `postgres-data` and `uploads-data`
> permanently. Never use `-v` in production unless you intend to wipe all data.

---

## 9. Useful Commands

| Command        | Effect                                        |
|----------------|-----------------------------------------------|
| `make build`   | Build both Docker images                      |
| `make up`      | Start the full production stack (detached)    |
| `make down`    | Stop and remove containers (data is preserved)|
| `make restart` | Rebuild app + nginx; leave postgres running   |
| `make deploy`  | `git pull` then rebuild the full stack        |
| `make logs`    | Tail all container logs                       |
| `make ps`      | Show container status                         |
| `make backup`  | Dump database to `backup.sql`                 |

---

## 10. Security Checklist

- [ ] Strong, unique password in `.env` (not the example value)
- [ ] `.env` not committed to git
- [ ] Port 5432 not exposed publicly
- [ ] Port 8080 not exposed publicly
- [ ] VM packages kept up to date (`apt upgrade`)
- [ ] HTTPS enabled for any public-facing demo

---

## 11. Notes

- `spring.jpa.hibernate.ddl-auto=update` is set in `application.properties`. This is fine for a demo. Replace with Flyway or Liquibase migrations for a production-grade setup.
- The data seeder runs on first boot and seeds 9 real GSS Zenica warehouse items (from the official inventory sheet) and 2 members. It is idempotent — re-deploying will not duplicate data.
- The seeder is skipped during backend tests (`@Profile("!test")`).
