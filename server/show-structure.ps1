# ============================================
# Clean Architecture – Server Structure Dump
# ============================================

$ROOT = "."
$EXCLUDE_DIRS = @(
    "node_modules",
    ".git",
    ".vscode",
    "dist",
    "build",
    "coverage",
    "logs"
)

function Show-Tree {
    param (
        [string]$Path,
        [string]$Indent = ""
    )

    Get-ChildItem $Path -Force | Where-Object {
        $EXCLUDE_DIRS -notcontains $_.Name
    } | Sort-Object { -not $_.PSIsContainer }, Name | ForEach-Object {

        if ($_.PSIsContainer) {
            Write-Output "$Indent📁 $($_.Name)"
            Show-Tree -Path $_.FullName -Indent "$Indent  "
        } else {
            Write-Output "$Indent📄 $($_.Name)"
        }
    }
}

Write-Output "===== SERVER STRUCTURE (Clean Architecture Audit) ====="
Show-Tree $ROOT
