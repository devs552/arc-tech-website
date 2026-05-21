'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

/* ─────────────────────────────────────────────
   Scroll fade-up (same as About page)
───────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
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
   Section block (reusable card)
───────────────────────────────────────────── */
function PolicySection({
  icon,
  accent = 'cyan',
  title,
  children,
}: {
  icon: React.ReactNode;
  accent?: 'cyan' | 'purple';
  title: string;
  children: React.ReactNode;
}) {
  const isCyan = accent === 'cyan';
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 transition-all duration-300 ${
        isCyan
          ? 'hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]'
          : 'hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]'
      }`}
    >
      {/* Icon badge */}
      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
          isCyan ? 'bg-cyan-500/15 text-cyan-400' : 'bg-purple-500/15 text-purple-400'
        }`}
      >
        {icon}
      </div>

      {/* Label */}
      <p
        className={`text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2 ${
          isCyan ? 'text-cyan-400' : 'text-purple-400'
        }`}
      >
        <span className={`h-px w-6 inline-block ${isCyan ? 'bg-cyan-400' : 'bg-purple-400'}`} />
        {title}
      </p>

      <div className="text-white/65 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Inline list item
───────────────────────────────────────────── */
function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
      <span>{children}</span>
    </li>
  );
}

/* ─────────────────────────────────────────────
   Table of contents sidebar dot
───────────────────────────────────────────── */
const SECTIONS = [
  'Information We Collect',
  'How We Use Your Data',
  'Cookies & Tracking',
  'Data Sharing',
  'Your Rights',
  'Data Security',
  'Third-Party Links',
  'Changes to This Policy',
  'Contact Us',
];

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function PrivacyPage() {
  const [active, setActive] = useState(0);

  const scrollTo = (id: string, index: number) => {
    setActive(index);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#050814] text-white relative overflow-hidden">

      {/* Glow background — identical to About page */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[160px]" />
      </div>

      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Page heading — same pattern as About */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Privacy Policy
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded mb-4" />
            <p className="text-white/60 max-w-xl">
              How we collect, use, and protect your personal information.
            </p>
            <p className="text-white/30 text-xs mt-2">Last updated: June 1, 2025</p>
          </motion.div>

          <div className="flex gap-10 items-start">

            {/* ── Sticky table of contents (desktop) ── */}
            <FadeUp delay={0.05} className="hidden lg:block w-52 shrink-0 sticky top-24">
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
                  <span className="h-px w-4 bg-cyan-400 inline-block" /> Contents
                </p>
                <nav className="space-y-2">
                  {SECTIONS.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => scrollTo(`section-${i}`, i)}
                      className={`block w-full text-left text-xs leading-snug px-2 py-1.5 rounded-lg transition-all duration-200 ${
                        active === i
                          ? 'bg-cyan-500/15 text-cyan-400 font-medium'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </nav>
              </div>
            </FadeUp>

            {/* ── Policy content ── */}
            <div className="flex-1 space-y-6">

              {/* Intro strip */}
              <FadeUp delay={0.08}>
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300">
                  <p className="text-white/70 text-sm leading-relaxed">
                    At <span className="text-white font-semibold">Arc Tech</span>, your privacy is
                    a core commitment, not an afterthought. This policy explains what data we collect
                    when you interact with our website and services, why we collect it, and the
                    rights you have over your information. By using our services, you agree to the
                    practices described below.
                  </p>
                </div>
              </FadeUp>

              {/* 1 — Information We Collect */}
              <FadeUp delay={0.1}>
                <div id="section-0">
                  <PolicySection
                    accent="cyan"
                    title="1. Information We Collect"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                      </svg>
                    }
                  >
                    <p>We may collect the following types of information:</p>
                    <ul className="mt-2 space-y-1.5">
                      <Li><strong className="text-white/80">Personal identifiers</strong> — name, email address, phone number when you fill out a contact form or create an account.</Li>
                      <Li><strong className="text-white/80">Usage data</strong> — pages visited, time spent, clicks, and referring URLs collected automatically via logs.</Li>
                      <Li><strong className="text-white/80">Device & browser data</strong> — IP address, browser type, operating system, and screen resolution.</Li>
                      <Li><strong className="text-white/80">Communications</strong> — messages or files you send us via email or our contact channels.</Li>
                    </ul>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 2 — How We Use */}
              <FadeUp delay={0.12}>
                <div id="section-1">
                  <PolicySection
                    accent="purple"
                    title="2. How We Use Your Data"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                      </svg>
                    }
                  >
                    <p>Your information is used exclusively to:</p>
                    <ul className="mt-2 space-y-1.5">
                      <Li>Respond to enquiries and provide requested services.</Li>
                      <Li>Improve and personalise your experience on our platform.</Li>
                      <Li>Send transactional emails (order confirmations, support replies).</Li>
                      <Li>Analyse aggregate usage trends to enhance our products.</Li>
                      <Li>Comply with legal obligations or enforce our terms.</Li>
                    </ul>
                    <p className="mt-3">We do <strong className="text-white/80">not</strong> sell, rent, or trade your personal data to third parties for marketing purposes.</p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 3 — Cookies */}
              <FadeUp delay={0.14}>
                <div id="section-2">
                  <PolicySection
                    accent="cyan"
                    title="3. Cookies & Tracking"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
                      </svg>
                    }
                  >
                    <p>We use cookies and similar tracking technologies to:</p>
                    <ul className="mt-2 space-y-1.5">
                      <Li><strong className="text-white/80">Essential cookies</strong> — required for core functionality such as session management.</Li>
                      <Li><strong className="text-white/80">Analytics cookies</strong> — help us understand how visitors use our site (e.g. Google Analytics).</Li>
                      <Li><strong className="text-white/80">Preference cookies</strong> — remember your settings and choices across visits.</Li>
                    </ul>
                    <p className="mt-3">You can disable cookies via your browser settings. Note that disabling essential cookies may affect site functionality.</p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 4 — Data Sharing */}
              <FadeUp delay={0.16}>
                <div id="section-3">
                  <PolicySection
                    accent="purple"
                    title="4. Data Sharing"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    }
                  >
                    <p>We may share your data with:</p>
                    <ul className="mt-2 space-y-1.5">
                      <Li><strong className="text-white/80">Service providers</strong> — trusted vendors (hosting, email, analytics) bound by strict confidentiality agreements.</Li>
                      <Li><strong className="text-white/80">Legal authorities</strong> — when required by law, court order, or to protect our legal rights.</Li>
                      <Li><strong className="text-white/80">Business transfers</strong> — in the event of a merger, acquisition, or sale of assets, your data may transfer to the new entity.</Li>
                    </ul>
                    <p className="mt-3">All third-party processors are vetted and required to handle your data in accordance with applicable data protection laws.</p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 5 — Your Rights */}
              <FadeUp delay={0.18}>
                <div id="section-4">
                  <PolicySection
                    accent="cyan"
                    title="5. Your Rights"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    }
                  >
                    <p>Depending on your jurisdiction, you may have the right to:</p>
                    <ul className="mt-2 space-y-1.5">
                      <Li><strong className="text-white/80">Access</strong> — request a copy of the personal data we hold about you.</Li>
                      <Li><strong className="text-white/80">Rectification</strong> — ask us to correct inaccurate or incomplete data.</Li>
                      <Li><strong className="text-white/80">Erasure</strong> — request deletion of your personal data ("right to be forgotten").</Li>
                      <Li><strong className="text-white/80">Portability</strong> — receive your data in a structured, machine-readable format.</Li>
                      <Li><strong className="text-white/80">Objection</strong> — object to processing based on legitimate interests or for direct marketing.</Li>
                      <Li><strong className="text-white/80">Withdraw consent</strong> — where processing is based on consent, you may withdraw it at any time.</Li>
                    </ul>
                    <p className="mt-3">To exercise any of these rights, contact us at the email listed below. We will respond within 30 days.</p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 6 — Data Security */}
              <FadeUp delay={0.20}>
                <div id="section-5">
                  <PolicySection
                    accent="purple"
                    title="6. Data Security"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    }
                  >
                    <p>
                      We implement industry-standard technical and organisational safeguards including
                      TLS encryption in transit, AES-256 encryption at rest, role-based access
                      controls, and regular security audits. While no system is completely immune to
                      breaches, we take every reasonable precaution to protect your data. In the
                      event of a breach that affects your rights, we will notify you and relevant
                      authorities as required by law.
                    </p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 7 — Third-Party Links */}
              <FadeUp delay={0.22}>
                <div id="section-6">
                  <PolicySection
                    accent="cyan"
                    title="7. Third-Party Links"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    }
                  >
                    <p>
                      Our website may contain links to external websites or services not operated by
                      Arc Tech. Once you leave our site, this Privacy Policy no longer applies.
                      We encourage you to review the privacy policies of any third-party sites you visit.
                      We have no control over and assume no responsibility for the content or practices
                      of third-party sites.
                    </p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 8 — Changes */}
              <FadeUp delay={0.24}>
                <div id="section-7">
                  <PolicySection
                    accent="purple"
                    title="8. Changes to This Policy"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    }
                  >
                    <p>
                      We may update this Privacy Policy periodically to reflect changes in our
                      practices or applicable law. When we do, we will revise the "Last updated"
                      date at the top of this page. For significant changes, we will provide a
                      prominent notice on our website or notify you directly. Continued use of
                      our services after changes constitutes your acceptance of the revised policy.
                    </p>
                  </PolicySection>
                </div>
              </FadeUp>

              {/* 9 — Contact */}
              <FadeUp delay={0.26}>
                <div id="section-8">
                  <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all duration-300">
                    <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-5 flex items-center gap-2">
                      <span className="h-px w-6 bg-cyan-400 inline-block" /> 9. Contact Us
                    </p>
                    <p className="text-white/65 text-sm leading-relaxed mb-5">
                      If you have questions, concerns, or requests regarding this Privacy Policy or
                      how we handle your data, please reach out to our privacy team:
                    </p>
                    <div className="flex flex-wrap gap-5">
                      <a
                        href="mailto:privacy@arctech.com"
                        className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-cyan-400"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                        privacy@arctech.com
                      </a>
                      <span className="flex items-center gap-2 text-sm text-white/60">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        Arc Tech HQ, 123 Innovation Drive
                      </span>
                    </div>
                  </div>
                </div>
              </FadeUp>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}