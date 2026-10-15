// Lead attribution + analytics. Everything here is best-effort: storage can be
// blocked and GA may not be loaded, and neither may ever break a form.

const FIRST_TOUCH_KEY = 'evio_first_touch';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];

// Remember how the visitor first arrived (ad campaign, Google, LinkedIn...).
export const captureFirstTouch = () => {
    try {
        if (localStorage.getItem(FIRST_TOUCH_KEY)) return;
        const params = new URLSearchParams(window.location.search);
        localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify({
            utm: UTM_KEYS.filter(k => params.get(k)).map(k => `${k}=${params.get(k)}`).join('&'),
            referrer: document.referrer,
            landing: window.location.pathname,
        }));
    } catch { /* storage blocked */ }
};

// Human-readable source string saved with every lead, e.g.
// "ref=project:stt-gdc-india | utm_source=linkedin | referrer=https://www.google.com/ | landing=/services"
export const leadSource = (ref) => {
    let ft = {};
    try { ft = JSON.parse(localStorage.getItem(FIRST_TOUCH_KEY)) || {}; } catch { /* ignore */ }
    return [
        ref && `ref=${ref}`,
        ft.utm,
        ft.referrer && `referrer=${ft.referrer}`,
        ft.landing && `landing=${ft.landing}`,
    ].filter(Boolean).join(' | ');
};

// GA4 only loads after cookie consent and when VITE_GA_ID is set.
export const loadAnalytics = () => {
    const id = import.meta.env.VITE_GA_ID;
    if (!id || window.gtag) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id); // GA4 enhanced measurement tracks SPA route changes
};

export const track = (event, params) => window.gtag?.('event', event, params);

// Digits only incl. country code, e.g. 919876543210. Unset = WhatsApp button hidden.
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';
export const SALES_PHONE = '+912245766700'; // Mumbai HQ, per evio.in/reach-us

// Sales pipeline stages (must match LEAD_STATUSES in server/server.js)
export const LEAD_STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
export const STATUS_STYLES = {
    New: 'bg-blue-50 text-blue-700 border-blue-200',
    Contacted: 'bg-amber-50 text-amber-800 border-amber-200',
    Quoted: 'bg-purple-50 text-purple-700 border-purple-200',
    Won: 'bg-green-50 text-green-700 border-green-200',
    Lost: 'bg-gray-100 text-gray-500 border-gray-200',
};
