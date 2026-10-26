/* ATHLETIX · Arranque, encabezado, sesión y enrutador */
'use strict';

/* ======================= Catálogo desde la base de datos ======================= */
// Los textos y fotos vienen de datos.js; el precio, el stock y las calificaciones vienen de la base,
// que es la fuente oficial (así el precio que se muestra es el mismo que se cobra).
async function cargarCatalogo() {
  const [rp, rc] = await Promise.all([Api.catalogo.productos(), Api.catalogo.calificaciones()]);
  if (rp.error) {
    estado.catalogoConectado = false;
    estado.errorCatalogo = rp.error;
    pintarBannerConexion();
    return false;
  }
  const notas = new Map(((rc.datos) || []).map((c) => [c.producto_id, c]));
  const filas = new Map((rp.datos || []).map((f) => [f.codigo, f]));
  PRODUCTOS.forEach((p) => {
    const f = filas.get(p.id);
    // Si la base aún no tiene productos, se siguen mostrando (sin poder comprar); si los tiene, el que falte se oculta
    if (!f) { p.dbId = null; if (filas.size) p.activo = false; return; }
    p.dbId = f.id;
    p.precio = Number(f.precio);
    p.activo = f.activo;
    p.stock = {};
    (f.producto_tallas || []).forEach((t) => { p.stock[t.talla] = t.stock; });
    const n = notas.get(f.id);
    p.rating = n ? Number(n.promedio) : 0;
    p.opiniones = n ? Number(n.opiniones) : 0;
  });
  estado.catalogoConectado = filas.size > 0;
  estado.errorCatalogo = filas.size ? '' : 'Los productos todavía no están cargados en la base de datos.';
  pintarBannerConexion();
  return true;
}

function pintarBannerConexion() {
  let banner = $('#banner-conexion');
  if (estado.catalogoConectado) { if (banner) banner.remove(); return; }
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'banner-conexion';
    banner.className = 'banner-conexion';
    banner.setAttribute('role', 'status');
    $('.encabezado').after(banner);
  }
  banner.innerHTML = `<div class="contenedor">${icono('alerta')}<span>${esc(estado.errorCatalogo || 'Sin conexión con la tienda.')} Puedes ver los productos, pero para comprar necesitas conexión.</span>
    <button class="boton-icono" type="button" id="reintentar-conexion">${icono('recargar')}Reintentar</button></div>`;
  $('#reintentar-conexion', banner).addEventListener('click', async (e) => {
    await conEspera(e.currentTarget, 'Conectando…', cargarCatalogo);
    if (estado.catalogoConectado) { aviso('Conexión restablecida.'); render(); }
  });
}

/* ======================= Sesión ======================= */
async function alIniciarSesion(sesion) {
  estado.sesion = sesion;
  estado.cliente = null;
  estado.esAdmin = false;
  if (!sesion) { renderCuenta(); return; }
  const r = await Api.cliente.perfil(sesion.user.id);
  if (!r.error && r.datos) {
    estado.cliente = r.datos;
  } else if (!r.error) {
    // Primer ingreso después de confirmar el correo: se crea el perfil con los datos del registro
    const m = sesion.user.user_metadata || {};
    if (m.cedula && m.nombres && m.apellidos && m.telefono && !Validar.cedula(m.cedula)) {
      const rc = await Api.cliente.crear({ id: sesion.user.id, correo: sesion.user.email, cedula: m.cedula, nombres: m.nombres, apellidos: m.apellidos, telefono: m.telefono });
      if (!rc.error) estado.cliente = rc.datos;
    }
  }
  if (estado.cliente) estado.esAdmin = await Api.cliente.esAdmin();
  renderCuenta();
}

async function cerrarSesion() {
  await Api.auth.salir();
  estado.sesion = null; estado.cliente = null; estado.esAdmin = false;
  guardarTemporal('tienda', null);
  renderCuenta();
  aviso('Cerraste sesión.');
  ir('#/');
}

/* ======================= Encabezado ======================= */
function actualizarContador() {
  const n = unidadesCarrito();
  $('#contador-carrito').textContent = n;
  $('#contador-carrito-texto').textContent = `, ${plural(n, 'producto', 'productos')}`;
}

