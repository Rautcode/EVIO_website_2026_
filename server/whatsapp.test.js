// Run: node --test   (from server/)
const test = require('node:test');
const assert = require('node:assert');
const { notifyWhatsApp, buildMessages } = require('./whatsapp');

const lead = { name: 'Asha\nRao', company: '', projectType: 'Data Center', phone: '+91 98765 43210', email: 'a@b.co' };

test('one template message per alert number, with clean params', () => {
    const msgs = buildMessages(lead, { WHATSAPP_ALERT_TO: '+91 98765-00001, 919876500002' });
    assert.deepStrictEqual(msgs.map(m => m.to), ['919876500001', '919876500002']);
    const params = msgs[0].template.components[0].parameters.map(p => p.text);
    assert.deepStrictEqual(params, ['Asha Rao', 'no company', 'Data Center', '+91 98765 43210', 'a@b.co']);
});

test('skipped when not configured, and an API error never throws', async () => {
    let calls = 0;
    const fake = async () => { calls++; return { ok: false, status: 400, text: async () => 'bad template' }; };
    await notifyWhatsApp(lead, { WHATSAPP_ALERT_TO: '911' }, fake);
    assert.strictEqual(calls, 0);
    await notifyWhatsApp(lead, { WHATSAPP_TOKEN: 't', WHATSAPP_PHONE_ID: '1', WHATSAPP_ALERT_TO: '911' }, fake);
    assert.strictEqual(calls, 1);
});
