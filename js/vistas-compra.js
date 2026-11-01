/* ATHLETIX · Vistas de compra: retiro en tienda, pago, confirmación y orden de pedido */
'use strict';

const CLAVE_PAGO_PENDIENTE = 'athletix-pago-pendiente';

function protegerCompra() {
  if (!estado.carrito.length) { ir('carrito.html'); return false; }
  if (!protegerCuenta('retiro')) return false;
  return true;
}

/* Las tiendas se leen de la base una vez por página */
async function cargarTiendas() {
  if (estado.tiendas.length) return { datos: estado.tiendas };
  const r = await Api.catalogo.tiendas();
  if (!r.error) estado.tiendas = r.datos || [];
  return r;
}

/* Tienda de retiro elegida (se guarda mientras dura la compra) */
function leerEntrega() {
  const e = leerTemporal('entrega');
  if (!e || e.tipo !== 'Retiro' || !e.tienda) return null;
  return e;
}

/* Explicación del pago simulado (el docente pidió que el cliente sepa cómo paga) */
function comoFuncionaPago() {
  return `
    <details class="como-funciona" open>
      <summary>${icono('info')}¿Cómo funciona el pago? (simulación)</summary>
      <ol>
        <li><strong>Eliges cómo pagar:</strong> tarjeta Visa o Mastercard, o transferencia bancaria.</li>
        <li><strong>La tienda revisa los datos:</strong> que el número de la tarjeta sea válido (algoritmo de Luhn), la fecha de vencimiento y el CVV; o, en la transferencia, el banco y el número de comprobante.</li>
        <li><strong>Aprobación simulada:</strong> el pago se aprueba al instante. <strong>No se mueve dinero real</strong> ni se contacta a ningún banco.</li>
        <li><strong>Registro en la base de datos:</strong> se guarda el pago con su método, monto, fecha y estado (de la tarjeta solo los últimos 4 dígitos).</li>
        <li><strong>Confirmación:</strong> ves tu orden de pedido y te llega un correo con el número y el código de retiro.</li>
      </ol>
    </details>`;
}

/* ======================= Retiro en tienda ======================= */
async function vistaRetiro() {
  if (!protegerCompra()) return null;
  const rt = await cargarTiendas();
  if (rt.error) return { titulo: 'Retiro en tienda', seccion: 'carrito', html: errorCargaHtml(rt.error) };
  // Si no eligió en esta compra, se usa la última tienda que usó esta cuenta (guardada en el navegador)
  const ultima = leerLocal(claveCuenta(CLAVE_ENTREGA));
  const ultimaValida = ultima && estado.tiendas.some((t) => t.id === ultima.tienda);
  const recordada = !leerEntrega() && ultimaValida;
  const e = leerEntrega() || (ultimaValida ? ultima : null) || { tipo: 'Retiro', tienda: estado.tiendas[0] && estado.tiendas[0].id };
  const c = estado.cliente;
  return {
    titulo: 'Retiro en tienda',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(2)}
      <h1 class="titulo-pagina cabecera-pagina">Retiro en tienda</h1>
      <p class="subtitulo" style="margin-bottom:1rem">Retiras tu pedido gratis en la tienda que elijas. Estará listo en <strong>${ENTREGA.retiro}</strong> y te avisamos por correo.</p>
      ${recordada ? `<p class="alerta alerta--info" style="margin-bottom:1rem">${icono('info')}<span>Usamos la última tienda que elegiste. Puedes cambiarla si quieres.</span></p>` : ''}
      <div class="compra-grilla">
        <form id="form-retiro" class="formulario" style="display:grid;gap:1.5rem" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          <fieldset class="panel">
            <legend class="leyenda-panel">¿En qué tienda lo retiras?</legend>
            <div class="opciones-tienda">
              ${estado.tiendas.map((t) => `
                <label class="opcion-tienda">
                  <input type="radio" name="tienda" value="${t.id}" ${t.id === e.tienda ? 'checked' : ''}>
                  <span class="opcion-tienda__cuerpo">
                    <span class="tienda__icono">${icono('ubicacion')}</span>
                    <span><strong>${esc(t.nombre)}</strong><span class="d-bloque">${esc(t.direccion)}, ${esc(t.ciudad)}</span><span class="d-bloque texto-suave">${esc(t.horario)}</span></span>
                  </span>
                </label>`).join('')}
            </div>
          </fieldset>

          <section class="panel" aria-labelledby="titulo-quien">
            <h2 id="titulo-quien">Quién retira</h2>
            <dl class="datos-lista">
              <dt>Nombre</dt><dd>${esc(c.nombres)} ${esc(c.apellidos)}</dd>
              <dt>Cédula</dt><dd>${esc(c.cedula)}</dd>
              <dt>Celular</dt><dd>${esc(c.telefono)}</dd>
              <dt>Correo</dt><dd>${esc(correoSesion())}</dd>
            </dl>
            <p class="alerta alerta--info" style="margin-top:1.25rem">${icono('correo')}<span>Al pagar recibes la <strong>orden de pedido</strong> con un código de 6 caracteres. Preséntalo junto con tu cédula al retirar tu pedido en la tienda.</span></p>
          </section>
        </form>
        <div id="zona-resumen">${resumenPedido(botonesEntrega())}</div>
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-retiro', main);
      activarEnlacesError(form);
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const tienda = Number(new FormData(form).get('tienda'));
        if (!tienda) { aviso('Elige la tienda donde retirarás tu pedido.', 'error'); return; }
        guardarTemporal('entrega', { tipo: 'Retiro', tienda });
        guardarLocal(claveCuenta(CLAVE_ENTREGA), leerEntrega());
        ir('pago.html');
      });
    }
  };
}
function botonesEntrega() {
  return `<button class="boton boton--principal boton--bloque" type="submit" form="form-retiro">Continuar al pago</button><a class="boton boton--texto boton--bloque" href="carrito.html">${icono('izquierda')}Volver al carrito</a>`;
}
function textoEntrega(e, tienda) {
  return `<strong style="font-size:1rem">Retiro en ${esc(tienda ? tienda.nombre : '')} · listo en ${ENTREGA.retiro}</strong><p class="texto-suave">${esc(tienda ? tienda.direccion : '')}</p>`;
}