function renderCuenta() {
  const zona = $('#zona-cuenta');
  if (!estado.sesion) {
    zona.innerHTML = `<a class="cuenta__boton" href="#/ingresar" data-ruta="ingresar">${icono('usuario')}<span class="cuenta__nombre-largo">Ingresar</span></a>`;
    return;
  }
  const nombre = estado.cliente ? nombreCliente() : 'Mi cuenta';
  zona.innerHTML = `
    <button class="cuenta__boton" type="button" aria-expanded="false" aria-controls="menu-cuenta">
      ${icono('usuario')}<span class="cuenta__nombre cuenta__nombre-largo">Hola, ${esc(nombre)}</span>${icono('chevronAbajo')}
    </button>
    <ul class="cuenta__menu" id="menu-cuenta" hidden>
      <li><a href="#/perfil">${icono('usuario')}Mi perfil</a></li>
      <li><a href="#/pedidos">${icono('paquete')}Mis pedidos</a></li>
      ${estado.esAdmin ? `<li><a href="#/admin">${icono('ajustes')}Panel de pedidos</a></li>` : ''}
      <li><button type="button" data-accion="cerrar-sesion">${icono('salir')}Cerrar sesión</button></li>
    </ul>`;
  const boton = $('.cuenta__boton', zona);
  const menu = $('#menu-cuenta');
  boton.addEventListener('click', () => {
    const abrir = boton.getAttribute('aria-expanded') !== 'true';
    boton.setAttribute('aria-expanded', abrir);
    menu.hidden = !abrir;
    if (abrir) $('a', menu).focus();
  });
  menu.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { cerrarMenuCuenta(); boton.focus(); }
  });
}
function cerrarMenuCuenta() {
  const b = $('.cuenta__boton[aria-expanded]');
  if (b) { b.setAttribute('aria-expanded', 'false'); $('#menu-cuenta').hidden = true; }
}

function iniciarEncabezado() {
  const botonMenu = $('.boton-menu');
  const nav = $('#menu-principal');
  botonMenu.addEventListener('click', () => {
    const abrir = botonMenu.getAttribute('aria-expanded') !== 'true';
    botonMenu.setAttribute('aria-expanded', abrir);
    nav.classList.toggle('abierta', abrir);
  });
  $('.buscador').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#buscar-texto').value.trim().slice(0, 80);
    ir(q ? '#/productos?q=' + encodeURIComponent(q) : '#/productos');
  });
  document.addEventListener('click', (e) => {
    if (e.target === dialogo()) cerrarDialogo(); // clic en el fondo del diálogo
    if (e.target.closest('[data-cerrar-dialogo]')) cerrarDialogo();
    if (e.target.closest('[data-accion="cerrar-sesion"]')) { cerrarMenuCuenta(); cerrarSesion(); return; }
    if (!e.target.closest('#zona-cuenta')) cerrarMenuCuenta();
  });
  $('.saltar').addEventListener('click', (e) => { e.preventDefault(); $('#contenido').focus(); });
}

/* ======================= Enrutador ======================= */
function leerRuta() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [camino, consulta] = h.split('?');
  return { partes: camino.split('/').filter(Boolean).map((x) => { try { return decodeURIComponent(x); } catch (e) { return x; } }), params: new URLSearchParams(consulta || '') };
}

const VISTAS = {
  '': vistaInicio,
  productos: vistaProductos,
  producto: vistaProducto,
  carrito: vistaCarrito,
  ingresar: vistaIngresar,
  registro: vistaRegistro,
  'verifica-correo': vistaVerificaCorreo,
  'completar-perfil': vistaCompletarPerfil,
  recuperar: vistaRecuperar,
  'nueva-clave': vistaNuevaClave,
  retiro: vistaRetiro,
  pago: vistaPago,
  confirmacion: vistaConfirmacion,
  pedidos: vistaPedidos,
  perfil: vistaPerfil,
  admin: vistaAdmin,
  ayuda: vistaAyuda
};

