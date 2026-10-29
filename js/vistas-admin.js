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
  const resaltar = leerTemporal('pedido-resaltado');
  return {
    titulo: 'Panel de pedidos',
    seccion: 'admin',
    html: `
    <div class="contenedor pagina">
      ${menuAdmin('pedidos')}
      <h1 class="titulo-pagina">Panel de pedidos</h1>
      <p class="subtitulo cabecera-pagina">Cambia el estado de cada pedido. Al marcarlo como <strong>Listo para retirar</strong> o <strong>En camino</strong>, el cliente recibe un correo automáticamente.</p>
      ${Api.correo.configurado() ? '' : `<p class="alerta" style="margin-bottom:1rem">${icono('alerta')}<span>El envío de correos no está configurado (falta la plantilla de EmailJS).</span></p>`}
      <nav class="filtro-estados" aria-label="Filtrar pedidos por estado">
        <a href="admin.html" ${!filtro ? 'aria-current="page"' : ''}>Todos (${todos.length})</a>
        ${ESTADOS.concat('Cancelado').map((e) => `<a href="admin.html?estado=${e}" ${filtro === e ? 'aria-current="page"' : ''}>${({ Listo: 'Listo / En camino', Retirado: 'Retirado / Entregado' })[e] || NOMBRE_ESTADO[e]} (${cuenta(e)})</a>`).join('')}
      </nav>
      ${!lista.length ? `<div class="panel panel--gris vacio">${icono('paquete')}<p>No hay pedidos${filtro ? ' en este estado' : ''}.</p></div>` : `
      <ul class="pedidos">${lista.map((p) => `
        <li class="pedido${resaltar === p.id ? ' pedido--resaltado' : ''}" data-pedido="${p.id}" tabindex="-1">
          <div class="pedido__cabecera">
            <h2 class="pedido__numero">${esc(p.numero)}</h2>
            <span class="estado estado--${p.estado.toLowerCase()}">${nombreEstado(p.estado, p.entrega)}</span>
          </div>
          <p class="texto-suave">${fechaHora(p.creado_en)} · ${p.entrega === 'Domicilio' ? `${icono('camion')} Envío a domicilio desde ${esc(p.tienda)}` : `${icono('tienda')} Retiro en ${esc(p.tienda)}`}</p>
          <dl class="datos-lista datos-lista--compacta" style="margin-top:.75rem">
            <dt>Cliente</dt><dd>${esc(p.cliente)} · C.I. ${esc(p.cedula)}</dd>
            <dt>Contacto</dt><dd>${esc(p.correo)} · ${esc(p.telefono)}</dd>
            <dt>Productos</dt><dd>${esc(p.productos)}</dd>
            ${p.entrega === 'Domicilio' ? `<dt>Dirección</dt><dd>${esc(p.direccion)}, ${esc(p.ciudad)}${p.referencia ? ' · ' + esc(p.referencia) : ''}</dd>` : ''}
            <dt>Código</dt><dd><strong>${esc(p.codigoRetiro || '')}</strong> · ${p.entrega === 'Domicilio' ? 'llega' : 'listo'} aprox. ${p.horaEstimada ? fechaHora(p.horaEstimada) : ''}</dd>
            <dt>Pago</dt><dd>${esc(p.pagoTexto)}</dd>
            <dt>Total</dt><dd>${dinero(p.total)}</dd>
          </dl>
          <a class="enlace-pequeno" href="orden.html?pedido=${p.id}">${icono('documento')}Ver orden de pedido</a>
          ${SIGUIENTES[p.estado].length ? `
          <div class="cambio-estado" role="group" aria-labelledby="cambiar-${p.id}">
            <p id="cambiar-${p.id}" class="cambio-estado__titulo">Pasar a:</p>
            ${SIGUIENTES[p.estado].map((e) => `<button class="boton ${e === 'Cancelado' ? 'boton--peligro' : 'boton--principal'}" type="button" data-pedido-id="${p.id}" data-nuevo-estado="${e}">${e === 'Cancelado' ? 'Cancelar pedido' : nombreEstado(e, p.entrega)}</button>`).join('')}
          </div>` : `<p class="texto-suave" style="margin-top:1rem">${p.estado === 'Retirado' ? 'Pedido entregado: ya no cambia de estado.' : 'Pedido cancelado: el pago se anuló y el stock volvió.'}</p>`}
          <p class="texto-suave resultado-estado" aria-live="polite"></p>
        </li>`).join('')}
      </ul>`}
    </div>`,
    montar(main) {
      // Si se acaba de cambiar un pedido, se muestra resaltado en su nueva pestaña
      const resaltado = resaltar && $(`[data-pedido="${resaltar}"]`, main);
      if (resaltado) { resaltado.scrollIntoView({ block: 'center' }); resaltado.focus({ preventScroll: true }); }
      guardarTemporal('pedido-resaltado', null);

      main.addEventListener('click', async (e) => {
        const boton = e.target.closest('[data-nuevo-estado]');
        if (!boton) return;
        const p = todos.find((x) => x.id === Number(boton.dataset.pedidoId));
        const nuevo = boton.dataset.nuevoEstado;
        if (nuevo === 'Cancelado' && !(await confirmar('¿Cancelar este pedido?', `El pedido ${p.numero} se cancelará: sus productos vuelven al stock y el pago queda anulado. No se puede deshacer.`, 'Sí, cancelar'))) return;
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
        let texto = `El pedido ${p.numero} pasó a "${nombreEstado(nuevo, p.entrega)}".`;
        if (r2.correo) texto += r2.correo.error ? ` ${r2.correo.error}` : ` Se envió un correo a ${p.correo}.`;
        aviso(texto, r2.correo && r2.correo.error ? 'error' : 'ok');
        anunciar(texto);
        revisarPedidosNuevos();
        // El pedido aparece de inmediato en la pestaña de su nuevo estado
        guardarTemporal('pedido-resaltado', p.id);
        const destino = filtro ? `admin.html?estado=${nuevo}` : 'admin.html';
        ir(destino);
      });
    }
  };
}

