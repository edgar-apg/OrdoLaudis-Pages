. "$PSScriptRoot\lib.ps1"

Show-Header (Get-ProjectName)

if ((Get-CurrentBranch) -ne "main") {

    Write-ErrorText "Debes estar en main."
    Pause-Script
    exit

}

if (Has-UncommittedChanges) {

    Write-ErrorText "Hay archivos sin commit."
    Pause-Script
    exit

}

Write-Host ""

if (!(Confirm-Action "¿Publicar en production?")) {

    Write-WarningText "Operación cancelada."
    Pause-Script
    exit

}

Write-Host ""

Write-Host "Cambiando a production..."

if (!(Checkout-Branch "production")) {

    Write-ErrorText "No existe la rama production."
    Pause-Script
    exit

}

Write-Host "Fusionando main..."

if (!(Git-MergeMain)) {

    Write-ErrorText "Error durante el merge."

    Checkout-Branch "main" | Out-Null

    Pause-Script
    exit

}

Write-Host "Enviando cambios..."

if (!(Git-Push)) {

    Write-ErrorText "No fue posible hacer push."

    Checkout-Branch "main" | Out-Null

    Pause-Script
    exit

}

Checkout-Branch "main" | Out-Null

Write-Success "Publicación terminada."

Pause-Script