/* ATHLETIX · Vistas de compra: entrega, pago, confirmación, orden de pedido y simulación del envío */
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

/* Entrega elegida (se guarda mientras dura la compra) */
function leerEntrega() {
  const e = leerTemporal('entrega');
  if (!e || !['Retiro', 'Domicilio'].includes(e.tipo)) return null;
  return e;
}
const costoEnvio = (e) => (e && e.tipo === 'Domicilio' ? ENTREGA.costoEnvio : 0);

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

/* ======================= Entrega: retiro en tienda o envío a domicilio ======================= */
async function vistaRetiro() {
  if (!protegerCompra()) return null;
  const rt = await cargarTiendas();
  if (rt.error) return { titulo: 'Entrega', seccion: 'carrito', html: errorCargaHtml(rt.error) };
  // Si no eligió en esta compra, se usa la última forma de entrega que usó esta cuenta (guardada en el navegador)
  const ultima = leerLocal(claveCuenta(CLAVE_ENTREGA));
  const ultimaValida = ultima && (ultima.tipo === 'Domicilio' ? ENTREGA.ciudades.includes(ultima.ciudad) : estado.tiendas.some((t) => t.id === ultima.tienda));
  const recordada = !leerEntrega() && ultimaValida;
  const e = leerEntrega() || (ultimaValida ? ultima : null) || { tipo: 'Retiro', tienda: estado.tiendas[0] && estado.tiendas[0].id };
  const c = estado.cliente;
  const ciudades = ENTREGA.ciudades.filter((x) => estado.tiendas.some((t) => t.ciudad === x));
  return {
    titulo: 'Entrega',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(2)}
      <h1 class="titulo-pagina cabecera-pagina">Entrega</h1>
      ${recordada ? `<p class="alerta alerta--info" style="margin-bottom:1rem">${icono('info')}<span>Usamos tu última forma de entrega. Puedes cambiarla si quieres.</span></p>` : ''}
      <div class="compra-grilla">
        <form id="form-retiro" class="formulario" style="display:grid;gap:1.5rem" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          <fieldset class="panel">
            <legend class="leyenda-panel">¿Cómo quieres recibir tu pedido?</legend>
            <div class="opciones-tienda">
              <label class="opcion-tienda">
                <input type="radio" name="tipo" value="Retiro" ${e.tipo === 'Retiro' ? 'checked' : ''}>
                <span class="opcion-tienda__cuerpo"><span class="tienda__icono">${icono('tienda')}</span>
                  <span><strong>Retiro en tienda · Gratis</strong><span class="d-bloque">Listo en <strong>${ENTREGA.retiro}</strong>. Te avisamos por correo.</span></span></span>
              </label>
              <label class="opcion-tienda">
                <input type="radio" name="tipo" value="Domicilio" ${e.tipo === 'Domicilio' ? 'checked' : ''}>
                <span class="opcion-tienda__cuerpo"><span class="tienda__icono">${icono('camion')}</span>
                  <span><strong>Envío a domicilio express · ${dinero(ENTREGA.costoEnvio)}</strong><span class="d-bloque">Llega en <strong>${ENTREGA.domicilio}</strong> en ${ciudades.join(' y ')}.</span></span></span>
              </label>
            </div>
          </fieldset>

          <fieldset class="panel" id="bloque-tienda" ${e.tipo === 'Retiro' ? '' : 'hidden'}>
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

          <section class="panel" id="bloque-domicilio" aria-labelledby="titulo-direccion" ${e.tipo === 'Domicilio' ? '' : 'hidden'}>
            <h2 id="titulo-direccion">¿A dónde lo enviamos?</h2>
            <div class="formulario">
              <div class="campo">
                <label for="ciudad">Ciudad <span class="requerido" aria-hidden="true">*</span></label>
                <select id="ciudad" name="ciudad" aria-describedby="ciudad-error">${ciudades.map((x) => `<option ${x === e.ciudad ? 'selected' : ''}>${x}</option>`).join('')}</select>
                <p class="campo__error" id="ciudad-error" hidden>${icono('alerta')}<span></span></p>
              </div>
              ${campo({ id: 'direccion', etiqueta: 'Dirección', ayuda: 'Calle principal, número y calle secundaria. Ejemplo: Av. Amazonas N34-120 y Av. Colón', valor: e.direccion || '', max: 150, extra: 'autocomplete="street-address"' })}
              ${campo({ id: 'referencia', etiqueta: 'Referencia', ayuda: 'Opcional. Ejemplo: edificio azul, departamento 3B', valor: e.referencia || '', max: 120, opcional: true })}
            </div>
          </section>

          <section class="panel" aria-labelledby="titulo-quien">
            <h2 id="titulo-quien">Quién recibe</h2>
            <dl class="datos-lista">
              <dt>Nombre</dt><dd>${esc(c.nombres)} ${esc(c.apellidos)}</dd>
              <dt>Cédula</dt><dd>${esc(c.cedula)}</dd>
              <dt>Celular</dt><dd>${esc(c.telefono)}</dd>
              <dt>Correo</dt><dd>${esc(correoSesion())}</dd>
            </dl>
            <p class="alerta alerta--info" style="margin-top:1.25rem">${icono('correo')}<span>Al pagar recibes la <strong>orden de pedido</strong> con un código de 6 letras. Preséntalo junto con tu cédula al retirar o al recibir el envío. <a href="seguimiento.html">Mira cómo funciona la entrega</a>.</span></p>
          </section>
        </form>
        <div id="zona-resumen">${resumenPedido(botonesEntrega(), costoEnvio(e))}</div>
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-retiro', main);
      activarEnlacesError(form);
      const tipo = () => (new FormData(form).get('tipo')) || 'Retiro';
      form.addEventListener('change', (ev) => {
        if (ev.target.name !== 'tipo') return;
        const t = tipo();
        $('#bloque-tienda', main).hidden = t !== 'Retiro';
        $('#bloque-domicilio', main).hidden = t !== 'Domicilio';
        $('#zona-resumen', main).innerHTML = resumenPedido(botonesEntrega(), costoEnvio({ tipo: t }));
        anunciar(t === 'Retiro' ? 'Elegiste retiro en tienda, gratis.' : `Elegiste envío a domicilio. Costo ${dinero(ENTREGA.costoEnvio)}.`);
      });
      validarAlSalir(form, 'direccion', (v) => (v.trim().length < 8 ? 'Escribe la dirección completa (mínimo 8 caracteres).' : ''));
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const d = new FormData(form);
        const t = tipo();
        if (t === 'Retiro') {
          if (!d.get('tienda')) { aviso('Elige la tienda donde retirarás tu pedido.', 'error'); return; }
          guardarTemporal('entrega', { tipo: 'Retiro', tienda: Number(d.get('tienda')) });
          guardarLocal(claveCuenta(CLAVE_ENTREGA), leerEntrega());
        } else {
          const direccion = String(d.get('direccion') || '').trim().replace(/\s+/g, ' ');
          if (!validarFormulario(form, [['direccion', direccion.length < 8 ? 'Escribe la dirección completa (mínimo 8 caracteres).' : '']], 'Revisa la dirección de entrega:')) return;
          guardarTemporal('entrega', { tipo: 'Domicilio', ciudad: d.get('ciudad'), direccion, referencia: String(d.get('referencia') || '').trim() });
          guardarLocal(claveCuenta(CLAVE_ENTREGA), leerEntrega());
        }
        ir('pago.html');
      });
    }
  };
}
function botonesEntrega() {
  return `<button class="boton boton--principal boton--bloque" type="submit" form="form-retiro">Continuar al pago</button><a class="boton boton--texto boton--bloque" href="carrito.html">${icono('izquierda')}Volver al carrito</a>`;
}
function textoEntrega(e, tienda) {
  if (e.tipo === 'Domicilio') return `<strong style="font-size:1rem">Envío a domicilio · llega en ${ENTREGA.domicilio}</strong><p class="texto-suave">${esc(e.direccion)}, ${esc(e.ciudad)}</p>`;
  return `<strong style="font-size:1rem">Retiro en ${esc(tienda ? tienda.nombre : '')} · listo en ${ENTREGA.retiro}</strong><p class="texto-suave">${esc(tienda ? tienda.direccion : '')}</p>`;
}

