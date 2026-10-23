import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { INDIA_PATH } from '../../data/indiaOutline';
import { MAP_CITIES, UNMAPPED_PROJECTS } from '../../data/projectMap';
import { track } from '../../lib/leads';

// Must match scripts/india-map.cjs, which drew INDIA_PATH with the same projection
const K = 12;
const project = (lon, lat) => [(lon - 68) * K, (37.5 - lat) * K * 1.1];

// Defaults = every EVIO project (/projects). /data-centres passes its own cities and headings.
export const ProjectMap = ({
    cities = MAP_CITIES, unmapped = UNMAPPED_PROJECTS, refPrefix = 'map',
    eyebrow = 'Pan-India Footprint', title = 'Selected projects across India', className = 'py-24 px-6 bg-white',
}) => {
    // Kept by name: `cities` is rebuilt when admin-added case studies load
    const [activeName, setActiveName] = useState(cities[0].city);
    const active = cities.find(c => c.city === activeName) || cities[0];

    const select = (c) => { setActiveName(c.city); track('map_city', { city: c.city }); };

    return (
        <section className={className}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">{eyebrow}</h2>
                    <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy mb-4">{title}</h3>
                    <p className="font-inter text-evio-black/60 max-w-2xl mx-auto">
                        A selection of our work. EVIO executes projects anywhere in India, so if your site is not on the map, we will still come to you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
                    <div className="lg:col-span-3">
                        <svg viewBox="0 0 360 412" className="w-full max-w-xl mx-auto h-auto" role="group" aria-label="Map of India showing EVIO project locations">
                            <path d={INDIA_PATH} className="fill-evio-light-gray stroke-evio-navy/25" strokeWidth="0.8" />
                            {cities.map(c => {
                                const [x, y] = project(c.lon, c.lat);
                                const on = c === active;
                                const r = 4.5 + Math.min(c.projects.length, 6) * 0.5;
                                return (
                                    <g
                                        key={c.city}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${c.city}: ${c.projects.length} ${c.projects.length === 1 ? "project" : "projects"}`}
                                        aria-pressed={on}
                                        onClick={() => select(c)}
                                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(c); } }}
                                        className="cursor-pointer outline-none group"
                                    >
                                        {on && <circle cx={x} cy={y} r={r + 4} className="fill-evio-blue/20 animate-ping" style={{ transformOrigin: `${x}px ${y}px` }} />}
                                        <circle cx={x} cy={y} r={r} className={`${on ? 'fill-evio-blue' : c.inProgress ? 'fill-amber-500 group-hover:fill-evio-blue' : 'fill-evio-navy group-hover:fill-evio-blue group-focus-visible:fill-evio-blue'} stroke-white transition-colors`} strokeWidth="1.5" />
                                        <text x={x} y={y + 2.3} textAnchor="middle" className="fill-white font-inter font-bold pointer-events-none" fontSize="6.5">{c.projects.length}</text>
                                        {on && <text x={x + r + 4} y={y + 3.5} stroke="white" strokeWidth="3" paintOrder="stroke" className="fill-evio-navy font-syne font-bold pointer-events-none" fontSize="10">{c.city}</text>}
                                    </g>
                                );
                            })}
                        </svg>
                        <p className="text-[11px] font-inter text-evio-black/40 text-center mt-2">Boundaries as per the Survey of India depiction (source: DataMeet).</p>
                        {cities.some(c => c.inProgress) && (
                            <p className="mt-3 text-sm font-inter text-evio-black/50 flex justify-center flex-wrap gap-x-6 gap-y-1">
                                <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-evio-navy mr-2" />Completed</span>
                                <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />Includes work in progress</span>
                            </p>
                        )}
                        {unmapped.length > 0 && (
                            <p className="mt-6 text-sm font-inter text-evio-black/60 text-center max-w-xl mx-auto">
                                <strong className="text-evio-navy">Also delivered across India:</strong> {unmapped.join(' · ')}
                            </p>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-evio-navy text-white rounded-3xl p-8 lg:sticky lg:top-28" aria-live="polite">
                        <p className="flex items-center text-xs font-inter font-bold uppercase tracking-widest text-evio-blue mb-2">
                            <MapPin className="w-4 h-4 mr-1.5" /> {active.projects.length} {active.projects.length === 1 ? 'project' : 'projects'}
                        </p>
                        <h4 className="text-3xl font-syne font-bold mb-6">{active.city}</h4>
                        <ul className="space-y-1 mb-8">
                            {active.projects.map(p => (
                                <li key={p.name}>
                                    {!p.to ? <p className="py-2.5 border-b border-white/10 font-inter text-sm text-white/85">{p.name}</p> : <Link to={p.to} className="flex items-center justify-between gap-4 py-2.5 border-b border-white/10 font-inter text-sm text-white/85 hover:text-white group">
                                        {p.name}
                                        <ArrowRight className="w-4 h-4 shrink-0 text-white/30 group-hover:text-evio-blue group-hover:translate-x-1 transition-all" />
                                    </Link>}
                                </li>
                            ))}
                        </ul>
                        <Link
                            to={`/contact?ref=${refPrefix}:${encodeURIComponent(active.city)}${refPrefix === 'dc-map' ? '&type=Data%20Center' : ''}`}
                            className="block w-full bg-evio-blue text-white text-center font-inter font-bold py-4 rounded-xl hover:bg-white hover:text-evio-navy transition-colors"
                        >
                            Discuss a project in {active.city.split(' & ')[0]}
                        </Link>

                        {/* Text alternative to the map, and quicker on phones */}
                        <div className="flex flex-wrap gap-2 mt-8">
                            {cities.map(c => (
                                <button key={c.city} onClick={() => select(c)} aria-pressed={c === active}
                                    className={`px-3 py-1.5 rounded-full text-xs font-inter border transition-colors ${c === active ? 'bg-white text-evio-navy border-white' : 'border-white/20 text-white/70 hover:border-white/50'}`}>
                                    {c.city}
                                </button>
                            ))}
                        </div>
                        <Link to={`/contact?ref=${refPrefix}:elsewhere`} className="block mt-6 text-sm font-inter text-white/70 hover:text-white">
                            Project in another city or state? <span className="text-evio-blue font-bold">We work across India →</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