/* ======================= Pago (simulado): tarjeta o transferencia ======================= */
async function vistaPago() {
  if (!protegerCompra()) return null;
  const rTiendas = await cargarTiendas();
  if (rTiendas.error) return { titulo: 'Pago', seccion: 'carrito', html: errorCargaHtml(rTiendas.error) };
  const entrega = leerEntrega();
  const tienda = entrega ? estado.tiendas.find((t) => t.id === entrega.tienda) : null;
  if (!tienda) { ir('retiro.html'); return null; }
  const avisos = revisarCarrito();
  if (!estado.carrito.length) { ir('carrito.html'); return null; }

  // Si se recargó la página mientras se pagaba, se revisa si el pedido ya se creó para no cobrar dos veces
  const pendiente = leerPendiente();
  if (pendiente) {
    const rp = await Api.pedidos.mios();
    const reciente = !rp.error && (rp.datos || []).find((p) => new Date(p.creado_en).getTime() >= pendiente.desde - 5000);
    if (reciente) { terminarCompra(reciente); return null; }
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
        <section class="panel" aria-labelledby="titulo-pago" id="zona-pago">
          <h2 id="titulo-pago">¿Cómo quieres pagar?</h2>
          ${comoFuncionaPago()}
          <form class="formulario" id="form-pago" novalidate>
            <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
            <fieldset class="grupo-tarjetas">
              <legend class="solo-lector">Método de pago</legend>
              <div class="metodos-pago">
                <label class="opcion opcion--caja"><input type="radio" name="forma" value="Tarjeta" checked> ${icono('tarjeta')}<span><strong>Tarjeta</strong> <span class="texto-suave">Visa o Mastercard</span></span></label>
                <label class="opcion opcion--caja"><input type="radio" name="forma" value="Transferencia"> ${icono('banco')}<span><strong>Transferencia bancaria</strong> <span class="texto-suave">desde tu banco</span></span></label>
              </div>
            </fieldset>

            <div id="pago-tarjeta" class="formulario">
              ${avisoTarjetasPrueba()}
              ${tarjetas.length ? `
              <fieldset class="grupo-tarjetas">
                <legend style="font-weight:700;margin-bottom:.5rem">Elige la tarjeta</legend>
                ${tarjetas.map((t, i) => `<label class="opcion opcion--caja"><input type="radio" name="metodo" value="${t.id}" ${i === 0 ? 'checked' : ''}> ${icono('tarjeta')}<span>${t.marca} •••• ${t.ultimos4} <span class="texto-suave">· vence ${String(t.mes_vence).padStart(2, '0')}/${String(t.anio_vence).slice(2)}</span></span></label>`).join('')}
                <label class="opcion opcion--caja"><input type="radio" name="metodo" value="nueva"> ${icono('mas')}<span>Usar otra tarjeta</span></label>
              </fieldset>
              <div id="cvv-guardada">${campo({ id: 'cvv-g', etiqueta: 'CVV de la tarjeta elegida', tipo: 'password', ayuda: '3 dígitos al reverso', max: 3, extra: 'autocomplete="cc-csc" inputmode="numeric"' })}</div>` : ''}
              <div id="tarjeta-nueva" ${tarjetas.length ? 'hidden' : ''}>
                <div class="formulario">${camposTarjeta()}</div>
              </div>
            </div>

            <div id="pago-transferencia" class="formulario" hidden>
              <section class="cuenta-tienda" aria-labelledby="titulo-cuenta">
                <h3 id="titulo-cuenta">${icono('banco')}Transfiere a esta cuenta (simulada)</h3>
                <dl class="datos-lista datos-lista--compacta">
                  <dt>Banco</dt><dd>${esc(CUENTA_TIENDA.banco)}</dd>
                  <dt>Tipo</dt><dd>${esc(CUENTA_TIENDA.tipo)}</dd>
                  <dt>Número</dt><dd>${esc(CUENTA_TIENDA.numero)}</dd>
                  <dt>Titular</dt><dd>${esc(CUENTA_TIENDA.titular)}</dd>
                  <dt>Monto</dt><dd>${dinero(total)}</dd>
                </dl>
                <p class="texto-suave" style="margin-top:.5rem">Es una cuenta de ejemplo: no transfieras dinero real. Escribe cualquier número de comprobante de 6 a 12 dígitos.</p>
              </section>
              <div class="campo">
                <label for="banco">Banco desde el que transferiste <span class="requerido" aria-hidden="true">*</span></label>
                <select id="banco" name="banco" aria-describedby="banco-error"><option value="">Elige tu banco</option>${BANCOS.map((b) => `<option>${esc(b)}</option>`).join('')}</select>
                <p class="campo__error" id="banco-error" hidden>${icono('alerta')}<span></span></p>
              </div>
              ${campo({ id: 'comprobante', etiqueta: 'Número de comprobante', ayuda: 'De 6 a 12 números, aparece en el recibo de tu banco', max: 12, extra: 'inputmode="numeric" autocomplete="off"' })}
            </div>

            <p class="alerta alerta--info">${icono('candado')}<span>Pago simulado: no se cobra dinero real. <strong>Una vez pagado, el pedido no se puede modificar.</strong></span></p>
            <button class="boton boton--principal boton--bloque" type="submit">${icono('candado')}Pagar ${dinero(total)}</button>
            <a class="boton boton--texto" href="retiro.html">${icono('izquierda')}Volver a elegir tienda</a>
          </form>
        </section>
        ${resumenPedido(`<div class="tienda" style="margin-top:1rem;background:var(--blanco)"><span class="tienda__icono">${icono('ubicacion')}</span><div>${textoEntrega(entrega, tienda)}</div></div>`)}
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-pago', main);
      // Una clave por intento de pago: si el envío se repite, la base devuelve el mismo pedido
      const clavePago = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : null;
      activarCamposTarjeta(form);
      const cvvG = $('#cvv-g', form);
      if (cvvG) filtrarEntrada(cvvG, NO_DIGITOS, 3);
      filtrarEntrada($('#comprobante', form), NO_DIGITOS, 12);
      const nueva = $('#tarjeta-nueva', form);
      const forma = () => (($('input[name="forma"]:checked', form) || {}).value) || 'Tarjeta';
      const usarNueva = () => !tarjetas.length || (($('input[name="metodo"]:checked', form) || {}).value === 'nueva');
      form.addEventListener('change', (e) => {
        if (e.target.name === 'forma') {
          $('#pago-tarjeta', form).hidden = forma() !== 'Tarjeta';
          $('#pago-transferencia', form).hidden = forma() !== 'Transferencia';
          ocultarResumen(form);
        }
        if (e.target.name === 'metodo') {
          nueva.hidden = !usarNueva();
          $('#cvv-guardada', form).hidden = usarNueva();
          ocultarResumen(form);
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let pago;
        let datosTarjeta = null;
        if (forma() === 'Transferencia') {
          const banco = $('#banco', form).value;
          const ref = $('#comprobante', form).value.trim();
          const errBanco = banco ? '' : 'Elige el banco desde el que transferiste.';
          const eb = $('#banco-error', form); eb.hidden = !errBanco; $('span', eb).textContent = errBanco;
          $('#banco', form).setAttribute('aria-invalid', errBanco ? 'true' : 'false');
          if (!validarFormulario(form, [['banco', errBanco], ['comprobante', /^[0-9]{6,12}$/.test(ref) ? '' : 'El comprobante debe tener de 6 a 12 números.']], 'Revisa la transferencia:')) return;
          pago = { metodo: 'Transferencia', banco, referencia: ref };
        } else if (usarNueva()) {
          datosTarjeta = leerTarjeta(form);
          if (!datosTarjeta) return;
          if (datosTarjeta.resultado === 'rechazada') { validarFormulario(form, [['tarjeta', 'Tu banco rechazó el pago. Prueba con otra tarjeta.']], 'Pago rechazado:'); return; }
          if (datosTarjeta.resultado === 'sin fondos') { validarFormulario(form, [['tarjeta', 'La tarjeta no tiene fondos suficientes. Prueba con otra tarjeta.']], 'Pago rechazado:'); return; }
        } else {
          if (!validarFormulario(form, [['cvv-g', Validar.cvv(cvvG.value)]], 'Revisa el pago:')) return;
          pago = { metodo: 'Tarjeta', tarjeta: Number($('input[name="metodo"]:checked', form).value) };
        }
        const boton = $('button[type="submit"]', form);
        const r = await conEspera(boton, 'Procesando pago…', async () => {
          mostrarProcesando(main, true);
          if (datosTarjeta) {
            const rg = await Api.cliente.guardarTarjeta(datosTarjeta.registro);
            if (rg.error) return rg;
            pago = { metodo: 'Tarjeta', tarjeta: rg.datos.id };
          }
          const items = estado.carrito.map((l) => ({ producto: producto(l.id).dbId, talla: l.talla || '', cantidad: l.cantidad }));
          if (items.some((i) => !i.producto)) return { error: 'Algunos productos no están disponibles en este momento. Recarga la página.' };
          guardarPendiente();
          const rp = await Api.pedidos.crear({ items, clave: clavePago, tienda: tienda.id, pago });
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
        const fila = r.datos;
        const detalleEntrega = { tienda: `${tienda.nombre} (${tienda.direccion})`, horario: `Listo en ${ENTREGA.retiro} · ${tienda.horario}` };
        const productosTexto = estado.carrito.map((l) => `${l.cantidad} × ${producto(l.id).nombre}${l.talla ? ' (talla ' + l.talla + ')' : ''}`).join(', ');
        // Correos de confirmación al cliente y de aviso al administrador (no detienen la compra si fallan).
        // Se esperan como máximo 6 segundos antes de cambiar de página para que alcancen a salir.
        mostrarProcesando(main, true);
        const correos = Promise.allSettled([
          Api.correo.compraConfirmada({ correo: correoSesion(), nombre: estado.cliente.nombres, numero: fila.numero, total: fila.total, codigo: fila.codigoRetiro, pagoTexto: textoPago(pago, datosTarjeta), id: fila.id, ...detalleEntrega }),
          Api.correo.nuevoPedido({
            numero: fila.numero, total: fila.total, tienda: detalleEntrega.tienda,
            cliente: `${estado.cliente.nombres} ${estado.cliente.apellidos}`, cedula: estado.cliente.cedula,
            correo: correoSesion(), telefono: estado.cliente.telefono, productos: productosTexto
          })]);
        await Promise.race([correos, new Promise((ok) => setTimeout(ok, 6000))]);
        terminarCompra(fila);
      });
    }
  };
}
function textoPago(pago, datosTarjeta) {
  if (!pago) return '';
  if (pago.metodo === 'Transferencia') return `Transferencia desde ${pago.banco}, comprobante ${pago.referencia}`;
  if (datosTarjeta) return `Tarjeta ${datosTarjeta.registro.marca} terminada en ${datosTarjeta.registro.ultimos4}`;
  return 'Tarjeta guardada';
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

function terminarCompra(fila) {
  guardarTemporal('ultimo-pedido', { numero: fila.numero, id: fila.id });
  guardarTemporal('entrega', null);
  estado.carrito = [];
  guardarCarrito(); actualizarContador(); borrarPendiente();
  location.replace('confirmacion.html');
}

/* ======================= Datos de un pedido (para confirmación y orden de pedido) ======================= */
async function cargarPedido(params) {
  const id = Number(params.get('pedido') || (leerTemporal('ultimo-pedido') || {}).id);
  if (!id) return { error: 'No encontramos ese pedido.' };
  const r = await Api.pedidos.uno(id);
  if (r.error) return r;
  if (!r.datos) return { error: 'No encontramos ese pedido o no es de tu cuenta.' };
  return r;
}
const horaCorta = (f) => new Date(f).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });

/* ======================= Confirmación ======================= */
async function vistaConfirmacion(partes, params) {
  if (!protegerCuenta()) return null;
  if (!params.get('pedido') && !leerTemporal('ultimo-pedido')) { ir('pedidos.html'); return null; }
  const r = await cargarPedido(params);
  if (r.error) return { titulo: 'Compra realizada', seccion: 'carrito', html: errorCargaHtml(r.error) };
  const p = r.datos;
  return {
    titulo: 'Compra realizada',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(4)}
      <div class="panel centro">
        <div class="icono-exito"><span>${icono('check')}</span></div>
        <h1 class="titulo-pagina">¡Compra realizada con éxito!</h1>
        <p class="subtitulo">Gracias por tu compra, ${esc(nombreCliente())}. Te enviamos la orden de pedido a <strong>${esc(correoSesion())}</strong>.</p>
        <p class="numero-pedido">Pedido N.º ${esc(p.numero)}</p>
        <div class="codigo-retiro" role="group" aria-label="Código de retiro">
          <span>Tu código de retiro</span>
          <strong>${esc(p.codigoRetiro)}</strong>
          <span class="texto-suave">Preséntalo con tu cédula en la tienda</span>
        </div>
        <dl class="datos-lista panel panel--gris detalle-pedido">
          <dt>Productos</dt><dd>${plural(p.detalle_pedido.reduce((s, d) => s + d.cantidad, 0), 'producto', 'productos')}</dd>
          <dt>Total pagado</dt><dd>${dinero(p.total)}</dd>
          <dt>Pago</dt><dd>${esc(p.pagoTexto)} · ${esc(p.pago ? p.pago.estado : 'Aprobado')}</dd>
          <dt>Retiro en</dt><dd>${esc(p.tiendas.nombre)} · ${esc(p.tiendas.direccion)}</dd>
          <dt>Listo aprox.</dt><dd>${horaCorta(p.horaEstimada)} (${ENTREGA.retiro})</dd>
        </dl>
        <div class="botones-fila" style="margin-top:1.5rem">
          <a class="boton boton--principal" href="orden.html?pedido=${p.id}">${icono('documento')}Ver orden de pedido</a>
          <a class="boton boton--secundario" href="pedidos.html">${icono('paquete')}Ver mis pedidos</a>
        </div>
        <a class="boton boton--texto boton--bloque" style="margin-top:.75rem" href="productos.html">Seguir comprando</a>
      </div>
    </div>`
  };
}

/* ======================= Orden de pedido (imprimible) ======================= */
async function vistaOrden(partes, params) {
  if (!protegerCuenta()) return null;
  const r = await cargarPedido(params);
  if (r.error) return { titulo: 'Orden de pedido', seccion: 'pedidos', html: errorCargaHtml(r.error) };
  const p = r.datos;
  const cli = p.cliente || estado.cliente;
  return {
    titulo: `Orden de pedido ${p.numero}`,
    seccion: 'pedidos',
    html: `
    <div class="contenedor pagina">
      <div class="botones-fila no-imprimir" style="margin-bottom:1rem">
        <a class="boton boton--texto" href="${estado.esAdmin && !p.esMio ? 'admin.html' : 'pedidos.html'}">${icono('izquierda')}Volver</a>
        <button class="boton boton--principal" type="button" id="imprimir">${icono('documento')}Imprimir o guardar en PDF</button>
      </div>
      <article class="panel orden-pedido" aria-labelledby="titulo-orden">
        <header class="orden-pedido__cabecera">
          <div><span class="logo logo--orden" aria-hidden="true">ATHLETIX</span><p class="texto-suave">Tienda deportiva en línea · tienda académica</p></div>
          <div class="orden-pedido__numero"><h1 id="titulo-orden">Orden de pedido</h1><p><strong>N.º ${esc(p.numero)}</strong></p><p class="texto-suave">${fechaHora(p.creado_en)}</p></div>
        </header>
        <div class="codigo-retiro codigo-retiro--orden">
          <span>Código de retiro</span><strong>${esc(p.codigoRetiro)}</strong>
          <span class="texto-suave">Preséntalo en la tienda junto con tu cédula.</span>
        </div>
        <div class="orden-pedido__grilla">
          <section aria-labelledby="orden-cliente"><h2 id="orden-cliente">Cliente</h2>
            <dl class="datos-lista datos-lista--compacta">
              <dt>Nombre</dt><dd>${esc(cli.nombres)} ${esc(cli.apellidos)}</dd>
              <dt>Cédula</dt><dd>${esc(cli.cedula)}</dd>
              <dt>Celular</dt><dd>${esc(cli.telefono)}</dd>
              <dt>Correo</dt><dd>${esc(cli.correo || correoSesion())}</dd>
            </dl></section>
          <section aria-labelledby="orden-entrega"><h2 id="orden-entrega">Retiro en tienda</h2>
            <dl class="datos-lista datos-lista--compacta">
              <dt>Tienda</dt><dd>${esc(p.tiendas.nombre)}</dd><dt>Dirección</dt><dd>${esc(p.tiendas.direccion)}</dd><dt>Horario</dt><dd>${esc(p.tiendas.horario)}</dd>
              <dt>Listo aprox.</dt><dd>${fechaHora(p.horaEstimada)}</dd>
              <dt>Estado</dt><dd>${esc(nombreEstado(p.estado))}</dd>
            </dl></section>
        </div>
        <h2>Productos que debes retirar</h2>
        <div class="tabla-desplazable" tabindex="0" role="region" aria-label="Productos del pedido">
          <table class="tabla-orden">
            <thead><tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Talla</th><th scope="col" class="num">Cant.</th><th scope="col" class="num">P. unitario</th><th scope="col" class="num">Subtotal</th></tr></thead>
            <tbody>${p.detalle_pedido.map((d) => { const pr = productoPorDbId(d.producto_id); return `<tr><td>${esc(d.producto_id)}</td><td>${esc(pr ? pr.nombre : d.producto_id)}</td><td>${esc(d.talla || 'Única')}</td><td class="num">${d.cantidad}</td><td class="num">${dinero(d.precio_unitario)}</td><td class="num">${dinero(d.precio_unitario * d.cantidad)}</td></tr>`; }).join('')}</tbody>
            <tfoot>
              <tr><th scope="row" colspan="5">Subtotal</th><td class="num">${dinero(p.subtotal)}</td></tr>
              <tr><th scope="row" colspan="5">IVA (15 %)</th><td class="num">${dinero(p.iva)}</td></tr>
              <tr><th scope="row" colspan="5">Retiro en tienda</th><td class="num">Gratis</td></tr>
              <tr class="tabla-orden__total"><th scope="row" colspan="5">Total pagado</th><td class="num">${dinero(p.total)}</td></tr>
            </tfoot>
          </table>
        </div>
        <p style="margin-top:1rem"><strong>Pago:</strong> ${esc(p.pagoTexto)} · ${esc(p.pago ? p.pago.estado : '')} · ${p.pago ? fechaHora(p.pago.fecha) : ''}</p>
        <p class="texto-suave" style="margin-top:.5rem">Pago simulado de una tienda académica: no es una factura ni un comprobante tributario.</p>
      </article>
    </div>`,
    montar(main) { $('#imprimir', main).addEventListener('click', () => window.print()); }
  };
}
