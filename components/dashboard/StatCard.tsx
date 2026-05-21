'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  href?: string;
}

export default function StatCard({ title, value, icon, href = '#' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href}>
        <div className="card-glass p-6 cursor-pointer h-full">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">{title}</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {value}
              </p>
            </div>
            <span className="text-3xl">{icon}</span>
          </div>
          <p className="text-xs text-muted mt-4">Click to manage</p>
        </div>
      </Link>
    </motion.div>
  );
}
