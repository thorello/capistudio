# Capi Studio

Landing page e API da **Capi Studio** — estúdio de desenvolvimento de jogos e software.

**Domínio:** [capistudio.com](https://capistudio.com)

> **Guia completo de setup e deploy → [docs/GUIA-SETUP-DEPLOY.md](docs/GUIA-SETUP-DEPLOY.md)**  
> Playbook reutilizável com checklist, DNS, Render, Supabase, CI/CD, OAuth e troubleshooting.

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
├── docs/              # Guia de setup e deploy
├── .github/workflows/ # CI/CD
└── render.yaml        # Blueprint Render
```

## Pré-requisitos

- Node.js 22+
- Java 21
- Conta [Supabase](https://supabase.com)
- Conta [Render](https://render.com)

## Setup local

### 1. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha as credenciais do Supabase e ajuste `VITE_API_URL` para `http://localhost:8080`.

### 2. Banco de dados (Supabase)

Execute as migrations em `supabase/migrations/` no SQL Editor do Supabase, ou use a CLI:

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

API disponível em [http://localhost:8080](http://localhost:8080). Health check: `GET /actuator/health`

### 5. Postgres local (opcional)

```bash
docker compose up -d
```

## Deploy e produção

Para deploy no Render, DNS, GitHub Actions, Google OAuth, rewrite SPA e demais configurações, siga o **[Guia completo de setup e deploy](docs/GUIA-SETUP-DEPLOY.md)**.

Resumo rápido:

1. Push para GitHub e sincronize o Blueprint Render (`render.yaml`)
2. Configure secrets no Render e no GitHub (`RENDER_DEPLOY_HOOK_*`)
3. Aplique migrations Supabase e configure auth
4. Configure DNS (apex, www, api)
5. Verifique `/admin` e health check da API

Scripts auxiliares em `scripts/` (detalhes no guia).

## Contato

- E-mail: [morello@capistudio.com](mailto:morello@capistudio.com)
