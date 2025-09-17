import dotenv from 'dotenv';
dotenv.config();
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID; // phone-number-id from Meta

function ensureEnv() {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    throw new Error('WhatsApp Cloud API non configuré: définissez WHATSAPP_TOKEN et WHATSAPP_PHONE_ID');
  }
}

function normalizeMsisdn(rawPhone?: string): string | null {
  if (!rawPhone) return null;
  let msisdn = rawPhone.replace(/[^0-9]/g, '');
  // Si numéro local sénégalais (9 chiffres), préfixe 221
  if (msisdn.length === 9) {
    msisdn = `221${msisdn}`;
  }
  // Déjà en E.164 sans +
  if (/^\d{10,15}$/.test(msisdn)) {
    return msisdn;
  }
  return null;
}

export async function sendWhatsAppText(toPhone: string, message: string) {
  ensureEnv();
  const to = normalizeMsisdn(toPhone);
  if (!to) {
    throw new Error('Numéro WhatsApp invalide');
  }

  const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  } as const;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Echec envoi WhatsApp: ${res.status} ${body}`);
  }
  return res.json();
}

export async function notifyAdminsOnWhatsApp(message: string) {
  const list = (process.env.WHATSAPP_ADMIN_NUMBERS || '').split(',').map(s => s.trim()).filter(Boolean);
  const results: Array<{ to: string; ok: boolean; error?: string }> = [];
  for (const admin of list) {
    try {
      await sendWhatsAppText(admin, message);
      results.push({ to: admin, ok: true });
    } catch (e: any) {
      results.push({ to: admin, ok: false, error: e?.message || String(e) });
    }
  }
  return results;
}


