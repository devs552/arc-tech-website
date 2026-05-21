'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B18] text-white">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Get in Touch
            </h1>

            <div className="w-20 h-1 mt-3 mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" />

            <p className="text-slate-400 text-lg">
              Have a project in mind? Let’s build something amazing together.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                icon: '📧',
                title: 'Email',
                value: 'contact@arctech.pk',
              },
              {
                icon: '📍',
                title: 'Location',
                value: 'Islamabad, Pakistan',
              },
              {
                icon: '📞',
                title: 'Phone',
                value: '+92 (51) XXXX-XXXX',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-center hover:border-cyan-400/40 transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold">{item.title}</h3>
                <p className="text-slate-400 mt-1">{item.value}</p>

                {/* glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-cyan-500/5 blur-xl transition" />
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >

            {/* Success */}
            {success && (
              <div className="mb-6 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-300">
                Message sent successfully!
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
                {error}
              </div>
            )}

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-cyan-400 outline-none text-white"
                required
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                className="px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-cyan-400 outline-none text-white"
                required
              />
            </div>

            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full mt-5 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-cyan-400 outline-none text-white"
              required
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={6}
              className="w-full mt-5 px-4 py-3 rounded-lg bg-black/30 border border-white/10 focus:border-cyan-400 outline-none text-white resize-none"
              required
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </section>

      <Footer />
    </div>
  );
}