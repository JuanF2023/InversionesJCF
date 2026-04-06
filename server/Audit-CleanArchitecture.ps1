# Audit-CleanArchitecture.ps1
# Ejecutar desde: server/
# Genera: audit.clean-architecture.json

$ErrorActionPreference = "Stop"

Write-Host "`n=== AUDITORÍA CLEAN ARCHITECTURE (Inversiones JCF) ===`n" -ForegroundColor Cyan

$root = (Resolve-Path ".").Path
$src  = Join-Path $root "src"

if (!(Test-Path $src)) {
  Write-Host "❌ No existe ./src. Ejecuta desde la carpeta server/." -ForegroundColor Red
  exit 1
}

# --- 1) Archivos JS a analizar ---
$files = Get-ChildItem $src -Recurse -File -Include *.js |
  Where-Object { $_.FullName -notmatch "\\node_modules\\" }

Write-Host ("Archivos analizados: " + $files.Count) -ForegroundColor Yellow

# --- 2) Regex ---
$reImport = [regex]"(?m)^\s*import\s+[^;]*?\s+from\s+['""]([^'""]+)['""]\s*;"
$reDynImport = [regex]"(?m)import\(\s*['""]([^'""]+)['""]\s*\)"
$reRequire = [regex]"(?m)\brequire\(\s*['""]([^'""]+)['""]\s*\)"
$reExportFrom = [regex]"(?m)^\s*export\s+\*\s+from\s+['""]([^'""]+)['""]\s*;"

function Get-Layer($path) {
  $p = $path.ToLower()
  if ($p -match "\\src\\modules\\[^\\]+\\domain\\") { return "domain" }
  if ($p -match "\\src\\modules\\[^\\]+\\application\\") { return "application" }
  if ($p -match "\\src\\modules\\[^\\]+\\infrastructure\\") { return "infrastructure" }
  if ($p -match "\\src\\modules\\[^\\]+\\interface\\") { return "interface" }
  if ($p -match "\\src\\core\\") { return "core" }
  return "other"
}

function Get-ModuleName($path) {
  $m = [regex]::Match($path, "\\src\\modules\\([^\\]+)\\", "IgnoreCase")
  if ($m.Success) { return $m.Groups[1].Value }
  return ""
}

# --- 3) Reglas enterprise (Clean Architecture) ---
# Permitidos (origen -> destino)
$allowed = @{
  "domain" = @("domain", "core") # Domain solo depende de domain/core (si core es puro)
  "application" = @("application", "domain", "core")
  "infrastructure" = @("infrastructure", "application", "domain", "core")
  "interface" = @("interface", "application", "domain", "core")
  "core" = @("core")
  "other" = @("other","core")
}

# --- 4) Hallazgos ---
$violations = New-Object System.Collections.Generic.List[object]
$warnings   = New-Object System.Collections.Generic.List[object]
$stats      = @{}

