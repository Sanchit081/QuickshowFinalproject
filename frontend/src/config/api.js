const defaultApiUrl =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api' : '/api';

export const API_URL = (process.env.REACT_APP_API_URL || defaultApiUrl).replace(/\/+$/, '');
export const BACKEND_BASE_URL = API_URL.replace(/\/api$/, '');

if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL) {
  // Visible runtime hint for Vercel misconfiguration without crashing the app.
  // eslint-disable-next-line no-console
  console.error(
    '[QuickShow] Missing REACT_APP_API_URL in production. Set it in Vercel Environment Variables.'
  );
}

export const buildMediaUrl = (assetPath) => {
  if (!assetPath) return assetPath;
  if (/^https?:\/\//i.test(assetPath) || assetPath.startsWith('data:')) return assetPath;
  if (assetPath.startsWith('/')) return `${BACKEND_BASE_URL}${assetPath}`;
  return BACKEND_BASE_URL ? `${BACKEND_BASE_URL}/${assetPath}` : `/${assetPath}`;
};
