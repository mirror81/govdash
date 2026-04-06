#!/usr/bin/env bash
# ==============================================================================
# setup-vps.sh
# Script de instalação para Ubuntu Server 24.04 (Vultr VPS)
# Instala Docker, Docker Compose, ngrok, Git, e prepara a aplicação Next.js
#
# Uso:
#   chmod +x setup-vps.sh
#   sudo ./setup-vps.sh
#
# Após a execução, siga as instruções finais impressas no terminal.
# ==============================================================================

set -euo pipefail

# ── Cores para output ─────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }
err()  { echo -e "${RED}[✖]${NC} $1"; exit 1; }

# ── Verificações iniciais ─────────────────────────────────────────────────────
if [[ $EUID -ne 0 ]]; then
  err "Este script deve ser executado como root (sudo ./setup-vps.sh)"
fi

info "Detectando sistema operacional..."
if ! grep -qi "ubuntu" /etc/os-release 2>/dev/null; then
  warn "Este script foi preparado para Ubuntu. Pode funcionar em outros Debian-based, mas sem garantia."
fi

# ── Variáveis configuráveis ───────────────────────────────────────────────────
APP_DIR="/opt/app"
REPO_URL="${REPO_URL:-}"  # Defina via variável de ambiente ou edite aqui
DOMAIN="dash.hfgestaopublica.dev"

echo ""
echo "============================================================"
echo "  Setup VPS — Dashboard Municipal (Next.js + Docker)"
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
apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  unzip \
  ufw \
  htop \
  nano
log "Pacotes essenciais instalados."

# ══════════════════════════════════════════════════════════════════════════════
# 3. Docker Engine
# ══════════════════════════════════════════════════════════════════════════════
if command -v docker &>/dev/null; then
  warn "Docker já instalado: $(docker --version)"
else
  info "Instalando Docker Engine..."

  # Remover versões antigas (se existirem)
  apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

  # Adicionar repositório oficial Docker
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${VERSION_CODENAME}") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  # Habilitar e iniciar Docker
  systemctl enable docker
  systemctl start docker

  log "Docker instalado: $(docker --version)"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 4. Docker Compose (plugin já incluído acima, verificação extra)
# ══════════════════════════════════════════════════════════════════════════════
if docker compose version &>/dev/null; then
  log "Docker Compose disponível: $(docker compose version)"
else
  err "Docker Compose plugin não encontrado. Verifique a instalação do Docker."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 5. ngrok
# ══════════════════════════════════════════════════════════════════════════════
if command -v ngrok &>/dev/null; then
  warn "ngrok já instalado: $(ngrok --version)"
else
  info "Instalando ngrok..."
  curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
    tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
    tee /etc/apt/sources.list.d/ngrok.list
  apt-get update -y
  apt-get install -y ngrok
  log "ngrok instalado: $(ngrok --version)"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 6. GitHub CLI (gh)
# ══════════════════════════════════════════════════════════════════════════════
if command -v gh &>/dev/null; then
  warn "GitHub CLI já instalado: $(gh --version | head -1)"
else
  info "Instalando GitHub CLI (gh)..."
  (type -p wget >/dev/null || apt-get install -y wget)
  mkdir -p -m 755 /etc/apt/keyrings
  wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
    tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
  chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | \
    tee /etc/apt/sources.list.d/github-cli-stable.list > /dev/null
  apt-get update -y
  apt-get install -y gh
  log "GitHub CLI instalado: $(gh --version | head -1)"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 7. Firewall (UFW)
# ══════════════════════════════════════════════════════════════════════════════
info "Configurando firewall (UFW)..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   comment "SSH"
ufw allow 80/tcp   comment "HTTP"
ufw allow 443/tcp  comment "HTTPS"
ufw --force enable
log "Firewall configurado (SSH, HTTP, HTTPS)."

# ══════════════════════════════════════════════════════════════════════════════
# 8. Swap (recomendado para VPS com pouca RAM)
# ══════════════════════════════════════════════════════════════════════════════
if swapon --show | grep -q "/swapfile"; then
  warn "Swap já configurado."
else
  info "Criando 2GB de swap (recomendado para build do Next.js)..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  log "Swap de 2GB criado e ativado."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 9. Clonar repositório (via gh ou git)
