/**
 * Security & Sanitization Utilities for KitapAll
 * Defense-in-depth against XSS, URL injection, and data boundary corruption.
 */

const ALLOWED_PROTOCOLS = ['http:', 'https:'];
const ALLOWED_DATA_IMAGE_REGEX = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);(base64|utf8),/i;

/**
 * Validates and sanitizes URLs before rendering in <img>, <a> or background styles.
 * Blocks javascript:, vbscript:, and unauthorized data: schemes.
 */
export function sanitizeUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Allow relative URLs starting with / or ./ or ../
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed;
  }

  // Allow safe SVG/image data URIs
  if (trimmed.startsWith('data:image/')) {
    if (ALLOWED_DATA_IMAGE_REGEX.test(trimmed)) {
      return trimmed;
    }
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, window.location.origin);
    if (ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Sanitizes numeric prices to prevent negative prices, NaN, or absurd values.
 */
export function sanitizePrice(price: unknown, defaultPrice = 0): number {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return Math.max(0, Math.min(100_000_000, Math.round(price)));
  }
  if (typeof price === 'string') {
    const parsed = parseFloat(price.replace(/[^\d.-]/g, ''));
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
      return Math.max(0, Math.min(100_000_000, Math.round(parsed)));
    }
  }
  return defaultPrice;
}

/**
 * Sanitizes numeric stock to ensure a clean non-negative integer.
 */
export function sanitizeStock(stock: unknown, defaultStock = 0): number {
  if (typeof stock === 'number' && Number.isFinite(stock)) {
    return Math.max(0, Math.min(1_000_000, Math.floor(stock)));
  }
  if (typeof stock === 'string') {
    const parsed = parseInt(stock, 10);
    if (!Number.isNaN(parsed)) {
      return Math.max(0, Math.min(1_000_000, parsed));
    }
  }
  return defaultStock;
}

/**
 * Strips dangerous HTML tag injections from user strings.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}
