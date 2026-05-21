'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/helpers';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

interface JobApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resume: string;
  coverLetter: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const statusColors: Record<string, string> = {
    new: 'bg-warning/10 text-warning',
    reviewed: 'bg-primary/10 text-primary',
    shortlisted: 'bg-success/10 text-success',
    rejected: 'bg-error/10 text-error',
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="px-8 py-6 max-w-6xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Job Applications</h1>
        <p className="text-muted">Review and manage job applications</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {applications.map((app) => (
          <motion.div
            key={app._id}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelectedId(selectedId === app._id ? null : app._id)}
            className="card-glass p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{app.name}</h3>
                <p className="text-muted text-sm">{app.position}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded font-semibold ${statusColors[app.status]}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>

            <p className="text-muted text-sm mb-2">
              {app.email} • {app.phone} • {formatDate(app.createdAt)}
            </p>

            {selectedId === app._id && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-card-border space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Cover Letter</h4>
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-foreground text-sm whitespace-pre-wrap">{app.coverLetter}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Resume</h4>
                  <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent underline text-sm">
                    View Resume
                  </a>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['reviewed', 'shortlisted', 'rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(app._id, status)}
                      disabled={isLoading}
                      className={`px-4 py-2 text-sm rounded transition-colors disabled:opacity-50 ${
                        status === 'shortlisted'
                          ? 'bg-success/10 text-success hover:bg-success/20'
                          : status === 'rejected'
                            ? 'bg-error/10 text-error hover:bg-error/20'
                            : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      Mark {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                  <button
                    onClick={() => handleDelete(app._id)}
                    className="px-4 py-2 text-sm bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
        </div>
        </div>
      </div>
    
  );
}
