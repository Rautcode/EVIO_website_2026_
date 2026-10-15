const nodemailer = require('nodemailer');

// 1. Configure the transporter
// This requires the SMTP variables to be present in /server/.env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

// 2. Routing. Leads and job applications are routed separately so a sales
// enquiry can never land in a recruiting inbox (and vice versa).

// Sales leads: values of the projectType <select> in Contact.jsx
const getLeadEmail = (projectType = '') => {
    if (/data cent/i.test(projectType)) {
        return process.env.SMTP_DATACENTRE_EMAIL || process.env.SMTP_PROJECTS_EMAIL || 'projects@evio.in';
    }
    if (/automation/i.test(projectType)) {
        return process.env.SMTP_AUTOMATION_EMAIL || 'automation@evio.in';
    }
    return process.env.SMTP_PROJECTS_EMAIL || 'projects@evio.in';
};

// Job applications: values of the role <select> in Careers.jsx
const CAREERS_ROUTES = {
    'Electrical Engineering': 'SMTP_ENGINEERING_EMAIL',
    'Automation Engineering': 'SMTP_ENGINEERING_EMAIL',
    'Site Supervisor': 'SMTP_OPERATIONS_EMAIL',
    'Project Management': 'SMTP_MANAGEMENT_EMAIL',
    'Business Development': 'SMTP_MANAGEMENT_EMAIL',
};
const getCareersEmail = (role) =>
    process.env[CAREERS_ROUTES[role]] || process.env.SMTP_HR_EMAIL || 'hr@evio.in';

// 3. Reusable Mail Sender Function
const sendMail = async ({ to, subject, html, attachments = [] }) => {
    // In production a missing SMTP config must fail loudly, never pretend to send.
    // In dev, log and continue so the UI can be exercised without credentials.
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('SMTP credentials are not configured');
        }
        console.warn('⚠️ SMTP credentials missing in .env! Simulating email send to:', to);
        console.warn('Subject:', subject);
        return true; 
    }

    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'EVIO Website'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            attachments
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {
    sendMail,
    getLeadEmail,
    getCareersEmail
};
