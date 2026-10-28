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
  const aTienda = (t) => ({ id: t.tie_codigo, nombre: t.tie_nombre, direccion: t.tie_direccion, ciudad: t.tie_ciudad, horario: t.tie_horario });
  const aResena = (r) => ({ id: r.prd_codigo, mia: !!r.es_mia, autor: r.autor, estrellas: r.res_estrellas, comentario: r.res_comentario, creado_en: r.res_fecha });

  /* ---------- Catálogo ---------- */
  const catalogo = {
    async productos() {
      const r = await ejecutar(sb.from('producto').select('prd_codigo, prd_precio, prd_activo, prd_usa_talla, producto_talla(pta_talla, pta_stock)'));
      return mapear(r, (p) => ({ id: p.prd_codigo, codigo: p.prd_codigo, precio: p.prd_precio, activo: p.prd_activo, usa_talla: p.prd_usa_talla,
        producto_tallas: (p.producto_talla || []).map((t) => ({ talla: t.pta_talla, stock: t.pta_stock })) }));
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
    async crear(tiendaId, tarjetaId, items, clave) {
      const r = await ejecutar(sb.rpc('crear_pedido', { p_tienda: tiendaId, p_metodo_pago: tarjetaId, p_items: items, p_clave: clave }));
      return mapear(r, (f) => ({ numero: f.ped_codigo, total: f.ped_total }));
    },
    async nuevos() { const r = await ejecutar(sb.rpc('pedidos_nuevos')); return r.error ? 0 : Number(r.datos) || 0; },
    async mios() {
      const r = await ejecutar(sb.from('pedido')
        .select('ped_numero, ped_estado, ped_subtotal, ped_iva, ped_total, ped_fecha, tienda(tie_nombre, tie_direccion, tie_horario), metodo_pago(mpa_marca, mpa_ultimos4), detalle_pedido(prd_codigo, dpe_talla, dpe_cantidad, dpe_precio_unitario)')
        .order('ped_fecha', { ascending: false }));
      return mapear(r, (p) => {
        const pago = p.metodo_pago;
        return {
          id: p.ped_numero, numero: codigoPedido(p.ped_numero, p.ped_fecha), estado: p.ped_estado,
          subtotal: p.ped_subtotal, iva: p.ped_iva, total: p.ped_total, creado_en: p.ped_fecha,
          tiendas: p.tienda ? { nombre: p.tienda.tie_nombre, direccion: p.tienda.tie_direccion, horario: p.tienda.tie_horario } : null,
          metodos_pago: pago ? { marca: pago.mpa_marca, ultimos4: pago.mpa_ultimos4 } : null,
          detalle_pedido: (p.detalle_pedido || []).map((d) => ({ producto_id: d.prd_codigo, talla: d.dpe_talla === 'U' ? null : d.dpe_talla, cantidad: d.dpe_cantidad, precio_unitario: d.dpe_precio_unitario }))
        };
      });
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
        cliente: p.cliente, correo: p.cli_correo, telefono: p.cli_telefono, cedula: p.cli_cedula, tienda: p.tie_nombre, horario: p.tie_horario, productos: p.productos
      }));
    },
    cambiarEstado(numero, estado) { return ejecutar(sb.rpc('cambiar_estado_pedido', { p_numero: numero, p_estado: estado })); }
  };

  /* ---------- Reseñas ---------- */
  const resenas = {
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
      return enviar(CONFIG.emailjs.plantillaCliente, {
        to_email: p.correo, nombre: p.nombre, numero: p.numero, tienda: p.tienda, horario: p.horario, total: Number(p.total).toFixed(2),
        asunto: `Recibimos tu pedido ${p.numero}`,
        mensaje: `Gracias por tu compra. Tu pago fue aprobado y ya estamos preparando tu pedido ${p.numero}. Te enviaremos otro correo cuando esté listo para retirar.`
      });
    },
    /* Al cliente, cuando el administrador marca el pedido como "Listo" */
    pedidoListo(p) {
      return enviar(CONFIG.emailjs.plantillaCliente, {
        to_email: p.correo, nombre: p.cliente, numero: p.numero, tienda: p.tienda, horario: p.horario, total: Number(p.total).toFixed(2),
        asunto: `Tu pedido ${p.numero} está listo para retirar`,
        mensaje: `Tu pedido ${p.numero} ya está listo. Puedes retirarlo en la tienda que elegiste.`
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

  return { disponible, auth, catalogo, cliente, pedidos, resenas, correo, traducir };
})();
