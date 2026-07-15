export const iconKeys = [
  "deskPerson",
  "battery",
  "brain",
  "peopleGroup",
  "trendingDown",
  "medicalBag",
  "coins",
  "rotate",
  "trendingUp",
  "warningTriangle",
] as const;

export type IconKey = (typeof iconKeys)[number];

const paths: Record<IconKey, string> = {
  deskPerson: `
    <circle cx="12" cy="6.5" r="2.5" />
    <path d="M7.5 15.5c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5V18h-9v-2.5z" />
    <path d="M3 21h18" />
    <path d="M9 18v3M15 18v3" />
  `,
  battery: `
    <rect x="3" y="8" width="15" height="8" rx="1.5" />
    <path d="M20 10.5v3" />
    <path d="M6.5 11v2" />
  `,
  brain: `
    <path d="M12 4.5c-1.7 0-3 1.1-3.2 2.6C7.2 7.4 6 8.8 6 10.5c0 .9.35 1.7.9 2.3-.55.6-.9 1.4-.9 2.2 0 1.8 1.4 3.3 3.2 3.4.3 1.5 1.6 2.6 3 2.6" />
    <path d="M12 4.5c1.7 0 3 1.1 3.2 2.6 1.6.3 2.8 1.7 2.8 3.4 0 .9-.35 1.7-.9 2.3.55.6.9 1.4.9 2.2 0 1.8-1.4 3.3-3.2 3.4-.3 1.5-1.6 2.6-3 2.6" />
    <path d="M12 4.5v16.5" />
  `,
  peopleGroup: `
    <circle cx="12" cy="6.5" r="2.3" />
    <circle cx="5.5" cy="9" r="1.9" />
    <circle cx="18.5" cy="9" r="1.9" />
    <path d="M8 20v-1.8c0-2.2 1.8-4 4-4s4 1.8 4 4V20" />
    <path d="M3 19.5v-1.3c0-1.6 1.2-2.9 2.7-3.1" />
    <path d="M21 19.5v-1.3c0-1.6-1.2-2.9-2.7-3.1" />
  `,
  trendingDown: `
    <path d="M3 7l6.5 6.5L13 10l8 8" />
    <path d="M21 12v6h-6" />
  `,
  medicalBag: `
    <rect x="3" y="9" width="18" height="11" rx="2" />
    <path d="M9 9V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V9" />
    <path d="M12 12.5v5M9.5 15h5" />
  `,
  coins: `
    <ellipse cx="9" cy="8" rx="6" ry="3" />
    <path d="M3 8v4c0 1.66 2.69 3 6 3s6-1.34 6-3V8" />
    <path d="M3 12v4c0 1.66 2.69 3 6 3 1.9 0 3.58-.5 4.7-1.3" />
    <ellipse cx="17" cy="14" rx="4" ry="2.2" transform="rotate(0)" />
    <path d="M13 14v2.4c0 1.22 1.79 2.2 4 2.2s4-.98 4-2.2V14" />
  `,
  rotate: `
    <circle cx="12" cy="9" r="2.6" />
    <path d="M8 19.5v-1.3c0-2 1.6-3.6 3.6-3.6h.8c2 0 3.6 1.6 3.6 3.6v1.3" />
    <path d="M18.5 6a6.5 6.5 0 0 1 1.4 6.3" />
    <path d="M5.5 12.3A6.5 6.5 0 0 1 7 6" />
    <path d="M19.9 4.6v3.2h-3.2" />
    <path d="M4.1 15.4v-3.2h3.2" />
  `,
  trendingUp: `
    <path d="M3 17l6.5-6.5L13 14l8-8" />
    <path d="M15 6h6v6" />
  `,
  warningTriangle: `
    <path d="M12 4.5 21.5 20h-19L12 4.5z" />
    <path d="M12 10.5v4" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  `,
};

export function renderIcon(key: IconKey, className?: string): string {
  const cls = className ? ` class="${className}"` : "";
  return `<svg${cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key]}</svg>`;
}
