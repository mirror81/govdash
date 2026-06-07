#!/usr/bin/env bash
# ==============================================================================
# setup/macos/2-build.sh
# PARTE 2 — Login, clone, build e start da aplicação
#
# O que faz:
#   - Clona o repositório (público ou privado)
#   - Faz build e sobe a stack com Docker Compose
#   - Configura Colima para iniciar automaticamente no login (brew services)
#   - Cria LaunchAgent para reiniciar a aplicação automaticamente no login
#
# Pré-requisito: executar 1-install.sh antes.
#
# Uso:
#   ./2-build.sh
#   REPO_URL=owner/repo APP_DIR=$HOME/app BUILD_NO_CACHE=1 ./2-build.sh
#
# Para repositório privado, autentique antes de rodar este script:
#   gh auth login
#   gh auth setup-git
#
# Variáveis opcionais:
#   REPO_URL          owner/repo ou URL git (padrão: mirantegov/painel)
#   APP_DIR           diretório local do projeto (padrão: $HOME/app)
#   BUILD_NO_CACHE    1 = docker compose build --no-cache
# ==============================================================================

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }
err()  { echo -e "${RED}[✖]${NC} $1"; exit 1; }

[[ "$(uname -s)" != "Darwin" ]] && err "Este script é para macOS."
[[ ${EUID} -eq 0 ]] && err "Não execute com sudo."

# Garante PATH do Homebrew
[[ -x /opt/homebrew/bin/brew ]] && eval "$(/opt/homebrew/bin/brew shellenv)"
[[ -x /usr/local/bin/brew   ]] && eval "$(/usr/local/bin/brew shellenv)"

command -v docker >/dev/null 2>&1 || err "Docker não encontrado. Execute 1-install.sh primeiro."
docker info >/dev/null 2>&1       || err "Docker daemon não disponível. Execute 1-install.sh e certifique-se de que o Colima está rodando."

# ── Variáveis ─────────────────────────────────────────────────────────────────
APP_DIR="${APP_DIR:-$HOME/app}"
REPO_URL="${REPO_URL:-mirantegov/painel}"
BUILD_NO_CACHE="${BUILD_NO_CACHE:-0}"

# Detectar comando do Compose
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  err "Docker Compose não encontrado. Execute 1-install.sh primeiro."
fi

echo ""
echo "============================================================"
echo "  macOS — Parte 2: Build e start da aplicação"
echo "============================================================"
echo ""

resolve_clone_url() {
  local repo="$1"
  [[ "${repo}" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]] && echo "https://github.com/${repo}.git" || echo "${repo}"
}

# ══════════════════════════════════════════════════════════════════════════════
# 1. Clone do repositório
# ══════════════════════════════════════════════════════════════════════════════
CLONE_URL="$(resolve_clone_url "${REPO_URL}")"
info "Clonando repositório em ${APP_DIR} (origem: ${CLONE_URL})..."

rm -rf "${APP_DIR}.new"
mkdir -p "$(dirname "${APP_DIR}")"

if ! git clone --depth 1 "${CLONE_URL}" "${APP_DIR}.new"; then
  rm -rf "${APP_DIR}.new"
  echo ""
  echo "  ─────────────────────────────────────────────────────────"
  echo "  REPOSITÓRIO PRIVADO? Escolha uma das opções:"
  echo ""
  echo "  Opção A — Token HTTPS:"
  echo "    REPO_URL=https://<token>@github.com/org/repo.git ./2-build.sh"
  echo ""
  echo "  Opção B — GitHub CLI:"
  echo "    gh auth login && gh auth setup-git"
  echo "    REPO_URL=owner/repo ./2-build.sh"
  echo ""
  echo "  Opção C — Chave SSH:"
  echo "    REPO_URL=git@github.com:org/repo.git ./2-build.sh"
  echo "  ─────────────────────────────────────────────────────────"
  err "git clone falhou."
fi
rm -rf "${APP_DIR}"
mv "${APP_DIR}.new" "${APP_DIR}"
log "Repositório clonado em ${APP_DIR}."

