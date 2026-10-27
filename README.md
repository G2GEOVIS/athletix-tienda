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
- Correo de confirmación al cliente cuando compra y cuando su pedido está listo.
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
bd/01_tablas.sql          Mis tablas con la forma de modelar de la clase (CATEGORIA, PRODUCTO, PRODUCTO_TALLA, CLIENTE,
                          ADMINISTRADOR, TIENDA, METODO_PAGO, PEDIDO, DETALLE_PEDIDO, RESENA)
bd/02_seguridad_y_funciones.sql  Seguridad por filas, compra en una transacción, reglas de estados y reseñas
bd/03_datos.sql           Categorías, tiendas, productos y existencias
bd/migracion_mis_tablas.sql      Paso de la base anterior a la actual (ya aplicado)
bd/historial/             Scripts anteriores de la base (se conservan como respaldo)
bd/modelo_powerdesigner.sql      Script para File > Reverse Engineer en PowerDesigner
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
