/* ATHLETIX · Vistas de la tienda: inicio, catálogo, detalle con reseñas y carrito */
'use strict';

/* ======================= Inicio ======================= */
function vistaInicio() {
  const destacado = producto('vx');
  const cats = [
    ['calzado', 'Calzado', 'Para correr y para montaña', 'sf', 'Ver calzado'],
    ['tecnologia', 'Tecnología', 'Relojes, sensores y audio', 'pt', 'Ver tecnología'],
    ['entrenamiento', 'Entrenamiento', 'Fuerza, velocidad y agilidad', 'fl', 'Ver entrenamiento']
  ];
  return {
    titulo: 'Tienda deportiva en línea',
    seccion: 'inicio',
    html: `
    <section class="hero" aria-labelledby="hero-titulo">
      <div class="contenedor hero__grilla">
        <div>
          <span class="hero__etiqueta">NUEVO · CARRERA 2026</span>
          <h1 class="hero__titulo" id="hero-titulo">Vuela en cada kilómetro</h1>
          <p class="hero__texto">${esc(destacado.nombre)}: espuma RebotePlus y placa de propulsión para tus ritmos más rápidos.</p>
          <a class="boton boton--naranja" href="producto.html?id=vx">Comprar ${esc(destacado.nombre)} ${icono('derecha')}</a>
        </div>
        <div class="hero__imagen"><img src="${img(destacado)}" alt="Zapatilla ${esc(destacado.nombre)} en blanco, azul y naranja" width="500" height="500"></div>
      </div>
    </section>

    <section class="contenedor beneficios" aria-label="Beneficios de comprar en ATHLETIX">
      <ul class="beneficios__lista">
        <li class="beneficio"><span class="beneficio__icono">${icono('camion')}</span><p><strong>Retiro gratis en tienda</strong><span>Quito y Guayaquil</span></p></li>
        <li class="beneficio"><span class="beneficio__icono">${icono('correo')}</span><p><strong>Te avisamos por correo</strong><span>Cuando tu pedido esté listo</span></p></li>
        <li class="beneficio"><span class="beneficio__icono">${icono('escudo')}</span><p><strong>Pago seguro</strong><span>Visa y Mastercard</span></p></li>
        <li class="beneficio"><span class="beneficio__icono">${icono('estrella')}</span><p><strong>Opiniones reales</strong><span>Solo de clientes que compraron</span></p></li>
      </ul>
    </section>

    <section class="contenedor categorias" aria-labelledby="titulo-categorias">
      <h2 class="titulo-seccion" id="titulo-categorias">Compra por categoría</h2>
      <p class="subtitulo">Elige qué necesitas para entrenar hoy.</p>
      <div class="categorias__grilla">
        ${cats.map(([c, t, d, foto, ver]) => `
          <a class="tarjeta-categoria" href="productos.html?cat=${c}">
            <img src="img/productos/${foto}-1.jpg" alt="" width="500" height="500" loading="lazy">
            <div class="tarjeta-categoria__texto"><h3>${t}</h3><p>${d}</p><span class="enlace-flecha">${ver} ${icono('derecha')}</span></div>
          </a>`).join('')}
      </div>
    </section>`
  };
}

/* ======================= Catálogo y búsqueda ======================= */
const PALABRAS_VACIAS = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'para', 'y', 'con', 'en', 'un', 'una', 'por', 'a']);
function buscar(lista, consulta) {
  const palabras = normalizar(consulta).split(/[^a-z0-9ñ]+/).filter((w) => w && !PALABRAS_VACIAS.has(w)).slice(0, 8);
  if (!palabras.length) return lista;
  return lista.filter((p) => {
    const texto = normalizar([p.nombre, CATEGORIAS[p.categoria], p.publico || '', p.claves.join(' ')].join(' '));
    const voces = texto.split(/[^a-z0-9ñ]+/);
    return palabras.every((w) => {
      const variantes = [w, w.replace(/es$/, ''), w.replace(/s$/, '')].filter((v) => v.length >= 3);
      return variantes.some((v) => voces.some((voz) => voz.startsWith(v)));
    });
  });
}

const RANGOS = {
  todos: ['Todos los precios', () => true],
  bajo: ['Menos de $50', (p) => p.precio < 50],
  medio: ['De $50 a $150', (p) => p.precio >= 50 && p.precio <= 150],
  alto: ['Más de $150', (p) => p.precio > 150]
};
const ORDENES = {
  relevancia: ['Recomendados', null],
  menor: ['Precio: menor a mayor', (a, b) => a.precio - b.precio],
  mayor: ['Precio: mayor a menor', (a, b) => b.precio - a.precio],
  valorados: ['Mejor valorados', (a, b) => (b.rating || 0) - (a.rating || 0) || b.opiniones - a.opiniones]
};

function filtrar(params) {
  const cat = CATEGORIAS[params.get('cat')] ? params.get('cat') : 'todas';
  const pub = ['Hombre', 'Mujer', 'Unisex'].includes(params.get('pub')) ? params.get('pub') : 'todos';
  const precio = RANGOS[params.get('precio')] ? params.get('precio') : 'todos';
  const orden = ORDENES[params.get('orden')] ? params.get('orden') : 'relevancia';
  const q = (params.get('q') || '').slice(0, 80);
  let lista = buscar(PRODUCTOS.filter((p) => p.activo !== false), q);
  if (cat !== 'todas') lista = lista.filter((p) => p.categoria === cat);
  if (pub !== 'todos' && (cat === 'calzado' || cat === 'tecnologia')) lista = lista.filter((p) => p.publico === pub);
  lista = lista.filter(RANGOS[precio][1]);
  if (ORDENES[orden][1]) lista = [...lista].sort(ORDENES[orden][1]);
  return { lista, cat, pub, precio, orden, q };
}

