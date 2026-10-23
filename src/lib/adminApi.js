// JSON fetch for the admin panel: same-origin, so the HttpOnly session cookie goes along.
// Throws an Error carrying the server's message, ready to show in the UI.
export const api = async (path, { method = 'GET', body } = {}) => {
    const res = await fetch(path, {
        method,
        headers: body instanceof FormData || body === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: body instanceof FormData || body === undefined ? body : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
};

// Which admin sections each role sees (the server enforces the same rules).
export const ROLE_LABELS = { admin: 'Admin', sales: 'Sales', hr: 'HR', marketing: 'Marketing' };
export const canAccess = (role, section) => role === 'admin' || ({
    sales: ['dashboard', 'inquiries', 'account'],
    hr: ['dashboard', 'careers', 'account'],
    marketing: ['dashboard', 'projects', 'blog', 'csr', 'account'],
}[role] || []).includes(section);

// One item per line in a textarea <-> array
export const toLines = (arr = []) => arr.join('\n');
export const fromLines = (text = '') => text.split('\n').map(s => s.trim()).filter(Boolean);
