<#
Script para desplegar `src/public` a la rama gh-pages usando git subtree.
Uso:
  1. Asegurate de haber hecho commit de tus cambios en `main`.
  2. Ejecuta: .\scripts\deploy-ghpages.ps1
#>

param()

$ErrorActionPreference = 'Stop'

Write-Output "Preparando despliegue de carpeta 'src/public' a 'gh-pages'..."

# Verificar que el repo tenga un remote origin
$origin = git remote get-url origin 2>$null
if (-not $?) {
  Write-Output "No se encontró remote 'origin'. Agregá un remote antes de ejecutar este script."
  exit 1
}

# Asegurar que todo está commiteado
$status = git status --porcelain
if ($status) {
  Write-Output "Hay cambios sin commitear. Commitéalos antes de desplegar."
  exit 1
}

# Usar subtree para empujar la carpeta
Write-Output "Empujando 'src/public' a la rama 'gh-pages'..."

git subtree push --prefix src/public origin gh-pages

if ($LASTEXITCODE -ne 0) {
  Write-Output "git subtree falló o la rama gh-pages no existe. Intentando crear la rama y empujar manualmente..."
  $tmpDir = Join-Path $env:TEMP "ghpages_tmp_$(Get-Random)"
  New-Item -ItemType Directory -Path $tmpDir | Out-Null

  git worktree add $tmpDir gh-pages 2>$null || git checkout --orphan gh-pages
  Remove-Item -Recurse -Force $tmpDir\* 2>$null
  Copy-Item -Path .\src\public\* -Destination $tmpDir -Recurse -Force
  Push-Location $tmpDir
  git add .
  git commit -m "Deploy static site"
  git push origin HEAD:gh-pages --force
  Pop-Location
  git worktree remove $tmpDir -f 2>$null
  Remove-Item -Recurse -Force $tmpDir
}

Write-Output "Despliegue completado. Activá GitHub Pages en la rama 'gh-pages' si aún no está activado."