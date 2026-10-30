# ATHLETIX · Tienda deportiva en línea

👉 **Abrir la tienda:** https://g2geovis.github.io/athletix-tienda/

Sitio web de la tienda ATHLETIX, hecho en HTML, CSS y JavaScript, con una página HTML por pantalla. Se adapta a celular, tablet y laptop.

Proyecto de la asignatura **Interacción Humano Computador** (Ingeniería en Sistemas de Información, PUCE).

## Funciones

- Catálogo de 68 productos (calzado, tecnología deportiva y entrenamiento) con filtros por categoría, género y precio, orden y buscador. Todo viene de la base de datos.
- El género es un atributo del producto: Hombre, Mujer o Unisex. Calzado y tecnología tienen al menos 10 productos de hombre y 10 de mujer.
- Cuentas reales con Supabase: registro con cédula ecuatoriana validada (módulo 10), confirmación por correo, recuperar contraseña y botón para mostrar la contraseña. Las contraseñas se guardan cifradas con bcrypt (Supabase Auth); la tienda nunca las ve.
- No se permite registrar dos veces la misma cédula ni el mismo correo.
- Ingreso con cuenta de Google (OAuth de Supabase). El botón aparece solo cuando el proveedor Google está activado en Supabase; al primer ingreso el cliente completa su cédula y celular.
- Carrito: agregar, cambiar cantidad y quitar productos. Se puede comprar todo el stock de una talla (botón «Llevar todo»).
- Entrega rápida: retiro en tienda en 1 hora (código de 6 caracteres) o envío a domicilio en 2 a 3 horas en Quito y Guayaquil ($3,50).
- Pago simulado, sin dinero real: tarjeta de prueba validada (Luhn, fecha y CVV) o transferencia con número de comprobante. Cada pago queda guardado en la tabla PAGO.
- Orden de pedido imprimible con lo que el cliente debe retirar, y simulación del recorrido del pedido.
- Correo al cliente cuando compra y cada vez que cambia el estado de su pedido (en preparación, listo o en camino, entregado o cancelado) (EmailJS), a cualquier correo (Gmail, Outlook, Hotmail, etc.).
- Mis pedidos con su estado, orden, seguimiento y reseña de cada producto comprado.
- Administrador: pedidos (cambiar estado; al cancelar se devuelve el stock y se anula el pago), productos (crear, editar, ocultar y borrar, con subida de fotos) y pagos recibidos.
- Compras seguras ante concurrencia: el stock se descuenta con bloqueo por fila en una sola transacción y cada intento de pago tiene una clave única para no duplicar pedidos.
- Reseñas de compra verificada: la base verifica que el cliente compró el producto; una reseña por cliente y producto.
- La tienda no emite facturas (es un proyecto académico).

## Enlace permanente

La tienda está en GitHub Pages, que no caduca. Una tarea diaria (`.github/workflows/mantener-activa.yml`) consulta la tienda y la base para que el plan gratuito de Supabase no se pause por inactividad.

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
retiro.html              Paso 2: entrega (retiro en tienda o domicilio)
pago.html                Paso 3: pago simulado con tarjeta o transferencia
confirmacion.html        Paso 4: compra realizada
orden.html               Orden de pedido imprimible (?pedido=N)
seguimiento.html         Simulación de la entrega (?pedido=N)
pedidos.html             Mis pedidos
perfil.html              Mi perfil: mis datos
metodos-pago.html        Mi perfil: tarjetas guardadas
cambiar-clave.html       Mi perfil: cambiar contraseña
admin.html               Panel de pedidos (administrador)
admin-productos.html     Lista de productos (administrador)
admin-producto.html      Crear o editar un producto (?id=código)
admin-pagos.html         Pagos recibidos (administrador)
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
js/vistas-compra.js      Entrega, pago, confirmación, orden y seguimiento
js/vistas-admin.js       Pedidos, productos, pagos y ayuda
js/app.js                Arranque, sesión y elección de la pantalla según el archivo

bd/01_tablas.sql          Mis tablas con la forma de modelar de la clase (CATEGORIA, PRODUCTO, PRODUCTO_TALLA, CLIENTE,
                          ADMINISTRADOR, TIENDA, METODO_PAGO, PEDIDO, DETALLE_PEDIDO, RESENA; PAGO y
                          PRODUCTO_IMAGEN se agregan en el 05)
bd/02_seguridad_y_funciones.sql  Seguridad por filas, compra en una transacción, reglas de estados y reseñas
bd/03_datos.sql           Categorías, tiendas, productos y existencias
bd/04_productos_nuevos.sql       Catálogo ampliado (52 productos más)
bd/05_pagos_entrega_admin.sql    Tabla PAGO, entrega a domicilio, PRODUCTO_IMAGEN y permisos del administrador
bd/06_datos_productos.sql        Características, ficha técnica y fotos de cada producto
bd/07_fotos_storage.sql          Carpeta pública de fotos (solo el administrador sube)
bd/08_quitar_edad.sql            Quita la edad: el producto se clasifica solo por género
bd/10_renombrar_atributos.sql    Nombres de atributos más claros (prd_genero, prd_visible, ped_tipo_entrega, mtp_ ...)
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
