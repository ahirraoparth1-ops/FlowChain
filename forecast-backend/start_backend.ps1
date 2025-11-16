<#
. S T A R T - B A C K E N D . P S 1
.
  Usage: Open PowerShell and run this script from the repo folder or double-click it.
  It will try to use conda (recommended) to install Prophet and dependencies.
  If conda is not available it will create a venv and attempt pip installs.

  From PowerShell (recommended):
    cd /d D:\flowchain\forecast-backend
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    .\start_backend.ps1

#>
Set-StrictMode -Version Latest
Write-Host "Starting backend setup script..." -ForegroundColor Cyan

# Remember current directory
$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $BaseDir

function Run-Uvicorn {
    Write-Host "Starting uvicorn (main:app) on http://0.0.0.0:8000" -ForegroundColor Green
    # Run uvicorn (will block). Use & to run in current process so Ctrl+C works.
    & uvicorn main:app --reload --host 0.0.0.0 --port 8000
}

try {
    # Check for conda
    $condaAvailable = $false
    try {
        $condaVersion = & conda --version 2>$null
        if ($LASTEXITCODE -eq 0) { $condaAvailable = $true }
    } catch { $condaAvailable = $false }

    if ($condaAvailable) {
        Write-Host "Conda detected. Creating/activating 'flowchain' environment and installing packages via conda-forge." -ForegroundColor Yellow
        & conda create -n flowchain python=3.10 -y | Out-Null
        Write-Host "Activating environment 'flowchain'..." -ForegroundColor Yellow
        # Use 'conda activate' in script-compatible way
        & conda activate flowchain
        Write-Host "Installing prophet and pandas from conda-forge..." -ForegroundColor Yellow
        & conda install -c conda-forge prophet pandas -y
        Write-Host "Installing remaining Python packages with pip..." -ForegroundColor Yellow
        & python -m pip install --upgrade pip setuptools wheel
        & python -m pip install fastapi uvicorn python-multipart
        Run-Uvicorn
    } else {
        Write-Host "Conda not found. Falling back to Python venv. If prophet install fails, install Miniconda and re-run this script." -ForegroundColor Yellow
        if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
            Write-Error "Python not found on PATH. Please install Python 3.10 or add it to PATH, or install Miniconda."
            exit 1
        }

        if (-not (Test-Path '.venv')) {
            Write-Host "Creating virtual environment .venv..." -ForegroundColor Yellow
            & python -m venv .venv
        }
        Write-Host "Activating .venv..." -ForegroundColor Yellow
        .\.venv\Scripts\Activate.ps1
        Write-Host "Upgrading pip and installing packages..." -ForegroundColor Yellow
        python -m pip install --upgrade pip setuptools wheel
        python -m pip install fastapi uvicorn pandas python-multipart

        Write-Host "Attempting to install prophet via pip (this may fail on Windows)." -ForegroundColor Yellow
        try {
            python -m pip install prophet
        } catch {
            Write-Warning "pip install prophet failed. Install Prophet via conda (recommended): `conda install -c conda-forge prophet` and re-run this script. Proceeding to start uvicorn may still fail if prophet is missing.";
        }

        Run-Uvicorn
    }
}
finally {
    Pop-Location
}
