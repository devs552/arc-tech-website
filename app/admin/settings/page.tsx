'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, GlowButton, SectionHeading } from '../theme/theme';
interface Settings {
  _id: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyLocation: string;
  companyDescription: string;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyLocation: '',
    companyDescription: '',
    logo: '',
    favicon: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      setFormData({
        companyName: data.companyName,
        companyEmail: data.companyEmail,
        companyPhone: data.companyPhone,
        companyLocation: data.companyLocation,
        companyDescription: data.companyDescription,
        logo: data.logo,
        favicon: data.favicon,
        facebook: data.socialLinks?.facebook || '',
        twitter: data.socialLinks?.twitter || '',
        linkedin: data.socialLinks?.linkedin || '',
        instagram: data.socialLinks?.instagram || '',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyPhone: formData.companyPhone,
        companyLocation: formData.companyLocation,
        companyDescription: formData.companyDescription,
        logo: formData.logo,
        favicon: formData.favicon,
        socialLinks: {
          facebook: formData.facebook,
          twitter: formData.twitter,
          linkedin: formData.linkedin,
          instagram: formData.instagram,
        },
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        fetchSettings();
        // Update favicon dynamically
        if (formData.favicon) {
          updateFavicon(formData.favicon);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFavicon = (url: string) => {
    // Remove existing favicon link
    const existingLink = document.querySelector('link[rel="icon"]');
    if (existingLink) {
      existingLink.remove();
    }

    // Create and add new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
  };
  const set = (key: string) => (val: string) => setFormData((f) => ({ ...f, [key]: val }));
   const sectionStyle: React.CSSProperties = {
    background: T.formBg,
    border: `1px solid ${T.formBorder}`,
    borderRadius: 14,
    padding: '24px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginBottom: 20,
  };
 
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
      <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Settings" subtitle="Configure your company information" />
      </motion.div>
 
      <form onSubmit={handleSubmit}>
        {/* Company */}
        <div style={sectionStyle}>
          <SectionHeading>Company Information</SectionHeading>
          <FormField label="Company Name" value={formData.companyName} onChange={set('companyName')} required />
          <FormField label="Company Email" type="email" value={formData.companyEmail} onChange={set('companyEmail')} />
          <FormField label="Company Phone" value={formData.companyPhone} onChange={set('companyPhone')} />
          <FormField label="Company Location" value={formData.companyLocation} onChange={set('companyLocation')} />
          <FormField label="Company Description" textarea value={formData.companyDescription} onChange={set('companyDescription')} />
        </div>
 
        {/* Media */}
        <div style={sectionStyle}>
          <SectionHeading>Media</SectionHeading>
          <FormField label="Logo URL" value={formData.logo} onChange={set('logo')} />
          <FormField disabled label="Favicon URL" value={formData.favicon} onChange={set('favicon')} />
        </div>
 
        {/* Social */}
        <div style={sectionStyle}>
          <SectionHeading>Social Links</SectionHeading>
          <FormField label="Facebook" value={formData.facebook} onChange={set('facebook')} placeholder="https://facebook.com/…" />
          <FormField label="Twitter" value={formData.twitter} onChange={set('twitter')} placeholder="https://twitter.com/…" />
          <FormField label="LinkedIn" value={formData.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/…" />
          <FormField label="Instagram" value={formData.instagram} onChange={set('instagram')} placeholder="https://instagram.com/…" />
        </div>
 
        <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
          {isLoading ? 'Saving…' : saved ? '✓ Saved!' : 'Save Settings'}
        </GlowButton>
      </form>
    </PageShell>
        </div>
      </div>
  
  );
}
