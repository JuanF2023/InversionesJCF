param(
  [string]$ProjectPath = ".",
  [int]$MaxDepth = 6
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path $ProjectPath)) {
  throw "ProjectPath no existe: $ProjectPath"
}

Set-Location $ProjectPath

$auditDir = Join-Path (Get-Location) "_audit"
if (-not (Test-Path $auditDir)) {
  New-Item -ItemType Directory -Path $auditDir | Out-Null
}

$treeFile = Join-Path $auditDir "TREE.txt"
Remove-Item $treeFile -ErrorAction SilentlyContinue

function Write-Tree {
  param(
    [string]$Path,
    [string]$Prefix = "",
    [int]$Depth = 0
  )

  if ($Depth -gt $MaxDepth) { return }

  $items = Get-ChildItem -Path $Path -Force | Sort-Object PSIsContainer -Descending

  foreach ($item in $items) {
    $line = "$Prefix├── $($item.Name)"
    Add-Content -Path $treeFile -Value $line

    if ($item.PSIsContainer -and
        $item.Name -notin @("node_modules",".git",".next","dist","build",".cache")) {
      Write-Tree -Path $item.FullName -Prefix "$Prefix│   " -Depth ($Depth + 1)
    }
  }
}

Add-Content -Path $treeFile -Value (Get-Location).Path
Write-Tree -Path (Get-Location).Path

Write-Host "✅ Árbol generado correctamente en:"
Write-Host $treeFile
