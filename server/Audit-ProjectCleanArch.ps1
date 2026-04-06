# Audit-ProjectCleanArch.ps1
# Ejecutar desde: /server
# powershell -ExecutionPolicy Bypass -File .\Audit-ProjectCleanArch.ps1

$ErrorActionPreference = "Stop"

$root = (Resolve-Path ".").Path
$src  = Join-Path $root "src"
$mods = Join-Path $src  "modules"

if (!(Test-Path $mods)) {
  throw "No existe $mods. Ejecuta esto dentro de la carpeta /server."
}

function Add-Finding($arrRef, $type, $severity, $file, $detail, $hint) {
  $arrRef.Value += [pscustomobject]@{
    type     = $type
    severity = $severity
    file     = $file
    detail   = $detail
    hint     = $hint
  }
}

Write-Host "=== AUDIT: Clean Architecture (Directorio + Imports) ===" -ForegroundColor Cyan
Write-Host "Root: $root" -ForegroundColor DarkGray

$findings = @()

# ---------------------------
# 1) Estructura por módulo
# ---------------------------
$modules = Get-ChildItem $mods -Directory | Select-Object -ExpandProperty Name

$expectedTop = @("domain","application","infrastructure","interface")

foreach ($m in $modules) {
  $base = Join-Path $mods $m
  foreach ($need in $expectedTop) {
    $p = Join-Path $base $need
    if (!(Test-Path $p)) {
      Add-Finding ([ref]$findings) "structure.missingLayer" "warning" $base `
        "Falta capa '$need' en módulo '$m'." `
        "Crea: src/modules/$m/$need (aunque esté vacío al inicio)."
    }
  }
}

# --------------------------------------------
# 2) Reglas de ubicación (heurísticas fuertes)
# --------------------------------------------
# Modelos mongoose deben vivir en infrastructure/mongoose/models
$allModels = Get-ChildItem $mods -Recurse -File -Filter "*.model.js" |
  Select-Object -ExpandProperty FullName

