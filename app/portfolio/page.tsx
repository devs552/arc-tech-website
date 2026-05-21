'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  link?: string;
}

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');
        const result = await response.json();
        setPortfolioItems(result.data || []);
      } catch (err) {
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
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
            className="mb-12"
          >
            <h1
              className="
                text-4xl md:text-6xl font-bold mb-3
                text-transparent bg-clip-text
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
              "
            >
              Our Portfolio
            </h1>

            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-4" />

            <p className="text-white/60 text-lg max-w-2xl">
              Showcasing our best projects and client success stories
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="p-4 mb-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl bg-white/5 border border-white/10 animate-pulse h-40"
                />
              ))}
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className="text-center py-20 text-white/60">
              No portfolio items found
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {portfolioItems.map((item) => (
                <motion.div
                  key={item._id}
                  variants={itemVariants}
                  className="
                    p-6 rounded-xl
                    bg-white/5
                    border border-white/10
                    backdrop-blur-xl
                    transition-all duration-300
                    hover:border-cyan-400/40
                    hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
                  "
                >
                  {/* Image */}
                  {item.image && (
                    <div className="mb-4 rounded-lg overflow-hidden h-44 bg-white/5 border border-white/10">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-cyan-300 mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 mb-4 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="
                          px-3 py-1 text-xs
                          rounded-full
                          bg-cyan-500/10
                          border border-cyan-400/20
                          text-cyan-300
                        "
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Link */}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-block px-4 py-2 text-sm
                        rounded-lg font-medium text-black
                        bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
                        shadow-[0_0_25px_rgba(34,211,238,0.25)]
                        hover:shadow-[0_0_35px_rgba(34,211,238,0.35)]
                        transition-all
                      "
                    >
                      View Project →
                    </a>
                  )}
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