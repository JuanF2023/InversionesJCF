$ErrorActionPreference = "Stop"

function Backup-File($path) {
  if (Test-Path $path) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    Copy-Item $path "$path.bak.$stamp" -Force
  }
}

# 1) middleware: @ → # (import maps en package.json)
$sessionAct = "server\src\middlewares\sessionActivity.middleware.js"
if (Test-Path $sessionAct) {
  Write-Host "Parchando $sessionAct"
  $txt = Get-Content $sessionAct -Raw
  $txt = $txt -replace 'import\s+Sessions\s+from\s+"@/modules/auth/models/sessions\.model\.js";',
                      'import Sessions from "#modules/auth/models/sessions.model.js";'
  Backup-File $sessionAct
  Set-Content -Path $sessionAct -Value $txt -NoNewline
} else {
  Write-Host "No existe $sessionAct" -ForegroundColor Yellow
}

# 2) rutas corporativo y restaurante: @ → # en middlewares
$routesDirs = @(
  "server\src\modules\corporativo\routes",
  "server\src\modules\restaurante\routes"
)

foreach ($dir in $routesDirs) {
  if (-not (Test-Path $dir)) {
    Write-Host "No existe $dir" -ForegroundColor Yellow
    continue
  }
  Get-ChildItem -Path $dir -Filter "*.routes.js" -Recurse | ForEach-Object {
    $file = $_.FullName
    Write-Host "Parchando $file"
    $txt = Get-Content $file -Raw

    $txt = $txt -replace 'import\s+\{\s*requireAuth\s*\}\s+from\s+"@/middlewares/auth\.middleware\.js";',
                      'import { requireAuth } from "#middlewares/auth.middleware.js";'
    $txt = $txt -replace 'import\s+\{\s*touchSessionActivity\s*\}\s+from\s+"@/middlewares/sessionActivity\.middleware\.js";',
                      'import { touchSessionActivity } from "#middlewares/sessionActivity.middleware.js";'

    Backup-File $file
    Set-Content -Path $file -Value $txt -NoNewline
  }
}

Write-Host "Listo. Reinicia el server: npm --prefix .\server run dev" -ForegroundColor Green
