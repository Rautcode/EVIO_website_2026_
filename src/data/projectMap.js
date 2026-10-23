// Cities on the /projects map. `to` links to a case study, the data centre page or the gallery.
// Only projects already published elsewhere on the site belong here.

import { INDIA_CITIES } from './indiaCities';

const cs = (id) => `/projects/${id}`;
const DC = '/data-centres';

export const MAP_CITIES = [
    {
        city: 'Mumbai & Navi Mumbai', lat: 19.08, lon: 72.88, projects: [
            { name: 'NTT DATA data centres', to: DC },
            { name: 'CtrlS Mumbai campus (9 MW)', to: DC },
            { name: 'Digital Edge BOM1 (45 MW)', to: DC },
            { name: 'AdaniConneX colocation halls', to: cs('adani-connex-pune') },
            { name: 'L&T RG1A car park, BKC', to: cs('lnt-bkc-rg1a') },
            { name: 'Vedant Dyestuffs automation, Taloja', to: cs('vedant-taloja-automation') },
            { name: 'Jio World Drive', to: '/projects' },
        ],
    },
    {
        city: 'Pune', lat: 18.52, lon: 73.86, projects: [
            { name: 'AdaniConneX colocation campus (48 MW)', to: cs('adani-connex-pune') },
            { name: 'ST Telemedia GDC', to: cs('stt-gdc-india') },
            { name: 'Cummins', to: '/projects' },
            { name: 'Mazak', to: '/projects' },
        ],
    },
    {
        city: 'Hyderabad', lat: 17.39, lon: 78.49, projects: [
            { name: 'Microsoft HYD-01 (45 MW)', to: DC },
            { name: 'TCS Techno Park, Adibatla', to: cs('tcs-techno-park-hyderabad') },
            { name: 'IIT Hyderabad campus (Package 3B)', to: cs('iit-hyderabad-package-3b') },
        ],
    },
    { city: 'Chennai', lat: 13.08, lon: 80.27, projects: [{ name: 'ST Telemedia GDC', to: cs('stt-gdc-india') }] },
    {
        city: 'Bengaluru', lat: 12.97, lon: 77.59, projects: [
            { name: 'ST Telemedia GDC', to: cs('stt-gdc-india') },
            { name: 'IFFCO', to: '/projects' },
        ],
    },
    {
        city: 'Delhi NCR', lat: 28.61, lon: 77.21, projects: [
            { name: 'ST Telemedia GDC, New Delhi', to: cs('stt-gdc-india') },
            { name: 'Sify data centre, Noida (10 MW)', to: DC },
            { name: 'Myntra, Embassy Industrial Park', to: cs('myntra-embassy-bilaspur') },
            { name: 'Yokohama 6.6 kV expansion, Bahadurgarh', to: cs('yokohama-bahadurgarh') },
            { name: 'Kidzania, Noida', to: '/projects' },
        ],
    },
    {
        city: 'Ahmedabad & Gandhinagar', lat: 23.10, lon: 72.60, projects: [
            { name: 'ST Telemedia GDC, Ahmedabad', to: cs('stt-gdc-india') },
            { name: 'The Leela Palace lighting controls', to: cs('leela-palace-gandhinagar') },
            { name: 'Tata Communications, GIFT City', to: cs('tata-communications-gift-city') },
            { name: 'Dandi Kutir museum', to: '/projects' },
            { name: 'IFFCO, Kalol', to: '/projects' },
        ],
    },
    { city: 'Halol', lat: 22.50, lon: 73.47, projects: [{ name: 'CEAT radial tyre plant expansion', to: cs('ceat-halol') }] },
    { city: 'Bhavnagar', lat: 21.76, lon: 72.15, projects: [{ name: 'Nirma 60 TPD caustic soda plant', to: cs('nirma-bhavnagar') }] },
    {
        city: 'Kolkata', lat: 22.57, lon: 88.36, projects: [
            { name: 'NTT DATA data centre', to: DC },
            { name: 'Flipkart Big Box, Haringhata', to: cs('flipkart-haringhata') },
        ],
    },
    {
        city: 'Bhubaneswar', lat: 20.30, lon: 85.82, projects: [
            { name: 'Odisha Secretariat', to: '/projects' },
            { name: 'HCCB, Khurda', to: cs('hccb-multi-site') },
        ],
    },
    { city: 'Bargarh', lat: 21.33, lon: 83.62, projects: [{ name: 'BPCL biorefinery', to: cs('bpcl-bargarh') }] },
    { city: 'Visakhapatnam', lat: 17.69, lon: 83.22, projects: [{ name: 'Escientia Advanced Sciences', to: '/projects' }] },
];

