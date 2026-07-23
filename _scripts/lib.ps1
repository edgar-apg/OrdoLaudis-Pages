# ==========================================
# Git Tools Library
# Compatible con PowerShell 5.1+
# ==========================================

function Show-Header {

    param([string]$Title)

    Clear-Host

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor DarkCyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor DarkCyan
    Write-Host ""

}

function Write-Success {

    param([string]$Message)

    Write-Host "[OK] $Message" -ForegroundColor Green

}

function Write-WarningText {

    param([string]$Message)

    Write-Host "[!] $Message" -ForegroundColor Yellow

}

function Write-ErrorText {

    param([string]$Message)

    Write-Host "[X] $Message" -ForegroundColor Red

}

function Pause-Script {

    Write-Host ""
    Read-Host "Presiona ENTER para continuar"

}

function Get-RepoPath {

    return (git rev-parse --show-toplevel).Trim()

}

function Get-ProjectName {

    $repo = Split-Path (Get-RepoPath) -Leaf

    switch ($repo) {

        "OrdoLaudis-Pages" { return "ORDO LAUDIS" }
        "SyntaxLaudis-Pages" { return "SYNTAX LAUDIS" }
        "SABECUC" { return "SABECUC" }

        default { return $repo }

    }

}

function Get-CurrentBranch {

    return (git branch --show-current).Trim()

}

function Has-UncommittedChanges {

    $status = git status --porcelain

    return ($status.Length -gt 0)

}

function Has-UnpushedCommits {

    git fetch origin *> $null

    $branch = Get-CurrentBranch

    $ahead = git rev-list --count "origin/$branch..HEAD"

    return ([int]$ahead -gt 0)

}

function Confirm-Action {

    param([string]$Message)

    do {

        $answer = Read-Host "$Message (S/N)"

    } while ($answer -notmatch '^[SsNn]$')

    return ($answer -match '^[Ss]$')

}

function Checkout-Branch {

    param([string]$Branch)

    git checkout $Branch *> $null

    return ($LASTEXITCODE -eq 0)

}

function Git-Pull {

    git pull

    return ($LASTEXITCODE -eq 0)

}

function Git-Push {

    git push

    return ($LASTEXITCODE -eq 0)

}

function Git-MergeMain {

    git merge main

    return ($LASTEXITCODE -eq 0)

}
function Get-GitStatus {

    git fetch origin *> $null

    $branch = Get-CurrentBranch

    $changes = Has-UncommittedChanges
    $ahead = [int](git rev-list --count "origin/$branch..HEAD")
    $behind = [int](git rev-list --count "HEAD..origin/$branch")

    return [PSCustomObject]@{

        Branch = $branch
        HasChanges = $changes
        Ahead = $ahead
        Behind = $behind

    }

}

function Show-GitSummary {

    $status = Get-GitStatus

    Write-Host ("Rama      : {0}" -f $status.Branch)

    if ($status.HasChanges) {

        Write-WarningText "Hay archivos modificados."

    }
    else {

        Write-Success "Sin cambios locales."

    }

    if ($status.Ahead -gt 0) {

        Write-WarningText "$($status.Ahead) commit(s) pendientes de push."

    }
    else {

        Write-Success "Sin commits pendientes."

    }

    if ($status.Behind -gt 0) {

        Write-WarningText "Existen cambios nuevos en GitHub."

    }
    else {

        Write-Success "Repositorio actualizado."

    }

}