# ══════════════════════════════════════════════════════════════════════════════
if [[ -n "${REPO_URL}" ]]; then
  info "Clonando repositório em ${APP_DIR}..."
  rm -rf "${APP_DIR}"

  # Se REPO_URL for no formato owner/repo, usar gh clone
  if [[ "${REPO_URL}" =~ ^[a-zA-Z0-9_-]+/[a-zA-Z0-9_.-]+$ ]]; then
    if gh auth status &>/dev/null; then
      gh repo clone "${REPO_URL}" "${APP_DIR}"
    else
      warn "gh não autenticado. Usando git clone via HTTPS..."
      git clone "https://github.com/${REPO_URL}.git" "${APP_DIR}"
    fi
  else
    git clone "${REPO_URL}" "${APP_DIR}"
  fi

  log "Repositório clonado em ${APP_DIR}."
else
  warn "REPO_URL não definida. Você precisará copiar o projeto manualmente."
  warn "  Opção 1: REPO_URL=owner/repo sudo ./setup-vps.sh        (usa gh clone)"
  warn "  Opção 2: REPO_URL=https://github.com/user/repo.git sudo ./setup-vps.sh"
  warn "  Opção 3: scp -r ./projeto root@<ip-vps>:${APP_DIR}"
  mkdir -p "${APP_DIR}"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 10. Build e start com Docker Compose
# ══════════════════════════════════════════════════════════════════════════════
if [[ -f "${APP_DIR}/docker-compose.yml" ]]; then
  info "Construindo e iniciando a aplicação com Docker Compose..."
  cd "${APP_DIR}"
  docker compose build --no-cache
  docker compose up -d
  log "Aplicação rodando via Caddy em https://${DOMAIN}"
else
  warn "docker-compose.yml não encontrado em ${APP_DIR}."
  warn "Copie o projeto para ${APP_DIR} e execute:"
  warn "  cd ${APP_DIR} && docker compose build && docker compose up -d"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 11. Resumo final
# ══════════════════════════════════════════════════════════════════════════════
VPS_IP=$(curl -s ifconfig.me 2>/dev/null || echo "<ip-da-vps>")

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ INSTALAÇÃO CONCLUÍDA${NC}"
echo "============================================================"
echo ""
echo "  Resumo:"
echo "  ─────────────────────────────────────────────────────────"
echo "  Docker:          $(docker --version 2>/dev/null || echo 'N/A')"
echo "  Docker Compose:  $(docker compose version 2>/dev/null || echo 'N/A')"
echo "  GitHub CLI:      $(gh --version 2>/dev/null | head -1 || echo 'N/A')"
echo "  ngrok:           $(ngrok --version 2>/dev/null || echo 'N/A')"
echo "  Firewall:        UFW ativo (22, 80, 443)"
echo "  Swap:            $(swapon --show --bytes | tail -1 | awk '{print $3/1024/1024/1024 " GB"}' 2>/dev/null || echo 'N/A')"
echo "  Domínio:         ${DOMAIN}"
echo "  App dir:         ${APP_DIR}"
echo ""
echo "  ─────────────────────────────────────────────────────────"
echo "  PRÓXIMOS PASSOS:"
echo "  ─────────────────────────────────────────────────────────"
echo ""
echo "  1. Acessar a aplicação (após apontar DNS):"
echo "     https://${DOMAIN}"
echo ""
echo "     Aponte o DNS A record de ${DOMAIN} para ${VPS_IP}"
echo ""
echo "  2. Autenticar GitHub CLI (para clone/push/PR):"
echo ""
echo "     gh auth login"
echo ""
echo "     Isso permite clonar repos privados, criar PRs, etc."
echo ""
echo "  3. Caddy (reverse proxy + HTTPS automático):"
echo "     O Caddy já está configurado no docker-compose.yml."
echo "     Certificado SSL será emitido automaticamente via Let's Encrypt."
echo ""
echo "  4. Comandos úteis:"
echo "     cd ${APP_DIR}"
echo "     docker compose logs -f        # Ver logs"
echo "     docker compose restart        # Reiniciar"
echo "     docker compose down           # Parar"
echo "     docker compose up -d --build  # Rebuild e restart"
echo ""
echo "  5. Para atualizar a aplicação (via gh/git):"
echo "     cd ${APP_DIR}"
echo "     git pull"
echo "     docker compose up -d --build"
echo ""
echo "============================================================"
