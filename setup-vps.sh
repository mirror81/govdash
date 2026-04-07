#!/usr/bin/env bash
# ==============================================================================
# setup-vps.sh
# Script de instalação para Ubuntu Server 22.04/24.04 (VPS)
# Instala Docker, Docker Compose, Git, UFW, swap; clona o repositório e sobe a stack.
#
# Uso (repositório padrão deste projeto; sobrescreva com REPO_URL):
#   curl -fsSL ... | sudo bash
#   sudo REPO_URL=owner/repo ./setup-vps.sh
#
# Variáveis opcionais:
#   REPO_URL              owner/repo ou URL git (padrão: vagnerrods/v0-shadcn-ui-components)
#   DOMAIN                domínio público (padrão: dash.hfgestaopublica.dev; deve bater com o Caddyfile)
#   UPDATE_CADDYFILE_DOMAIN  1 = ajusta a 1ª linha do Caddyfile para DOMAIN após o clone
#   BUILD_NO_CACHE        1 = docker compose build --no-cache
#   INSTALL_NGROK         1 = instala ngrok (opcional; falha não aborta o script)
#   INSTALL_GH            1 = instala GitHub CLI (opcional)
# ==============================================================================

set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

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
# Repositório padrão alinhado ao README; use REPO_URL para fork ou outro remoto.
REPO_URL="${REPO_URL:-vagnerrods/v0-shadcn-ui-components}"
DOMAIN="${DOMAIN:-dash.hfgestaopublica.dev}"
UPDATE_CADDYFILE_DOMAIN="${UPDATE_CADDYFILE_DOMAIN:-1}"
BUILD_NO_CACHE="${BUILD_NO_CACHE:-0}"
INSTALL_NGROK="${INSTALL_NGROK:-0}"
INSTALL_GH="${INSTALL_GH:-0}"

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
# 5. ngrok (opcional)
# ══════════════════════════════════════════════════════════════════════════════
if [[ "${INSTALL_NGROK}" == "1" ]]; then
  if command -v ngrok &>/dev/null; then
    warn "ngrok já instalado: $(ngrok --version)"
  else
    info "Instalando ngrok..."
    install -m 0755 -d /etc/apt/keyrings
    if curl -fsSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc -o /etc/apt/keyrings/ngrok.asc &&
       chmod a+r /etc/apt/keyrings/ngrok.asc &&
       echo "deb [signed-by=/etc/apt/keyrings/ngrok.asc] https://ngrok-agent.s3.amazonaws.com bookworm main" | \
         tee /etc/apt/sources.list.d/ngrok.list > /dev/null &&
       apt-get update -y &&
       apt-get install -y ngrok; then
      log "ngrok instalado: $(ngrok --version)"
    else
      warn "Instalação do ngrok falhou (opcional). Removendo fonte apt do ngrok, se existir."
      rm -f /etc/apt/sources.list.d/ngrok.list
      apt-get update -y || true
    fi
  fi
else
  info "Instalação do ngrok ignorada (defina INSTALL_NGROK=1 para habilitar)."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 6. GitHub CLI (gh) — opcional
# ══════════════════════════════════════════════════════════════════════════════
if [[ "${INSTALL_GH}" == "1" ]]; then
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
  if fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none; then
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    if ! grep -q '^/swapfile[[:space:]]' /etc/fstab 2>/dev/null; then
      echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    log "Swap de 2GB criado e ativado."
  else
    warn "Não foi possível criar /swapfile (disco cheio ou filesystem?). Continuando sem swap extra."
  fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# 9. Clonar repositório (HTTPS público ou URL completa para privado/SSH)
# ══════════════════════════════════════════════════════════════════════════════
if [[ -z "${REPO_URL// }" ]]; then
  err "REPO_URL está vazio. Defina REPO_URL=owner/repo ou a URL completa do repositório."
fi