foreach ($f in $allModels) {
  $norm = $f.Replace("\","/")
  if ($norm -match "/application/" -or $norm -match "/domain/" -or $norm -match "/interface/") {
    Add-Finding ([ref]$findings) "structure.modelWrongLayer" "error" $f `
      "Modelo (*.model.js) fuera de infraestructura." `
      "Mueve a: src/modules/<modulo>/infrastructure/mongoose/models/"
  }
  if ($norm -match "/infrastructure/mongoose/" -and $norm -notmatch "/infrastructure/mongoose/models/") {
    Add-Finding ([ref]$findings) "structure.mongooseModelFolder" "warning" $f `
      "Modelo en infrastructure/mongoose pero no dentro de /models/." `
      "Usa: infrastructure/mongoose/models/*.model.js"
  }
}

# Controllers deben estar en interface/http/controllers
$allControllers = Get-ChildItem $mods -Recurse -File -Filter "*.controller.js" |
  Select-Object -ExpandProperty FullName

foreach ($f in $allControllers) {
  $norm = $f.Replace("\","/")
  if ($norm -notmatch "/interface/http/controllers/") {
    Add-Finding ([ref]$findings) "structure.controllerWrongFolder" "error" $f `
      "Controller fuera de interface/http/controllers." `
      "Mueve a: src/modules/<modulo>/interface/http/controllers/"
  }
}

# Routes deben estar en interface/http/routes
$allRoutes = Get-ChildItem $mods -Recurse -File -Filter "*.routes.js" |
  Select-Object -ExpandProperty FullName

foreach ($f in $allRoutes) {
  $norm = $f.Replace("\","/")
  if ($norm -notmatch "/interface/http/routes/") {
    Add-Finding ([ref]$findings) "structure.routesWrongFolder" "error" $f `
      "Routes fuera de interface/http/routes." `
      "Mueve a: src/modules/<modulo>/interface/http/routes/"
  }
}

# ---------------------------------------------------------
# 3) Scan de imports (ilegalidades y el bug de "#modules/../")
# ---------------------------------------------------------
$jsFiles = Get-ChildItem $src -Recurse -File -Include "*.js"

$importRegex = '(?m)^\s*import\s+.*?\s+from\s+["'']([^"'']+)["'']\s*;?'
$reqRegex    = '(?m)^\s*const\s+.*?=\s+require\(\s*["'']([^"'']+)["'']\s*\)\s*;?'

foreach ($file in $jsFiles) {
  $path = $file.FullName
  $text = Get-Content $path -Raw

  $imports = @()
  $imports += ([regex]::Matches($text,$importRegex) | ForEach-Object { $_.Groups[1].Value })
  $imports += ([regex]::Matches($text,$reqRegex)    | ForEach-Object { $_.Groups[1].Value })

  $normFile = $path.Replace("\","/")

  foreach ($imp in $imports) {
    # 3.1) Prohibido: specifier con alias + ../ (rompe Node imports map)
    if ($imp -like "#modules/*" -and $imp -match "\.\./") {
      Add-Finding ([ref]$findings) "imports.invalidAliasTraversal" "error" $path `
        "Import inválido: '$imp' (alias #modules con ../)" `
        "Corrige a ruta directa: '#modules/<modulo>/interface/http/controllers/<file>.js' (sin ../)."
    }

    # 3.2) Anti-pattern: routes/../controllers dentro del alias (tu error exacto)
    if ($imp -match "#modules/.+/interface/http/routes/\.\./controllers/") {
      Add-Finding ([ref]$findings) "imports.routesParentToControllers" "error" $path `
        "Import inválido: '$imp' (routes/../controllers)" `
        "En routes, importa directo a controllers: '#modules/<mod>/interface/http/controllers/<ctrl>.js'"
    }

    # 3.3) Regla Clean: application NO debe importar infrastructure
    if ($normFile -match "/application/" -and $imp -like "#modules/*" -and $imp -match "/infrastructure/") {
      Add-Finding ([ref]$findings) "imports.applicationToInfrastructure" "error" $path `
        "application importa infrastructure: '$imp'" `
        "Arregla con inyección: el controller arma repo (infra) y pasa al use case (application)."
    }

    # 3.4) Regla Clean: domain NO debe importar nada fuera de domain
    if ($normFile -match "/domain/" -and $imp -like "#modules/*" -and $imp -notmatch "/domain/") {
      Add-Finding ([ref]$findings) "imports.domainLeak" "error" $path `
        "domain importa fuera de domain: '$imp'" `
        "Mueve esa dependencia a application o infrastructure."
    }
  }
}

# ---------------------------
# 4) Exportar reporte
# ---------------------------
$outJson = Join-Path $root "audit.clean-architecture.json"
$outTxt  = Join-Path $root "audit.clean-architecture.txt"

$summary = [pscustomobject]@{
  root     = $root
  when     = (Get-Date).ToString("s")
  modules  = $modules
  counts   = @{
    total    = $findings.Count
    errors   = ($findings | Where-Object { $_.severity -eq "error" }).Count
    warnings = ($findings | Where-Object { $_.severity -eq "warning" }).Count
  }
  findings = $findings
}

$summary | ConvertTo-Json -Depth 8 | Set-Content $outJson -Encoding UTF8

# TXT legible
$lines = @()
$lines += "=== CLEAN ARCH AUDIT ==="
$lines += "Root: $root"
$lines += "When: $($summary.when)"
$lines += "Modules: $($modules -join ', ')"
$lines += ""
$lines += "Total: $($summary.counts.total) | Errors: $($summary.counts.errors) | Warnings: $($summary.counts.warnings)"
$lines += ""

foreach ($f in ($findings | Sort-Object severity,type,file)) {
  $lines += "[$($f.severity.ToUpper())] $($f.type)"
  $lines += "File: $($f.file)"
  $lines += "Detail: $($f.detail)"
  $lines += "Hint: $($f.hint)"
  $lines += ""
}

$lines | Set-Content $outTxt -Encoding UTF8

Write-Host "OK Reporte JSON: $outJson" -ForegroundColor Green
Write-Host "OK Reporte TXT : $outTxt"  -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente: pega aqui el RESUMEN (Errors primero) y lo corregimos archivo por archivo." -ForegroundColor Cyan
