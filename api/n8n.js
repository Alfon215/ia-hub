// api/n8n.js  (Vercel Edge Function)
export const config = { runtime: 'edge' };

// Si quieres ocultarlo como variable de entorno, usa: const N8N_URL = process.env.N8N_URL;
const N8N_URL = 'https://n8n.srv909781.hstgr.cloud/webhook/671cb3de-75af-47dc-89a7-5a353a9b1c76';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const jsonCors = { ...cors, 'Content-Type': 'application/json' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'Method Not Allowed' }), {
      status: 405,
      headers: jsonCors,
    });
  }

  try {
    const bodyText = await req.text();

    const r = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyText || '{}',
    });

    const raw = await r.text();
    let payload;
    try { payload = JSON.parse(raw); } catch { payload = { response: raw }; }

    return new Response(JSON.stringify(payload), {
      status: r.status,
      headers: jsonCors,
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message || 'Proxy error' }), {
      status: 500,
      headers: jsonCors,
    });
  }
}
