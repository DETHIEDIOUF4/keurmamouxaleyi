"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppText = sendWhatsAppText;
exports.notifyAdminsOnWhatsApp = notifyAdminsOnWhatsApp;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID; // phone-number-id from Meta
function ensureEnv() {
    if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
        throw new Error('WhatsApp Cloud API non configuré: définissez WHATSAPP_TOKEN et WHATSAPP_PHONE_ID');
    }
}
function normalizeMsisdn(rawPhone) {
    if (!rawPhone)
        return null;
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
function sendWhatsAppText(toPhone, message) {
    return __awaiter(this, void 0, void 0, function* () {
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
        };
        const res = yield fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const body = yield res.text();
            throw new Error(`Echec envoi WhatsApp: ${res.status} ${body}`);
        }
        return res.json();
    });
}
function notifyAdminsOnWhatsApp(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = (process.env.WHATSAPP_ADMIN_NUMBERS || '').split(',').map(s => s.trim()).filter(Boolean);
        const results = [];
        for (const admin of list) {
            try {
                yield sendWhatsAppText(admin, message);
                results.push({ to: admin, ok: true });
            }
            catch (e) {
                results.push({ to: admin, ok: false, error: (e === null || e === void 0 ? void 0 : e.message) || String(e) });
            }
        }
        return results;
    });
}
