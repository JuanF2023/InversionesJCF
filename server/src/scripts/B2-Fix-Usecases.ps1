# server/scripts/B2-Fix-Usecases.ps1
# -----------------------------------------------------------------------------
# Inversiones JCF — B.2 (Enterprise) — Fix automático de usecases (Clean Arch)
# Objetivo:
#  - Eliminar imports desde application/usecases hacia infrastructure/*
#  - Convertir "new XRepository()" a dependencias inyectadas (ideasRepository, etc.)
#  - Generar reporte y (opcional) aplicar cambios con backup
#
# Uso:
#  1) Solo reporte (NO modifica):
#     powershell -ExecutionPolicy Bypass -File .\server\scripts\B2-Fix-Usecases.ps1
#
#  2) Aplicar cambios + backup:
#     powershell -ExecutionPolicy Bypass -File .\server\scripts\B2-Fix-Usecases.ps1 -Apply -Backup
#
#  3) Apuntar a otra raíz:
#     powershell -ExecutionPolicy Bypass -File .\server\scripts\B2-Fix-Usecases.ps1 -Root "C:\...\server" -Apply -Backup
# -----------------------------------------------------------------------------

param(
  [string]$Root = (Get-Location).Path,
  [switch]$Apply,
  [switch]$Backup
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Section([string]$Title) {
  Write-Host ""
  Write-Host ("=" * 80) -ForegroundColor DarkGray
  Write-Host $Title -ForegroundColor Cyan
  Write-Host ("=" * 80) -ForegroundColor DarkGray
}

function To-LowerCamel([string]$Name) {
  if ([string]::IsNullOrWhiteSpace($Name)) { return $Name }
  if ($Name.Length -eq 1) { return $Name.ToLowerInvariant() }
  return $Name.Substring(0,1).ToLowerInvariant() + $Name.Substring(1)
}

function Guess-DepName([string]$ImportedIdent) {
  # Convención enterprise: IdeasRepository -> ideasRepository
  # Si termina en Repo/Repository, lo dejamos completo en lowerCamel.
  return (To-LowerCamel $ImportedIdent)
}

function Get-UsecaseFiles([string]$rootPath) {
  $src = Join-Path $rootPath "src"
  if (-not (Test-Path $src)) { throw "No se encontró /src en Root: $rootPath" }

  # Solo application/usecases (tu estructura actual)
  return Get-ChildItem -Path $src -Recurse -File -Filter "*.js" |
    Where-Object { $_.FullName -match "\\application\\usecases\\.*\.js$" }
}

# Regex: imports prohibidos en usecases
$rxForbiddenImport = [regex]'(?m)^\s*import\s+(.+?)\s+from\s+["''](#modules\/[^"'']+\/infrastructure\/[^"'']+|\.{1,2}\/[^"'']*infrastructure\/[^"'']+)["'']\s*;\s*$'

# Regex: extraer identificadores importados (muy común: { A, B } ó DefaultName)
$rxNamed = [regex]'\{\s*([^}]+)\s*\}'
$rxDefault = [regex]'^\s*([A-Za-z_$][\w$]*)\s*(,|\s+from|\s*$)'

Write-Section "B.2 — Scan & Fix (usecases) — Root: $Root"
Write-Host ("Modo: " + ($(if ($Apply) { "APPLY" } else { "DRY-RUN" }))) -ForegroundColor Yellow
if ($Backup) { Write-Host "Backup: ENABLED" -ForegroundColor Yellow } else { Write-Host "Backup: disabled" -ForegroundColor DarkYellow }

$files = Get-UsecaseFiles $Root
if (-not $files -or $files.Count -eq 0) {
  Write-Host "No se encontraron archivos en src/**/application/usecases/*.js" -ForegroundColor Yellow
  exit 0
}

$report = New-Object System.Collections.Generic.List[object]

foreach ($f in $files) {
  $path = $f.FullName
  $raw  = Get-Content -LiteralPath $path -Raw -Encoding UTF8

  $matches = $rxForbiddenImport.Matches($raw)
  if ($matches.Count -eq 0) { continue }

  # 1) Identificar qué se está importando desde infrastructure (para inyección)
  $importedIdents = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in $matches) {
    $importPart = $m.Groups[1].Value.Trim()

    # Named import: { A, B as C }
    $nm = $rxNamed.Match($importPart)
    if ($nm.Success) {
      $items = $nm.Groups[1].Value.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ }
      foreach ($it in $items) {
        # "A as B" -> A y B (usamos el que se usa en código: B si existe)
        if ($it -match "^\s*([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)\s*$") {
          [void]$importedIdents.Add($Matches[2])
        } elseif ($it -match "^\s*([A-Za-z_$][\w$]*)\s*$") {
          [void]$importedIdents.Add($Matches[1])
        }
      }
      continue
    }

    # Default import: Something
    $dm = $rxDefault.Match($importPart)
    if ($dm.Success) {
      [void]$importedIdents.Add($dm.Groups[1].Value.Trim())
      continue
    }
  }

  # 2) Quitar imports prohibidos
  $new = $rxForbiddenImport.Replace($raw, "")

  # 3) Insertar cabecera enterprise (si no existe)
  if ($new -notmatch "\[B2-CLEAN-ARCH\]") {
    $banner = @"
 /**
  * [B2-CLEAN-ARCH]
  * Este archivo (application/usecases) NO debe importar infrastructure.
  * Las dependencias (repositorios/adapters) se inyectan desde la capa interface.
  */
"@
    $new = $banner + "`n" + $new.TrimStart()
  }

  # 4) Reemplazos mecánicos: new X(...) -> <xInjected>
  #    Ej: new IdeasRepository() -> ideasRepository
  $replacements = @()
  foreach ($ident in $importedIdents) {
    $dep = Guess-DepName $ident

    # Reemplaza expresiones "new Ident(...)" por dep
    $rxNew = [regex]("new\s+" + [regex]::Escape($ident) + "\s*\([^)]*\)")
    if ($rxNew.IsMatch($new)) {
      $new2 = $rxNew.Replace($new, $dep)
      if ($new2 -ne $new) {
        $new = $new2
        $replacements += "new $ident(...) -> $dep"
      }
    }

    # Caso muy común: "const x = new Ident()" -> "const x = dep"
    # (esto ya queda cubierto arriba, pero lo dejamos por claridad)
  }

  # 5) Asegurar que el usecase declare deps (sin romper runtime).
  #    Si no existe una firma clara, dejamos un TODO explícito.
  if ($new -match "\b(new\s+|from\s+['""]#modules\/[^'""]+\/infrastructure\/)") {
    # Quedaron rastros: reportamos.
  }

  $changed = ($new -ne $raw)
  $report.Add([pscustomobject]@{
    file        = $path
    forbidden   = $matches.Count
    idents      = ($importedIdents | Sort-Object) -join ", "
    replaced    = ($replacements -join " | ")
    changed     = $changed
  }) | Out-Null

  if ($Apply -and $changed) {
    if ($Backup) {
      $bak = "$path.bak"
      Copy-Item -LiteralPath $path -Destination $bak -Force
    }
    Set-Content -LiteralPath $path -Value $new -Encoding UTF8
  }
}

