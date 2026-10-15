import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataContext } from '../../context/DataContext';

export const AdminCSR = () => {
    const { csrInitiatives, addCsr, deleteCsr } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Community');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to remove this CSR initiative?')) {
            deleteCsr(id);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const newInitiative = {
            title,
            category,
            date,
            description,
            image: image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop'
        };
        await addCsr(newInitiative);
        setIsAdding(false);
        // Reset form
        setTitle('');
        setCategory('Community');
        setDate('');
        setDescription('');
        setImage('');
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-syne font-bold text-evio-navy">Manage CSR Initiatives</h1>
                    <p className="text-evio-black/60 font-inter">Add or remove corporate social responsibility projects and impact events.</p>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-evio-blue text-white px-6 py-2.5 rounded-lg font-inter font-bold hover:bg-evio-navy transition-colors flex items-center shadow-md"
                >
                    {isAdding ? 'Cancel' : 'Add Initiative'}
                    {!isAdding && (
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    )}
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20, overflow: 'hidden' }}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-evio-black/5 mb-8"
                    >
                        <h2 className="text-xl font-syne font-bold text-evio-navy mb-6">Create New Initiative</h2>
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Initiative Title</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none" placeholder="e.g. Tree Plantation Drive" />
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">CSR Pillar</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white">
                                        <option value="Community">Community</option>
                                        <option value="Education">Education</option>
                                        <option value="Health">Health</option>
                                        <option value="Environment">Environment</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Date / Status</label>
                                    <input type="text" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none" placeholder="e.g. Nov 2024 or Ongoing" />
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Cover Image URL</label>
                                    <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none" placeholder="https://unsplash.com/..." />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Short Description</label>
                                <textarea required rows="3" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none resize-none" placeholder="Briefly describe the impact of this event..."></textarea>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-evio-black/5">
                                <button type="submit" className="bg-green-500 text-white px-8 py-2.5 rounded-lg font-inter font-bold hover:bg-green-600 transition-colors">
                                    Publish Initiative
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {csrInitiatives.map((item) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={item.id} 
                            className="bg-white rounded-[24px] overflow-hidden shadow-sm flex flex-col group border border-evio-black/5 relative"
                        >
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                title="Delete Initiative"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            
                            <div className="relative overflow-hidden h-48">
                                <div className="absolute top-4 left-4 z-10">
                                     <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-evio-blue text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                        {item.category}
                                    </span>
                                </div>
                                <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-xs font-inter text-evio-black/40 mb-2">{item.date}</p>
                                <h3 className="text-lg font-bold font-syne text-evio-navy mb-2 line-clamp-2">{item.title}</h3>
                                <p className="text-evio-black/70 font-inter text-sm leading-relaxed line-clamp-3">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {csrInitiatives.length === 0 && (
                     <div className="col-span-3 text-center py-12 text-evio-black/50 font-inter">
                         No CSR initiatives active.
                     </div>
                )}
            </div>
        </div>
    );
};
