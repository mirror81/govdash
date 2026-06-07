#!/usr/bin/env bash
# ==============================================================================
# setup/vps/2-build.sh
# PARTE 2 — Login, clone, build, start e certificado SSL
#
# O que faz:
#   - Clona o repositório (público ou privado)
#   - Faz build e sobe a stack com Docker Compose
#   - Cria serviço systemd para reinício automático no boot
#   - Emite certificado SSL via Certbot (Let's Encrypt) e configura HTTPS no Nginx
#
# Pré-requisito: executar 1-install.sh antes.
# O DNS do domínio deve apontar para esta VPS antes de rodar.
#
# Uso:
#   sudo REPO_URL=mirantegov/painel DOMAIN=dash.hfgestaopublica.dev CERTBOT_EMAIL=admin@hfgestaopublica.dev ./2-build.sh
#   sudo REPO_URL=owner/repo APP_DIR=/opt/app BUILD_NO_CACHE=1 ./2-build.sh
#
# Para repositório privado, autentique antes de rodar este script:
#   gh auth login
#   gh auth setup-git
#
# Variáveis opcionais:
#   REPO_URL          owner/repo ou URL git (padrão: mirantegov/painel)
#   APP_DIR           diretório de instalação (padrão: /opt/app)
#   BUILD_NO_CACHE    1 = docker compose build --no-cache
#   DOMAIN            domínio configurado no Nginx (padrão: dash.hfgestaopublica.dev)
#   CERTBOT_EMAIL     e-mail para registro Let's Encrypt (obrigatório para SSL)
#   SKIP_CERTBOT      1 = pula emissão do certificado (ex.: DNS ainda não propagado)
# ==============================================================================

set -euo pipefail
export DEBIAN_FRONTEND=noninteractive

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${CYAN}[i]${NC} $1"; }
err()  { echo -e "${RED}[✖]${NC} $1"; exit 1; }

[[ $EUID -ne 0 ]] && err "Execute como root: sudo ./2-build.sh"
command -v docker &>/dev/null || err "Docker não encontrado. Execute 1-install.sh primeiro."
docker compose version &>/dev/null || err "Docker Compose não encontrado. Execute 1-install.sh primeiro."

# ── Variáveis ─────────────────────────────────────────────────────────────────
APP_DIR="${APP_DIR:-/opt/app}"
REPO_URL="${REPO_URL:-mirantegov/painel}"
BUILD_NO_CACHE="${BUILD_NO_CACHE:-0}"
DOMAIN="${DOMAIN:-dash.hfgestaopublica.dev}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
SKIP_CERTBOT="${SKIP_CERTBOT:-0}"

echo ""
echo "============================================================"
echo "  VPS — Parte 2: Build e start da aplicação"
echo "============================================================"
echo ""

