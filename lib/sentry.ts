import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!dsn) return;

  Sentry.init({
    dsn,
    enabled: process.env.APP_ENV !== 'development',
    environment: process.env.APP_ENV ?? 'development',
    tracesSampleRate: process.env.APP_ENV === 'production' ? 0.2 : 1.0,
    sendDefaultPii: false,
  });
}
