// Instant WhatsApp alert to the sales team for every new lead (WhatsApp Cloud API, Meta).
// Business-initiated messages must use an approved template, so create one in Meta Business Manager:
//   name: WHATSAPP_TEMPLATE (default "new_lead"), language: en, category: Utility, body e.g.
//   "New EVIO lead: {{1}} ({{2}}). Type: {{3}}. Phone: {{4}}. Email: {{5}}. Open the admin panel to follow up."
// Unset WHATSAPP_TOKEN / WHATSAPP_PHONE_ID / WHATSAPP_ALERT_TO = alerts are skipped. Never blocks or fails a lead.

const GRAPH = 'https://graph.facebook.com/v21.0';

// Template parameters may not contain newlines, tabs or 4+ spaces in a row; keep them short too.
const param = (v) => ({ type: 'text', text: (String(v ?? '').replace(/\s+/g, ' ').trim() || '-').slice(0, 120) });

const buildMessages = (lead, env = process.env) => {
    const to = (env.WHATSAPP_ALERT_TO || '').split(',').map(s => s.replace(/\D/g, '')).filter(Boolean);
    return to.map(number => ({
        messaging_product: 'whatsapp',
        to: number,
        type: 'template',
        template: {
            name: env.WHATSAPP_TEMPLATE || 'new_lead',
            language: { code: env.WHATSAPP_TEMPLATE_LANG || 'en' },
            components: [{
                type: 'body',
                parameters: [lead.name, lead.company || 'no company', lead.projectType || 'General', lead.phone || 'not given', lead.email].map(param),
            }],
        },
    }));
};

const notifyWhatsApp = async (lead, env = process.env, fetchImpl = fetch) => {
    if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_PHONE_ID) return;
    await Promise.all(buildMessages(lead, env).map(async (body) => {
        try {
            const res = await fetchImpl(`${GRAPH}/${encodeURIComponent(env.WHATSAPP_PHONE_ID)}/messages`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(10_000),
            });
            if (!res.ok) console.error('WhatsApp alert failed:', res.status, (await res.text()).slice(0, 300));
        } catch (err) {
            console.error('WhatsApp alert failed:', err.message);
        }
    }));
};

module.exports = { notifyWhatsApp, buildMessages };
