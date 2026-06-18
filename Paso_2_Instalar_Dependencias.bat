@echo off
title Paso 2 - Instalar Dependencias
color 0E

echo ====================================================================
echo PASO 2: PREPARAR PROYECTO Y DESCARGAR DEPENDENCIAS
echo ====================================================================
echo.

echo 1. Configurando archivos secretos...
IF NOT EXIST ".env" (
    IF EXIST ".env.example" (
        copy .env.example .env > nul
        echo [OK] Archivo .env creado.
    )
) ELSE (
    echo [OK] Archivo .env ya existia.
)

echo.
echo 2. Descargando librerias de Internet...
echo (Este paso puede tardar varios minutos, ten paciencia y no lo cierres)
echo.

call npm install

echo.
echo 3. Configurando Base de Datos Local...
echo (Creando base de datos y preparando tablas)
call npx prisma generate
call npx prisma db push --accept-data-loss

echo.
echo ====================================================================
echo ¡DEPENDENCIAS INSTALADAS CON EXITO!
echo ====================================================================
echo Ya puedes cerrar esta ventana y pasar al PASO 3.
echo.
pause
exit
