import { CheckCircle2 } from 'lucide-react';

export const AdaniConnexCaseStudy = () => {
    return (
        <section className="py-24 bg-white px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Selected Mission-Critical Experience</h2>
                    <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy">Adani ConneX — Pune</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Snapshot Panel */}
                    <div className="lg:col-span-4 bg-evio-navy rounded-[24px] p-8 text-white h-fit sticky top-24 shadow-xl">
                        <h4 className="font-syne font-bold text-xl text-white mb-6 pb-4 border-b border-white/10">Project Snapshot</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60 font-inter text-sm">Client</span>
                                <span className="font-inter font-bold text-right">Adani ConneX</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60 font-inter text-sm">Location</span>
                                <span className="font-inter font-bold text-right">Pune, Maharashtra</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60 font-inter text-sm">Sector</span>
                                <span className="font-inter font-bold text-right">Hyperscale Data Center</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60 font-inter text-sm">Project Type</span>
                                <span className="font-inter font-bold text-right">Electrical Infrastructure</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                                <span className="text-white/60 font-inter text-sm">Status</span>
                                <span className="font-inter font-bold text-[#4ade80] text-right">Completed</span>
                            </div>
                            
                            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-inter text-white/50 text-center">
                                Project capacity and exact timeline data to be published following EVIO internal approval.
                            </div>
                        </div>
                    </div>

                    {/* Scope & Execution */}
                    <div className="lg:col-span-8 space-y-12">
                        <div>
                            <p className="text-lg text-evio-black/70 font-inter leading-relaxed mb-8">
                                EVIO's publicly documented work at an Adani ConneX data-center project in Pune demonstrates the execution standards required for mission-critical electrical infrastructure.
                            </p>
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-6">Scope of Work</h4>
                            <p className="font-inter text-evio-black/70 mb-4">The execution included critical electrical installation activities covering:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    "HT cable routing and dressing",
                                    "Cable tray installation",
                                    "Power and control cable routing",
                                    "Cable termination",
                                    "Electrical equipment installation",
                                    "Earthing and earth-bus connections",
                                    "Equipment accessibility and maintenance clearances",
                                    "Site material management",
                                    "Electrical installation quality control",
                                    "Testing and commissioning activities"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-evio-blue mr-3 shrink-0 mt-0.5" />
                                        <span className="font-inter text-evio-black/80 text-sm md:text-base">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-evio-black/5">
                            <h4 className="text-2xl font-syne font-bold text-evio-navy mb-6">Execution Focus</h4>
                            <p className="font-inter text-evio-black/70 mb-8">The project demonstrates EVIO's emphasis on installation quality rather than simply equipment placement. Particular attention was given to:</p>
                            
                            <div className="space-y-8">
                                <div>
                                    <h5 className="font-syne font-bold text-lg text-evio-navy mb-2">Cable Management</h5>
                                    <p className="font-inter text-evio-black/70">Structured horizontal and vertical cable routing with controlled dressing to improve maintainability, inspection and future modification.</p>
                                </div>
                                <div>
                                    <h5 className="font-syne font-bold text-lg text-evio-navy mb-2">HT Cable Installation</h5>
                                    <p className="font-inter text-evio-black/70">Organised single-core HT cable dressing, phase identification and spacing to support safe and reliable operation.</p>
                                </div>
                                <div>
                                    <h5 className="font-syne font-bold text-lg text-evio-navy mb-2">Cable Tray Systems</h5>
                                    <p className="font-inter text-evio-black/70">Proper alignment, support and segregation to create a stable and maintainable cable-routing infrastructure.</p>
                                </div>
                                <div>
                                    <h5 className="font-syne font-bold text-lg text-evio-navy mb-2">Termination Quality</h5>
                                    <p className="font-inter text-evio-black/70">Controlled termination practices focused on electrical integrity, insulation and inspection traceability.</p>
                                </div>
                                <div>
                                    <h5 className="font-syne font-bold text-lg text-evio-navy mb-2">Earthing</h5>
                                    <p className="font-inter text-evio-black/70">Structured earth-bus connections supporting fault-current dissipation, equipment protection and inspection.</p>
                                </div>
                                <div>
                                    <h5 className="font-syne font-bold text-lg text-evio-navy mb-2">Equipment Installation</h5>
                                    <p className="font-inter text-evio-black/70">Equipment positioning with operational access and maintenance requirements considered during installation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
