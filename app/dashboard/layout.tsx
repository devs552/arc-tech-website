'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

// ── Design tokens — Midnight Aurora palette ───────────────────────────────────
const T = {
  pageBg:   'linear-gradient(160deg, #080d1f 0%, #0a1525 60%, #060e1a 100%)',
  mainText: '#e0f0ff',
} as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: T.pageBg,
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: 1,
            padding: '32px',
            overflowY: 'auto',
            overflowX: 'hidden',
            color: T.mainText,
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}