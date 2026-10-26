/* ATHLETIX · Validaciones de datos (sin dependencias, se pueden probar por separado) */
'use strict';

const Validar = (() => {
  const LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '\-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;

  /* Cédula ecuatoriana: 10 dígitos, provincia 01-24 o 30, tercer dígito 0-5 y dígito verificador (módulo 10) */
  function cedula(valor) {
    const c = String(valor || '').trim();
    if (!c) return 'Escribe tu número de cédula.';
    if (!/^\d{10}$/.test(c)) return 'La cédula debe tener 10 números.';
    const provincia = Number(c.slice(0, 2));
    if (provincia < 1 || (provincia > 24 && provincia !== 30)) return 'Los dos primeros números no corresponden a ninguna provincia.';
    if (Number(c[2]) > 5) return 'El tercer número de una cédula de persona debe estar entre 0 y 5.';
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let d = Number(c[i]);
      if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
      suma += d;
    }
    const verificador = (10 - (suma % 10)) % 10;
    if (verificador !== Number(c[9])) return 'La cédula no es válida. Revisa que esté bien escrita.';
    return '';
  }

  function nombre(valor, campo) {
    const v = String(valor || '').trim().replace(/\s+/g, ' ');
    if (!v) return `Escribe tu ${campo}.`;
    if (v.length < 2) return `Tu ${campo} debe tener al menos 2 letras.`;
    if (v.length > 60) return `Tu ${campo} puede tener hasta 60 letras.`;
    if (!LETRAS.test(v)) return `Tu ${campo} solo puede tener letras y espacios.`;
    return '';
  }

  function telefono(valor) {
    const t = String(valor || '').trim();
    if (!t) return 'Escribe tu número de celular.';
    if (!/^\d{10}$/.test(t)) return 'El celular debe tener 10 números.';
    if (!t.startsWith('09')) return 'El celular debe empezar con 09.';
    return '';
  }

  function correo(valor) {
    const c = String(valor || '').trim();
    if (!c) return 'Escribe tu correo electrónico.';
    if (c.length > 120) return 'El correo es demasiado largo.';
    if (!/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)*\.[A-Za-z]{2,}$/.test(c) || c.includes('..')) {
      return 'Escribe un correo completo, por ejemplo nombre@gmail.com.';
    }
    const dominio = c.split('@')[1].toLowerCase();
    const sugerencias = { 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'outlok.com': 'outlook.com', 'yaho.com': 'yahoo.com' };
    if (sugerencias[dominio]) return `¿Quisiste decir ${c.split('@')[0]}@${sugerencias[dominio]}?`;
    return '';
  }

  function clave(valor) {
    const v = String(valor || '');
    if (!v) return 'Escribe una contraseña.';
    if (v.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (v.length > 72) return 'La contraseña puede tener hasta 72 caracteres.';
    if (!/[A-Za-zÁÉÍÓÚÑáéíóúñ]/.test(v) || !/\d/.test(v)) return 'La contraseña debe tener letras y números.';
    return '';
  }

  /* ---------- Tarjetas ---------- */
  // Algoritmo de Luhn: el que usan los bancos para detectar números mal escritos
  function luhn(numero) {
    let suma = 0;
    for (let i = 0; i < numero.length; i++) {
      let d = Number(numero[numero.length - 1 - i]);
      if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
      suma += d;
    }
    return suma % 10 === 0;
  }

  function marcaTarjeta(numero) {
    if (/^4/.test(numero)) return 'Visa';
    const dos = Number(numero.slice(0, 2));
    const cuatro = Number(numero.slice(0, 4));
    if ((dos >= 51 && dos <= 55) || (cuatro >= 2221 && cuatro <= 2720)) return 'Mastercard';
    return '';
  }

  // Tarjetas de prueba oficiales (Stripe y Visa/Mastercard para desarrolladores)
  const TARJETAS_PRUEBA = {
    '4242424242424242': 'aprobada', '4000056655665556': 'aprobada', '4111111111111111': 'aprobada', '4012888888881881': 'aprobada',
    '5555555555554444': 'aprobada', '5200828282828210': 'aprobada', '2223003122003222': 'aprobada', '5105105105105100': 'aprobada',
    '4000000000000002': 'rechazada', '4000000000009995': 'sin fondos'
  };

  function tarjeta(valor) {
    const n = String(valor || '').replace(/\D/g, '');
    if (!n) return 'Escribe el número de la tarjeta.';
    if (n.length !== 16) return 'El número de la tarjeta debe tener 16 dígitos.';
    if (!marcaTarjeta(n)) return 'Solo aceptamos tarjetas Visa o Mastercard.';
    if (!luhn(n)) return 'El número de la tarjeta no es válido. Revisa que esté bien escrito.';
    if (!TARJETAS_PRUEBA[n]) return 'Esta es una tienda académica: usa una de las tarjetas de prueba que aparecen abajo. No uses tu tarjeta real.';
    return '';
  }

  function resultadoTarjeta(valor) {
    return TARJETAS_PRUEBA[String(valor || '').replace(/\D/g, '')] || 'aprobada';
  }

  function vencimiento(valor, hoy = new Date()) {
    const v = String(valor || '').trim();
    if (!v) return 'Escribe la fecha de vencimiento.';
    const m = /^(\d{2})\/(\d{2})$/.exec(v);
    if (!m) return 'Escribe la fecha como MM/AA, por ejemplo 08/29.';
    const mes = Number(m[1]); const anio = 2000 + Number(m[2]);
    if (mes < 1 || mes > 12) return 'El mes debe estar entre 01 y 12.';
    if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) return 'La tarjeta está vencida. Usa una tarjeta vigente.';
    if (anio > hoy.getFullYear() + 15) return 'Revisa el año de vencimiento.';
    return '';
  }

  function cvv(valor) {
    const v = String(valor || '').trim();
    if (!v) return 'Escribe el CVV.';
    if (!/^\d{3}$/.test(v)) return 'El CVV debe tener 3 números.';
    return '';
  }

  function titular(valor) {
    return nombre(valor, 'nombre').replace('Tu nombre', 'El nombre del titular').replace('tu nombre', 'el nombre del titular');
  }

  function texto(valor, { campo, min = 1, max = 120 }) {
    const v = String(valor || '').trim();
    if (v.length < min) return min <= 1 ? `Escribe ${campo}.` : `${campo[0].toUpperCase() + campo.slice(1)} debe tener al menos ${min} caracteres.`;
    if (v.length > max) return `${campo[0].toUpperCase() + campo.slice(1)} puede tener hasta ${max} caracteres.`;
    return '';
  }

  return { cedula, nombre, telefono, correo, clave, tarjeta, resultadoTarjeta, marcaTarjeta, luhn, vencimiento, cvv, titular, texto, TARJETAS_PRUEBA };
})();

if (typeof module !== 'undefined') module.exports = Validar;
