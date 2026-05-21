'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

interface GalleryItem {
  _id: string;
  title: string;
  image: string;
  category: string;
}

const categories = ['all', 'office', 'team', 'work', 'event'];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/gallery');
        const result = await res.json();
        setGalleryItems(result.data || []);
      } catch (err) {
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredItems =
    selectedCategory === 'all'
      ? galleryItems
      : galleryItems.filter(
          (item) => item.category?.toLowerCase() === selectedCategory
        );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white relative overflow-hidden">

      {/* Glow background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[160px]" />
      </div>

      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1
              className="
                text-4xl md:text-6xl font-bold mb-3
                text-transparent bg-clip-text
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
              "
            >
              Gallery
            </h1>

            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-4" />

            <p className="text-white/60 max-w-xl">
              Moments, workspace and achievements from our journey
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`
                    px-4 py-2 rounded-full text-sm capitalize
                    transition-all duration-200
                    border
                    ${
                      active
                        ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-cyan-400/30 hover:text-white'
                    }
                  `}
                >
                  {cat}
                </button>
              );
            })}
          </motion.div>

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-white/60">
              No gallery items found
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  className="
                    group rounded-xl overflow-hidden
                    bg-white/5 border border-white/10
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:border-cyan-400/40
                    hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
                  "
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-white/5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover
                        group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📸
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-sm capitalize">
                      {item.category}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}