const DEFAULT_FRONTEND_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const parseOrigins = (value) => {
  if (!value) {
    return DEFAULT_FRONTEND_ORIGINS;
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const jwtSecret = process.env.JWT_SECRET || (isProduction ? '' : 'quickshow-dev-secret');

if (isProduction && !jwtSecret) {
  throw new Error('JWT_SECRET must be configured in production');
}

module.exports = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/quickshow',
  jwtSecret,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  frontendOrigins: parseOrigins(process.env.FRONTEND_URL),
  enableDefaultAdminBootstrap: process.env.ENABLE_DEFAULT_ADMIN === 'true',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || '',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || '',
  openAiKey: process.env.OPENAI_API_KEY || '',
};
