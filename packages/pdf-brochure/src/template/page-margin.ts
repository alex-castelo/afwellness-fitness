/**
 * Single source of truth for the content pages' margin, shared between render.ts
 * (Puppeteer's page.pdf({ margin })) and document.ts (the matching `@page` CSS rule).
 *
 * These two must stay in sync: Chromium paginates the flowing HTML using the `@page`
 * CSS box to decide where page breaks fall, then Puppeteer's JS margin trims the
 * rendered output separately. If they disagree (e.g. `@page` says 0 while the JS
 * margin reserves 24mm), the browser lays out more content per page than actually
 * fits in the trimmed box — which is invisible on most pages (break-inside: avoid
 * blocks happen to still fit) but corrupts the last page, where there's no following
 * page to force a correct break: content and the header/footer band end up
 * overlapping. Keeping both declarations identical avoids the mismatch entirely.
 */
export const CONTENT_PAGE_MARGIN = {
  top: "24mm",
  bottom: "18mm",
  left: "0mm",
  right: "0mm",
} as const;

export const contentPageMarginCss = `@page { margin: ${CONTENT_PAGE_MARGIN.top} ${CONTENT_PAGE_MARGIN.right} ${CONTENT_PAGE_MARGIN.bottom} ${CONTENT_PAGE_MARGIN.left}; }`;