function tarjetaProducto(p) {
  const agotado = p.stock && Object.values(p.stock).every((s) => s <= 0);
  return `
    <li>
      <article class="tarjeta-producto">
        <div class="tarjeta-producto__imagen"><img src="${img(p)}" alt="" width="500" height="500" loading="lazy"></div>
        ${agotado ? '<span class="etiqueta etiqueta--azul tarjeta-producto__etiqueta">Agotado</span>' : (p.etiqueta ? `<span class="etiqueta tarjeta-producto__etiqueta">${p.etiqueta}</span>` : '')}
        <div class="tarjeta-producto__cuerpo">
          <h2 class="tarjeta-producto__nombre"><a href="producto.html?id=${p.id}">${esc(p.nombre)}</a></h2>
          <p class="texto-suave">${etiquetaCategoria(p).replace('Tecnología deportiva', 'Tecnología')}</p>
          ${calificacionHtml(p)}
          <div class="tarjeta-producto__pie">
            <p class="precio">${dinero(p.precio)}</p>
            <span class="tarjeta-producto__ver" aria-hidden="true">Ver producto →</span>
          </div>
        </div>
      </article>
    </li>`;
}

function htmlResultados(f) {
  if (!f.lista.length) {
    return `
      <div class="sin-resultados">
        <h2 class="titulo-seccion">Sin resultados</h2>
        <p class="subtitulo">No encontramos productos${f.q ? ` para "${esc(f.q)}"` : ' con estos filtros'}. Prueba con otra palabra o con una de estas búsquedas:</p>
        <ul class="chips">${BUSQUEDAS_POPULARES.map((b) => `<li><a class="chip" href="productos.html?q=${encodeURIComponent(b)}">${b}</a></li>`).join('')}</ul>
        <p style="margin-top:1.25rem"><a class="boton boton--secundario" href="productos.html">Ver todos los productos</a></p>
      </div>`;
  }
  return `<ul class="grilla-productos">${f.lista.map(tarjetaProducto).join('')}</ul>`;
}

function tituloCatalogo(f) {
  if (f.q) return `Resultados para "${esc(f.q)}"`;
  if (f.cat !== 'todas') return CATEGORIAS[f.cat];
  return 'Todos los productos';
}

function vistaProductos(partes, params) {
  const f = filtrar(params);
  const radio = (grupo, valor, texto, actual) =>
    `<label class="opcion"><input type="radio" name="${grupo}" value="${valor}" ${valor === actual ? 'checked' : ''}> ${texto}</label>`;
  const verPublico = f.cat === 'calzado' || f.cat === 'tecnologia';
  return {
    titulo: f.q ? `Resultados para ${f.q}` : (f.cat !== 'todas' ? CATEGORIAS[f.cat] : 'Productos'),
    seccion: 'productos',
    html: `
    <div class="contenedor pagina">
      <nav class="migas" aria-label="Ruta de navegación"><ol><li><a href="index.html">Inicio</a></li><li><span aria-current="page">Productos</span></li></ol></nav>
      <div class="cabecera-pagina resultados__info">
        <h1 class="titulo-pagina" id="titulo-catalogo">${tituloCatalogo(f)}</h1>
        <div class="resultados__orden">
          <p class="texto-suave" id="conteo" aria-live="polite">${plural(f.lista.length, 'producto', 'productos')}</p>
          <label class="orden"><span>Ordenar por</span>
            <select id="orden">${Object.entries(ORDENES).map(([k, [t]]) => `<option value="${k}" ${k === f.orden ? 'selected' : ''}>${t}</option>`).join('')}</select>
          </label>
        </div>
      </div>
      <div class="catalogo">
        <aside class="filtros" aria-label="Filtros">
          <button class="filtros__abrir" type="button" aria-expanded="false" aria-controls="filtros-cuerpo">Filtros ${icono('chevronAbajo')}</button>
          <form class="filtros__cuerpo" id="filtros-cuerpo">
            <fieldset class="grupo-filtro">
              <legend>Categoría</legend>
              ${radio('cat', 'todas', 'Todas', f.cat)}${radio('cat', 'calzado', 'Calzado', f.cat)}${radio('cat', 'tecnologia', 'Tecnología deportiva', f.cat)}${radio('cat', 'entrenamiento', 'Entrenamiento', f.cat)}
            </fieldset>
            <fieldset class="grupo-filtro" id="grupo-publico" ${verPublico ? '' : 'hidden'}>
              <legend>Público</legend>
              ${radio('pub', 'todos', 'Todos', f.pub)}${radio('pub', 'Hombre', 'Hombre', f.pub)}${radio('pub', 'Mujer', 'Mujer', f.pub)}${radio('pub', 'Unisex', 'Unisex', f.pub)}
            </fieldset>
            <fieldset class="grupo-filtro">
              <legend>Precio</legend>
              ${Object.entries(RANGOS).map(([k, [t]]) => radio('precio', k, t, f.precio)).join('')}
            </fieldset>
            <button class="boton boton--secundario boton--bloque" type="button" id="limpiar-filtros">Limpiar filtros</button>
          </form>
        </aside>
        <section aria-labelledby="titulo-catalogo" id="resultados">${htmlResultados(f)}</section>
      </div>
    </div>`,
    montar(main) {
      const form = $('#filtros-cuerpo', main);
      const abrir = $('.filtros__abrir', main);
      abrir.addEventListener('click', () => {
        const ab = abrir.getAttribute('aria-expanded') !== 'true';
        abrir.setAttribute('aria-expanded', ab);
        form.classList.toggle('abierto', ab);
      });
      const aplicar = () => {
        const p = new URLSearchParams();
        const q = leerRuta().params.get('q');
        if (q) p.set('q', q);
        const d = new FormData(form);
        const cat = d.get('cat');
        if (cat !== 'todas') p.set('cat', cat);
        if ((cat === 'calzado' || cat === 'tecnologia') && d.get('pub') !== 'todos') p.set('pub', d.get('pub'));
        if (d.get('precio') !== 'todos') p.set('precio', d.get('precio'));
        const orden = $('#orden', main).value;
        if (orden !== 'relevancia') p.set('orden', orden);
        history.replaceState(null, '', 'productos.html' + (p.toString() ? '?' + p : ''));
        const f2 = filtrar(p);
        $('#grupo-publico', main).hidden = !(f2.cat === 'calzado' || f2.cat === 'tecnologia');
        $('#resultados', main).innerHTML = htmlResultados(f2);
        $('#titulo-catalogo', main).innerHTML = tituloCatalogo(f2);
        $('#conteo', main).textContent = plural(f2.lista.length, 'producto', 'productos');
        document.title = `${f2.cat !== 'todas' ? CATEGORIAS[f2.cat] : 'Productos'} | ATHLETIX`;
      };
      form.addEventListener('change', aplicar);
      $('#orden', main).addEventListener('change', aplicar);
      $('#limpiar-filtros', main).addEventListener('click', () => {
        history.replaceState(null, '', 'productos.html');
        render();
        anunciar('Filtros limpiados. Se muestran todos los productos.');
      });
    }
  };
}

