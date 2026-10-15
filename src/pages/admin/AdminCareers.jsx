import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataContext } from '../../context/DataContext';

export const AdminCareers = () => {
    const { jobs, addJob, deleteJob, careerSettings, setCareerSettings, applications, refreshApplications, refreshSettings, deleteApplication, downloadApplicationResume } = useContext(DataContext);

    useEffect(() => { refreshApplications(); refreshSettings(); }, [refreshApplications, refreshSettings]);
    const [isAdding, setIsAdding] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [dept, setDept] = useState('Engineering');
    const [location, setLocation] = useState('Mumbai HQ');
    const [type, setType] = useState('Full-time');

    // Settings State
    const [emailDestination, setEmailDestination] = useState(careerSettings.emailDestination);
    const [crmWebhookUrl, setCrmWebhookUrl] = useState(careerSettings.crmWebhookUrl);
    const [spreadsheetSyncUrl, setSpreadsheetSyncUrl] = useState(careerSettings.spreadsheetSyncUrl);

    const handleSaveSettings = (e) => {
        e.preventDefault();
        setCareerSettings({ emailDestination, crmWebhookUrl, spreadsheetSyncUrl });
        setIsSettingsOpen(false);
        alert('Integration Settings Saved');
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this job posting?')) {
            deleteJob(id);
        }
    };

    const handleDeleteApp = (id) => {
        if(window.confirm('Are you sure you want to permanently delete this application?')) {
            deleteApplication(id);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const newJob = {
            title,
            dept,
            location,
            type
        };
        await addJob(newJob);
        setIsAdding(false);
        // Reset form
        setTitle('');
        setDept('Engineering');
        setLocation('Mumbai HQ');
        setType('Full-time');
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-syne font-bold text-evio-navy">Manage Careers</h1>
                    <p className="text-evio-black/60 font-inter">Add, edit, or remove open roles from the recruitment board.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsAdding(false); }}
                        className="bg-white border border-evio-black/10 text-evio-navy px-6 py-2.5 rounded-lg font-inter font-bold hover:bg-evio-light-gray transition-colors flex items-center shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Integrations
                    </button>
                    <button 
                        onClick={() => { setIsAdding(!isAdding); setIsSettingsOpen(false); }}
                        className="bg-evio-blue text-white px-6 py-2.5 rounded-lg font-inter font-bold hover:bg-evio-navy transition-colors flex items-center shadow-md"
                    >
                        {isAdding ? 'Cancel' : 'Post New Job'}
                        {!isAdding && (
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isSettingsOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20, overflow: 'hidden' }}
                        className="bg-evio-navy p-6 rounded-2xl shadow-sm border border-evio-black/5 mb-8 text-white relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-evio-blue opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                        
                        <h2 className="text-xl font-syne font-bold mb-2 z-10 relative">Application Form Integrations</h2>
                        <p className="text-white/70 font-inter text-sm mb-6 max-w-2xl z-10 relative">Configure where candidate profiles are routed. If webhooks are blank, applications trigger a local email client fallback.</p>
                        
                        <form onSubmit={handleSaveSettings} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-sm font-inter font-bold mb-2 text-white/90">HR Notification Email</label>
                                <input type="email" value={emailDestination} onChange={e => setEmailDestination(e.target.value)} required className="w-full max-w-2xl px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 focus:border-evio-blue outline-none text-white placeholder-white/30" placeholder="hr@evio.in" />
                                <p className="text-xs text-white/50 mt-1">Fallback 'mailto' destination if scripts are blocked.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-inter font-bold mb-2 text-white/90">CRM Webhook URL (e.g. Zapier, Make, HubSpot)</label>
                                <input type="url" value={crmWebhookUrl} onChange={e => setCrmWebhookUrl(e.target.value)} className="w-full max-w-2xl px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 focus:border-evio-blue outline-none text-white placeholder-white/30" placeholder="https://hooks.zapier.com/..." />
                                <p className="text-xs text-white/50 mt-1">Posts a JSON payload summarizing the candidate profile.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-inter font-bold mb-2 text-white/90">Spreadsheet Sync URL (Google Apps Script / Airtable)</label>
                                <input type="url" value={spreadsheetSyncUrl} onChange={e => setSpreadsheetSyncUrl(e.target.value)} className="w-full max-w-2xl px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 focus:border-evio-blue outline-none text-white placeholder-white/30" placeholder="https://script.google.com/macros/..." />
                            </div>
                            
                            <div className="flex pt-4">
                                <button type="submit" className="bg-evio-blue text-white px-8 py-2.5 rounded-lg font-inter font-bold hover:bg-white hover:text-evio-navy transition-colors shadow-lg shadow-evio-blue/20">
                                    Save Integrations
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20, overflow: 'hidden' }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 mb-8"
                    >
                        <h2 className="text-xl font-syne font-bold text-evio-navy mb-6">Create New Job Posting</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Job Title</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none" placeholder="e.g. Senior Project Manager" />
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Department</label>
                                    <select value={dept} onChange={e => setDept(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white">
                                        <option value="Engineering">Engineering</option>
                                        <option value="Automation">Automation</option>
                                        <option value="IT">IT</option>
                                        <option value="Management">Management</option>
                                        <option value="Operations">Operations</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Location</label>
                                    <select value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white">
                                        <option value="Mumbai HQ">Mumbai HQ</option>
                                        <option value="Pune">Pune</option>
                                        <option value="Bengaluru">Bengaluru</option>
                                        <option value="Remote">Remote</option>
                                        <option value="On-Site (Client)">On-Site (Client)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Employment Type</label>
                                    <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Part-time">Part-time</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t border-evio-black/5">
                                <button type="submit" className="bg-green-500 text-white px-8 py-2.5 rounded-lg font-inter font-bold hover:bg-green-600 transition-colors">
                                    Publish Job
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl shadow-sm border border-evio-black/5 overflow-hidden">
                <table className="w-full text-left font-inter">
                    <thead className="bg-evio-light-gray text-evio-black/60 text-sm font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b border-evio-black/5">Role</th>
                            <th className="px-6 py-4 border-b border-evio-black/5">Department</th>
                            <th className="px-6 py-4 border-b border-evio-black/5">Location</th>
                            <th className="px-6 py-4 border-b border-evio-black/5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {jobs.map((job) => (
                                <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, backgroundColor: '#fee2e2' }}
                                    key={job.id} 
                                    className="border-b border-evio-black/5 hover:bg-evio-light-gray/50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-bold text-evio-navy">{job.title}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-evio-blue/10 text-evio-blue px-3 py-1 rounded-full text-xs font-bold tracking-wider">{job.dept}</span>
                                    </td>
                                    <td className="px-6 py-4 text-evio-black/70 text-sm">{job.location}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(job.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete Role"
                                        >
                                            <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-evio-black/50">
                                    No active job postings.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Received Applications Inbox */}
            <h2 className="text-2xl font-syne font-bold text-evio-navy mt-16 mb-6 flex items-center">
                Received Applications 
                <span className="ml-3 bg-evio-blue text-white text-xs px-2.5 py-1 rounded-full font-bold">{applications ? applications.length : 0}</span>
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-evio-black/5 overflow-hidden">
                <table className="w-full text-left font-inter">
                    <thead className="bg-evio-light-gray text-evio-black/60 text-sm font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b border-evio-black/5">Date</th>
                            <th className="px-6 py-4 border-b border-evio-black/5">Candidate</th>
                            <th className="px-6 py-4 border-b border-evio-black/5">Applied Role</th>
                            <th className="px-6 py-4 border-b border-evio-black/5">Details & Note</th>
                            <th className="px-6 py-4 border-b border-evio-black/5 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {applications && applications.map((app) => (
                                <motion.tr 
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, backgroundColor: '#fee2e2' }}
                                    key={app.id} 
                                    className="border-b border-evio-black/5 hover:bg-evio-light-gray/50 transition-colors align-top"
                                >
                                    <td className="px-6 py-4 text-evio-black/70 text-sm whitespace-nowrap">
                                        {new Date(app.date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-evio-navy">{app.name}</div>
                                        <a href={`mailto:${app.email}`} className="text-sm text-evio-blue hover:underline block my-1">{app.email}</a>
                                        {app.phone && <a href={`tel:${app.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-evio-black/60 hover:underline">{app.phone}</a>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-evio-navy">{app.role}</div>
                                        {app.experience && <div className="text-sm text-evio-black/70 mt-1">{app.experience} yrs exp</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        {app.resume && (
                                            <button
                                                onClick={() => downloadApplicationResume(app.id, app.resume.slice(17)).catch(err => alert(err.message))}
                                                className="text-sm text-evio-blue hover:underline font-medium block mb-2 font-inter"
                                            >
                                                📄 Download Resume
                                            </button>
                                        )}
                                        {app.linkedin && (
                                            <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-sm text-evio-blue hover:underline font-medium block mb-2 font-inter">🔗 LinkedIn Profile</a>
                                        )}
                                        {app.note && (
                                            <div className="bg-evio-light-gray p-3 rounded-lg text-sm text-evio-black/70 italic border border-evio-black/5 max-w-sm">
                                                "{app.note}"
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleDeleteApp(app.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Delete Application"
                                        >
                                            <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {(!applications || applications.length === 0) && (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-evio-black/50">
                                    No incoming applications currently in the inbox.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
