@echo off
title Paso 3 - Iniciar Servidor
color 0A

echo ====================================================================
echo PASO 3: INICIAR SERVIDOR Y ABRIR PLATAFORMA
echo ====================================================================
echo.
echo Encendiendo el servidor local...

:: Iniciar el servidor Next.js en una ventana separada
start "Servidor E-Commerce Mundi (NO CERRAR)" cmd /c "title Servidor E-Commerce Mundi - NO CERRAR && echo El servidor esta corriendo. Para apagarlo, simplemente cierra esta ventana. && echo. && npm run dev"

echo Esperando a que el sistema arranque...
timeout /t 6 /nobreak > nul

echo.
echo [OK] Abriendo tu navegador web...
start http://localhost:3000

echo.
echo ====================================================================
echo ¡LISTO!
echo La plataforma deberia abrirse en tu navegador web.
echo.
echo NOTA IMPORTANTISIMA: Para APAGAR el servidor despues, 
echo solo cierra la otra ventana negra que se abrio.
echo ====================================================================
timeout /t 5 > nul
exit
