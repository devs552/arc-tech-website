'use client';

import { useState, useEffect } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, Card, FormPanel, GlowButton, CancelButton, ActionBtn, Badge } from '../theme/theme';
interface HiringPost {
  _id: string;
  title: string;
  description: string;
  position: string;
  department: string;
  experience: string;
  salary: string;
  location: string;
  isActive: boolean;
}

export default function HiringAdminPage() {
  const [posts, setPosts] = useState<HiringPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const blank = { title: '', description: '', position: '', department: '', experience: '', salary: '', location: '', isActive: 'true' };
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: '',
    department: '',
    experience: '',
    salary: '',
    location: '',
    isActive: 'true',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/hiring');
      const data = await res.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching hiring posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        isActive: formData.isActive === 'true',
      };

      const url = editingId ? `/api/hiring/${editingId}` : '/api/hiring';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          position: '',
          department: '',
          experience: '',
          salary: '',
          location: '',
          isActive: 'true',
        });
        setEditingId(null);
        setShowForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: HiringPost) => {
    setFormData({
      ...post,
      isActive: post.isActive ? 'true' : 'false',
    });
    setEditingId(post._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/hiring/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
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
        <PageHeader title="Manage Hiring Posts" subtitle="Post job openings and manage career opportunities" />
      </motion.div>
 
      <div style={{ marginBottom: 24 }}>
        {showForm ? <CancelButton onClick={closeForm}>Cancel</CancelButton> : <GlowButton onClick={() => setShowForm(true)}>+ Post Job</GlowButton>}
      </div>
 
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Job Title" value={formData.title} onChange={set('title')} required />
              <FormField label="Position" value={formData.position} onChange={set('position')} required />
              <FormField label="Department" value={formData.department} onChange={set('department')} required />
              <FormField label="Experience Required" value={formData.experience} onChange={set('experience')} required />
              <FormField label="Salary Range" value={formData.salary} onChange={set('salary')} required />
              <FormField label="Location" value={formData.location} onChange={set('location')} required />
              <FormField label="Description" textarea value={formData.description} onChange={set('description')} required />
              <FormField label="Status" type="select" value={formData.isActive} onChange={set('isActive')} options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Saving…' : editingId ? 'Update Post' : 'Create Post'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}
      >
        {posts.map((post) => (
          <motion.div key={post._id} whileHover={{ scale: 1.02 }}>
            <Card style={{ padding: '22px' }} hoverable>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.headingText, margin: 0, flex: 1, marginRight: 10 }}>{post.title}</h3>
                <Badge label={post.isActive ? 'Active' : 'Inactive'} variant={post.isActive ? 'success' : 'warning'} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.editText, margin: '0 0 12px' }}>{post.position}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                {[
                  ['Department', post.department],
                  ['Location', post.location],
                  ['Salary', post.salary],
                  ['Experience', post.experience],
                ].map(([label, value]) => (
                  <p key={label} style={{ fontSize: 12, color: T.dimText, margin: 0 }}>
                    <span style={{ color: T.mutedText }}>{label}:</span> {value}
                  </p>
                ))}
              </div>
              <p style={{ fontSize: 12, color: T.headingText, margin: '0 0 16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.description}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <ActionBtn variant="edit" onClick={() => handleEdit(post)} fullWidth>Edit</ActionBtn>
                <ActionBtn variant="delete" onClick={() => handleDelete(post._id)} fullWidth>Delete</ActionBtn>
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
