# _audit\audit.clean-client.ps1
# ============================================================
# Inversiones JCF - AUDIT Clean Client (Feature-first)
# - Escanea imports viejos, duplicados y archivos fuera de módulo
# - Genera reportes en _audit\
# ============================================================

param(
    [string]$RepoRoot = (Resolve-Path ".").Path
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$p) { if (!(Test-Path $p)) { New-Item -ItemType Directory -Path $p | Out-Null } }

# --- CD al repo root
Set-Location $RepoRoot

$AuditDir = Join-Path $RepoRoot "_audit"
Ensure-Dir $AuditDir

$ClientRoot = Join-Path $RepoRoot "client"
$SrcRoot = Join-Path $ClientRoot "src"

if (!(Test-Path $ClientRoot)) { throw "No existe /client en: $RepoRoot" }
if (!(Test-Path $SrcRoot)) { throw "No existe /client/src en: $ClientRoot" }

Write-Host "=== AUDIT Clean Client ===" -ForegroundColor Cyan
Write-Host "RepoRoot : $RepoRoot"
Write-Host "Client   : $ClientRoot"
Write-Host "Src      : $SrcRoot"
Write-Host ""

# 1) Inventario de archivos fuente
$files = Get-ChildItem $SrcRoot -Recurse -File |
Where-Object { $_.Extension -in @(".js", ".jsx", ".ts", ".tsx") }

$allListPath = Join-Path $AuditDir "client-src-files.txt"
$files.FullName | Sort-Object | Set-Content -Encoding UTF8 $allListPath
Write-Host "OK: Inventario -> $allListPath" -ForegroundColor Green

# 2) Buscar imports viejos que están rompiendo Vite:
#    - "@/services/api/corporativo"
#    - "src/services/api/corporativo" (raro, pero lo hemos visto por logs)
$needles = @(
    "@/services/api/corporativo",
    "services/api/corporativo",
    "/src/services/api/corporativo"
)

$hits = @()
foreach ($f in $files) {
    $i = 0
    foreach ($line in (Get-Content $f.FullName -ErrorAction Stop)) {
        $i++
        foreach ($n in $needles) {
            if ($line -match [regex]::Escape($n)) {
                $hits += [pscustomobject]@{
                    file  = $f.FullName
                    line  = $i
                    match = $n
                    text  = $line.Trim()
                }
            }
        }
    }
}

$importsReport = Join-Path $AuditDir "imports-old-corporativo.csv"
$hits | Export-Csv -NoTypeInformation -Encoding UTF8 $importsReport
Write-Host "OK: Imports viejos -> $importsReport" -ForegroundColor Green

# 3) Detectar “corporativo” fuera de features/corporativo
#    (ej: components/ui/Modals/*Business* , services/api/corporativo/*)
$outside = $files |
Where-Object {
    $_.FullName -match "\\src\\components\\ui\\Modals\\.*(Business|Negocio|Categoria|Corporate|Corporativo)" -or
    $_.FullName -match "\\src\\services\\api\\corporativo\\"
} |
Select-Object FullName

$outsidePath = Join-Path $AuditDir "corporativo-outside-features.txt"
$outside.FullName | Sort-Object | Set-Content -Encoding UTF8 $outsidePath
Write-Host "OK: Corporativo fuera de features -> $outsidePath" -ForegroundColor Green

# 4) Chequeo de “archivos esperados” (para evitar los errores de export)
$expected = @(
    "client/src/features/corporativo/api/auth.api.js",
    "client/src/features/corporativo/api/businesses.api.js",
    "client/src/features/corporativo/api/businessCategories.api.js",
    "client/src/features/corporativo/api/index.js"
) | ForEach-Object { Join-Path $RepoRoot $_ }

$expectedReport = Join-Path $AuditDir "expected-files-status.txt"
$expectedStatus = foreach ($p in $expected) {
    "{0} => {1}" -f $p, (if (Test-Path $p) { "OK" } else { "MISSING" })
}
$expectedStatus | Set-Content -Encoding UTF8 $expectedReport
Write-Host "OK: Expected files -> $expectedReport" -ForegroundColor Green

Write-Host ""
Write-Host "DONE. Revisa _audit\*. Si hay error de Vite, casi siempre es IMPORT viejo o export faltante." -ForegroundColor Yellow
