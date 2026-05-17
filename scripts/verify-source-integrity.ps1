# scripts/verify-source-integrity.ps1
$ErrorActionPreference = "Stop"

$root = (Resolve-Path "$PSScriptRoot\..").Path

$validExtensions = @(
    ".js",
    ".jsx",
    ".ts",
    ".tsx"
)

$excludedPathParts = @(
    "/node_modules/",
    "/dist/",
    "/build/",
    "/coverage/",
    "/.vite/",
    "/.git/"
)

$corruptionCodes = @(
    0xFFFD,
    0x7490,
    0x7ADB,
    0x8D38,
    0x94C6,
    0x8137,
    0x8C29,
    0x8305,
    0x7164,
    0x5E3D,
    0x951A,
    0x9A74,
    0x5E90,
    0x9686
)

$corruptionPatterns = $corruptionCodes | ForEach-Object {
    [char]$_
}

function Test-IsExcludedPath {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path
    )

    $normalized = $Path.Replace("\", "/")

    foreach ($part in $excludedPathParts) {
        if ($normalized.Contains($part)) {
            return $true
        }
    }

    return $false
}

function Test-IsValidSourceFile {
    param(
        [Parameter(Mandatory = $true)]
        [string] $Path
    )

    $extension = [System.IO.Path]::GetExtension($Path)

    if ($validExtensions -notcontains $extension) {
        return $false
    }

    if (Test-IsExcludedPath -Path $Path) {
        return $false
    }

    return $true
}

$stagedFiles = git diff --cached --name-only --diff-filter=ACMR

if (-not $stagedFiles) {
    Write-Host "OK: No staged files to scan." -ForegroundColor Green
    exit 0
}

$utf8 = New-Object System.Text.UTF8Encoding($false, $true)
$matches = @()

foreach ($relativePath in $stagedFiles) {
    if (-not (Test-IsValidSourceFile -Path $relativePath)) {
        continue
    }

    $fullPath = Join-Path $root $relativePath

    if (-not (Test-Path $fullPath)) {
        continue
    }

    try {
        $content = [System.IO.File]::ReadAllText($fullPath, $utf8)
    } catch {
        $matches += [PSCustomObject]@{
            Path       = $relativePath
            LineNumber = 0
            CodePoint  = "ENCODING"
            Line       = "File is not valid UTF-8."
        }

        continue
    }

    $lines = $content -split "`r?`n"

    for ($index = 0; $index -lt $lines.Count; $index++) {
        $line = $lines[$index]

        foreach ($pattern in $corruptionPatterns) {
            if ($line.Contains([string]$pattern)) {
                $matches += [PSCustomObject]@{
                    Path       = $relativePath
                    LineNumber = $index + 1
                    CodePoint  = "U+{0:X4}" -f [int][char]$pattern
                    Line       = $line.Trim()
                }

                break
            }
        }
    }
}

if ($matches.Count -gt 0) {
    Write-Host ""
    Write-Host "ERROR: Source corruption patterns detected in staged files." -ForegroundColor Red
    Write-Host ""

    $matches | Format-List Path, LineNumber, CodePoint, Line

    Write-Host ""
    Write-Host "Commit blocked by source integrity check." -ForegroundColor Red

    exit 1
}

Write-Host "OK: Source integrity check passed for staged files." -ForegroundColor Green
exit 0