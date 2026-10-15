import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password })
            });
            if (res.ok) {
                navigate('/admin');
            } else {
                setError(true);
                setTimeout(() => setError(false), 3000);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-evio-navy flex items-center justify-center p-6 relative overflow-hidden">
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[24px] shadow-2xl p-8 md:p-12 w-full max-w-md relative z-10 border border-evio-blue/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-syne font-bold text-evio-navy mb-2">Admin Portal</h1>
                    <p className="text-evio-black/60 font-inter text-sm">Enter the master password to access the content management system.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-inter text-evio-navy font-bold mb-2">Master Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-evio-black/10 focus:border-evio-blue focus:ring-1 focus:ring-evio-blue'}`}
                            placeholder="••••••••"
                            required
                        />
                        {error && <p className="text-red-500 text-xs font-inter mt-2">Incorrect password. Please try again.</p>}
                    </div>
                    
                    <button type="submit" className="w-full bg-evio-blue text-white font-inter font-bold py-3 rounded-lg hover:bg-evio-navy transition-colors flex justify-center items-center">
                        Secure Login
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                    <p className="text-center text-xs text-evio-black/40 font-inter mt-4">Hint: evio2024</p>
                </form>
            </motion.div>
        </div>
    );
};
