'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

// ── Services Data ─────────────────────────────────────────────────────────────

// ── Card Component ────────────────────────────────────────────────────────────
function ServiceCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="
        p-6 rounded-xl
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        transition-all duration-300
        hover:border-cyan-400/40
        hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
        h-full flex flex-col
      "
    >
      {/* Image */}
      <div
        className="
          w-full h-48 mb-4 rounded-xl
          flex items-center justify-center
          bg-gradient-to-br from-cyan-500/40 via-blue-600/30 to-purple-600/30
          border border-cyan-400/60
          overflow-hidden
          shadow-xl shadow-cyan-500/30
          relative
          flex-shrink-0
        "
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
      </div>

      {/* Text */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>

        <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
type Service = {
  _id: string;
  title: string;
  description: string;
  image: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch services');
        return res.json();
      })
      .then((data) => {
        setServices(data.data);
        console.log('Fetched services:', data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        setError('Failed to load services. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#050814] text-white relative overflow-hidden">

      {/* Glow Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[160px]" />
      </div>

      <Navbar />

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-14"
          >
            <h1
              className="
                text-4xl md:text-6xl font-bold mb-3
                text-transparent bg-clip-text
                bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
              "
            >
              Our Services
            </h1>

            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-4" />

            <p className="text-white/60 max-w-xl">
              Comprehensive software solutions tailored for modern businesses
            </p>
          </motion.div>

          {/* Grid */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-white/60">Loading services...</div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60">No services available at the moment.</p>
            </div>
          )}

          {!loading && !error && services.length > 0 && (
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {services.map((service) => (
                  <CarouselItem key={service._id} className="pl-2 md:pl-4 md:basis-1/3">
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      image={service.image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-cyan-500/20 border-cyan-400/50 hover:bg-cyan-500/40" />
              <CarouselNext className="right-0 bg-cyan-500/20 border-cyan-400/50 hover:bg-cyan-500/40" />
            </Carousel>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}