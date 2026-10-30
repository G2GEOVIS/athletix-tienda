/* ATHLETIX · Núcleo: estado, utilidades y componentes de interfaz reutilizables */
'use strict';

/* ======================= Estado ======================= */
// En el navegador solo se guarda el carrito; las cuentas, pedidos y reseñas viven en la base de datos.
const CLAVE_CARRITO = 'athletix-carrito-v2';
const estado = {
  carrito: leerCarrito(),
  sesion: null,        // sesión de Supabase (usuario autenticado)
  cliente: null,       // fila de la tabla clientes
  esAdmin: false,
  tiendas: [],
  catalogoConectado: false,
  errorCatalogo: ''
};

function leerCarrito() {
  try {
    const c = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (Array.isArray(c)) {
      return c.filter((i) => i && typeof i.id === 'string' && Number.isInteger(i.cantidad) && i.cantidad >= 1 && i.cantidad <= 9999)
        .map((i) => ({ id: i.id, talla: i.talla ? String(i.talla) : null, cantidad: i.cantidad }));
    }
  } catch (e) { /* almacenamiento no disponible o dañado */ }
  return [];
}
function guardarCarrito() {
  try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(estado.carrito)); } catch (e) { /* se mantiene en memoria */ }
}
function guardarTemporal(clave, valor) {
  try { if (valor === null) sessionStorage.removeItem(clave); else sessionStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
}
function leerTemporal(clave) {
  try { return JSON.parse(sessionStorage.getItem(clave)); } catch (e) { return null; }
}

/* ======================= Utilidades ======================= */
const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dinero = (n) => '$' + Number(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const producto = (id) => PRODUCTOS.find((p) => p.id === id);
const productoPorDbId = (dbId) => PRODUCTOS.find((p) => p.dbId === dbId);
// El código del producto en la base es el mismo de la tienda; así cada página lo reconoce aunque el catálogo aún esté cargando
PRODUCTOS.forEach((p) => { if (p.dbId === undefined) p.dbId = p.id; });
const normalizar = (t) => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const img = (p, vista = 1) => (p.imagenes && p.imagenes[vista - 1]) || `img/productos/${p.id}-${vista}.jpg`;
// Si una foto no carga (archivo faltante o red lenta), se muestra una imagen de respaldo en vez de un hueco roto
const FOTO_RESPALDO = 'img/sin-foto.svg';
document.addEventListener('error', (e) => {
  const el = e.target;
  if (el && el.tagName === 'IMG' && !el.dataset.respaldo && !el.src.endsWith(FOTO_RESPALDO)) {
    el.dataset.respaldo = '1';
    el.src = FOTO_RESPALDO;
  }
}, true);
const etiquetaCategoria = (p) => CATEGORIAS[p.categoria] + (p.publico ? ' · ' + p.publico : '');
const unidadesCarrito = () => estado.carrito.reduce((s, i) => s + i.cantidad, 0);
const subtotalCarrito = () => estado.carrito.reduce((s, i) => s + i.cantidad * ((producto(i.id) || {}).precio || 0), 0);
const redondear = (n) => Math.round(n * 100) / 100;
const ivaCarrito = () => redondear(subtotalCarrito() * CONFIG.iva);
const totalCarrito = () => redondear(subtotalCarrito() + ivaCarrito());
const fecha = (iso) => new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
const fechaHora = (iso) => new Date(iso).toLocaleString('es-EC', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const nombreCliente = () => (estado.cliente ? estado.cliente.nombres.split(' ')[0] : '');
const correoSesion = () => (estado.sesion ? estado.sesion.user.email : '');
const stockDe = (p, talla) => (p.stock ? (p.stock[talla || 'U'] ?? 0) : 10);

const ICONOS = {
  carrito: '<path d="M3 4h2l2.4 11h11L21 7H6.2"/><circle cx="9" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  derecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  izquierda: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chevronIzq: '<path d="m15 5-7 7 7 7"/>',
  chevronDer: '<path d="m9 5 7 7-7 7"/>',
  chevronAbajo: '<path d="m6 9 6 6 6-6"/>',
  menos: '<path d="M5 12h14"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  basura: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  editar: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  regla: '<rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/>',
  camion: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  tienda: '<path d="M4 9h16l-1.5-5h-13zM5 9v11h14V9M9 20v-6h6v6"/>',
  escudo: '<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  paquete: '<path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/>',
  alerta: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.01"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  ubicacion: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  ojo: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  ojoTachado: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6C3.9 8.3 2 12 2 12s3.5 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  lupa: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  salir: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  tarjeta: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6.5 15h4"/>',
  correo: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
  ajustes: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  estrella: '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z"/>',
  recargar: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  banco: '<path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  documento: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  imagen: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 9"/>'
};
const icono = (n, clase = '') => `<svg class="${clase}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONOS[n]}</svg>`;

function estrellas(valor) {
  const llenas = Math.round(valor);
  let html = '<span class="estrellas" aria-hidden="true">';
  for (let i = 1; i <= 5; i++) html += `<svg viewBox="0 0 24 24" class="${i <= llenas ? '' : 'vacia'}">${ICONOS.estrella}</svg>`;
  return html + '</span>';
}
function calificacionHtml(p) {
  if (!p.opiniones) return '<p class="calificacion texto-suave">Sin opiniones todavía</p>';
  return `<p class="calificacion">${estrellas(p.rating)}<span><span class="solo-lector">Calificación </span>${p.rating.toFixed(1)}<span class="solo-lector"> de 5</span> (${p.opiniones})</span></p>`;
}

/* ======================= Avisos ======================= */
function anunciar(texto) {
  const zona = $('#anuncio');
  zona.textContent = '';
  setTimeout(() => { zona.textContent = texto; }, 60);
}
let temporizadorAviso;
function aviso(texto, tipo = 'ok') {
  const caja = $('#aviso-flotante');
  caja.textContent = texto;
  caja.dataset.tipo = tipo;
  caja.hidden = false;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => { caja.hidden = true; }, tipo === 'error' ? 6000 : 3500);
}
/* Va a otra página de la tienda. Si hay un aviso en pantalla, se muestra también en la página siguiente. */
function ir(destino) {
  const caja = $('#aviso-flotante');
  if (caja && !caja.hidden) guardarTemporal('aviso-pendiente', { texto: caja.textContent, tipo: caja.dataset.tipo });
  const actual = location.pathname.split('/').pop() + location.search;
  if (actual === destino || (destino === 'index.html' && actual === '')) render(); else location.href = destino;
}
function mostrarAvisoPendiente() {
  const a = leerTemporal('aviso-pendiente');
  if (a) { guardarTemporal('aviso-pendiente', null); aviso(a.texto, a.tipo); }
}

/* ======================= Diálogo reutilizable ======================= */
const dialogo = () => $('#dialogo');
function abrirDialogo(html, { ancho = false, alAbrir } = {}) {
  const d = dialogo();
  $('#dialogo-contenido').innerHTML = html;
  d.classList.toggle('dialogo--ancho', ancho);
  if (!d.open) d.showModal();
  if (alAbrir) alAbrir(d);
}
function cerrarDialogo() { if (dialogo().open) dialogo().close(); }
function confirmar(titulo, texto, textoSi = 'Sí, continuar') {
  return new Promise((resolver) => {
    abrirDialogo(`
      <h2 class="dialogo__titulo" id="dialogo-titulo">${esc(titulo)}</h2>
      <p>${esc(texto)}</p>
      <div class="dialogo__botones">
        <button class="boton boton--secundario" type="button" data-respuesta="no">Cancelar</button>
        <button class="boton boton--principal" type="button" data-respuesta="si">${esc(textoSi)}</button>
      </div>`, {
      alAbrir: (d) => {
        $('[data-respuesta="no"]', d).focus();
        const responder = (si) => { d.removeEventListener('close', alCerrar); cerrarDialogo(); resolver(si); };
        const alCerrar = () => resolver(false);
        d.addEventListener('close', alCerrar, { once: true });
        $$('[data-respuesta]', d).forEach((b) => b.addEventListener('click', () => responder(b.dataset.respuesta === 'si')));
      }
    });
  });
}

/* ======================= Formularios ======================= */
function campo({ id, etiqueta, tipo = 'text', ayuda = '', extra = '', valor = '', opcional = false, max = 120 }) {
  return `
    <div class="campo">
      <label for="${id}">${etiqueta}${opcional ? ' <span class="texto-suave">(opcional)</span>' : ' <span class="requerido" aria-hidden="true">*</span>'}</label>
      ${ayuda ? `<p class="campo__ayuda" id="${id}-ayuda">${ayuda}</p>` : ''}
      <input id="${id}" name="${id}" type="${tipo}" value="${esc(valor)}" maxlength="${max}" ${opcional ? '' : 'required aria-required="true"'} aria-describedby="${ayuda ? id + '-ayuda ' : ''}${id}-error" ${extra}>
      <p class="campo__error" id="${id}-error" hidden>${icono('alerta')}<span></span></p>
    </div>`;
}
/* Contraseña con botón para mostrarla u ocultarla */
function campoClave({ id, etiqueta, ayuda = '', autocomplete = 'current-password' }) {
  return `
    <div class="campo">
      <label for="${id}">${etiqueta} <span class="requerido" aria-hidden="true">*</span></label>
      ${ayuda ? `<p class="campo__ayuda" id="${id}-ayuda">${ayuda}</p>` : ''}
      <div class="campo-clave">
        <input id="${id}" name="${id}" type="password" maxlength="72" required aria-required="true" autocomplete="${autocomplete}" aria-describedby="${ayuda ? id + '-ayuda ' : ''}${id}-error" autocapitalize="off" spellcheck="false">
        <button class="campo-clave__boton" type="button" data-ver-clave="${id}" aria-pressed="false" aria-controls="${id}">${icono('ojo')}<span>Mostrar</span><span class="solo-lector"> contraseña</span></button>
      </div>
      <p class="campo__error" id="${id}-error" hidden>${icono('alerta')}<span></span></p>
    </div>`;
}
function activarVerClave(raiz) {
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ver-clave]');
    if (!b) return;
    const input = $('#' + b.dataset.verClave, raiz);
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    b.setAttribute('aria-pressed', String(mostrar));
    b.innerHTML = `${icono(mostrar ? 'ojoTachado' : 'ojo')}<span>${mostrar ? 'Ocultar' : 'Mostrar'}</span><span class="solo-lector"> contraseña</span>`;
  });
}
function marcarError(form, id, mensaje) {
  const input = $('#' + id, form);
  const error = $('#' + id + '-error', form);
  if (!input || !error) return;
  if (mensaje) {
    input.setAttribute('aria-invalid', 'true');
    $('span', error).textContent = mensaje;
    error.hidden = false;
  } else {
    input.removeAttribute('aria-invalid');
    error.hidden = true;
  }
}
function mostrarResumenErrores(form, errores, titulo) {
  const caja = $('.alerta-errores', form);
  if (!errores.length) { caja.hidden = true; return; }
  caja.hidden = false;
  caja.innerHTML = `${icono('alerta')}<div><p>${esc(titulo)}</p><ul>${errores.map(([id, m]) => `<li>${id ? `<a href="#${id}" data-enfocar="${id}">${esc(m)}</a>` : esc(m)}</li>`).join('')}</ul></div>`;
  caja.focus();
  caja.scrollIntoView({ block: 'center' });
}
function ocultarResumen(form) { const c = $('.alerta-errores', form); if (c) c.hidden = true; }
/* Aplica reglas [id, mensaje] y muestra los errores; devuelve true si todo está bien */
function validarFormulario(form, reglas, titulo) {
  reglas.forEach(([id, m]) => marcarError(form, id, m));
  const errores = reglas.filter(([, m]) => m);
  if (errores.length) { mostrarResumenErrores(form, errores, titulo || `Revisa ${plural(errores.length, 'campo', 'campos')}:`); return false; }
  ocultarResumen(form);
  return true;
}
function errorGeneral(form, mensaje) { mostrarResumenErrores(form, [['', mensaje]], 'No pudimos continuar:'); }
function activarEnlacesError(form) {
  form.addEventListener('click', (e) => {
    const a = e.target.closest('[data-enfocar]');
    if (a) { e.preventDefault(); const el = $('#' + a.dataset.enfocar, form); if (el) el.focus(); }
  });
}
/* Valida un campo al salir de él (después del primer intento), sin molestar mientras se escribe */
function validarAlSalir(form, id, regla) {
  const input = $('#' + id, form);
  input.addEventListener('blur', () => { if (input.value || input.getAttribute('aria-invalid')) marcarError(form, id, regla(input.value)); });
}
function atajosCorreo(id) {
  return `<div class="atajos" role="group" aria-label="Completar el correo">
    <button class="chip" type="button" data-correo="${id}" data-dominio="@gmail.com">@gmail.com</button>
    <button class="chip" type="button" data-correo="${id}" data-dominio="@hotmail.com">@hotmail.com</button>
    <button class="chip" type="button" data-correo="${id}" data-dominio="@outlook.com">@outlook.com</button>
  </div>`;
}
function activarAtajosCorreo(raiz) {
  raiz.addEventListener('click', (e) => {
    const b = e.target.closest('[data-dominio]');
    if (!b) return;
    const input = $('#' + b.dataset.correo, raiz);
    const usuario = input.value.split('@')[0].trim();
    input.value = usuario + b.dataset.dominio;
    input.focus();
    anunciar(`Correo: ${input.value}`);
  });
}
/* Filtra lo que no corresponde DESPUÉS de escribir (evento input).
   Así funcionan mayúsculas, Alt Gr, Alt + números, pegar y dictado: nunca se bloquea una tecla. */
