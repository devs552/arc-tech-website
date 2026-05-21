'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author?: string;
  createdAt: string;
  isPublished: boolean;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs?published=true');
        const data = await res.json();
        setBlogs(data.data || []);
      } catch (err) {
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[#070B18] text-white">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Our Blog
            </h1>

            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 mb-4" />

            <p className="text-slate-400 text-lg">
              Insights, updates, and engineering thoughts from Arc Tech
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="mt-10 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 animate-pulse"
                >
                  <div className="h-6 bg-white/10 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="mt-12 text-center text-slate-400">
              No blog posts found
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-12 space-y-6"
            >
              {blogs.map((blog) => (
                <motion.article
                  key={blog._id}
                  variants={item}
                  className="group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300"
                >
                  {/* glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-cyan-500/5 blur-xl" />

                  <div className="relative">
                    <h2 className="text-2xl font-semibold text-white group-hover:text-cyan-300 transition">
                      {blog.title}
                    </h2>

                    <p className="mt-2 text-slate-400 line-clamp-2">
                      {blog.content?.slice(0, 180) || 'No preview available'}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {blog.category && (
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {blog.category}
                        </span>
                      )}

                      {blog.author && <span>By {blog.author}</span>}

                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}