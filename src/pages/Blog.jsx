import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';



import { PageHero } from '../components/ui/PageHero';
import { DataContext } from '../context/DataContext';

export const Blog = () => {
    const { blogPosts } = useContext(DataContext);
    

    return (
        <div className="w-full flex flex-col min-h-screen bg-evio-light-gray">
            <Helmet>
                <title>Blog & Insights | EVIO Updates</title>
                <meta name="description" content="Read the latest engineering thoughts, company news, and technical deep-dives from the EVIO team." />
            </Helmet>
            
            {/* Hero */}
            <PageHero eyebrow="Blog" title="Insights & updates" subtitle="Project write-ups, standards and technical notes from the EVIO team." image="/images/projects/real/dandi-kutir.jpg" />

            {/* Grid */}
            <section className="py-8 px-6 pb-24 max-w-7xl mx-auto w-full blog-grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link to={`/blog/${post.id}`} key={post.id} className="blog-card bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-evio-black/5 flex flex-col group cursor-pointer hover:-translate-y-2">
                            <div className="relative h-60 overflow-hidden">
                                {post.image
                                    ? <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                                    : <div className="w-full h-full bg-evio-navy flex items-center justify-center font-syne font-bold text-3xl text-white/15">EVIO</div>}
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-syne font-bold uppercase tracking-wider text-evio-blue shadow-sm">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow relative">
                                <div className="flex items-center gap-4 mb-4 text-xs font-inter text-evio-black/50">
                                    <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{post.date}</span>
                                </div>
                                <h3 className="text-xl font-syne font-bold text-evio-navy mb-3 group-hover:text-evio-blue transition-colors line-clamp-2">
                                    {post.title}
                               </h3>
                                <p className="text-evio-black/60 font-inter text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                                   {post.excerpt}
                                </p>
                                <div className="mt-auto pt-4 border-t border-evio-black/5">
                                    <span className="text-sm font-inter font-bold text-evio-navy group-hover:text-evio-blue flex items-center transition-colors">
                                        Read More
                                        <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

        </div>
    );
};
