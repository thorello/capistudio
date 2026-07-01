# Configure capistudio.com custom domains on Render, Supabase, and verify DNS.
# Usage:
#   $env:RENDER_API_KEY = "rnd_..."           # optional - auto-configures Render domains
#   $env:SUPABASE_ACCESS_TOKEN = "sbp_..."    # optional - updates Supabase auth URLs
#   .\scripts\setup-domains.ps1

$ErrorActionPreference = "Stop"

$Domain = "capistudio.com"
$WebTarget = "capistudio-web.onrender.com"
$ApiTarget = "capistudio-api.onrender.com"
$RenderApexIp = "216.24.57.1"
$SupabaseProjectRef = "fdxbvjocdhrkzraepmwi"

function Write-DnsInstructions {
    Write-Host ""
    Write-Host "=== DNS na Hostinger (hPanel) ===" -ForegroundColor Cyan
    Write-Host "Acesse: hPanel -> Domains -> $Domain -> DNS / Nameservers -> DNS records"
    Write-Host ""
    Write-Host "1. REMOVA registros conflitantes:" -ForegroundColor Yellow
    Write-Host "   - A record @ apontando para 2.57.91.91 (ou outro IP antigo)"
    Write-Host "   - CNAME/A de www com destino antigo"
    Write-Host "   - Registros AAAA (IPv6), se existirem"
    Write-Host ""
    Write-Host "2. ADICIONE os registros abaixo:" -ForegroundColor Green
    Write-Host ""
    Write-Host "   | Tipo   | Name | Conteudo                    |"
    Write-Host "   |--------|------|-----------------------------|"
    Write-Host "   | A      | @    | $RenderApexIp               |"
    Write-Host "   | CNAME  | www  | $WebTarget                  |"
    Write-Host "   | CNAME  | api  | $ApiTarget                  |"
    Write-Host ""
    Write-Host "Nota: Hostinger nao suporta CNAME no apex (@). Use registro A." -ForegroundColor DarkGray
}

function Get-RenderServiceId {
    param([string]$ServiceName)
    $headers = @{
        Authorization = "Bearer $($env:RENDER_API_KEY)"
        Accept = "application/json"
    }
    $services = Invoke-RestMethod -Uri "https://api.render.com/v1/services?limit=100" -Headers $headers
    foreach ($entry in $services) {
        if ($entry.service.name -eq $ServiceName) {
            return $entry.service.id
        }
    }
    return $null
}

function Add-RenderCustomDomain {
    param([string]$ServiceId, [string]$DomainName)
    $headers = @{
        Authorization = "Bearer $($env:RENDER_API_KEY)"
        Accept = "application/json"
        "Content-Type" = "application/json"
    }
    $body = @{ name = $DomainName } | ConvertTo-Json
    try {
        Invoke-RestMethod -Uri "https://api.render.com/v1/services/$ServiceId/custom-domains" `
            -Method POST -Headers $headers -Body $body | Out-Null
        Write-Host "  + Dominio adicionado: $DomainName" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 409) {
            Write-Host "  = Dominio ja existe: $DomainName" -ForegroundColor DarkYellow
        } else {
            throw
        }
    }
}

function Update-SupabaseAuthUrls {
    $headers = @{
        Authorization = "Bearer $($env:SUPABASE_ACCESS_TOKEN)"
        "Content-Type" = "application/json"
    }
    $body = @{
        site_url = "https://$Domain"
        uri_allow_list = "https://$Domain,https://www.$Domain,https://$Domain/admin,https://www.$Domain/admin"
    } | ConvertTo-Json
    Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$SupabaseProjectRef/config/auth" `
        -Method PATCH -Headers $headers -Body $body | Out-Null
    Write-Host "Supabase auth URLs atualizadas para https://$Domain" -ForegroundColor Green
}

function Test-DnsRecord {
    param([string]$Hostname, [string]$Expected)
    try {
        $result = Resolve-DnsName -Name $Hostname -Type A,CNAME -ErrorAction Stop
        $values = @($result | ForEach-Object {
            if ($_.Type -eq "CNAME") { $_.NameHost.TrimEnd('.') }
            else { $_.IPAddress }
        })
        $match = $values | Where-Object { $_ -eq $Expected -or $_ -like "*$Expected*" }
        return [bool]$match
    } catch {
        return $false
    }
}

function Test-HttpsEndpoint {
    param([string]$Url)
    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -MaximumRedirection 5 -TimeoutSec 15 -UseBasicParsing
        return $response.StatusCode -eq 200
    } catch {
        return $false
    }
}

