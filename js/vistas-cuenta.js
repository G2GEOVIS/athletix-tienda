/* ATHLETIX · Vistas de cuenta: ingreso, registro, verificación de correo, perfil y pedidos */
'use strict';

/* ======================= Ingresar ======================= */
function vistaIngresar(partes, params) {
  if (estado.sesion) { ir(estado.cliente ? '#/perfil' : '#/completar-perfil'); return null; }
  const volver = params.get('volver') === 'retiro' ? 'retiro' : '';
  return {
    titulo: 'Inicia sesión',
    seccion: 'ingresar',
    html: `
    <div class="contenedor pagina">
      <div class="panel formulario-centro">
        <h1 class="titulo-pagina">Inicia sesión</h1>
        <p class="subtitulo cabecera-pagina">${volver ? 'Ingresa con tu cuenta para finalizar tu compra.' : 'Ingresa para comprar y ver tus pedidos.'}</p>
        <form class="formulario" id="form-ingresar" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          ${campo({ id: 'correo', etiqueta: 'Correo electrónico', tipo: 'email', extra: 'autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false"' })}
          ${atajosCorreo('correo')}
          ${campoClave({ id: 'clave', etiqueta: 'Contraseña' })}
          <button class="boton boton--principal boton--bloque" type="submit">Ingresar</button>
          <a class="boton boton--texto" href="#/recuperar">¿Olvidaste tu contraseña?</a>
        </form>
        <div id="zona-reenviar"></div>
        <p class="separador-texto" style="margin-block:1.25rem">¿No tienes cuenta?</p>
        <a class="boton boton--secundario boton--bloque" href="#/registro${volver ? '?volver=' + volver : ''}">Crear cuenta</a>
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-ingresar', main);
      activarAtajosCorreo(form); activarEnlacesError(form); activarVerClave(form);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const correo = $('#correo', form).value.trim().toLowerCase();
        const clave = $('#clave', form).value;
        const ok = validarFormulario(form, [
          ['correo', Validar.correo(correo)],
          ['clave', clave ? '' : 'Escribe tu contraseña.']
        ], 'No pudimos iniciar sesión:');
        if (!ok) return;
        const r = await conEspera($('button[type="submit"]', form), 'Ingresando…', () => Api.auth.ingresar(correo, clave));
        if (!r) return;
        if (r.error) {
          errorGeneral(form, r.error);
          if (/confirmas tu correo/.test(r.error)) mostrarReenviar($('#zona-reenviar', main), correo);
          return;
        }
        await alIniciarSesion(r.datos.session);
        aviso(estado.cliente ? `Hola, ${nombreCliente()}. Iniciaste sesión.` : 'Iniciaste sesión. Completa tu perfil para comprar.');
        if (!estado.cliente) { ir('#/completar-perfil' + (volver ? '?volver=' + volver : '')); return; }
        ir(volver && estado.carrito.length ? '#/retiro' : '#/');
      });
    }
  };
}

function mostrarReenviar(zona, correo) {
  zona.innerHTML = `<div class="alerta alerta--info" style="margin-top:1rem">${icono('correo')}<div><p>¿No te llegó el correo de confirmación?</p>
    <button class="boton boton--secundario" type="button" id="reenviar" style="margin-top:.6rem">Enviarlo otra vez</button></div></div>`;
  $('#reenviar', zona).addEventListener('click', async (e) => {
    const r = await conEspera(e.currentTarget, 'Enviando…', () => Api.auth.reenviarConfirmacion(correo));
    if (!r) return;
    if (r.error) aviso(r.error, 'error'); else aviso(`Te enviamos otro correo a ${correo}. Revisa también la carpeta de spam.`);
  });
}

/* ======================= Registro ======================= */
function vistaRegistro(partes, params) {
  if (estado.sesion) { ir(estado.cliente ? '#/perfil' : '#/completar-perfil'); return null; }
  const volver = params.get('volver') === 'retiro' ? 'retiro' : '';
  return {
    titulo: 'Crea tu cuenta',
    seccion: 'ingresar',
    html: `
    <div class="contenedor pagina">
      <div class="panel formulario-centro" style="max-width:46rem">
        <h1 class="titulo-pagina">Crea tu cuenta</h1>
        <p class="subtitulo cabecera-pagina">Los campos con <span class="requerido">*</span> son obligatorios. Te enviaremos un correo para confirmar que es tuyo.</p>
        <form class="formulario" id="form-registro" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          ${camposDatosPersonales({})}
          <div>${campo({ id: 'correo-r', etiqueta: 'Correo electrónico', tipo: 'email', ayuda: 'Usa un correo al que tengas acceso: ahí te llegará la confirmación y el aviso de tus pedidos.', extra: 'autocomplete="email" inputmode="email" autocapitalize="off" spellcheck="false"' })}<div style="margin-top:.5rem">${atajosCorreo('correo-r')}</div></div>
          <div class="formulario__fila formulario__fila--doble">
            ${campoClave({ id: 'clave-r', etiqueta: 'Contraseña', ayuda: 'Mínimo 8 caracteres, con letras y números', autocomplete: 'new-password' })}
            ${campoClave({ id: 'clave-r2', etiqueta: 'Confirmar contraseña', ayuda: 'Escríbela otra vez', autocomplete: 'new-password' })}
          </div>
          <button class="boton boton--principal boton--bloque" type="submit">Crear cuenta</button>
        </form>
        <p class="separador-texto" style="margin-block:1.25rem">¿Ya tienes cuenta?</p>
        <a class="boton boton--secundario boton--bloque" href="#/ingresar${volver ? '?volver=' + volver : ''}">Iniciar sesión</a>
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-registro', main);
      activarAtajosCorreo(form); activarEnlacesError(form); activarVerClave(form);
      activarDatosPersonales(form);
      validarAlSalir(form, 'correo-r', (v) => Validar.correo(v));
      validarAlSalir(form, 'clave-r', (v) => Validar.clave(v));
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = leerDatosPersonales(form);
        const correo = $('#correo-r', form).value.trim().toLowerCase();
        const clave = $('#clave-r', form).value;
        const clave2 = $('#clave-r2', form).value;
        const ok = validarFormulario(form, [
          ...reglasDatosPersonales(datos),
          ['correo-r', Validar.correo(correo)],
          ['clave-r', Validar.clave(clave)],
          ['clave-r2', !clave2 ? 'Confirma tu contraseña.' : clave2 !== clave ? 'Las contraseñas no coinciden.' : '']
        ], 'Revisa estos datos para crear tu cuenta:');
        if (!ok) return;
        const boton = $('button[type="submit"]', form);
        const r = await conEspera(boton, 'Creando cuenta…', async () => {
          // No se permite registrar dos veces la misma cédula ni el mismo correo
          const [ced, cor] = await Promise.all([Api.cliente.cedulaRegistrada(datos.cedula), Api.cliente.correoRegistrado(correo)]);
          if (ced.error) return ced;
          if (cor.error) return cor;
          const dobles = [];
          if (ced.datos) dobles.push(['cedula', 'Ya existe una cuenta con esta cédula. Inicia sesión.']);
          if (cor.datos) dobles.push(['correo-r', 'Ya existe una cuenta con este correo. Inicia sesión.']);
          if (dobles.length) return { dobles };
          return Api.auth.registrar(correo, clave, datos);
        });
        if (!r) return;
        if (r.dobles) { validarFormulario(form, r.dobles, 'Ya tienes una cuenta:'); return; }
        if (r.error) { errorGeneral(form, r.error); return; }
        if (r.datos && r.datos.session) {
          await alIniciarSesion(r.datos.session);
          ir(volver && estado.carrito.length ? '#/retiro' : '#/perfil');
          return;
        }
        guardarTemporal('correo-pendiente', correo);
        if (volver) guardarTemporal('volver', volver);
        ir('#/verifica-correo');
      });
    }
  };
}