foreach ($f in $files) {
  $layer = Get-Layer $f.FullName
  $module = Get-ModuleName $f.FullName
  if (-not $stats.ContainsKey($module)) { $stats[$module] = @{ domain=0; application=0; infrastructure=0; interface=0; other=0 } }
  $stats[$module][$layer]++

  $text = Get-Content $f.FullName -Raw

  # require() prohibido (ESM)
  foreach ($m in $reRequire.Matches($text)) {
    $warnings.Add([pscustomobject]@{
      type="require_not_allowed"
      file=$f.FullName
      detail=$m.Groups[0].Value
    })
  }

  # imports + export-from + dynamic import
  $all = @()
  $all += $reImport.Matches($text)
  $all += $reExportFrom.Matches($text)
  $all += $reDynImport.Matches($text)

  foreach ($im in $all) {
    $imp = $im.Groups[1].Value

    # Warnings de estilo / legacy
    if ($imp -match "^\.\./\.\./\.\./") {
      $warnings.Add([pscustomobject]@{
        type="deep_relative_import"
        file=$f.FullName
        import=$imp
      })
    }
    if ($imp -match "/models/" -or $imp -match "/services/") {
      $warnings.Add([pscustomobject]@{
        type="legacy_path_suspected"
        file=$f.FullName
        import=$imp
      })
    }

    # Solo validamos reglas de capa para alias internos o relativos
    $isInternal = ($imp.StartsWith("#") -or $imp.StartsWith("."))
    if (-not $isInternal) { continue }

    # Intento inferir capa destino a partir del string del import (cuando es alias #modules)
    $targetLayer = "other"
    $impLower = $imp.ToLower()

    if ($impLower -match "#modules/[^/]+/domain/") { $targetLayer="domain" }
    elseif ($impLower -match "#modules/[^/]+/application/") { $targetLayer="application" }
    elseif ($impLower -match "#modules/[^/]+/infrastructure/") { $targetLayer="infrastructure" }
    elseif ($impLower -match "#modules/[^/]+/interface/") { $targetLayer="interface" }
    elseif ($impLower -match "#core/") { $targetLayer="core" }

    # Para imports relativos no podemos inferir perfecto sin resolver path; igual, si contiene /interface/ etc
    if ($impLower -match "/domain/") { $targetLayer="domain" }
    if ($impLower -match "/application/") { $targetLayer="application" }
    if ($impLower -match "/infrastructure/") { $targetLayer="infrastructure" }
    if ($impLower -match "/interface/") { $targetLayer="interface" }

    # Violación de dependencia
    if ($allowed.ContainsKey($layer)) {
      $okTargets = $allowed[$layer]
      if ($targetLayer -ne "other" -and ($okTargets -notcontains $targetLayer)) {
        $violations.Add([pscustomobject]@{
          file=$f.FullName
          fromLayer=$layer
          toLayer=$targetLayer
          import=$imp
        })
      }
    }
  }
}

# --- 5) Output ---
Write-Host "`n=== RESULTADOS ===" -ForegroundColor Yellow
Write-Host ("Violaciones: " + $violations.Count) -ForegroundColor Red
Write-Host ("Warnings:    " + $warnings.Count) -ForegroundColor Magenta

if ($violations.Count -gt 0) {
  Write-Host "`n--- VIOLACIONES (deben corregirse) ---" -ForegroundColor Red
  $violations | Sort-Object fromLayer,toLayer,file | ForEach-Object {
    Write-Host ("❌ [" + $_.fromLayer + " -> " + $_.toLayer + "] " + $_.file) -ForegroundColor Red
    Write-Host ("   import: " + $_.import)
  }
} else {
  Write-Host "`n✅ No se detectaron violaciones de capas." -ForegroundColor Green
}

if ($warnings.Count -gt 0) {
  Write-Host "`n--- WARNINGS (mejoras recomendadas) ---" -ForegroundColor Magenta
  $warnings | Group-Object type | ForEach-Object {
    Write-Host ("⚠ " + $_.Name + ": " + $_.Count)
  }
}

Write-Host "`n--- ESTRUCTURA POR MÓDULO (conteo de archivos por capa) ---" -ForegroundColor Cyan
foreach ($k in ($stats.Keys | Sort-Object)) {
  if ([string]::IsNullOrWhiteSpace($k)) { continue }
  $s = $stats[$k]
  Write-Host ("• " + $k + "  domain=" + $s.domain + "  application=" + $s.application + "  infrastructure=" + $s.infrastructure + "  interface=" + $s.interface + "  other=" + $s.other)
}

# --- 6) Guardar reporte ---
$report = [pscustomobject]@{
  generatedAt = (Get-Date).ToString("s")
  filesAnalyzed = $files.Count
  violations = $violations
  warnings = $warnings
  stats = $stats
}
$reportPath = Join-Path $root "audit.clean-architecture.json"
$report | ConvertTo-Json -Depth 8 | Set-Content -Encoding UTF8 $reportPath

Write-Host "`n📄 Reporte generado: $reportPath" -ForegroundColor Green
Write-Host "`nSiguiente: pega aquí el resumen de Violaciones/Warnnings y lo corregimos archivo por archivo (sin deuda técnica)." -ForegroundColor Cyan