Write-Host "=== Setup de dominios: $Domain ===" -ForegroundColor Cyan

# --- Render custom domains ---
if ($env:RENDER_API_KEY) {
    Write-Host ""
    Write-Host "Configurando dominios no Render..." -ForegroundColor Cyan
    $webId = Get-RenderServiceId -ServiceName "capistudio-web"
    $apiId = Get-RenderServiceId -ServiceName "capistudio-api"
    if (-not $webId) { throw "Servico capistudio-web nao encontrado no Render" }
    if (-not $apiId) { throw "Servico capistudio-api nao encontrado no Render" }
    Add-RenderCustomDomain -ServiceId $webId -DomainName $Domain
    Add-RenderCustomDomain -ServiceId $apiId -DomainName "api.$Domain"
    Write-Host "Render: dominios configurados. O Render adiciona www.$Domain automaticamente." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "RENDER_API_KEY nao definida - configure dominios manualmente no Render:" -ForegroundColor Yellow
    Write-Host "  capistudio-web -> $Domain e www.$Domain"
    Write-Host "  capistudio-api -> api.$Domain"
    Write-Host "  Ou sincronize o Blueprint - render.yaml ja inclui domains."
}

# --- Supabase auth URLs ---
if ($env:SUPABASE_ACCESS_TOKEN) {
    Write-Host ""
    Write-Host "Atualizando Supabase auth URLs..." -ForegroundColor Cyan
    Update-SupabaseAuthUrls
} else {
    Write-Host ""
    Write-Host "SUPABASE_ACCESS_TOKEN nao definida - confirme manualmente no Supabase Dashboard:" -ForegroundColor Yellow
    Write-Host "  Authentication -> URL Configuration"
    Write-Host "  Site URL: https://$Domain"
    Write-Host "  Redirect URLs: https://$Domain, https://www.$Domain, https://$Domain/admin"
    Write-Host "  Authentication -> Providers -> Google: habilite e configure Client ID/Secret"
}

# --- Hostinger DNS instructions ---
Write-DnsInstructions

# --- Verify DNS and HTTPS ---
Write-Host ""
Write-Host "=== Verificacao ===" -ForegroundColor Cyan

$checks = @(
    @{ Name = "capistudio.com (A)"; Host = $Domain; Expected = $RenderApexIp; Https = "https://$Domain" }
    @{ Name = "www.capistudio.com (CNAME)"; Host = "www.$Domain"; Expected = $WebTarget; Https = "https://www.$Domain" }
    @{ Name = "api.capistudio.com (CNAME)"; Host = "api.$Domain"; Expected = $ApiTarget; Https = "https://api.$Domain/actuator/health" }
)

$allDnsOk = $true
foreach ($check in $checks) {
    $dnsOk = Test-DnsRecord -Hostname $check.Host -Expected $check.Expected
    $httpsOk = if ($dnsOk) { Test-HttpsEndpoint -Url $check.Https } else { $false }
    $dnsStatus = if ($dnsOk) { "OK" } else { "PENDENTE" }
    $httpsStatus = if ($httpsOk) { "OK" } else { "PENDENTE" }
    if (-not $dnsOk) { $allDnsOk = $false }
    Write-Host "  $($check.Name): DNS=$dnsStatus  HTTPS=$httpsStatus"
}

Write-Host ""
if ($allDnsOk) {
    Write-Host "DNS configurado corretamente!" -ForegroundColor Green
} else {
    Write-Host "DNS ainda nao propagado. Configure os registros na Hostinger e execute novamente." -ForegroundColor Yellow
}
