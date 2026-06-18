@echo off
title Paso 1 - Instalar Requisitos
color 0B

echo ====================================================================
echo PASO 1: INSTALAR NODE.JS Y VS CODE
echo ====================================================================
echo.
echo Descargando e instalando programas base (Node.js y Visual Studio Code)...
echo Por favor, espera. Windows podria pedirte permisos.
echo.

winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
winget install Microsoft.VisualStudioCode --silent --accept-package-agreements --accept-source-agreements

echo.
echo ====================================================================
echo INSTALACION COMPLETADA
echo (Si alguno ya estaba instalado, simplemente se omitio).
echo ====================================================================
echo Ya puedes cerrar esta ventana y pasar al PASO 2.
echo.
pause
exit
