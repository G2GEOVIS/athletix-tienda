// ATHLETIX · Edge Function "correo-compra"
// Envía al cliente el correo de compra con la factura en PDF adjunta, desde el Gmail de la tienda.
// Seguridad: solo la puede llamar un cliente con sesión iniciada, solo para un pedido suyo,
// y el correo siempre va a la dirección de su propia cuenta (nadie puede usarla para escribir a otros).
// Secretos que se configuran en Supabase → Edge Functions → Secrets:
//   GMAIL_USUARIO     correo de Gmail que envía (el de la tienda)
//   GMAIL_CLAVE_APP   contraseña de aplicación de ese Gmail (16 letras)
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';
import nodemailer from 'npm:nodemailer@6.9.16';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
const responder = (cuerpo: unknown, estado = 200) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return responder({ error: 'Método no permitido.' }, 405);

  const usuarioGmail = Deno.env.get('GMAIL_USUARIO');
  const claveGmail = Deno.env.get('GMAIL_CLAVE_APP');
  if (!usuarioGmail || !claveGmail) return responder({ error: 'El correo de la tienda no está configurado.' }, 500);

  const autorizacion = req.headers.get('Authorization') || '';
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY') || 'sb_publishable_-VYGAp0knzI8pj_CuJAQHQ_YWE1MT8U', {
    global: { headers: { Authorization: autorizacion } }
  });
  const { data: { user } } = await supabase.auth.getUser(autorizacion.replace(/^Bearer\s+/i, ''));
  if (!user || !user.email) return responder({ error: 'Inicia sesión para recibir tu factura.' }, 401);

  let datos: { pedido?: number; asunto?: string; html?: string; pdf?: string; archivo?: string };
  try { datos = await req.json(); } catch { return responder({ error: 'Solicitud no válida.' }, 400); }
  const { pedido, asunto, html, pdf, archivo } = datos;
  if (!Number.isInteger(pedido) || !asunto || !html) return responder({ error: 'Faltan datos del pedido.' }, 400);
  if (asunto.length > 200 || html.length > 60000 || (pdf && pdf.length > 3_000_000)) return responder({ error: 'El correo es demasiado grande.' }, 413);

  // Con la sesión del cliente, las reglas RLS solo dejan ver sus propios pedidos
  const { data: fila } = await supabase.from('pedido').select('ped_numero').eq('ped_numero', pedido).maybeSingle();
  if (!fila) return responder({ error: 'No encontramos ese pedido en tu cuenta.' }, 404);

  const adjuntos = [];
  if (pdf) {
    const base64 = pdf.includes(',') ? pdf.slice(pdf.indexOf(',') + 1) : pdf;
    const nombre = /^[\w.\-]{1,80}\.pdf$/.test(archivo || '') ? archivo! : `Factura-${pedido}.pdf`;
    adjuntos.push({ filename: nombre, content: base64, encoding: 'base64', contentType: 'application/pdf' });
  }

  try {
    const transporte = nodemailer.createTransport({
      host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: usuarioGmail, pass: claveGmail }
    });
    await transporte.sendMail({
      from: `"ATHLETIX" <${usuarioGmail}>`, to: user.email, subject: asunto, html, attachments: adjuntos
    });
    return responder({ ok: true });
  } catch (e) {
    console.error(e);
    return responder({ error: 'No se pudo enviar el correo.' }, 502);
  }
});
