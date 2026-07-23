[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 > $null

. "$PSScriptRoot\lib.ps1"

Show-Header (Get-ProjectName)

Write-Host "Sincronizando proyecto..."
Write-Host ""

if (!(Checkout-Branch "main")) {

    Write-ErrorText "No fue posible cambiar a main."
    Pause-Script
    exit

}

if (Git-Pull) {

    Write-Success "Proyecto sincronizado con GitHub."

}
else {

    Write-ErrorText "No fue posible sincronizar."

}

Pause-Script