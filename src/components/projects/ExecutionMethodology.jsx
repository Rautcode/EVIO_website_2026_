export const ExecutionMethodology = () => {
    const methodology = [
        {
            num: "01",
            title: "Engineering",
            desc: "Design coordination, drawings, BOQ, specifications and interface planning."
        },
        {
            num: "02",
            title: "Procurement",
            desc: "Material planning, vendor coordination, inspection and logistics."
        },
        {
            num: "03",
            title: "Installation",
            desc: "Equipment installation, cable routing, termination, earthing and distribution systems."
        },
        {
            num: "04",
            title: "Quality",
            desc: "Inspection, drawing verification, installation checks and documentation."
        },
        {
            num: "05",
            title: "Testing & Commissioning",
            desc: "Electrical testing, functional verification, integration, commissioning and handover."
        }
    ];

    return (
        <section className="py-24 bg-evio-light-gray px-6 border-b border-evio-black/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Project Execution Methodology</h2>
                    <h3 className="text-3xl md:text-4xl font-syne font-bold text-evio-navy">Engineering to Commissioning</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {methodology.map((step, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border border-evio-black/5 relative group">
                            <div className="text-6xl font-syne font-bold text-evio-navy/[0.05] absolute top-4 right-4 select-none group-hover:text-evio-blue/[0.1] transition-colors">
                                {step.num}
                            </div>
                            <div className="relative z-10">
                                <div className="text-sm font-bold font-inter text-evio-blue mb-4 uppercase tracking-widest">Stage {step.num}</div>
                                <h4 className="text-xl font-syne font-bold text-evio-navy mb-4">{step.title}</h4>
                                <p className="text-evio-black/70 font-inter text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
