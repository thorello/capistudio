# Configura rewrite SPA no Render para rotas como /admin funcionarem.
# Sem essa regra, o CDN retorna 404 em rotas client-side do React Router.
#
# Uso:
#   $env:RENDER_API_KEY = "rnd_..."
#   .\scripts\configure-render-spa.ps1

param(
    [string]$ServiceName = "capistudio-web"
)

$ErrorActionPreference = "Stop"

if (-not $env:RENDER_API_KEY) {
    throw "RENDER_API_KEY obrigatorio. Gere em https://dashboard.render.com/u/settings#api-keys"
}

$headers = @{
    Authorization = "Bearer $($env:RENDER_API_KEY)"
    "Content-Type" = "application/json"
    Accept = "application/json"
}

$services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=100" -Headers $headers
$serviceId = $null
foreach ($entry in $services) {
    if ($entry.service.name -eq $ServiceName) {
        $serviceId = $entry.service.id
        break
    }
}

if (-not $serviceId) {
    throw "Servico '$ServiceName' nao encontrado no Render."
}

Write-Host "Servico: $ServiceName ($serviceId)" -ForegroundColor Cyan

$existing = Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/routes" -Headers $headers
$hasSpaRule = $false
foreach ($entry in $existing) {
    $route = $entry.route
    if ($route.type -eq "rewrite" -and $route.source -eq "/*" -and $route.destination -eq "/index.html") {
        $hasSpaRule = $true
        break
    }
}

if ($hasSpaRule) {
    Write-Host "Regra SPA ja configurada: /* -> /index.html" -ForegroundColor Green
    exit 0
}

$body = @(
    @{
        type = "rewrite"
        source = "/*"
        destination = "/index.html"
    }
) | ConvertTo-Json

Invoke-RestMethod -Uri "https://api.render.com/v1/services/$serviceId/routes" -Method PUT -Headers $headers -Body $body | Out-Null

Write-Host "Regra SPA aplicada: /* -> /index.html" -ForegroundColor Green
Write-Host "Teste: https://capistudio.com/admin" -ForegroundColor Yellow
