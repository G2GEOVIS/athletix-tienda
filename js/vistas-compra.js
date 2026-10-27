/* ATHLETIX · Vistas de compra: retiro en tienda, pago y confirmación */
'use strict';

const CLAVE_PAGO_PENDIENTE = 'athletix-pago-pendiente';

function protegerCompra() {
  if (!estado.carrito.length) { ir('#/carrito'); return false; }
  if (!protegerCuenta('retiro')) return false;
  return true;
}

/* ======================= Retiro en tienda ======================= */
async function vistaRetiro() {
  if (!protegerCompra()) return null;
  if (!estado.tiendas.length) {
    const r = await Api.catalogo.tiendas();
    if (r.error) return { titulo: 'Retiro en tienda', seccion: 'carrito', html: errorCargaHtml(r.error) };
    estado.tiendas = r.datos || [];
  }
  const elegida = leerTemporal('tienda') || (estado.tiendas[0] && estado.tiendas[0].id);
  const c = estado.cliente;
  return {
    titulo: 'Retiro en tienda',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(2)}
      <h1 class="titulo-pagina cabecera-pagina">Retiro en tienda</h1>
      <div class="compra-grilla">
        <form id="form-retiro" style="display:grid;gap:1.5rem" novalidate>
          <fieldset class="panel" aria-describedby="nota-retiro">
            <legend class="leyenda-panel">¿Dónde retiras tu pedido?</legend>
            <p class="texto-suave" id="nota-retiro" style="margin-bottom:1rem">Por ahora no hacemos envíos a domicilio. Retira tu compra sin costo en la tienda que elijas.</p>
            <div class="opciones-tienda">
              ${estado.tiendas.map((t) => `
                <label class="opcion-tienda">
                  <input type="radio" name="tienda" value="${t.id}" ${t.id === elegida ? 'checked' : ''}>
                  <span class="opcion-tienda__cuerpo">
                    <span class="tienda__icono">${icono('tienda')}</span>
                    <span><strong>${esc(t.nombre)}</strong><span class="d-bloque">${esc(t.direccion)}, ${esc(t.ciudad)}</span><span class="d-bloque texto-suave">${esc(t.horario)}</span></span>
                  </span>
                </label>`).join('')}
            </div>
            <p style="color:var(--verde);font-weight:700;margin-top:1rem">Tu pedido estará listo para retirar en ${TIEMPO_LISTO}.</p>
          </fieldset>
          <section class="panel" aria-labelledby="titulo-quien">
            <h2 id="titulo-quien">Quién retira</h2>
            <dl class="datos-lista">
              <dt>Nombre</dt><dd>${esc(c.nombres)} ${esc(c.apellidos)}</dd>
              <dt>Cédula</dt><dd>${esc(c.cedula)}</dd>
              <dt>Celular</dt><dd>${esc(c.telefono)}</dd>
              <dt>Correo</dt><dd>${esc(correoSesion())}</dd>
            </dl>
            <p class="alerta alerta--info" style="margin-top:1.25rem">${icono('correo')}<span>Te enviaremos un correo cuando tu pedido esté listo. Al retirarlo, presenta tu cédula y tu número de pedido.</span></p>
          </section>
        </form>
        ${resumenPedido(`<button class="boton boton--principal boton--bloque" type="submit" form="form-retiro">Continuar al pago</button><a class="boton boton--texto boton--bloque" href="#/carrito">${icono('izquierda')}Volver al carrito</a>`)}
      </div>
    </div>`,
    montar(main) {
      $('#form-retiro', main).addEventListener('submit', (e) => {
        e.preventDefault();
        const t = new FormData(e.target).get('tienda');
        if (!t) { aviso('Elige la tienda donde retirarás tu pedido.', 'error'); return; }
        guardarTemporal('tienda', Number(t));
        ir('#/pago');
      });
    }
  };
}

/* ======================= Pago ======================= */
async function vistaPago() {
  if (!protegerCompra()) return null;
  const tiendaId = leerTemporal('tienda');
  const tienda = estado.tiendas.find((t) => t.id === tiendaId);
  if (!tienda) { ir('#/retiro'); return null; }
  const avisos = revisarCarrito();
  if (!estado.carrito.length) { ir('#/carrito'); return null; }

  // Si se recargó la página mientras se pagaba, se revisa si el pedido ya se creó para no cobrar dos veces
  const pendiente = leerPendiente();
  if (pendiente) {
    const rp = await Api.pedidos.mios();
    const reciente = !rp.error && (rp.datos || []).find((p) => new Date(p.creado_en).getTime() >= pendiente.desde - 5000);
    if (reciente) {
      terminarCompra({ numero: reciente.numero, total: reciente.total });
      return null;
    }
    borrarPendiente();
  }

  const rt = await Api.cliente.tarjetas();
  const hoy = new Date();
  const tarjetas = (rt.datos || []).filter((t) => t.anio_vence > hoy.getFullYear() || (t.anio_vence === hoy.getFullYear() && t.mes_vence >= hoy.getMonth() + 1));
  const total = totalCarrito();
  return {
    titulo: 'Pago',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(3)}
      <h1 class="titulo-pagina cabecera-pagina">Pago</h1>
      ${avisos.length ? `<div class="alerta alerta--info" role="status" style="margin-bottom:1.25rem">${icono('info')}<ul style="margin:0">${avisos.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
      <div class="compra-grilla">
        <section class="panel" aria-labelledby="titulo-tarjeta" id="zona-pago">
          <h2 id="titulo-tarjeta">Pago con tarjeta</h2>
          <p class="texto-suave" style="margin:-.5rem 0 1.25rem">Aceptamos Visa y Mastercard.</p>
          <form class="formulario" id="form-pago" novalidate>
            <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
            ${tarjetas.length ? `
            <fieldset class="grupo-tarjetas">
              <legend style="font-weight:700;margin-bottom:.5rem">Elige cómo pagar</legend>
              ${tarjetas.map((t, i) => `<label class="opcion opcion--caja"><input type="radio" name="metodo" value="${t.id}" ${i === 0 ? 'checked' : ''}> ${icono('tarjeta')}<span>${t.marca} •••• ${t.ultimos4} <span class="texto-suave">· vence ${String(t.mes_vence).padStart(2, '0')}/${String(t.anio_vence).slice(2)}</span></span></label>`).join('')}
              <label class="opcion opcion--caja"><input type="radio" name="metodo" value="nueva"> ${icono('mas')}<span>Usar otra tarjeta</span></label>
            </fieldset>
            <div id="cvv-guardada">${campo({ id: 'cvv-g', etiqueta: 'CVV de la tarjeta elegida', tipo: 'password', ayuda: '3 dígitos al reverso', max: 3, extra: 'autocomplete="cc-csc" inputmode="numeric"' })}</div>` : ''}
            <div id="tarjeta-nueva" ${tarjetas.length ? 'hidden' : ''}>
              <div class="formulario">${camposTarjeta()}</div>
            </div>
            <p class="alerta alerta--info">${icono('candado')}<span>Solo guardamos los últimos 4 dígitos de tu tarjeta. <strong>Una vez pagado, el pedido no se puede modificar.</strong></span></p>
            <button class="boton boton--principal boton--bloque" type="submit">${icono('candado')}Pagar ${dinero(total)}</button>
            <a class="boton boton--texto" href="#/retiro">${icono('izquierda')}Volver a retiro en tienda</a>
          </form>
        </section>
        ${resumenPedido(`<div class="tienda" style="margin-top:1rem;background:var(--blanco)"><span class="tienda__icono">${icono('ubicacion')}</span><div><strong style="font-size:1rem">Retiro en ${esc(tienda.nombre)}</strong><p class="texto-suave">${esc(tienda.direccion)}</p></div></div>`)}
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-pago', main);
      // Una clave por intento de pago: si el envío se repite, la base devuelve el mismo pedido
      const clavePago = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : null;
      activarCamposTarjeta(form);
      const cvvG = $('#cvv-g', form);
      if (cvvG) filtrarEntrada(cvvG, NO_DIGITOS, 3);
      const nueva = $('#tarjeta-nueva', form);
      const usarNueva = () => !tarjetas.length || (($('input[name="metodo"]:checked', form) || {}).value === 'nueva');
      form.addEventListener('change', (e) => {
        if (e.target.name !== 'metodo') return;
        nueva.hidden = !usarNueva();
        $('#cvv-guardada', form).hidden = usarNueva();
        ocultarResumen(form);
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let metodoId;
        let datosTarjeta = null;
        if (usarNueva()) {
          datosTarjeta = leerTarjeta(form);
          if (!datosTarjeta) return;
          if (datosTarjeta.resultado === 'rechazada') { validarFormulario(form, [['tarjeta', 'Tu banco rechazó el pago. Prueba con otra tarjeta.']], 'Pago rechazado:'); return; }
          if (datosTarjeta.resultado === 'sin fondos') { validarFormulario(form, [['tarjeta', 'La tarjeta no tiene fondos suficientes. Prueba con otra tarjeta.']], 'Pago rechazado:'); return; }
        } else {
          if (!validarFormulario(form, [['cvv-g', Validar.cvv(cvvG.value)]], 'Revisa el pago:')) return;
          metodoId = Number($('input[name="metodo"]:checked', form).value);
        }
        const boton = $('button[type="submit"]', form);
        const r = await conEspera(boton, 'Procesando pago…', async () => {
          mostrarProcesando(main, true);
          if (datosTarjeta) {
            const rg = await Api.cliente.guardarTarjeta(datosTarjeta.registro);
            if (rg.error) return rg;
            metodoId = rg.datos.id;
          }
          const items = estado.carrito.map((l) => ({ producto: producto(l.id).dbId, talla: l.talla || '', cantidad: l.cantidad }));
          if (items.some((i) => !i.producto)) return { error: 'Algunos productos no están disponibles en este momento. Recarga la página.' };
          guardarPendiente();
          const rp = await Api.pedidos.crear(tiendaId, metodoId, items, clavePago);
          if (rp.error) borrarPendiente();
          return rp;
        });
        if (!r) return;
        mostrarProcesando(main, false);
        if (r.error) {
          errorGeneral(form, r.error);
          if (/stock|disponible/i.test(r.error)) cargarCatalogo();
          return;
        }
        const fila = Array.isArray(r.datos) ? r.datos[0] : r.datos;
        // Correos de confirmación al cliente y de aviso al administrador (no detienen la compra si fallan)
        Api.correo.compraConfirmada({ correo: correoSesion(), nombre: estado.cliente.nombres, numero: fila.numero, total: fila.total, tienda: tienda.nombre, horario: tienda.horario });
        Api.correo.nuevoPedido({
          numero: fila.numero, total: fila.total, tienda: tienda.nombre,
          cliente: `${estado.cliente.nombres} ${estado.cliente.apellidos}`, cedula: estado.cliente.cedula,
          correo: correoSesion(), telefono: estado.cliente.telefono,
          productos: estado.carrito.map((l) => `${l.cantidad} × ${producto(l.id).nombre}${l.talla ? ' (talla ' + l.talla + ')' : ''}`).join(', ')
        });
        terminarCompra({ numero: fila.numero, total: fila.total });
      });
    }
  };
}

