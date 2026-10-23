// AI first drafts for the admin panel (Claude API): case studies and blog posts from rough notes,
// and LinkedIn captions for published items. Drafts are always reviewed by a person before publishing.
// Off until ANTHROPIC_API_KEY is set; the panel hides the AI buttons when /api/ai/status says disabled.
const Anthropic = require('@anthropic-ai/sdk');
const { requireAdmin, requireRole, limits, clip } = require('./security');
const { audit, SECTORS } = require('./admin');

const MODEL = 'claude-opus-5-5';

const SYSTEM = `You write for EVIO Private Limited, an Indian turnkey electrical, automation and data centre electrical contractor (founded 2011, Mumbai HQ, works across India).
Rules:
- Use only facts given in the notes. Never invent clients, numbers, capacities, dates, locations, awards or outcomes. If something is unknown, leave that field empty (or an empty list) rather than guessing.
- Plain, confident, technical Indian business English. No hype words ("cutting-edge", "world-class", "revolutionary"), no emojis.
- Short sentences. Engineers and procurement heads are the readers.`;

const str = { type: 'string' };
const list = { type: 'array', items: str };
const obj = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });

const KINDS = {
    'case-study': {
        schema: obj({
            client: str, projectName: str, location: str, sector: { type: 'string', enum: SECTORS },
            facilityType: str, capacity: str, evioRole: str, contractType: str, duration: str,
            scope: list, equipment: list, technologies: list, challenges: list, outcomes: list,
        }),
        prompt: (notes) => `Turn these site/project notes into a case study for the EVIO website. Scope, equipment, challenges and outcomes are lists of short items.\n\n<notes>\n${notes}\n</notes>`,
    },
    blog: {
        schema: obj({
            title: str, excerpt: str,
            category: { type: 'string', enum: ['Company News', 'Technical Insights', 'Case Studies', 'HSE Policies'] },
            readTimeMinutes: { type: 'integer' },
            content: str,
        }),
        prompt: (notes) => `Write a blog article for the EVIO website from these notes. Format "content" as plain text: paragraphs separated by a blank line, short section headings on their own line with no punctuation at the end, bullet lines starting with "- ". 400-800 words. End with one line inviting readers to contact EVIO about a similar project. The excerpt is 1-2 sentences.\n\n<notes>\n${notes}\n</notes>`,
    },
    linkedin: {
        schema: obj({ post: str }),
        prompt: (notes) => `Write a LinkedIn post for EVIO's company page announcing this published item. 60-120 words, a strong first line, 3-5 relevant hashtags at the end, and the link on its own line before the hashtags.\n\n<item>\n${notes}\n</item>`,
    },
};

let client;
const enabled = () => !!process.env.ANTHROPIC_API_KEY;

const draft = async (kind, notes) => {
    client ||= new Anthropic();
    const { schema, prompt } = KINDS[kind];
    const response = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        system: SYSTEM,
        messages: [{ role: 'user', content: prompt(notes) }],
        output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
        // On a policy decline, the API re-runs the request on Anthropic's recommended fallback model
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
    });
    if (response.stop_reason === 'refusal') throw Object.assign(new Error('The AI declined to draft this. Please rephrase the notes.'), { status: 422 });
    if (response.stop_reason === 'max_tokens') throw Object.assign(new Error('The draft was too long. Please shorten the notes.'), { status: 422 });
    const text = response.content.find(b => b.type === 'text')?.text;
    return JSON.parse(text);
};

const registerAiRoutes = (app) => {
    app.get('/api/ai/status', requireAdmin, (req, res) => res.json({ enabled: enabled() }));

    app.post('/api/ai/draft', ...requireRole('marketing'), limits.ai, async (req, res) => {
        const kind = String(req.body?.kind || '');
        const notes = clip(req.body?.notes, 20000).trim();
        if (!KINDS[kind]) return res.status(400).json({ error: `Kind must be one of: ${Object.keys(KINDS).join(', ')}` });
        if (notes.length < 20) return res.status(400).json({ error: 'Add a few lines of notes first.' });
        if (!enabled()) return res.status(503).json({ error: 'AI drafting is not set up (ANTHROPIC_API_KEY missing).' });
        try {
            const result = await draft(kind, notes);
            audit(req, 'ai.draft', kind);
            res.json(result);
        } catch (err) {
            if (err.status === 422) return res.status(422).json({ error: err.message });
            if (err instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'AI is busy. Please try again in a minute.' });
            if (err instanceof Anthropic.AuthenticationError) { console.error('ANTHROPIC_API_KEY rejected'); return res.status(503).json({ error: 'AI key is invalid. Ask the admin to check ANTHROPIC_API_KEY.' }); }
            console.error('AI draft failed:', err.status || '', err.message);
            res.status(502).json({ error: 'The AI draft failed. Please try again.' });
        }
    });
};

module.exports = { registerAiRoutes };
