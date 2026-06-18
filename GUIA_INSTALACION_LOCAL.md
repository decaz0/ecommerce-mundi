# Guía de Instalación y Ejecución Local: E-commerce Mundi

Esta guía detalla los pasos para configurar y levantar el proyecto en tu computadora. Esto te permitirá previsualizar los avances, revisar el diseño de la interfaz y probar las integraciones (como la MiniIA y el Panel de Administración) de manera local.

---

## MÉTODO 1: INSTALACIÓN AUTOMÁTICA CON ASISTENTE (Recomendado)

Hemos dividido la instalación en 3 pasos muy sencillos para que no necesites saber de programación.

### Primera Vez (Configuración Inicial)

Solo debes ejecutar estos archivos la primera vez que descargues el proyecto en una computadora nueva:

1. **`Paso_1_Instalar_Requisitos.bat`**: Dale doble clic. Este archivo verificará si tienes instalados los programas base (Node.js y Visual Studio Code). Si no los tienes, los descargará e instalará por ti. Cuando la ventana negra diga "COMPLETADA", ciérrala.
2. **`Paso_2_Instalar_Dependencias.bat`**: Dale doble clic. Este paso descarga las librerías de internet necesarias para que la página funcione, crea tu archivo de configuración secreto (`.env`) y **construye tu base de datos local** automáticamente. Esto puede tardar varios minutos. Al finalizar, te avisará con un mensaje verde, luego puedes cerrar la ventana.

### Día a Día (Encender la Plataforma)

Una vez que ya hiciste los Pasos 1 y 2 en tu computadora, la próxima vez que quieras abrir la tienda, solo debes hacer esto:

3. **`Paso_3_Iniciar_Servidor.bat`**: Dale doble clic. Este archivo encenderá el motor de la plataforma y, pasados unos segundos, **abrirá tu navegador web** mostrando la tienda en vivo. (Nota: Deja la ventanita negra abierta mientras uses la página. Si la cierras, la página se apagará).

---

### Solución a Posibles Errores del Asistente Automático

| Problema / Error | ¿Por qué pasa? | Solución Rápida |
| :--- | :--- | :--- |
| **"npm no se reconoce como comando"** en el Paso 2 | Tu computadora aún no se da cuenta de que instalaste Node.js en el Paso 1. | Asegúrate de haber **cerrado** la ventana del Paso 1 antes de abrir la del Paso 2 para refrescar la memoria de Windows. |
| **La página web dice "No se puede acceder a este sitio"** | El servidor no terminó de arrancar antes de que el navegador abriera. | Espera unos 10 segundos más en tu navegador y presiona **F5** para recargar la página. |
| **La página está en blanco o carga otro proyecto distinto** | El puerto 3000 está ocupado en tu computadora. | Cierra todas las ventanas negras abiertas que digan "Servidor E-Commerce" y vuelve a ejecutar el `Paso_3` una sola vez. |
| **Los archivos `.bat` se cierran inmediatamente y no hacen nada** | Tu computadora bloquea instalaciones automáticas por seguridad de tu empresa. | Intenta dar **Clic derecho > "Ejecutar como Administrador"**. Si no funciona, utiliza el **MÉTODO 2 (Manual)**. |

---

## MÉTODO 2: INSTALACIÓN MANUAL (Alternativa Técnica)

Si el asistente automático falla por restricciones de red o antivirus de tu empresa, sigue estos pasos:

### 1. Requisitos Previos
* **Node.js**: Descarga la versión "LTS" desde [https://nodejs.org/](https://nodejs.org/) e instálala ("Siguiente, Siguiente, Finalizar").
* **Visual Studio Code**: Descárgalo desde [https://code.visualstudio.com/](https://code.visualstudio.com/) e instálalo.

### 2. Abrir el Proyecto
1. Abre **Visual Studio Code**.
2. Ve a `Archivo > Abrir Carpeta` (File > Open Folder) y selecciona la carpeta **`ecommerce-mundi-main`**.
3. Abre una terminal yendo al menú superior: `Terminal > Nueva Terminal`.

### 3. Configurar la Base de Datos y Dependencias
En la terminal de la parte inferior, escribe o realiza lo siguiente:

1. **Variables de entorno:** En la lista de archivos de la izquierda, busca `.env.example`, cópialo y pégalo. Renombra la copia a **`.env`**.
2. **Descargar librerías:** Escribe en la terminal:
   ```bash
   npm install
   ```
3. **Construir la base de datos local (Prisma/SQLite):** Ejecuta estos dos comandos uno por uno:
   ```bash
   npx prisma generate
   npx prisma db push --accept-data-loss
   ```

### 4. Encender el Servidor
Cuando todo esté listo, escribe:
```bash
npm run dev
```
Finalmente, abre tu navegador web y entra a **`http://localhost:3000`**.

---

## Comandos Útiles para el Desarrollo

| Comando | ¿Para qué sirve? |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de prueba local. |
| `npm run build` | Simula la preparación para poner la web pública. Revisa que no haya errores de programación (TypeScript) ni enlaces rotos. |
| `npx prisma studio` | Abre un administrador visual en tu navegador donde puedes ver, editar o borrar directamente los datos de tu base de datos local. |
