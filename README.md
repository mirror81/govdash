# Analytics Dash — Painel de gestão pública municipal

## O que é este sistema

O **Analytics Dash** é uma aplicação web de **Next.js** pensada para **prefeituras, autarquias e equipes de planejamento** que precisam de um **único painel** para acompanhar, de forma didática, **indicadores de gestão pública**: finanças, pessoal, obras, políticas sociais, transparência e mais. A interface está em **português (Brasil)**, com gráficos, tabelas e cartões (KPIs) no estilo *dashboard* executivo.

> **Dados de demonstração:** todo o conteúdo numérico e textos são **fictícios e estáticos** — servem para apresentações, treinamento e protótipos, **não** para decisão com informações reais. A arquitetura não inclui integração com ERP, TCE ou APIs governamentais.

### Navegação

O painel principal (`/`) organiza o conteúdo em **abas (tabs)**: o utilizador escolhe o módulo e vê indicadores e visualizações daquela área. Há opção de **modo apresentação** (scroll automático entre módulos) nas definições do menu de utilizador, útil em **reuniões ou telão**.

### Casos de uso típicos

| Cenário | Como o produto ajuda |
| --- | --- |
| **Síntese para liderança** | A aba **Geral** consolida visão de receita, despesa e alertas; ideal para reuniões rápidas. |
| **Fiscal e finanças** | **Despesas**, **Receitas**, **Financeiro**, **Tributos** e **Planejamento (orçamento)** apoiam leitura de execução e composição. |
| **Controle patrimonial e operacional** | **Frotas**, **Obras**, **Patrimônio** e **Processos** dão visão de frota, obras, bens e trâmites. |
| **Pessoas e contratação** | **Recursos Humanos** e **Licitações e Contratos** concentram indicadores de pessoal e compras. |
| **Políticas setoriais** | **Saúde**, **Educação** e **Assistência Social** exibem painéis temáticos para áreas sociais. |
| **Transparência e controle** | **Contas Públicas** reforça leitura de prestação de contas; **Legislativo**, **Previdência** e **Saneamento** ampliam o recorte institucional. |

---

## Stack