function filtrarEntrada(input, patron, max) {
  input.addEventListener('input', () => {
    const limpio = input.value.replace(patron, '').slice(0, max || undefined);
    if (limpio !== input.value) {
      const pos = Math.max(0, (input.selectionStart || 0) - (input.value.length - limpio.length));
      input.value = limpio;
      try { input.setSelectionRange(pos, pos); } catch (e) { /* algunos tipos no permiten cursor */ }
    }
  });
}
const NO_LETRAS = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]/g;
const NO_DIGITOS = /\D/g;

/* Evita el doble envío: desactiva el botón mientras se espera la respuesta */
async function conEspera(boton, textoEspera, accion) {
  if (boton.dataset.ocupado === '1') return undefined;
  const original = boton.innerHTML;
  boton.dataset.ocupado = '1';
  boton.disabled = true;
  boton.setAttribute('aria-busy', 'true');
  boton.innerHTML = `<span class="mini-carga" aria-hidden="true"></span>${esc(textoEspera)}`;
  try {
    return await accion();
  } finally {
    if (boton.isConnected) {
      boton.innerHTML = original;
      boton.disabled = false;
      boton.removeAttribute('aria-busy');
      delete boton.dataset.ocupado;
    }
  }
}

function cargandoHtml(texto = 'Cargando…') {
  return `<div class="contenedor pagina"><div class="panel centro" role="status"><div class="cargando" aria-hidden="true"></div><p class="subtitulo">${esc(texto)}</p></div></div>`;
}
function errorCargaHtml(mensaje) {
  return `<div class="contenedor pagina"><div class="panel centro" role="alert">
    <h1 class="titulo-pagina">No pudimos cargar esta página</h1>
    <p class="subtitulo">${esc(mensaje)}</p>
    <button class="boton boton--principal" type="button" style="margin-top:1.5rem" onclick="render()">${icono('recargar')}Intentar de nuevo</button>
  </div></div>`;
}
