import { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { DataContext } from '../context/DataContext';

// Post content is plain text: paragraphs separated by blank lines, "- " lines are bullets.
const renderContent = (content = '') => {
    const out = [];
    let list = [];
    const flush = () => {
        if (list.length) out.push(<ul key={`ul-${out.length}`} className="list-disc pl-6 space-y-2 mb-6">{list}</ul>);
        list = [];
    };
    content.split(/\n{2,}/).forEach((block, i) => {
        const text = block.trim();
        if (!text) return;
        if (text.startsWith('- ')) { list.push(<li key={i}>{text.slice(2)}</li>); return; }
        flush();
        // ponytail: short line without end punctuation = section heading (the source has no heading markup)
        out.push(text.length < 70 && !/[.:,!?]$/.test(text)
            ? <h2 key={i} className="text-2xl font-syne font-bold text-evio-navy mt-10 mb-4">{text}</h2>
            : <p key={i} className="mb-6">{text}</p>);
    });
    flush();
    return out;
};

export const BlogPost = () => {
    const { postId } = useParams();
    const { blogPosts } = useContext(DataContext);
    const post = blogPosts.find(p => String(p.id) === postId);

    if (!post) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 pt-32 text-center">
                <p className="font-inter text-evio-black/60 mb-4">{blogPosts.length ? 'This article could not be found.' : 'Loading article...'}</p>
                <Link to="/blog" className="text-evio-blue font-inter font-bold hover:underline">Back to all articles</Link>
            </div>
        );
    }

    return (
        <article className="w-full bg-white">
            <Helmet>
                <title>{`${post.title} | EVIO Blog`}</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <header className="bg-gradient-to-br from-[#051a15] via-[#0b2b23] to-[#031511] pt-36 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    <Link to="/blog" className="inline-flex items-center text-white/60 hover:text-white font-inter text-sm mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" /> All articles
                    </Link>
                    <p className="text-xs font-inter font-bold uppercase tracking-widest text-[#4ade80] mb-4">{post.category} · {post.readTime}</p>
                    <h1 className="text-3xl md:text-5xl font-syne font-bold text-white leading-tight mb-4">{post.title}</h1>
                    <p className="font-inter text-white/60">{post.date}</p>
                </div>
            </header>

            {post.image && (
                <div className="max-w-4xl mx-auto px-6 -mt-2 pt-10">
                    <img src={post.image} alt="" className="w-full rounded-3xl aspect-[16/9] object-cover" />
                </div>
            )}

            <div className="max-w-3xl mx-auto px-6 py-12 font-inter text-lg text-evio-black/80 leading-relaxed">
                {renderContent(post.content)}
            </div>

            <aside className="max-w-3xl mx-auto px-6 pb-24">
                <div className="bg-evio-light-gray rounded-3xl p-8 text-center">
                    <h2 className="text-2xl font-syne font-bold text-evio-navy mb-3">Have a similar project?</h2>
                    <p className="font-inter text-evio-black/60 mb-6">Talk to our engineering team about your requirements.</p>
                    <Link to={`/contact?ref=blog:${post.id}`} className="inline-flex px-8 py-3 bg-evio-blue text-white font-inter font-bold rounded-xl hover:bg-evio-navy transition-colors">
                        Discuss your project
                    </Link>
                </div>
            </aside>
        </article>
    );
};
