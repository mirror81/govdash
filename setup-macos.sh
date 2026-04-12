#!/usr/bin/env bash
# ==============================================================================
# setup-macos.sh
# Script de instalacao para macOS 26 em Apple Silicon (ex.: MacBook Air M1)
# Instala Homebrew, Docker CLI, Colima, Git; clona o repositorio, sobe a stack
# e configura inicializacao automatica no login via brew services + LaunchAgent.
#
# Uso:
#   chmod +x ./setup-macos.sh
#   ./setup-macos.sh
#
# Variaveis opcionais:
#   REPO_URL           owner/repo ou URL git completa (padrao: vagnerrods/dash)
#   APP_DIR            diretorio local do projeto (padrao: $HOME/app)
#   BUILD_NO_CACHE     1 = docker compose build --no-cache
#   INSTALL_NGROK      1 = instala ngrok (recomendado para desenvolvimento)
#   INSTALL_GH         1 = instala GitHub CLI (opcional)
#   COLIMA_CPU         CPUs da VM Colima (padrao: 4)
#   COLIMA_MEMORY      Memoria em GB da VM Colima (padrao: 8)
#   COLIMA_DISK        Disco em GB da VM Colima (padrao: 60)
# ==============================================================================

set -euo pipefail

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

# ── Verificacoes iniciais ─────────────────────────────────────────────────────
if [[ "$(uname -s)" != "Darwin" ]]; then
  err "Este script foi feito para macOS. Sistema detectado: $(uname -s)"
fi

if [[ ${EUID} -eq 0 ]]; then
  err "Nao execute este script com sudo. Rode como usuario comum."
fi

ARCH="$(uname -m)"
MACOS_VERSION="$(sw_vers -productVersion 2>/dev/null || echo "desconhecida")"

info "macOS detectado: ${MACOS_VERSION}"
if [[ "${ARCH}" != "arm64" ]]; then
  warn "Apple Silicon nao detectado (arquitetura atual: ${ARCH}). O script foi otimizado para arm64, mas pode funcionar em outras arquiteturas."
else
  log "Apple Silicon detectado (${ARCH})."
fi

# ── Variaveis configuraveis ───────────────────────────────────────────────────
APP_DIR="${APP_DIR:-$HOME/app}"
REPO_URL="${REPO_URL:-vagnerrods/dash}"
BUILD_NO_CACHE="${BUILD_NO_CACHE:-0}"
INSTALL_NGROK="${INSTALL_NGROK:-0}"
INSTALL_GH="${INSTALL_GH:-0}"
COLIMA_CPU="${COLIMA_CPU:-4}"
COLIMA_MEMORY="${COLIMA_MEMORY:-8}"
COLIMA_DISK="${COLIMA_DISK:-60}"

echo ""
echo "============================================================"
echo "  Setup macOS — Dashboard Municipal (Docker + Colima)"
echo "============================================================"
echo ""

resolve_clone_url() {
  local repo="$1"
  if [[ "${repo}" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]]; then
    echo "https://github.com/${repo}.git"
  else
    echo "${repo}"
  fi
}

ensure_xcode_clt() {
  if xcode-select -p >/dev/null 2>&1; then
    log "Xcode Command Line Tools disponivel."
    return
  fi

  warn "Xcode Command Line Tools nao encontrado. A instalacao sera iniciada pela Apple."
  xcode-select --install || true
  err "Conclua a instalacao do Xcode Command Line Tools e execute o script novamente."
}

ensure_homebrew() {
  if command -v brew >/dev/null 2>&1; then
    log "Homebrew disponivel: $(brew --version | head -1)"
    return
  fi

  info "Instalando Homebrew..."
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi

  command -v brew >/dev/null 2>&1 || err "Falha ao instalar Homebrew."
  log "Homebrew instalado: $(brew --version | head -1)"
}

