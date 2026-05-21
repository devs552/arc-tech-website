'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

interface JobOpening {
  _id: string;
  title: string;
  department: string;
  experience: string;
  location: string;
  description?: string;
}

export default function CareerPage() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeJob, setActiveJob] = useState<{ id: string; title: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',       // Updated key from resumeUrl -> resume
    coverLetter: '',
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await fetch('/api/hiring');
        if (!response.ok) throw new Error('Failed to load job listings');
        const resData = await response.json();
        
        if (Array.isArray(resData)) setJobOpenings(resData);
        else if (resData && Array.isArray(resData.data)) setJobOpenings(resData.data);
        else if (resData && Array.isArray(resData.jobs)) setJobOpenings(resData.jobs);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const openApplicationModal = (jobId: string, jobTitle: string) => {
    setActiveJob({ id: jobId, title: jobTitle });
    setIsModalOpen(true);
    setSubmitSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJob) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          resume: formData.resume,             // Schema field matching
          coverLetter: formData.coverLetter,
          position: activeJob.title,           // Schema field matching
          hiringPostId: activeJob.id,          // Schema field matching
        }),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', resume: '', coverLetter: '' });
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err) {
      alert('Could not submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B18] text-white relative">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Careers at Arc Tech
            </h1>
            <div className="w-20 h-1 mt-3 mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />
            <p className="text-slate-400 text-lg">Join our team and build the future of tech.</p>
          </motion.div>

          {loading && (
            <div className="mt-12 flex justify-center py-10">
              <div className="w-8 h-8 rounded-full border-2 border-t-cyan-400 border-white/10 animate-spin" />
            </div>
          )}

          {!loading && !error && (
            <div className="mt-12 space-y-6">
              {jobOpenings.map((job, i) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedJob(selectedJob === job._id ? null : job._id)}
                  className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition-all duration-300 hover:border-cyan-400/40"
                >
                  <div className="relative flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-white group-hover:text-cyan-300 transition">{job.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-400">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{job.department}</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">{job.experience}</span>
                        <span>📍 {job.location}</span>
                      </div>
                    </div>
                    <div className="text-2xl text-slate-400 group-hover:text-cyan-300">{selectedJob === job._id ? '−' : '+'}</div>
                  </div>

                  <AnimatePresence>
                    {selectedJob === job._id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <p className="text-slate-400 leading-relaxed whitespace-pre-line">{job.description || "Join us in solving real-world challenges."}</p>
                          <div className="mt-5 flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openApplicationModal(job._id, job.title); // Now passing Database ID and title
                              }}
                              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 transition"
                            >
                              Apply Now
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setSelectedJob(null); }} className="px-5 py-2 rounded-lg border border-white/10 text-slate-300 hover:text-white">
                              Close
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* APPLICATION MODAL POPUP */}
      <AnimatePresence>
        {isModalOpen && activeJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0c1226] p-8 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-1">Apply for Position</h2>
              <p className="text-cyan-400 font-medium mb-6">{activeJob.title}</p>

              {submitSuccess ? (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-semibold text-white">Application Sent!</h3>
                  <p className="text-slate-400 mt-1">Thank you for applying to Arc Tech.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition" placeholder="John Doe" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Email Address</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Phone Number</label>
                      <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition" placeholder="+92 300 1234567" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Resume Link (Drive / Dropbox)</label>
                    <input required type="url" name="resume" value={formData.resume} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition" placeholder="https://drive.google.com/..." />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Cover Letter / Notes</label>
                    <textarea rows={4} name="coverLetter" value={formData.coverLetter} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400 transition resize-none" placeholder="Tell us why you are a great fit..." />
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-white/10 text-slate-300 hover:text-white transition">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white hover:opacity-90 transition disabled:opacity-50">
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}