/* ======================= Detalle de producto ======================= */
function vistaProducto(partes) {
  const p = producto(partes[1]);
  if (!p || p.activo === false) return vistaNoEncontrada();
  const tieneTallas = p.tallas.length > 0;
  const sinStock = !tieneTallas && stockDe(p, null) <= 0;
  return {
    titulo: p.nombre,
    seccion: 'productos',
    html: `
    <div class="contenedor pagina">
      <div class="migas">
        <button class="boton-volver" type="button" id="volver">${icono('izquierda')}Volver</button>
        <nav aria-label="Ruta de navegación"><ol>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="productos.html?cat=${p.categoria}">${CATEGORIAS[p.categoria]}</a></li>
          <li><span aria-current="page">${esc(p.nombre)}</span></li>
        </ol></nav>
      </div>

      <div class="detalle">
        <section class="galeria" aria-label="Fotos del producto">
          <div class="galeria__principal">
            <img id="foto-principal" src="${img(p, 1)}" alt="${esc(p.nombre)}, ${p.vistas[0]}" width="500" height="500">
            <button class="galeria__flecha galeria__flecha--anterior" type="button" data-paso="-1" aria-label="Foto anterior">${icono('chevronIzq')}</button>
            <button class="galeria__flecha galeria__flecha--siguiente" type="button" data-paso="1" aria-label="Foto siguiente">${icono('chevronDer')}</button>
          </div>
          <ul class="galeria__miniaturas">
            ${[1, 2, 3].map((v) => `<li><button class="galeria__miniatura" type="button" data-vista="${v}" aria-label="Ver ${p.vistas[v - 1]}" ${v === 1 ? 'aria-current="true"' : ''}><img src="${img(p, v)}" alt="" width="500" height="500" loading="lazy"></button></li>`).join('')}
          </ul>
        </section>

        <section class="compra" aria-labelledby="nombre-producto">
          <div class="compra__encabezado">
            <span class="etiqueta-categoria">${etiquetaCategoria(p)}</span>
            ${p.etiqueta ? `<span class="etiqueta">${p.etiqueta}</span>` : ''}
          </div>
          <h1 id="nombre-producto">${esc(p.nombre)}</h1>
          <div id="calificacion-producto">${calificacionHtml(p)}</div>
          <div class="compra__precio"><p class="precio">${dinero(p.precio)}</p><p class="texto-suave">IVA incluido en el total · Retiro gratis</p></div>
          <hr class="separador">

          <form id="form-compra" novalidate>
            ${tieneTallas ? `
            <fieldset class="tallas" id="grupo-tallas" aria-describedby="error-talla talla-elegida">
              <div class="tallas__encabezado">
                <legend>Selecciona tu talla (EU)</legend>
                <button class="boton-icono" type="button" id="guia-tallas">${icono('regla')}Guía de tallas</button>
              </div>
              <div class="tallas__lista">
                ${p.tallas.map((t) => { const s = stockDe(p, t); return `<label class="talla ${s <= 0 ? 'talla--agotada' : ''}"><input type="radio" name="talla" value="${t}" ${s <= 0 ? 'disabled' : ''}><span>${t}${s <= 0 ? '<span class="solo-lector"> (agotada)</span>' : ''}</span></label>`; }).join('')}
              </div>
              <p class="texto-suave" id="talla-elegida" style="margin-top:.5rem" aria-live="polite">Elegida: ninguna</p>
              <p class="campo__error" id="error-talla" hidden>${icono('alerta')}<span>Selecciona una talla para agregar el calzado al carrito.</span></p>
            </fieldset>` : ''}

            <div style="margin-top:1.25rem">
              <p style="font-weight:700;margin-bottom:.5rem" id="etiqueta-cantidad">Cantidad</p>
              <div class="fila-cantidad">
                <div class="cantidad" role="group" aria-labelledby="etiqueta-cantidad">
                  <button type="button" data-cambio="-1" aria-label="Quitar una unidad" disabled>${icono('menos')}</button>
                  <output id="cantidad" aria-live="polite">1</output>
                  <button type="button" data-cambio="1" aria-label="Agregar una unidad">${icono('mas')}</button>
                </div>
                <span class="texto-suave" id="limite-cantidad">Máximo 10 unidades por producto</span>
              </div>
            </div>

            ${sinStock ? `<p class="alerta" style="margin-top:1.25rem">${icono('info')}<span>Este producto está agotado por ahora.</span></p>` : ''}
            <button class="boton boton--principal boton--bloque" type="submit" style="margin-top:1.25rem" ${sinStock ? 'disabled' : ''}>${icono('carrito')}Agregar al carrito</button>
          </form>

          <ul class="lista-iconos">
            <li>${icono('camion')}Listo para retirar en ${TIEMPO_LISTO}</li>
            <li>${icono('correo')}Te avisamos por correo cuando esté listo</li>
            <li>${icono('escudo')}Pago seguro con Visa o Mastercard</li>
          </ul>
        </section>
      </div>

      <section class="pestanas" aria-label="Información del producto">
        <div class="pestanas__lista" role="tablist" aria-label="Información del producto">
          <button class="pestanas__boton" role="tab" id="pestana-desc" aria-controls="panel-desc" aria-selected="true">Descripción</button>
          <button class="pestanas__boton" role="tab" id="pestana-ficha" aria-controls="panel-ficha" aria-selected="false" tabindex="-1">Ficha técnica</button>
          <button class="pestanas__boton" role="tab" id="pestana-opin" aria-controls="panel-opin" aria-selected="false" tabindex="-1">Opiniones de clientes</button>
        </div>
        <div class="pestanas__panel" role="tabpanel" id="panel-desc" aria-labelledby="pestana-desc" tabindex="0">
          <p>${esc(p.descripcion)}</p>
          <h2>Características principales</h2>
          <ul class="lista-check">${p.caracteristicas.map((c) => `<li>${icono('check')}${esc(c)}</li>`).join('')}</ul>
        </div>
        <div class="pestanas__panel" role="tabpanel" id="panel-ficha" aria-labelledby="pestana-ficha" tabindex="0" hidden>
          <dl class="ficha">${p.ficha.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        </div>
        <div class="pestanas__panel" role="tabpanel" id="panel-opin" aria-labelledby="pestana-opin" tabindex="0" hidden>
          <div id="zona-resenas"><p class="texto-suave">Cargando opiniones…</p></div>
        </div>
      </section>
    </div>`,
    montar(main) {
      let vista = 1;
      let cantidad = 1;
      const foto = $('#foto-principal', main);
      const mostrar = (v) => {
        vista = ((v - 1 + 3) % 3) + 1;
        foto.src = img(p, vista);
        foto.alt = `${p.nombre}, ${p.vistas[vista - 1]}`;
        $$('.galeria__miniatura', main).forEach((b) => {
          if (Number(b.dataset.vista) === vista) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
        });
      };
      $$('[data-paso]', main).forEach((b) => b.addEventListener('click', () => { mostrar(vista + Number(b.dataset.paso)); anunciar(`Foto ${vista} de 3: ${p.vistas[vista - 1]}`); }));
      $$('.galeria__miniatura', main).forEach((b) => {
        b.addEventListener('click', () => mostrar(Number(b.dataset.vista)));
        b.addEventListener('mouseenter', () => mostrar(Number(b.dataset.vista)));
      });
      $('#volver', main).addEventListener('click', () => { if (history.length > 1) history.back(); else ir('productos.html'); });

      // Pestañas accesibles
      const tabs = $$('[role="tab"]', main);
      const activar = (tab, enfocar = true) => {
        tabs.forEach((t) => {
          const activa = t === tab;
          t.setAttribute('aria-selected', activa);
          t.tabIndex = activa ? 0 : -1;
          $('#' + t.getAttribute('aria-controls'), main).hidden = !activa;
        });
        if (enfocar) tab.focus();
      };
      tabs.forEach((t, i) => {
        t.addEventListener('click', () => activar(t));
        t.addEventListener('keydown', (e) => {
          const mov = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
          if (mov) { e.preventDefault(); activar(tabs[(i + mov + tabs.length) % tabs.length]); }
          if (e.key === 'Home') { e.preventDefault(); activar(tabs[0]); }
          if (e.key === 'End') { e.preventDefault(); activar(tabs[tabs.length - 1]); }
        });
      });
      main.addEventListener('click', (e) => {
        if (!e.target.closest('[data-ir-opiniones]')) return;
        const t = $('#pestana-opin', main);
        activar(t, false);
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        t.focus({ preventScroll: true });
      });

      // Cantidad (máximo 10 y nunca más que el stock)
      const salida = $('#cantidad', main);
      const [menos, mas] = $$('[data-cambio]', main);
      const grupoTallas = $('#grupo-tallas', main);
      const tallaElegida = () => { const t = $('input[name="talla"]:checked', main); return t ? t.value : null; };
      const maximo = () => Math.max(1, Math.min(10, stockDe(p, tieneTallas ? tallaElegida() : null) || (tieneTallas && !tallaElegida() ? 10 : 1)));
      const pintarCantidad = () => {
        cantidad = Math.min(cantidad, maximo());
        salida.textContent = cantidad;
        menos.disabled = cantidad <= 1;
        mas.disabled = cantidad >= maximo();
        const stock = stockDe(p, tieneTallas ? tallaElegida() : null);
        $('#limite-cantidad', main).textContent = (tieneTallas && !tallaElegida()) || stock >= 10
          ? 'Máximo 10 unidades por producto'
          : `Quedan ${plural(stock, 'unidad', 'unidades')}${tieneTallas ? ' en esta talla' : ''}`;
      };
      [menos, mas].forEach((b) => b.addEventListener('click', () => {
        cantidad = Math.min(maximo(), Math.max(1, cantidad + Number(b.dataset.cambio)));
        pintarCantidad();
        if (b.disabled) (b === menos ? mas : menos).focus();
      }));
      pintarCantidad();

      if (grupoTallas) {
        grupoTallas.addEventListener('change', (e) => {
          $('#talla-elegida', main).textContent = `Elegida: ${e.target.value}`;
          $('#error-talla', main).hidden = true;
          grupoTallas.classList.remove('campo-error');
          pintarCantidad();
        });
        $('#guia-tallas', main).addEventListener('click', abrirGuiaTallas);
      }

      $('#form-compra', main).addEventListener('submit', (e) => {
        e.preventDefault();
        let talla = null;
        if (grupoTallas) {
          talla = tallaElegida();
          if (!talla) {
            $('#error-talla', main).hidden = false;
            grupoTallas.classList.add('campo-error');
            const primera = $('input[name="talla"]:not(:disabled)', main);
            if (primera) primera.focus();
            anunciar('Selecciona una talla para agregar el calzado al carrito.');
            return;
          }
        }
        const agregadas = agregarAlCarrito(p.id, talla, cantidad);
        cantidad = 1;
        pintarCantidad();
        mostrarProductoAgregado(p, talla, agregadas);
      });

      cargarResenas(p, main);
    }
  };
}

