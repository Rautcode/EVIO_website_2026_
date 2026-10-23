import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { DC_PROGRAMMES } from '../../data/dataCentresData';
import { projectsData } from '../../data/projectsData';
import { DataContext } from '../../context/DataContext';

// ponytail: no site photo per data centre programme yet; cards show the plain EVIO block until supplied
const DC_IMAGES = {};

const listed = [
    // Data centre programmes come from the shared data file (also used by /data-centres)
    ...DC_PROGRAMMES.map(p => ({
        id: p.id, client: p.client, projectName: `${p.capacity.split(' (')[0]} Data Centre Electrical Works`,
        location: p.location, sector: "Data Centers", facilityType: `Data Centre · ${p.status}`,
        capacity: p.capacity, evioRole: "HT/LT Electrical", scope: [],
        images: DC_IMAGES[p.id] ? [DC_IMAGES[p.id]] : [], publicStatus: true
    })),
    { 
        id: "yokohama-bahadurgarh", client: "Yokohama", projectName: "Plant Expansion HT/LT Setup", 
        location: "Bahadurgarh", sector: "Manufacturing", facilityType: "Manufacturing Plant", 
        capacity: "6.6KV Downstream", evioRole: "Turnkey Electrical", 
        scope: ["Supply", "Installation", "Commissioning"], 
        images: ["/images/projects/real/yokohama.jpg"], publicStatus: true, span: "col-span-1 row-span-1" 
    },
    { 
        id: "nirma-bhavnagar", client: "Nirma Ltd.", projectName: "Caustic Soda Plant Turnkey", 
        location: "Bhavnagar, Gujarat", sector: "Chemical", facilityType: "Chemical Plant", 
        capacity: "60 TPD", evioRole: "Turnkey Execution", 
        scope: ["Electrical", "Automation"], 
        images: ["/images/projects/real/nirma.jpg"], publicStatus: true, span: "col-span-1 row-span-2" 
    },
    { 
        id: "ceat-halol", client: "CEAT Ltd.", projectName: "Radial Tyre Plant Expansion", 
        location: "Halol, Gujarat", sector: "Manufacturing", facilityType: "Tyre Plant", 
        capacity: "165 to 250 MTPD", evioRole: "Testing & Commissioning", 
        scope: ["Equipment Testing", "Commissioning"], 
        images: [], publicStatus: true, span: "col-span-1 md:col-span-2 row-span-1" 
    },
    { 
        id: "flipkart-haringhata", client: "Flipkart", projectName: "Logistics Hub Electrification", 
        location: "West Bengal", sector: "Infrastructure", facilityType: "Warehouse / Logistics", 
        capacity: "5 million sq ft", evioRole: "Electrical EPC", 
        scope: ["HT/LT Installation", "Lighting", "Power Distribution"], 
        images: ["/images/projects/real/flipkart.jpg"], publicStatus: true, span: "col-span-1 row-span-1"
    },
    { 
        id: "iit-hyderabad-package-3b", client: "IIT Hyderabad", projectName: "Campus Electrification", 
        location: "Hyderabad", sector: "Commercial", facilityType: "Education Institute", 
        capacity: "Campus Wide", evioRole: "Electrical Infrastructure", 
        scope: ["HT Distribution", "LT Panels", "Internal Electrification"], 
        images: ["/images/projects/real/iit-hyderabad.jpg"], publicStatus: true, span: "col-span-1 row-span-1" 
    },
    { 
        id: "leela-palace-gandhinagar", client: "The Leela", projectName: "Hotel Lighting Automation", 
        location: "Gandhinagar", sector: "Commercial", facilityType: "Hospitality", 
        capacity: "Full Property", evioRole: "Lighting Automation", 
        scope: ["DALI Integration", "Scene Setting", "Dimming Controls"], 
        images: ["/images/projects/real/leela.jpg"], publicStatus: true, span: "col-span-1 md:col-span-2 row-span-1" 
    },
    { id: "9", client: "IFFCO", projectName: "Electrical / ELV", location: "Kalol & Bengaluru", sector: "Chemical", facilityType: "Plant", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical", "ELV"], images: ["/images/projects/real/iffco.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "10", client: "Microlab", projectName: "ELV Systems", location: "India", sector: "Pharmaceuticals", facilityType: "Plant", capacity: "-", evioRole: "ELV", scope: ["ELV"], images: ["/images/projects/real/microlab.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "11", client: "Jio World Drive", projectName: "ELV Systems", location: "Mumbai", sector: "Commercial", facilityType: "Retail", capacity: "-", evioRole: "ELV", scope: ["ELV"], images: ["/images/projects/real/jio-world-drive.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "12", client: "Aurum", projectName: "Electrical / ELV", location: "India", sector: "Infrastructure", facilityType: "Infrastructure", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical", "ELV"], images: ["/images/projects/real/aurum.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "13", client: "Aarti Industries Limited", projectName: "Electrical / ELV", location: "India", sector: "Chemical", facilityType: "Plant", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical", "ELV"], images: ["/images/projects/real/aarti.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "14", client: "Kidzania", projectName: "Electrical Installation", location: "Noida", sector: "Commercial", facilityType: "Entertainment", capacity: "-", evioRole: "Electrical", scope: ["Electrical Installation"], images: ["/images/projects/real/kidzania.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "15", client: "Odisha Secretariat", projectName: "Secretariat Electrical", location: "Bhubaneswar", sector: "Infrastructure", facilityType: "Government", capacity: "-", evioRole: "Electrical", scope: ["Electrical Works"], images: ["/images/projects/real/odisha-secretariat.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "16", client: "Biocon", projectName: "Electrical Setup", location: "India", sector: "Pharmaceuticals", facilityType: "Facility", capacity: "-", evioRole: "Electrical", scope: ["Electrical Setup"], images: ["/images/projects/real/biocon.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "ineos-styrolution", client: "Ineos", projectName: "66kV Switchyard", location: "India", sector: "Plastics", facilityType: "Plant", capacity: "66kV", evioRole: "Switchyard", scope: ["66kV Switchyard"], images: ["/images/projects/real/ineos.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "hccb-multi-site", client: "HCCB", projectName: "Electrical / CCTV / Access", location: "Khurda", sector: "FMCG", facilityType: "Facility", capacity: "-", evioRole: "Electrical & Security", scope: ["Electrical", "CCTV", "Access Control"], images: ["/images/projects/real/hccb.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "19", client: "Escientia Advanced Sciences", projectName: "Electrical / Instrumentation", location: "Vishakapatnam", sector: "Pharmaceuticals", facilityType: "Facility", capacity: "-", evioRole: "Electrical & Instrumentation", scope: ["Electrical", "Instrumentation"], images: ["/images/projects/real/escientia.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "20", client: "Elementis", projectName: "Electrical / Instrumentation", location: "India", sector: "Chemical", facilityType: "Facility", capacity: "-", evioRole: "Electrical & Instrumentation", scope: ["Electrical", "Instrumentation"], images: ["/images/projects/real/elementis.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "bpcl-bargarh", client: "BPCL", projectName: "Bargarh Biorefinery Electrification", location: "Bargarh", sector: "Industrial", facilityType: "Biorefinery", capacity: "-", evioRole: "Electrical Execution", scope: ["33kV/6.6kV Switchyard"], images: [], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "21", client: "Dandi Kutir Museum", projectName: "Lighting Automation", location: "Gandhinagar", sector: "Commercial", facilityType: "Museum", capacity: "-", evioRole: "Lighting Automation", scope: ["Lighting Automation"], images: ["/images/projects/real/dandi-kutir.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "22", client: "Cummins", projectName: "Electrical / ELV", location: "Pune", sector: "Automobile & Ancillary", facilityType: "Facility", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical", "ELV"], images: ["/images/projects/real/cummins.jpg"], publicStatus: true, span: "col-span-1 row-span-1" },
    { id: "myntra-embassy-bilaspur", client: "Myntra", projectName: "Embassy Industrial Park Electrical Works", location: "Bilaspur, NCR", sector: "Commercial", facilityType: "Industrial Park", capacity: "-", evioRole: "Turnkey Electrical", scope: ["Turnkey Electrical"], images: ["/images/projects/real/myntra.jpg"], publicStatus: true },
    { id: "25", client: "Lodha", projectName: "Electrical / ELV", location: "India", sector: "Commercial", facilityType: "Real Estate", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical / ELV"], images: ["/images/projects/real/lodha.jpg"], publicStatus: true },
    { id: "26", client: "JIO", projectName: "Electrical / ELV", location: "India", sector: "Commercial", facilityType: "Facility", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical / ELV"], images: ["/images/projects/real/jio.jpg"], publicStatus: true },
    { id: "27", client: "Jio Garden", projectName: "Electrical / ELV", location: "India", sector: "Commercial", facilityType: "Venue", capacity: "-", evioRole: "Electrical / ELV", scope: ["Electrical / ELV"], images: ["/images/projects/real/jio-garden.jpg"], publicStatus: true },
    { id: "23", client: "Mazak", projectName: "Electrical Setup", location: "Pune", sector: "Engineering", facilityType: "Facility", capacity: "-", evioRole: "Electrical", scope: ["Electrical Installation"], images: ["/images/projects/real/mazak.jpg"], publicStatus: true, span: "col-span-1 row-span-1" }
];

// Any card with a case study in projectsData links to it; case studies without a card are appended.
const caseStudyIds = new Set(projectsData.map(p => p.id));
const projects = [
    ...listed.map(p => ({ ...p, hasDetail: caseStudyIds.has(p.id) })),
    ...projectsData.filter(d => !listed.some(p => p.id === d.id)).map(d => ({ ...d, hasDetail: true })),
];

const categories = ['All', 'Data Centers', 'Manufacturing', 'Chemical', 'Infrastructure', 'Commercial', 'Pharmaceuticals', 'Plastics', 'FMCG', 'Automobile & Ancillary', 'Engineering'];

export const ProjectGalleryGrid = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const { dbProjects } = useContext(DataContext);
    // Case studies added in the admin panel go after the built-in ones
    const all = [...projects, ...(dbProjects || []).filter(d => !caseStudyIds.has(d.id)).map(d => ({ ...d, hasDetail: true }))];

    const filteredProjects = activeFilter === 'All'
        ? all
        : all.filter(p => p.sector === activeFilter);

    return (
        <section className="py-24 px-6 relative bg-evio-light-gray">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-inter font-medium text-evio-blue uppercase tracking-widest mb-4">Project Portfolio</h2>
                    <h3 className="text-3xl md:text-5xl font-syne font-bold text-evio-navy">Searchable Engineering Portfolio</h3>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-2 md:gap-4 pb-8 items-center justify-center">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(activeFilter === category ? 'All' : category)}
                            className={`relative px-6 py-2.5 rounded-full font-inter font-bold text-sm transition-all duration-300 ${activeFilter === category
                                    ? 'text-white bg-evio-navy'
                                    : 'text-evio-black/50 bg-white hover:text-evio-navy hover:bg-white/80 border border-evio-black/5'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project) => {
                            const CardContent = (
                                <>
                                    <div className="h-48 bg-evio-navy overflow-hidden relative">
                                        {project.images && project.images[0] ? (
                                            <img src={project.images[0]} alt={project.projectName} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/20 font-syne">EVIO</div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-white/90 backdrop-blur-md text-evio-navy text-[10px] font-syne font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-sm">
                                                {project.sector}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-xs font-inter font-bold text-evio-blue uppercase tracking-widest mb-2">{project.client}</div>
                                        <h4 className="font-syne font-bold text-xl text-evio-navy mb-4 leading-tight">{project.projectName}</h4>
                                        
                                        <div className="space-y-2 mb-6 mt-auto">
                                            <div className="flex justify-between text-sm font-inter border-b border-evio-black/5 pb-1">
                                                <span className="text-evio-black/50">Location</span>
                                                <span className="text-evio-navy font-medium text-right">{project.location}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-inter border-b border-evio-black/5 pb-1">
                                                <span className="text-evio-black/50">Type</span>
                                                <span className="text-evio-navy font-medium text-right">{project.facilityType}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-inter border-b border-evio-black/5 pb-1">
                                                <span className="text-evio-black/50">Role</span>
                                                <span className="text-evio-navy font-medium text-right">{project.evioRole}</span>
                                            </div>
                                            {project.capacity && project.capacity !== "To be verified" && project.capacity !== "-" && (
                                                <div className="flex justify-between text-sm font-inter border-b border-evio-black/5 pb-1">
                                                    <span className="text-evio-black/50">Capacity</span>
                                                    <span className="text-evio-navy font-medium text-right">{project.capacity}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-xs uppercase tracking-widest font-bold flex items-center transition-colors group-hover:text-evio-blue text-evio-black/30">
                                            {project.hasDetail ? (
                                                <>
                                                    <span className="mr-2 text-[#4ade80]">View Case Study</span>
                                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </>
                                            ) : (
                                                <span>Portfolio Item</span>
                                            )}
                                        </div>
                                    </div>
                                </>
                            );

                            return (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-2xl border border-evio-black/5 overflow-hidden hover:shadow-xl hover:border-evio-blue/30 transition-all duration-300 flex flex-col h-full group"
                                >
                                    {project.hasDetail ? (
                                        <Link to={`/projects/${project.id}`} className="flex flex-col h-full cursor-pointer">
                                            {CardContent}
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col h-full">
                                            {CardContent}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
                
                {filteredProjects.length === 0 && (
                    <div className="py-20 text-center text-evio-black/50 font-inter">
                        No projects found in this category.
                    </div>
                )}
            </div>
        </section>
    );
};
