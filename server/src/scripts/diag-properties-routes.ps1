# scripts/diag-properties-routes.ps1
# Diagnóstico + fix opcional de rutas incorrectas para Properties (client)

param(
  [switch]$Fix
)

Write-Host "=== Inversiones JCF | Diagnóstico rutas Properties (CLIENT) ===" -ForegroundColor Cyan

$root = Get-Location
$client = Join-Path $root "client"

if (!(Test-Path $client)) {
  Write-Host "ERROR: No encuentro ./client desde: $root" -ForegroundColor Red
  Write-Host "TIP: Ejecuta este script desde la raíz del repo (donde existe client/ y server/)." -ForegroundColor Yellow
  exit 1
}

Write-Host "Client: $client" -ForegroundColor Gray

$targets = @(
  "/api/corporativo/properties",
  "/corporativo/properties"
)

$files = Get-ChildItem $client -Recurse -File -Include *.js,*.jsx,*.ts,*.tsx

# --- Reporte ---
Write-Host "`n--- 1) BUSCAR OCURRENCIAS ---" -ForegroundColor Cyan
$hits = @()

foreach ($t in $targets) {
  $found = $files | Select-String -SimpleMatch -Pattern $t -ErrorAction SilentlyContinue
  foreach ($m in $found) {
    $hits += [pscustomobject]@{
      Target = $t
      File   = $m.Path
      Line   = $m.LineNumber
      Text   = $m.Line.Trim()
    }
  }
}

if ($hits.Count -eq 0) {
  Write-Host "OK: No encontré rutas incorrectas en client/." -ForegroundColor Green
} else {
  $hits |
    Sort-Object Target, File, Line |
    Format-Table Target, Line, File, Text -AutoSize
}

# --- Fix opcional ---
if ($Fix) {
  Write-Host "`n--- 2) APLICAR FIX AUTOMÁTICO (sin backups) ---" -ForegroundColor Yellow
  Write-Host "Reemplazos:" -ForegroundColor Gray
  Write-Host "  /api/corporativo/properties  -> /api/properties" -ForegroundColor Gray
  Write-Host "  /corporativo/properties      -> /properties" -ForegroundColor Gray

  foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $new = $content `
      -replace [regex]::Escape("/api/corporativo/properties"), "/api/properties" `
      -replace [regex]::Escape("/corporativo/properties"), "/properties"

    if ($new -ne $content) {
      Set-Content $f.FullName -Value $new -NoNewline
      Write-Host "FIXED: $($f.FullName)" -ForegroundColor Green
    }
  }

  Write-Host "`nListo. Reinicia Vite (client) para ver cambios." -ForegroundColor Cyan
} else {
  Write-Host "`nTIP: Para aplicar el fix automático ejecuta:" -ForegroundColor Cyan
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\diag-properties-routes.ps1 -Fix" -ForegroundColor White
}
