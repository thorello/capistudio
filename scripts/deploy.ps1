# Deploy script — requires environment variables:
#   GITHUB_TOKEN      — PAT with repo + workflow scopes
#   GITHUB_USERNAME   — your GitHub username
#   RENDER_API_KEY    — Render API key (Dashboard > Account Settings)
#   SUPABASE_ACCESS_TOKEN — Supabase access token (Dashboard > Account > Access Tokens)

param(
    [string]$RepoName = "capistudio"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not $env:GITHUB_TOKEN) { throw "GITHUB_TOKEN is required" }
if (-not $env:GITHUB_USERNAME) { throw "GITHUB_USERNAME is required" }

# --- GitHub ---
$env:GH_TOKEN = $env:GITHUB_TOKEN
gh auth status | Out-Null

$remoteUrl = "https://github.com/$($env:GITHUB_USERNAME)/$RepoName.git"
if (-not (git remote get-url origin 2>$null)) {
    git remote add origin $remoteUrl
}

$repoExists = gh repo view "$($env:GITHUB_USERNAME)/$RepoName" 2>$null
if (-not $repoExists) {
    gh repo create $RepoName --public --source=. --remote=origin --push
} else {
    git push -u origin main
}

Write-Host "GitHub push complete: $remoteUrl"

# --- Supabase ---
if ($env:SUPABASE_ACCESS_TOKEN) {
    $headers = @{
        Authorization = "Bearer $($env:SUPABASE_ACCESS_TOKEN)"
        "Content-Type" = "application/json"
    }

    $projects = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects" -Headers $headers
    $project = $projects | Where-Object { $_.name -eq "capistudio" } | Select-Object -First 1

    if (-not $project) {
        $body = @{
            name = "capistudio"
            organization_id = (Invoke-RestMethod -Uri "https://api.supabase.com/v1/organizations" -Headers $headers)[0].id
            region = "us-east-1"
            db_pass = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
        } | ConvertTo-Json

        $project = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects" -Method POST -Headers $headers -Body $body
        Write-Host "Supabase project created: $($project.id)"
        Write-Host "SAVE DB PASSWORD: $($body | ConvertFrom-Json | Select-Object -ExpandProperty db_pass)"
    } else {
        Write-Host "Supabase project already exists: $($project.id)"
    }

    $migration = Get-Content "$Root/supabase/migrations/001_contact_submissions.sql" -Raw
    Write-Host "Run migration manually in Supabase SQL Editor or via CLI:"
    Write-Host $migration
}

# --- Render ---
if ($env:RENDER_API_KEY) {
    $renderHeaders = @{
        Authorization = "Bearer $($env:RENDER_API_KEY)"
        "Content-Type" = "application/json"
    }

    Write-Host "Create Blueprint at https://dashboard.render.com/blueprints"
    Write-Host "Connect repo: $($env:GITHUB_USERNAME)/$RepoName"
    Write-Host "Render will read render.yaml automatically."
}

Write-Host "Deploy script finished."
