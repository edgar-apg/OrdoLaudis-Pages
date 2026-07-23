#Requires -Version 5.1

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()
chcp 65001 > $null

. "$PSScriptRoot\lib.ps1"


do {

    Clear-Host

    Show-Header (Get-ProjectName)

    Write-Host "Rama actual: " -NoNewline
    Write-Host (Get-CurrentBranch) -ForegroundColor Cyan

    Write-Host ""

    Write-Host "=============================="
    Write-Host "1. Ver estado"
    Write-Host "2. Sincronizar proyecto"
    Write-Host "3. Publicar sitio"
    Write-Host "0. Salir"
    Write-Host "=============================="

    Write-Host ""

    $option = Read-Host "Selecciona una opción"

    switch ($option) {

        "1" {

            & "$PSScriptRoot\estado.ps1"

        }

        "2" {

            & "$PSScriptRoot\sincronizar.ps1"

        }

        "3" {

            & "$PSScriptRoot\publicar.ps1"

        }

        "0" {

            Write-Host ""
            Write-Success "Hasta luego."

        }

        default {

            Write-WarningText "Opción no válida."
            Pause-Script

        }

    }


} until ($option -eq "0")