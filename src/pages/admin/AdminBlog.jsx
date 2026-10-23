import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import { api } from '../../lib/adminApi';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { LinkedInPost } from '../../components/admin/LinkedInPost';

export const AdminBlog = () => {
    const { blogPosts, addBlog, deleteBlog } = useContext(DataContext);
    const [isAdding, setIsAdding] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Company News');
    const [readTime, setReadTime] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [image, setImage] = useState('');
    const [content, setContent] = useState('');
    const { aiEnabled } = useOutletContext();
    const [notes, setNotes] = useState('');
    const [drafting, setDrafting] = useState(false);
    const [error, setError] = useState('');
    const [share, setShare] = useState(null);

    const shareItem = (post) => setShare({ title: post.title, summary: post.excerpt, path: `/blog/${post.id}` });

    const draft = async () => {
        setDrafting(true); setError('');
        try {
            const d = await api('/api/ai/draft', { method: 'POST', body: { kind: 'blog', notes } });
            setTitle(d.title); setExcerpt(d.excerpt); setCategory(d.category); setReadTime(String(d.readTimeMinutes || '')); setContent(d.content);
        } catch (err) { setError(err.message); }
        setDrafting(false);
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this blog post?')) {
            deleteBlog(id);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        
        // Generate formatted date (e.g., October 12, 2024)
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

        const newPost = {
            title,
            category,
            date: formattedDate,
            readTime: `${readTime} min read`,
            excerpt,
            image,
            content,
        };
        const saved = await addBlog(newPost);
        if (!saved) return setError('The article could not be published. Please try again.');
        setIsAdding(false);
        shareItem(saved);
        setContent(''); setNotes('');
        // Reset form
        setTitle('');
        setCategory('Company News');
        setReadTime('');
        setExcerpt('');
        setImage('');
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-syne font-bold text-evio-navy">Manage Blog Posts</h1>
                    <p className="text-evio-black/60 font-inter">Compose announcements, case studies, and technical insights.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-evio-blue text-white px-6 py-2.5 rounded-lg font-inter font-bold hover:bg-evio-navy transition-colors flex items-center shadow-md"
                >
                    {isAdding ? 'Cancel' : 'Compose New Post'}
                    {!isAdding && (
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
                        <h2 className="text-xl font-syne font-bold text-evio-navy mb-6">Compose Article</h2>
                        {aiEnabled && (
                            <div className="bg-evio-blue/5 border border-evio-blue/20 rounded-xl p-5 mb-6">
                                <p className="font-syne font-bold text-evio-navy mb-1">✨ Draft with AI</p>
                                <p className="text-sm text-evio-black/60 mb-3">Paste rough notes; the AI writes the headline, summary and article from those facts only. Review before publishing.</p>
                                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="4" aria-label="Notes for the AI draft" className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white text-sm" />
                                <button type="button" onClick={draft} disabled={drafting || notes.trim().length < 20} className="mt-2 bg-evio-navy text-white px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-50">{drafting ? 'Drafting… (up to a minute)' : 'Write the article from my notes'}</button>
                            </div>
                        )}
                        <form onSubmit={handleAdd} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Headline</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none text-lg" placeholder="e.g. The Future of Industrial Automation" />
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none bg-white">
                                        <option value="Company News">Company News</option>
                                        <option value="Technical Insights">Technical Insights</option>
                                        <option value="Case Studies">Case Studies</option>
                                        <option value="HSE Policies">HSE Policies</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Estimated Read Time (Minutes)</label>
                                    <input type="number" min="1" max="60" value={readTime} onChange={e => setReadTime(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none" placeholder="e.g. 5" />
                                </div>
                                <div className="md:col-span-2">
                                    <ImageUpload label="Cover image" value={image} onChange={setImage} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Article Excerpt</label>
                                <textarea required rows="4" value={excerpt} onChange={e => setExcerpt(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none resize-none" placeholder="Write a compelling 2-3 sentence summary of the article..."></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Article</label>
                                <textarea required rows="14" value={content} onChange={e => setContent(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-evio-black/10 focus:border-evio-blue outline-none font-inter text-sm" placeholder={'Separate paragraphs with a blank line.\nA short line with no full stop becomes a heading.\n- Lines starting with a dash become bullet points'}></textarea>
                            </div>
                            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

                            <div className="flex justify-end pt-4 border-t border-evio-black/5">
                                <button type="submit" className="bg-green-500 text-white px-8 py-2.5 rounded-lg font-inter font-bold hover:bg-green-600 transition-colors">
                                    Publish Article
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {share && <LinkedInPost item={share} onClose={() => setShare(null)} />}

            <div className="space-y-4">
                <AnimatePresence>
                    {blogPosts.map((post) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key={post.id} 
                            className="bg-white rounded-2xl p-6 shadow-sm border border-evio-black/5 flex flex-col md:flex-row gap-6 relative group"
                        >
                            {typeof post.id === 'string' ? (
                                <span className="absolute top-4 right-4 z-20 text-[10px] font-bold uppercase tracking-wider text-evio-black/40" title="Built into the website code; edit src/data/blogPosts.json to change it">Built-in</span>
                            ) : (
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="absolute top-4 right-4 z-20 bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                                title="Delete Post"
                            >
                                <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                            )}

                            <div className="w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden relative">
                                <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-evio-navy px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
                                    {post.category}
                                </span>
                                {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-evio-navy" />}
                            </div>
                            
                            <div className="flex flex-col flex-grow justify-center pr-12">
                                <h3 className="text-xl font-bold font-syne text-evio-navy mb-2">{post.title}</h3>
                                <p className="text-evio-black/70 font-inter text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center text-xs font-inter font-medium text-evio-black/50 space-x-4">
                                    <span className="flex items-center">
                                         <svg className="w-4 h-4 mr-1 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Published on {post.date}
                                    </span>
                                    <span className="flex items-center">
                                         <svg className="w-4 h-4 mr-1 text-evio-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {post.readTime}
                                    </span>
                                    <button onClick={() => shareItem(post)} className="text-[#0a66c2] font-semibold hover:underline">LinkedIn post</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {blogPosts.length === 0 && (
                     <div className="text-center py-12 text-evio-black/50 font-inter bg-white rounded-2xl border border-dashed border-evio-black/20">
                         No articles published yet.
                     </div>
                )}
            </div>
        </div>
    );
};