function abrirGuiaTallas() {
  abrirDialogo(`
    <h2 class="dialogo__titulo" id="dialogo-titulo">Guía de tallas</h2>
    <p class="texto-suave" style="margin-bottom:1rem">Mide tu pie del talón al dedo más largo y elige la talla según los centímetros.</p>
    <dl class="guia-tallas">${GUIA_TALLAS.map(([t, cm]) => `<div><dt>Talla ${t}</dt><dd>${cm}</dd></div>`).join('')}</dl>
    <p class="texto-suave" style="margin-top:1rem">Mujer: 36 a 40 con medias tallas · Hombre: 39 a 45 · Montaña: 37 a 45. Si estás entre dos tallas, elige la mayor.</p>
    <button class="boton boton--principal boton--bloque" type="button" data-cerrar-dialogo style="margin-top:1.25rem">Entendido</button>`, { ancho: true });
}

/* ======================= Reseñas de compra verificada ======================= */
async function cargarResenas(p, main) {
  const zona = $('#zona-resenas', main);
  if (!p.dbId) { zona.innerHTML = '<p class="texto-suave">Las opiniones no están disponibles en este momento.</p>'; return; }
  const r = await Api.resenas.deProducto(p.dbId);
  if (!zona.isConnected) return;
  if (r.error) {
    zona.innerHTML = `<p class="alerta" role="alert">${icono('alerta')}<span>${esc(r.error)}</span></p>`;
    return;
  }
  const lista = r.datos || [];
  const total = lista.length;
  const promedio = total ? lista.reduce((s, x) => s + x.estrellas, 0) / total : 0;
  p.rating = promedio; p.opiniones = total;
  $('#calificacion-producto', main).innerHTML = total
    ? `<p class="calificacion">${estrellas(promedio)}<span>${promedio.toFixed(1)}<span class="solo-lector"> de 5</span> · <button class="enlace-boton" type="button" data-ir-opiniones>Ver ${plural(total, 'opinión', 'opiniones')}</button></span></p>`
    : '<p class="calificacion texto-suave">Sin opiniones todavía</p>';
  const mia = estado.cliente ? lista.find((x) => x.mia) : null;

  zona.innerHTML = `
    <div class="opiniones">
      <div>
        ${total ? `
          <p class="resumen-opiniones__nota">${promedio.toFixed(1)}</p>
          ${estrellas(promedio)}
          <p class="texto-suave">Basado en ${plural(total, 'opinión', 'opiniones')} de clientes que compraron</p>
          <ul class="barras" aria-label="Distribución de calificaciones">
            ${[5, 4, 3, 2, 1].map((n) => { const c = lista.filter((x) => x.estrellas === n).length; const pct = Math.round((c / total) * 100); return `<li class="barra"><span>${plural(n, 'estrella', 'estrellas')}</span><span class="barra__pista" aria-hidden="true"><span class="barra__relleno" style="width:${pct}%"></span></span><span>${c}</span></li>`; }).join('')}
          </ul>` : `<p class="resumen-opiniones__nota" style="font-size:1.5rem">Aún no hay opiniones</p><p class="texto-suave">Las opiniones solo las pueden dejar clientes que compraron este producto.</p>`}
        <div id="zona-escribir" style="margin-top:1.25rem"></div>
      </div>
      <ul class="resenas">
        ${lista.map((x) => `<li class="resena">${estrellas(x.estrellas)}<span class="solo-lector">${x.estrellas} de 5 estrellas</span>
          <p style="margin-top:.5rem">${esc(x.comentario)}</p>
          <p class="resena__pie"><span>${esc(x.autor || 'Cliente')} · ${fecha(x.creado_en)}</span><span class="verificada">${icono('check')}Compra verificada</span></p></li>`).join('')}
      </ul>
    </div>`;
  pintarZonaEscribir(p, main, mia);
}

