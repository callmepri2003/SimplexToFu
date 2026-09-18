// Inline line-icons as JSX. Size/colour come from parent CSS. Kept deliberately
// few: the brand is paper and ink, not a device-heavy UI.
const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const Phone = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
)

export const Check = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
)

export const Cross = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)

export const Plus = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
)

export const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" /></svg>
)

export const Stars = () => (
  <span className="stars" role="img" aria-label="5 out of 5 stars">
    <Star /><Star /><Star /><Star /><Star />
  </span>
)

export const WhatsApp = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.42 1.3-1.95 1.34-.5.05-.97.23-3.27-.68-2.77-1.09-4.51-3.93-4.65-4.11-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.24-.27.53-.34.71-.34l.51.01c.16.01.38-.06.6.46.22.53.75 1.84.82 1.97.07.13.11.29.02.47-.09.18-.13.29-.27.45-.13.16-.28.35-.4.47-.13.13-.27.28-.12.55.16.27.69 1.14 1.48 1.84 1.02.91 1.88 1.19 2.15 1.33.27.13.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.24.09 1.55.73 1.82.86.27.13.44.2.51.31.07.11.07.64-.17 1.31z" />
  </svg>
)
