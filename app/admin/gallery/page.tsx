'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence  } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, Card, FormPanel, GlowButton, CancelButton, ActionBtn } from '../theme/theme';
interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  category: string;
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(data.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ title: '', image: '', category: '' });
        setEditingId(null);
        setShowForm(false);
        fetchImages();
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setFormData(image);
    setEditingId(image._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData({ title: '', image: '', category: '' }); };
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
  <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Manage Gallery" subtitle="Upload and organize gallery images" />
      </motion.div>
 
      <div style={{ marginBottom: 24 }}>
        {showForm ? <CancelButton onClick={closeForm}>Cancel</CancelButton> : <GlowButton onClick={() => setShowForm(true)}>+ Add Image</GlowButton>}
      </div>
 
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
              <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} required />
              <FormField label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} required />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Saving…' : editingId ? 'Update Image' : 'Add Image'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
      >
        {images.map((img) => (
          <motion.div key={img._id} whileHover={{ scale: 1.04 }}>
            <Card style={{ overflow: 'hidden' }} hoverable>
              <img src={img.image} alt={img.title} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '12px 14px' }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: T.headingText, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.title}</h3>
                <p style={{ fontSize: 11, color: T.dimText, margin: '0 0 12px' }}>{img.category}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <ActionBtn variant="edit" onClick={() => handleEdit(img)} fullWidth>Edit</ActionBtn>
                  <ActionBtn variant="delete" onClick={() => handleDelete(img._id)} fullWidth>Delete</ActionBtn>
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
