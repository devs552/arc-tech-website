'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// ── Design tokens — Midnight Aurora palette ───────────────────────────────────
const T = {
  // Text
  headingText:     '#e0f0ff',
  mutedText:       '#4a7a9b',
  labelText:       '#3a6080',

  // Stat card
  cardBg:          'linear-gradient(135deg, #0c1a2e 0%, #0d2040 100%)',
  cardBorder:      '#1e3a5f',
  cardShadow:      '0 4px 24px #00000050, 0 0 0 1px #1e3a5f',
  cardHoverBorder: '#2563eb',
  cardHoverGlow:   '0 4px 32px rgba(37,99,235,0.18), 0 0 0 1px #2563eb',

  // Stat value
  valueFrom:       '#7c3aed',
  valueTo:         '#2563eb',

  // Stat icon bg
  iconBg:          'rgba(37,99,235,0.10)',
  iconBorder:      'rgba(37,99,235,0.20)',

  // Quick action card
  actionBg:        '#0c1a2e',
  actionBorder:    '#1e3a5f',
  actionHoverBg:   'rgba(37,99,235,0.08)',
  actionHoverBorder:'#2563eb',
  actionTitle:     '#60a5fa',
  actionMuted:     '#3a6080',

  // Section divider / glass panel
  panelBg:         'rgba(12,26,46,0.80)',
  panelBorder:     '#1e3a5f',
  panelShadow:     '0 8px 32px #00000060',
} as const;

// ── Stat card data ────────────────────────────────────────────────────────────
const STAT_ICONS: Record<string, string> = {
  Services:          'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  'Portfolio Items': 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z',
  'Team Members':    'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  Applications:     'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z',
};

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
    >
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '20px 22px',
          borderRadius: 14,
          background: T.cardBg,
          border: `1px solid ${hovered ? T.cardHoverBorder : T.cardBorder}`,
          boxShadow: hovered ? T.cardHoverGlow : T.cardShadow,
          textDecoration: 'none',
          transition: 'border 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '.1em',
            color: T.mutedText,
            margin: 0,
          }}>
            {title}
          </p>
          {/* Icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 9,
            background: T.iconBg,
            border: `1px solid ${T.iconBorder}`,
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#60a5fa"
              style={{ width: 17, height: 17 }}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={STAT_ICONS[title]} />
            </svg>
          </div>
        </div>

        {/* Value */}
        <p style={{
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: '-.02em',
          margin: 0,
          background: `linear-gradient(135deg, ${T.valueFrom}, ${T.valueTo})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}>
          {value}
        </p>
      </Link>
    </motion.div>
  );
}

// ── Quick action items ────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { href: '/admin/services',  title: 'Manage Services',  desc: 'Add, edit, or remove services'   },
  { href: '/admin/portfolio', title: 'Manage Portfolio', desc: 'Showcase your best work'         },
  { href: '/admin/blogs',     title: 'Write Blogs',      desc: 'Create and publish blog posts'   },
  { href: '/admin/users',     title: 'Manage Users',     desc: 'Control user access and roles'   },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalServices: 0,
    totalPortfolio: 0,
    totalTeam: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, portfolioRes, teamRes, applicationsRes] = await Promise.all([
          fetch('/api/services?limit=1'),
          fetch('/api/portfolio?limit=1'),
          fetch('/api/team?limit=1'),
          fetch('/api/applications?limit=1'),
        ]);
        const [s, p, t, a] = await Promise.all([
          servicesRes.json(), portfolioRes.json(),
          teamRes.json(), applicationsRes.json(),
        ]);
        setStats({
          totalServices:     s.total || 0,
          totalPortfolio:    p.total || 0,
          totalTeam:         t.total || 0,
          totalApplications: a.total || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* ── Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        style={{ marginBottom: 32 }}
      >
        <h1 style={{
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: '-.02em',
          color: T.headingText,
          margin: '0 0 6px',
          lineHeight: 1.2,
        }}>
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: T.mutedText, margin: 0 }}>
          Welcome to Arc Tech Admin Panel
        </p>
      </motion.div>

      {/* ── Stat cards */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.09 } },
        }}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <StatCard title="Services"         value={stats.totalServices}     href="/admin/services"     />
        <StatCard title="Portfolio Items"  value={stats.totalPortfolio}    href="/admin/portfolio"    />
        <StatCard title="Team Members"     value={stats.totalTeam}         href="/admin/team"         />
        <StatCard title="Applications"     value={stats.totalApplications} href="/admin/applications" />
      </motion.div>

      {/* ── Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.25 }}
        style={{
          padding: '28px 28px',
          borderRadius: 16,
          background: T.panelBg,
          border: `1px solid ${T.panelBorder}`,
          boxShadow: T.panelShadow,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <h2 style={{
          fontSize: 17,
          fontWeight: 600,
          color: T.headingText,
          margin: '0 0 18px',
          letterSpacing: '-.01em',
        }}>
          Quick Actions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 14,
        }}>
          {QUICK_ACTIONS.map(({ href, title, desc }) => (
            <QuickActionCard key={href} href={href} title={title} desc={desc} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function QuickActionCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '14px 16px',
        borderRadius: 10,
        background: hovered ? T.actionHoverBg : T.actionBg,
        border: `1px solid ${hovered ? T.actionHoverBorder : T.actionBorder}`,
        textDecoration: 'none',
        transition: 'all 0.15s',
      }}
    >
      <p style={{
        fontSize: 13,
        fontWeight: 600,
        color: T.actionTitle,
        margin: '0 0 4px',
      }}>
        {title}
      </p>
      <p style={{ fontSize: 12, color: T.actionMuted, margin: 0 }}>
        {desc}
      </p>
    </Link>
  );
}