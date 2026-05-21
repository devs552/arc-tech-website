'use client';

import { useState, useEffect } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, Card, FormPanel, GlowButton, CancelButton, ActionBtn } from '../theme/theme';
interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  link: string;
}

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    link: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setItems(data.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        image: formData.image,
        technologies: formData.technologies.split(',').map((t) => t.trim()),
        link: formData.link,
      };

      const url = editingId ? `/api/portfolio/${editingId}` : '/api/portfolio';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({ title: '', description: '', image: '', technologies: '', link: '' });
        setEditingId(null);
        setShowForm(false);
        fetchItems();
      }
    } catch (error) {
      console.error('Error saving item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      ...item,
      technologies: item.technologies.join(', '),
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
 
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData({ title: '', description: '', image: '', technologies: '', link: '' }); };
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
  <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Manage Portfolio" subtitle="Showcase your best projects" />
      </motion.div>
 
      <div style={{ marginBottom: 24 }}>
        {showForm ? <CancelButton onClick={closeForm}>Cancel</CancelButton> : <GlowButton onClick={() => setShowForm(true)}>+ Add Project</GlowButton>}
      </div>
 
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Project Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
              <FormField label="Description" textarea value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} required />
              <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} required />
              <FormField label="Technologies (comma-separated)" value={formData.technologies} onChange={(v) => setFormData({ ...formData, technologies: v })} placeholder="React, Next.js, Tailwind" />
              <FormField label="Project Link" value={formData.link} onChange={(v) => setFormData({ ...formData, link: v })} placeholder="https://…" />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Saving…' : editingId ? 'Update Project' : 'Create Project'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}
      >
        {items.map((item) => (
          <motion.div key={item._id} whileHover={{ scale: 1.02 }}>
            <Card style={{ overflow: 'hidden' }} hoverable>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '18px 20px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.headingText, margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: T.dimText, margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                {/* Tech badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {item.technologies.map((tech, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 999, background: T.techBg, border: `1px solid ${T.techBorder}`, color: T.techText }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ActionBtn variant="edit" onClick={() => handleEdit(item)} fullWidth>Edit</ActionBtn>
                  <ActionBtn variant="delete" onClick={() => handleDelete(item._id)} fullWidth>Delete</ActionBtn>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </PageShell>
        </div>
      </div>
    
  );
}
