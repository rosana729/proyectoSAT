<#
Script para inicializar git, commitear y empujar a GitHub.
Uso: ejecutar desde la raíz del proyecto en PowerShell:
  .\scripts\push_to_github.ps1 -RemoteUrl "https://github.com/rosana729/ProyectoSat.git"

El script hace:
 - git init (si no existe .git)
 - añade todos los archivos
 - remueve .env del índice si existe
 - asegura que .gitignore contiene .env
 - commit y push a main
#>
param(
  [string]$RemoteUrl = "https://github.com/rosana729/ProyectoSat.git"
)

$ErrorActionPreference = 'Stop'

Write-Output "-- Preparando push a GitHub --"

# Inicializar repo si es necesario
if (-not (Test-Path -Path .git -PathType Container)) {
  Write-Output "Iniciando repositorio git..."
  git init
} else {
  Write-Output ".git ya existe - omitiendo git init"
}

# Asegurar .gitignore incluye .env
if (-not (Select-String -Path .gitignore -Pattern "^\.env$" -Quiet -ErrorAction SilentlyContinue)) {
  Write-Output "Añadiendo .env a .gitignore"
  Add-Content -Path .gitignore -Value "`n.env"
}

# Remover .env del índice si existe
if (Test-Path -Path .env) {
  Write-Output "Removiendo .env del índice (no se borrará el archivo local)"
  git rm --cached .env -q 2>$null
}

# Añadir todos los archivos
Write-Output "git add ."
git add .

# Commit
Write-Output "git commit -m 'Restore static index + prepare for GitHub'"
# Intentar commit, ignorar si no hay cambios
try {
  git commit -m "Restore static index + prepare for GitHub"
} catch {
  Write-Output "No hay cambios para commitear"
}

# Configurar remote
$existing = git remote -v | Out-String
if ($existing -match "origin") {
  Write-Output "Remote origin ya configurado:";
  git remote -v
  Write-Output "Si deseas reemplazarlo, elimina el remote y vuelve a ejecutar con el parámetro -RemoteUrl"
} else {
  Write-Output "Agregando remote origin -> $RemoteUrl"
  git remote add origin $RemoteUrl
}

Write-Output "Empujando a origin main (te pedirá credenciales si es necesario)..."
try {
  git branch -M main
  git push -u origin main
  Write-Output "Push completado. Comprueba el repo en GitHub: $RemoteUrl"
} catch {
  Write-Output "Error al hacer push: $_"
  Write-Output "Puedes intentar ejecutar manualmente los comandos que aparecen en el README"
}

Write-Output "-- Fin --"