async function pintarZonaEscribir(p, main, mia) {
  const zona = $('#zona-escribir', main);
  if (!zona) return;
  if (!estado.sesion) {
    zona.innerHTML = `<p class="texto-suave">¿Compraste este producto? <a href="login.html">Inicia sesión</a> para dejar tu opinión.</p>`;
    return;
  }
  if (!estado.cliente) { zona.innerHTML = ''; return; }
  zona.innerHTML = `<button class="boton boton--secundario boton--bloque" type="button" id="escribir-resena">${icono(mia ? 'editar' : 'estrella')}${mia ? 'Editar mi reseña' : 'Escribir reseña'}</button>
    <div id="resultado-compra" aria-live="polite"></div>`;
  $('#escribir-resena', zona).addEventListener('click', async (e) => {
    const salida = $('#resultado-compra', zona);
    salida.innerHTML = '';
    if (mia) { abrirFormularioResena(p, main, mia); return; }
    // Antes de abrir el formulario se busca en la base una compra de este producto hecha con esta cuenta
    const r = await conEspera(e.currentTarget, 'Verificando tu compra…', () => Api.pedidos.compro(p.dbId));
    if (!r) return;
    if (r.error) { salida.innerHTML = `<p class="alerta" style="margin-top:.75rem">${icono('alerta')}<span>${esc(r.error)}</span></p>`; return; }
    if (!r.datos) {
      salida.innerHTML = `<p class="alerta alerta--error" style="margin-top:.75rem" role="alert">${icono('alerta')}<span><strong>No encontramos una compra de este producto en tu cuenta.</strong> Solo los clientes que compraron este producto pueden dejar una reseña.</span></p>`;
      return;
    }
    abrirFormularioResena(p, main, null, r.datos);
  });
}

