/* ATHLETIX · Configuración de servicios externos
   Las claves de este archivo son PÚBLICAS por diseño:
   - La clave "publishable" de Supabase solo permite lo que autorizan las reglas de seguridad (RLS) de la base.
   - La "Public Key" de EmailJS solo permite enviar con las plantillas creadas en tu cuenta. */
'use strict';

const CONFIG = {
  supabase: {
    url: 'https://baisrbbblgwaghqnhsow.supabase.co',
    clave: 'sb_publishable_-VYGAp0knzI8pj_CuJAQHQ_YWE1MT8U'
  },
  emailjs: {
    servicio: 'service_n3b8qkn',
    plantillaPedidoListo: 'template_xgi77wu',
    plantillaNuevoPedido: '', // Template ID del aviso al administrador (template_xxxxxxx)
    clavePublica: 'byyIpSC8iBjJs4sU3'
  },
  // Cambiar a true cuando el proveedor Google esté activado en Supabase (Authentication > Providers)
  googleActivo: false,
  iva: 0.15,
  tiempoEsperaMs: 15000
};

/* Se guarda el fragmento de la URL antes de que Supabase lo procese
   (enlaces de confirmación de correo, recuperación de contraseña o Google) */
window.HASH_INICIAL = location.hash;
