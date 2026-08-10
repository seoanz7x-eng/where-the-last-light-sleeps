param(
  [string]$VerticalMaster = 'release\steam-assets\vertical-master-art.png',
  [string]$WideMaster = 'outputs\TheLastLight\assets\island-key-art.png',
  [string]$OutputDir = 'release\steam-assets'
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$fontFamily = New-Object System.Drawing.FontFamily 'Malgun Gothic'

function New-CoverBitmap {
  param(
    [System.Drawing.Image]$Source,
    [int]$Width,
    [int]$Height,
    [double]$FocusX = 0.5,
    [double]$FocusY = 0.5
  )
  $scale = [Math]::Max($Width / $Source.Width, $Height / $Source.Height)
  $sourceWidth = $Width / $scale
  $sourceHeight = $Height / $scale
  $left = [Math]::Max(0, [Math]::Min($Source.Width - $sourceWidth, ($Source.Width * $FocusX) - ($sourceWidth / 2)))
  $top = [Math]::Max(0, [Math]::Min($Source.Height - $sourceHeight, ($Source.Height * $FocusY) - ($sourceHeight / 2)))
  $bitmap = [System.Drawing.Bitmap]::new($Width, $Height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  try {
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $destination = [System.Drawing.Rectangle]::new(0, 0, $Width, $Height)
    $graphics.DrawImage($Source, $destination, [single]$left, [single]$top, [single]$sourceWidth, [single]$sourceHeight, [System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $graphics.Dispose()
  }
  return $bitmap
}

function Add-Title {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [ValidateSet('wide','vertical','small')][string]$Layout = 'wide'
  )
  $graphics = [System.Drawing.Graphics]::FromImage($Bitmap)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    if ($Layout -eq 'vertical') {
      $overlay = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Rectangle]::new(0, 0, $Bitmap.Width, $Bitmap.Height),
        ([System.Drawing.Color]::FromArgb(210, 5, 15, 34)),
        ([System.Drawing.Color]::FromArgb(0, 5, 15, 34)),
        90
      )
      $fontSize = [single]($Bitmap.Width * 0.105)
      $x = [single]($Bitmap.Width * 0.08)
      $y = [single]($Bitmap.Height * 0.09)
      $text = "마지막 빛이`n잠든 곳"
    } else {
      $overlay = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Rectangle]::new(0, 0, $Bitmap.Width, $Bitmap.Height),
        ([System.Drawing.Color]::FromArgb(225, 4, 14, 33)),
        ([System.Drawing.Color]::FromArgb(0, 4, 14, 33)),
        0
      )
      $fontSize = [single]($Bitmap.Height * $(if($Layout -eq 'small'){0.24}else{0.17}))
      $x = [single]($Bitmap.Width * 0.055)
      $y = [single]($Bitmap.Height * $(if($Layout -eq 'small'){0.22}else{0.25}))
      $text = "마지막 빛이`n잠든 곳"
    }
    try { $graphics.FillRectangle($overlay, 0, 0, $Bitmap.Width, $Bitmap.Height) } finally { $overlay.Dispose() }
    $font = [System.Drawing.Font]::new($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 0, 0, 0))
    $ivory = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 244, 232, 204))
    try {
      $graphics.DrawString($text, $font, $shadow, $x + 3, $y + 4)
      $graphics.DrawString($text, $font, $ivory, $x, $y)
    } finally {
      $font.Dispose(); $shadow.Dispose(); $ivory.Dispose()
    }
  } finally {
    $graphics.Dispose()
  }
}

function Save-PngAsset {
  param([System.Drawing.Image]$Source,[string]$Name,[int]$Width,[int]$Height,[double]$FocusX,[double]$FocusY,[string]$TitleLayout = '')
  $bitmap = New-CoverBitmap -Source $Source -Width $Width -Height $Height -FocusX $FocusX -FocusY $FocusY
  try {
    if ($TitleLayout) { Add-Title -Bitmap $bitmap -Layout $TitleLayout }
    $bitmap.Save((Join-Path $OutputDir $Name), [System.Drawing.Imaging.ImageFormat]::Png)
  } finally { $bitmap.Dispose() }
}

$wide = [System.Drawing.Image]::FromFile((Resolve-Path $WideMaster).Path)
$vertical = [System.Drawing.Image]::FromFile((Resolve-Path $VerticalMaster).Path)
try {
  Save-PngAsset $wide 'header-capsule-920x430.png' 920 430 0.55 0.5 'wide'
  Save-PngAsset $wide 'small-capsule-462x174.png' 462 174 0.58 0.48 'small'
  Save-PngAsset $wide 'main-capsule-1232x706.png' 1232 706 0.53 0.5 'wide'
  Save-PngAsset $vertical 'vertical-capsule-748x896.png' 748 896 0.5 0.49 'vertical'
  Save-PngAsset $vertical 'library-capsule-600x900.png' 600 900 0.5 0.5 'vertical'
  Save-PngAsset $wide 'library-hero-3840x1240.png' 3840 1240 0.58 0.48 ''
  Save-PngAsset $wide 'page-background-1438x810.png' 1438 810 0.52 0.5 ''
  Save-PngAsset $wide 'library-header-920x430.png' 920 430 0.55 0.5 'wide'
  Save-PngAsset $wide 'shortcut-icon-256x256.png' 256 256 0.77 0.34 ''

  $appIcon = New-CoverBitmap -Source $wide -Width 184 -Height 184 -FocusX 0.77 -FocusY 0.34
  try { $appIcon.Save((Join-Path $OutputDir 'app-icon-184x184.jpg'), [System.Drawing.Imaging.ImageFormat]::Jpeg) } finally { $appIcon.Dispose() }

  $logo = [System.Drawing.Bitmap]::new(1280, 360, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($logo)
  try {
    $graphics.Clear([System.Drawing.Color]::Transparent)
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $font = [System.Drawing.Font]::new($fontFamily, 112, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $shadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(190, 0, 0, 0))
    $ivory = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 244, 232, 204))
    try {
      $graphics.DrawString('마지막 빛이 잠든 곳', $font, $shadow, 24, 112)
      $graphics.DrawString('마지막 빛이 잠든 곳', $font, $ivory, 18, 104)
    } finally { $font.Dispose(); $shadow.Dispose(); $ivory.Dispose() }
  } finally { $graphics.Dispose() }
  try { $logo.Save((Join-Path $OutputDir 'library-logo-1280x360.png'), [System.Drawing.Imaging.ImageFormat]::Png) } finally { $logo.Dispose() }
} finally {
  $wide.Dispose(); $vertical.Dispose(); $fontFamily.Dispose()
}

Get-ChildItem -LiteralPath $OutputDir -File | Sort-Object Name | Select-Object Name, Length