function abrirFormularioResena(p, main, mia, pedidoVerificado) {
  abrirDialogo(`
    <h2 class="dialogo__titulo" id="dialogo-titulo">${mia ? 'Editar mi reseña' : 'Escribir reseña'}</h2>
    <p class="texto-suave" style="margin-bottom:${pedidoVerificado ? '.5rem' : '1rem'}">${esc(p.nombre)}</p>
    ${pedidoVerificado ? `<p class="verificada" style="margin-bottom:1rem">${icono('check')}Compra verificada · pedido ${esc(pedidoVerificado)}</p>` : ''}
    <form class="formulario" id="form-resena" novalidate>
      <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
      <fieldset class="selector-estrellas" aria-describedby="estrellas-error">
        <legend>Tu calificación <span class="requerido" aria-hidden="true">*</span></legend>
        <div class="selector-estrellas__lista">
          ${[1, 2, 3, 4, 5].map((n) => `<label><input type="radio" name="estrellas" value="${n}" ${mia && mia.estrellas === n ? 'checked' : ''}><span aria-hidden="true">${icono('estrella')}</span><span class="solo-lector">${plural(n, 'estrella', 'estrellas')}</span></label>`).join('')}
        </div>
        <p class="campo__error" id="estrellas-error" hidden>${icono('alerta')}<span></span></p>
      </fieldset>
      <div class="campo">
        <label for="comentario">Tu opinión <span class="requerido" aria-hidden="true">*</span></label>
        <p class="campo__ayuda" id="comentario-ayuda">Entre 10 y 500 caracteres. Cuéntanos cómo te fue con el producto.</p>
        <textarea id="comentario" name="comentario" rows="4" maxlength="500" aria-describedby="comentario-ayuda comentario-error contador-comentario">${mia ? esc(mia.comentario) : ''}</textarea>
        <p class="texto-suave" id="contador-comentario" aria-live="polite">${mia ? mia.comentario.length : 0} / 500</p>
        <p class="campo__error" id="comentario-error" hidden>${icono('alerta')}<span></span></p>
      </div>
      <div class="dialogo__botones">
        ${mia ? '<button class="boton boton--secundario" type="button" id="borrar-resena">Borrar</button>' : '<button class="boton boton--secundario" type="button" data-cerrar-dialogo>Cancelar</button>'}
        <button class="boton boton--principal" type="submit">Publicar reseña</button>
      </div>
    </form>`, {
    alAbrir: (d) => {
      const form = $('#form-resena', d);
      const texto = $('#comentario', form);
      const radios = $$('input[name="estrellas"]', form);
      const pintarEstrellas = () => {
        const v = Number((radios.find((r) => r.checked) || {}).value || 0);
        radios.forEach((r) => r.parentElement.classList.toggle('activa', Number(r.value) <= v));
      };
      radios.forEach((r) => r.addEventListener('change', pintarEstrellas));
      pintarEstrellas();
      (radios.find((r) => r.checked) || radios[0]).focus();
      texto.addEventListener('input', () => { $('#contador-comentario', form).textContent = `${texto.value.length} / 500`; });
      if (mia) {
        $('#borrar-resena', form).addEventListener('click', async (e) => {
          const r = await conEspera(e.currentTarget, 'Borrando…', () => Api.resenas.borrar(estado.cliente.cedula, p.dbId));
          if (!r) return;
          if (r.error) { errorGeneral(form, r.error); return; }
          cerrarDialogo();
          aviso('Borraste tu reseña.');
          cargarResenas(p, main);
        });
      }
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const valor = Number((radios.find((r) => r.checked) || {}).value || 0);
        const comentario = texto.value.trim().replace(/\s+/g, ' ');
        const errEstrellas = valor ? '' : 'Elige de 1 a 5 estrellas.';
        const errEst = $('#estrellas-error', form);
        errEst.hidden = !errEstrellas; $('span', errEst).textContent = errEstrellas;
        const reglas = [['comentario', comentario.length < 10 ? 'Escribe al menos 10 caracteres.' : '']];
        if (errEstrellas) reglas.unshift([radios[0].id = 'estrella-1', errEstrellas]);
        if (!validarFormulario(form, reglas, 'Revisa tu reseña:')) return;
        const r = await conEspera($('button[type="submit"]', form), 'Publicando…', () =>
          Api.resenas.guardar(!!mia, { cedula: estado.cliente.cedula, producto: p.dbId, estrellas: valor, comentario }));
        if (!r) return;
        if (r.error) { errorGeneral(form, r.error); return; }
        cerrarDialogo();
        aviso('¡Gracias! Tu reseña ya está publicada.');
        cargarResenas(p, main);
      });
    }
  });
}

/* ======================= Carrito ======================= */
function agregarAlCarrito(id, talla, cantidad) {
  const p = producto(id);
  const limite = Math.min(10, stockDe(p, talla));
  const linea = estado.carrito.find((i) => i.id === id && i.talla === talla);
  let agregadas = Math.min(cantidad, limite - (linea ? linea.cantidad : 0));
  if (agregadas <= 0) return 0;
  if (linea) linea.cantidad += agregadas;
  else estado.carrito.push({ id, talla, cantidad: agregadas });
  guardarCarrito();
  actualizarContador();
  return agregadas;
}

