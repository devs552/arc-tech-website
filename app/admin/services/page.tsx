'use client';

import { useState, useEffect } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, Card, FormPanel, GlowButton, CancelButton, ActionBtn } from '../theme/theme';
interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export default function ServicesAdminPage() {
   const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', icon: '', image: '' });
 
  useEffect(() => { fetchServices(); }, []);
 
  const fetchServices = async () => {
    try {
      setIsFetching(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      setServices(data.data);
    } catch { setError('Failed to load services'); }
    finally { setIsFetching(false); }
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setFormData({ title: '', description: '', icon: '', image: '' });
      setEditingId(null);
      setShowForm(false);
      fetchServices();
    } catch { setError('Failed to save service'); }
    finally { setIsLoading(false); }
  };
 
  const handleEdit = (s: Service) => {
    setFormData(s);
    setEditingId(s._id);
    setShowForm(true);
  };
 
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch { setError('Failed to delete service'); }
  };
   const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', icon: '', image: '' });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Manage Services" subtitle="Add, edit, and manage your services" />
      </motion.div>
 
      {/* Actions row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {showForm ? (
          <CancelButton onClick={closeForm}>Cancel</CancelButton>
        ) : (
          <GlowButton onClick={() => setShowForm(true)}>+ Add Service</GlowButton>
        )}
      </div>
 
      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              marginBottom: 20, padding: '12px 16px', borderRadius: 10,
              background: T.errorAlertBg, border: `1px solid ${T.errorAlertBorder}`,
              color: T.errorAlertText, fontSize: 13,
            }}
          >
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
              <FormField label="Description" textarea value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} required />
              <FormField label="Icon" value={formData.icon} onChange={(v) => setFormData({ ...formData, icon: v })} />
              <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} required />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Saving…' : editingId ? 'Update Service' : 'Create Service'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}
      >
        {isFetching
          ? [...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 160, borderRadius: 14, background: T.skeletonBg, animation: 'pulse 1.5s infinite' }} />
            ))
          : services.length === 0
          ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '64px 0', color: T.mutedText, fontSize: 14 }}>
              No services found
            </div>
          )
          : services.map((service) => (
            <motion.div key={service._id} whileHover={{ scale: 1.02 }}>
              <Card style={{ padding: '22px' }} hoverable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ fontSize: 28 }}>{service.icon}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ActionBtn variant="edit" onClick={() => handleEdit(service)}>Edit</ActionBtn>
                    <ActionBtn variant="delete" onClick={() => handleDelete(service._id)}>Delete</ActionBtn>
                  </div>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.headingText, margin: '0 0 8px' }}>{service.title}</h3>
                <p style={{ fontSize: 13, color: T.dimText, margin: 0, lineHeight: 1.6 }}>{service.description}</p>
              </Card>
            </motion.div>
          ))}
      </motion.div>
    </PageShell>
      </div>
    </div>
  );
}