// ── Midnight Aurora — shared design tokens ────────────────────────────────────
// Import this in every admin page: import { T, PageShell, PageHeader, Card, GlowButton, ActionBtn, Badge } from './_theme';

import { useState } from 'react';

export const T = {
  // Page
  pageBg:           'linear-gradient(160deg, #080d1f 0%, #0a1525 60%, #060e1a 100%)',

  // Text
  headingText:      '#e0f0ff',
  mutedText:        '#4a7a9b',
  dimText:          '#3a6080',

  // Card / glass panel
  cardBg:           'linear-gradient(135deg, #0c1a2e 0%, #0d2040 100%)',
  cardBorder:       '#1e3a5f',
  cardShadow:       '0 4px 24px #00000050, 0 0 0 1px #1e3a5f',
  cardHoverBorder:  '#2563eb',
  cardHoverGlow:    '0 8px 40px rgba(37,99,235,0.20), 0 0 0 1px #2563eb',

  // Form panel (slightly lighter)
  formBg:           'rgba(12,26,46,0.85)',
  formBorder:       '#1e3a5f',
  formShadow:       '0 8px 32px #00000060',

  // Section divider
  divider:          '#162840',

  // Input
  inputBg:          '#0a1525',
  inputBorder:      '#1e3a5f',
  inputFocusBorder: '#2563eb',
  inputText:        '#e0f0ff',
  inputPlaceholder: '#3a6080',

  // Glow button (primary CTA)
  glowBg:           'linear-gradient(135deg, #7c3aed, #2563eb)',
  glowHoverBg:      'linear-gradient(135deg, #6d28d9, #1d4ed8)',
  glowShadow:       '0 4px 20px rgba(37,99,235,0.40)',

  // Cancel button
  cancelBg:         'rgba(255,255,255,0.04)',
  cancelBorder:     '#1e3a5f',
  cancelText:       '#4a7a9b',
  cancelHover:      'rgba(255,255,255,0.08)',

  // Action buttons
  editBg:           'rgba(37,99,235,0.10)',
  editBorder:       'rgba(37,99,235,0.25)',
  editText:         '#60a5fa',
  editHover:        'rgba(37,99,235,0.20)',

  deleteBg:         'rgba(239,68,68,0.08)',
  deleteBorder:     'rgba(239,68,68,0.20)',
  deleteText:       '#f87171',
  deleteHover:      'rgba(239,68,68,0.16)',

  successBg:        'rgba(16,217,138,0.08)',
  successBorder:    'rgba(16,217,138,0.20)',
  successText:      '#10d98a',
  successHover:     'rgba(16,217,138,0.16)',

  warningBg:        'rgba(251,191,36,0.08)',
  warningBorder:    'rgba(251,191,36,0.20)',
  warningText:      '#fbbf24',

  // Table
  tableHeaderText:  '#4a7a9b',
  tableRowHover:    'rgba(255,255,255,0.03)',
  tableRowBorder:   '#162840',

  // Image ring
  imgRing:          '#1e4060',

  // Tech badge
  techBg:           'rgba(37,99,235,0.10)',
  techBorder:       'rgba(37,99,235,0.22)',
  techText:         '#60a5fa',

  // Error alert
  errorAlertBg:     'rgba(239,68,68,0.08)',
  errorAlertBorder: '#ef4444',
  errorAlertText:   '#f87171',

  // Skeleton
  skeletonBg:       '#0d1f35',

  // Expand panel bg
  expandBg:         '#0a1525',
} as const;

// ── Reusable primitives ───────────────────────────────────────────────────────

/** Full-page wrapper — no Sidebar/Header (those are in the layout) */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '32px', maxWidth: 1152, margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  );
}

/** Page title + subtitle */
export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h1 style={{
        fontSize: 28, fontWeight: 700, letterSpacing: '-.02em',
        color: T.headingText, margin: '0 0 6px',
      }}>
        {title}
      </h1>
      <p style={{ fontSize: 13, color: T.mutedText, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

/** Glass card */
export function Card({
  children,
  style,
  hoverable = false,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hoverable?: boolean;
  onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setHov(true)}
      onMouseLeave={() => hoverable && setHov(false)}
      style={{
        background: T.cardBg,
        border: `1px solid ${hov ? T.cardHoverBorder : T.cardBorder}`,
        boxShadow: hov ? T.cardHoverGlow : T.cardShadow,
        borderRadius: 14,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border 0.2s, box-shadow 0.2s',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Glass form panel */
export function FormPanel({ children, onSubmit }: { children: React.ReactNode; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: T.formBg,
        border: `1px solid ${T.formBorder}`,
        boxShadow: T.formShadow,
        borderRadius: 16,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '28px',
        marginBottom: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {children}
    </form>
  );
}

/** Primary gradient CTA */
export function GlowButton({
  children,
  onClick,
  type = 'button',
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && !disabled ? T.glowHoverBg : T.glowBg,
        boxShadow: disabled ? 'none' : T.glowShadow,
        border: 'none',
        borderRadius: 9,
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        padding: '10px 20px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s, box-shadow 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Cancel / secondary button */
export function CancelButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.cancelHover : T.cancelBg,
        border: `1px solid ${T.cancelBorder}`,
        borderRadius: 9,
        color: T.cancelText,
        fontSize: 13,
        fontWeight: 500,
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  );
}

type ActionVariant = 'edit' | 'delete' | 'success' | 'warning';

const ACTION_STYLES: Record<ActionVariant, { bg: string; hover: string; text: string; border: string }> = {
  edit:    { bg: T.editBg,    hover: T.editHover,    text: T.editText,    border: T.editBorder    },
  delete:  { bg: T.deleteBg,  hover: T.deleteHover,  text: T.deleteText,  border: T.deleteBorder  },
  success: { bg: T.successBg, hover: T.successHover, text: T.successText, border: T.successBorder },
  warning: { bg: T.warningBg, hover: T.warningBg,    text: T.warningText, border: T.warningBorder },
};

/** Small action button (Edit / Delete / Mark …) */
export function ActionBtn({
  children,
  variant,
  onClick,
  disabled,
  fullWidth,
}: {
  children: React.ReactNode;
  variant: ActionVariant;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const [hov, setHov] = useState(false);
  const s = ACTION_STYLES[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && !disabled ? s.hover : s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 7,
        color: s.text,
        fontSize: 12,
        fontWeight: 500,
        padding: '6px 14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.15s',
        width: fullWidth ? '100%' : undefined,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

/** Status / role badge */
export function Badge({ label, variant }: { label: string; variant: ActionVariant | 'primary' }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    edit:    { bg: T.editBg,    text: T.editText,    border: T.editBorder    },
    delete:  { bg: T.deleteBg,  text: T.deleteText,  border: T.deleteBorder  },
    success: { bg: T.successBg, text: T.successText, border: T.successBorder },
    warning: { bg: T.warningBg, text: T.warningText, border: T.warningBorder },
    primary: { bg: T.editBg,    text: T.editText,    border: T.editBorder    },
  };
  const s = map[variant] ?? map.primary;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      borderRadius: 999, fontSize: 11, fontWeight: 600,
      padding: '3px 10px', whiteSpace: 'nowrap', textTransform: 'capitalize',
    }}>
      {label}
    </span>
  );
}

/** Section divider with heading */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 15, fontWeight: 700, color: T.headingText,
      margin: '0 0 14px', letterSpacing: '-.01em',
    }}>
      {children}
    </h2>
  );
}