# ══════════════════════════════════════════════════════════════════════════════
# 2. Build e start com Docker Compose
# ══════════════════════════════════════════════════════════════════════════════
[[ -f "${APP_DIR}/docker-compose.yml" ]] || err "docker-compose.yml não encontrado em ${APP_DIR}."

info "Construindo a imagem Docker..."
cd "${APP_DIR}"
if [[ "${BUILD_NO_CACHE}" == "1" ]]; then
  "${COMPOSE_CMD[@]}" build --no-cache
else
  "${COMPOSE_CMD[@]}" build
fi

info "Iniciando a aplicação..."
"${COMPOSE_CMD[@]}" up -d
log "Aplicação em execução na porta 3000."

# ══════════════════════════════════════════════════════════════════════════════
# 3. Auto-start: Colima via brew services + LaunchAgent para a aplicação
# ══════════════════════════════════════════════════════════════════════════════
info "Configurando Colima para iniciar automaticamente no login..."
brew services start colima
log "Colima registrado como brew service (inicia no login)."

PLIST_DIR="$HOME/Library/LaunchAgents"
PLIST_PATH="${PLIST_DIR}/com.mirante.painel.plist"
LOG_DIR="${APP_DIR}/logs"
mkdir -p "${PLIST_DIR}" "${LOG_DIR}"

info "Criando LaunchAgent para auto-start da aplicação no login..."
cat > "${PLIST_PATH}" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.mirante.painel</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-c</string>
    <string>sleep 20 &amp;&amp; cd ${APP_DIR} &amp;&amp; docker compose up -d</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${LOG_DIR}/launch.log</string>
  <key>StandardErrorPath</key>
  <string>${LOG_DIR}/launch.log</string>
</dict>
</plist>
PLIST

launchctl load "${PLIST_PATH}" 2>/dev/null || true
log "LaunchAgent registrado: app iniciará automaticamente no próximo login."

# ══════════════════════════════════════════════════════════════════════════════
# 4. Teste de saúde
# ══════════════════════════════════════════════════════════════════════════════
info "Aguardando a aplicação responder..."
attempts=0
until curl -fs http://localhost:3000 >/dev/null 2>&1; do
  attempts=$((attempts + 1))
  if [[ ${attempts} -ge 30 ]]; then
    warn "Aplicação ainda não responde após 60 s. Verifique: ${COMPOSE_CMD[*]} logs -f"
    break
  fi
  sleep 2
done
[[ ${attempts} -lt 30 ]] && log "Aplicação respondendo em http://localhost:3000"

# ══════════════════════════════════════════════════════════════════════════════
# 5. Resumo final
# ══════════════════════════════════════════════════════════════════════════════
LOCAL_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")"

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ PARTE 2 CONCLUÍDA${NC}"
echo "============================================================"
echo ""
echo "  Docker:     $(docker --version 2>/dev/null || echo 'N/A')"
echo "  Colima:     $(colima version 2>/dev/null | head -1 || echo 'N/A')"
echo "  Auto-start: brew services colima + LaunchAgent com.mirante.painel"
echo "  App dir:    ${APP_DIR}"
echo ""
echo "  Acesse:"
echo "    http://localhost:3000"
echo "    http://${LOCAL_IP}:3000"
echo ""
echo "  Comandos úteis:"
echo "    cd ${APP_DIR}"
echo "    ${COMPOSE_CMD[*]} logs -f       # logs"
echo "    ${COMPOSE_CMD[*]} restart       # reiniciar"
echo "    ${COMPOSE_CMD[*]} up -d --build # rebuild"
echo "    git pull && ${COMPOSE_CMD[*]} up -d --build  # atualizar"
echo ""
echo "  Colima:"
echo "    colima status"
echo "    colima stop / colima start"
echo "    brew services list | grep colima"
echo ""
echo "  LaunchAgent:"
echo "    launchctl list com.mirante.painel"
echo "    launchctl unload ~/Library/LaunchAgents/com.mirante.painel.plist  # desativar"
echo ""
echo "============================================================"
