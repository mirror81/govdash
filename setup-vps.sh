#!/usr/bin/env bash
# ==============================================================================
# setup-vps.sh
# Script de instalação para Ubuntu Server 22.04/24.04 (VPS)
# Instala Docker, Docker Compose, Git, UFW, swap; clona o repositório,
# sobe a stack e configura reinício automático via systemd.
#
# Uso (repositório padrão deste projeto; sobrescreva com REPO_URL):
#   curl -fsSL ... | sudo bash
#   sudo REPO_URL=owner/repo ./setup-vps.sh
#
# Variáveis opcionais:
#   REPO_URL              owner/repo ou URL git (padrão: mirantegov/painel)
#   APP_DIR               diretório de instalação (padrão: /opt/app)
#   BUILD_NO_CACHE        1 = docker compose build --no-cache
#   INSTALL_GH            1 = instala GitHub CLI (opcional)
# ==============================================================================

set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

# ── Cores para output ─────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

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
APP_DIR="${APP_DIR:-/opt/app}"
REPO_URL="${REPO_URL:-mirantegov/painel}"
BUILD_NO_CACHE="${BUILD_NO_CACHE:-0}"
INSTALL_GH="${INSTALL_GH:-0}"

echo ""
echo "============================================================"
echo "  Setup VPS — Mirante Painel (Next.js + Docker)"
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
# 5. GitHub CLI (gh) — opcional
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
else
  info "Instalação do GitHub CLI ignorada (defina INSTALL_GH=1 para habilitar)."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 6. Firewall (UFW)
# — Adiciona apenas as regras necessárias, sem apagar configurações existentes.
# ══════════════════════════════════════════════════════════════════════════════
info "Configurando firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   comment "SSH"
ufw allow 3000/tcp comment "Mirante Painel"
ufw --force enable
log "Firewall configurado (SSH: 22, App: 3000)."

# ══════════════════════════════════════════════════════════════════════════════
# 7. Swap (recomendado para VPS com pouca RAM)
# ══════════════════════════════════════════════════════════════════════════════
if swapon --show | grep -q "/swapfile"; then
  warn "Swap já configurado."
else
  info "Criando 2 GB de swap (recomendado para build do Next.js)..."
  if fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048 status=none; then
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    if ! grep -q '^/swapfile[[:space:]]' /etc/fstab 2>/dev/null; then
      echo '/swapfile none swap sw 0 0' >> /etc/fstab
    fi
    log "Swap de 2 GB criado e ativado."
  else
    warn "Não foi possível criar /swapfile (disco cheio ou filesystem?). Continuando sem swap extra."
  fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# 8. Clonar repositório (HTTPS público ou URL completa para privado/SSH)
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
  echo ""
  echo "  ─────────────────────────────────────────────────────────"
  echo "  REPOSITÓRIO PRIVADO? Escolha uma das opções:"
  echo ""
  echo "  Opção A — Token HTTPS:"
  echo "    REPO_URL=https://<token>@github.com/org/repo.git sudo ./setup-vps.sh"
  echo ""
  echo "  Opção B — GitHub CLI (recomendado):"
  echo "    INSTALL_GH=1 sudo ./setup-vps.sh   # instala gh"
  echo "    gh auth login                       # autentica (interativo)"
  echo "    gh auth setup-git                   # configura credential helper"
  echo "    REPO_URL=owner/repo sudo ./setup-vps.sh"
  echo ""
  echo "  Opção C — Chave SSH:"
  echo "    REPO_URL=git@github.com:org/repo.git sudo ./setup-vps.sh"
  echo "  ─────────────────────────────────────────────────────────"
  echo ""
  err "git clone falhou. Veja as opções acima para repositórios privados."
fi
rm -rf "${APP_DIR}"
mv "${APP_DIR}.new" "${APP_DIR}"
log "Repositório clonado em ${APP_DIR}."

# ══════════════════════════════════════════════════════════════════════════════
# 9. Build e start com Docker Compose
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
  log "Aplicação em execução na porta 3000."
else
  warn "docker-compose.yml não encontrado em ${APP_DIR}."
  warn "Copie o projeto para ${APP_DIR} e execute:"
  warn "  cd ${APP_DIR} && docker compose build && docker compose up -d"
fi

# ══════════════════════════════════════════════════════════════════════════════
# 10. Serviço systemd — reinício automático da aplicação no boot
# ══════════════════════════════════════════════════════════════════════════════
info "Configurando serviço systemd para iniciar a aplicação automaticamente no boot..."

cat > /etc/systemd/system/mirante-painel.service << EOF
[Unit]
Description=Mirante Painel — Docker Compose
Documentation=https://github.com/mirantegov/painel
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

systemctl daemon-reload
systemctl enable mirante-painel
log "Serviço 'mirante-painel' habilitado — a aplicação iniciará automaticamente com o sistema."

# ══════════════════════════════════════════════════════════════════════════════
# 11. Resumo final
# ══════════════════════════════════════════════════════════════════════════════
VPS_IP=$(
  curl -4s --max-time 8 ifconfig.me 2>/dev/null ||
  curl -4s --max-time 8 icanhazip.com 2>/dev/null ||
  hostname -I 2>/dev/null | awk '{print $1}' ||
  echo "<ip-da-vps>"
)

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
echo "  Firewall:        UFW ativo (22, 3000)"
echo "  Swap:            $(swapon --show --bytes 2>/dev/null | tail -1 | awk '{printf "%.0f GB", $3/1024/1024/1024}' 2>/dev/null || echo 'N/A')"
echo "  Auto-start:      systemd mirante-painel.service habilitado"
echo "  App dir:         ${APP_DIR}"
echo ""
echo "  ─────────────────────────────────────────────────────────"
echo "  PRÓXIMOS PASSOS:"
echo "  ─────────────────────────────────────────────────────────"
echo ""
echo "  1. Acessar a aplicação:"
echo "     http://${VPS_IP}:3000"
echo ""
echo "  2. Repositório privado: use INSTALL_GH=1 + gh auth login, ou clone com token/SSH."
echo ""
echo "  3. Comandos úteis:"
echo "     cd ${APP_DIR}"
echo "     docker compose logs -f        # Ver logs"
echo "     docker compose restart        # Reiniciar"
echo "     docker compose down           # Parar"
echo "     docker compose up -d --build  # Rebuild e restart"
echo ""
echo "  4. Para atualizar a aplicação:"
echo "     cd ${APP_DIR}"
echo "     git pull"
echo "     docker compose up -d --build"
echo ""
echo "  5. Gerenciamento do serviço systemd:"
echo "     systemctl status mirante-painel"
echo "     systemctl restart mirante-painel"
echo "     systemctl stop mirante-painel"
echo ""
echo "============================================================"