| Tecnologia | Versão |
| --- | --- |
| [Next.js](https://nextjs.org) | 16 |
| [React](https://react.dev) | 19 |
| TypeScript | 5 |
| [Tailwind CSS](https://tailwindcss.com) | 4 |
| [shadcn/ui](https://ui.shadcn.com) + Radix | latest |
| [Recharts](https://recharts.org) | 2 |
| [Hugeicons](https://hugeicons.com) | (ícones) |

---

## Temas e aparência

A aplicação combina **modo claro / escuro / sistema** ([`next-themes`](https://github.com/pacocoursey/next-themes)) com **paletas de cor nomeadas** (presets shadcn-compatible em OKLCH). O seletor fica no **ícone de paleta** no cabeçalho (ao lado do menu de utilizador).

- **Onde é guardado:** a paleta escolhida (exceto "Padrão") fica em `localStorage` (`lib/color-presets.ts`) e é reaplicada ao recarregar a página, com script no layout para reduzir *flash* de cor errada.
- **Onde estão os tokens:** variáveis CSS em [`app/globals.css`](app/globals.css) sob `html[data-color-preset="…"]` (claro) e `html.dark[data-color-preset="…"]` (escuro).

### Paletas disponíveis

| Nome | Descrição breve |
| --- | --- |
| **Padrão** | Tema neutro base do sistema. |
| **Dracula** | Paleta clássica estilo Dracula / theme explorer. |
| **Ocean Breeze** | Tons oklch estilo registry (águas / claridade). |
| **Floresta noturna** | Verdes profundos, boa leitura em escuro. |
| **Northern Lights** | Teal e violeta, registry (tweakcn / shadcn). |
| **Supabase** | Inspiração verde-menta / escuro (registry). |
| **Monokai** | Inspiração editor Monokai / VS Code. |
| **Midnight Blue** | Azul profundo (estética *midnight*). |
| **Blue Jeans** | Índigo / *denim* (tokens registry). |

O **modo** (claro, escuro, sistema) é independente da **paleta**: pode usar, por exemplo, *Supabase* no claro e no escuro; as variáveis ajustam contraste em cada combinação.

---

## Módulos do painel (abas)

Cada linha corresponde a uma aba no ecrã principal. Os ficheiros vivem em [`components/`](components/) (e subpastas, ex.: `legislativo/`, `orcamento/`, `previdencia/`, `saneamento/`).

| Aba (UI) | Ficheiro / área | Foco |
| --- | --- | --- |
| **Geral** | `visao-geral.tsx` | Consolidação, alertas, visão macro. |
| **Despesas** | `despesa-municipal.tsx` | Execução e análise de despesas. |
| **Receitas** | `receita-municipal.tsx` | Arrecadação e composição. |
| **Financeiro** | `financeiro-municipal.tsx` | Indicadores financeiros agregados. |
| **Tributos** | `tributacao-municipal.tsx` | Tributação municipal. |
| **Licitações e Contratos** | `compras-municipais.tsx` | Compras, licitações, contratos. |
| **Recursos Humanos** | `rh-municipal.tsx` | Folha, secretarias, indicadores de pessoal. |
| **Planejamento** | `orcamento-municipal.tsx` (+ `orcamento/`) | Orçamento municipal (LOA, visualizações). |
| **Saúde** | `saude.tsx` | Indicadores da área de saúde. |
| **Educação** | `educacao.tsx` | Indicadores educacionais. |
| **Assistência Social** | `assistencia-social.tsx` | Políticas sociais. |
| **Obras** | `obras.tsx` | Obras e investimentos. |
| **Frotas** | `frotas.tsx` | Frota e operações. |
| **Patrimônio** | `patrimonio.tsx` | Bens e inventário. |
| **Processos** | `processos.tsx` | Processos / tramitação. |
| **Contas Públicas** | `prestacao-contas.tsx` | Prestação de contas / transparência. |
| **Legislativo** | `legislativo/` | Câmara, sessões, proposituras, etc. |
| **Previdência** | `previdencia/` | RPPS / previdência municipal. |
| **Saneamento** | `saneamento/` | Água, esgoto, drenagem. |

Para **adicionar uma nova aba**, siga o fluxo descrito na secção [Como adicionar um novo módulo](#como-adicionar-um-novo-módulo).

---

## Requisitos mínimos de hardware

### VPS / Servidor

| Recurso | Mínimo recomendado | Observação |
| --- | --- | --- |
| CPU | 1 vCPU | O build Next.js é intensivo; 2 vCPUs reduzem o tempo de compilação |
| RAM | 1 GB | O script `setup-vps.sh` cria 2 GB de swap para compensar RAM baixa |
| Disco | 10 GB livres | A imagem Docker ocupa ~500 MB; reserve espaço para logs e swap |
| SO | Ubuntu 22.04 ou 24.04 LTS | Outros Debian-based podem funcionar, sem garantia |
| Porta aberta | 3000 (ou 80/443 com proxy) | O script de instalação configura o UFW automaticamente |

> **RAM insuficiente?** O build do Next.js pode falhar com menos de 1 GB de RAM sem swap. O script `setup-vps.sh` configura 2 GB de swap automaticamente.

### Máquina local (macOS)

| Recurso | Mínimo |
| --- | --- |
| macOS | 12 Monterey ou superior |
| Chip | Apple Silicon (M1/M2/M3/M4) ou Intel |
| RAM | 4 GB (8 GB recomendado para Colima + build) |
| Disco | 15 GB livres (Homebrew + Colima + imagem Docker) |

---

## Pré-requisitos

- **Node.js** 20 ou superior — [download](https://nodejs.org)
- **npm** 10 ou superior (incluído com o Node.js)
- **Docker Engine** + **Docker Compose** *(apenas para execução em container)*

Verifique as versões instaladas:

```bash
node -v
npm -v
docker -v
```

---

## Desenvolvimento local

```bash
git clone https://github.com/vagnerrods/dash.git
cd dash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Será redirecionado para `/login` se não existir cookie de sessão.

### Credenciais de demonstração

| Campo | Valor |
| --- | --- |
| Usuário | `admin` |
| Senha | `admin` |

> São credenciais fixas só para demo — não utilize em produção sem substituir por autenticação real.

### Build e servidor de produção (local)

Útil para validar o mesmo artefacto que em Docker:

```bash
npm run build
npm run start
```

O servidor de produção local também usa a porta **3000** por defeito.

### Scripts npm

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Turbopack) |
| `npm run build` | Build de produção (`next build`) |
| `npm run start` | Serve o build (`next start`) |
| `npm run lint` | ESLint no projeto |
| `npm run typecheck` | TypeScript sem emitir ficheiros |
| `npm run format` | Prettier em `.ts` / `.tsx` |

---

## Docker

A imagem usa **multi-stage build** ([`Dockerfile`](Dockerfile)): instala dependências com `npm install`, corre `npm run build` (saída **`standalone`** configurada no Next.js) e executa como utilizador não-root.

### Subir o stack

Na raiz do repositório:

```bash
docker compose up -d --build
```

- **URL:** [http://localhost:3000](http://localhost:3000)  
- **Porta:** `3000` no host mapeada para `3000` no contentor ([`docker-compose.yml`](docker-compose.yml)).
- **Variável:** `NODE_ENV=production`.

### Comandos úteis

```bash
docker compose ps              # estado dos serviços
docker compose logs -f app     # logs da aplicação em tempo real
docker compose down            # parar e remover contentores
docker compose up -d --build   # rebuild após alterações ao código
```

Utilize as mesmas credenciais **admin / admin** para entrar. Em ambientes reais, configure **HTTPS**, segredos e autenticação fora deste repositório.

---

## Como alterar as credenciais de acesso

As credenciais estão definidas diretamente no código-fonte em `app/login/page.tsx` (linhas 14–15). Para alterá-las, edite o ficheiro e faça rebuild da imagem Docker.

### Passo a passo

**1. Edite o ficheiro de login:**

```bash
# Dentro do diretório do projeto
nano app/login/page.tsx
```

Localize as linhas:

```ts
const AUTH_USERNAME = "admin"
const AUTH_PASSWORD = "admin"
```

Substitua pelos valores desejados, por exemplo:

```ts
const AUTH_USERNAME = "prefeitura"
const AUTH_PASSWORD = "senha-segura-2025"
```

**2. Reconstrua e reinicie a aplicação:**

```bash
docker compose up -d --build
```

> A alteração só entra em vigor após o rebuild. Enquanto não reconstruir, o sistema continuará usando as credenciais antigas.

> **Importante:** use uma senha com no mínimo 12 caracteres combinando letras, números e símbolos. Evite senhas óbvias como datas ou nomes de cidades.

---

## Atualizar o sistema

Quando uma nova versão do código for disponibilizada no repositório:

```bash
# Entre no diretório da aplicação
cd /opt/app          # ajuste para o diretório usado na sua instalação

# Baixe as alterações
git pull

# Reconstrua a imagem e reinicie
docker compose up -d --build
```

Para verificar se a atualização foi aplicada:

```bash
docker compose ps
docker compose logs --tail=50 app
```

> Em VPS configurada com o script `setup-vps.sh`, o diretório padrão é `/opt/app`.  
> Em macOS configurado com `setup-macos.sh`, o diretório padrão é `~/app`.

---

## Verificar se o sistema está funcionando

```bash
# Ver estado dos containers
docker compose ps

# Testar se a aplicação responde (deve retornar HTTP 200 ou 302)
curl -o /dev/null -sw "%{http_code}\n" http://localhost:3000/login

# Ver últimas linhas do log
docker compose logs --tail=100 app
```

Se o container aparecer como `Up` em `docker compose ps` e o `curl` retornar `200` ou `302`, o sistema está operacional.

---

## HTTPS e proxy reverso (Nginx)

Para disponibilizar o painel em um domínio com HTTPS, configure o **Nginx** como proxy reverso na frente da aplicação.

### Pré-requisito

- Domínio apontando para o IP do servidor (ex.: `painel.prefeitura.gov.br`)
- Nginx instalado: `sudo apt install nginx -y`
- Certbot para certificado gratuito: `sudo apt install certbot python3-certbot-nginx -y`

### 1. Crie o arquivo de configuração do Nginx

```bash
sudo nano /etc/nginx/sites-available/dash
```

Cole o conteúdo abaixo, substituindo `painel.prefeitura.gov.br` pelo seu domínio:

```nginx
server {
    listen 80;
    server_name painel.prefeitura.gov.br;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Ative a configuração

```bash
sudo ln -s /etc/nginx/sites-available/dash /etc/nginx/sites-enabled/
sudo nginx -t          # testar se a configuração está correta
sudo systemctl reload nginx
```

### 3. Emita o certificado SSL (HTTPS gratuito)

```bash
sudo certbot --nginx -d painel.prefeitura.gov.br
```

O Certbot configura o HTTPS automaticamente e renova o certificado a cada 90 dias.

### 4. Libere as portas no firewall

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Após isso, o painel estará acessível em `https://painel.prefeitura.gov.br` sem necessidade de indicar a porta.

---

## Estrutura do projeto

```
dash/
├── app/
│   ├── layout.tsx          # Raiz: fonte Geist, tema, preset de cores
│   ├── page.tsx            # Dashboard principal (abas dos módulos)
│   ├── globals.css         # Tailwind + variáveis + presets de cor
│   └── login/page.tsx      # Login por cookie (credenciais nas linhas 14–15)
├── components/
│   ├── ui/                 # Primitivas shadcn/ui
│   ├── theme-provider.tsx
│   ├── theme-selector.tsx  # Paleta + modo claro/escuro
│   ├── color-preset-provider.tsx
│   └── …                   # Um componente por módulo (ver tabela acima)
├── lib/
│   ├── color-presets.ts    # Lista de paletas e script anti-FOUC
│   └── utils.ts
├── middleware.ts           # Guarda rotas com cookie `auth`
├── Dockerfile
├── docker-compose.yml
├── setup-macos.sh
└── setup-vps.sh
```

---

## Como adicionar um novo módulo

### 1. Crie o componente do módulo

Crie `components/meu-modulo.tsx`:

```tsx
export function MeuModulo() {
  return (
    <div>
      <h2>Meu Módulo</h2>
      {/* conteúdo */}
    </div>
  )
}
```

### 2. Registe a aba em `app/page.tsx`

1. Importe o componente.
2. Adicione o id em `TAB_ORDER`.
3. Adicione um `<TabsTrigger>` em `<TabsList>`.
4. Adicione `<TabsContent>` com o componente.

Os ícones vêm de `@hugeicons/core-free-icons`.

---

## Autenticação e rotas

| Rota | Comportamento |
| --- | --- |
| `/` | Exige cookie `auth=1`; senão redireciona para `/login` |
| `/login` | Se já autenticado, redireciona para `/` |

Cookie com validade de **8 horas** (`max-age=28800`). Detalhes em [`middleware.ts`](middleware.ts) e [`app/login/page.tsx`](app/login/page.tsx).

---

## Instalação automatizada no macOS (Apple Silicon)

```bash
chmod +x ./setup-macos.sh
./setup-macos.sh
```

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `REPO_URL` | `vagnerrods/dash` | Repositório a clonar (`owner/repo` ou URL completa) |
| `APP_DIR` | `~/app` | Diretório local de instalação |
| `BUILD_NO_CACHE` | `0` | `1` para rebuild sem cache do Docker |
| `INSTALL_GH` | `0` | `1` para instalar o GitHub CLI |
| `INSTALL_NGROK` | `0` | `1` para instalar o ngrok (túnel para acesso externo) |
| `COLIMA_CPU` | `4` | CPUs alocadas para a VM Colima |
| `COLIMA_MEMORY` | `8` | RAM em GB alocada para a VM Colima |
| `COLIMA_DISK` | `60` | Disco em GB alocado para a VM Colima |

---

## Deploy em VPS Ubuntu (22.04 / 24.04)

```bash
curl -fsSL "https://raw.githubusercontent.com/vagnerrods/dash/main/setup-vps.sh" -o setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `REPO_URL` | `vagnerrods/dash` | Repositório a clonar (`owner/repo` ou URL completa) |
| `APP_DIR` | `/opt/app` | Diretório de instalação no servidor |
| `BUILD_NO_CACHE` | `0` | `1` para rebuild sem cache do Docker |
| `INSTALL_GH` | `0` | `1` para instalar o GitHub CLI |

O script configura automaticamente: Docker, firewall UFW (portas 22 e 3000), 2 GB de swap e um serviço `systemd` que reinicia a aplicação junto com o servidor.

---

## Troubleshooting

### Aplicação não abre no navegador

Verifique se o container está em execução:

```bash
docker compose ps
```

Se o status não for `Up`, veja os logs:

```bash
docker compose logs --tail=100 app
```

Verifique também se a porta 3000 está acessível:

```bash
# Na própria VPS
curl -I http://localhost:3000/login

# No firewall (Ubuntu)
sudo ufw status
```

---

### Tela de login aparece, mas não aceita a senha

As credenciais estão no ficheiro `app/login/page.tsx` (linhas 14–15). Confirme os valores e, se alterá-los, reconstrua a imagem:

```bash
docker compose up -d --build
```

---

### `npm install` falha com erro de permissão

```bash
rm -rf node_modules && npm install
```

---

### Porta 3000 já está em uso

Identifique o processo que ocupa a porta e encerre-o:

```bash
# Linux / macOS
lsof -i :3000
kill -9 <PID>

# Ou mude a porta no docker-compose.yml
# ports: - "8080:3000"   ← acesse em :8080
```

---

### Docker: `permission denied while trying to connect to the Docker daemon`

```bash
sudo usermod -aG docker $USER
# Faça logout e login de novo para a alteração ter efeito
```

---

### Build do Docker falha com erro de memória (`out of memory` / `OOM`)

O build do Next.js pode consumir mais de 1 GB de RAM. Soluções:

```bash
# Opção 1: criar swap na VPS (se não foi criado pelo script)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Opção 2: rebuild sem cache (às vezes resolve travamentos parciais)
docker compose build --no-cache
docker compose up -d
```

---

### Container para de funcionar após reinício do servidor

Confirme que o serviço systemd está habilitado:

```bash
systemctl status dash-app
systemctl enable dash-app   # habilita o reinício automático
```

Em macOS, verifique o Colima e o LaunchAgent:

```bash
colima status
brew services list | grep colima
launchctl list com.dash.app
```

---

### Build passa mas `typecheck` aponta erros

O `next.config.mjs` tem `ignoreBuildErrors: true`, o que permite que o build termine mesmo com erros de TypeScript. Para identificar e corrigir os erros antes de uma atualização:

```bash
npm run typecheck
```

---

### Certificado SSL expirado (HTTPS)

O Certbot renova automaticamente a cada 90 dias. Para renovar manualmente:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## Licença e origem

Este repositório é um projeto de demonstração de painel analítico para gestão pública. Consulte o repositório para a licença aplicável.
