# ATHLETIX · Tienda deportiva en línea

👉 **Abrir la tienda:** https://g2geovis.github.io/athletix-tienda/

Sitio web de la tienda ATHLETIX, hecho en HTML, CSS y JavaScript, con una página HTML por pantalla. Se adapta a celular, tablet y laptop.

Proyecto de la asignatura **Interacción Humano Computador** (Ingeniería en Sistemas de Información, PUCE).

## Funciones

- Catálogo de 68 productos (calzado, tecnología deportiva y entrenamiento) con filtros, orden y buscador. Precio y stock vienen de la base de datos.
- Cuentas reales con Supabase: registro con cédula ecuatoriana validada (módulo 10), confirmación por correo, recuperar contraseña y botón para mostrar la contraseña.
- No se permite registrar dos veces la misma cédula ni el mismo correo.
- Perfil: editar datos, métodos de pago (solo últimos 4 dígitos) y contraseña.
- Compra con retiro en tienda (3 tiendas) y pago con tarjetas de prueba validadas con el algoritmo de Luhn. El total con IVA 15 % lo calcula la base de datos.
- Correo de confirmación al cliente cuando compra y cuando su pedido está listo.
- Mis pedidos con su estado. Panel de administración para cambiar estados; al marcar "Listo" se envía un correo al cliente (EmailJS).
- Aviso al administrador de pedidos nuevos (contador en el encabezado y correo).
- Compras seguras ante concurrencia: el stock se descuenta con bloqueo por fila en una sola transacción y cada intento de pago tiene una clave única para no duplicar pedidos.
- Reseñas de compra verificada: la tienda verifica en la base que el cliente compró el producto; una reseña por cliente y producto.

## Estructura

Cada pantalla es un archivo HTML. Todos comparten el mismo encabezado, pie de página, estilos y scripts;
la etiqueta `<body data-pagina="...">` indica qué pantalla dibuja cada archivo.

```
index.html               Inicio
productos.html           Catálogo con filtros, orden y buscador (?cat=calzado, ?q=reloj)
producto.html            Detalle de un producto (?id=vx): fotos, tallas, ficha y reseñas
carrito.html             Carrito
login.html               Iniciar sesión
registro.html            Crear cuenta
confirmar-correo.html    Aviso para confirmar el correo
completar-perfil.html    Datos que faltan después de confirmar
recuperar.html           Recuperar contraseña
nueva-clave.html         Crear nueva contraseña
retiro.html              Paso 2: tienda de retiro
pago.html                Paso 3: pago con tarjeta
confirmacion.html        Paso 4: compra realizada
pedidos.html             Mis pedidos
perfil.html              Mi perfil: mis datos
metodos-pago.html        Mi perfil: tarjetas guardadas
cambiar-clave.html       Mi perfil: cambiar contraseña
admin.html               Panel de pedidos (administrador)
ayuda.html               Centro de ayuda
404.html                 Página no encontrada

plantilla.html           Base común de todas las páginas
herramientas/generar_paginas.py  Crea los HTML desde la plantilla (si cambias el encabezado o el pie)

css/estilos.css          Estilos (primero celular)
img/                     Logo y fotos de productos (img/productos/<código>-1.jpg)
js/config.js             Claves públicas de Supabase y EmailJS
js/validaciones.js       Cédula, nombres, celular, correo, contraseña y tarjeta
js/api.js                Acceso a Supabase y EmailJS con errores en español
js/core.js               Estado, utilidades y componentes de formularios
js/vistas-tienda.js      Inicio, catálogo, producto, reseñas y carrito
js/vistas-cuenta.js      Ingreso, registro, perfil, tarjetas y pedidos
js/vistas-compra.js      Retiro en tienda, pago y confirmación
js/vistas-admin.js       Panel de pedidos y ayuda
js/app.js                Arranque, sesión y elección de la pantalla según el archivo

bd/01_tablas.sql          Mis tablas con la forma de modelar de la clase (CATEGORIA, PRODUCTO, PRODUCTO_TALLA, CLIENTE,
                          ADMINISTRADOR, TIENDA, METODO_PAGO, PEDIDO, DETALLE_PEDIDO, RESENA)
bd/02_seguridad_y_funciones.sql  Seguridad por filas, compra en una transacción, reglas de estados y reseñas
bd/03_datos.sql           Categorías, tiendas, productos y existencias
bd/04_productos_nuevos.sql       Catálogo ampliado (52 productos más)
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