let primeraCarga = true;
let turnoRender = 0;
async function render() {
  const turno = ++turnoRender;
  cerrarDialogo();
  cerrarMenuCuenta();
  $('.boton-menu').setAttribute('aria-expanded', 'false');
  $('#menu-principal').classList.remove('abierta');

  const { partes, params } = leerRuta();
  const vista = VISTAS[partes[0] || ''] || vistaNoEncontrada;
  const main = $('#contenido');
  let resultado;
  try {
    const salida = vista(partes, params);
    if (salida && typeof salida.then === 'function') {
      main.innerHTML = cargandoHtml();
      main.setAttribute('aria-busy', 'true');
      resultado = await salida;
      main.removeAttribute('aria-busy');
    } else {
      resultado = salida;
    }
  } catch (error) {
    console.error(error);
    resultado = { titulo: 'Error', html: errorCargaHtml('Ocurrió un problema inesperado. Inténtalo de nuevo.') };
  }
  if (turno !== turnoRender) return; // el usuario ya fue a otra página
  if (!resultado) return; // la vista redirigió

  main.innerHTML = resultado.html;
  document.title = `${resultado.titulo} | ATHLETIX`;

  const seccion = resultado.seccion ?? partes[0] ?? 'inicio';
  $$('[data-ruta]').forEach((a) => {
    if (a.dataset.ruta === (seccion || 'inicio')) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  $('#buscar-texto').value = partes[0] === 'productos' ? (params.get('q') || '') : '';

  try { if (resultado.montar) resultado.montar(main, params); } catch (error) { console.error(error); }
  window.scrollTo(0, 0);
  if (!primeraCarga) {
    const titulo = $('h1', main);
    if (titulo) { titulo.setAttribute('tabindex', '-1'); titulo.focus({ preventScroll: true }); }
  }
  primeraCarga = false;
}

/* ======================= Regreso desde enlaces de correo o Google ======================= */
function revisarEnlaceDeRegreso() {
  const h = window.HASH_INICIAL || '';
  if (!/access_token=|error_description=|error=/.test(h)) return null;
  const p = new URLSearchParams(h.replace(/^#/, ''));
  if (p.get('error_description') || p.get('error')) {
    const vencido = /expired|invalid/i.test(p.get('error_code') + ' ' + p.get('error_description'));
    return { error: vencido ? 'El enlace ya venció o ya fue usado. Inicia sesión o pide un correo nuevo.' : 'No pudimos completar el ingreso. Inténtalo de nuevo.' };
  }
  return { tipo: p.get('type') || 'login' };
}

/* ======================= Inicio de la aplicación ======================= */
window.addEventListener('error', (e) => { console.error(e.error || e.message); });
window.addEventListener('unhandledrejection', (e) => { console.error(e.reason); e.preventDefault(); aviso('Ocurrió un problema de conexión. Inténtalo de nuevo.', 'error'); });
window.addEventListener('offline', () => aviso('Perdiste la conexión a internet.', 'error'));
window.addEventListener('online', () => { aviso('Volviste a tener conexión.'); if (!estado.catalogoConectado) cargarCatalogo(); });
window.addEventListener('storage', (e) => { if (e.key === CLAVE_CARRITO) { estado.carrito = leerCarrito(); actualizarContador(); } });

async function iniciar() {
  iniciarEncabezado();
  actualizarContador();
  renderCuenta();
  const regreso = revisarEnlaceDeRegreso();

  if (!Api.disponible()) {
    if (regreso) history.replaceState(null, '', location.pathname + location.search + '#/');
    estado.errorCatalogo = 'No se pudo cargar la conexión con la tienda.';
    pintarBannerConexion();
    render();
    return;
  }
  // El catálogo se muestra de inmediato y se actualiza cuando responde la base
  const catalogo = cargarCatalogo();
  // Supabase lee primero los datos del enlace (correo o Google); después se limpia la dirección
  await alIniciarSesion(await Api.auth.sesion());
  if (regreso) history.replaceState(null, '', location.pathname + location.search + '#/');

  let esRecuperacion = false;
  Api.auth.alCambiar(async (evento, sesion) => {
    if (evento === 'PASSWORD_RECOVERY') { esRecuperacion = true; estado.sesion = sesion; ir('#/nueva-clave'); return; }
    if (evento === 'SIGNED_OUT') { estado.sesion = null; estado.cliente = null; estado.esAdmin = false; renderCuenta(); return; }
    if (evento === 'TOKEN_REFRESHED' || evento === 'USER_UPDATED') { estado.sesion = sesion; return; }
    if (evento === 'SIGNED_IN' && sesion && (!estado.sesion || estado.sesion.user.id !== sesion.user.id)) {
      await alIniciarSesion(sesion);
      render();
    }
  });

  if (regreso && regreso.error) {
    aviso(regreso.error, 'error');
    location.hash = '#/ingresar';
  } else if (regreso && regreso.tipo === 'recovery') {
    location.hash = '#/nueva-clave';
  } else if (regreso && estado.sesion && !esRecuperacion) {
    guardarTemporal('correo-pendiente', null);
    const volver = leerTemporal('volver');
    aviso(estado.cliente ? `¡Bienvenido, ${nombreCliente()}! Tu correo está confirmado.` : '¡Correo confirmado! Completa tu perfil.');
    if (!estado.cliente) location.hash = '#/completar-perfil';
    else if (volver === 'retiro' && estado.carrito.length) { guardarTemporal('volver', null); location.hash = '#/retiro'; } else location.hash = '#/';
  }
  render();
  await catalogo;
  // Si la vista depende del stock o los precios, se vuelve a pintar con los datos reales
  const ruta = leerRuta().partes[0] || '';
  if (['', 'productos', 'producto', 'carrito'].includes(ruta) && !$('#dialogo').open) render();
}

window.addEventListener('hashchange', render);
iniciar();
