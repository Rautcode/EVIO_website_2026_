// Data centre vertical: single source for /data-centres and the Projects gallery.
// Source: EVIO Data Centre Content Pack (13 Oct 2026).

export const DC_HEADLINE_STATS = [
    { value: 'Since 2011', label: 'Delivering electrical turnkey projects' },
    { value: '295 MW', label: 'Data centre capacity worked on' },
    { value: '10 cities', label: 'Data centre sites across India' },
    { value: '1.9 Cr+', label: 'Safe man-hours, FY21–FY25 (company-wide)' },
    { value: 'Zero LTI', label: 'Lost-time injuries in five years' },
];

export const DC_CITIES = ['Hyderabad', 'Mumbai', 'Navi Mumbai', 'Pune', 'Chennai', 'New Delhi', 'Bengaluru', 'Ahmedabad', 'Kolkata', 'Noida'];

// City footprint, per EVIO's "Data Centre Footprint Across India" slide (Oct 2026).
export const DC_FOOTPRINT = [
    { city: 'Hyderabad', programmes: ['Microsoft HYD-01'], inProgress: false },
    { city: 'Mumbai & Navi Mumbai', programmes: ['NTT', 'CtrlS', 'AdaniConneX', 'Digital Edge'], inProgress: true },
    { city: 'Pune', programmes: ['ST Telemedia', 'AdaniConneX'], inProgress: true },
    { city: 'Delhi NCR', programmes: ['ST Telemedia (New Delhi)', 'Sify (Noida)'], inProgress: false },
    { city: 'Ahmedabad', programmes: ['ST Telemedia'], inProgress: false },
    { city: 'Bengaluru', programmes: ['ST Telemedia'], inProgress: false },
    { city: 'Chennai', programmes: ['ST Telemedia'], inProgress: false },
    { city: 'Kolkata', programmes: ['NTT'], inProgress: false },
];

// Shown on the page and merged into the Projects gallery (sector "Data Centers").
export const DC_PROGRAMMES = [
    { id: 'microsoft-hyderabad', client: 'Microsoft', site: 'HYD-01', location: 'Hyderabad', capacityMW: 45, capacity: '45 MW', status: 'Completed' },
    { id: 'ntt-data-mumbai-kolkata', client: 'NTT DATA', site: '3 facilities', location: 'Mumbai, Navi Mumbai & Kolkata', capacityMW: 19, capacity: '19 MW (5 + 5 + 9)', status: 'Completed' },
    { id: 'sify-noida', client: 'Sify', site: 'Noida DC', location: 'Noida', capacityMW: 10, capacity: '10 MW', status: 'Completed' },
    { id: 'ctrls-navi-mumbai', client: 'CtrlS', site: 'Mumbai campus', location: 'Navi Mumbai', capacityMW: 9, capacity: '9 MW', status: 'Completed' },
    // ponytail: status pending confirmation (deck says both "Colo 5 in progress" and "completed")
    { id: 'adani-connex-pune', client: 'AdaniConneX', site: '5 colocation halls', location: 'Pune, Mumbai & Navi Mumbai', capacityMW: 48, capacity: '48 MW (5 × 9.6 MW)', status: 'Ongoing', hasDetail: true },
    { id: 'digital-edge-navi-mumbai', client: 'Digital Edge', site: 'BOM1 campus', location: 'Navi Mumbai', capacityMW: 45, capacity: '45 MW', status: 'Ongoing' },
    { id: 'stt-gdc-india', client: 'ST Telemedia GDC', site: '5 cities', location: 'Pune, Chennai, New Delhi, Bengaluru, Ahmedabad', capacityMW: 30, capacity: '~30 MW', status: 'Ongoing', hasDetail: true },
];

export const DC_CAPABILITIES = [
    { title: 'HT / LT panels', desc: 'Turnkey installation, termination and testing of HT and LT panels.' },
    { title: 'Cabling', desc: 'HT, LT and control cable laying, glanding and termination on trays and ladders.' },
    { title: 'DG sets & fuel systems', desc: 'Proven delivery across many DG set and fuel-system installations.' },
    { title: 'UPS systems', desc: 'Modular and centralised UPS systems installed at multiple sites.' },
    { title: 'Busduct & cable management', desc: 'Busduct, cable tray and ladder systems routed for data hall loads.' },
    { title: 'Earthing & lightning protection', desc: 'Earthing networks and lightning protection to statutory and client standards.' },
    { title: 'Testing & commissioning', desc: 'Pre-commissioning tests and support through L1 to L5 commissioning levels.' },
    { title: 'Material handling', desc: 'Established shifting and handling processes for heavy electrical equipment.' },
];

export const DC_QA_STEPS = [
    'Approved method statement for every work activity before it starts',
    'Incoming material inspection (IMIR) against approved make, specification and test certificates',
    'Request for work inspection (RFWI) and joint inspection before the next stage',
    'Testing with calibrated instruments: insulation resistance, continuity, earth resistance, torque',
    'Equipment tagged through commissioning levels L1 (installation) to L5 (ready to serve)',
    'Non-conformances closed through root-cause analysis and CAPA',
];

// Company-wide HSE figures (not data-centre-only).
export const SAFETY_BY_YEAR = [
    { year: 'FY21', manHours: 3191234 },
    { year: 'FY22', manHours: 3121619 },
    { year: 'FY23', manHours: 3546186 },
    { year: 'FY24', manHours: 3969005 },
    { year: 'FY25', manHours: 5244891 },
];
