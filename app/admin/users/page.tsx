'use client';

import { useState, useEffect } from 'react';
import { motion,AnimatePresence  } from 'framer-motion';
import FormField from '@/components/admin/FormField';
import { formatDate } from '@/lib/utils/helpers';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, FormPanel, GlowButton, CancelButton, ActionBtn, Badge } from '../theme/theme';
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer' | 'user';
  isActive: boolean;
  createdAt: string;
}
const roleVariant = (role: string) =>
  role === 'admin' ? 'delete' : role === 'editor' ? 'edit' : 'success';
export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor',
  });

  useEffect(() => {
    fetchUsers();
  }, []);
  const cols = ['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'];
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', email: '', password: '', role: 'editor' });
        setShowForm(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
    <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Manage Users" subtitle="Control user access and roles" />
      </motion.div>
 
      <div style={{ marginBottom: 24 }}>
        {showForm
          ? <CancelButton onClick={() => { setShowForm(false); setFormData({ name: '', email: '', password: '', role: 'editor' }); }}>Cancel</CancelButton>
          : <GlowButton onClick={() => setShowForm(true)}>+ Add User</GlowButton>}
      </div>
 
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <FormPanel onSubmit={handleSubmit}>
              <FormField label="Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
              <FormField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} required />
              <FormField label="Password" type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} required />
              <FormField
                label="Role" type="select" value={formData.role}
                onChange={(v) => setFormData({ ...formData, role: v })}
                options={[{ value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }, { value: 'admin', label: 'Admin' }]}
              />
              <GlowButton type="submit" disabled={isLoading} style={{ width: '100%' }}>
                {isLoading ? 'Creating…' : 'Create User'}
              </GlowButton>
            </FormPanel>
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ overflowX: 'auto', borderRadius: 14, border: `1px solid ${T.cardBorder}`, background: T.cardBg }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.tableRowBorder}` }}>
              {cols.map((c) => (
                <th key={c} style={{
                  textAlign: 'left', padding: '12px 16px', fontSize: 11,
                  fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.1em',
                  color: T.tableHeaderText, whiteSpace: 'nowrap',
                }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user._id}
                user={user}
                onToggle={handleToggleActive}
                onDelete={handleDelete}
                roleVariant={roleVariant}
              />
            ))}
          </tbody>
        </table>
      </motion.div>
    </PageShell>
        </div>
      </div>
  
  );
}
function UserRow({ user, onToggle, onDelete, roleVariant }: {
  user: User;
  onToggle: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  roleVariant: (role: string) => any;
}) {
  const [hov, setHov] = useState(false);
  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderBottom: `1px solid ${T.tableRowBorder}`,
        background: hov ? T.tableRowHover : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <td style={{ padding: '12px 16px', fontSize: 13, color: T.headingText }}>{user.name}</td>
      <td style={{ padding: '12px 16px', fontSize: 13, color: T.mutedText }}>{user.email}</td>
      <td style={{ padding: '12px 16px' }}>
        <Badge label={user.role} variant={roleVariant(user.role)} />
      </td>
      <td style={{ padding: '12px 16px' }}>
        <Badge label={user.isActive ? 'Active' : 'Inactive'} variant={user.isActive ? 'success' : 'warning'} />
      </td>
      <td style={{ padding: '12px 16px', fontSize: 12, color: T.mutedText, whiteSpace: 'nowrap' }}>
        {formatDate(user.createdAt)}
      </td>
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <ActionBtn variant={user.isActive ? 'warning' : 'success'} onClick={() => onToggle(user._id, user.isActive)}>
            {user.isActive ? 'Deactivate' : 'Activate'}
          </ActionBtn>
          <ActionBtn variant="delete" onClick={() => onDelete(user._id)}>Delete</ActionBtn>
        </div>
      </td>
    </tr>
  );
}