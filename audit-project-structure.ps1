# ==========================================
# AUDITORÍA DE ESTRUCTURA - Inversiones JCF
# READ ONLY - NO MODIFICA NADA
# ==========================================

$Root = Get-Location
$OutFile = Join-Path $Root "_audit\project-structure.txt"

# Crear carpeta _audit si no existe
if (!(Test-Path "_audit")) {
    New-Item -ItemType Directory -Path "_audit" | Out-Null
}

"=== INVERSIONES JCF - PROJECT STRUCTURE AUDIT ===" | Out-File $OutFile -Encoding UTF8
"Root: $Root" | Out-File $OutFile -Append
"Generated: $(Get-Date)" | Out-File $OutFile -Append
"" | Out-File $OutFile -Append

$ExcludeDirs = @(
    "node_modules",
    ".git",
    ".vscode",
    "dist",
    "build",
    ".next"
)

function Write-Tree {
    param (
        [string]$Path,
        [int]$Level = 0
    )

    $Indent = ("  " * $Level)
    Get-ChildItem -Path $Path -Force | Where-Object {
        $ExcludeDirs -notcontains $_.Name
    } | Sort-Object { $_.PSIsContainer } -Descending | ForEach-Object {

        if ($_.PSIsContainer) {
            "$Indent📁 $($_.Name)" | Out-File $OutFile -Append
            Write-Tree -Path $_.FullName -Level ($Level + 1)
        }
        else {
            "$Indent📄 $($_.Name)" | Out-File $OutFile -Append
        }
    }
}

# Escanear carpetas clave
$Targets = @("client", "server")

foreach ($t in $Targets) {
    if (Test-Path $t) {
        "" | Out-File $OutFile -Append
        "=== SCAN: $t ===" | Out-File $OutFile -Append
        Write-Tree -Path (Join-Path $Root $t) -Level 1
    }
}

"" | Out-File $OutFile -Append
"=== END OF AUDIT ===" | Out-File $OutFile -Append

Write-Host "✅ Auditoría generada en: $OutFile"
