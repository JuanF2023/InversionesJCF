# PowerShell 7+ recomendado (pwsh). Ejecutar desde la raíz del repo.

$ErrorActionPreference = "Stop"

function Backup-File($path) {
  if (Test-Path $path) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    Copy-Item $path "$path.bak.$stamp" -Force
  }
}

function Ensure-ImportLines {
  param(
    [string]$Text,
    [string]$ImportAuth,
    [string]$ImportTouch
  )
  $lines = $Text -split "`r?`n"

  $hasAuth  = ($lines | Where-Object { $_ -match [regex]::Escape($ImportAuth.Trim()) }).Count -gt 0
  $hasTouch = ($lines | Where-Object { $_ -match [regex]::Escape($ImportTouch.Trim()) }).Count -gt 0

  # Encuentra la última línea de import
  $lastImportIdx = -1
  for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim().StartsWith("import ")) { $lastImportIdx = $i }
  }

  if ($lastImportIdx -ge 0) {
    if (-not $hasAuth)  { $lines = $lines[0..$lastImportIdx] + $ImportAuth + $lines[($lastImportIdx+1)..($lines.Count-1)] }
    if (-not $hasTouch) { 
      # si acabamos de inyectar requireAuth, la posición cambió +1
      $lastImportIdx = -1
      for ($i=0; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Trim().StartsWith("import ")) { $lastImportIdx = $i }
      }
      $lines = $lines[0..$lastImportIdx] + $ImportTouch + $lines[($lastImportIdx+1)..($lines.Count-1)]
    }
  } else {
    # No hay imports; los agregamos al inicio
    $prefix = @()
    if (-not $hasAuth)  { $prefix += $ImportAuth }
    if (-not $hasTouch) { $prefix += $ImportTouch }
    $lines = $prefix + $lines
  }

  return ($lines -join "`n")
}

function Add-Middlewares-To-Routes {
  param(
    [string]$FilePath
  )

  if (-not (Test-Path $FilePath)) { return }

  Write-Host "  → Parchando $FilePath"

  $text = Get-Content $FilePath -Raw

  # 1) Asegurar imports
  $importAuth  = 'import { requireAuth } from "@/middlewares/auth.middleware.js";'
  $importTouch = 'import { touchSessionActivity } from "@/middlewares/sessionActivity.middleware.js";'
  $text = Ensure-ImportLines -Text $text -ImportAuth $importAuth -ImportTouch $importTouch

  # 2) Inyectar middlewares en llamadas router.METHOD(...)
  # Maneja casos en una sola línea; para multilínea intentamos una aproximación segura.
  # Reglas:
  #  - Si ya contiene requireAuth en esa ruta, no tocar.
  #  - Inserta "requireAuth, touchSessionActivity," justo después del primer argumento (path).

  $methods = "get|post|put|patch|delete"
  $patternSingle = "(router\.($methods)\s*\(\s*[^,]+,\s*)([^)]*\))"
  $text = [System.Text.RegularExpressions.Regex]::Replace(
    $text,
    $patternSingle,
    {
      param($m)
      $prefix = $m.Groups[1].Value
      $rest   = $m.Groups[3].Value
      if ($rest -match "requireAuth") {
        return $m.Value
      } else {
        # Inserta middlewares antes del resto
        return "$prefix requireAuth, touchSessionActivity, $rest"
      }
    },
    'IgnoreCase, Multiline'
  )

  # Intento para bloques multilínea tipo:
  # router.get(
  #   "/ruta",
  #   ctrl.handler
  # );
  # Lo convertimos si NO hay requireAuth en el bloque.
  $patternMulti = "router\.($methods)\s*\(\s*([\s\S]*?)\)"
  $text = [System.Text.RegularExpressions.Regex]::Replace(
    $text,
    $patternMulti,
    {
      param($m)
      $full = $m.Value
      if ($full -match "requireAuth") { return $full }
      # Insertar tras la primera coma
      $parts = $full -split ",", 2
      if ($parts.Count -eq 2) {
        return ($parts[0] + ", requireAuth, touchSessionActivity," + $parts[1])
      }
      return $full
    },
    'IgnoreCase'
  )

  Backup-File $FilePath
  Set-Content -Path $FilePath -Value $text -NoNewline
}

