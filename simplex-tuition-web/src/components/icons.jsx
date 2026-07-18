// Inline line-icons (Feather/Lucide style) as JSX. Size/color come from parent CSS.
const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Logo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v13" /><path d="M6 17h12" /><path d="M9 8h6" />
  </svg>
)

export const Phone = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

export const ArrowRight = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
)

export const Check = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.4"><path d="M20 6L9 17l-5-5" /></svg>
)

export const Star = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7-6.3-3.4L5.7 21l1.3-7-5-4.8 7-.9z" /></svg>
)

export const Stars = () => (
  <span className="stars" aria-label="5 out of 5 stars"><Star /><Star /><Star /><Star /><Star /></span>
)

export const MapPin = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
)

export const Book = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M4 19.5V6a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v13" /><path d="M6 17h12" /></svg>
)

export const Cap = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M12 3L2 8l10 5 10-5-10-5z" /><path d="M6 10.5V16c0 1 2.5 3 6 3s6-2 6-3v-5.5" /></svg>
)

export const Users = () => (
  <svg viewBox="0 0 24 24" {...s}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const Clock = () => (
  <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
)

export const BarChart = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
)

export const CircleCheck = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
)

export const ClipboardCheck = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
)

export const Pen = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
)

export const Trending = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M3 3v18h18" /><path d="M7 14l4-4 3 3 5-6" /></svg>
)

export const Zap = () => (
  <svg viewBox="0 0 24 24" {...s}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
)

export const Shield = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
)

export const Camera = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="1.6">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
)

export const Plus = () => (
  <svg viewBox="0 0 24 24" {...s} strokeWidth="2.4"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
)