/* ======================= Menú del administrador ======================= */
function menuAdmin(actual) {
  const items = [['pedidos', 'admin.html', 'paquete', 'Pedidos'], ['productos', 'admin-productos.html', 'tienda', 'Productos'], ['pagos', 'admin-pagos.html', 'tarjeta', 'Pagos']];
  return `<nav class="menu-admin" aria-label="Administración">${items.map(([k, href, ic, t]) => `<a href="${href}" ${k === actual ? 'aria-current="page"' : ''}>${icono(ic)}${t}</a>`).join('')}</nav>`;
}
function soloAdmin() {
  if (!protegerCuenta()) return false;
  if (!estado.esAdmin) return 'no';
  return true;
}

/* ======================= Productos (administrador): leer, crear, editar, desactivar, borrar ======================= */
async function vistaAdminProductos(partes, params) {
  const ok = soloAdmin(); if (!ok) return null; if (ok === 'no') return vistaNoEncontrada();
  if (!estado.catalogoConectado) await cargarCatalogo();
  const q = normalizar(params.get('q') || '');
  const cat = CATEGORIAS[params.get('cat')] ? params.get('cat') : '';
  let lista = PRODUCTOS.slice();
  if (cat) lista = lista.filter((p) => p.categoria === cat);
  if (q) lista = lista.filter((p) => normalizar(`${p.id} ${p.nombre}`).includes(q));
  const stockTotal = (p) => Object.values(p.stock || {}).reduce((a, b) => a + b, 0);
  return {
    titulo: 'Productos (administrador)',
    seccion: 'admin',
    html: `
    <div class="contenedor pagina">
      ${menuAdmin('productos')}
      <div class="cabecera-seccion"><h1 class="titulo-pagina">Productos</h1>
        <a class="boton boton--principal" href="admin-producto.html">${icono('mas')}Nuevo producto</a></div>
      <p class="subtitulo cabecera-pagina">${plural(PRODUCTOS.length, 'producto', 'productos')} en la base de datos. Edita precio, stock, fotos y datos, o desactiva los que no quieras mostrar.</p>
      <form class="filtro-admin" id="filtro-admin" role="search">
        <div class="campo"><label for="buscar-admin">Buscar por código o nombre</label><input id="buscar-admin" name="q" type="search" value="${esc(params.get('q') || '')}"></div>
        <div class="campo"><label for="cat-admin">Categoría</label><select id="cat-admin" name="cat"><option value="">Todas</option>${Object.entries(CATEGORIAS).map(([k, v]) => `<option value="${k}" ${k === cat ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
        <button class="boton boton--secundario" type="submit">${icono('lupa')}Filtrar</button>
      </form>
      <p class="texto-suave" aria-live="polite" style="margin:.75rem 0">${plural(lista.length, 'resultado', 'resultados')}</p>
      <div class="tabla-desplazable" tabindex="0" role="region" aria-label="Lista de productos">
        <table class="tabla-admin">
          <thead><tr><th scope="col">Foto</th><th scope="col">Código</th><th scope="col">Producto</th><th scope="col">Categoría</th><th scope="col" class="num">Precio</th><th scope="col" class="num">Stock</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead>
          <tbody>${lista.map((p) => `
            <tr>
              <td><img src="${esc(img(p))}" alt="" width="56" height="56" loading="lazy"></td>
              <td>${esc(p.id)}</td>
              <th scope="row">${esc(p.nombre)}</th>
              <td>${esc(etiquetaCategoria(p))}</td>
              <td class="num">${dinero(p.precio)}</td>
              <td class="num">${stockTotal(p)}</td>
              <td><span class="estado ${p.activo === false ? 'estado--cancelado' : 'estado--listo'}">${p.activo === false ? 'Oculto' : 'Visible'}</span></td>
              <td class="acciones">
                <a class="boton boton--secundario boton--chico" href="admin-producto.html?id=${encodeURIComponent(p.id)}">${icono('editar')}Editar<span class="solo-lector"> ${esc(p.nombre)}</span></a>
                <button class="boton boton--secundario boton--chico" type="button" data-activar="${esc(p.id)}" data-activo="${p.activo === false ? '0' : '1'}">${p.activo === false ? 'Mostrar' : 'Ocultar'}<span class="solo-lector"> ${esc(p.nombre)}</span></button>
                <button class="boton boton--peligro boton--chico" type="button" data-borrar="${esc(p.id)}">${icono('basura')}Borrar<span class="solo-lector"> ${esc(p.nombre)}</span></button>
              </td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`,
    montar(main) {
      $('#filtro-admin', main).addEventListener('submit', (e) => {
        e.preventDefault();
        const d = new FormData(e.target); const p = new URLSearchParams();
        if (d.get('q')) p.set('q', d.get('q')); if (d.get('cat')) p.set('cat', d.get('cat'));
        ir('admin-productos.html' + (p.toString() ? '?' + p : ''));
      });
      main.addEventListener('click', async (e) => {
        const act = e.target.closest('[data-activar]');
        const bor = e.target.closest('[data-borrar]');
        if (act) {
          const visible = act.dataset.activo === '1';
          const r = await conEspera(act, 'Guardando…', () => Api.admin.activar(act.dataset.activar, !visible));
          if (!r) return;
          if (r.error) { aviso(r.error, 'error'); return; }
          aviso(visible ? 'El producto ya no se muestra en la tienda.' : 'El producto vuelve a mostrarse en la tienda.');
          await cargarCatalogo(); render();
        }
        if (bor) {
          const p = producto(bor.dataset.borrar);
          if (!(await confirmar('¿Borrar este producto?', `Se borrará "${p ? p.nombre : bor.dataset.borrar}" con sus tallas y fotos. Si ya tiene ventas, no se puede borrar: ocúltalo.`, 'Sí, borrar'))) return;
          const r = await conEspera(bor, 'Borrando…', () => Api.admin.borrarProducto(bor.dataset.borrar));
          if (!r) return;
          if (r.error) { aviso(r.error, 'error'); return; }
          aviso('Producto borrado.');
          await cargarCatalogo(); render();
        }
      });
    }
  };
}

async function vistaAdminProducto(partes, params) {
  const ok = soloAdmin(); if (!ok) return null; if (ok === 'no') return vistaNoEncontrada();
  if (!estado.catalogoConectado) await cargarCatalogo();
  const id = params.get('id');
  const p = id ? producto(id) : null;
  if (id && !p) return vistaNoEncontrada();
  const nuevo = !p;
  const v = p || { id: '', nombre: '', categoria: 'calzado', publico: 'Hombre', edad: 'Adulto', precio: '', descripcion: '', caracteristicas: [], ficha: [], etiqueta: '', activo: true, tallas: [], stock: {}, imagenes: [], vistas: [] };
  const usaTalla = v.tallas && v.tallas.length > 0;
  const filasTalla = usaTalla ? v.tallas.map((t) => [t, v.stock[t] || 0]) : [];
  const stockUnico = usaTalla ? 0 : (v.stock && v.stock.U) || 0;
  const fotos = (v.imagenes && v.imagenes.length ? v.imagenes : (p ? [1, 2, 3].map((n) => img(p, n)) : [])).map((u, i) => [u, (v.vistas || [])[i] || 'vista ' + (i + 1)]);
  const filaTalla = (t = '', s = 0) => `<li class="fila-talla"><div class="campo"><label>Talla</label><input name="talla" value="${esc(t)}" maxlength="5" required></div><div class="campo"><label>Stock</label><input name="stock-talla" type="number" min="0" max="99999" value="${s}" required></div><button class="boton-icono" type="button" data-quitar-talla>${icono('basura')}Quitar<span class="solo-lector"> talla</span></button></li>`;
  const filaFoto = (u = '', d = '') => `<li class="fila-foto"><img src="${esc(u || FOTO_RESPALDO)}" alt="" width="72" height="72"><div class="campo"><label>Dirección de la foto</label><input name="foto-url" value="${esc(u)}" maxlength="300"></div><div class="campo"><label>Descripción</label><input name="foto-desc" value="${esc(d)}" maxlength="80"></div><button class="boton-icono" type="button" data-quitar-foto>${icono('basura')}Quitar<span class="solo-lector"> foto</span></button></li>`;
  return {
    titulo: nuevo ? 'Nuevo producto' : `Editar ${v.nombre}`,
    seccion: 'admin',
    html: `
    <div class="contenedor pagina">
      ${menuAdmin('productos')}
      <a class="boton boton--texto" href="admin-productos.html">${icono('izquierda')}Volver a productos</a>
      <h1 class="titulo-pagina">${nuevo ? 'Nuevo producto' : `Editar: ${esc(v.nombre)}`}</h1>
      <p class="subtitulo cabecera-pagina">Los campos con <span class="requerido">*</span> son obligatorios. Los cambios se guardan en la base de datos y se ven al instante en la tienda.</p>
      <form class="formulario panel" id="form-producto" novalidate style="max-width:56rem">
        <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
        <div class="formulario__fila formulario__fila--doble">
          ${campo({ id: 'codigo', etiqueta: 'Código', ayuda: nuevo ? 'De 2 a 10 letras minúsculas o números, sin espacios. No se puede cambiar después.' : 'El código no se puede cambiar.', valor: v.id, max: 10, extra: nuevo ? 'autocomplete="off" autocapitalize="off"' : 'readonly' })}
          ${campo({ id: 'nombre', etiqueta: 'Nombre', valor: v.nombre, max: 80 })}
        </div>
        <div class="formulario__fila formulario__fila--doble">
          <div class="campo"><label for="categoria">Categoría <span class="requerido" aria-hidden="true">*</span></label><select id="categoria">${Object.entries(CATEGORIAS).map(([k, t]) => `<option value="${k}" ${k === v.categoria ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
          ${campo({ id: 'precio', etiqueta: 'Precio (USD, sin IVA)', ayuda: 'Ejemplo: 129.99', valor: v.precio, max: 9, extra: 'inputmode="decimal"' })}
        </div>
        <div class="formulario__fila formulario__fila--doble">
          <div class="campo"><label for="publico">Género <span class="requerido" aria-hidden="true">*</span></label><select id="publico">${['Hombre', 'Mujer', 'Unisex'].map((x) => `<option ${x === (v.publico || 'Unisex') ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
          <div class="campo"><label for="edad">Edad <span class="requerido" aria-hidden="true">*</span></label><select id="edad">${['Adulto', 'Niño'].map((x) => `<option ${x === (v.edad || 'Adulto') ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
        </div>
        <div class="campo"><label for="descripcion">Descripción <span class="requerido" aria-hidden="true">*</span></label><p class="campo__ayuda" id="descripcion-ayuda">De 20 a 600 caracteres.</p>
          <textarea id="descripcion" rows="4" maxlength="600" aria-describedby="descripcion-ayuda descripcion-error">${esc(v.descripcion)}</textarea><p class="campo__error" id="descripcion-error" hidden>${icono('alerta')}<span></span></p></div>
        <div class="campo"><label for="caracteristicas">Características</label><p class="campo__ayuda" id="caracteristicas-ayuda">Una por línea.</p>
          <textarea id="caracteristicas" rows="3" aria-describedby="caracteristicas-ayuda">${esc((v.caracteristicas || []).join('\n'))}</textarea></div>
        <div class="campo"><label for="ficha">Ficha técnica</label><p class="campo__ayuda" id="ficha-ayuda">Una por línea con el formato «Dato: valor». Ejemplo: Peso: 250 g</p>
          <textarea id="ficha" rows="4" aria-describedby="ficha-ayuda">${esc((v.ficha || []).map(([a, b]) => `${a}: ${b}`).join('\n'))}</textarea></div>
        <div class="formulario__fila formulario__fila--doble">
          ${campo({ id: 'etiqueta', etiqueta: 'Etiqueta', ayuda: 'Opcional, por ejemplo: Nuevo', valor: v.etiqueta || '', max: 20, opcional: true })}
          <div class="campo"><p style="font-weight:700">Visibilidad</p><label class="opcion"><input type="checkbox" id="activo" ${v.activo !== false ? 'checked' : ''}> Mostrar en la tienda</label></div>
        </div>

        <fieldset class="panel panel--gris">
          <legend class="leyenda-panel">Stock</legend>
          <label class="opcion"><input type="checkbox" id="usa-talla" ${usaTalla ? 'checked' : ''}> El producto tiene tallas</label>
          <div id="stock-unico" ${usaTalla ? 'hidden' : ''}>${campo({ id: 'stock-u', etiqueta: 'Unidades disponibles', tipo: 'number', valor: stockUnico, max: 5, extra: 'min="0" max="99999" inputmode="numeric"' })}</div>
          <div id="stock-tallas" ${usaTalla ? '' : 'hidden'}>
            <ul class="lista-filas" id="lista-tallas">${filasTalla.map(([t, s]) => filaTalla(t, s)).join('')}</ul>
            <button class="boton boton--secundario boton--chico" type="button" id="agregar-talla">${icono('mas')}Agregar talla</button>
          </div>
        </fieldset>

        <fieldset class="panel panel--gris">
          <legend class="leyenda-panel">Fotos (hasta 6)</legend>
          <p class="texto-suave">Sube una foto cuadrada con fondo blanco (JPG, PNG o WEBP, máximo 3 MB) o escribe la dirección de una foto.</p>
          <ul class="lista-filas" id="lista-fotos">${fotos.map(([u, d]) => filaFoto(u, d)).join('')}</ul>
          <div class="campo"><label for="subir-foto">Subir foto nueva</label><input id="subir-foto" type="file" accept="image/jpeg,image/png,image/webp"></div>
          <p class="texto-suave" id="estado-foto" aria-live="polite"></p>
        </fieldset>

        <div class="botones-fila">
          <button class="boton boton--principal" type="submit">${icono('check')}${nuevo ? 'Crear producto' : 'Guardar cambios'}</button>
          <a class="boton boton--texto" href="admin-productos.html">Cancelar</a>
          ${nuevo ? '' : `<a class="boton boton--texto" href="producto.html?id=${encodeURIComponent(v.id)}">Ver en la tienda</a>`}
        </div>
      </form>
    </div>`,
    montar(main) {
      const form = $('#form-producto', main);
      activarEnlacesError(form);
      const listaT = $('#lista-tallas', form), listaF = $('#lista-fotos', form);
      $('#usa-talla', form).addEventListener('change', (e) => {
        $('#stock-tallas', form).hidden = !e.target.checked; $('#stock-unico', form).hidden = e.target.checked;
        if (e.target.checked && !listaT.children.length) listaT.insertAdjacentHTML('beforeend', filaTalla());
      });
      $('#agregar-talla', form).addEventListener('click', () => { listaT.insertAdjacentHTML('beforeend', filaTalla()); $$('input[name="talla"]', listaT).pop().focus(); });
      form.addEventListener('click', (e) => {
        const qt = e.target.closest('[data-quitar-talla]'); if (qt) { qt.closest('li').remove(); anunciar('Talla quitada'); }
        const qf = e.target.closest('[data-quitar-foto]'); if (qf) { qf.closest('li').remove(); anunciar('Foto quitada'); }
      });
      $('#subir-foto', form).addEventListener('change', async (e) => {
        const archivo = e.target.files[0];
        const salida = $('#estado-foto', form);
        if (!archivo) return;
        if (listaF.children.length >= 6) { salida.textContent = 'Ya tienes 6 fotos: quita una para subir otra.'; return; }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type) || archivo.size > 3 * 1024 * 1024) { salida.textContent = 'La foto debe ser JPG, PNG o WEBP y pesar máximo 3 MB.'; return; }
        const codigo = ($('#codigo', form).value.trim() || 'nuevo').toLowerCase();
        salida.textContent = 'Subiendo foto…';
        const r = await Api.admin.subirFoto(archivo, codigo);
        if (r.error) { salida.textContent = r.error; return; }
        listaF.insertAdjacentHTML('beforeend', filaFoto(r.datos, listaF.children.length ? 'otra vista' : 'vista principal'));
        salida.textContent = 'Foto subida. Recuerda guardar el producto.';
        e.target.value = '';
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const val = (id) => $('#' + id, form).value.trim();
        const codigo = val('codigo').toLowerCase();
        const precio = Number(val('precio').replace(',', '.'));
        const usa = $('#usa-talla', form).checked;
        const tallas = usa ? $$('.fila-talla', listaT).map((li) => ({ talla: $('input[name="talla"]', li).value.trim(), stock: Number($('input[name="stock-talla"]', li).value) })) : [{ talla: 'U', stock: Number(val('stock-u')) }];
        const fotosF = $$('.fila-foto', listaF).map((li, i) => ({ orden: i + 1, url: $('input[name="foto-url"]', li).value.trim(), descripcion: $('input[name="foto-desc"]', li).value.trim() || `vista ${i + 1}` })).filter((f) => f.url);
        const repetidas = new Set(tallas.map((t) => t.talla)).size !== tallas.length;
        const reglas = [
          ['codigo', /^[a-z0-9]{2,10}$/.test(codigo) ? (nuevo && producto(codigo) ? 'Ya existe un producto con ese código.' : '') : 'Usa de 2 a 10 letras minúsculas o números, sin espacios.'],
          ['nombre', val('nombre').length >= 3 ? '' : 'Escribe el nombre del producto (mínimo 3 caracteres).'],
          ['precio', precio > 0 && precio < 100000 && /^\d+([.,]\d{1,2})?$/.test(val('precio')) ? '' : 'Escribe un precio válido mayor que 0, con máximo 2 decimales.'],
          ['descripcion', val('descripcion').length >= 20 ? '' : 'La descripción debe tener al menos 20 caracteres.']
        ];
        if (!usa) reglas.push(['stock-u', Number.isInteger(Number(val('stock-u'))) && Number(val('stock-u')) >= 0 ? '' : 'Escribe un número de unidades (0 o más).']);
        if (usa && (!tallas.length || tallas.some((t) => !t.talla || !Number.isInteger(t.stock) || t.stock < 0) || repetidas)) reglas.push(['agregar-talla', 'Revisa las tallas: cada una necesita nombre, stock de 0 o más y no se pueden repetir.']);
        if (!validarFormulario(form, reglas, 'Revisa el producto:')) return;
        const datos = {
          codigo, nombre: val('nombre'), categoria: $('#categoria', form).value, publico: $('#publico', form).value, edad: $('#edad', form).value,
          precio: Math.round(precio * 100) / 100, descripcion: val('descripcion'), caracteristicas: val('caracteristicas'), ficha: val('ficha'),
          etiqueta: val('etiqueta'), activo: $('#activo', form).checked, usaTalla: usa, tallas, fotos: fotosF
        };
        const r = await conEspera($('button[type="submit"]', form), 'Guardando…', () => Api.admin.guardarProducto(datos, nuevo));
        if (!r) return;
        if (r.error) { errorGeneral(form, r.error); return; }
        aviso(nuevo ? 'Producto creado.' : 'Cambios guardados.');
        ir('admin-productos.html');
      });
    }
  };
}

/* ======================= Pagos guardados (administrador) ======================= */
async function vistaAdminPagos() {
  const ok = soloAdmin(); if (!ok) return null; if (ok === 'no') return vistaNoEncontrada();
  const r = await Api.admin.pagos();
  if (r.error) return { titulo: 'Pagos', seccion: 'admin', html: errorCargaHtml(r.error) };
  const lista = r.datos || [];
  const total = lista.filter((g) => g.estado === 'Aprobado').reduce((s, g) => s + Number(g.monto), 0);
  return {
    titulo: 'Pagos (administrador)',
    seccion: 'admin',
    html: `
    <div class="contenedor pagina">
      ${menuAdmin('pagos')}
      <h1 class="titulo-pagina">Pagos</h1>
      <p class="subtitulo cabecera-pagina">Cada pago (tarjeta o transferencia) queda guardado en la tabla PAGO de la base de datos. Son pagos simulados.</p>
      <dl class="tarjetas-resumen">
        <div><dt>Pagos registrados</dt><dd>${lista.length}</dd></div>
        <div><dt>Aprobados</dt><dd>${lista.filter((g) => g.estado === 'Aprobado').length}</dd></div>
        <div><dt>Anulados</dt><dd>${lista.filter((g) => g.estado === 'Anulado').length}</dd></div>
        <div><dt>Total aprobado</dt><dd>${dinero(total)}</dd></div>
      </dl>
      ${!lista.length ? `<div class="panel panel--gris vacio">${icono('tarjeta')}<p>Todavía no hay pagos.</p></div>` : `
      <div class="tabla-desplazable" tabindex="0" role="region" aria-label="Pagos registrados">
        <table class="tabla-admin">
          <thead><tr><th scope="col">N.º</th><th scope="col">Fecha</th><th scope="col">Pedido</th><th scope="col">Cliente</th><th scope="col">Método</th><th scope="col">Detalle</th><th scope="col" class="num">Monto</th><th scope="col">Estado</th></tr></thead>
          <tbody>${lista.map((g) => `<tr><td>${g.codigo}</td><td>${fechaHora(g.fecha)}</td><td><a href="orden.html?pedido=${g.pedido}">${esc(g.numeroPedido)}</a></td><td>${esc(g.cliente)}</td><td>${esc(g.metodo)}</td><td>${esc(g.detalle)}</td><td class="num">${dinero(g.monto)}</td><td><span class="estado ${g.estado === 'Aprobado' ? 'estado--listo' : 'estado--cancelado'}">${esc(g.estado)}</span></td></tr>`).join('')}</tbody>
        </table>
      </div>`}
    </div>`
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
      <a class="boton boton--principal" style="margin-top:1.5rem" href="index.html">Ir al inicio</a>
    </div>`
  };
}
