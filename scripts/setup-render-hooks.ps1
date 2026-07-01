# Configura Deploy Hooks do Render como secrets no GitHub Actions.
#
# Modo interativo (recomendado):
#   .\scripts\setup-render-hooks.ps1
#
# Modo não interativo:
#   $env:RENDER_DEPLOY_HOOK_API = "https://api.render.com/deploy/srv-..."
#   $env:RENDER_DEPLOY_HOOK_WEB = "https://api.render.com/deploy/srv-..."
#   $env:GITHUB_TOKEN = "ghp_..."   # escopo: repo + secrets
#   .\scripts\setup-render-hooks.ps1 -Apply

param(
    [string]$Repo = "thorello/capistudio",
    [switch]$Apply,
    [switch]$TestOnly
)

$ErrorActionPreference = "Stop"

function Show-Instructions {
    Write-Host ""
    Write-Host "=== 1. Criar Deploy Hooks no Render ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "API (capistudio-api):"
    Write-Host "  https://dashboard.render.com -> capistudio-api -> Settings -> Deploy Hook"
    Write-Host "  Se não existir, clique em 'Create Deploy Hook' e copie a URL."
    Write-Host ""
    Write-Host "Web (capistudio-web):"
    Write-Host "  https://dashboard.render.com -> capistudio-web -> Settings -> Deploy Hook"
    Write-Host ""
    Write-Host "A URL tem o formato:"
    Write-Host "  https://api.render.com/deploy/srv-xxxxxxxxxxxxxxxxxxxx"
    Write-Host ""
    Write-Host "=== 2. Adicionar secrets no GitHub ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  https://github.com/$Repo/settings/secrets/actions"
    Write-Host ""
    Write-Host "  Nome do secret              | Valor"
    Write-Host "  ----------------------------|----------------------------------"
    Write-Host "  RENDER_DEPLOY_HOOK_API      | URL do hook da capistudio-api"
    Write-Host "  RENDER_DEPLOY_HOOK_WEB      | URL do hook da capistudio-web"
    Write-Host ""
    Write-Host "=== 3. Testar um hook manualmente ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host '  curl -X POST "https://api.render.com/deploy/srv-..."'
    Write-Host ""
    Write-Host "No Render, abra Events/Deploys do serviço e confirme um novo deploy em andamento."
    Write-Host ""
}

function Test-DeployHook {
    param([string]$Name, [string]$Url)

    if (-not $Url) {
        throw "$Name não informado."
    }
    if ($Url -notmatch '^https://api\.render\.com/deploy/srv-[a-zA-Z0-9]+$') {
        throw "$Name inválido. Esperado: https://api.render.com/deploy/srv-..."
    }

    Write-Host "Testando $Name..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $Url -Method POST -UseBasicParsing | Out-Null
    Write-Host "$Name OK — deploy acionado no Render." -ForegroundColor Green
}

function Set-GitHubSecret {
    param([string]$Name, [string]$Value)

    if (Get-Command gh -ErrorAction SilentlyContinue) {
        $env:GH_TOKEN = $env:GITHUB_TOKEN
        gh secret set $Name --repo $Repo --body $Value | Out-Null
        Write-Host "Secret $Name gravado via gh CLI." -ForegroundColor Green
        return
    }

    if (-not $env:GITHUB_TOKEN) {
        throw "GITHUB_TOKEN não definido e gh CLI não encontrado. Instale gh ou exporte GITHUB_TOKEN."
    }

    throw "Instale GitHub CLI (gh) para gravar secrets automaticamente: https://cli.github.com/"
}

Show-Instructions

$apiHook = $env:RENDER_DEPLOY_HOOK_API
$webHook = $env:RENDER_DEPLOY_HOOK_WEB

if (-not $Apply) {
    if (-not $apiHook) {
        $apiHook = Read-Host "Cole a URL do Deploy Hook da capistudio-api (ou Enter para pular)"
    }
    if (-not $webHook) {
        $webHook = Read-Host "Cole a URL do Deploy Hook da capistudio-web (ou Enter para pular)"
    }
}

if (-not $apiHook -or -not $webHook) {
    Write-Host "Hooks incompletos. Configure manualmente ou rode novamente com as URLs." -ForegroundColor Yellow
    exit 0
}

if ($TestOnly) {
    Test-DeployHook -Name "RENDER_DEPLOY_HOOK_API" -Url $apiHook
    Test-DeployHook -Name "RENDER_DEPLOY_HOOK_WEB" -Url $webHook
    exit 0
}

if ($Apply) {
    if (-not $env:GITHUB_TOKEN) {
        throw "GITHUB_TOKEN é obrigatório com -Apply (PAT com escopo repo)."
    }
    Set-GitHubSecret -Name "RENDER_DEPLOY_HOOK_API" -Value $apiHook
    Set-GitHubSecret -Name "RENDER_DEPLOY_HOOK_WEB" -Value $webHook
    Write-Host ""
    Write-Host "Secrets configurados em https://github.com/$Repo/settings/secrets/actions" -ForegroundColor Green
}

$test = Read-Host "Testar os hooks agora acionando deploy no Render? (s/N)"
if ($test -eq "s" -or $test -eq "S") {
    Test-DeployHook -Name "RENDER_DEPLOY_HOOK_API" -Url $apiHook
    Test-DeployHook -Name "RENDER_DEPLOY_HOOK_WEB" -Url $webHook
}

if (-not $Apply) {
    Write-Host ""
    Write-Host "Para gravar os secrets automaticamente no GitHub:" -ForegroundColor Cyan
    Write-Host @"

  `$env:RENDER_DEPLOY_HOOK_API = "$apiHook"
  `$env:RENDER_DEPLOY_HOOK_WEB = "$webHook"
  `$env:GITHUB_TOKEN = "ghp_..."
  .\scripts\setup-render-hooks.ps1 -Apply

"@
}