// Published projects with no city on record. Listed under the map instead of pinned.
export const UNMAPPED_PROJECTS = [
    'Ineos Styrolution 66 kV switchyard', 'Alpla filling & moulding plant', 'Biocon', 'Microlab',
    'Aarti Industries', 'Elementis', 'Aurum', 'Lodha', 'JIO', 'Jio Garden',
];

// Data centre programmes only, for /data-centres (same data as DC_FOOTPRINT / DC_PROGRAMMES).
// `inProgress` = the city includes work still under way (amber marker).
export const DC_MAP_CITIES = [
    { city: 'Mumbai & Navi Mumbai', lat: 19.08, lon: 72.88, inProgress: true, projects: [
        { name: 'NTT DATA (Mumbai & Navi Mumbai)' }, { name: 'CtrlS Mumbai campus: 9 MW' },
        { name: 'AdaniConneX colocation (ongoing)', to: cs('adani-connex-pune') }, { name: 'Digital Edge BOM1: 45 MW (ongoing)' },
    ] },
    { city: 'Pune', lat: 18.52, lon: 73.86, inProgress: true, projects: [
        { name: 'AdaniConneX colocation (ongoing)', to: cs('adani-connex-pune') },
        { name: 'ST Telemedia GDC (ongoing)', to: cs('stt-gdc-india') },
    ] },
    { city: 'Hyderabad', lat: 17.39, lon: 78.49, projects: [{ name: 'Microsoft HYD-01: 45 MW' }] },
    { city: 'Delhi NCR', lat: 28.61, lon: 77.21, projects: [
        { name: 'ST Telemedia GDC, New Delhi', to: cs('stt-gdc-india') }, { name: 'Sify Noida: 10 MW' },
    ] },
    { city: 'Ahmedabad', lat: 23.02, lon: 72.57, projects: [{ name: 'ST Telemedia GDC', to: cs('stt-gdc-india') }] },
    { city: 'Bengaluru', lat: 12.97, lon: 77.59, projects: [{ name: 'ST Telemedia GDC', to: cs('stt-gdc-india') }] },
    { city: 'Chennai', lat: 13.08, lon: 80.27, projects: [{ name: 'ST Telemedia GDC', to: cs('stt-gdc-india') }] },
    { city: 'Kolkata', lat: 22.57, lon: 88.36, projects: [{ name: 'NTT DATA' }] },
];

// Adds case studies created in the admin panel to the /projects map: pinned by `mapCity`,
// otherwise listed under the map. Returns new arrays; the inputs are not changed.
export const withAdminProjects = (projects = []) => {
    const cities = MAP_CITIES.map(c => ({ ...c, projects: [...c.projects] }));
    const unmapped = [...UNMAPPED_PROJECTS];
    for (const p of projects) {
        const name = `${p.client}: ${p.projectName}`;
        let city = cities.find(c => c.city === p.mapCity);
        const known = !city && INDIA_CITIES.find(c => c.city === p.mapCity);
        if (known) cities.push(city = { ...known, projects: [] });
        if (city) city.projects.push({ name, to: cs(p.id) });
        else unmapped.push(name);
    }
    return { cities, unmapped };
};
