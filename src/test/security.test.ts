import { describe, it, expect } from 'vitest';
import { sanitizeUrl, sanitizePrice, sanitizeStock, sanitizeInput } from '../utils/security';

describe('Security & Sanitization Utilities', () => {
  describe('sanitizeUrl', () => {
    it('blocks dangerous javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)', 'fallback.jpg')).toBe('fallback.jpg');
      expect(sanitizeUrl('JAVASCRIPT:alert(1)', 'fallback.jpg')).toBe('fallback.jpg');
    });

    it('blocks vbscript: and unknown protocols', () => {
      expect(sanitizeUrl('vbscript:msgbox(1)', 'fallback.jpg')).toBe('fallback.jpg');
      expect(sanitizeUrl('file:///etc/passwd', 'fallback.jpg')).toBe('fallback.jpg');
    });

    it('allows valid https, http, and relative URLs', () => {
      expect(sanitizeUrl('https://images.unsplash.com/photo-123')).toBe('https://images.unsplash.com/photo-123');
      expect(sanitizeUrl('http://example.com/item.png')).toBe('http://example.com/item.png');
      expect(sanitizeUrl('/assets/banner.webp')).toBe('/assets/banner.webp');
      expect(sanitizeUrl('./item.jpg')).toBe('./item.jpg');
    });

    it('allows safe svg/image data URIs', () => {
      const safeDataUri = 'data:image/svg+xml;utf8,<svg></svg>';
      expect(sanitizeUrl(safeDataUri)).toBe(safeDataUri);
    });

    it('blocks executable or html data URIs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>', 'fallback')).toBe('fallback');
    });
  });

  describe('sanitizePrice', () => {
    it('handles negative or invalid prices', () => {
      expect(sanitizePrice(-500, 0)).toBe(0);
      expect(sanitizePrice(NaN, 100)).toBe(100);
      expect(sanitizePrice(Infinity, 0)).toBe(0);
    });

    it('clamps overly massive numbers to upper bound', () => {
      expect(sanitizePrice(999_999_999)).toBe(100_000_000);
    });

    it('parses valid string and number prices', () => {
      expect(sanitizePrice(14990)).toBe(14990);
      expect(sanitizePrice('15 990 ₸')).toBe(15990);
    });
  });

  describe('sanitizeStock', () => {
    it('ensures non-negative integer stock', () => {
      expect(sanitizeStock(-10)).toBe(0);
      expect(sanitizeStock(5.8)).toBe(5);
      expect(sanitizeStock('25')).toBe(25);
    });
  });

  describe('sanitizeInput', () => {
    it('strips script tags and HTML elements', () => {
      expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello');
      expect(sanitizeInput('<b>Bold</b> Title')).toBe('Bold Title');
    });
  });
});
