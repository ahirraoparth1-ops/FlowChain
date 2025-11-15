<#
  S T A R T - F R O N T E N D . P S 1

  Usage:
    cd /d D:\flowchain\FlowChain
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    .\start_frontend.ps1

  This will install node modules (if needed) and start the Vite dev server.
#>
Set-StrictMode -Version Latest
Write-Host "Starting frontend setup..." -ForegroundColor Cyan

$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $BaseDir

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm not found on PATH. Please install Node.js (LTS)."
    exit 1
}

if (-not (Test-Path 'node_modules')) {
    Write-Host "Installing node modules (npm install)..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting Vite dev server..." -ForegroundColor Green
npm start

Pop-Location
