import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/Home'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/admin/AdminLayout'
import { DataProvider } from './context/DataContext'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import { captureFirstTouch, loadAnalytics } from './lib/leads'

captureFirstTouch()
try { if (localStorage.getItem('evio_cookie_consent') === 'accepted') loadAnalytics() } catch { /* storage blocked */ }

// Lazy loaded routes for code splitting
const AboutUs = React.lazy(() => import('./pages/AboutUs').then(m => ({ default: m.AboutUs })))
const Services = React.lazy(() => import('./pages/Services').then(m => ({ default: m.Services })))
const ServiceDetail = React.lazy(() => import('./pages/ServiceDetail').then(m => ({ default: m.ServiceDetail })))
const DataCentres = React.lazy(() => import('./pages/DataCentres').then(m => ({ default: m.DataCentres })))
const ProjectsGallery = React.lazy(() => import('./pages/ProjectsGallery').then(m => ({ default: m.ProjectsGallery })))
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })))
const ClientsAndTestimonials = React.lazy(() => import('./pages/ClientsAndTestimonials').then(m => ({ default: m.ClientsAndTestimonials })))
const CSRInitiatives = React.lazy(() => import('./pages/CSRInitiatives').then(m => ({ default: m.CSRInitiatives })))
const Careers = React.lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })))
const LifeAtEvio = React.lazy(() => import('./pages/LifeAtEvio').then(m => ({ default: m.LifeAtEvio })))
const Blog = React.lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })))
const BlogPost = React.lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })))
const Contact = React.lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })))
const Downloads = React.lazy(() => import('./pages/Downloads').then(m => ({ default: m.Downloads })))
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })))
const TermsOfService = React.lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })))

// Lazy loaded admin routes
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })))
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })))
const AdminCareers = React.lazy(() => import('./pages/admin/AdminCareers').then(m => ({ default: m.AdminCareers })))
const AdminCSR = React.lazy(() => import('./pages/admin/AdminCSR').then(m => ({ default: m.AdminCSR })))
const AdminBlog = React.lazy(() => import('./pages/admin/AdminBlog').then(m => ({ default: m.AdminBlog })))
const AdminInquiries = React.lazy(() => import('./pages/admin/AdminInquiries').then(m => ({ default: m.AdminInquiries })))
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects').then(m => ({ default: m.AdminProjects })))
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })))
const AdminActivity = React.lazy(() => import('./pages/admin/AdminActivity').then(m => ({ default: m.AdminActivity })))
const AdminAccount = React.lazy(() => import('./pages/admin/AdminAccount').then(m => ({ default: m.AdminAccount })))

// Branded Loading Fallback
const PageLoader = () => (
  <div className="w-full h-screen fixed inset-0 bg-evio-navy flex flex-col items-center justify-center z-[9999]">
    <div className="w-16 h-16 border-4 border-white/10 border-t-evio-blue rounded-full animate-spin"></div>
    <div className="mt-6 text-white tracking-widest font-syne uppercase text-sm font-bold">Loading</div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <DataProvider>
        <BrowserRouter>
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Views */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="services" element={<Services />} />
              <Route path="services/data-center" element={<Navigate to="/data-centres" replace />} />
              <Route path="services/:serviceId" element={<ServiceDetail />} />
              <Route path="data-centres" element={<DataCentres />} />
              <Route path="projects" element={<ProjectsGallery />} />
              <Route path="projects/:projectId" element={<ProjectDetail />} />
              <Route path="clients" element={<ClientsAndTestimonials />} />
              <Route path="csr" element={<CSRInitiatives />} />
              <Route path="careers" element={<Careers />} />
              <Route path="life-at-evio" element={<LifeAtEvio />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:postId" element={<BlogPost />} />
              <Route path="contact" element={<Contact />} />
              <Route path="downloads" element={<Downloads />} />
              <Route path="privacy" element={<PrivacyPolicy />} />
              <Route path="terms" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Views */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="careers" element={<AdminCareers />} />
                <Route path="csr" element={<AdminCSR />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="activity" element={<AdminActivity />} />
                <Route path="account" element={<AdminAccount />} />
            </Route>
          </Routes>
        </React.Suspense>
        </BrowserRouter>
      </DataProvider>
    </HelmetProvider>
  </React.StrictMode>
);
