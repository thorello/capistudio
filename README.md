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

## DNS (capistudio.com)

No registrador do domínio, configure:

| Registro | Tipo | Destino |
|----------|------|---------|
| `@` (root) | CNAME | `capistudio-web.onrender.com` |
| `www` | CNAME | `capistudio-web.onrender.com` |
| `api` | CNAME | `capistudio-api.onrender.com` |

No Render, associe `capistudio.com` ao serviço **capistudio-web** e `api.capistudio.com` ao **capistudio-api**.

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
