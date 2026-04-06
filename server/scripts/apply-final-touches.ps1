# PowerShell clásico o Core
$ErrorActionPreference = "Stop"

function Backup-File($path) {
  if (Test-Path $path) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    Copy-Item $path "$path.bak.$stamp" -Force
  }
}

function Add-DataApp-To-Layout {
  param(
    [string]$FilePath,
    [string]$AppName # "corporativo" | "restaurante"
  )
  if (-not (Test-Path $FilePath)) { return }

  Write-Host "  → Parchando $FilePath (data-app='$AppName')"

  $txt = Get-Content $FilePath -Raw

  # Busca la PRIMERA apertura de <div ... className="min-h-screen
  # y si NO tiene data-app, lo inserta.
  if ($txt -match '(<div\s+[^>]*className="[^"]*min-h-screen[^"]*")' -and $txt -notmatch 'data-app=') {
    $txt = [regex]::Replace(
      $txt,
      '(<div\s+)([^>]*className="[^"]*min-h-screen[^"]*")',
      "`$1data-app=`"$AppName`" `$2",
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
    Backup-File $FilePath
    Set-Content -Path $FilePath -Value $txt -NoNewline
  } else {
    Write-Host "    (Saltado: ya tiene data-app o no se halló el div raíz)"
  }
}

function Patch-Tailwind-Config {
  param(
    [string]$ConfigPath
  )
  if (-not (Test-Path $ConfigPath)) {
    Write-Host "  (No se encontró $ConfigPath)" -ForegroundColor Yellow
    return
  }

  Write-Host "  → Verificando content[] en $ConfigPath"
  $txt = Get-Content $ConfigPath -Raw

  if ($txt -notmatch '\./src/styles/\*\*/\*\.\{?css\}?') {
    # Inserta "./src/styles/**/*.{css}" dentro del array content
    $txt = [regex]::Replace(
      $txt,
      '(content\s*:\s*\[\s*)([^]]*)',
      '$1$2, "./src/styles/**/*.{css}"',
      [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
    Backup-File $ConfigPath
    Set-Content -Path $ConfigPath -Value $txt -NoNewline
  } else {
    Write-Host "    (Saltado: ya incluye ./src/styles/**/*.{css})"
  }
}

# ====== Rutas esperadas ======
$corpLayout = "client\src\features\corporativo\layout\CorporativoLayout.jsx"

# Buscamos un layout de restaurante de forma flexible
$restLayout = Get-ChildItem -Path "client\src\features\restaurante" -Filter "*Layout.jsx" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 | ForEach-Object { $_.FullName }

$tailwindConfig = "client\tailwind.config.js"

Write-Host "Aplicando últimos toques..." -ForegroundColor Cyan

# 1) data-app en corporativo
Add-DataApp-To-Layout -FilePath $corpLayout -AppName "corporativo"

# 2) data-app en restaurante (si existe)
if ($restLayout) {
  Add-DataApp-To-Layout -FilePath $restLayout -AppName "restaurante"
} else {
  Write-Host "  (No se encontró layout de restaurante; omitiendo data-app)" -ForegroundColor Yellow
}

# 3) tailwind content
Patch-Tailwind-Config -ConfigPath $tailwindConfig

Write-Host "Listo ✅" -ForegroundColor Green
