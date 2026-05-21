'use client';

import { useState, useEffect } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, Card, FormPanel, GlowButton, CancelButton, ActionBtn } from '../theme/theme';
interface TeamMember {
  _id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  email: string;
}

export default function TeamAdminPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    image: '',
    bio: '',
    email: '',
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setMembers(data.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/team/${editingId}` : '/api/team';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', position: '', image: '', bio: '', email: '' });
        setEditingId(null);
        setShowForm(false);
        fetchMembers();
      }
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData(member);
    setEditingId(member._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' });
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); setFormData({ name: '', position: '', image: '', bio: '', email: '' }); };
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
    <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Manage Team" subtitle="Add and manage team members" />
      </motion.div>
 
      <div style={{ marginBottom: 24 }}>
        {showForm
          ? <CancelButton onClick={closeForm}>Cancel</CancelButton>
          : <GlowButton onClick={() => setShowForm(true)}>+ Add Member</GlowButton>}
      </div>
 
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
              <FormField label="Position" value={formData.position} onChange={(v) => setFormData({ ...formData, position: v })} required />
              <FormField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} required />
              <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} required />
              <FormField label="Bio" textarea value={formData.bio} onChange={(v) => setFormData({ ...formData, bio: v })} required />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Saving…' : editingId ? 'Update Member' : 'Add Member'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}
      >
        {members.map((member) => (
          <motion.div key={member._id} whileHover={{ scale: 1.02 }}>
            <Card style={{ padding: '24px', textAlign: 'center' }} hoverable>
              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: 80, height: 80, borderRadius: '50%', objectFit: 'cover',
                  margin: '0 auto 14px', display: 'block',
                  border: `2px solid ${T.imgRing}`,
                  boxShadow: '0 0 0 1px rgba(37,99,235,0.30)',
                }}
              />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: T.headingText, margin: '0 0 4px' }}>{member.name}</h3>
              <p style={{ fontSize: 12, fontWeight: 600, color: T.editText, margin: '0 0 8px' }}>{member.position}</p>
              <p style={{ fontSize: 12, color: T.dimText, margin: '0 0 6px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{member.bio}</p>
              <p style={{ fontSize: 11, color: T.dimText, margin: '0 0 16px' }}>{member.email}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <ActionBtn variant="edit" onClick={() => handleEdit(member)} fullWidth>Edit</ActionBtn>
                <ActionBtn variant="delete" onClick={() => handleDelete(member._id)} fullWidth>Delete</ActionBtn>
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
