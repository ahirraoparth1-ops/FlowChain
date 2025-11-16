<#
  T E S T - U P L O A D . P S 1

  Quick helper to POST a CSV to the backend /forecast endpoint using Invoke-RestMethod.
  Usage:
    cd /d D:\flowchain\forecast-backend
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    .\test_upload.ps1 -FilePath '..\FlowChain\src\pages\landing-page\components\sales_data.csv'
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

if (-not (Test-Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    exit 1
}

Write-Host "Posting $FilePath to http://localhost:8000/forecast" -ForegroundColor Cyan
$Form = @{ file = Get-Item $FilePath }
try {
    $resp = Invoke-RestMethod -Uri 'http://localhost:8000/forecast' -Method Post -Form $Form -ErrorAction Stop
    Write-Host "Response:" -ForegroundColor Green
    $resp | ConvertTo-Json -Depth 5
} catch {
    Write-Error "Request failed: $_"
}
