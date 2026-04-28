import { buildMediaUrl } from '../config/api';

export function normalizeGenres(genres) {
  if (!genres) return [];

  const raw = Array.isArray(genres) ? genres : [genres];
  const out = [];

  for (const item of raw) {
    if (!item) continue;

    // Sometimes stored as a stringified JSON array: ["Comedy","Drama"]
    if (typeof item === 'string') {
      const trimmed = item.trim();
      if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('"[') && trimmed.endsWith(']"'))) {
        try {
          const parsed = JSON.parse(trimmed.startsWith('"') ? JSON.parse(trimmed) : trimmed);
          if (Array.isArray(parsed)) {
            parsed.forEach((g) => {
              if (typeof g === 'string' && g.trim()) out.push(g.trim());
            });
            continue;
          }
        } catch {
          // fallthrough
        }
      }

      if (trimmed) out.push(trimmed);
      continue;
    }

    if (Array.isArray(item)) {
      item.forEach((g) => {
        if (typeof g === 'string' && g.trim()) out.push(g.trim());
      });
      continue;
    }
  }

  return Array.from(new Set(out)).slice(0, 6);
}

export function normalizePoster(poster) {
  return buildMediaUrl(poster) || 'https://via.placeholder.com/400x600?text=QuickShow';
}

export function normalizeBanner(banner, poster) {
  return buildMediaUrl(banner) || buildMediaUrl(poster) || '';
}