function Patch-Routes-In-Dir {
  param(
    [string]$DirPath
  )
  if (-not (Test-Path $DirPath)) {
    Write-Host "  (No existe) $DirPath" -ForegroundColor Yellow
    return
  }
  Get-ChildItem -Path $DirPath -Filter "*.routes.js" -Recurse | ForEach-Object {
    Add-Middlewares-To-Routes -FilePath $_.FullName
  }
}

function Setup-Css-Structure {
  param(
    [string]$ClientRoot
  )

  $indexCss = Join-Path $ClientRoot "src\index.css"
  $stylesDir = Join-Path $ClientRoot "src\styles"
  $componentsDir = Join-Path $stylesDir "components"
  $corpDir = Join-Path $stylesDir "corporativo"
  $restDir = Join-Path $stylesDir "restaurante"

  New-Item -ItemType Directory -Force -Path $stylesDir | Out-Null
  New-Item -ItemType Directory -Force -Path $componentsDir | Out-Null
  New-Item -ItemType Directory -Force -Path $corpDir | Out-Null
  New-Item -ItemType Directory -Force -Path $restDir | Out-Null

  $baseCss = Join-Path $stylesDir "base.css"
  $tabsCss = Join-Path $componentsDir "tabs.css"
  $corpOv  = Join-Path $corpDir "overrides.css"
  $restOv  = Join-Path $restDir "overrides.css"

  if (Test-Path $indexCss) {
    Write-Host "  → Reorganizando CSS"

    $original = Get-Content $indexCss -Raw

    # 1) Mover TODO index.css → styles/base.css (backup previo)
    Backup-File $indexCss
    Backup-File $baseCss
    Set-Content -Path $baseCss -Value $original -NoNewline

    # 2) Escribir index.css orquestador
    $newIndex = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base global (variables, resets si aplica) */
@import "./styles/base.css";

/* Componentes compartidos */
@import "./styles/components/tabs.css";

/* Overrides por dominio */
@import "./styles/corporativo/overrides.css";
@import "./styles/restaurante/overrides.css";
"@
    Set-Content -Path $indexCss -Value $newIndex -NoNewline

    # 3) Crear tabs.css si no existe con las reglas de línea inferior
    if (-not (Test-Path $tabsCss)) {
      $tabs = @"
/* Tabs estilo línea inferior (hover/activo) */
.tabline {
  position: relative;
  padding: 0 10px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  border-radius: 0;
}
.tabline::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: -2px;
  height: 2px;
  background: transparent;
  transition: background-color .15s ease;
}
.tabline:hover::after { background: color-mix(in srgb, var(--accent) 70%, transparent); }
.tabline[aria-current="page"]::after { background: var(--accent); }
.tabline--muted { color: color-mix(in srgb, var(--text) 80%, transparent); }
"@
      Set-Content -Path $tabsCss -Value $tabs -NoNewline
    }

    # 4) Crear overrides vacíos si no existen
    if (-not (Test-Path $corpOv)) { Set-Content -Path $corpOv -Value "/* Overrides exclusivos de corporativo */`n" -NoNewline }
    if (-not (Test-Path $restOv)) { Set-Content -Path $restOv -Value "/* Overrides exclusivos de restaurante */`n" -NoNewline }

    Write-Host "  → CSS reorganizado. Recuerda añadir data-app en los layouts raíz:"
    Write-Host '      <div data-app="corporativo"> ...' -ForegroundColor Yellow
    Write-Host '      <div data-app="restaurante"> ...' -ForegroundColor Yellow
  } else {
    Write-Host "  (No se encontró $indexCss)" -ForegroundColor Yellow
  }
}

# ====== EJECUCIÓN ======

Write-Host "Parchando rutas de Corporativo..." -ForegroundColor Cyan
$corpRoutes = "server\src\modules\corporativo\routes"
Patch-Routes-In-Dir -DirPath $corpRoutes

Write-Host "Parchando rutas de Restaurante..." -ForegroundColor Cyan
$restRoutes = "server\src\modules\restaurante\routes"
Patch-Routes-In-Dir -DirPath $restRoutes

Write-Host "Reorganizando CSS..." -ForegroundColor Cyan
$clientRoot = "client"
Setup-Css-Structure -ClientRoot $clientRoot

Write-Host "Listo ✅" -ForegroundColor Green
