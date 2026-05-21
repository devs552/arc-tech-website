'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

/* ─────────────────────────────────────────────
   Types — matched to actual API shape
───────────────────────────────────────────── */
interface CompanySettings {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyLocation?: string;
  companyDescription?: string;
  tagline?: string;
  mission?: string;
  vision?: string;
  foundedYear?: string | number;
  employeeCount?: string | number;
  projectsCompleted?: string | number;
  clientsSatisfied?: string | number;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamMember {
  _id: string;
  name: string;
  position: string;
  image: string;
  bio: string;
  email: string;
}

/* ─────────────────────────────────────────────
   Static fallback company info
   (used when API fields are missing/blank)
───────────────────────────────────────────── */
const STATIC: Required<
  Pick<
    CompanySettings,
    | 'tagline'
    | 'mission'
    | 'vision'
    | 'foundedYear'
    | 'employeeCount'
    | 'projectsCompleted'
    | 'clientsSatisfied'
  >
> = {
  tagline:
    'Crafting world-class web experiences and immersive games — one pixel at a time.',
  mission:
    'To deliver cutting-edge web and game development solutions that empower businesses to thrive in the digital age. We combine technical mastery with creative vision to build products that users love.',
  vision:
    'To become the leading full-stack studio where every product — whether a high-performance web app or an immersive game — sets new standards for quality, innovation, and player experience.',
  foundedYear: 2019,
  employeeCount: 35,
  projectsCompleted: 120,
  clientsSatisfied: 98,
};

/* ─────────────────────────────────────────────
   Scroll fade-up
───────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur-xl">
      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent">
        {value}
      </span>
      <span className="text-xs font-medium uppercase tracking-widest text-white/50">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Team Carousel
───────────────────────────────────────────── */
function TeamCarousel({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState(0);

  const prev = () =>
    setActive((a) => (a - 1 + members.length) % members.length);
  const next = () => setActive((a) => (a + 1) % members.length);

  return (
    <div className="relative w-full">
      {/* Card stage */}
      <div className="relative flex items-center justify-center" style={{ height: 420 }}>
        <AnimatePresence mode="popLayout">
          {members.map((member, i) => {
            const diff =
              ((i - active) % members.length + members.length) % members.length;
            const norm =
              diff > members.length / 2 ? diff - members.length : diff;
            if (Math.abs(norm) > 1) return null;

            const isCenter = norm === 0;

            return (
              <motion.div
                key={member._id}
                layout
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{
                  x: norm * 270,
                  scale: isCenter ? 1 : 0.8,
                  opacity: isCenter ? 1 : 0.45,
                  zIndex: isCenter ? 10 : 5,
                }}
                exit={{ opacity: 0, scale: 0.75 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => !isCenter && setActive(i)}
                className="absolute w-64 cursor-pointer select-none"
              >
                <div
                  className={`rounded-xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                    isCenter
                      ? 'border-cyan-400/40 bg-white/8 shadow-[0_0_40px_rgba(34,211,238,0.15)]'
                      : 'border-white/8 bg-white/3'
                  }`}
                >
                  {/* Avatar */}
                  <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-cyan-300">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <h3 className="text-center text-base font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-center text-xs font-medium text-cyan-400">
                    {member.position}
                  </p>

                  {isCenter && member.bio && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-3 text-center text-xs leading-relaxed text-white/60"
                    >
                      {member.bio}
                    </motion.p>
                  )}

                  {isCenter && member.email && (
                    <motion.a
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      href={`mailto:${member.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 text-xs text-white/40 transition-colors hover:text-cyan-400"
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      {member.email}
                    </motion.a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-cyan-400/40 hover:text-cyan-400"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex gap-2">
          {members.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:border-cyan-400/40 hover:text-cyan-400"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Services badge strip  (static, always shown)
───────────────────────────────────────────── */
const SERVICES = [
  { icon: '🌐', label: 'Web Development' },
  { icon: '🎮', label: 'Game Development' },
  { icon: '📱', label: 'Mobile Apps' },
  { icon: '🎨', label: 'UI / UX Design' },
  { icon: '⚙️', label: 'Backend & APIs' },
  { icon: '🕹️', label: 'Unity & Unreal' },
];

function ServiceBadges() {
  return (
    <div className="flex flex-wrap gap-3">
      {SERVICES.map((s) => (
        <span
          key={s.label}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:text-cyan-300"
        >
          <span>{s.icon}</span> {s.label}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function AboutPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings')
        .then((r) => r.json())
        .catch(() => ({})),
      fetch('/api/team')
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
    ]).then(([s, t]) => {
      // API returns { data: {...} } or the object directly
      const raw = s?.data ?? s ?? {};
      setSettings(raw);
      setTeam(t?.data ?? t ?? []);
      setLoading(false);
    });
  }, []);

  /* ── helpers: prefer API value, fall back to static ── */
  const val = <K extends keyof typeof STATIC>(
    apiKey: keyof CompanySettings,
    staticKey: K,
  ): string | number => {
    const v = settings?.[apiKey];
    return v !== undefined && v !== '' && v !== null ? (v as string | number) : STATIC[staticKey];
  };

  const stats = [
    { value: val('foundedYear', 'foundedYear'), label: 'Founded' },
    { value: val('employeeCount', 'employeeCount'), label: 'Team Members' },
    { value: val('projectsCompleted', 'projectsCompleted'), label: 'Projects Done' },
    { value: val('clientsSatisfied', 'clientsSatisfied'), label: 'Happy Clients' },
  ];

  /* ── resolved display values ── */
  const displayDescription =
    settings?.companyDescription?.trim() ||
    'Arc Tech is a full-service digital studio specialising in web development and game development. From sleek marketing sites to complex SaaS platforms and immersive Unity/Unreal experiences, we turn ambitious ideas into polished, production-ready products.';

  const displayMission =
    settings?.mission?.trim() || STATIC.mission;

  const displayVision =
    settings?.vision?.trim() || STATIC.vision;

  const displayTagline =
    settings?.tagline?.trim() || STATIC.tagline;

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

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              About Us
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-4" />
            <p className="text-white/60 max-w-xl">{displayTagline}</p>
          </motion.div>

          {/* Skeleton */}
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-xl bg-white/5 border border-white/10 animate-pulse"
                  />
                ))}
              </div>
              <div className="h-40 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
              <div className="grid md:grid-cols-2 gap-5">
                <div className="h-40 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="h-40 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* Stats */}
              <FadeUp delay={0.05} className="mb-14">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <StatCard key={s.label} value={s.value} label={s.label} />
                  ))}
                </div>
              </FadeUp>

              {/* What We Do — service badges */}
              <FadeUp delay={0.08} className="mb-10">
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.08)] transition-all duration-300">
                  <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-4 flex items-center gap-2">
                    <span className="h-px w-6 bg-purple-400 inline-block" /> What We Do
                  </p>
                  <ServiceBadges />
                </div>
              </FadeUp>

              {/* Who We Are */}
              <FadeUp delay={0.1} className="mb-10">
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300">
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-3 flex items-center gap-2">
                    <span className="h-px w-6 bg-cyan-400 inline-block" /> Who We Are
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {displayDescription}
                  </p>
                </div>
              </FadeUp>

              {/* Mission & Vision — always shown (static fallback) */}
              <FadeUp delay={0.15} className="mb-14">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Mission */}
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-2">
                      Our Mission
                    </p>
                    <p className="text-white/65 text-sm leading-relaxed">{displayMission}</p>
                  </div>

                  {/* Vision */}
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-purple-400 mb-2">
                      Our Vision
                    </p>
                    <p className="text-white/65 text-sm leading-relaxed">{displayVision}</p>
                  </div>
                </div>
              </FadeUp>

              {/* Team carousel */}
              {team.length > 0 && (
                <FadeUp delay={0.2} className="mb-14">
                  <div className="mb-8">
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                      Meet the Team
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-4" />
                    <p className="text-white/60 max-w-xl">
                      The people who make it happen
                    </p>
                  </div>
                  <TeamCarousel members={team} />
                </FadeUp>
              )}

              {/* Contact strip — uses corrected API field names */}
              {(settings?.companyEmail ||
                settings?.companyPhone ||
                settings?.companyLocation) && (
                <FadeUp delay={0.25}>
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300">
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-5 flex items-center gap-2">
                      <span className="h-px w-6 bg-cyan-400 inline-block" /> Get In Touch
                    </p>
                    <div className="flex flex-wrap gap-6">
                      {settings.companyEmail && (
                        <a
                          href={`mailto:${settings.companyEmail}`}
                          className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-cyan-400"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                          {settings.companyEmail}
                        </a>
                      )}
                      {settings.companyPhone && (
                        <a
                          href={`tel:${settings.companyPhone}`}
                          className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-cyan-400"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l1.01-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
                          </svg>
                          {settings.companyPhone}
                        </a>
                      )}
                      {settings.companyLocation && (
                        <span className="flex items-center gap-2 text-sm text-white/60">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {settings.companyLocation}
                        </span>
                      )}

                      {/* Social links */}
                      {settings.socialLinks && (
                        <div className="flex items-center gap-3 ml-auto">
                          {settings.socialLinks.linkedin && (
                            <a
                              href={settings.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 hover:text-cyan-400 transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect x="2" y="9" width="4" height="12"/>
                                <circle cx="4" cy="4" r="2"/>
                              </svg>
                            </a>
                          )}
                          {settings.socialLinks.twitter && (
                            <a
                              href={settings.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 hover:text-cyan-400 transition-colors"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </a>
                          )}
                          {settings.socialLinks.instagram && (
                            <a
                              href={settings.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 hover:text-cyan-400 transition-colors"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                              </svg>
                            </a>
                          )}
                          {settings.socialLinks.facebook && (
                            <a
                              href={settings.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 hover:text-cyan-400 transition-colors"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeUp>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}