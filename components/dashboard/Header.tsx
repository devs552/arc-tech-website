'use client';

import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// ── Design tokens — Midnight Aurora palette ───────────────────────────────────
const T = {
  // Header bar
  headerBg:        'linear-gradient(135deg, #0b0f2a 0%, #0d1f35 50%, #0a1628 100%)',
  headerBorder:    '#1e3a5f',
  headerShadow:    '0 1px 0 #1e3a5f, 0 4px 24px #00000060',

  // Text
  labelText:       '#4a7a9b',
  nameText:        '#e0f0ff',
  mutedText:       '#3a6080',

  // Divider
  divider:         '#1a3550',

  // Avatar ring
  avatarRing:      '#1e4060',
  avatarFrom:      '#7c3aed',
  avatarTo:        '#2563eb',
  onlineDot:       '#10d98a',
  onlineBorder:    '#0d1f35',

  // Chevron
  chevronColor:    '#2a5570',

  // Button hover
  btnHover:        '#ffffff08',

  // Dropdown
  dropdownBg:      '#0c1a2e',
  dropdownBorder:  '#1e3a5f',
  dropdownShadow:  '0 20px 60px #00000080, 0 0 0 1px #1e3a5f',

  // Dropdown header section
  dropHeaderBg:    '#0a1525',
  dropDivider:     '#162840',

  // Menu item hover
  menuHover:       '#ffffff06',
  menuFocus:       '#3b82f620',

  // Sign out
  signOutText:     '#f87171',
  signOutHover:    '#ff000010',

  // Role badge colors
  adminBg:         '#2d1b6920',
  adminText:       '#a78bfa',
  adminBorder:     '#4c1d9540',

  modBg:           '#0c2d4a20',
  modText:         '#38bdf8',
  modBorder:       '#0369a140',

  userBg:          '#052e1a20',
  userText:        '#34d399',
  userBorder:      '#06522640',

  defaultBg:       '#1a1a2e20',
  defaultText:     '#94a3b8',
  defaultBorder:   '#33415540',
} as const;

// ── Role config ───────────────────────────────────────────────────────────────
interface RoleStyle { label: string; bg: string; text: string; border: string }

const ROLE_MAP: Record<string, RoleStyle> = {
  admin:     { label: 'Admin',     bg: T.adminBg,   text: T.adminText,   border: T.adminBorder   },
  moderator: { label: 'Moderator', bg: T.modBg,     text: T.modText,     border: T.modBorder     },
  user:      { label: 'User',      bg: T.userBg,    text: T.userText,    border: T.userBorder    },
};

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name }: { name?: string | null }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.avatarFrom}, ${T.avatarTo})`,
        fontSize: 13,
        fontWeight: 600,
        color: '#fff',
        flexShrink: 0,
        boxShadow: `0 0 0 2px ${T.avatarRing}, 0 2px 8px #00000040`,
        userSelect: 'none',
      }}
    >
      {initials}
      <span
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: T.onlineDot,
          border: `2px solid ${T.onlineBorder}`,
          boxShadow: `0 0 6px ${T.onlineDot}80`,
        }}
      />
    </div>
  );
}

// ── Role badge ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_MAP[role.toLowerCase()] ?? {
    label: role,
    bg:     T.defaultBg,
    text:   T.defaultText,
    border: T.defaultBorder,
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        border: `1px solid ${cfg.border}`,
        background: cfg.bg,
        color: cfg.text,
        fontSize: 11,
        fontWeight: 500,
        padding: '2px 10px',
        letterSpacing: '.04em',
        textTransform: 'capitalize',
      }}
    >
      {cfg.label}
    </span>
  );
}

// ── Dropdown ──────────────────────────────────────────────────────────────────
interface DropdownProps {
  name?: string | null;
  email?: string | null;
  role: string;
  onClose: () => void;
}

const MENU_ITEMS = [
  {
    label: 'Profile',
    path: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  },
  {
    label: 'Settings',
    path: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z',
  },
];

