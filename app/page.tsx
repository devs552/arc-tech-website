'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

const defaultServices = [
  {
    _id: '1',
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies',
    icon: '🌐',
  },
  {
    _id: '2',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications',
    icon: '📱',
  },
  {
    _id: '3',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment',
    icon: '☁️',
  },
];

export default function HomePage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services?limit=3');
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <Navbar />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden"
      >
        {/* Glow background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[140px]" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6
            text-transparent bg-clip-text bg-gradient-to-r
            from-cyan-400 via-blue-500 to-purple-500"
          >
            Arc Tech
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/60 mb-8"
          >
            Professional Software Solutions from Islamabad, Pakistan
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/services"
              className="px-6 py-3 rounded-lg font-medium text-black
              bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
              shadow-[0_0_25px_rgba(34,211,238,0.25)]
              hover:shadow-[0_0_35px_rgba(34,211,238,0.35)]
              transition-all"
            >
              Explore Services
            </Link>

            <Link
              href="/portfolio"
              className="px-6 py-3 rounded-lg border border-cyan-400/30
              text-cyan-300 hover:bg-cyan-500/10
              transition-all"
            >
              View Portfolio
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-12
          text-transparent bg-clip-text
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
        >
          Our Services
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))
          ) : (
            services.map((service) => (
              <motion.div
                key={service._id}
                variants={itemVariants}
                className="p-6 rounded-xl bg-white/5 border border-white/10
                backdrop-blur-xl hover:border-cyan-400/30
                hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
                transition-all duration-300"
              >
                <div className="text-4xl mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                  {service.title}
                </h3>

                <p className="text-white/60">
                  {service.description}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="px-6 py-3 rounded-lg font-medium text-black
            bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
            shadow-[0_0_25px_rgba(34,211,238,0.25)]
            hover:shadow-[0_0_35px_rgba(34,211,238,0.35)]
            transition-all"
          >
            View All Services
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-center mb-12
          text-transparent bg-clip-text
          bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
        >
          Why Choose Arc Tech?
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {[
            ['Expert Team', 'Highly skilled developers with years of experience'],
            ['Fast Delivery', 'Agile development with rapid execution'],
            ['Quality Assured', 'Strict testing and production-grade code'],
            ['24/7 Support', 'Always available maintenance and support'],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-6 rounded-xl bg-white/5 border border-white/10
              backdrop-blur-xl hover:border-purple-400/30
              hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]
              transition-all"
            >
              <h3 className="text-xl font-semibold mb-3 text-purple-300">
                {title}
              </h3>
              <p className="text-white/60">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}