/* ======================= Pago (simulado): tarjeta o transferencia ======================= */
async function vistaPago() {
  if (!protegerCompra()) return null;
  const rTiendas = await cargarTiendas();
  if (rTiendas.error) return { titulo: 'Pago', seccion: 'carrito', html: errorCargaHtml(rTiendas.error) };
  const entrega = leerEntrega();
  const tienda = entrega && entrega.tipo === 'Retiro' ? estado.tiendas.find((t) => t.id === entrega.tienda) : null;
  if (!entrega || (entrega.tipo === 'Retiro' && !tienda)) { ir('retiro.html'); return null; }
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
  const envio = costoEnvio(entrega);
  const total = totalCarrito() + envio;
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
            <a class="boton boton--texto" href="retiro.html">${icono('izquierda')}Volver a la entrega</a>
          </form>
        </section>
        ${resumenPedido(`<div class="tienda" style="margin-top:1rem;background:var(--blanco)"><span class="tienda__icono">${icono(entrega.tipo === 'Domicilio' ? 'camion' : 'ubicacion')}</span><div>${textoEntrega(entrega, tienda)}</div></div>`, envio)}
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
          const rp = await Api.pedidos.crear({ items, clave: clavePago, entrega, pago });
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
        const detalleEntrega = entrega.tipo === 'Domicilio'
          ? { tienda: `Envío a domicilio: ${entrega.direccion}, ${entrega.ciudad}`, horario: `Llega en ${ENTREGA.domicilio}` }
          : { tienda: `${tienda.nombre} (${tienda.direccion})`, horario: `Listo en ${ENTREGA.retiro} · ${tienda.horario}` };
        const productosTexto = estado.carrito.map((l) => `${l.cantidad} × ${producto(l.id).nombre}${l.talla ? ' (talla ' + l.talla + ')' : ''}`).join(', ');
        // Correos de confirmación al cliente y de aviso al administrador (no detienen la compra si fallan).
        // Se esperan como máximo 6 segundos antes de cambiar de página para que alcancen a salir.
        mostrarProcesando(main, true);
        const correos = Promise.allSettled([
          Api.correo.compraConfirmada({ correo: correoSesion(), nombre: estado.cliente.nombres, numero: fila.numero, total: fila.total, codigo: fila.codigoRetiro, pagoTexto: textoPago(pago, datosTarjeta), entrega: entrega.tipo, ...detalleEntrega }),
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

/* ======================= Datos de un pedido (para confirmación, orden y seguimiento) ======================= */
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
  const domicilio = p.entrega === 'Domicilio';
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
        <div class="codigo-retiro" role="group" aria-label="Código de ${domicilio ? 'entrega' : 'retiro'}">
          <span>Tu código de ${domicilio ? 'entrega' : 'retiro'}</span>
          <strong>${esc(p.codigoRetiro)}</strong>
          <span class="texto-suave">Preséntalo con tu cédula ${domicilio ? 'al recibir el envío' : 'en la tienda'}</span>
        </div>
        <dl class="datos-lista panel panel--gris detalle-pedido">
          <dt>Productos</dt><dd>${plural(p.detalle_pedido.reduce((s, d) => s + d.cantidad, 0), 'producto', 'productos')}</dd>
          <dt>Total pagado</dt><dd>${dinero(p.total)}</dd>
          <dt>Pago</dt><dd>${esc(p.pagoTexto)} · ${esc(p.pago ? p.pago.estado : 'Aprobado')}</dd>
          <dt>${domicilio ? 'Envío a' : 'Retiro en'}</dt><dd>${domicilio ? `${esc(p.direccion)}, ${esc(p.ciudad)}` : `${esc(p.tiendas.nombre)} · ${esc(p.tiendas.direccion)}`}</dd>
          <dt>${domicilio ? 'Llega aprox.' : 'Listo aprox.'}</dt><dd>${horaCorta(p.horaEstimada)} (${domicilio ? ENTREGA.domicilio : ENTREGA.retiro})</dd>
        </dl>
        <div class="botones-fila" style="margin-top:1.5rem">
          <a class="boton boton--principal" href="orden.html?pedido=${p.id}">${icono('documento')}Ver orden de pedido</a>
          <a class="boton boton--secundario" href="seguimiento.html?pedido=${p.id}">${icono('camion')}Ver simulación del envío</a>
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
  const domicilio = p.entrega === 'Domicilio';
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
          <span>Código de ${domicilio ? 'entrega' : 'retiro'}</span><strong>${esc(p.codigoRetiro)}</strong>
          <span class="texto-suave">${domicilio ? 'Muéstralo al repartidor junto con tu cédula.' : 'Preséntalo en la tienda junto con tu cédula.'}</span>
        </div>
        <div class="orden-pedido__grilla">
          <section aria-labelledby="orden-cliente"><h2 id="orden-cliente">Cliente</h2>
            <dl class="datos-lista datos-lista--compacta">
              <dt>Nombre</dt><dd>${esc(cli.nombres)} ${esc(cli.apellidos)}</dd>
              <dt>Cédula</dt><dd>${esc(cli.cedula)}</dd>
              <dt>Celular</dt><dd>${esc(cli.telefono)}</dd>
              <dt>Correo</dt><dd>${esc(cli.correo || correoSesion())}</dd>
            </dl></section>
          <section aria-labelledby="orden-entrega"><h2 id="orden-entrega">${domicilio ? 'Envío a domicilio' : 'Retiro en tienda'}</h2>
            <dl class="datos-lista datos-lista--compacta">
              ${domicilio ? `<dt>Dirección</dt><dd>${esc(p.direccion)}</dd><dt>Ciudad</dt><dd>${esc(p.ciudad)}</dd>${p.referencia ? `<dt>Referencia</dt><dd>${esc(p.referencia)}</dd>` : ''}<dt>Despacha</dt><dd>${esc(p.tiendas.nombre)}</dd>`
                : `<dt>Tienda</dt><dd>${esc(p.tiendas.nombre)}</dd><dt>Dirección</dt><dd>${esc(p.tiendas.direccion)}</dd><dt>Horario</dt><dd>${esc(p.tiendas.horario)}</dd>`}
              <dt>${domicilio ? 'Llega aprox.' : 'Listo aprox.'}</dt><dd>${fechaHora(p.horaEstimada)}</dd>
              <dt>Estado</dt><dd>${esc(nombreEstado(p.estado, p.entrega))}</dd>
            </dl></section>
        </div>
        <h2>Productos que ${domicilio ? 'recibes' : 'debes retirar'}</h2>
        <div class="tabla-desplazable" tabindex="0" role="region" aria-label="Productos del pedido">
          <table class="tabla-orden">
            <thead><tr><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Talla</th><th scope="col" class="num">Cant.</th><th scope="col" class="num">P. unitario</th><th scope="col" class="num">Subtotal</th></tr></thead>
            <tbody>${p.detalle_pedido.map((d) => { const pr = productoPorDbId(d.producto_id); return `<tr><td>${esc(d.producto_id)}</td><td>${esc(pr ? pr.nombre : d.producto_id)}</td><td>${esc(d.talla || 'Única')}</td><td class="num">${d.cantidad}</td><td class="num">${dinero(d.precio_unitario)}</td><td class="num">${dinero(d.precio_unitario * d.cantidad)}</td></tr>`; }).join('')}</tbody>
            <tfoot>
              <tr><th scope="row" colspan="5">Subtotal</th><td class="num">${dinero(p.subtotal)}</td></tr>
              <tr><th scope="row" colspan="5">IVA (15 %)</th><td class="num">${dinero(p.iva)}</td></tr>
              <tr><th scope="row" colspan="5">${domicilio ? 'Envío a domicilio' : 'Retiro en tienda'}</th><td class="num">${p.costoEnvio ? dinero(p.costoEnvio) : 'Gratis'}</td></tr>
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

/* ======================= Simulación del envío ======================= */
// Etapas con el tiempo aproximado desde que se paga (coinciden con la hora estimada que guarda la base)
const ETAPAS_ENVIO = {
  Retiro: [
    ['Recibido', 'Pago aprobado', 'La tienda recibe tu pedido y el pago queda registrado.', 0],
    ['Preparando', 'Preparando', 'Un vendedor busca tus productos en bodega y los empaca.', 15],
    ['Listo', 'Listo para retirar', 'Te llega un correo: tu pedido te espera en la tienda.', 60],
    ['Retirado', 'Retirado', 'Presentas tu código y tu cédula y te llevas tu compra.', null]],
  Domicilio: [
    ['Recibido', 'Pago aprobado', 'La tienda recibe tu pedido y el pago queda registrado.', 0],
    ['Preparando', 'Preparando', 'Empacamos tus productos en la tienda más cercana.', 20],
    ['Listo', 'En camino', 'Un repartidor en moto lleva tu pedido a tu dirección.', 60],
    ['Retirado', 'Entregado', 'El repartidor te entrega el paquete al ver tu código y tu cédula.', 150]]
};
function rutaEnvioSvg(domicilio) {
  return `
    <svg class="ruta-envio__mapa" viewBox="0 0 600 170" role="img" aria-label="${domicilio ? 'Recorrido desde la tienda hasta tu casa' : 'Recorrido de tu pedido dentro de la tienda'}">
      <path class="ruta-envio__camino" d="M60 120 C 180 20, 300 160, 420 70 S 540 60, 540 110" fill="none"/>
      <g transform="translate(30 95)"><rect width="60" height="45" rx="6" class="ruta-envio__tienda"/><text x="30" y="30" text-anchor="middle">Tienda</text></g>
      <g transform="translate(510 85)"><path d="M0 22 30 0 60 22v30H0z" class="ruta-envio__casa"/><text x="30" y="44" text-anchor="middle">${domicilio ? 'Tu casa' : 'Mostrador'}</text></g>
      <g class="ruta-envio__vehiculo" id="vehiculo"><circle r="15"/><text y="5" text-anchor="middle" aria-hidden="true">${domicilio ? '🛵' : '📦'}</text></g>
    </svg>`;
}
async function vistaSeguimiento(partes, params) {
  // Sin pedido se muestra una demostración de cómo funciona la entrega
  let p = null;
  if (params.get('pedido')) {
    if (!protegerCuenta()) return null;
    const r = await cargarPedido(params);
    if (r.error) return { titulo: 'Seguimiento', seccion: 'pedidos', html: errorCargaHtml(r.error) };
    p = r.datos;
  }
  const tipoInicial = p ? p.entrega : (params.get('tipo') === 'Retiro' ? 'Retiro' : 'Domicilio');
  return {
    titulo: p ? `Seguimiento ${p.numero}` : '¿Cómo funciona la entrega?',
    seccion: p ? 'pedidos' : 'ayuda',
    html: `
    <div class="contenedor pagina">
      <h1 class="titulo-pagina">${p ? `Seguimiento del pedido ${esc(p.numero)}` : '¿Cómo funciona la entrega?'}</h1>
      <p class="subtitulo cabecera-pagina">${p ? 'Así avanza tu pedido. El estado real lo actualiza la tienda; la simulación te muestra cada etapa.' : 'Simulación de cómo trabaja el retiro en tienda y el envío a domicilio express. No es un envío real.'}</p>
      ${p ? '' : `<fieldset class="grupo-filtro filtro-horizontal"><legend>Ver la simulación de</legend>
        <label class="opcion"><input type="radio" name="tipo-sim" value="Domicilio" ${tipoInicial === 'Domicilio' ? 'checked' : ''}> Envío a domicilio (${ENTREGA.domicilio})</label>
        <label class="opcion"><input type="radio" name="tipo-sim" value="Retiro" ${tipoInicial === 'Retiro' ? 'checked' : ''}> Retiro en tienda (${ENTREGA.retiro})</label></fieldset>`}
      <div class="seguimiento-grilla">
        <section class="panel ruta-envio" aria-labelledby="titulo-simulacion">
          <h2 id="titulo-simulacion">Simulación del ${tipoInicial === 'Domicilio' ? 'envío' : 'retiro'}</h2>
          <div id="mapa">${rutaEnvioSvg(tipoInicial === 'Domicilio')}</div>
          <p class="ruta-envio__texto" id="texto-sim" aria-live="polite"></p>
          <div class="botones-fila"><button class="boton boton--principal" type="button" id="reproducir">${icono('play')}Reproducir simulación</button>
          ${p ? `<a class="boton boton--secundario" href="orden.html?pedido=${p.id}">${icono('documento')}Ver orden de pedido</a>` : ''}</div>
        </section>
        <section class="panel" aria-labelledby="titulo-etapas">
          <h2 id="titulo-etapas">Etapas${p ? ' de tu pedido' : ''}</h2>
          <ol class="etapas" id="etapas"></ol>
          ${p && p.estado === 'Cancelado' ? '<p class="alerta" style="margin-top:1rem">Este pedido fue cancelado; el pago se anuló y los productos volvieron al stock.</p>' : ''}
        </section>
      </div>
    </div>`,
    montar(main) {
      let tipo = tipoInicial;
      const reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const camino = () => $('.ruta-envio__camino', main);
      const mover = (frac) => {
        const c = camino(); const v = $('#vehiculo', main);
        if (!c || !v) return;
        const pt = c.getPointAtLength(c.getTotalLength() * Math.min(1, Math.max(0, frac)));
        v.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      };
      const indiceReal = p ? ['Recibido', 'Preparando', 'Listo', 'Retirado'].indexOf(p.estado) : -1;
      const pintarEtapas = (activa) => {
        const base = p ? new Date(p.creado_en) : null;
        $('#etapas', main).innerHTML = ETAPAS_ENVIO[tipo].map(([, nombre, texto, min], i) => {
          const hecho = i <= activa;
          const hora = base && min !== null ? ` · aprox. ${horaCorta(new Date(base.getTime() + min * 60000))}` : (min !== null ? ` · ${min === 0 ? 'al pagar' : `a los ${min} min`}` : '');
          return `<li class="${hecho ? 'hecho' : ''}${i === activa ? ' actual' : ''}" ${i === activa ? 'aria-current="step"' : ''}><span class="etapas__punto">${hecho ? icono('check') : i + 1}</span><div><strong>${nombre}</strong><span class="texto-suave">${hora}</span><p>${texto}</p></div></li>`;
        }).join('');
      };
      const fracDe = (i) => [0, 0.08, 0.55, 1][i];
      const mostrarEtapa = (i) => {
        pintarEtapas(i); mover(fracDe(i));
        const [, nombre, texto] = ETAPAS_ENVIO[tipo][i];
        $('#texto-sim', main).textContent = `${nombre}: ${texto}`;
      };
      const inicial = () => mostrarEtapa(Math.max(0, indiceReal));
      inicial();
      let temporizador = null;
      $('#reproducir', main).addEventListener('click', () => {
        clearInterval(temporizador);
        let i = 0;
        mostrarEtapa(0);
        if (reducido) { mostrarEtapa(3); setTimeout(inicial, 2500); return; }
        // Animación de 8 segundos: el vehículo recorre la ruta y cada etapa se anuncia
        const inicio = performance.now();
        const paso = (t) => {
          const frac = Math.min(1, (t - inicio) / 8000);
          mover(frac);
          const etapa = frac < 0.1 ? 0 : frac < 0.35 ? 1 : frac < 0.99 ? 2 : 3;
          if (etapa !== i) { i = etapa; pintarEtapas(i); const [, n, x] = ETAPAS_ENVIO[tipo][i]; $('#texto-sim', main).textContent = `${n}: ${x}`; }
          if (frac < 1) requestAnimationFrame(paso); else setTimeout(inicial, 2500);
        };
        requestAnimationFrame(paso);
      });
      $$('input[name="tipo-sim"]', main).forEach((r) => r.addEventListener('change', () => {
        tipo = r.value;
        $('#mapa', main).innerHTML = rutaEnvioSvg(tipo === 'Domicilio');
        $('#titulo-simulacion', main).textContent = `Simulación del ${tipo === 'Domicilio' ? 'envío' : 'retiro'}`;
        inicial();
      }));
    }
  };
}