resolve_clone_url() {
  local r="$1"
  if [[ "${r}" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
    echo "https://github.com/${r}.git"
  else
    echo "${r}"
  fi
}

CLONE_URL="$(resolve_clone_url "${REPO_URL}")"
info "Clonando repositório em ${APP_DIR} (origem: ${CLONE_URL})..."

rm -rf "${APP_DIR}.new"
if ! git clone --depth 1 "${CLONE_URL}" "${APP_DIR}.new"; then
  rm -rf "${APP_DIR}.new"
  err "git clone falhou. Repositório privado? Use REPO_URL=https://<token>@github.com/org/repo.git ou git@github.com:org/repo.git (chave SSH), ou instale o gh (INSTALL_GH=1), faça gh auth login e gh auth setup-git, e clone manualmente em ${APP_DIR}."
fi
rm -rf "${APP_DIR}"
mv "${APP_DIR}.new" "${APP_DIR}"
log "Repositório clonado em ${APP_DIR}."

# Opcional: alinhar domínio no Caddyfile ao DOMAIN (primeira linha: "domínio {")
if [[ "${UPDATE_CADDYFILE_DOMAIN}" == "1" && -f "${APP_DIR}/Caddyfile" ]]; then
  if [[ "${DOMAIN}" == *"/"* ]]; then
    warn "DOMAIN contém '/'; não alterando Caddyfile automaticamente."
  else
    info "Ajustando primeira linha do Caddyfile para ${DOMAIN} ..."
    sed -i "1s|.*|${DOMAIN} {|" "${APP_DIR}/Caddyfile"
  fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# 10. Build e start com Docker Compose
# ══════════════════════════════════════════════════════════════════════════════
if [[ -f "${APP_DIR}/docker-compose.yml" ]]; then
  info "Construindo e iniciando a aplicação com Docker Compose..."
  cd "${APP_DIR}"
  if [[ "${BUILD_NO_CACHE}" == "1" ]]; then
    docker compose build --no-cache
  else
    docker compose build
  fi
  docker compose up -d
  log "Aplicação em execução. Configure o DNS para apontar para este servidor; HTTPS via Caddy (Let's Encrypt)."
else
  warn "docker-compose.yml não encontrado em ${APP_DIR}."
  warn "Copie o projeto para ${APP_DIR} e execute:"
  warn "  cd ${APP_DIR} && docker compose build && docker compose up -d"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 11. Resumo final
# ══════════════════════════════════════════════════════════════════════════════
VPS_IP=$(curl -4s --max-time 10 ifconfig.me 2>/dev/null || curl -4s --max-time 10 icanhazip.com 2>/dev/null || echo "<ip-da-vps>")

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ INSTALAÇÃO CONCLUÍDA${NC}"
echo "============================================================"
echo ""
echo "  Resumo:"
echo "  ─────────────────────────────────────────────────────────"
echo "  Docker:          $(docker --version 2>/dev/null || echo 'N/A')"
echo "  Docker Compose:  $(docker compose version 2>/dev/null || echo 'N/A')"
if command -v gh &>/dev/null; then
  echo "  GitHub CLI:      $(gh --version 2>/dev/null | head -1 || echo 'N/A')"
else
  echo "  GitHub CLI:      (não instalado; INSTALL_GH=1 para instalar)"
fi
if command -v ngrok &>/dev/null; then
  echo "  ngrok:           $(ngrok --version 2>/dev/null || echo 'N/A')"
else
  echo "  ngrok:           (não instalado; INSTALL_NGROK=1 para instalar)"
fi
echo "  Firewall:        UFW ativo (22, 80, 443)"
echo "  Swap:            $(swapon --show --bytes 2>/dev/null | tail -1 | awk '{print $3/1024/1024/1024 " GB"}' 2>/dev/null || echo 'N/A')"
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
echo "     Aponte o registro DNS A de ${DOMAIN} para ${VPS_IP}"
echo ""
echo "  2. Repositório privado: use gh auth login (se INSTALL_GH=1) ou clone via URL com credenciais."
echo ""
echo "  3. Caddy (reverse proxy + HTTPS automático):"
echo "     Configurado no docker-compose.yml; certificado Let's Encrypt após DNS correto."
echo ""
echo "  4. Comandos úteis:"
echo "     cd ${APP_DIR}"
echo "     docker compose logs -f        # Ver logs"
echo "     docker compose restart        # Reiniciar"
echo "     docker compose down           # Parar"
echo "     docker compose up -d --build  # Rebuild e restart"
echo ""
echo "  5. Para atualizar a aplicação:"
echo "     cd ${APP_DIR}"
echo "     git pull"
echo "     docker compose up -d --build"
echo ""
echo "============================================================"
