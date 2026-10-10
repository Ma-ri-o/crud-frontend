param(
  [ValidateSet("Start", "Stop")]
  [string]$Mode = "Start"
)

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$runtimeDirectory = Join-Path $env:LOCALAPPDATA "MariachiMexicanisimo"
$statePath = Join-Path $runtimeDirectory "session.json"
$stopSignalPath = Join-Path $runtimeDirectory "stop.signal"

if ($Mode -eq "Stop") {
  if (-not (Test-Path $statePath)) {
    Write-Output "No hay una sesión activa administrada por este script."
    exit 0
  }

  New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
  Set-Content -Path $stopSignalPath -Value "stop" -Encoding ascii
  Write-Output "Se solicitó detener la sesión; Windows volverá a sus opciones normales de energía."

  $deadline = (Get-Date).AddSeconds(20)
  while ((Test-Path $statePath) -and (Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 300
  }
  if (Test-Path $statePath) {
    Write-Warning "La sesión sigue activa. Ejecuta de nuevo el modo Stop o ciérrala desde la terminal que la inició."
    exit 1
  }
  Write-Output "Sesión detenida."
  exit 0
}

New-Item -ItemType Directory -Path $runtimeDirectory -Force | Out-Null
if (Test-Path $statePath) {
  $oldState = Get-Content -Path $statePath -Raw | ConvertFrom-Json
  $oldProcess = Get-Process -Id ([int]$oldState.serverPid) -ErrorAction SilentlyContinue
  if ($oldProcess) {
    throw "Ya hay una sesión activa (PID $($oldState.serverPid)). Deténla con -Mode Stop antes de iniciar otra."
  }
  Remove-Item -LiteralPath $statePath
}
if (Test-Path $stopSignalPath) {
  Remove-Item -LiteralPath $stopSignalPath
}

if (-not ("MariachiSession.Power" -as [type])) {
  Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
namespace MariachiSession {
  public static class Power {
    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern uint SetThreadExecutionState(uint flags);
  }
}
"@
}

$continuous = [Convert]::ToUInt32("80000000", 16)
$systemRequired = [uint32]0x00000001
$displayRequired = [uint32]0x00000002
$normal = $continuous
$executionState = $continuous -bor $systemRequired -bor $displayRequired
$serverProcess = $null
$serverStartedHere = $false
$port = $null
$stdoutPath = Join-Path $runtimeDirectory "dev.stdout.log"
$stderrPath = Join-Path $runtimeDirectory "dev.stderr.log"

try {
  if ([MariachiSession.Power]::SetThreadExecutionState($executionState) -eq 0) {
    throw "Windows no permitió activar el modo de pantalla despierta."
  }

  $node = (Get-Command "node.exe" -ErrorAction Stop).Source
  $nextCli = Join-Path $projectRoot "node_modules\next\dist\bin\next"
  if (-not (Test-Path $nextCli)) {
    throw "No se encontraron las dependencias de Next.js. Ejecuta npm install y vuelve a intentarlo."
  }

  foreach ($candidate in 3000, 3001) {
    $listener = Get-NetTCPConnection -LocalPort $candidate -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $listener) {
      $port = $candidate
      break
    }
  }
  if (-not $port) {
    throw "Los puertos 3000 y 3001 ya están ocupados. Libera uno antes de iniciar el sitio."
  }

  $serverProcess = Start-Process `
    -FilePath $node `
    -ArgumentList @("`"$nextCli`"", "dev", "--hostname", "127.0.0.1", "--port", "$port") `
    -WorkingDirectory $projectRoot `
    -RedirectStandardOutput $stdoutPath `
    -RedirectStandardError $stderrPath `
    -WindowStyle Hidden `
    -PassThru
  $serverStartedHere = $true
  [pscustomobject]@{
    serverPid = $serverProcess.Id
    port = $port
    projectRoot = $projectRoot
    stdoutPath = $stdoutPath
    stderrPath = $stderrPath
  } | ConvertTo-Json | Set-Content -Path $statePath -Encoding utf8

  $url = "http://127.0.0.1:$port"
  $deadline = (Get-Date).AddSeconds(60)
  do {
    if ($serverProcess.HasExited) {
      $serverOutput = if (Test-Path $stderrPath) { Get-Content $stderrPath -Raw } else { "" }
      throw "El servidor no pudo iniciar. $serverOutput"
    }
    try {
      $response = Invoke-WebRequest -Uri $url -TimeoutSec 3 -UseBasicParsing
      if ($response.StatusCode -eq 200 -and $response.Content.Contains("Mariachi Mexicanísimo")) {
        break
      }
    } catch {
      Start-Sleep -Seconds 1
    }
    Start-Sleep -Milliseconds 500
  } while ((Get-Date) -lt $deadline)

  if (-not $response -or $response.StatusCode -ne 200) {
    throw "La página no respondió a tiempo. Revisa los registros en $runtimeDirectory."
  }

  Start-Process $url
  Write-Output "Página abierta: $url"
  Write-Output "Manteniendo la pantalla activa. Para terminar: .\scripts\mantener-sesion.ps1 -Mode Stop"
  Write-Output "Registros del servidor: $stdoutPath y $stderrPath"

  while (-not (Test-Path $stopSignalPath)) {
    if ($serverStartedHere -and $serverProcess.HasExited) {
      throw "El servidor de desarrollo se detuvo. Revisa $stderrPath."
    }
    if ([MariachiSession.Power]::SetThreadExecutionState($executionState) -eq 0) {
      throw "Windows dejó de mantener activa la pantalla."
    }
    Start-Sleep -Seconds 20
  }
} finally {
  if ($serverStartedHere -and $serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id
  }
  [MariachiSession.Power]::SetThreadExecutionState($normal) | Out-Null
  Remove-Item -LiteralPath $statePath, $stopSignalPath -Force -ErrorAction SilentlyContinue
}
