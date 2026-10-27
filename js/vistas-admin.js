/* ATHLETIX · Panel del administrador, ayuda y página no encontrada */
'use strict';

/* ======================= Panel de pedidos (administrador) ======================= */
// Estados a los que puede pasar cada pedido (la base de datos aplica las mismas reglas)
const SIGUIENTES = {
  Recibido: ['Preparando', 'Listo', 'Cancelado'],
  Preparando: ['Listo', 'Cancelado'],
  Listo: ['Retirado', 'Cancelado'],
  Retirado: [],
  Cancelado: []
};
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
        <li class="pedido${estado.pedidoResaltado === p.id ? ' pedido--resaltado' : ''}" data-pedido="${p.id}" tabindex="-1">
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
          ${SIGUIENTES[p.estado].length ? `
          <div class="cambio-estado" role="group" aria-labelledby="cambiar-${p.id}">
            <p id="cambiar-${p.id}" class="cambio-estado__titulo">Pasar a:</p>
            ${SIGUIENTES[p.estado].map((e) => `<button class="boton ${e === 'Cancelado' ? 'boton--peligro' : 'boton--principal'}" type="button" data-pedido-id="${p.id}" data-nuevo-estado="${e}">${e === 'Cancelado' ? 'Cancelar pedido' : NOMBRE_ESTADO[e]}</button>`).join('')}
          </div>` : `<p class="texto-suave" style="margin-top:1rem">${p.estado === 'Retirado' ? 'Pedido entregado: ya no cambia de estado.' : 'Pedido cancelado: ya no cambia de estado.'}</p>`}
          <p class="texto-suave resultado-estado" aria-live="polite"></p>
        </li>`).join('')}
      </ul>`}
    </div>`,
    montar(main) {
      // Si se acaba de cambiar un pedido, se muestra resaltado en su nueva pestaña
      const resaltado = estado.pedidoResaltado && $(`[data-pedido="${estado.pedidoResaltado}"]`, main);
      if (resaltado) { resaltado.scrollIntoView({ block: 'center' }); resaltado.focus({ preventScroll: true }); }
      estado.pedidoResaltado = null;

      main.addEventListener('click', async (e) => {
        const boton = e.target.closest('[data-nuevo-estado]');
        if (!boton) return;
        const p = todos.find((x) => x.id === Number(boton.dataset.pedidoId));
        const nuevo = boton.dataset.nuevoEstado;
        if (nuevo === 'Cancelado' && !(await confirmar('¿Cancelar este pedido?', `El pedido ${p.numero} se cancelará y sus productos volverán al stock. No se puede deshacer.`, 'Sí, cancelar'))) return;
        $$('[data-nuevo-estado]', boton.parentElement).forEach((b) => { if (b !== boton) b.disabled = true; });
        const r2 = await conEspera(boton, 'Guardando…', async () => {
          const rc = await Api.pedidos.cambiarEstado(p.id, nuevo);
          if (rc.error) return rc;
          p.estado = nuevo;
          if (nuevo === 'Listo') return { correo: await Api.correo.pedidoListo(p) };
          return {};
        });
        if (!r2 || r2.error) {
          $$('[data-nuevo-estado]', boton.parentElement).forEach((b) => { b.disabled = false; });
          if (r2) aviso(r2.error, 'error');
          return;
        }
        let texto = `El pedido ${p.numero} pasó a "${NOMBRE_ESTADO[nuevo]}".`;
        if (r2.correo) texto += r2.correo.error ? ` ${r2.correo.error}` : ` Se envió un correo a ${p.correo}.`;
        aviso(texto, r2.correo && r2.correo.error ? 'error' : 'ok');
        anunciar(texto);
        revisarPedidosNuevos();
        // El pedido aparece de inmediato en la pestaña de su nuevo estado
        estado.pedidoResaltado = p.id;
        const destino = filtro ? `#/admin?estado=${nuevo}` : '#/admin';
        if (location.hash === destino) render(); else location.hash = destino;
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
        <p>Escríbenos a <a href="mailto:geovannymorocho621@gmail.com?subject=Consulta%20ATHLETIX">geovannymorocho621@gmail.com</a> y te respondemos de lunes a sábado, de 09:00 a 18:00.</p>
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
