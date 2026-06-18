# Manual de Usuario, Guía Técnica y Arquitectura del Sistema: E-commerce Mundi (Grupo Premia)

Este documento detalla el funcionamiento, la arquitectura técnica, el estado actual y la ruta de implementación integral para la plataforma de E-commerce de Grupo Premia. El enfoque principal es lograr una operación fluida, altamente automatizada y con autonomía total para la administración de productos y logística.

---

## 1. Visión General: ¿Cómo funciona todo el sistema?

El ecosistema digital de Grupo Premia está diseñado para ser una experiencia premium de principio a fin, minimizando la intervención humana en tareas operativas y maximizando la conversión.

**Flujo del Usuario y del Sistema:**
1. **Exploración y Asistencia:** El cliente ingresa a la plataforma. Puede navegar el catálogo interactivo o ser asistido por la **MiniIA** (Asesora Virtual), la cual le recomienda el producto ideal según su evento o presupuesto.
2. **Selección y Personalización:** El cliente selecciona un producto (trofeo, medalla, plaqueta) y entra al **Diseñador Visual**. Aquí personaliza su galardón bajo reglas estrictas que garantizan que el diseño sea producible.
3. **Checkout y Pago:** Al aprobar el diseño, el cliente procede al pago. El sistema procesa exclusivamente pagos con **tarjeta de crédito/débito** mediante una pasarela segura y genera automáticamente la factura correspondiente.
4. **Producción:** Inmediatamente tras el pago, el sistema envía los archivos listos para producción (ej. vectores SVG para láser) al área operativa.
5. **Logística y Envío:** Una vez que el estado del pedido cambia a "Listo/Empacado", el sistema se comunica automáticamente con la API de **Forza Delivery Express** para generar la guía de envío, solicitar la recolección y enviar el número de tracking al cliente.

---

## 2. Análisis del Proyecto: Estado Actual

### ✅ ¿Qué tenemos actualmente?
- **Base del Frontend:** Proyecto configurado con **Next.js 15+** y **React 19**.
- **Interfaz de Usuario (UI):** Estructura inicial incluyendo `Header`, `Footer` y `AuthModal` (Modal de autenticación).
- **Diseño Premium:** Tailwind CSS configurado (`@tailwindcss/postcss`) para lograr el estilo y las animaciones de alta calidad requeridas en la *Propuesta Comercial*.
- **Inteligencia Artificial:** Componente `MiniIA.tsx` implementado para asistencia en ventas.

### ❌ ¿Qué nos falta por implementar? (Brechas Técnicas)
- **Base de Datos y ORM:** Falta definir e instanciar la base de datos (PostgreSQL recomendado) y un ORM (Prisma o Drizzle) para el manejo relacional.
- **Autenticación Segura:** Falta la integración de `NextAuth.js` (Auth.js) para el manejo de sesiones de clientes y roles de administrador.
- **Panel Administrador (Backoffice):** Desarrollo de interfaces CRUD para gestión de catálogo, reglas de negocio y seguimiento de órdenes.
- **Motor del Diseñador Visual:** Falta la integración de bibliotecas de manipulación de Canvas 2D (ej. `react-konva` o `fabric.js`) y el gestor de estado global (ej. `Zustand`) para los elementos en pantalla.
- **Pasarela de Pagos (Servidor):** Implementación de webhooks y validación de firmas criptográficas para confirmar pagos sin riesgo de alteraciones en el lado del cliente.
- **Servicios de Almacenamiento (Storage):** Falta configurar buckets (AWS S3, Vercel Blob o Cloudinary) para almacenar las imágenes subidas por los usuarios y los SVG generados.
- **Integración API Logística:** Construcción de los *endpoints* que interactúan con la API de Forza.

---

## 3. Arquitectura Técnica Recomendada (Stack)

Para soportar la autonomía del sistema y la complejidad del diseñador, se recomienda la siguiente arquitectura técnica:

* **Framework Fullstack:** Next.js (App Router)
* **Base de Datos:** PostgreSQL (Vía Supabase o AWS RDS). Ideal para mantener relaciones complejas de variantes y pedidos.
* **ORM:** Prisma o Drizzle ORM para tipado estricto (Type-safe) entre la base de datos y TypeScript.
* **State Management (Frontend):** Zustand (para el estado del Diseñador Visual, ya que requiere alto rendimiento y actualizaciones rápidas de coordenadas X/Y).
* **Renderizado del Diseñador:** `react-konva` (Konva.js) que permite renderizado rápido de formas y texto en Canvas HTML5, con exportación nativa a DataURL y escalabilidad.

---

## 4. Panel Administrador y Autonomía del Sistema (Técnico)

Para que el negocio no dependa de los desarrolladores para actualizar su catálogo, el modelo de datos del **Panel Administrador** debe estructurarse relacionalmente de la siguiente manera:

