@echo off
echo ===============================================
echo  🛡️ SAT - Sistema de Alerta Temprana
echo  Instalación Automática
echo ===============================================
echo.

echo ⏳ Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
node --version

echo.
echo ⏳ Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente

echo.
echo ⏳ Configurando archivos de entorno...
if not exist .env (
    copy .env.example .env
    echo ✅ Archivo .env creado desde .env.example
    echo ⚠️  IMPORTANTE: Configura las variables de entorno en .env
) else (
    echo ℹ️  El archivo .env ya existe
)

echo.
echo ===============================================
echo  🎉 Instalación completada
echo ===============================================
echo.
echo 📋 Próximos pasos:
echo.
echo 1. Configura las variables de entorno en .env
echo    - SUPABASE_URL
echo    - SUPABASE_ANON_KEY  
echo    - SUPABASE_SERVICE_KEY
echo    - SESSION_SECRET
echo.
echo 2. Crea las tablas en Supabase (ver README.md)
echo.
echo 3. Ejecuta el proyecto:
echo    npm run dev
echo.
echo 4. Abre http://localhost:3000 en tu navegador
echo.
echo ===============================================
pause