# Dash — Analytics de Gestão Pública Municipal

Painel web para visualização de indicadores de gestão pública municipal, com módulos de orçamento, receita, despesa, financeiro, compras, RH, tributação e prestação de contas.

## Stack

| Tecnologia | Versão |
| --- | --- |
| [Next.js](https://nextjs.org) | 16 |
| [React](https://react.dev) | 19 |
| TypeScript | 5 |
| [Tailwind CSS](https://tailwindcss.com) | 4 |
| [shadcn/ui](https://ui.shadcn.com) + Radix | latest |
| [Recharts](https://recharts.org) | 2 |

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

## Primeiros passos (desenvolvimento local)

```bash
# 1. Clone o repositório
git clone https://github.com/vagnerrods/dash.git
cd dash

# 2. Instale as dependências
npm install

# 3. Suba o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Credenciais padrão

> **Atenção:** o login atual usa credenciais fixas apenas para fins de desenvolvimento e demonstração. Não use em produção sem substituir por uma solução de autenticação real.

| Campo | Valor |
| --- | --- |
| Usuário | `admin` |
| Senha | `admin` |

## Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Turbopack |
| `npm run build` | Gera o build de produção |
| `npm run start` | Serve o build de produção localmente |
| `npm run lint` | Executa o ESLint em todo o projeto |
| `npm run typecheck` | Verifica os tipos TypeScript sem emitir arquivos |
| `npm run format` | Formata todos os arquivos `.ts` e `.tsx` com Prettier |

## Execução com Docker

```bash
# Subir a aplicação (build + start)
docker compose up -d --build

# Verificar status dos containers
docker compose ps

# Acompanhar logs em tempo real
docker compose logs -f

# Parar e remover os containers
docker compose down
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

## Estrutura do Projeto

```
dash/
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── layout.tsx          # Layout raiz: fonte, tema, metadata
│   ├── page.tsx            # Página principal com as abas dos módulos
│   ├── globals.css         # Estilos globais e variáveis CSS (Tailwind)
│   └── login/
│       └── page.tsx        # Tela de login
│
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Primitivas de UI (botões, cards, inputs…) — geradas pelo shadcn
│   ├── visao-geral.tsx     # Módulo: Visão Geral
│   ├── orcamento/          # Módulo: Orçamento Municipal
│   ├── receita-municipal.tsx
│   ├── despesa-municipal.tsx
│   ├── financeiro-municipal.tsx
│   ├── compras-municipais.tsx
│   ├── rh-municipal.tsx
│   ├── tributacao-municipal.tsx
│   ├── prestacao-contas.tsx
│   ├── theme-provider.tsx  # Provedor de tema claro/escuro
│   └── theme-toggle.tsx    # Botão de alternância de tema
│
├── hooks/                  # Custom hooks React
│   ├── use-mobile.ts       # Detecta se o dispositivo é mobile
│   └── use-toast.ts        # Hook para exibir notificações
│
├── lib/
│   └── utils.ts            # Funções utilitárias (ex: cn para Tailwind)
│
├── public/                 # Arquivos estáticos (imagens, ícones)
├── styles/                 # Estilos adicionais
├── middleware.ts           # Proteção de rotas via cookie de autenticação
├── Dockerfile              # Build multi-stage da imagem Docker
├── docker-compose.yml      # Orquestração dos containers
├── setup-macos.sh          # Script de instalação automatizada no macOS (Apple Silicon)
└── setup-vps.sh            # Script de deploy automatizado em VPS Ubuntu
```

## Como adicionar um novo módulo

Siga estes passos para criar um módulo seguindo o padrão do projeto:

### 1. Crie o componente do módulo

Crie o arquivo `components/meu-modulo.tsx`:

```tsx
export function MeuModulo() {
  return (
    <div>
      <h2>Meu Módulo</h2>
      {/* conteúdo do módulo */}
    </div>
  )
}
```

### 2. Registre a aba no `app/page.tsx`

**2a.** Importe o componente no topo do arquivo:

```tsx
import { MeuModulo } from "@/components/meu-modulo"
```

**2b.** Adicione o ID da aba no array `TAB_ORDER`:

```ts
const TAB_ORDER = [
  "visao-geral",
  // ...abas existentes...
  "meu-modulo",  // <-- adicione aqui
]
```

**2c.** Adicione o gatilho da aba dentro de `<TabsList>`:

```tsx
<TabsTrigger value="meu-modulo" className="gap-2">
  <HugeiconsIcon icon={SeuIconeIcon} strokeWidth={2} className="size-4" />
  Meu Módulo
</TabsTrigger>
```

**2d.** Adicione o conteúdo da aba após os outros `<TabsContent>`:

```tsx
<TabsContent value="meu-modulo" className="mt-6">
  <MeuModulo />
</TabsContent>
```

> **Dica:** os ícones usados no projeto vêm da biblioteca [@hugeicons/core-free-icons](https://hugeicons.com). Pesquise um ícone adequado e importe-o junto com os outros na linha de imports existente em `app/page.tsx`.

## Autenticação e Rotas

O controle de acesso é feito pelo [middleware.ts](middleware.ts) via cookie `auth`:

| Rota | Comportamento |
| --- | --- |
| `/` | Requer `auth=1` no cookie; redireciona para `/login` se ausente |
| `/login` | Se já autenticado, redireciona para `/` |

O cookie expira em **8 horas** (`max-age=28800`).

## Instalação automatizada no macOS (Apple Silicon)

O script [setup-macos.sh](setup-macos.sh) configura todo o ambiente local com Homebrew, Colima e Docker Compose. Execute como usuário comum, **sem sudo**:

```bash
chmod +x ./setup-macos.sh
./setup-macos.sh
```

**Variáveis opcionais:**

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `REPO_URL` | `owner/repo` ou URL git completa | repositório atual |
| `APP_DIR` | Diretório local de destino | `$HOME/app` |
| `BUILD_NO_CACHE` | `1` para forçar build sem cache | — |
| `INSTALL_GH` | `1` para instalar GitHub CLI | — |
| `INSTALL_NGROK` | `1` para instalar ngrok | — |
| `COLIMA_CPU` | Número de CPUs da VM Colima | padrão do Colima |
| `COLIMA_MEMORY` | Memória em GB da VM Colima | padrão do Colima |
| `COLIMA_DISK` | Disco em GB da VM Colima | padrão do Colima |

Exemplo com variáveis:

```bash
REPO_URL=owner/repo APP_DIR=$HOME/projetos/dash BUILD_NO_CACHE=1 ./setup-macos.sh
```

## Deploy em VPS Ubuntu (22.04 / 24.04)

O script [setup-vps.sh](setup-vps.sh) provisiona o servidor e sobe a aplicação. Execute como root:

```bash
curl -fsSL "https://raw.githubusercontent.com/vagnerrods/dash/main/setup-vps.sh" -o setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

O script instala Docker, configura o firewall (UFW) nas portas 22 e 3000, cria 2 GB de swap e faz deploy via Docker Compose.

**Variáveis opcionais:**

| Variável | Descrição |
| --- | --- |
| `REPO_URL` | `owner/repo` ou URL git completa |
| `BUILD_NO_CACHE` | `1` para forçar build sem cache |
| `INSTALL_GH` | `1` para instalar GitHub CLI |
| `INSTALL_NGROK` | `1` para instalar ngrok |

## Troubleshooting

**`npm install` falha com erro de permissão**
Execute sem `sudo`. Se o problema persistir, verifique as permissões da pasta `node_modules`:
```bash
rm -rf node_modules && npm install
```

**Porta 3000 já em uso**
Encerre o processo que ocupa a porta e tente novamente:
```bash
lsof -i :3000
kill -9 <PID>
```

**Docker: `permission denied` ao rodar `docker compose`**
No Linux, adicione seu usuário ao grupo `docker`:
```bash
sudo usermod -aG docker $USER
# Faça logout e login novamente para o efeito ter efeito
```

**Build do Docker falha por falta de memória**
Aumente a memória disponível para o Docker Desktop (macOS/Windows) ou adicione swap no servidor:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**`typecheck` aponta erros mas o build funciona**
O `next.config.mjs` ignora erros de TypeScript no build (`ignoreBuildErrors: true`) para agilizar o desenvolvimento. Corrija os erros reportados pelo `npm run typecheck` antes de abrir um PR.
