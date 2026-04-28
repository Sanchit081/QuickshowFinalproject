import { API_URL, BACKEND_BASE_URL, buildMediaUrl } from './config/api';

describe('api configuration helpers', () => {
  test('normalizes the configured api url', () => {
    expect(API_URL.endsWith('/')).toBe(false);
  });

  test('builds upload urls against the backend base url', () => {
    expect(buildMediaUrl('/uploads/poster.jpg')).toBe(`${BACKEND_BASE_URL}/uploads/poster.jpg`);
  });

  test('leaves absolute urls untouched', () => {
    const absoluteUrl = 'https://cdn.example.com/poster.jpg';
    expect(buildMediaUrl(absoluteUrl)).toBe(absoluteUrl);
  });
});