ensure_brew_shellenv() {
  if [[ -x /opt/homebrew/bin/brew ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  elif [[ -x /usr/local/bin/brew ]]; then
    eval "$(/usr/local/bin/brew shellenv)"
  fi
}

install_brew_packages() {
  info "Atualizando Homebrew..."
  brew update

  info "Instalando dependencias principais..."
  brew install git docker docker-compose colima

  if [[ "${INSTALL_GH}" == "1" ]]; then
    brew install gh
    log "GitHub CLI instalado: $(gh --version | head -1)"
  else
    info "Instalacao do GitHub CLI ignorada (defina INSTALL_GH=1 para habilitar)."
  fi

  if [[ "${INSTALL_NGROK}" == "1" ]]; then
    if brew install ngrok/ngrok/ngrok 2>/dev/null; then
      log "ngrok instalado: $(ngrok --version | head -1)"
    else
      warn "Falha ao instalar ngrok via tap oficial. Tentando formula padrao..."
      brew install ngrok || warn "Nao foi possivel instalar ngrok (opcional)."
    fi
  else
    info "Instalacao do ngrok ignorada (defina INSTALL_NGROK=1 para habilitar)."
  fi
}

ensure_colima_running() {
  if colima status >/dev/null 2>&1; then
    local colima_status
    colima_status="$(colima status 2>/dev/null | tr '\n' ' ' || true)"
    if [[ "${colima_status}" == *"Running"* ]]; then
      log "Colima ja esta em execucao."
      return
    fi
  fi

  info "Iniciando Colima..."
  colima start \
    --cpu "${COLIMA_CPU}" \
    --memory "${COLIMA_MEMORY}" \
    --disk "${COLIMA_DISK}" \
    --arch aarch64

  log "Colima iniciado."
}

wait_for_docker() {
  info "Aguardando Docker ficar disponivel..."
  local attempts=0
  until docker info >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [[ ${attempts} -ge 30 ]]; then
      err "Docker nao ficou disponivel apos aguardar a inicializacao do Colima."
    fi
    sleep 2
  done
  log "Docker disponivel: $(docker --version)"
}

resolve_compose_cmd() {
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD=(docker compose)
    log "Docker Compose disponivel via 'docker compose'."
    return
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD=(docker-compose)
    log "Docker Compose disponivel via 'docker-compose'."
    return
  fi

  err "Docker Compose nao encontrado apos a instalacao."
}

clone_repo() {
  local clone_url
  clone_url="$(resolve_clone_url "${REPO_URL}")"

  info "Clonando repositorio em ${APP_DIR} (origem: ${clone_url})..."

  rm -rf "${APP_DIR}.new"
  mkdir -p "$(dirname "${APP_DIR}")"

  if ! git clone --depth 1 "${clone_url}" "${APP_DIR}.new"; then
    rm -rf "${APP_DIR}.new"
    echo ""
    echo "  ─────────────────────────────────────────────────────────"
    echo "  REPOSITÓRIO PRIVADO? Escolha uma das opções:"
    echo ""
    echo "  Opção A — Token HTTPS:"
    echo "    REPO_URL=https://<token>@github.com/org/repo.git ./setup-macos.sh"
    echo ""
    echo "  Opção B — GitHub CLI (recomendado):"
    echo "    INSTALL_GH=1 ./setup-macos.sh   # instala gh"
    echo "    gh auth login                   # autentica (interativo)"
    echo "    gh auth setup-git               # configura credential helper"
    echo "    REPO_URL=owner/repo ./setup-macos.sh"
    echo ""
    echo "  Opção C — Chave SSH:"
    echo "    REPO_URL=git@github.com:org/repo.git ./setup-macos.sh"
    echo "  ─────────────────────────────────────────────────────────"
    echo ""
    err "git clone falhou. Veja as opções acima para repositórios privados."
  fi

  rm -rf "${APP_DIR}"
  mv "${APP_DIR}.new" "${APP_DIR}"
  log "Repositorio clonado em ${APP_DIR}."
}

build_and_start() {
  [[ -f "${APP_DIR}/docker-compose.yml" ]] || err "docker-compose.yml nao encontrado em ${APP_DIR}."

  info "Construindo e iniciando a aplicacao com Docker Compose..."
  cd "${APP_DIR}"

  if [[ "${BUILD_NO_CACHE}" == "1" ]]; then
    "${COMPOSE_CMD[@]}" build --no-cache
  else
    "${COMPOSE_CMD[@]}" build
  fi

  "${COMPOSE_CMD[@]}" up -d
  log "Aplicacao em execucao na porta 3000."
}

setup_autostart() {
  info "Configurando Colima para iniciar automaticamente no login..."
  brew services start colima
  log "Colima registrado como brew service (inicia no login)."

  # LaunchAgent: inicia 'docker compose up -d' apos o login
  local plist_dir="$HOME/Library/LaunchAgents"
  local plist_path="${plist_dir}/com.dash.app.plist"
  local log_dir="${APP_DIR}/logs"
  mkdir -p "${plist_dir}" "${log_dir}"

  cat > "${plist_path}" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.dash.app</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>sleep 20 &amp;&amp; cd ${APP_DIR} &amp;&amp; docker compose up -d</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${log_dir}/launch.log</string>
  <key>StandardErrorPath</key>
  <string>${log_dir}/launch.log</string>
</dict>
</plist>
PLIST

  # Carrega o agente na sessao atual (ignora erro se ja carregado)
  launchctl load "${plist_path}" 2>/dev/null || true
  log "LaunchAgent registrado: a aplicacao iniciara automaticamente no proximo login."
}

get_local_ip() {
  ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost"
}

# ══════════════════════════════════════════════════════════════════════════════
# Execucao principal
# ══════════════════════════════════════════════════════════════════════════════
ensure_xcode_clt
ensure_homebrew
ensure_brew_shellenv
install_brew_packages
ensure_colima_running
wait_for_docker
resolve_compose_cmd
clone_repo
build_and_start
setup_autostart

LOCAL_IP="$(get_local_ip)"

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ INSTALACAO CONCLUIDA${NC}"
echo "============================================================"
echo ""
echo "  Resumo:"
echo "  ─────────────────────────────────────────────────────────"
echo "  macOS:           ${MACOS_VERSION}"
echo "  Arquitetura:     ${ARCH}"
echo "  Homebrew:        $(brew --version | head -1 2>/dev/null || echo 'N/A')"
echo "  Docker:          $(docker --version 2>/dev/null || echo 'N/A')"
if docker compose version >/dev/null 2>&1; then
  echo "  Docker Compose:  $(docker compose version 2>/dev/null || echo 'N/A')"
elif command -v docker-compose >/dev/null 2>&1; then
  echo "  Docker Compose:  $(docker-compose version 2>/dev/null | head -1 || echo 'N/A')"
else
  echo "  Docker Compose:  N/A"
fi
echo "  Colima:          $(colima version 2>/dev/null | head -1 || echo 'N/A')"
if command -v gh >/dev/null 2>&1; then
  echo "  GitHub CLI:      $(gh --version 2>/dev/null | head -1 || echo 'N/A')"
else
  echo "  GitHub CLI:      (nao instalado; INSTALL_GH=1 para instalar)"
fi
if command -v ngrok >/dev/null 2>&1; then
  echo "  ngrok:           $(ngrok --version 2>/dev/null | head -1 || echo 'N/A')"
else
  echo "  ngrok:           (nao instalado; INSTALL_NGROK=1 para instalar)"
fi
echo "  Auto-start:      brew services colima + LaunchAgent com.dash.app"
echo "  App dir:         ${APP_DIR}"
echo ""
echo "  ─────────────────────────────────────────────────────────"
echo "  PROXIMOS PASSOS:"
echo "  ─────────────────────────────────────────────────────────"
echo ""
echo "  1. Acessar a aplicacao:"
echo "     http://localhost:3000"
echo "     http://${LOCAL_IP}:3000"
echo ""
echo "  2. Comandos uteis:"
echo "     cd ${APP_DIR}"
echo "     ${COMPOSE_CMD[*]} logs -f       # Ver logs"
echo "     ${COMPOSE_CMD[*]} restart       # Reiniciar"
echo "     ${COMPOSE_CMD[*]} down          # Parar"
echo "     ${COMPOSE_CMD[*]} up -d --build # Rebuild e restart"
echo ""
echo "  3. Para atualizar a aplicacao:"
echo "     cd ${APP_DIR}"
echo "     git pull"
echo "     ${COMPOSE_CMD[*]} up -d --build"
echo ""
echo "  4. Gerenciamento do runtime Docker:"
echo "     colima status"
echo "     colima stop"
echo "     colima start"
echo "     brew services list | grep colima  # status do auto-start"
echo ""
echo "  5. LaunchAgent (auto-start da app):"
echo "     launchctl list com.dash.app       # verificar status"
echo "     launchctl unload ~/Library/LaunchAgents/com.dash.app.plist  # desativar"
echo ""
echo "============================================================"
