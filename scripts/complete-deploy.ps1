# Complete deploy after GitHub token has write access.
# Usage:
#   $env:GITHUB_TOKEN = "ghp_..."
#   $env:RENDER_API_KEY = "rnd_..."
#   $env:SUPABASE_DB_PASSWORD = "..."
#   $env:VITE_SUPABASE_ANON_KEY = "..."
#   .\scripts\complete-deploy.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not $env:GITHUB_TOKEN) { throw "GITHUB_TOKEN required (Contents: Read and write)" }
if (-not $env:RENDER_API_KEY) { throw "RENDER_API_KEY required" }
if (-not $env:SUPABASE_DB_PASSWORD) { throw "SUPABASE_DB_PASSWORD required" }
if (-not $env:VITE_SUPABASE_ANON_KEY) { throw "VITE_SUPABASE_ANON_KEY required" }

$env:GH_TOKEN = $env:GITHUB_TOKEN
$ownerId = "tea-d919ufjeo5us73cl0b20"
$repoName = "capistudio"
$sbRef = "fdxbvjocdhrkzraepmwi"

if (-not (gh repo view "thorello/$repoName" 2>$null)) {
    gh repo create $repoName --public --description "Capi Studio landing page"
}
git remote remove origin 2>$null
git remote add origin "https://thorello:$($env:GITHUB_TOKEN)@github.com/thorello/$repoName.git"
git push -u origin main --force

$renderHeaders = @{
    Authorization = "Bearer $($env:RENDER_API_KEY)"
    "Content-Type" = "application/json"
    Accept = "application/json"
}

$apiBody = @{
    type = "web_service"
    name = "capistudio-api"
    ownerId = $ownerId
    repo = "https://github.com/thorello/$repoName"
    branch = "main"
    autoDeploy = "yes"
    serviceDetails = @{
        env = "docker"
        dockerfilePath = "./backend/Dockerfile"
        dockerContext = "./backend"
        plan = "free"
        region = "oregon"
        healthCheckPath = "/actuator/health"
    }
    envVars = @(
        @{ key = "OTEL_SERVICE_NAME"; value = "capistudio-api" }
        @{ key = "CORS_ALLOWED_ORIGINS"; value = "https://capistudio.com,https://www.capistudio.com" }
        @{ key = "SUPABASE_DB_URL"; value = "jdbc:postgresql://db.$sbRef.supabase.co:5432/postgres" }
        @{ key = "SUPABASE_DB_USER"; value = "postgres" }
        @{ key = "SUPABASE_DB_PASSWORD"; value = $env:SUPABASE_DB_PASSWORD }
    )
} | ConvertTo-Json -Depth 6

$webBody = @{
    type = "static_site"
    name = "capistudio-web"
    ownerId = $ownerId
    repo = "https://github.com/thorello/$repoName"
    branch = "main"
    autoDeploy = "yes"
    serviceDetails = @{
        buildCommand = "cd frontend && npm ci && npm run build"
        publishPath = "frontend/dist"
    }
    envVars = @(
        @{ key = "VITE_API_URL"; value = "https://api.capistudio.com" }
        @{ key = "VITE_SUPABASE_URL"; value = "https://$sbRef.supabase.co" }
        @{ key = "VITE_SUPABASE_ANON_KEY"; value = $env:VITE_SUPABASE_ANON_KEY }
    )
} | ConvertTo-Json -Depth 6

foreach ($payload in @($apiBody, $webBody)) {
    Invoke-RestMethod -Uri "https://api.render.com/v1/services" -Method POST -Headers $renderHeaders -Body $payload | Out-Null
}

Start-Sleep -Seconds 5
$services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=100" -Headers $renderHeaders
foreach ($entry in $services) {
  $svc = $entry.service
  if ($svc.name -eq "capistudio-web") {
    Invoke-RestMethod -Uri "https://api.render.com/v1/services/$($svc.id)/custom-domains" -Method POST -Headers $renderHeaders -Body '{"name":"capistudio.com"}' -ErrorAction SilentlyContinue | Out-Null
  }
  if ($svc.name -eq "capistudio-api") {
    Invoke-RestMethod -Uri "https://api.render.com/v1/services/$($svc.id)/custom-domains" -Method POST -Headers $renderHeaders -Body '{"name":"api.capistudio.com"}' -ErrorAction SilentlyContinue | Out-Null
  }
}

Write-Host "Deploy concluido. Configure DNS na Hostinger: .\scripts\setup-domains.ps1"
