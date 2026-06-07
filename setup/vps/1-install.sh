#!/usr/bin/env bash
# ==============================================================================
# setup/vps/1-install.sh
# PARTE 1 — Instalação e configuração do ambiente
#
# O que faz:
#   - Atualiza o sistema Ubuntu
#   - Instala Docker Engine + Docker Compose plugin
#   - Instala GitHub CLI (opcional)
#   - Configura firewall UFW (portas 22, 80, 443)
#   - Cria swap de 2 GB
#   - Instala e configura Nginx como reverse proxy
#   - Instala Certbot (Let's Encrypt)
#
# Uso:
#   sudo ./1-install.sh
#   sudo DOMAIN=dash.hfgestaopublica.dev CERTBOT_EMAIL=admin@hfgestaopublica.dev ./1-install.sh
#
# Variáveis opcionais:
#   DOMAIN           domínio do servidor (padrão: dash.hfgestaopublica.dev)
#   CERTBOT_EMAIL    e-mail para registro no Let's Encrypt
#   INSTALL_GH       1 = instala GitHub CLI
# ==============================================================================

set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }
err()  { echo -e "${RED}[✖]${NC} $1"; exit 1; }

[[ $EUID -ne 0 ]] && err "Execute como root: sudo ./1-install.sh"

grep -qi "ubuntu" /etc/os-release 2>/dev/null || warn "Script preparado para Ubuntu. Pode funcionar em outros Debian-based, sem garantia."

# ── Variáveis ─────────────────────────────────────────────────────────────────
DOMAIN="${DOMAIN:-dash.hfgestaopublica.dev}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
INSTALL_GH="${INSTALL_GH:-0}"

echo ""
echo "============================================================"
echo "  VPS — Parte 1: Instalação do ambiente"
echo "============================================================"
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# 1. Atualização do sistema
# ══════════════════════════════════════════════════════════════════════════════
info "Atualizando pacotes do sistema..."
apt-get update -y
apt-get upgrade -y
log "Sistema atualizado."

# ══════════════════════════════════════════════════════════════════════════════
# 2. Pacotes essenciais
# ══════════════════════════════════════════════════════════════════════════════
info "Instalando pacotes essenciais..."
apt-get install -y ca-certificates curl gnupg lsb-release git unzip ufw htop nano
log "Pacotes essenciais instalados."

# ══════════════════════════════════════════════════════════════════════════════
# 3. Docker Engine
# ══════════════════════════════════════════════════════════════════════════════
if command -v docker &>/dev/null; then
  warn "Docker já instalado: $(docker --version)"
else
  info "Instalando Docker Engine..."
  apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${VERSION_CODENAME}") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable docker
  systemctl start docker
  log "Docker instalado: $(docker --version)"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 4. Docker Compose — verificação
# ══════════════════════════════════════════════════════════════════════════════
docker compose version &>/dev/null && log "Docker Compose disponível: $(docker compose version)" || \
  err "Docker Compose plugin não encontrado. Verifique a instalação do Docker."

# ══════════════════════════════════════════════════════════════════════════════
# 5. GitHub CLI (opcional)
# ══════════════════════════════════════════════════════════════════════════════
if [[ "${INSTALL_GH}" == "1" ]]; then
  if command -v gh &>/dev/null; then
    warn "GitHub CLI já instalado: $(gh --version | head -1)"
  else
    info "Instalando GitHub CLI..."
    (type -p wget >/dev/null || apt-get install -y wget)
    mkdir -p -m 755 /etc/apt/keyrings
    wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
      tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
    chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] \
https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli-stable.list > /dev/null
    apt-get update -y
    apt-get install -y gh
    log "GitHub CLI instalado: $(gh --version | head -1)"
  fi
else
  info "GitHub CLI ignorado (INSTALL_GH=1 para habilitar)."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 6. Firewall (UFW)
# ══════════════════════════════════════════════════════════════════════════════
info "Configurando firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp  comment "SSH"
ufw allow 80/tcp  comment "HTTP (Nginx / Certbot)"
ufw allow 443/tcp comment "HTTPS"
ufw --force enable
log "Firewall configurado (22/SSH, 80/HTTP, 443/HTTPS)."

# ══════════════════════════════════════════════════════════════════════════════
# 7. Swap
# ══════════════════════════════════════════════════════════════════════════════
if swapon --show | grep -q "/swapfile"; then
  warn "Swap já configurado."
else
  info "Criando 2 GB de swap..."
  if fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none; then
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    grep -q '^/swapfile[[:space:]]' /etc/fstab 2>/dev/null || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "Swap de 2 GB criado e ativado."
  else
    warn "Não foi possível criar /swapfile. Continuando sem swap extra."
  fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# 8. Nginx
# ══════════════════════════════════════════════════════════════════════════════
if command -v nginx &>/dev/null; then
  warn "Nginx já instalado: $(nginx -v 2>&1)"
else
  info "Instalando Nginx..."
  apt-get install -y nginx
  systemctl enable nginx
  systemctl start nginx
  log "Nginx instalado: $(nginx -v 2>&1)"
fi

info "Configurando site Nginx para ${DOMAIN}..."
NGINX_CONF="/etc/nginx/sites-available/mirante-painel"

cat > "${NGINX_CONF}" << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Necessário para o Certbot (ACME challenge)
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

# Ativa o site e desativa o default
ln -sf "${NGINX_CONF}" /etc/nginx/sites-enabled/mirante-painel
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
log "Nginx configurado e recarregado para ${DOMAIN}."

# ══════════════════════════════════════════════════════════════════════════════
# 9. Certbot (Let's Encrypt)
# ══════════════════════════════════════════════════════════════════════════════
if command -v certbot &>/dev/null; then
  warn "Certbot já instalado: $(certbot --version 2>&1)"
else
  info "Instalando Certbot + plugin Nginx..."
  apt-get install -y certbot python3-certbot-nginx
  log "Certbot instalado: $(certbot --version 2>&1)"
fi

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ PARTE 1 CONCLUÍDA${NC}"
echo "============================================================"
echo ""
echo "  Nginx:    $(nginx -v 2>&1)"
echo "  Certbot:  $(certbot --version 2>&1)"
echo "  Domínio:  ${DOMAIN}"
echo ""
echo "  ⚠  Antes de executar a Parte 2, certifique-se de que:"
echo "     1. O DNS do domínio aponta para o IP desta VPS"
echo "     2. As portas 80 e 443 estão acessíveis externamente"
echo ""
echo "  Próximo passo:"
echo "    sudo REPO_URL=owner/repo DOMAIN=${DOMAIN} CERTBOT_EMAIL=seu@email.com ./2-build.sh"
echo ""
echo "  Para repositório privado, autentique antes:"
echo "    gh auth login && gh auth setup-git"
echo ""
echo "============================================================"
