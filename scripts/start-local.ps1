Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

function Stop-WithError {
  param([string]$Message)

  Write-Host "[ERROR] $Message" -ForegroundColor Red
  exit 1
}

$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $nodeCommand) {
  Stop-WithError 'Node.js was not found. Install Node.js 22.13 or newer from https://nodejs.org/ and try again.'
}

try {
  $nodeVersion = [Version](& $nodeCommand.Source -p 'process.versions.node')
} catch {
  Stop-WithError 'Could not determine the installed Node.js version.'
}

if ($nodeVersion -lt [Version]'22.13.0') {
  Stop-WithError "Node.js $nodeVersion is installed, but this project requires 22.13.0 or newer."
}

$vinextCli = Join-Path $projectRoot 'node_modules\vinext\dist\cli.js'
if (-not (Test-Path -LiteralPath $vinextCli)) {
  $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
  if (-not $npmCommand) {
    Stop-WithError 'npm was not found, so the project dependencies cannot be installed.'
  }

  Write-Host 'First launch: installing project dependencies...'
  & $npmCommand.Source install
  if ($LASTEXITCODE -ne 0) {
    Stop-WithError 'Dependency installation failed. Check your network connection and try again.'
  }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, 0)
try {
  $listener.Start()
  $sitePort = $listener.LocalEndpoint.Port
} finally {
  $listener.Stop()
}

$siteUrl = "http://localhost:$sitePort"

Write-Host ''
Write-Host "Starting the site at $siteUrl" -ForegroundColor Cyan
Write-Host 'The browser will open when the page is ready.'
Write-Host 'Press Ctrl+C in this window to stop the site.'
Write-Host ''

if ($env:SITE_LAUNCHER_NO_BROWSER -ne '1') {
  $browserScript = @"
`$url = '$siteUrl'
for (`$attempt = 0; `$attempt -lt 120; `$attempt++) {
  try {
    `$response = Invoke-WebRequest -Uri `$url -UseBasicParsing -TimeoutSec 1
    if (`$response.StatusCode -lt 500) {
      Start-Process `$url
      exit 0
    }
  } catch {}
  Start-Sleep -Milliseconds 500
}
"@

  $encodedBrowserScript = [Convert]::ToBase64String(
    [Text.Encoding]::Unicode.GetBytes($browserScript)
  )
  Start-Process powershell.exe -WindowStyle Hidden -ArgumentList @(
    '-NoProfile',
    '-WindowStyle',
    'Hidden',
    '-EncodedCommand',
    $encodedBrowserScript
  )
}

& $nodeCommand.Source $vinextCli dev --host localhost --port $sitePort --strictPort
$serverExitCode = $LASTEXITCODE

Write-Host ''
if ($serverExitCode -eq 0) {
  Write-Host 'The site has stopped.'
} else {
  Write-Host "[ERROR] The site stopped unexpectedly (exit code: $serverExitCode)." -ForegroundColor Red
}

exit $serverExitCode
