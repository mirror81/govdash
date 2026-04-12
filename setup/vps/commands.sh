#!/usr/bin/env bash
# ==============================================================================
# setup/vps/commands.sh
# Referência rápida — todos os comandos do setup VPS em sequência.
# Execute linha a linha ou adapte conforme necessário.
# ==============================================================================

# ── Variáveis — ajuste antes de executar ──────────────────────────────────────
APP_DIR="/opt/app"
DOMAIN="dash.hfgestaopublica.dev"
CERTBOT_EMAIL="admin@hfgestaopublica.dev"
REPO_URL="vagnerrods/dash"          # ou: https://<token>@github.com/org/repo.git

# ── 1. Atualizar o sistema ────────────────────────────────────────────────────
apt-get update -y && apt-get upgrade -y

# ── 2. Pacotes essenciais ─────────────────────────────────────────────────────
apt-get install -y ca-certificates curl gnupg lsb-release git unzip ufw htop nano

# ── 3. Docker Engine ──────────────────────────────────────────────────────────
apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${VERSION_CODENAME}") stable" \
  | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable docker && systemctl start docker

# ── 4. GitHub CLI (opcional — necessário para repo privado via gh) ─────────────
wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  | tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] \
https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli-stable.list > /dev/null
apt-get update -y && apt-get install -y gh

# ── 5. Login (repositório privado) ────────────────────────────────────────────
gh auth login          # interativo: GitHub.com → HTTPS → browser/token
gh auth setup-git      # configura credential helper para git

# ── 6. Firewall ───────────────────────────────────────────────────────────────
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (Nginx / Certbot)
ufw allow 443/tcp   # HTTPS
ufw --force enable

# ── 7. Swap ───────────────────────────────────────────────────────────────────
fallocate -l 2G /swapfile
chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# ── 8. Nginx ──────────────────────────────────────────────────────────────────
apt-get install -y nginx
systemctl enable nginx && systemctl start nginx

# Configurar site como reverse proxy para a aplicação
cat > /etc/nginx/sites-available/dash << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 90;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/dash /etc/nginx/sites-enabled/dash
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ── 9. Certbot ────────────────────────────────────────────────────────────────
apt-get install -y certbot python3-certbot-nginx

# ── 10. Clone do repositório ──────────────────────────────────────────────────
git clone --depth 1 "https://github.com/${REPO_URL}.git" "${APP_DIR}"

# ── 11. Build e start ─────────────────────────────────────────────────────────
cd "${APP_DIR}"
docker compose build   # adicione --no-cache para rebuild limpo
docker compose up -d

# ── 12. Serviço systemd (auto-start no boot) ──────────────────────────────────
cat > /etc/systemd/system/dash-app.service << EOF
[Unit]
Description=Dashboard Municipal — Docker Compose
Requires=docker.service
After=docker.service network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/docker compose up -d --remove-orphans
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=120
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload && systemctl enable dash-app

# ── 13. Certificado SSL (Let's Encrypt) ───────────────────────────────────────
# ⚠ Execute apenas após o DNS do domínio estar apontando para esta VPS
certbot --nginx \
  -d "${DOMAIN}" \
  --email "${CERTBOT_EMAIL}" \
  --agree-tos \
  --redirect \
  --non-interactive

systemctl reload nginx

# Testar renovação automática
certbot renew --dry-run

# ── Testes ────────────────────────────────────────────────────────────────────
curl -I http://localhost:3000          # app direto
curl -I "https://${DOMAIN}"           # via Nginx + HTTPS

# ── Comandos do dia a dia ─────────────────────────────────────────────────────
docker compose logs -f
docker compose restart
docker compose down
docker compose up -d --build
git -C "${APP_DIR}" pull && docker compose -f "${APP_DIR}/docker-compose.yml" up -d --build

nginx -t && systemctl reload nginx    # testar e recarregar Nginx
certbot certificates                  # listar certificados ativos
certbot renew --dry-run               # simular renovação

systemctl status dash-app
systemctl restart dash-app
