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
    if (m.includes('clientes_cedula_key') || (m.includes('duplicate') && m.includes('cedula'))) return 'Ya existe una cuenta con esta cédula.';
    if (m.includes('clientes_correo_key')) return 'Ya existe una cuenta con este correo.';
    if (m.includes('cedula_valida') || m.includes('clientes_cedula_check')) return 'La cédula no es válida.';
    if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes')) return 'Hiciste demasiados intentos seguidos. Espera un minuto y vuelve a intentarlo.';
    if (m.includes('password should be') || m.includes('weak')) return 'La contraseña es muy débil. Usa al menos 8 caracteres con letras y números.';
    if (m.includes('same password') || m.includes('should be different')) return 'La nueva contraseña debe ser diferente a la actual.';
    if (m.includes('jwt') || m.includes('not authenticated') || m.includes('inicia sesión') || m.includes('iniciar sesión')) return 'Tu sesión terminó. Vuelve a iniciar sesión.';
    if (m.includes('metodos_pago_cliente_id_marca_ultimos4')) return 'Ya tienes guardada esta tarjeta.';
    if (m.includes('resenas_cliente_id_producto_id_key')) return 'Ya dejaste una reseña de este producto. Puedes editarla.';
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

  const urlRegreso = (ruta = '') => location.origin + location.pathname + ruta;

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

  /* ---------- Catálogo ---------- */
  const catalogo = {
    productos() { return ejecutar(sb.from('productos').select('id, codigo, precio, activo, usa_talla, producto_tallas(talla, stock)')); },
    calificaciones() { return ejecutar(sb.from('vista_calificaciones').select('producto_id, promedio, opiniones')); },
    tiendas() { return ejecutar(sb.from('tiendas').select('id, nombre, direccion, ciudad, horario').order('id')); }
  };

  /* ---------- Cliente ---------- */
  const cliente = {
    async cedulaRegistrada(cedula) { const r = await ejecutar(sb.rpc('cedula_registrada', { p_cedula: cedula })); return r.error ? r : { datos: !!r.datos }; },
    async correoRegistrado(correo) { const r = await ejecutar(sb.rpc('correo_registrado', { p_correo: correo })); return r.error ? r : { datos: !!r.datos }; },
    async perfil(id) { return ejecutar(sb.from('clientes').select('id, cedula, nombres, apellidos, telefono, correo, creado_en').eq('id', id).maybeSingle()); },
    crear(datos) { return ejecutar(sb.from('clientes').insert(datos).select().single()); },
    actualizar(id, datos) { return ejecutar(sb.from('clientes').update(datos).eq('id', id).select().single()); },
    async esAdmin() { const r = await ejecutar(sb.rpc('es_admin')); return !r.error && r.datos === true; },


    tarjetas() { return ejecutar(sb.from('metodos_pago').select('*').order('id', { ascending: false })); },
    async guardarTarjeta(datos) {
      const existente = await ejecutar(sb.from('metodos_pago').select('id')
        .eq('cliente_id', datos.cliente_id).eq('marca', datos.marca).eq('ultimos4', datos.ultimos4)
        .eq('mes_vence', datos.mes_vence).eq('anio_vence', datos.anio_vence).maybeSingle());
      if (existente.error) return existente;
      if (existente.datos) return existente;
      return ejecutar(sb.from('metodos_pago').insert(datos).select('id').single());
    },
    borrarTarjeta(id) { return ejecutar(sb.from('metodos_pago').delete().eq('id', id)); }
  };

  /* ---------- Pedidos ---------- */
  const pedidos = {
    // "clave" identifica el intento de pago: si se reenvía (doble clic, recarga, red lenta) la base devuelve el mismo pedido
    async crear(tiendaId, metodoPagoId, items, clave) {
      const r = await ejecutar(sb.rpc('crear_pedido', { p_tienda: tiendaId, p_metodo_pago: metodoPagoId, p_items: items, p_clave: clave }));
      // Compatibilidad: si la base todavía no tiene la versión con clave, se usa la anterior
      if (r.error && r.tecnico && r.tecnico.code === 'PGRST202') {
        return ejecutar(sb.rpc('crear_pedido', { p_tienda: tiendaId, p_metodo_pago: metodoPagoId, p_items: items }));
      }
      return r;
    },
    async nuevos() { const r = await ejecutar(sb.rpc('pedidos_nuevos')); return r.error ? 0 : Number(r.datos) || 0; },
    mios() {
      return ejecutar(sb.from('pedidos')
        .select('id, numero, estado, subtotal, iva, total, creado_en, actualizado_en, tiendas(nombre, direccion, horario), metodos_pago(marca, ultimos4), detalle_pedido(producto_id, talla, cantidad, precio_unitario)')
        .order('creado_en', { ascending: false }));
    },
    async comproYRetiro(productoId) {
      const r = await ejecutar(sb.from('detalle_pedido').select('id, pedidos!inner(estado)')
        .eq('producto_id', productoId).eq('pedidos.estado', 'Retirado').limit(1));
      return r.error ? r : { datos: r.datos.length > 0 };
    },
    todos() { return ejecutar(sb.rpc('pedidos_admin')); },
    cambiarEstado(id, estado) { return ejecutar(sb.rpc('cambiar_estado_pedido', { p_pedido: id, p_estado: estado })); }
  };

  /* ---------- Reseñas ---------- */
  const resenas = {
    deProducto(productoId) {
      return ejecutar(sb.from('resenas').select('id, cliente_id, autor, estrellas, comentario, creado_en')
        .eq('producto_id', productoId).order('creado_en', { ascending: false }).limit(50));
    },
    guardar(id, datos) {
      return id
        ? ejecutar(sb.from('resenas').update({ estrellas: datos.estrellas, comentario: datos.comentario }).eq('id', id).select().single())
        : ejecutar(sb.from('resenas').insert(datos).select().single());
    },
    borrar(id) { return ejecutar(sb.from('resenas').delete().eq('id', id)); }
  };

  /* ---------- Correo de "pedido listo" ---------- */
  const correo = {
    configurado() { return !!(window.emailjs && CONFIG.emailjs.servicio && CONFIG.emailjs.plantillaPedidoListo && CONFIG.emailjs.clavePublica); },
    async pedidoListo(p) {
      if (!correo.configurado()) return { error: 'Falta configurar la plantilla de EmailJS (Template ID).' };
      try {
        await window.emailjs.send(CONFIG.emailjs.servicio, CONFIG.emailjs.plantillaPedidoListo, {
          to_email: p.correo, nombre: p.cliente, numero: p.numero, tienda: p.tienda, horario: p.horario, total: Number(p.total).toFixed(2)
        }, { publicKey: CONFIG.emailjs.clavePublica });
        return { datos: true };
      } catch (e) {
        return { error: 'No se pudo enviar el correo' + (e && e.text ? ` (${e.text})` : '') + '. El estado sí se guardó.' };
      }
    },
    /* Aviso al administrador: llega a su correo cada vez que un cliente hace un pedido */
    async nuevoPedido(p) {
      if (!(window.emailjs && CONFIG.emailjs.plantillaNuevoPedido)) return { error: 'sin plantilla' };
      try {
        await window.emailjs.send(CONFIG.emailjs.servicio, CONFIG.emailjs.plantillaNuevoPedido, {
          numero: p.numero, cliente: p.cliente, cedula: p.cedula, correo_cliente: p.correo, telefono: p.telefono,
          tienda: p.tienda, productos: p.productos, total: Number(p.total).toFixed(2)
        }, { publicKey: CONFIG.emailjs.clavePublica });
        return { datos: true };
      } catch (e) { return { error: 'No se pudo avisar al administrador' }; }
    }
  };

  return { disponible, auth, catalogo, cliente, pedidos, resenas, correo, traducir };
})();
