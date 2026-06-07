#!/usr/bin/env bash
# ==============================================================================
# setup/macos/1-install.sh
# PARTE 1 — Instalação e configuração do ambiente
#
# O que faz:
#   - Verifica Xcode Command Line Tools
#   - Instala Homebrew
#   - Instala git, docker, docker-compose, colima
#   - Instala ngrok (recomendado para dev) e GitHub CLI (opcional)
#   - Inicia e configura a VM Colima (runtime Docker no macOS)
#
# Uso:
#   chmod +x ./1-install.sh
#   ./1-install.sh
#   INSTALL_NGROK=1 INSTALL_GH=1 ./1-install.sh
#
# NÃO execute com sudo.
#
# Variáveis opcionais:
#   INSTALL_NGROK    1 = instala ngrok (padrão: 0)
#   INSTALL_GH       1 = instala GitHub CLI (padrão: 0)
#   COLIMA_CPU       CPUs da VM (padrão: 4)
#   COLIMA_MEMORY    RAM em GB da VM (padrão: 8)
#   COLIMA_DISK      Disco em GB da VM (padrão: 60)
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }
err()  { echo -e "${RED}[✖]${NC} $1"; exit 1; }

[[ "$(uname -s)" != "Darwin" ]] && err "Este script é para macOS. Sistema detectado: $(uname -s)"
[[ ${EUID} -eq 0 ]] && err "Não execute com sudo. Rode como usuário comum."

ARCH="$(uname -m)"
MACOS_VERSION="$(sw_vers -productVersion 2>/dev/null || echo "desconhecida")"
info "macOS ${MACOS_VERSION} (${ARCH}) detectado."
[[ "${ARCH}" != "arm64" ]] && warn "Otimizado para Apple Silicon (arm64). Atual: ${ARCH}."

# ── Variáveis ─────────────────────────────────────────────────────────────────
INSTALL_NGROK="${INSTALL_NGROK:-0}"
INSTALL_GH="${INSTALL_GH:-0}"
COLIMA_CPU="${COLIMA_CPU:-4}"
COLIMA_MEMORY="${COLIMA_MEMORY:-8}"
COLIMA_DISK="${COLIMA_DISK:-60}"

echo ""
echo "============================================================"
echo "  macOS — Parte 1: Instalação do ambiente"
echo "============================================================"
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# 1. Xcode Command Line Tools
# ══════════════════════════════════════════════════════════════════════════════
if xcode-select -p >/dev/null 2>&1; then
  log "Xcode Command Line Tools disponível."
else
  warn "Xcode CLT não encontrado. Iniciando instalação via Apple..."
  xcode-select --install || true
  err "Conclua a instalação do Xcode CLT e execute o script novamente."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 2. Homebrew
# ══════════════════════════════════════════════════════════════════════════════
if command -v brew >/dev/null 2>&1; then
  log "Homebrew disponível: $(brew --version | head -1)"
else
  info "Instalando Homebrew..."
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  [[ -x /opt/homebrew/bin/brew ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
  [[ -x /usr/local/bin/brew   ]] && eval "$(/usr/local/bin/brew shellenv)"
  command -v brew >/dev/null 2>&1 || err "Falha ao instalar Homebrew."
  log "Homebrew instalado: $(brew --version | head -1)"
fi

# Garante PATH do brew na sessão atual
[[ -x /opt/homebrew/bin/brew ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
[[ -x /usr/local/bin/brew   ]] && eval "$(/usr/local/bin/brew shellenv)"

# ══════════════════════════════════════════════════════════════════════════════
# 3. Pacotes via Homebrew
# ══════════════════════════════════════════════════════════════════════════════
info "Atualizando Homebrew..."
brew update

info "Instalando git, docker, docker-compose, colima..."
brew install git docker docker-compose colima

if [[ "${INSTALL_GH}" == "1" ]]; then
  brew install gh
  log "GitHub CLI instalado: $(gh --version | head -1)"
else
  info "GitHub CLI ignorado (INSTALL_GH=1 para habilitar)."
fi

if [[ "${INSTALL_NGROK}" == "1" ]]; then
  if brew install ngrok/ngrok/ngrok 2>/dev/null; then
    log "ngrok instalado: $(ngrok --version | head -1)"
  else
    warn "Falha no tap oficial do ngrok. Tentando fórmula padrão..."
    brew install ngrok || warn "Não foi possível instalar ngrok."
  fi
else
  info "ngrok ignorado (INSTALL_NGROK=1 para habilitar)."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 4. Colima — iniciar VM Docker
# ══════════════════════════════════════════════════════════════════════════════
COLIMA_RUNNING=false
if colima status >/dev/null 2>&1; then
  [[ "$(colima status 2>/dev/null | tr '\n' ' ')" == *"Running"* ]] && COLIMA_RUNNING=true
fi

if ${COLIMA_RUNNING}; then
  log "Colima já está em execução."
else
  info "Iniciando Colima (${COLIMA_CPU} CPU, ${COLIMA_MEMORY} GB RAM, ${COLIMA_DISK} GB disco)..."
  colima start \
    --cpu "${COLIMA_CPU}" \
    --memory "${COLIMA_MEMORY}" \
    --disk "${COLIMA_DISK}" \
    --arch aarch64
  log "Colima iniciado."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 5. Aguardar Docker
# ══════════════════════════════════════════════════════════════════════════════
info "Aguardando Docker ficar disponível..."
attempts=0
until docker info >/dev/null 2>&1; do
  attempts=$((attempts + 1))
  [[ ${attempts} -ge 30 ]] && err "Docker não ficou disponível após aguardar o Colima."
  sleep 2
done
log "Docker disponível: $(docker --version)"

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ PARTE 1 CONCLUÍDA${NC}"
echo "============================================================"
echo ""
echo "  Homebrew: $(brew --version | head -1 2>/dev/null || echo 'N/A')"
echo "  Docker:   $(docker --version 2>/dev/null || echo 'N/A')"
echo "  Colima:   $(colima version 2>/dev/null | head -1 || echo 'N/A')"
echo ""
echo "  Próximo passo:"
echo "    REPO_URL=mirantegov/painel ./2-build.sh"
echo ""
echo "  Para repositório privado, autentique antes:"
echo "    gh auth login && gh auth setup-git"
echo ""
echo "============================================================"
