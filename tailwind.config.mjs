import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Menlo', 'monospace'],
      },

      /* ── Spacing / sizing ──────────────────────────────────── */
      maxWidth: {
        '2xl':  '42rem',   /* article prose         ~672px */
        '3xl':  '48rem',   /* post layout container ~768px */
        '4xl':  '56rem',   /* content-wide          ~896px */
        '6xl':  '72rem',   /* site shell            ~1152px */
      },

      /* ── Explicit z-index scale ─────────────────────────────── */
      zIndex: {
        0:  '0',
        10: '10',   /* content overlays   */
        20: '20',   /* dropdowns, tooltips */
        30: '30',   /* sticky navbar      */
        40: '40',   /* modal backdrop     */
        50: '50',   /* modal / drawer     */
      },

      /* ── Typography scale additions ────────────────────────── */
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      /* ── Border radius ──────────────────────────────────────── */
      borderRadius: {
        '4xl': '2rem',
      },

      /* ── Box shadow — editorial softness ────────────────────── */
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-md': '0 4px 20px -4px rgb(37 99 235 / 0.10)',
        'card-lg': '0 8px 30px -6px rgb(37 99 235 / 0.15)',
      },

      /* ── Animation ──────────────────────────────────────────── */
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        300: '300ms',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease-out both',
        shimmer:   'shimmer 1.5s infinite linear',
      },
    },
  },

  plugins: [typography, daisyui],

  daisyui: {
    themes: [
      /* ── Light theme ─────────────────────────────────────────── */
      {
        light: {
          /* Primary — confident blue */
          'primary':         '#2563EB',
          'primary-content': '#ffffff',

          /* Secondary — warm indigo */
          'secondary':         '#4F46E5',
          'secondary-content': '#ffffff',

          /* Accent — amber highlight */
          'accent':         '#F59E0B',
          'accent-content': '#1C1917',

          /* Neutral */
          'neutral':         '#374151',
          'neutral-content': '#ffffff',

          /* Base scale — white surfaces on slate-50 ground */
          'base-100': '#ffffff',     /* card / surface    */
          'base-200': '#F8FAFC',     /* page background   */
          'base-300': '#E2E8F0',     /* borders, dividers */
          'base-content': '#0F172A', /* primary text      */

          /* Semantic */
          'info':    '#0EA5E9',
          'success': '#10B981',
          'warning': '#F59E0B',
          'error':   '#EF4444',
        },
      },

      /* ── Dark theme ──────────────────────────────────────────── */
      {
        dark: {
          /* Primary — lighter blue for dark-bg contrast */
          'primary':         '#60A5FA',
          'primary-content': '#0F172A',

          'secondary':         '#818CF8',
          'secondary-content': '#0F172A',

          'accent':         '#FCD34D',
          'accent-content': '#1C1917',

          'neutral':         '#1E293B',
          'neutral-content': '#F1F5F9',

          /* Base scale — deep slate */
          'base-100': '#0F172A',     /* card / surface    */
          'base-200': '#1E293B',     /* page background   */
          'base-300': '#334155',     /* borders, dividers */
          'base-content': '#E2E8F0', /* primary text      */

          'info':    '#38BDF8',
          'success': '#34D399',
          'warning': '#FBBF24',
          'error':   '#F87171',
        },
      },
    ],
    darkTheme: 'dark',
    base:    true,
    styled:  true,
    utils:   true,
    logs:    false,
  },
};