resolve_clone_url() {
  local r="$1"
  [[ "${r}" =~ ^[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+$ ]] && echo "https://github.com/${r}.git" || echo "${r}"
}

# ══════════════════════════════════════════════════════════════════════════════
# 1. Clone do repositório
# ══════════════════════════════════════════════════════════════════════════════
[[ -z "${REPO_URL// }" ]] && err "REPO_URL está vazio. Defina REPO_URL=owner/repo."

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
  echo "    REPO_URL=https://<token>@github.com/org/repo.git sudo ./2-build.sh"
  echo ""
  echo "  Opção B — GitHub CLI:"
  echo "    gh auth login && gh auth setup-git"
  echo "    REPO_URL=owner/repo sudo ./2-build.sh"
  echo ""
  echo "  Opção C — Chave SSH:"
  echo "    REPO_URL=git@github.com:org/repo.git sudo ./2-build.sh"
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
  docker compose build --no-cache
else
  docker compose build
fi

info "Iniciando a aplicação..."
docker compose up -d
log "Aplicação em execução na porta 3000."

# ══════════════════════════════════════════════════════════════════════════════
# 3. Serviço systemd — reinício automático no boot
# ══════════════════════════════════════════════════════════════════════════════
info "Criando serviço systemd para auto-start no boot..."
cat > /etc/systemd/system/mirante-painel.service << EOF
[Unit]
Description=Dashboard Municipal — Docker Compose
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
log "Serviço 'mirante-painel' habilitado — app inicia automaticamente com o sistema."

# ══════════════════════════════════════════════════════════════════════════════
# 4. Certificado SSL com Certbot (Let's Encrypt)
# ══════════════════════════════════════════════════════════════════════════════
if [[ "${SKIP_CERTBOT}" == "1" ]]; then
  warn "Certbot ignorado (SKIP_CERTBOT=1). Rode manualmente quando o DNS estiver propagado:"
  warn "  certbot --nginx -d ${DOMAIN} --email seu@email.com --agree-tos --redirect --non-interactive"
else
  command -v certbot &>/dev/null || err "Certbot não encontrado. Execute 1-install.sh primeiro."
  command -v nginx   &>/dev/null || err "Nginx não encontrado. Execute 1-install.sh primeiro."

  if [[ -z "${CERTBOT_EMAIL}" ]]; then
    warn "CERTBOT_EMAIL não definido. O Certbot será executado sem e-mail de recuperação."
    warn "Recomendado: CERTBOT_EMAIL=admin@hfgestaopublica.dev"
    CERTBOT_EMAIL_FLAG="--register-unsafely-without-email"
  else
    CERTBOT_EMAIL_FLAG="--email ${CERTBOT_EMAIL}"
  fi

  info "Emitindo certificado SSL para ${DOMAIN}..."
  certbot --nginx \
    -d "${DOMAIN}" \
    ${CERTBOT_EMAIL_FLAG} \
    --agree-tos \
    --redirect \
    --non-interactive

  systemctl reload nginx
  log "Certificado SSL emitido e Nginx atualizado para HTTPS."

  info "Verificando renovação automática do certificado..."
  systemctl is-enabled snap.certbot.renew.timer &>/dev/null || \
    systemctl is-enabled certbot.timer &>/dev/null || \
    (crontab -l 2>/dev/null | grep -q certbot) || \
    warn "Renovação automática não detectada. Verifique com: certbot renew --dry-run"
  log "Renovação automática configurada pelo Certbot."
fi

# ══════════════════════════════════════════════════════════════════════════════
# 5. Teste de saúde
# ══════════════════════════════════════════════════════════════════════════════
info "Aguardando a aplicação responder em localhost:3000..."
attempts=0
until curl -fs http://localhost:3000 >/dev/null 2>&1; do
  attempts=$((attempts + 1))
  if [[ ${attempts} -ge 30 ]]; then
    warn "Aplicação ainda não responde após 60 s. Verifique: docker compose logs -f"
    break
  fi
  sleep 2
done
[[ ${attempts} -lt 30 ]] && log "Aplicação respondendo em http://localhost:3000"

# ══════════════════════════════════════════════════════════════════════════════
# 6. Resumo final
# ══════════════════════════════════════════════════════════════════════════════
VPS_IP=$(
  curl -4s --max-time 8 ifconfig.me 2>/dev/null ||
  curl -4s --max-time 8 icanhazip.com 2>/dev/null ||
  hostname -I 2>/dev/null | awk '{print $1}' ||
  echo "<ip-da-vps>"
)

HTTPS_ACTIVE="não (SKIP_CERTBOT=1 ou e-mail não informado)"
[[ "${SKIP_CERTBOT}" != "1" ]] && [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]] && \
  HTTPS_ACTIVE="ativo — renovação automática habilitada"

echo ""
echo "============================================================"
echo -e "${GREEN}  ✔ PARTE 2 CONCLUÍDA${NC}"
echo "============================================================"
echo ""
echo "  Docker:         $(docker --version 2>/dev/null || echo 'N/A')"
echo "  Docker Compose: $(docker compose version 2>/dev/null || echo 'N/A')"
echo "  Nginx:          $(nginx -v 2>&1)"
echo "  Certbot/SSL:    ${HTTPS_ACTIVE}"
echo "  Auto-start:     systemd mirante-painel.service habilitado"
echo "  App dir:        ${APP_DIR}"
echo ""
if [[ "${SKIP_CERTBOT}" != "1" ]] && [[ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]]; then
  echo "  Acesse: https://${DOMAIN}"
else
  echo "  Acesse (HTTP):  http://${DOMAIN}"
  echo "  Acesse (direto): http://${VPS_IP}:3000"
fi
echo ""
echo "  Comandos úteis:"
echo "    cd ${APP_DIR}"
echo "    docker compose logs -f        # logs"
echo "    docker compose restart        # reiniciar"
echo "    docker compose up -d --build  # rebuild"
echo "    git pull && docker compose up -d --build  # atualizar"
echo ""
echo "  Nginx:"
echo "    nginx -t                      # testar configuração"
echo "    systemctl reload nginx        # recarregar"
echo "    cat /etc/nginx/sites-available/mirante-painel"
echo ""
echo "  Certbot / SSL:"
echo "    certbot renew --dry-run       # testar renovação"
echo "    certbot certificates          # listar certificados"
echo ""
echo "  Serviço systemd:"
echo "    systemctl status mirante-painel"
echo "    systemctl restart mirante-painel"
echo ""
echo "============================================================"