/* Campos compartidos por registro, completar perfil y editar perfil */
function camposDatosPersonales(v, { cedulaFija = false } = {}) {
  return `
    <div class="formulario__fila formulario__fila--doble">
      ${campo({ id: 'nombres', etiqueta: 'Nombres', ayuda: 'Solo letras, por ejemplo: Ana María', valor: v.nombres || '', max: 60, extra: 'autocomplete="given-name" autocapitalize="words"' })}
      ${campo({ id: 'apellidos', etiqueta: 'Apellidos', ayuda: 'Solo letras, por ejemplo: Pérez López', valor: v.apellidos || '', max: 60, extra: 'autocomplete="family-name" autocapitalize="words"' })}
    </div>
    <div class="formulario__fila formulario__fila--doble">
      ${cedulaFija
        ? `<div class="campo"><p style="font-weight:700">Cédula</p><p class="campo-fijo">${esc(v.cedula)}</p><p class="campo__ayuda">La cédula no se puede cambiar.</p></div>`
        : campo({ id: 'cedula', etiqueta: 'Cédula', ayuda: '10 números, sin guion', valor: v.cedula || '', max: 10, extra: 'inputmode="numeric" autocomplete="off"' })}
      ${campo({ id: 'telefono', etiqueta: 'Celular', tipo: 'tel', ayuda: '10 números, empieza con 09', valor: v.telefono || '', max: 10, extra: 'autocomplete="tel-national" inputmode="numeric"' })}
    </div>`;
}
function activarDatosPersonales(form) {
  filtrarEntrada($('#nombres', form), NO_LETRAS, 60);
  filtrarEntrada($('#apellidos', form), NO_LETRAS, 60);
  filtrarEntrada($('#telefono', form), NO_DIGITOS, 10);
  validarAlSalir(form, 'nombres', (v) => Validar.nombre(v, 'nombre'));
  validarAlSalir(form, 'apellidos', (v) => Validar.nombre(v, 'apellido'));
  validarAlSalir(form, 'telefono', (v) => Validar.telefono(v));
  const ced = $('#cedula', form);
  if (ced) { filtrarEntrada(ced, NO_DIGITOS, 10); validarAlSalir(form, 'cedula', (v) => Validar.cedula(v)); }
}
const limpiarNombre = (t) => t.trim().replace(/\s+/g, ' ').replace(/(^|[ '-])([a-záéíóúüñ])/g, (m, a, b) => a + b.toUpperCase());
function leerDatosPersonales(form) {
  const ced = $('#cedula', form);
  return {
    nombres: limpiarNombre($('#nombres', form).value),
    apellidos: limpiarNombre($('#apellidos', form).value),
    cedula: ced ? ced.value.trim() : undefined,
    telefono: $('#telefono', form).value.trim()
  };
}
function reglasDatosPersonales(d) {
  const r = [
    ['nombres', Validar.nombre(d.nombres, 'nombre')],
    ['apellidos', Validar.nombre(d.apellidos, 'apellido')]
  ];
  if (d.cedula !== undefined) r.push(['cedula', Validar.cedula(d.cedula)]);
  r.push(['telefono', Validar.telefono(d.telefono)]);
  return r;
}

/* ======================= Verificación de correo ======================= */
function vistaVerificaCorreo() {
  const correo = leerTemporal('correo-pendiente');
  if (!correo) { ir('#/ingresar'); return null; }
  return {
    titulo: 'Confirma tu correo',
    seccion: 'ingresar',
    html: `
    <div class="contenedor pagina">
      <div class="panel centro" style="max-width:38rem">
        <div class="icono-exito"><span>${icono('correo')}</span></div>
        <h1 class="titulo-pagina">Revisa tu correo</h1>
        <p class="subtitulo">Te enviamos un enlace de confirmación a <strong>${esc(correo)}</strong>.</p>
        <ol class="lista-pasos">
          <li>Abre el correo de ATHLETIX (revisa también spam o promociones).</li>
          <li>Pulsa el enlace <strong>Confirmar mi correo</strong>.</li>
          <li>Volverás a la tienda con tu sesión iniciada.</li>
        </ol>
        <div id="zona-reenviar"></div>
        <a class="boton boton--texto" href="#/ingresar">Ya lo confirmé, iniciar sesión</a>
      </div>
    </div>`,
    montar(main) { mostrarReenviar($('#zona-reenviar', main), correo); }
  };
}

/* ======================= Completar perfil (si faltan datos al primer ingreso) ======================= */
function vistaCompletarPerfil(partes, params) {
  if (!estado.sesion) { ir('#/ingresar'); return null; }
  if (estado.cliente) { ir('#/perfil'); return null; }
  const meta = estado.sesion.user.user_metadata || {};
  const [nombreG, ...apellidoG] = String(meta.full_name || meta.name || '').split(' ');
  const v = { nombres: meta.nombres || nombreG || '', apellidos: meta.apellidos || apellidoG.join(' '), cedula: meta.cedula || '', telefono: meta.telefono || '' };
  const volver = params.get('volver') === 'retiro' || leerTemporal('volver') === 'retiro';
  return {
    titulo: 'Completa tu perfil',
    seccion: 'perfil',
    html: `
    <div class="contenedor pagina">
      <div class="panel formulario-centro" style="max-width:46rem">
        <h1 class="titulo-pagina">Completa tu perfil</h1>
        <p class="subtitulo cabecera-pagina">Necesitamos estos datos para preparar tus pedidos. Al retirarlos te pediremos tu cédula.</p>
        <p class="texto-suave" style="margin-bottom:1rem">Cuenta: <strong>${esc(correoSesion())}</strong></p>
        <form class="formulario" id="form-completar" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          ${camposDatosPersonales(v)}
          <button class="boton boton--principal boton--bloque" type="submit">Guardar y continuar</button>
        </form>
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-completar', main);
      activarEnlacesError(form); activarDatosPersonales(form);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const d = leerDatosPersonales(form);
        if (!validarFormulario(form, reglasDatosPersonales(d), 'Revisa estos datos:')) return;
        const r = await conEspera($('button[type="submit"]', form), 'Guardando…', async () => {
          const ced = await Api.cliente.cedulaRegistrada(d.cedula);
          if (ced.error) return ced;
          if (ced.datos) return { doble: true };
          return Api.cliente.crear({ id: estado.sesion.user.id, correo: correoSesion(), ...d });
        });
        if (!r) return;
        if (r.doble) { validarFormulario(form, [['cedula', 'Ya existe otra cuenta con esta cédula.']], 'No pudimos guardar:'); return; }
        if (r.error) { errorGeneral(form, r.error); return; }
        estado.cliente = r.datos;
        renderCuenta();
        guardarTemporal('volver', null);
        aviso(`¡Listo, ${nombreCliente()}! Tu perfil está completo.`);
        ir(volver && estado.carrito.length ? '#/retiro' : '#/perfil');
      });
    }
  };
}

/* ======================= Recuperar y cambiar contraseña ======================= */
function vistaRecuperar() {
  return {
    titulo: 'Recuperar contraseña',
    seccion: 'ingresar',
    html: `
    <div class="contenedor pagina">
      <div class="panel formulario-centro">
        <h1 class="titulo-pagina">Recuperar contraseña</h1>
        <p class="subtitulo cabecera-pagina">Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.</p>
        <form class="formulario" id="form-recuperar" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          ${campo({ id: 'correo-rec', etiqueta: 'Correo electrónico', tipo: 'email', extra: 'autocomplete="email" inputmode="email" autocapitalize="off"' })}
          <button class="boton boton--principal boton--bloque" type="submit">Enviar enlace</button>
          <a class="boton boton--texto" href="#/ingresar">${icono('izquierda')}Volver a iniciar sesión</a>
        </form>
      </div>
    </div>`,
    montar(main) {
      const form = $('#form-recuperar', main);
      activarEnlacesError(form);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const correo = $('#correo-rec', form).value.trim().toLowerCase();
        if (!validarFormulario(form, [['correo-rec', Validar.correo(correo)]], 'Revisa tu correo:')) return;
        const r = await conEspera($('button[type="submit"]', form), 'Enviando…', () => Api.auth.recuperarClave(correo));
        if (!r) return;
        if (r.error) { errorGeneral(form, r.error); return; }
        form.innerHTML = `<p class="alerta alerta--info" role="status">${icono('correo')}<span>Si existe una cuenta con ${esc(correo)}, te llegará un correo con el enlace en unos minutos. Revisa también la carpeta de spam.</span></p>`;
      });
    }
  };
}

function formularioNuevaClave(idForm) {
  return `
    <form class="formulario" id="${idForm}" novalidate>
      <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
      ${campoClave({ id: 'nueva', etiqueta: 'Nueva contraseña', ayuda: 'Mínimo 8 caracteres, con letras y números', autocomplete: 'new-password' })}
      ${campoClave({ id: 'nueva2', etiqueta: 'Confirmar nueva contraseña', autocomplete: 'new-password' })}
      <button class="boton boton--principal boton--bloque" type="submit">Guardar contraseña</button>
    </form>`;
}
function activarNuevaClave(form, alTerminar) {
  activarEnlacesError(form); activarVerClave(form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const c1 = $('#nueva', form).value; const c2 = $('#nueva2', form).value;
    if (!validarFormulario(form, [
      ['nueva', Validar.clave(c1)],
      ['nueva2', !c2 ? 'Confirma la contraseña.' : c1 !== c2 ? 'Las contraseñas no coinciden.' : '']
    ], 'Revisa la contraseña:')) return;
    const r = await conEspera($('button[type="submit"]', form), 'Guardando…', () => Api.auth.cambiarClave(c1));
    if (!r) return;
    if (r.error) { errorGeneral(form, r.error); return; }
    form.reset();
    alTerminar();
  });
}

function vistaNuevaClave() {
  if (!estado.sesion) { ir('#/recuperar'); return null; }
  return {
    titulo: 'Nueva contraseña',
    seccion: 'ingresar',
    html: `<div class="contenedor pagina"><div class="panel formulario-centro">
      <h1 class="titulo-pagina">Crea tu nueva contraseña</h1>
      <p class="subtitulo cabecera-pagina">Cuenta: ${esc(correoSesion())}</p>
      ${formularioNuevaClave('form-nueva')}</div></div>`,
    montar(main) { activarNuevaClave($('#form-nueva', main), () => { aviso('Tu contraseña se cambió correctamente.'); ir('#/'); }); }
  };
}

/* ======================= Perfil ======================= */
function protegerCuenta(volver = '') {
  if (!estado.sesion) { ir('#/ingresar' + (volver ? '?volver=' + volver : '')); return false; }
  if (!estado.cliente) { ir('#/completar-perfil' + (volver ? '?volver=' + volver : '')); return false; }
  return true;
}

const SECCIONES_PERFIL = [
  ['', 'Mis datos', 'usuario'],
  ['pagos', 'Métodos de pago', 'tarjeta'],
  ['seguridad', 'Contraseña', 'candado']
];
function marcoPerfil(actual, contenido) {
  return `
    <div class="contenedor pagina">
      <h1 class="titulo-pagina">Mi perfil</h1>
      <p class="subtitulo cabecera-pagina">Hola, ${esc(nombreCliente())}. Aquí administras tu cuenta.</p>
      <div class="perfil">
        <nav class="perfil__menu" aria-label="Secciones del perfil">
          <ul>
            ${SECCIONES_PERFIL.map(([r, t, i]) => `<li><a href="#/perfil${r ? '/' + r : ''}" ${r === actual ? 'aria-current="page"' : ''}>${icono(i)}${t}</a></li>`).join('')}
            <li><a href="#/pedidos">${icono('paquete')}Mis pedidos</a></li>
            ${estado.esAdmin ? `<li><a href="#/admin">${icono('ajustes')}Panel de pedidos</a></li>` : ''}
            <li><button type="button" data-accion="cerrar-sesion">${icono('salir')}Cerrar sesión</button></li>
          </ul>
        </nav>
        <div class="perfil__contenido">${contenido}</div>
      </div>
    </div>`;
}

async function vistaPerfil(partes) {
  if (!protegerCuenta()) return null;
  const sub = partes[1] || '';
  if (sub === 'pagos') return vistaPagos();
  if (sub === 'seguridad') return vistaSeguridad();
  const c = estado.cliente;
  return {
    titulo: 'Mi perfil',
    seccion: 'perfil',
    html: marcoPerfil('', `
      <section class="panel" aria-labelledby="titulo-datos">
        <h2 id="titulo-datos">Mis datos</h2>
        <form class="formulario" id="form-datos" novalidate>
          <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
          ${camposDatosPersonales(c, { cedulaFija: true })}
          <div class="campo"><p style="font-weight:700">Correo electrónico</p><p class="campo-fijo">${esc(correoSesion())}</p>
            <p class="campo__ayuda">Es el correo de tu cuenta y donde te avisamos de tus pedidos.</p></div>
          <p class="texto-suave">Cliente desde el ${fecha(c.creado_en)}.</p>
          <button class="boton boton--principal" type="submit">Guardar cambios</button>
        </form>
      </section>`),
    montar(main) {
      const form = $('#form-datos', main);
      activarEnlacesError(form); activarDatosPersonales(form);
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const d = leerDatosPersonales(form);
        delete d.cedula;
        if (!validarFormulario(form, reglasDatosPersonales(d), 'Revisa tus datos:')) return;
        const r = await conEspera($('button[type="submit"]', form), 'Guardando…', () => Api.cliente.actualizar(c.id, d));
        if (!r) return;
        if (r.error) { errorGeneral(form, r.error); return; }
        estado.cliente = r.datos;
        renderCuenta();
        $('#nombres', form).value = r.datos.nombres;
        $('#apellidos', form).value = r.datos.apellidos;
        aviso('Tus datos se guardaron.');
        anunciar('Tus datos se guardaron.');
      });
    }
  };
}

function vistaSeguridad() {
  return {
    titulo: 'Cambiar contraseña',
    seccion: 'perfil',
    html: marcoPerfil('seguridad', `
      <section class="panel" aria-labelledby="titulo-clave">
        <h2 id="titulo-clave">Cambiar contraseña</h2>
        ${formularioNuevaClave('form-clave')}
      </section>`),
    montar(main) { activarNuevaClave($('#form-clave', main), () => { aviso('Tu contraseña se cambió correctamente.'); anunciar('Tu contraseña se cambió correctamente.'); }); }
  };
}

/* ---------- Métodos de pago ---------- */
async function vistaPagos() {
  const r = await Api.cliente.tarjetas();
  if (r.error) return { titulo: 'Métodos de pago', html: errorCargaHtml(r.error) };
  const lista = r.datos || [];
  return {
    titulo: 'Métodos de pago',
    seccion: 'perfil',
    html: marcoPerfil('pagos', `
      <section class="panel" aria-labelledby="titulo-pagos">
        <div class="cabecera-seccion"><h2 id="titulo-pagos">Métodos de pago</h2>
          <button class="boton boton--principal" type="button" id="nueva-tarjeta">${icono('mas')}Agregar tarjeta</button></div>
        <p class="texto-suave" style="margin-bottom:1rem">${icono('candado')} Por seguridad solo guardamos la marca, los últimos 4 dígitos y la fecha de vencimiento. Nunca guardamos el número completo ni el CVV.</p>
        ${lista.length ? `<ul class="tarjetas-lista">${lista.map((t) => `
          <li class="tarjeta-dato">
            <div class="tarjeta-dato__info">${icono('tarjeta')}<div><p><strong>${t.marca} •••• ${t.ultimos4}</strong></p>
              <p class="texto-suave">${esc(t.titular)} · Vence ${String(t.mes_vence).padStart(2, '0')}/${String(t.anio_vence).slice(2)}</p></div></div>
            <button class="boton-icono" type="button" data-borrar-tarjeta="${t.id}">${icono('basura')}Quitar<span class="solo-lector"> ${t.marca} terminada en ${t.ultimos4}</span></button>
          </li>`).join('')}</ul>` : `<div class="panel panel--gris vacio">${icono('tarjeta')}<p>No tienes tarjetas guardadas. Se guardan al pagar o desde aquí.</p></div>`}
      </section>`),
    montar(main) {
      $('#nueva-tarjeta', main).addEventListener('click', () => {
        abrirDialogo(`
          <h2 class="dialogo__titulo" id="dialogo-titulo">Agregar tarjeta</h2>
          <form class="formulario" id="form-tarjeta-nueva" novalidate>
            <div class="alerta alerta-errores" tabindex="-1" role="alert" hidden></div>
            ${camposTarjeta()}
            <div class="dialogo__botones">
              <button class="boton boton--secundario" type="button" data-cerrar-dialogo>Cancelar</button>
              <button class="boton boton--principal" type="submit">Guardar tarjeta</button>
            </div>
          </form>`, {
          ancho: true,
          alAbrir: (dlg) => {
            const form = $('#form-tarjeta-nueva', dlg);
            activarCamposTarjeta(form);
            $('#tarjeta', form).focus();
            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const t = leerTarjeta(form);
              if (!t) return;
              const rg = await conEspera($('button[type="submit"]', form), 'Guardando…', () => Api.cliente.guardarTarjeta(t.registro));
              if (!rg) return;
              if (rg.error) { errorGeneral(form, rg.error); return; }
              cerrarDialogo();
              aviso('Tarjeta guardada.');
              render();
            });
          }
        });
      });
      main.addEventListener('click', async (e) => {
        const b = e.target.closest('[data-borrar-tarjeta]');
        if (!b) return;
        const t = lista.find((x) => x.id === Number(b.dataset.borrarTarjeta));
        if (!(await confirmar('¿Quitar tarjeta?', `Se quitará la ${t.marca} terminada en ${t.ultimos4}.`, 'Sí, quitar'))) return;
        const rb = await Api.cliente.borrarTarjeta(t.id);
        if (rb.error) {
          aviso(rb.tecnico && (rb.tecnico.code === '23503' || /foreign key/i.test(rb.tecnico.message || '')) ? 'No puedes quitar una tarjeta que ya usaste en un pedido; queda en tu historial.' : rb.error, 'error');
          return;
        }
        aviso('Tarjeta quitada.');
        render();
      });
    }
  };
}

/* Campos de tarjeta (compartidos por el pago y el perfil) */
function camposTarjeta() {
  return `
    ${campo({ id: 'tarjeta', etiqueta: 'Número de tarjeta', ayuda: '16 dígitos, Visa o Mastercard', max: 19, extra: 'autocomplete="cc-number" inputmode="numeric" placeholder="0000 0000 0000 0000"' })}
    <p class="marca-tarjeta texto-suave" id="marca-tarjeta" aria-live="polite"></p>
    ${campo({ id: 'titular', etiqueta: 'Nombre del titular', ayuda: 'Como aparece en la tarjeta', max: 60, extra: 'autocomplete="cc-name" autocapitalize="characters"' })}
    <div class="formulario__fila formulario__fila--doble">
      ${campo({ id: 'vence', etiqueta: 'Vencimiento', ayuda: 'MM/AA', max: 5, extra: 'autocomplete="cc-exp" inputmode="numeric" placeholder="MM/AA"' })}
      ${campo({ id: 'cvv', etiqueta: 'CVV', tipo: 'password', ayuda: '3 dígitos al reverso', max: 3, extra: 'autocomplete="cc-csc" inputmode="numeric"' })}
    </div>
    <details class="tarjetas-prueba">
      <summary>${icono('info')}Ver tarjetas de prueba</summary>
      <p>Esta es una tienda académica: no se cobra dinero real. Usa una de estas tarjetas, con cualquier nombre, una fecha futura y cualquier CVV de 3 números:</p>
      <ul>
        <li><strong>4242 4242 4242 4242</strong> · Visa · pago aprobado</li>
        <li><strong>5555 5555 5555 4444</strong> · Mastercard · pago aprobado</li>
        <li><strong>4000 0566 5566 5556</strong> · Visa débito · pago aprobado</li>
        <li><strong>4000 0000 0000 0002</strong> · Visa · pago rechazado</li>
        <li><strong>4000 0000 0000 9995</strong> · Visa · fondos insuficientes</li>
      </ul>
    </details>`;
}
function activarCamposTarjeta(form) {
  activarEnlacesError(form);
  const tarjeta = $('#tarjeta', form);
  tarjeta.addEventListener('input', () => {
    const d = tarjeta.value.replace(/\D/g, '').slice(0, 16);
    const formateado = d.replace(/(\d{4})(?=\d)/g, '$1 ');
    if (formateado !== tarjeta.value) tarjeta.value = formateado;
    const marca = Validar.marcaTarjeta(d);
    $('#marca-tarjeta', form).textContent = d.length >= 2 ? (marca ? `Tarjeta ${marca}` : 'Solo aceptamos Visa o Mastercard') : '';
  });
  validarAlSalir(form, 'tarjeta', (v) => Validar.tarjeta(v));
  filtrarEntrada($('#titular', form), NO_LETRAS, 60);
  const vence = $('#vence', form);
  vence.addEventListener('input', (e) => {
    let d = vence.value.replace(/\D/g, '').slice(0, 4);
    if (d.length === 1 && Number(d) > 1) d = '0' + d;
    const nuevo = d.length > 2 || (d.length === 2 && e.inputType !== 'deleteContentBackward') ? d.slice(0, 2) + '/' + d.slice(2) : d;
    if (nuevo !== vence.value) vence.value = nuevo;
  });
  validarAlSalir(form, 'vence', (v) => Validar.vencimiento(v));
  filtrarEntrada($('#cvv', form), NO_DIGITOS, 3);
}
/* Valida y devuelve los datos seguros de la tarjeta (sin número completo ni CVV) */
function leerTarjeta(form) {
  const numero = $('#tarjeta', form).value.replace(/\D/g, '');
  const titular = $('#titular', form).value.trim().replace(/\s+/g, ' ');
  const vence = $('#vence', form).value.trim();
  const ok = validarFormulario(form, [
    ['tarjeta', Validar.tarjeta(numero)],
    ['titular', Validar.titular(titular)],
    ['vence', Validar.vencimiento(vence)],
    ['cvv', Validar.cvv($('#cvv', form).value)]
  ], 'Revisa los datos de la tarjeta:');
  if (!ok) return null;
  const [mm, aa] = vence.split('/');
  return {
    resultado: Validar.resultadoTarjeta(numero),
    registro: { cedula: estado.cliente.cedula, marca: Validar.marcaTarjeta(numero), ultimos4: numero.slice(-4), titular: titular.toUpperCase(), mes_vence: Number(mm), anio_vence: 2000 + Number(aa) }
  };
}

/* ======================= Mis pedidos ======================= */
function seguimiento(estadoPedido) {
  if (estadoPedido === 'Cancelado') return '<p class="alerta" style="margin-top:.75rem">Este pedido fue cancelado.</p>';
  const etapa = ESTADOS.indexOf(estadoPedido);
  return `<ol class="seguimiento" aria-label="Estado del pedido: ${NOMBRE_ESTADO[estadoPedido]}">${ESTADOS.map((e, i) => `
    <li class="${i < etapa ? 'hecho' : i === etapa ? 'actual hecho' : ''}" ${i === etapa ? 'aria-current="step"' : ''}>
      <span class="seguimiento__punto">${i <= etapa ? icono('check') : ''}</span>${NOMBRE_ESTADO[e]}
    </li>`).join('')}</ol>`;
}

async function vistaPedidos() {
  if (!protegerCuenta()) return null;
  const r = await Api.pedidos.mios();
  if (r.error) return { titulo: 'Mis pedidos', seccion: 'pedidos', html: errorCargaHtml(r.error) };
  const mios = r.datos || [];
  return {
    titulo: 'Mis pedidos',
    seccion: 'pedidos',
    html: `
    <div class="contenedor pagina">
      <h1 class="titulo-pagina">Mis pedidos</h1>
      <p class="subtitulo">Todas tus compras, de la más reciente a la más antigua, y en qué etapa está cada una.</p>
      <p style="color:var(--verde);font-weight:700;margin-block:.75rem 1.5rem">${mios.length ? `Has realizado ${plural(mios.length, 'pedido', 'pedidos')}` : ''}</p>
      ${!mios.length ? `
        <div class="panel panel--gris vacio">${icono('paquete')}<h2 class="titulo-seccion">Aún no tienes pedidos</h2><p class="texto-suave">Cuando compres, tus pedidos aparecerán aquí.</p><a class="boton boton--principal" href="#/productos">Ver productos</a></div>` : `
        <ul class="pedidos">${mios.map((p) => `
          <li class="pedido">
            <div class="pedido__cabecera">
              <h2 class="pedido__numero">Pedido N.º ${esc(p.numero)}</h2>
              <span class="estado estado--${p.estado.toLowerCase()}">${NOMBRE_ESTADO[p.estado]}</span>
            </div>
            <p class="texto-suave" style="margin-top:.25rem">${fechaHora(p.creado_en)}</p>
            <ul class="pedido__productos">${p.detalle_pedido.map((d) => { const pr = productoPorDbId(d.producto_id); return `<li>${d.cantidad} × ${pr ? `<a href="#/producto/${pr.id}">${esc(pr.nombre)}</a>` : 'Producto'}${d.talla ? ` (talla ${esc(d.talla)})` : ''} · ${dinero(d.precio_unitario * d.cantidad)}${p.estado === 'Retirado' && pr ? ` · <a href="#/producto/${pr.id}">Dejar reseña</a>` : ''}</li>`; }).join('')}</ul>
            <dl class="datos-lista datos-lista--compacta">
              <dt>Subtotal</dt><dd>${dinero(p.subtotal)}</dd>
              <dt>IVA</dt><dd>${dinero(p.iva)}</dd>
              <dt>Total</dt><dd>${dinero(p.total)}</dd>
              <dt>Retiro en</dt><dd>${esc(p.tiendas ? p.tiendas.nombre : '')}</dd>
              <dt>Pago</dt><dd>${p.metodos_pago ? `${p.metodos_pago.marca} •••• ${p.metodos_pago.ultimos4}` : ''}</dd>
            </dl>
            ${seguimiento(p.estado)}
          </li>`).join('')}
        </ul>
        <p class="texto-suave" style="margin-top:1rem">Te enviaremos un correo a ${esc(correoSesion())} cuando tu pedido esté listo para retirar.</p>`}
    </div>`
  };
}
