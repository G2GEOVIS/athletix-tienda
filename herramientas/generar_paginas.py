"""ATHLETIX - Genera un archivo HTML por pantalla a partir de plantilla.html.

Todas las páginas comparten el mismo encabezado, pie de página y scripts; cada una
indica qué pantalla es con <body data-pagina="...">. Si cambias el encabezado o el
pie, edita plantilla.html y vuelve a ejecutar:  python3 herramientas/generar_paginas.py
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINAS = [
    # archivo, pantalla, título, descripción
    ('index.html', '', 'ATHLETIX | Tienda deportiva en línea', 'Tienda deportiva en línea de calzado, tecnología deportiva y equipo de entrenamiento. Compra en línea y retira en tienda.'),
    ('productos.html', 'productos', 'Productos | ATHLETIX', 'Catálogo de ATHLETIX: calzado, tecnología deportiva y equipo de entrenamiento.'),
    ('producto.html', 'producto', 'Producto | ATHLETIX', 'Detalle del producto: fotos, tallas, ficha técnica y opiniones de compradores.'),
    ('carrito.html', 'carrito', 'Carrito | ATHLETIX', 'Revisa los productos de tu carrito antes de comprar.'),
    ('login.html', 'ingresar', 'Iniciar sesión | ATHLETIX', 'Ingresa a tu cuenta de ATHLETIX.'),
    ('registro.html', 'registro', 'Crear cuenta | ATHLETIX', 'Crea tu cuenta de ATHLETIX con tu cédula y tu correo.'),
    ('confirmar-correo.html', 'verifica-correo', 'Confirma tu correo | ATHLETIX', 'Confirma tu correo para activar tu cuenta.'),
    ('completar-perfil.html', 'completar-perfil', 'Completa tu perfil | ATHLETIX', 'Completa tus datos para poder comprar.'),
    ('recuperar.html', 'recuperar', 'Recuperar contraseña | ATHLETIX', 'Recibe un enlace para crear una nueva contraseña.'),
    ('nueva-clave.html', 'nueva-clave', 'Nueva contraseña | ATHLETIX', 'Crea una nueva contraseña para tu cuenta.'),
    ('retiro.html', 'retiro', 'Retiro en tienda | ATHLETIX', 'Elige la tienda donde retiras tu pedido.'),
    ('pago.html', 'pago', 'Pago | ATHLETIX', 'Paga tu pedido con tarjeta Visa o Mastercard.'),
    ('confirmacion.html', 'confirmacion', 'Compra realizada | ATHLETIX', 'Tu compra se realizó con éxito.'),
    ('pedidos.html', 'pedidos', 'Mis pedidos | ATHLETIX', 'Revisa el estado de tus pedidos.'),
    ('perfil.html', 'perfil', 'Mi perfil | ATHLETIX', 'Revisa y edita los datos de tu cuenta.'),
    ('metodos-pago.html', 'perfil/pagos', 'Métodos de pago | ATHLETIX', 'Administra tus tarjetas guardadas.'),
    ('cambiar-clave.html', 'perfil/seguridad', 'Cambiar contraseña | ATHLETIX', 'Cambia la contraseña de tu cuenta.'),
    ('admin.html', 'admin', 'Panel de pedidos | ATHLETIX', 'Panel del administrador para gestionar los pedidos.'),
    ('ayuda.html', 'ayuda', 'Centro de ayuda | ATHLETIX', 'Preguntas frecuentes sobre compras, pagos, retiro y reseñas.'),
    ('404.html', '404', 'Página no encontrada | ATHLETIX', 'La página que buscas no existe.'),
]

plantilla = (RAIZ / 'plantilla.html').read_text(encoding='utf-8')
for archivo, pantalla, titulo, descripcion in PAGINAS:
    html = (plantilla.replace('{{TITULO}}', titulo)
                     .replace('{{DESCRIPCION}}', descripcion)
                     .replace('{{PAGINA}}', pantalla))
    (RAIZ / archivo).write_text(html, encoding='utf-8')
    print('generada', archivo)
