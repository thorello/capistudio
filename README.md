# Capi Studio

Landing page e API da **Capi Studio** — estúdio de desenvolvimento de jogos e software.

**Domínio:** [capistudio.com](https://capistudio.com)

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite + TypeScript |
| Backend | Spring Boot 3 (Java 21) |
| Banco / Auth | Supabase (PostgreSQL) |
| Hospedagem | Render (Static Site + Web Service) |
| Observabilidade | OpenTelemetry (OTLP) |
| CI/CD | GitHub Actions |

## Estrutura

```
├── frontend/          # Landing page React
├── backend/           # API Spring Boot
├── supabase/          # Migrations e config
├── .github/workflows/ # CI/CD
└── render.yaml        # Blueprint Render
```

## Pré-requisitos

- Node.js 20+
- Java 21
- Maven 3.9+
- Conta [Supabase](https://supabase.com)
- Conta [Render](https://render.com)

## Setup local

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha as credenciais do Supabase e ajuste `VITE_API_URL` para `http://localhost:8080`.

### 2. Banco de dados (Supabase)

Execute a migration em `supabase/migrations/001_contact_submissions.sql` no SQL Editor do Supabase, ou use a CLI:

```bash
supabase db push
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

### 4. Backend

```bash
cd backend
./mvnw spring-boot:run
```

API disponível em [http://localhost:8080](http://localhost:8080).

Health check: `GET /actuator/health`

### 5. Postgres local (opcional)

```bash
docker compose up -d
```

## Deploy no Render

1. Crie um repositório no GitHub e faça push deste projeto
2. No Render, crie um **Blueprint** apontando para o `render.yaml`
3. Configure as variáveis secretas no dashboard:
   - `SUPABASE_DB_URL` — connection string JDBC do Supabase
   - `SUPABASE_DB_USER` — usuário do banco
   - `SUPABASE_DB_PASSWORD` — senha do banco
   - `VITE_SUPABASE_URL` — URL do projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` — chave anon do Supabase
   - `OTEL_EXPORTER_OTLP_ENDPOINT` — endpoint OTLP (opcional)
4. Crie **Deploy Hooks** para cada serviço e adicione como secrets no GitHub:
   - `RENDER_DEPLOY_HOOK_API`
   - `RENDER_DEPLOY_HOOK_WEB`

   **Passo a passo (Render):**
   1. Abra [Render Dashboard](https://dashboard.render.com)
   2. Clique em `capistudio-api` → **Settings** → **Deploy Hook**
   3. Se não houver hook, clique em **Create Deploy Hook** e copie a URL (`https://api.render.com/deploy/srv-...`)
   4. Repita para `capistudio-web`

   **Passo a passo (GitHub):**
   1. Abra [Secrets do repositório](https://github.com/thorello/capistudio/settings/secrets/actions)
   2. **New repository secret** → nome `RENDER_DEPLOY_HOOK_API` → cole a URL da API
   3. **New repository secret** → nome `RENDER_DEPLOY_HOOK_WEB` → cole a URL do frontend

   **Script auxiliar (Windows):**
   ```powershell
   .\scripts\setup-render-hooks.ps1
   ```
   Com `GITHUB_TOKEN` e URLs definidas, grava os secrets automaticamente:
   ```powershell
   $env:RENDER_DEPLOY_HOOK_API = "https://api.render.com/deploy/srv-..."
   $env:RENDER_DEPLOY_HOOK_WEB = "https://api.render.com/deploy/srv-..."
   $env:GITHUB_TOKEN = "ghp_..."
   .\scripts\setup-render-hooks.ps1 -Apply
   ```

   O workflow `Deploy` **falha** se algum secret estiver ausente (evita falso positivo de deploy).

5. **Roteamento SPA** (`/admin`, etc.): o static site precisa de uma regra de rewrite.
   Se `/admin` retornar 404, configure no Render:
   - **Dashboard** → `capistudio-web` → **Redirects/Rewrites** → Add Rule:
     - Source: `/*` | Destination: `/index.html` | Action: **Rewrite**
   - Ou via script (uma vez):
     ```powershell
     $env:RENDER_API_KEY = "rnd_..."
     .\scripts\configure-render-spa.ps1
     ```
   - Ou adicione o secret `RENDER_API_KEY` no GitHub — o workflow Deploy aplica automaticamente.

## DNS (capistudio.com)

O `render.yaml` já declara os domínios customizados (`capistudio.com` e `api.capistudio.com`). Após sincronizar o Blueprint no Render, configure o DNS no registrador.

### Hostinger (hPanel)

Acesse **hPanel → Domains → capistudio.com → DNS / Nameservers → DNS records**.

**Remova** registros conflitantes antes de adicionar os novos:
- Registro **A** de `@` apontando para IP antigo (ex.: `2.57.91.91`)
- **CNAME** ou **A** de `www` com destino antigo
- Registros **AAAA** (IPv6), se existirem

> A Hostinger não suporta CNAME/ALIAS no apex (`@`). Use registro **A** com o IP do load balancer do Render.

| Registro | Tipo | Name | Destino |
|----------|------|------|---------|
| Apex | **A** | `@` | `216.24.57.1` |
| WWW | **CNAME** | `www` | `capistudio-web.onrender.com` |
| API | **CNAME** | `api` | `capistudio-api.onrender.com` |

Confirme o IP exato no painel do Render ao adicionar o domínio customizado (Settings → Custom Domains).

O Render adiciona automaticamente `www.capistudio.com` com redirect para o apex ao configurar `capistudio.com`.

### Verificação

```powershell
.\scripts\setup-domains.ps1
```

Com API keys opcionais, o script também configura Render e Supabase:

```powershell
$env:RENDER_API_KEY = "rnd_..."
$env:SUPABASE_ACCESS_TOKEN = "sbp_..."
.\scripts\setup-domains.ps1
```

## OpenTelemetry

O backend exporta traces via OTLP. Configure no Render:

```
OTEL_SERVICE_NAME=capistudio-api
OTEL_EXPORTER_OTLP_ENDPOINT=https://seu-coletor:4318
OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
```

Compatível com Grafana Cloud, Honeycomb, Jaeger e outros backends OTLP.

## Contato

- E-mail: [morello@capistudio.com](mailto:morello@capistudio.com)

## Logo

Substitua `frontend/public/logo.svg` pelo arquivo PNG original do logo, se preferir. Atualize as referências nos componentes de `logo.svg` para `logo.png`.