### Estructura de Base de Datos Sugerida (Relaciones)
1. **`Product`**: Datos base (Nombre, SKU padre, Descripción, Categoría ID).
2. **`ProductVariant`**: Hijas del producto base. Tienen su propio precio base, SKU específico y peso volumétrico (crucial para cotizar envío en Forza).
3. **`VariantPart`**: Piezas que componen la variante (ej. Base de madera, Placa acrílica).
4. **`CustomizationRule`**: Reglas asociadas a una `VariantPart`. 
   * *Ejemplo de campos:* `maxWidth`, `maxHeight`, `allowedColors` (array), `isLaserOnly` (booleano), `maxCharacters` (entero).

### Flujo de Gestión (Admin UI)
El panel administrador permitirá al equipo crear un producto, asignarle variantes de tamaño, y para cada tamaño, subir una fotografía limpia. Luego, usando una herramienta interna, el administrador trazará un "Bounding Box" (Caja delimitadora) sobre la fotografía para guardar las coordenadas `(x, y, ancho, alto)` que le dirán al Diseñador Visual dónde está permitido escribir.

---

## 5. Diseñador Visual de Reconocimientos (Mejoras y Restricciones)

El **Diseñador Visual** es una aplicación rica en cliente (SPA embebida) dentro de Next.js.

### Definición Técnica de "Qué es posible y qué no":
1. **Restricción de Área de Trabajo:** El lienzo (`Canvas`) cargará la foto del producto como capa de fondo. Sobre ella, se renderizará un `PrintArea` transparente, calculado a partir de la `CustomizationRule` de la BD. Si el usuario arrastra un elemento fuera del `PrintArea`, la UI lo regresará magnéticamente adentro o lo cortará visualmente (Closer/Clipping).
2. **Restricciones por Material/Técnica:**
   * *Láser:* La UI solo mostrará una paleta de grises/negro y aplicará un filtro de CSS/Canvas (`filter: grayscale(100%)`) a los logos subidos para simular el grabado.
   * *Impresión UV:* Se permitirá paleta HEX completa.
3. **Calidad de Logos:** Al subir un archivo (`react-dropzone`), se leerá el binario en el navegador para validar dimensiones (ej. mínimo 800x800px) antes de enviarlo al *Storage*.

### Generación de Arte (Técnico):
Al hacer clic en **"Aprobar Arte y Comprar"**:
1. Se serializa el estado del Canvas a un JSON: `[{type: 'text', content: 'Juan', x: 50, y: 100, fontFamily: 'Arial'}, {type: 'image', url: 's3://.../logo.png', x:10, y:10}]`.
2. El JSON se guarda en la tabla `OrderItem`.
3. Un proceso en segundo plano (o *Server Action*) toma este JSON y genera un archivo `.SVG` utilizando las mismas coordenadas, asegurando que las fuentes estén convertidas a trazados para la máquina láser.

---

## 6. Pasarela de Pago y Facturación (En Línea)

El flujo debe ser transaccionalmente seguro.
* **Exclusividad de Pago en Línea:** *Únicamente* tarjetas de crédito/débito. 
* **Flujo Técnico del Checkout:**
  1. El cliente envía los datos de la tarjeta a un iframe seguro del procesador de pagos (ej. Cybersource o QPayPro) para evitar tocar datos sensibles (`PCI-DSS Compliance`).
  2. El procesador retorna un `token` al frontend.
  3. El frontend envía el `token` al backend (`Server Action`), quien se comunica servidor-a-servidor con la pasarela para ejecutar el cargo.
  4. **Webhooks:** El sistema no fía el estado de "Pagado" de lo que diga el cliente, sino que espera un Webhook de la pasarela confirmando la captura de fondos.
* **Facturación (FEL):** Al recibir el Webhook de éxito, se dispara una petición SOAP/REST a la API del certificador (ej. Infile, Megaprint). El XML retornado se convierte a PDF y se adjunta al email de confirmación (vía Resend o SendGrid).

---

## 7. Coordinación de Envíos (Forza Delivery Express API)

El objetivo es lograr un proceso logístico **100% automatizado**.

### Flujo de la API:
1. **Cotización (Checkout):** 
   - El sistema suma el peso volumétrico (`largo x ancho x alto / factor`) de todos los `ProductVariant` del carrito.
   - Petición a `GET /forza/rates` pasando municipio destino y volumen. Devuelve precio al usuario.
2. **Generación de Guía:** 
   - Cuando el Admin marca la orden como "Lista / Empacada", el backend hace un `POST /forza/shipments` con los datos de origen (Bodega Premia) y destino (Cliente).
   - Forza devuelve un `TrackingNumber` y una URL al PDF de la etiqueta.
3. **Logística Operativa:** 
   - El Admin imprime el PDF devuelto. 
   - El backend hace un `POST /forza/pickup` para agendar recolección.
4. **Notificaciones de Tracking:**
   - El sistema registra un Webhook con Forza para escuchar los eventos de ruta (`En tránsito`, `Entregado`, `Excepción`).
   - El cliente recibe actualizaciones automáticas vía SMS/Email según cambia el estado del paquete.
