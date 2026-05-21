'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/helpers';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { T, PageShell, PageHeader, ActionBtn, Badge } from '../theme/theme';
interface ContactSubmission {
  _id: string; name: string; email: string;
  subject: string; message: string;
  status: 'new' | 'read' | 'responded'; createdAt: string;
}
const statusVariant = (s: string) =>
  s === 'responded' ? 'success' : s === 'read' ? 'edit' : 'warning';
export default function ContactAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/contact');
      const data = await res.json();
      setSubmissions(data.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      fetchSubmissions();
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
  <PageShell>
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <PageHeader title="Contact Submissions" subtitle="View and manage contact form submissions" />
      </motion.div>
 
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {submissions.map((sub) => {
          const open = selectedId === sub._id;
          return (
            <SubmissionCard
              key={sub._id}
              sub={sub}
              open={open}
              isLoading={isLoading}
              onToggle={() => setSelectedId(open ? null : sub._id)}
              onStatus={updateStatus}
              onDelete={handleDelete}
            />
          );
        })}
      </motion.div>
    </PageShell>
        </div>
      </div>
   
  );
}
function SubmissionCard({ sub, open, isLoading, onToggle, onStatus, onDelete }: {
  sub: ContactSubmission; open: boolean; isLoading: boolean;
  onToggle: () => void; onStatus: (id: string, s: string) => void; onDelete: (id: string) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onToggle}
      style={{
        background: T.cardBg,
        border: `1px solid ${hov || open ? T.cardHoverBorder : T.cardBorder}`,
        boxShadow: open ? T.cardHoverGlow : T.cardShadow,
        borderRadius: 14, padding: '20px 22px', cursor: 'pointer',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.headingText, margin: '0 0 2px' }}>{sub.name}</h3>
          <p style={{ fontSize: 12, color: T.mutedText, margin: 0 }}>{sub.email}</p>
        </div>
        <Badge label={sub.status.charAt(0).toUpperCase() + sub.status.slice(1)} variant={statusVariant(sub.status) as any} />
      </div>
 
      <p style={{ fontSize: 14, fontWeight: 600, color: T.headingText, margin: '0 0 4px' }}>{sub.subject}</p>
      <p style={{ fontSize: 12, color: T.dimText, margin: 0 }}>{formatDate(sub.createdAt)}</p>
 
      {/* Expanded panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.divider}`, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: T.expandBg, borderRadius: 10, padding: '14px 16px', border: `1px solid ${T.cardBorder}` }}>
                <p style={{ fontSize: 13, color: T.headingText, margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{sub.message}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {sub.status !== 'read' && (
                  <ActionBtn variant="edit" onClick={() => onStatus(sub._id, 'read')} disabled={isLoading}>Mark as Read</ActionBtn>
                )}
                {sub.status !== 'responded' && (
                  <ActionBtn variant="success" onClick={() => onStatus(sub._id, 'responded')} disabled={isLoading}>Mark as Responded</ActionBtn>
                )}
                <ActionBtn variant="delete" onClick={() => onDelete(sub._id)}>Delete</ActionBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}