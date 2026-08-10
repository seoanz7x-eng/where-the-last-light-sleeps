param(
  [Parameter(Mandatory = $true)][ValidatePattern('^\d+$')][string]$AppId,
  [Parameter(Mandatory = $true)][ValidatePattern('^\d+$')][string]$DepotId
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$appTemplate = Get-Content -Raw -Encoding utf8 (Join-Path $root 'app_build_APPID.vdf.template')
$depotTemplate = Get-Content -Raw -Encoding utf8 (Join-Path $root 'depot_build_DEPOTID.vdf.template')

$appConfig = $appTemplate.Replace('APP_ID_HERE', $AppId).Replace('DEPOT_ID_HERE', $DepotId)
$depotConfig = $depotTemplate.Replace('DEPOT_ID_HERE', $DepotId)

$appPath = Join-Path $root "app_build_$AppId.vdf"
$depotPath = Join-Path $root "depot_build_$DepotId.vdf"
[System.IO.File]::WriteAllText($appPath, $appConfig, [System.Text.UTF8Encoding]::new($false))
[System.IO.File]::WriteAllText($depotPath, $depotConfig, [System.Text.UTF8Encoding]::new($false))

Write-Output "Created $appPath"
Write-Output "Created $depotPath"
Write-Output 'Preview remains enabled. Inspect the generated manifest before any SteamPipe upload.'