function DropdownMenu({ name, email, role, onClose }: DropdownProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 8px)',
        zIndex: 50,
        width: 248,
        borderRadius: 14,
        border: `1px solid ${T.dropdownBorder}`,
        background: T.dropdownBg,
        boxShadow: T.dropdownShadow,
        overflow: 'hidden',
      }}
    >
      {/* User info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: T.dropHeaderBg,
          borderBottom: `1px solid ${T.dropDivider}`,
        }}
      >
        <Avatar name={name} />
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: T.nameText, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name ?? '—'}
          </p>
          <p style={{ fontSize: 11, color: T.mutedText, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {email ?? '—'}
          </p>
        </div>
      </div>

      {/* Role row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: `1px solid ${T.dropDivider}`,
        }}
      >
        <span style={{ fontSize: 11, color: T.mutedText }}>Role</span>
        <RoleBadge role={role} />
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px 6px' }}>
        {MENU_ITEMS.map(({ label, path }) => (
          <button
            key={label}
            type="button"
            onClick={onClose}
            onMouseEnter={() => setHovered(label)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: hovered === label ? T.menuHover : 'transparent',
              color: T.nameText,
              fontSize: 13,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.15s',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth={1.5} stroke={T.labelText}
              style={{ width: 15, height: 15, flexShrink: 0 }} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
            {label}
          </button>
        ))}
      </div>

      {/* Sign out */}
      <div style={{ borderTop: `1px solid ${T.dropDivider}`, padding: '6px 6px' }}>
        <button
          type="button"
         onClick={async () => {
  await signOut({ redirect: false });
  (window.location.href = '/dashboard');
}}
          onMouseEnter={() => setHovered('signout')}
          onMouseLeave={() => setHovered(null)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: 'none',
            background: hovered === 'signout' ? T.signOutHover : 'transparent',
            color: T.signOutText,
            fontSize: 13,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.15s',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor"
            style={{ width: 15, height: 15, flexShrink: 0 }} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </button>
      </div>
    </motion.div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header() {
  const { data: session } = useSession();
  const role  = (session?.user as { role?: string })?.role ?? 'user';
  const name  = session?.user?.name;
  const email = session?.user?.email;

  const [open, setOpen]   = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const containerRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: T.headerBg,
        borderBottom: `1px solid ${T.headerBorder}`,
        boxShadow: T.headerShadow,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          margin: '0 auto',
          display: 'flex',
          height: 64,
          maxWidth: 1280,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '0 24px',
        }}
      >
        {/* Left — greeting */}
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: 10,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '.12em',
            color: T.labelText,
            margin: 0,
          }}>
            Welcome back
          </p>
          <h1 style={{
            fontSize: 15,
            fontWeight: 600,
            color: T.nameText,
            margin: 0,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {name ?? 'Loading…'}
          </h1>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <RoleBadge role={role} />

          {/* Divider */}
          <div style={{ width: 1, height: 16, background: T.divider }} aria-hidden />

          {/* Avatar button + dropdown */}
          <div ref={containerRef} style={{ position: 'relative' }}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={open}
              aria-label={`Account menu for ${name ?? email ?? 'user'}`}
              onClick={() => setOpen((v) => !v)}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 8px',
                borderRadius: 10,
                border: 'none',
                background: btnHover || open ? T.btnHover : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <Avatar name={name} />
              <span style={{
                display: 'none',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: 13,
                fontWeight: 500,
                color: T.nameText,
                // Show on sm+
                ...(typeof window !== 'undefined' && window.innerWidth >= 640 ? { display: 'block' } : {}),
              }}
                className="sm-name"
              >
                {name}
              </span>
              {/* Chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={T.chevronColor}
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              >
                <path fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd" />
              </svg>
            </button>

            {/* Show name on sm+ via CSS */}
            <style>{`.sm-name { display: none } @media(min-width:640px){.sm-name{display:block}}`}</style>

            <AnimatePresence>
              {open && (
                <DropdownMenu
                  name={name}
                  email={email}
                  role={role}
                  onClose={() => setOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}