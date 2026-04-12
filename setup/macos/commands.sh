#!/usr/bin/env bash
# ==============================================================================
# setup/macos/commands.sh
# Referência rápida — todos os comandos do setup macOS em sequência.
# Execute linha a linha ou adapte conforme necessário.
# ==============================================================================

# ── Variáveis — ajuste antes de executar ──────────────────────────────────────
APP_DIR="$HOME/app"
REPO_URL="vagnerrods/dash"          # ou: https://<token>@github.com/org/repo.git
COLIMA_CPU=4
COLIMA_MEMORY=8
COLIMA_DISK=60

# ── 1. Xcode Command Line Tools ───────────────────────────────────────────────
xcode-select --install              # confirmar na janela que aparecer; pular se já instalado

# ── 2. Homebrew ───────────────────────────────────────────────────────────────
NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"   # Apple Silicon
# eval "$(/usr/local/bin/brew shellenv)"    # Intel (descomente se necessário)

# ── 3. Pacotes via Homebrew ───────────────────────────────────────────────────
brew update
brew install git docker docker-compose colima

# ngrok (desenvolvimento / tunnels)
brew install ngrok/ngrok/ngrok

# GitHub CLI (opcional — necessário para repo privado via gh)
brew install gh

# ── 4. Login (repositório privado) ────────────────────────────────────────────
gh auth login          # interativo: GitHub.com → HTTPS → browser/token
gh auth setup-git      # configura credential helper para git

# ── 5. Colima — iniciar VM Docker ─────────────────────────────────────────────
colima start \
  --cpu "${COLIMA_CPU}" \
  --memory "${COLIMA_MEMORY}" \
  --disk "${COLIMA_DISK}" \
  --arch aarch64

# verificar
docker info

# ── 6. Clone do repositório ───────────────────────────────────────────────────
git clone --depth 1 "https://github.com/${REPO_URL}.git" "${APP_DIR}"

# ── 7. Build e start ──────────────────────────────────────────────────────────
cd "${APP_DIR}"
docker compose build
docker compose up -d

# ── 8. Auto-start no login ────────────────────────────────────────────────────
# Colima inicia automaticamente com o sistema
brew services start colima

# LaunchAgent para docker compose up -d após o login
mkdir -p "$HOME/Library/LaunchAgents" "${APP_DIR}/logs"
cat > "$HOME/Library/LaunchAgents/com.dash.app.plist" << PLIST
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
  <string>${APP_DIR}/logs/launch.log</string>
  <key>StandardErrorPath</key>
  <string>${APP_DIR}/logs/launch.log</string>
</dict>
</plist>
PLIST
launchctl load "$HOME/Library/LaunchAgents/com.dash.app.plist"

# ── Teste ─────────────────────────────────────────────────────────────────────
curl -I http://localhost:3000

# ── Comandos do dia a dia ─────────────────────────────────────────────────────
docker compose logs -f
docker compose restart
docker compose down
docker compose up -d --build
git -C "${APP_DIR}" pull && docker compose -f "${APP_DIR}/docker-compose.yml" up -d --build

colima status
colima stop
colima start
brew services list | grep colima

launchctl list com.dash.app
launchctl unload "$HOME/Library/LaunchAgents/com.dash.app.plist"   # desativar auto-start
