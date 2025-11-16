<#
  START_ALL.PS1

  Opens two PowerShell windows and starts backend and frontend helper scripts.

  Usage:
    Right-click -> Run with PowerShell, or from PowerShell:
    cd /d D:\flowchain
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    .\start_all.ps1

  Note: This script assumes the helper scripts exist at:
    forecast-backend\start_backend.ps1
    FlowChain\start_frontend.ps1
#>
Set-StrictMode -Version Latest
Write-Host "Launching backend and frontend in separate PowerShell windows..." -ForegroundColor Cyan

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$backendScript = Join-Path $root 'forecast-backend\start_backend.ps1'
$frontendScript = Join-Path $root 'FlowChain\start_frontend.ps1'

if (-not (Test-Path $backendScript)) { Write-Error "Missing $backendScript"; exit 1 }
if (-not (Test-Path $frontendScript)) { Write-Error "Missing $frontendScript"; exit 1 }

# Start backend window
Start-Process -FilePath pwsh -ArgumentList "-NoExit","-Command","Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process; cd /d `"$root\forecast-backend`"; .\start_backend.ps1" -WindowStyle Normal

# Start frontend window
Start-Process -FilePath pwsh -ArgumentList "-NoExit","-Command","Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process; cd /d `"$root\FlowChain`"; .\start_frontend.ps1" -WindowStyle Normal

Write-Host "Two windows should have opened. If they didn't, run the helper scripts manually." -ForegroundColor Green
