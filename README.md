# ATHLETIX · Tienda deportiva en línea

👉 **Abrir la tienda:** https://g2geovis.github.io/athletix-tienda/

Sitio web de la tienda ATHLETIX, hecho en HTML, CSS y JavaScript, sin librerías. Se adapta a celular, tablet y laptop.

Proyecto de la asignatura **Interacción Humano Computador** (Ingeniería en Sistemas de Información, PUCE).

## Funciones

- Catálogo de 16 productos con filtros, orden y buscador. Precio y stock vienen de la base de datos.
- Cuentas reales con Supabase: registro con cédula ecuatoriana validada (módulo 10), confirmación por correo, recuperar contraseña y botón para mostrar la contraseña.
- No se permite registrar dos veces la misma cédula ni el mismo correo.
- Perfil: editar datos, métodos de pago (solo últimos 4 dígitos) y contraseña.
- Compra con retiro en tienda (3 tiendas) y pago con tarjetas de prueba validadas con el algoritmo de Luhn. El total con IVA 15 % lo calcula la base de datos.
- Mis pedidos con su estado. Panel de administración para cambiar estados; al marcar "Listo" se envía un correo al cliente (EmailJS).
- Aviso al administrador de pedidos nuevos (contador en el encabezado y correo).
- Compras seguras ante concurrencia: el stock se descuenta con bloqueo por fila en una sola transacción y cada intento de pago tiene una clave única para no duplicar pedidos.
- Reseñas de compra verificada: solo opina quien compró y retiró el producto, una reseña por cliente y producto.

## Arquitectura

```
index.html               Página única
css/estilos.css          Estilos (primero celular)
js/config.js             Claves públicas de Supabase y EmailJS
js/validaciones.js       Cédula, nombres, celular, correo, contraseña y tarjeta
js/api.js                Acceso a Supabase y EmailJS con errores en español
js/core.js               Estado, utilidades y componentes de formularios
js/vistas-*.js           Pantallas: tienda, cuenta, compra y administración
js/app.js                Arranque, sesión y enrutador
bd/esquema.sql           Tablas (PostgreSQL)
bd/seguridad.sql         Reglas de seguridad por fila y funciones del servidor
bd/actualizacion.sql     Productos, stock y funciones del panel
bd/actualizacion2.sql    Transacciones, concurrencia, idempotencia y estados del pedido
bd/actualizacion3.sql    Quita la tabla de direcciones (solo hay retiro en tienda)
bd/modelo_powerdesigner.sql  Tablas y relaciones para importar en PowerDesigner
```

## Accesibilidad

- Estructura semántica: `header`, `nav`, `main`, `footer`, un `h1` por pantalla y enlace para saltar al contenido.
- Todo se puede usar con teclado, con foco visible en verde azulado.
- Formularios con etiquetas, mensajes de error junto a cada campo y resumen de errores.
- Diálogos nativos (`dialog`) que se cierran con Esc.
- Contraste mínimo de 4.5:1 y respeto por la opción «reducir movimiento» del sistema.
- Revisado con axe-core: 0 infracciones de WCAG 2.2 AA en las pantallas principales.

## Paleta

- Primarios: azul marino `#0B1F3A`, verde azulado `#0F766E` y naranja `#FF7A00`.
- Secundarios: gris claro `#F3F5F7` y blanco `#FFFFFF`.

Tipografía: Barlow Condensed (títulos) y Barlow (textos).