function mostrarProductoAgregado(p, talla, agregadas) {
  const limite = agregadas <= 0;
  abrirDialogo(`
    <h2 class="dialogo__titulo" id="dialogo-titulo"><span class="icono-ok">${icono(limite ? 'info' : 'check')}</span>${limite ? 'Ya tienes el máximo' : '¡Producto agregado al carrito!'}</h2>
    <p>${limite ? `Ya tienes en tu carrito todas las unidades disponibles de ${esc(p.nombre)}${talla ? ` en talla ${talla}` : ''} (máximo 10 por producto).` : `${plural(agregadas, 'unidad', 'unidades')} de ${esc(p.nombre)}${talla ? `, talla ${talla}` : ''}.`}</p>
    <dl class="datos-lista" style="margin-top:1rem">
      <dt>Productos en tu carrito</dt><dd>${unidadesCarrito()}</dd>
      <dt>Subtotal</dt><dd>${dinero(subtotalCarrito())}</dd>
    </dl>
    <div class="dialogo__botones">
      <button class="boton boton--secundario" type="button" data-cerrar-dialogo>Seguir comprando</button>
      <a class="boton boton--principal" href="carrito.html">${icono('carrito')}Ver carrito</a>
    </div>`, { alAbrir: (d) => $('[data-cerrar-dialogo]', d).focus() });
}

function pasos(actual) {
  const nombres = ['Carrito', 'Retiro en tienda', 'Pago', 'Confirmación'];
  return `<ol class="pasos" aria-label="Pasos de la compra">${nombres.map((n, i) => {
    const estadoPaso = i + 1 < actual ? 'hecho' : (i + 1 === actual ? 'actual' : '');
    return `<li class="paso ${estadoPaso ? 'paso--' + estadoPaso : ''}" ${i + 1 === actual ? 'aria-current="step"' : ''}>
      <span class="paso__numero">${i + 1 < actual ? icono('check') : i + 1}</span><span class="paso__texto">${n}</span>
      ${i + 1 < actual ? '<span class="solo-lector"> (completado)</span>' : ''}</li>`;
  }).join('')}</ol>`;
}

function resumenPedido(extra = '') {
  return `
    <aside class="panel panel--gris resumen" aria-labelledby="titulo-resumen">
      <h2 id="titulo-resumen">Resumen del pedido</h2>
      <dl>
        <dt>Productos</dt><dd>${unidadesCarrito()}</dd>
        <dt>Subtotal</dt><dd>${dinero(subtotalCarrito())}</dd>
        <dt>IVA (15 %)</dt><dd>${dinero(ivaCarrito())}</dd>
        <dt>Retiro en tienda</dt><dd>Gratis</dd>
        <dt class="resumen__total">Total</dt><dd class="resumen__total">${dinero(totalCarrito())}</dd>
      </dl>
      ${extra}
    </aside>`;
}

/* Quita del carrito productos que ya no existen y ajusta cantidades al stock disponible */
function revisarCarrito() {
  const avisos = [];
  estado.carrito = estado.carrito.filter((l) => {
    const p = producto(l.id);
    if (!p || p.activo === false || (p.tallas.length && !p.tallas.includes(l.talla)) || (!p.tallas.length && l.talla)) { avisos.push('Quitamos un producto que ya no está disponible.'); return false; }
    const stock = stockDe(p, l.talla);
    if (stock <= 0) { avisos.push(`${p.nombre}${l.talla ? ' talla ' + l.talla : ''} se agotó y lo quitamos del carrito.`); return false; }
    if (l.cantidad > Math.min(10, stock)) { l.cantidad = Math.min(10, stock); avisos.push(`Ajustamos la cantidad de ${p.nombre} a ${l.cantidad} (stock disponible).`); }
    return true;
  });
  if (avisos.length) { guardarCarrito(); actualizarContador(); }
  return avisos;
}