function mostrarProcesando(main, activo) {
  let capa = $('#capa-pago', main);
  if (activo && !capa) {
    capa = document.createElement('div');
    capa.id = 'capa-pago';
    capa.className = 'capa-pago';
    capa.setAttribute('role', 'status');
    capa.innerHTML = '<div class="cargando" aria-hidden="true"></div><p><strong>Procesando tu pago…</strong></p><p class="texto-suave">No cierres ni recargues esta página.</p>';
    $('#zona-pago', main).appendChild(capa);
  } else if (!activo && capa) capa.remove();
}

function guardarPendiente() { try { localStorage.setItem(CLAVE_PAGO_PENDIENTE, JSON.stringify({ desde: Date.now() })); } catch (e) { /* sin almacenamiento */ } }
function borrarPendiente() { try { localStorage.removeItem(CLAVE_PAGO_PENDIENTE); } catch (e) { /* sin almacenamiento */ } }
function leerPendiente() {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE_PAGO_PENDIENTE));
    if (p && Date.now() - p.desde < 5 * 60 * 1000) return p;
  } catch (e) { /* sin almacenamiento */ }
  borrarPendiente();
  return null;
}

function terminarCompra({ numero, total }) {
  const tienda = estado.tiendas.find((t) => t.id === leerTemporal('tienda'));
  guardarTemporal('ultimo-pedido', { numero, total, unidades: unidadesCarrito(), tienda: tienda || null });
  estado.carrito = [];
  guardarCarrito(); actualizarContador(); borrarPendiente();
  cargarCatalogo(); // actualiza el stock
  location.replace('#/confirmacion');
}

