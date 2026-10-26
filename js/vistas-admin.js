/* ATHLETIX · Panel del administrador, ayuda y página no encontrada */
'use strict';

/* ======================= Panel de pedidos (administrador) ======================= */
async function vistaAdmin(partes, params) {
  if (!protegerCuenta()) return null;
  if (!estado.esAdmin) return vistaNoEncontrada();
  const r = await Api.pedidos.todos();
  if (r.error) return { titulo: 'Panel de pedidos', seccion: 'admin', html: errorCargaHtml(r.error) };
  const filtro = ['Recibido', 'Preparando', 'Listo', 'Retirado', 'Cancelado'].includes(params.get('estado')) ? params.get('estado') : '';
  const todos = r.datos || [];
  const lista = filtro ? todos.filter((p) => p.estado === filtro) : todos;
  const cuenta = (e) => todos.filter((p) => p.estado === e).length;
  return {
    titulo: 'Panel de pedidos',
    seccion: 'admin',
    html: `
    <div class="contenedor pagina">
      <h1 class="titulo-pagina">Panel de pedidos</h1>
      <p class="subtitulo cabecera-pagina">Cambia el estado de cada pedido. Al marcarlo como <strong>Listo para retirar</strong>, el cliente recibe un correo automáticamente.</p>
      ${Api.correo.configurado() ? '' : `<p class="alerta" style="margin-bottom:1rem">${icono('alerta')}<span>El envío de correos no está configurado (falta la plantilla de EmailJS).</span></p>`}
      <nav class="filtro-estados" aria-label="Filtrar pedidos por estado">
        <a href="#/admin" ${!filtro ? 'aria-current="page"' : ''}>Todos (${todos.length})</a>
        ${ESTADOS.concat('Cancelado').map((e) => `<a href="#/admin?estado=${e}" ${filtro === e ? 'aria-current="page"' : ''}>${NOMBRE_ESTADO[e]} (${cuenta(e)})</a>`).join('')}
      </nav>
      ${!lista.length ? `<div class="panel panel--gris vacio">${icono('paquete')}<p>No hay pedidos${filtro ? ' en este estado' : ''}.</p></div>` : `
      <ul class="pedidos">${lista.map((p) => `
        <li class="pedido" data-pedido="${p.id}">
          <div class="pedido__cabecera">
            <h2 class="pedido__numero">${esc(p.numero)}</h2>
            <span class="estado estado--${p.estado.toLowerCase()}">${NOMBRE_ESTADO[p.estado]}</span>
          </div>
          <p class="texto-suave">${fechaHora(p.creado_en)} · ${esc(p.tienda)}</p>
          <dl class="datos-lista datos-lista--compacta" style="margin-top:.75rem">
            <dt>Cliente</dt><dd>${esc(p.cliente)} · C.I. ${esc(p.cedula)}</dd>
            <dt>Contacto</dt><dd>${esc(p.correo)} · ${esc(p.telefono)}</dd>
            <dt>Productos</dt><dd>${esc(p.productos)}</dd>
            <dt>Total</dt><dd>${dinero(p.total)}</dd>
          </dl>
          <form class="cambio-estado" data-form-estado="${p.id}">
            <label for="estado-${p.id}">Cambiar estado</label>
            <select id="estado-${p.id}">${ESTADOS.concat('Cancelado').map((e) => `<option value="${e}" ${e === p.estado ? 'selected' : ''}>${NOMBRE_ESTADO[e]}</option>`).join('')}</select>
            <button class="boton boton--principal" type="submit">Guardar</button>
          </form>
          <p class="texto-suave resultado-estado" aria-live="polite"></p>
        </li>`).join('')}
      </ul>`}
    </div>`,
    montar(main) {
      main.addEventListener('submit', async (e) => {
        const form = e.target.closest('[data-form-estado]');
        if (!form) return;
        e.preventDefault();
        const p = todos.find((x) => x.id === Number(form.dataset.formEstado));
        const nuevo = $('select', form).value;
        const salida = $('.resultado-estado', form.parentElement);
        if (nuevo === p.estado) { salida.textContent = 'El pedido ya está en ese estado.'; return; }
        const r2 = await conEspera($('button', form), 'Guardando…', async () => {
          const rc = await Api.pedidos.cambiarEstado(p.id, nuevo);
          if (rc.error) return rc;
          p.estado = nuevo;
          if (nuevo === 'Listo') return { correo: await Api.correo.pedidoListo(p) };
          return {};
        });
        if (!r2) return;
        if (r2.error) { salida.textContent = r2.error; aviso(r2.error, 'error'); return; }
        const etiqueta = $('.estado', form.parentElement);
        etiqueta.textContent = NOMBRE_ESTADO[nuevo];
        etiqueta.className = `estado estado--${nuevo.toLowerCase()}`;
        let texto = `Estado cambiado a "${NOMBRE_ESTADO[nuevo]}".`;
        if (r2.correo) texto += r2.correo.error ? ` ${r2.correo.error}` : ` Se envió un correo a ${p.correo}.`;
        salida.textContent = texto;
        aviso(texto, r2.correo && r2.correo.error ? 'error' : 'ok');
      });
    }
  };
}

/* ======================= Ayuda y página no encontrada ======================= */
function vistaAyuda() {
  return {
    titulo: 'Centro de ayuda',
    seccion: 'ayuda',
    html: `
    <div class="contenedor pagina">
      <h1 class="titulo-pagina">Centro de ayuda</h1>
      <p class="subtitulo cabecera-pagina">Respuestas a las preguntas más frecuentes.</p>
      <div class="preguntas">
        ${AYUDA.map(([q, r], i) => `<details class="pregunta" ${i === 0 ? 'open' : ''}><summary>${q}</summary><p>${r}</p></details>`).join('')}
      </div>
      <div class="panel panel--gris" style="margin-top:2rem;max-width:48rem">
        <h2>¿Necesitas más ayuda?</h2>
        <p>Escríbenos a <a href="mailto:ayuda@athletix.ec">ayuda@athletix.ec</a> o llama al <a href="tel:1800284538">1800 284 538</a>, de lunes a sábado de 09:00 a 18:00.</p>
      </div>
    </div>`
  };
}

function vistaNoEncontrada() {
  return {
    titulo: 'Página no encontrada',
    seccion: '',
    html: `
    <div class="contenedor pagina centro">
      <h1 class="titulo-pagina">No encontramos esta página</h1>
      <p class="subtitulo">Puede que el enlace esté incompleto.</p>
      <a class="boton boton--principal" style="margin-top:1.5rem" href="#/">Ir al inicio</a>
    </div>`
  };
}
