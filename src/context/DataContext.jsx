import React, { createContext, useState, useEffect, useCallback } from 'react';

export const DataContext = createContext();

// Remove hardcoded JSON states, we rely on the DB now
// Only real documents here. Add the DC capability deck / ISO certificates once EVIO supplies them.
const initialDownloadCategories = [
    {
        title: 'Corporate Profiles',
        items: [
            { id: 1, name: 'EVIO Company Brochure 2026', file: '/downloads/EVIO-Company-Brochure-2026.pdf', format: 'PDF', date: '8 pages' }
        ]
    }
];

export const DataProvider = ({ children }) => {
    const [jobs, setJobs] = useState([]);
    const [csrInitiatives, setCsrInitiatives] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    
    const [applications, setApplications] = useState([]);
    
    // Downloads remain static for now as they aren't in SQLite
    const [downloadCategories, setDownloadCategories] = useState(initialDownloadCategories);
    
    const [careerSettings, setCareerSettings] = useState({
        emailDestination: 'hr@evio.in',
        crmWebhookUrl: '',
        spreadsheetSyncUrl: ''
    });

    // Load state from Express API
    useEffect(() => {
        const loadFromAPI = async () => {
            try {
                // Fetch Jobs
                const resJobs = await fetch('/api/jobs');
                const dataJobs = await resJobs.json();
                setJobs(dataJobs);

                // Fetch CSR
                const resCsr = await fetch('/api/csr');
                const dataCsr = await resCsr.json();
                setCsrInitiatives(dataCsr);

                // Fetch Blogs
                const resBlog = await fetch('/api/blogs');
                const dataBlog = await resBlog.json();
                setBlogPosts(dataBlog);

            } catch (err) {
                console.error("Failed to fetch data from backend API:", err);
            }
        };

        loadFromAPI();
        // Old builds kept the admin token in localStorage; sessions are HttpOnly cookies now.
        try { localStorage.removeItem('evio_admin_token'); } catch { /* storage blocked */ }
    }, []);

    // Leads are admin-only, so they are (re)loaded by the admin pages after login, not on site load
    // Admin data uses the HttpOnly session cookie, which same-origin fetch sends automatically.
    const refreshInquiries = useCallback(async () => {
        try {
            const res = await fetch('/api/inquiries');
            if (res.ok) setInquiries(await res.json());
        } catch (err) { console.error('Failed to load leads:', err); }
    }, []);

    // Settings are admin-only (they include internal integration URLs)
    const refreshSettings = useCallback(async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                setCareerSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) { console.error('Failed to load settings:', err); }
    }, []);

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json' });

    const updateCareerSettings = async (newSettings) => {
        try {
            await fetch('/api/settings', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newSettings)
            });
            setCareerSettings(newSettings);
        } catch (err) {
            console.error("Failed to update settings:", err);
            // Even if API fails, update local state for UI responsiveness
            setCareerSettings(newSettings);
        }
    };

    // --- API WRAPPERS FOR CRUD ---

    const apiAddJob = async (newJobData) => {
        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newJobData)
            });
            const dbJob = await res.json();
            setJobs([...jobs, dbJob]);
        } catch (err) { console.error(err); }
    };

    const apiDeleteJob = async (id) => {
        try {
            await fetch(`/api/jobs/${id}`, { 
                method: 'DELETE',
                headers: getAuthHeaders() 
            });
            setJobs(jobs.filter(j => j.id !== id));
        } catch (err) { console.error(err); }
    };

    const apiAddCsr = async (newCsrData) => {
        try {
            const res = await fetch('/api/csr', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newCsrData)
            });
            const dbCsr = await res.json();
            setCsrInitiatives([...csrInitiatives, dbCsr]);
        } catch (err) { console.error(err); }
    };

    const apiDeleteCsr = async (id) => {
        try {
            await fetch(`/api/csr/${id}`, { 
                method: 'DELETE',
                headers: getAuthHeaders() 
            });
            setCsrInitiatives(csrInitiatives.filter(c => c.id !== id));
        } catch (err) { console.error(err); }
    };

    const apiAddBlog = async (newBlogData) => {
        try {
            const res = await fetch('/api/blogs', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(newBlogData)
            });
            const dbBlog = await res.json();
            setBlogPosts([...blogPosts, dbBlog]);
        } catch (err) { console.error(err); }
    };

    const apiDeleteBlog = async (id) => {
        try {
            await fetch(`/api/blogs/${id}`, { 
                method: 'DELETE',
                headers: getAuthHeaders() 
            });
            setBlogPosts(blogPosts.filter(b => b.id !== id));
        } catch (err) { console.error(err); }
    };

    const apiDeleteInquiry = async (id) => {
        try {
            await fetch(`/api/inquiries/${id}`, { 
                method: 'DELETE',
                headers: getAuthHeaders() 
            });
            setInquiries(inquiries.filter(i => i.id !== id));
        } catch (err) { console.error(err); }
    };

    const updateInquiry = async (id, patch) => {
        const res = await fetch(`/api/inquiries/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(patch)
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i.id === id ? updated : i));
    };

    // Admin files need the auth header, so fetch as a blob instead of a plain link
    const downloadFile = async (url, filename) => {
        const res = await fetch(url, { headers: getAuthHeaders() });
        if (!res.ok) throw new Error('File not found');
        const blobUrl = URL.createObjectURL(await res.blob());
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(blobUrl);
    };
    const downloadInquiryAttachment = (id, filename) => downloadFile(`/api/inquiries/${id}/attachment`, filename);

    // Job applications (admin-only, stored server-side)
    const refreshApplications = useCallback(async () => {
        try {
            const res = await fetch('/api/applications');
            if (res.ok) setApplications(await res.json());
        } catch (err) { console.error('Failed to load applications:', err); }
    }, []);

    const deleteApplication = async (id) => {
        const res = await fetch(`/api/applications/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
        if (res.ok) setApplications(prev => prev.filter(a => a.id !== id));
    };

    const downloadApplicationResume = (id, filename) => downloadFile(`/api/applications/${id}/resume`, filename);

    return (
        <DataContext.Provider value={{
            jobs, 
            addJob: apiAddJob, 
            deleteJob: apiDeleteJob,
            csrInitiatives, 
            addCsr: apiAddCsr, 
            deleteCsr: apiDeleteCsr,
            blogPosts, 
            addBlog: apiAddBlog, 
            deleteBlog: apiDeleteBlog,
            downloadCategories, 
            setDownloadCategories,
            careerSettings, 
            setCareerSettings: updateCareerSettings,
            inquiries, 
            deleteInquiry: apiDeleteInquiry,
            refreshInquiries,
            updateInquiry,
            downloadInquiryAttachment,
            applications,
            refreshApplications,
            refreshSettings,
            deleteApplication,
            downloadApplicationResume
        }}>
            {children}
        </DataContext.Provider>
    );
};