/* ======================= Confirmación ======================= */
function vistaConfirmacion() {
  const p = leerTemporal('ultimo-pedido');
  if (!p) { ir('#/pedidos'); return null; }
  return {
    titulo: 'Compra realizada',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(4)}
      <div class="panel centro">
        <div class="icono-exito"><span>${icono('check')}</span></div>
        <h1 class="titulo-pagina">¡Compra realizada con éxito!</h1>
        <p class="subtitulo">Gracias por tu compra, ${esc(nombreCliente())}. Te enviamos la confirmación a <strong>${esc(correoSesion())}</strong> y te escribiremos otra vez cuando tu pedido esté listo para retirar.</p>
        <p class="numero-pedido">Pedido N.º ${esc(p.numero)}</p>
        <dl class="datos-lista panel panel--gris detalle-pedido">
          <dt>Productos</dt><dd>${plural(p.unidades, 'producto', 'productos')}</dd>
          <dt>Total pagado</dt><dd>${dinero(p.total)}</dd>
          <dt>Estado del pago</dt><dd>Aprobado</dd>
          ${p.tienda ? `<dt>Retiro en</dt><dd>${esc(p.tienda.nombre)} · ${esc(p.tienda.direccion)}</dd>` : ''}
          <dt>Listo para retirar</dt><dd>En ${TIEMPO_LISTO}</dd>
        </dl>
        <h2 class="titulo-seccion" style="text-align:left;margin-top:1.75rem;font-size:1.6rem">Estado de tu pedido</h2>
        ${seguimiento('Recibido')}
        <a class="boton boton--principal boton--bloque" style="margin-top:1.75rem" href="#/pedidos">${icono('paquete')}Ver mis pedidos</a>
        <a class="boton boton--texto boton--bloque" href="#/productos">Seguir comprando</a>
      </div>
    </div>`
  };
}