function vistaCarrito() {
  const avisos = revisarCarrito();
  const vacio = estado.carrito.length === 0;
  return {
    titulo: 'Tu carrito',
    seccion: 'carrito',
    html: `
    <div class="contenedor pagina">
      ${pasos(1)}
      <h1 class="titulo-pagina cabecera-pagina">Tu carrito</h1>
      ${avisos.length ? `<div class="alerta alerta--info" role="status" style="margin-bottom:1.25rem">${icono('info')}<ul style="margin:0">${avisos.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
      ${vacio ? `
        <div class="panel panel--gris vacio">
          ${icono('carrito')}
          <h2 class="titulo-seccion">Tu carrito está vacío</h2>
          <p class="texto-suave">Agrega productos para empezar tu compra.</p>
          <a class="boton boton--principal" href="productos.html">Ver productos</a>
        </div>` : `
        <div class="compra-grilla">
          <section aria-label="Productos en tu carrito">
            <ul class="lista-carrito">${estado.carrito.map(itemCarrito).join('')}</ul>
          </section>
          ${resumenPedido(`
            <button class="boton boton--principal boton--bloque" type="button" id="continuar-compra">Continuar con la compra</button>
            <a class="boton boton--secundario boton--bloque" href="productos.html">${icono('izquierda')}Seguir comprando</a>
            <div style="text-align:center;margin-top:.5rem"><button class="boton-icono" type="button" id="vaciar">${icono('basura')}Vaciar carrito</button></div>
            <p class="texto-suave" style="margin-top:1rem;display:flex;gap:.5rem">${icono('candado')}Pago seguro con Visa o Mastercard.</p>`)}
        </div>`}
    </div>`,
    montar(main) {
      if (vacio) return;
      $('#continuar-compra', main).addEventListener('click', () => {
        if (!estado.catalogoConectado) { aviso('No hay conexión con la tienda. Revisa tu internet y vuelve a intentarlo.', 'error'); return; }
        ir(estado.sesion ? 'retiro.html' : 'login.html?volver=retiro');
      });
      $('#vaciar', main).addEventListener('click', async () => {
        if (!(await confirmar('¿Vaciar el carrito?', 'Se quitarán todos los productos del carrito.', 'Sí, vaciar'))) { $('#vaciar').focus(); return; }
        estado.carrito = [];
        guardarCarrito(); actualizarContador();
        render();
        anunciar('Vaciaste el carrito.');
      });
      main.addEventListener('click', (e) => {
        const b = e.target.closest('[data-item]');
        if (!b) return;
        const i = Number(b.dataset.item);
        const linea = estado.carrito[i];
        if (!linea) return;
        const p = producto(linea.id);
        const accion = b.dataset.accion;
        if (accion === 'menos' || accion === 'mas') {
          const max = Math.min(10, stockDe(p, linea.talla));
          linea.cantidad = Math.min(max, Math.max(1, linea.cantidad + (accion === 'mas' ? 1 : -1)));
          guardarCarrito(); actualizarContador();
          rerenderCarrito(`[data-item="${i}"][data-accion="${accion}"]`, `[data-item="${i}"][data-accion="${accion === 'mas' ? 'menos' : 'mas'}"]`);
          anunciar(`${p.nombre}: ${plural(linea.cantidad, 'unidad', 'unidades')}. Total ${dinero(totalCarrito())}.`);
        }
        if (accion === 'eliminar') {
          estado.carrito.splice(i, 1);
          guardarCarrito(); actualizarContador();
          rerenderCarrito('[data-accion="eliminar"]', '#continuar-compra');
          anunciar(`Quitaste ${p.nombre} del carrito.`);
        }
        if (accion === 'talla') abrirCambioTalla(i);
      });
    }
  };
}

function rerenderCarrito(...selectores) {
  render();
  const main = $('#contenido');
  for (const s of selectores) {
    const el = $(s, main);
    if (el && !el.disabled) { el.focus(); return; }
  }
  const t = $('h1', main); if (t) t.focus();
}

function itemCarrito(linea, i) {
  const p = producto(linea.id);
  const nombreCompleto = `${p.nombre}${linea.talla ? ', talla ' + linea.talla : ''}`;
  const max = Math.min(10, stockDe(p, linea.talla));
  return `
    <li class="item-carrito">
      <a class="item-carrito__imagen" href="producto.html?id=${p.id}" tabindex="-1" aria-hidden="true"><img src="${img(p)}" alt="" width="500" height="500"></a>
      <div>
        <p class="texto-suave" style="font-size:.85rem">${CATEGORIAS[p.categoria]}</p>
        <h2 class="item-carrito__nombre"><a href="producto.html?id=${p.id}">${esc(p.nombre)}</a></h2>
        ${linea.talla ? `<p class="item-carrito__talla"><span>Talla: <strong>${linea.talla}</strong></span>
          <button class="boton-icono" type="button" data-item="${i}" data-accion="talla" style="min-height:2.25rem;color:var(--verde)">${icono('editar')}Cambiar talla<span class="solo-lector"> de ${esc(p.nombre)}</span></button></p>` : ''}
        <p class="texto-suave">${dinero(p.precio)} c/u</p>
      </div>
      <div class="item-carrito__acciones">
        <div class="cantidad" role="group" aria-label="Cantidad de ${esc(nombreCompleto)}">
          <button type="button" data-item="${i}" data-accion="menos" aria-label="Quitar una unidad" ${linea.cantidad <= 1 ? 'disabled' : ''}>${icono('menos')}</button>
          <output>${linea.cantidad}</output>
          <button type="button" data-item="${i}" data-accion="mas" aria-label="Agregar una unidad" ${linea.cantidad >= max ? 'disabled' : ''}>${icono('mas')}</button>
        </div>
        <p class="item-carrito__subtotal"><span class="solo-lector">Subtotal: </span>${dinero(p.precio * linea.cantidad)}</p>
        <button class="boton-icono" type="button" data-item="${i}" data-accion="eliminar">${icono('basura')}Eliminar<span class="solo-lector"> ${esc(nombreCompleto)}</span></button>
      </div>
    </li>`;
}

function abrirCambioTalla(i) {
  const linea = estado.carrito[i];
  const p = producto(linea.id);
  abrirDialogo(`
    <h2 class="dialogo__titulo" id="dialogo-titulo">Cambiar talla</h2>
    <p><strong>${esc(p.nombre)}</strong></p>
    <p class="texto-suave" style="margin-bottom:1rem">Talla actual: <strong>${linea.talla}</strong></p>
    <form id="form-talla">
      <fieldset class="tallas">
        <legend style="margin-bottom:.6rem">Elige la nueva talla (EU)</legend>
        <div class="tallas__lista">
          ${p.tallas.map((t) => { const s = stockDe(p, t); return `<label class="talla ${s <= 0 ? 'talla--agotada' : ''}"><input type="radio" name="nueva" value="${t}" ${t === linea.talla ? 'checked' : ''} ${s <= 0 && t !== linea.talla ? 'disabled' : ''}><span>${t}${s <= 0 ? '<span class="solo-lector"> (agotada)</span>' : ''}</span></label>`; }).join('')}
        </div>
      </fieldset>
      <div class="dialogo__botones">
        <button class="boton boton--secundario" type="button" data-cerrar-dialogo>Cancelar</button>
        <button class="boton boton--principal" type="submit">Cambiar talla</button>
      </div>
    </form>`, {
    alAbrir: (d) => {
      $('input:checked', d).focus();
      $('#form-talla', d).addEventListener('submit', (e) => {
        e.preventDefault();
        const nueva = new FormData(e.target).get('nueva');
        cerrarDialogo();
        if (!nueva || nueva === linea.talla) return;
        const max = Math.min(10, stockDe(p, nueva));
        const otra = estado.carrito.find((x, j) => j !== i && x.id === linea.id && x.talla === nueva);
        if (otra) {
          otra.cantidad = Math.min(max, otra.cantidad + linea.cantidad);
          estado.carrito.splice(i, 1);
        } else {
          linea.talla = nueva;
          linea.cantidad = Math.min(max, linea.cantidad);
        }
        guardarCarrito(); actualizarContador();
        rerenderCarrito('[data-accion="talla"]');
        anunciar(`Cambiaste ${p.nombre} a la talla ${nueva}.`);
      });
    }
  });
}
