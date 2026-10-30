/* ATHLETIX · Acceso a datos (Supabase) y envío de correos (EmailJS)
   Toda la comunicación con el servidor pasa por aquí. Cada función devuelve
   { datos } o { error } con un mensaje en español; nunca lanza excepciones
   a la interfaz, así un fallo de red no rompe la página. */
'use strict';

const Api = (() => {
  let sb = null;
  try {
    if (window.supabase && CONFIG.supabase.url && CONFIG.supabase.clave) {
      sb = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.clave, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' }
      });
    }
  } catch (e) { sb = null; }

  const disponible = () => !!sb;

  /* Traduce los errores técnicos a mensajes claros */
  function traducir(error) {
    const m = String((error && (error.message || error.error_description || error)) || '').toLowerCase();
    if (!navigator.onLine || m.includes('failed to fetch') || m.includes('network') || m.includes('tiempo de espera')) {
      return 'No hay conexión con la tienda. Revisa tu internet e inténtalo de nuevo.';
    }
    if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.';
    if (m.includes('email not confirmed')) return 'Todavía no confirmas tu correo. Revisa tu bandeja de entrada (y la carpeta de spam).';
    if (m.includes('user already registered') || m.includes('already been registered')) return 'Ya existe una cuenta con este correo. Inicia sesión.';
    if (m.includes('pk_cliente') || (m.includes('duplicate') && m.includes('cedula'))) return 'Ya existe una cuenta con esta cédula.';
    if (m.includes('ak_cliente_correo') || m.includes('ak_cliente_usuario')) return 'Ya existe una cuenta con este correo.';
    if (m.includes('cedula_valida') || m.includes('ckc_cli_cedula')) return 'La cédula no es válida.';
    if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes')) return 'Hiciste demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.';
    if (m.includes('password should be') || m.includes('weak')) return 'La contraseña es muy débil. Usa al menos 8 caracteres con letras y números.';
    if (m.includes('same password') || m.includes('should be different')) return 'La nueva contraseña debe ser diferente a la actual.';
    if (m.includes('jwt') || m.includes('not authenticated') || m.includes('inicia sesión') || m.includes('iniciar sesión')) return 'Tu sesión terminó. Vuelve a iniciar sesión.';
    if (m.includes('ak_metodo_pago_cliente')) return 'Ya tienes guardada esta tarjeta.';
    if (m.includes('fk_producto_detallepedido') || (m.includes('foreign key') && m.includes('detalle_pedido'))) return 'Este producto ya tiene ventas registradas: no se puede borrar. Ocúltalo para que no se muestre en la tienda.';
    if (m.includes('pk_producto') && m.includes('duplicate')) return 'Ya existe un producto con ese código.';
    if (m.includes('row-level security') && m.includes('storage')) return 'Solo el administrador puede subir fotos.';
    if (m.includes('payload too large') || m.includes('exceeded the maximum')) return 'La foto pesa demasiado (máximo 3 MB).';
    if (m.includes('pk_resena')) return 'Ya dejaste una reseña de este producto. Puedes editarla.';
    // Mensajes propios de la base de datos (ya vienen en español)
    const propio = String((error && error.message) || '');
    if (/^[A-ZÁÉÍÓÚ¿¡]/.test(propio) && /[áéíóúñ]|\b(el|la|de|para|debes|no)\b/i.test(propio)) return propio;
    return 'No pudimos completar la acción. Inténtalo de nuevo en unos segundos.';
  }

  /* Ejecuta una consulta con tiempo límite y errores traducidos */
  async function ejecutar(promesa) {
    if (!sb) return { error: 'La tienda no pudo conectarse con el servidor. Recarga la página.' };
    let temporizador;
    const limite = new Promise((_, rechazar) => { temporizador = setTimeout(() => rechazar(new Error('tiempo de espera')), CONFIG.tiempoEsperaMs); });
    try {
      const r = await Promise.race([promesa, limite]);
      if (r && r.error) return { error: traducir(r.error), tecnico: r.error };
      return { datos: r ? r.data : null };
    } catch (e) {
      return { error: traducir(e), tecnico: e };
    } finally {
      clearTimeout(temporizador);
    }
  }

  // Los enlaces de los correos (confirmar cuenta, recuperar clave) siempre regresan a la página de inicio
  const urlRegreso = () => location.origin + location.pathname.replace(/[^/]*$/, '') + 'index.html';

  /* ---------- Sesión ---------- */
  const auth = {
    async sesion() {
      if (!sb) return null;
      try { const { data } = await sb.auth.getSession(); return data.session; } catch (e) { return null; }
    },
    alCambiar(fn) { if (sb) sb.auth.onAuthStateChange((evento, sesion) => fn(evento, sesion)); },
    registrar(correo, clave, perfil) {
      return ejecutar(sb.auth.signUp({ email: correo, password: clave, options: { data: perfil, emailRedirectTo: urlRegreso() } }));
    },
    ingresar(correo, clave) { return ejecutar(sb.auth.signInWithPassword({ email: correo, password: clave })); },
    /* Ingreso con Google (OAuth): Google confirma el correo y Supabase crea la cuenta */
    ingresarConGoogle() {
      return ejecutar(sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: urlRegreso() } }));
    },
    /* El botón de Google solo aparece si el proveedor está activado en Supabase */
    async googleActivo() {
      try {
        const r = await fetch(CONFIG.supabase.url + '/auth/v1/settings', { headers: { apikey: CONFIG.supabase.clave } });
        const d = await r.json();
        return !!(d.external && d.external.google);
      } catch (e) { return false; }
    },
    reenviarConfirmacion(correo) {
      return ejecutar(sb.auth.resend({ type: 'signup', email: correo, options: { emailRedirectTo: urlRegreso() } }));
    },
    recuperarClave(correo) { return ejecutar(sb.auth.resetPasswordForEmail(correo, { redirectTo: urlRegreso() })); },
    cambiarClave(clave) { return ejecutar(sb.auth.updateUser({ password: clave })); },
    salir() { return ejecutar(sb.auth.signOut()); }
  };

  /* ---------- Traducción entre la base (columnas CLI_, PRD_, PED_...) y la interfaz ---------- */
  const mapear = (r, fn) => (r.error || !r.datos ? r : { datos: Array.isArray(r.datos) ? r.datos.map(fn) : fn(r.datos) });
  const codigoPedido = (numero, fecha) => `AX-${new Date(fecha).getFullYear()}-${String(numero).padStart(5, '0')}`;
  const aCliente = (c) => ({ id: c.cli_usuario, cedula: c.cli_cedula, nombres: c.cli_nombres, apellidos: c.cli_apellidos, telefono: c.cli_telefono, correo: c.cli_correo, creado_en: c.cli_fecha_registro });
  const aTarjeta = (t) => ({ id: t.mpa_codigo, marca: t.mpa_marca, ultimos4: t.mpa_ultimos4, titular: t.mpa_titular, mes_vence: t.mpa_mes_vence, anio_vence: t.mpa_anio_vence });
  const CAMPOS_PEDIDO = 'ped_numero, ped_estado, ped_subtotal, ped_iva, ped_costo_envio, ped_total, ped_fecha, ped_entrega, ped_ciudad, ped_direccion, ped_referencia, ped_codigo_retiro, ped_hora_estimada, '
    + 'tienda(tie_nombre, tie_direccion, tie_horario, tie_ciudad), pago(pag_metodo, pag_marca, pag_ultimos4, pag_banco, pag_referencia, pag_monto, pag_fecha, pag_estado), '
    + 'detalle_pedido(prd_codigo, dpe_talla, dpe_cantidad, dpe_precio_unitario)';
  const textoDePago = (g) => (!g ? 'Sin registro de pago' : g.pag_metodo === 'Tarjeta' ? `Tarjeta ${g.pag_marca} •••• ${g.pag_ultimos4}` : `Transferencia desde ${g.pag_banco} · comprobante ${g.pag_referencia}`);
  const aPedido = (p) => {
    const g = Array.isArray(p.pago) ? p.pago[0] : p.pago;
    const c = p.cliente;
    return {
      id: p.ped_numero, numero: codigoPedido(p.ped_numero, p.ped_fecha), estado: p.ped_estado,
      subtotal: p.ped_subtotal, iva: p.ped_iva, costoEnvio: Number(p.ped_costo_envio || 0), total: p.ped_total, creado_en: p.ped_fecha,
      entrega: p.ped_entrega || 'Retiro', ciudad: p.ped_ciudad, direccion: p.ped_direccion, referencia: p.ped_referencia,
      codigoRetiro: p.ped_codigo_retiro, horaEstimada: p.ped_hora_estimada,
      tiendas: p.tienda ? { nombre: p.tienda.tie_nombre, direccion: p.tienda.tie_direccion, horario: p.tienda.tie_horario, ciudad: p.tienda.tie_ciudad } : null,
      pago: g ? { metodo: g.pag_metodo, estado: g.pag_estado, fecha: g.pag_fecha, monto: g.pag_monto } : null,
      pagoTexto: textoDePago(g),
      cliente: c ? { id: c.cli_usuario, cedula: c.cli_cedula, nombres: c.cli_nombres, apellidos: c.cli_apellidos, telefono: c.cli_telefono, correo: c.cli_correo } : null,
      detalle_pedido: (p.detalle_pedido || []).map((d) => ({ producto_id: d.prd_codigo, talla: d.dpe_talla === 'U' ? null : d.dpe_talla, cantidad: d.dpe_cantidad, precio_unitario: d.dpe_precio_unitario }))
    };
  };
  const SLUG_CATEGORIA = { 1: 'calzado', 2: 'tecnologia', 3: 'entrenamiento' };
  const lineas = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const aProducto = (p) => ({
    id: p.prd_codigo, codigo: p.prd_codigo, categoria: SLUG_CATEGORIA[p.cat_codigo] || 'entrenamiento', cat_codigo: p.cat_codigo,
    nombre: p.prd_nombre, descripcion: p.prd_descripcion, publico: p.prd_publico,
    precio: p.prd_precio, activo: p.prd_activo, usa_talla: p.prd_usa_talla, etiqueta: p.prd_etiqueta || '',
    caracteristicas: lineas(p.prd_caracteristicas),
    ficha: lineas(p.prd_ficha).map((l) => { const i = l.indexOf(':'); return i > 0 ? [l.slice(0, i).trim(), l.slice(i + 1).trim()] : [l, '']; }),
    producto_tallas: (p.producto_talla || []).map((t) => ({ talla: t.pta_talla, stock: t.pta_stock })),
    imagenes: (p.producto_imagen || []).slice().sort((x, y) => x.pim_orden - y.pim_orden).map((i) => ({ orden: i.pim_orden, url: i.pim_url, descripcion: i.pim_descripcion }))
  });
  const aTienda = (t) => ({ id: t.tie_codigo, nombre: t.tie_nombre, direccion: t.tie_direccion, ciudad: t.tie_ciudad, horario: t.tie_horario });
  const aResena = (r) => ({ id: r.prd_codigo, mia: !!r.es_mia, autor: r.autor, estrellas: r.res_estrellas, comentario: r.res_comentario, creado_en: r.res_fecha });

  /* ---------- Catálogo ---------- */
  const catalogo = {
    async productos() {
      const r = await ejecutar(sb.from('producto').select('prd_codigo, cat_codigo, prd_nombre, prd_descripcion, prd_publico, prd_precio, prd_activo, prd_usa_talla, prd_etiqueta, prd_caracteristicas, prd_ficha, producto_talla(pta_talla, pta_stock), producto_imagen(pim_orden, pim_url, pim_descripcion)'));
      return mapear(r, aProducto);
    },
    async calificaciones() {
      const r = await ejecutar(sb.from('vista_calificaciones').select('prd_codigo, promedio, opiniones'));
      return mapear(r, (c) => ({ producto_id: c.prd_codigo, promedio: c.promedio, opiniones: c.opiniones }));
    },
    async tiendas() { return mapear(await ejecutar(sb.from('tienda').select('*').order('tie_codigo')), aTienda); }
  };

  /* ---------- Cliente ---------- */
  const cliente = {
    async cedulaRegistrada(cedula) { const r = await ejecutar(sb.rpc('cedula_registrada', { p_cedula: cedula })); return r.error ? r : { datos: !!r.datos }; },
    async correoRegistrado(correo) { const r = await ejecutar(sb.rpc('correo_registrado', { p_correo: correo })); return r.error ? r : { datos: !!r.datos }; },
    async perfil(usuario) { return mapear(await ejecutar(sb.from('cliente').select('*').eq('cli_usuario', usuario).maybeSingle()), aCliente); },
    async crear(d) {
      return mapear(await ejecutar(sb.from('cliente').insert({ cli_cedula: d.cedula, cli_usuario: d.id, cli_nombres: d.nombres, cli_apellidos: d.apellidos, cli_telefono: d.telefono, cli_correo: d.correo }).select().single()), aCliente);
    },
    async actualizar(usuario, d) {
      return mapear(await ejecutar(sb.from('cliente').update({ cli_nombres: d.nombres, cli_apellidos: d.apellidos, cli_telefono: d.telefono }).eq('cli_usuario', usuario).select().single()), aCliente);
    },
    async esAdmin() { const r = await ejecutar(sb.rpc('es_admin')); return !r.error && r.datos === true; },

    async tarjetas() { return mapear(await ejecutar(sb.from('metodo_pago').select('*').order('mpa_codigo', { ascending: false })), aTarjeta); },
    async guardarTarjeta(d) {
      const fila = { cli_cedula: d.cedula, mpa_marca: d.marca, mpa_ultimos4: d.ultimos4, mpa_titular: d.titular, mpa_mes_vence: d.mes_vence, mpa_anio_vence: d.anio_vence };
      const existente = await ejecutar(sb.from('metodo_pago').select('mpa_codigo').match(fila).maybeSingle());
      if (existente.error) return existente;
      if (existente.datos) return { datos: { id: existente.datos.mpa_codigo } };
      return mapear(await ejecutar(sb.from('metodo_pago').insert(fila).select('mpa_codigo').single()), (t) => ({ id: t.mpa_codigo }));
    },
    borrarTarjeta(id) { return ejecutar(sb.from('metodo_pago').delete().eq('mpa_codigo', id)); }
  };

  /* ---------- Pedidos ---------- */
  const pedidos = {
    // "clave" identifica el intento de pago: si se reenvía (doble clic, recarga, red lenta) la base devuelve el mismo pedido
    async crear({ items, clave, entrega, pago }) {
      const r = await ejecutar(sb.rpc('crear_pedido', {
        p_items: items, p_clave: clave, p_entrega: entrega.tipo, p_tienda: entrega.tipo === 'Retiro' ? entrega.tienda : null,
        p_ciudad: entrega.ciudad || null, p_direccion: entrega.direccion || null, p_referencia: entrega.referencia || null, p_pago: pago
      }));
      return mapear(r, (f) => {
        const x = Array.isArray(f) ? f[0] : f;
        return { id: x.ped_numero, numero: x.ped_codigo, total: x.ped_total, codigoRetiro: x.ped_codigo_retiro, horaEstimada: x.ped_hora_estimada };
      });
    },
    async nuevos() { const r = await ejecutar(sb.rpc('pedidos_nuevos')); return r.error ? 0 : Number(r.datos) || 0; },
    async mios() {
      const r = await ejecutar(sb.from('pedido').select(CAMPOS_PEDIDO).order('ped_fecha', { ascending: false }));
      return mapear(r, aPedido);
    },
    /* Un pedido con todos sus datos (orden de pedido y seguimiento). El cliente solo ve los suyos; el administrador, todos */
    async uno(numero) {
      const r = await ejecutar(sb.from('pedido').select(CAMPOS_PEDIDO + ', cliente(cli_usuario, cli_cedula, cli_nombres, cli_apellidos, cli_telefono, cli_correo)').eq('ped_numero', numero).maybeSingle());
      return mapear(r, aPedido);
    },
    /* Verifica en la base si el cliente compró este producto (cualquier pedido que no esté cancelado) */
    async compro(codigo) {
      const r = await ejecutar(sb.from('detalle_pedido').select('ped_numero, pedido!inner(ped_estado, ped_fecha)')
        .eq('prd_codigo', codigo).neq('pedido.ped_estado', 'Cancelado').order('ped_numero', { ascending: false }).limit(1));
      if (r.error) return r;
      const f = r.datos[0];
      return { datos: f ? codigoPedido(f.ped_numero, f.pedido.ped_fecha) : null };
    },
    async todos() {
      return mapear(await ejecutar(sb.rpc('pedidos_admin')), (p) => ({
        id: p.ped_numero, numero: p.ped_codigo, estado: p.ped_estado, total: p.ped_total, creado_en: p.ped_fecha,
        cliente: p.cliente, correo: p.cli_correo, telefono: p.cli_telefono, cedula: p.cli_cedula, tienda: p.tie_nombre, horario: p.tie_horario, productos: p.productos,
        entrega: p.ped_entrega || 'Retiro', ciudad: p.ped_ciudad, direccion: p.ped_direccion, referencia: p.ped_referencia,
        codigoRetiro: p.ped_codigo_retiro, horaEstimada: p.ped_hora_estimada, pagoTexto: p.pago || ''
      }));
    },
    cambiarEstado(numero, estado) { return ejecutar(sb.rpc('cambiar_estado_pedido', { p_numero: numero, p_estado: estado })); }
  };

  /* ---------- Administrador: productos y pagos ---------- */
  const CATEGORIA_CODIGO = { calzado: 1, tecnologia: 2, entrenamiento: 3 };
  const admin = {
    activar(codigo, activo) { return ejecutar(sb.from('producto').update({ prd_activo: activo }).eq('prd_codigo', codigo)); },
    async borrarProducto(codigo) {
      const r = await ejecutar(sb.from('producto').delete().eq('prd_codigo', codigo).select('prd_codigo'));
      if (r.error) return r;
      return r.datos && r.datos.length ? r : { error: 'No se pudo borrar el producto.' };
    },
    /* Crea o actualiza el producto con sus tallas y fotos */
    async guardarProducto(d, nuevo) {
      const fila = {
        prd_codigo: d.codigo, cat_codigo: CATEGORIA_CODIGO[d.categoria], prd_nombre: d.nombre, prd_descripcion: d.descripcion,
        prd_publico: d.publico, prd_precio: d.precio, prd_usa_talla: d.usaTalla, prd_activo: d.activo,
        prd_etiqueta: d.etiqueta || null, prd_caracteristicas: d.caracteristicas || null, prd_ficha: d.ficha || null
      };
      const rp = nuevo ? await ejecutar(sb.from('producto').insert(fila)) : await ejecutar(sb.from('producto').update(fila).eq('prd_codigo', d.codigo));
      if (rp.error) return rp;
      // Tallas: se guardan las nuevas y se quitan las que ya no están
      const rt = await ejecutar(sb.from('producto_talla').upsert(d.tallas.map((t) => ({ prd_codigo: d.codigo, pta_talla: t.talla, pta_stock: t.stock }))));
      if (rt.error) return rt;
      const nombres = d.tallas.map((t) => t.talla);
      const rq = await ejecutar(sb.from('producto_talla').delete().eq('prd_codigo', d.codigo).not('pta_talla', 'in', `(${nombres.map((n) => `"${n.replace(/"/g, '')}"`).join(',')})`));
      if (rq.error) return rq;
      // Fotos: se reemplazan en el orden del formulario
      const rb = await ejecutar(sb.from('producto_imagen').delete().eq('prd_codigo', d.codigo));
      if (rb.error) return rb;
      if (d.fotos.length) {
        const ri = await ejecutar(sb.from('producto_imagen').insert(d.fotos.slice(0, 6).map((f, i) => ({ prd_codigo: d.codigo, pim_orden: i + 1, pim_url: f.url, pim_descripcion: f.descripcion.slice(0, 80) }))));
        if (ri.error) return ri;
      }
      return { datos: true };
    },
    async subirFoto(archivo, codigo) {
      if (!sb) return { error: 'La tienda no pudo conectarse con el servidor.' };
      const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[archivo.type] || 'jpg';
      const ruta = `${codigo}/${Date.now()}.${ext}`;
      const r = await ejecutar(sb.storage.from('productos').upload(ruta, archivo, { contentType: archivo.type, upsert: false }));
      if (r.error) return r;
      return { datos: sb.storage.from('productos').getPublicUrl(ruta).data.publicUrl };
    },
    async pagos() {
      const r = await ejecutar(sb.from('pago')
        .select('pag_codigo, ped_numero, pag_metodo, pag_marca, pag_ultimos4, pag_banco, pag_referencia, pag_monto, pag_fecha, pag_estado, pedido(ped_fecha, cliente(cli_nombres, cli_apellidos))')
        .order('pag_fecha', { ascending: false }).limit(500));
      return mapear(r, (g) => ({
        codigo: g.pag_codigo, pedido: g.ped_numero, numeroPedido: codigoPedido(g.ped_numero, g.pedido ? g.pedido.ped_fecha : g.pag_fecha),
        cliente: g.pedido && g.pedido.cliente ? `${g.pedido.cliente.cli_nombres} ${g.pedido.cliente.cli_apellidos}` : '',
        metodo: g.pag_metodo, detalle: g.pag_metodo === 'Tarjeta' ? `${g.pag_marca} •••• ${g.pag_ultimos4}` : `${g.pag_banco} · comprobante ${g.pag_referencia}`,
        monto: g.pag_monto, fecha: g.pag_fecha, estado: g.pag_estado
      }));
    }
  };

  /* ---------- Reseñas ---------- */
  const resenas = {
    /* Reseñas que escribió el cliente con sesión abierta (para mostrarlas en Mis pedidos) */
    async mias() {
      return mapear(await ejecutar(sb.from('vista_resenas').select('*').eq('es_mia', true)), aResena);
    },
    async deProducto(codigo) {
      return mapear(await ejecutar(sb.from('vista_resenas').select('*').eq('prd_codigo', codigo).order('res_fecha', { ascending: false }).limit(50)), aResena);
    },
    /* Una reseña por cliente y producto: si ya existe se edita, si no se crea */
    async guardar(existe, d) {
      const r = existe
        ? await ejecutar(sb.from('resena').update({ res_estrellas: d.estrellas, res_comentario: d.comentario }).eq('cli_cedula', d.cedula).eq('prd_codigo', d.producto))
        : await ejecutar(sb.from('resena').insert({ cli_cedula: d.cedula, prd_codigo: d.producto, res_estrellas: d.estrellas, res_comentario: d.comentario }));
      return r.error ? r : { datos: true };
    },
    borrar(cedula, producto) { return ejecutar(sb.from('resena').delete().eq('cli_cedula', cedula).eq('prd_codigo', producto)); }
  };

  /* ---------- Correos (EmailJS) ---------- */
  const enviar = async (plantilla, datos) => {
    if (!(window.emailjs && CONFIG.emailjs.servicio && plantilla && CONFIG.emailjs.clavePublica)) return { error: 'El envío de correos no está configurado.' };
    try {
      await window.emailjs.send(CONFIG.emailjs.servicio, plantilla, datos, { publicKey: CONFIG.emailjs.clavePublica });
      return { datos: true };
    } catch (e) {
      return { error: 'No se pudo enviar el correo' + (e && e.text ? ` (${e.text})` : '') + '.' };
    }
  };
  const correo = {
    configurado() { return !!(window.emailjs && CONFIG.emailjs.servicio && CONFIG.emailjs.plantillaCliente && CONFIG.emailjs.clavePublica); },
    /* Al cliente, apenas paga: confirma que su pedido se recibió */
    compraConfirmada(p) {
      const base = location.origin + location.pathname.replace(/[^/]*$/, '');
      const domicilio = p.entrega === 'Domicilio';
      return enviar(CONFIG.emailjs.plantillaCliente, {
        to_email: p.correo, nombre: p.nombre, numero: p.numero, tienda: p.tienda, horario: p.horario, total: Number(p.total).toFixed(2),
        asunto: `Recibimos tu pedido ${p.numero} · código ${p.codigo}`,
        mensaje: `Gracias por tu compra. Tu pago fue aprobado (${p.pagoTexto}, pago simulado). `
          + (domicilio ? `Tu pedido sale de la tienda y llega a tu dirección en ${ENTREGA.domicilio}. ` : `Tu pedido estará listo para retirar en ${ENTREGA.retiro}. `)
          + `Tu código de ${domicilio ? 'entrega' : 'retiro'} es ${p.codigo}: preséntalo con tu cédula. `
          + `Mira tu orden de pedido aquí: ${base}orden.html?pedido=${parseInt(String(p.numero).split('-').pop(), 10)}`
      });
    },
    /* Al cliente, cada vez que el administrador cambia el estado de su pedido */
    pedidoActualizado(p, estadoNuevo) {
      const domicilio = p.entrega === 'Domicilio';
      const base = location.origin + location.pathname.replace(/[^/]*$/, '');
      const id = parseInt(String(p.numero).split('-').pop(), 10);
      const codigo = p.codigoRetiro ? ` y tu código ${p.codigoRetiro}` : '';
      const textos = {
        Preparando: [`Estamos preparando tu pedido ${p.numero}`,
          `Ya empezamos a preparar tu pedido ${p.numero}. ` + (domicilio ? `Sale hacia tu dirección en pocos minutos.` : `Estará listo para retirar en menos de ${ENTREGA.retiro}.`)],
        Listo: domicilio
          ? [`Tu pedido ${p.numero} va en camino`, `Tu pedido ${p.numero} ya salió de la tienda con nuestro repartidor. Ten a mano tu cédula${codigo}.`]
          : [`Tu pedido ${p.numero} está listo para retirar`, `Tu pedido ${p.numero} ya está listo. Retíralo en ${p.tienda} con tu cédula${codigo}.`],
        Retirado: domicilio
          ? [`Tu pedido ${p.numero} fue entregado`, `Entregamos tu pedido ${p.numero}. ¡Gracias por comprar en ATHLETIX! Puedes dejar tu reseña desde Mis pedidos.`]
          : [`Retiraste tu pedido ${p.numero}`, `Registramos el retiro de tu pedido ${p.numero}. ¡Gracias por comprar en ATHLETIX! Puedes dejar tu reseña desde Mis pedidos.`],
        Cancelado: [`Tu pedido ${p.numero} fue cancelado`, `Tu pedido ${p.numero} fue cancelado y el pago simulado quedó anulado. Si tienes dudas, escríbenos desde la sección Ayuda.`]
      };
      const [asunto, mensaje] = textos[estadoNuevo] || [];
      if (!asunto) return Promise.resolve({});
      return enviar(CONFIG.emailjs.plantillaCliente, {
        to_email: p.correo, nombre: p.cliente, numero: p.numero, total: Number(p.total).toFixed(2),
        tienda: domicilio ? `Envío a domicilio: ${p.direccion}, ${p.ciudad}` : p.tienda,
        horario: domicilio ? `Llega en ${ENTREGA.domicilio}` : p.horario,
        asunto, mensaje: mensaje + ` Sigue tu pedido aquí: ${base}seguimiento.html?pedido=${id}`
      }).then((r) => (r.error ? { error: r.error + ' El estado sí se guardó.' } : r));
    },
    /* Al administrador, cada vez que un cliente hace un pedido */
    nuevoPedido(p) {
      return enviar(CONFIG.emailjs.plantillaNuevoPedido, {
        numero: p.numero, cliente: p.cliente, cedula: p.cedula, correo_cliente: p.correo, telefono: p.telefono,
        tienda: p.tienda, productos: p.productos, total: Number(p.total).toFixed(2)
      });
    }
  };

  return { disponible, auth, catalogo, cliente, pedidos, resenas, correo, admin, traducir };
})();
