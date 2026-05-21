'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, Card, FormPanel, GlowButton, CancelButton, ActionBtn, Badge } from '../theme/theme';
interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
}

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const blank = { title: '', content: '', image: '', category: '', isPublished: 'false' };
  const [formData, setFormData] = useState(blank);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setBlogs(data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        isPublished: formData.isPublished === 'true',
      };

      const url = editingId ? `/api/blogs/${editingId}` : '/api/blogs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({ title: '', content: '', image: '', category: '', isPublished: 'false' });
        setEditingId(null);
        setShowForm(false);
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setFormData({
      ...blog,
      isPublished: blog.isPublished ? 'true' : 'false',
    });
    setEditingId(blog._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData(blank); };
  const set = (key: string) => (val: string) => setFormData((f) => ({ ...f, [key]: val }));
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
  <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Manage Blogs" subtitle="Create and publish blog posts" />
      </motion.div>
 
      <div style={{ marginBottom: 24 }}>
        {showForm ? <CancelButton onClick={closeForm}>Cancel</CancelButton> : <GlowButton onClick={() => setShowForm(true)}>+ New Blog Post</GlowButton>}
      </div>
 
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Title" value={formData.title} onChange={set('title')} required />
              <FormField label="Category" value={formData.category} onChange={set('category')} required />
              <FormField label="Image URL" value={formData.image} onChange={set('image')} required />
              <FormField label="Content" textarea value={formData.content} onChange={set('content')} required />
              <FormField label="Status" type="select" value={formData.isPublished} onChange={set('isPublished')} options={[{ value: 'false', label: 'Draft' }, { value: 'true', label: 'Published' }]} />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Saving…' : editingId ? 'Update Blog' : 'Create Blog'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {blogs.map((blog) => (
          <motion.div key={blog._id} whileHover={{ scale: 1.01 }}>
            <Card style={{ display: 'flex', gap: 0, overflow: 'hidden' }} hoverable>
              <img
                src={blog.image} alt={blog.title}
                style={{ width: 110, flexShrink: 0, objectFit: 'cover', display: 'block' }}
              />
              <div style={{ flex: 1, padding: '18px 20px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: T.headingText, margin: 0, flex: 1, marginRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.title}</h3>
                  <Badge label={blog.isPublished ? 'Published' : 'Draft'} variant={blog.isPublished ? 'success' : 'warning'} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color: T.mutedText, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.08em' }}>{blog.category}</p>
                <p style={{ fontSize: 13, color: T.dimText, margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.content}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <ActionBtn variant="edit" onClick={() => handleEdit(blog)}>Edit</ActionBtn>
                  <ActionBtn variant="delete" onClick={() => handleDelete(blog._id)}>Delete</ActionBtn>
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
