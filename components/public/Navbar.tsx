'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'Home',      href: '/' },
  { label: 'About Us',  href: '/about' },
  { label: 'Services',  href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Blogs',     href: '/blogs' },
  { label: 'Career',    href: '/career' },
  { label: 'Contact',   href: '/contact' },
];

/* ── Hamburger icon ─────────────────────────────────────────── */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-5" aria-hidden>
      <span
        className={`absolute left-0 top-0.5 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
          open ? 'top-2 rotate-45' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-2 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
          open ? 'opacity-0' : ''
        }`}
      />
      <span
        className={`absolute left-0 top-3.5 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
          open ? 'top-2 -rotate-45' : ''
        }`}
      />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setIsOpen(false); }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`
        sticky top-0 z-50
        border-b border-white/10
        bg-[#050814]/80 backdrop-blur-2xl
        relative overflow-hidden
        transition-all duration-300
        ${scrolled ? 'shadow-[0_0_35px_rgba(0,212,255,0.08)]' : ''}
      `}
    >
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cyan-500 blur-[120px]" />
        <div className="absolute top-0 right-10 h-60 w-60 rounded-full bg-purple-600 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 shadow-sm transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 20 20" className="h-4 w-4 fill-white" aria-hidden>
              <path d="M10 2L2 7v6l8 5 8-5V7L10 2zm0 2.3L16 8l-6 3.7L4 8l6-3.7zM3 9.1l6 3.7v5.1L3 14.2V9.1zm8 8.8v-5.1l6-3.7v5.1l-6 3.7z"/>
            </svg>
          </span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold tracking-wider">
            Arc Tech
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'text-cyan-200 bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.25)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-primary/8"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/5 hover:text-white md:hidden"
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="relative overflow-hidden border-t border-white/10 bg-[#050814]/95 backdrop-blur-2xl md:hidden"
          >
            {/* Subtle bottom glow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[60px]" />

            <div className="relative px-4 py-3 space-y-0.5">
              {navItems.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-gradient-to-r from-cyan-500/15 to-transparent border-l-2 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}