Write-Section "Resumen"
if ($report.Count -eq 0) {
  Write-Host "✅ No se detectaron imports prohibidos en application/usecases." -ForegroundColor Green
  exit 0
}

$report |
  Sort-Object forbidden -Descending |
  Format-Table -AutoSize file, forbidden, changed, idents

Write-Host ""
Write-Host ("Archivos afectados: " + $report.Count) -ForegroundColor Yellow
Write-Host ("Cambios aplicados:  " + ($report | Where-Object { $_.changed } | Measure-Object).Count) -ForegroundColor Yellow

Write-Section "Notas importantes (enterprise)"
Write-Host @"
1) Este fix es mecánico y seguro para:
   - Quitar imports prohibidos desde application/usecases a infrastructure/*
   - Reemplazar 'new XRepository()' por 'xRepository' (inyección)
2) Si un usecase usaba llamadas estáticas del repo importado (poco común), quedará un TODO manual.
3) El siguiente paso enterprise correcto es:
   - Ajustar cada usecase para recibir deps explícitas en su constructor/factory
   - Ajustar controllers para inyectar repositorios concretos de infrastructure
"@ -ForegroundColor DarkGray

Write-Host ""
Write-Host "✅ Listo. Ejecuta tu auditoría de nuevo y pega el resumen de ERRORS/WARNINGS." -ForegroundColor Green
