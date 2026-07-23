[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001 > $null

. "$PSScriptRoot\lib.ps1"

function Show-Header {

    param([string]$Title)

    Clear-Host

    Write-Host ""
    Write-Host "============================================" -ForegroundColor DarkGray
    Write-Host "   $Title" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor DarkGray
    Write-Host ("   Fecha : {0}" -f (Get-Date -Format "dd/MM/yyyy HH:mm"))
    Write-Host ""

}

Show-GitSummary

Pause-Script