export default ({ config }) => {
  const isProduction = process.env.APP_ENV === 'production';
  const isStaging = process.env.APP_ENV === 'staging';

  return {
    ...config,
    name: isProduction ? 'Medilex' : isStaging ? 'Medilex (Staging)' : 'Medilex (Dev)',
    slug: 'HealthcareVocabApp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: isProduction 
        ? 'com.medilex.app' 
        : isStaging 
        ? 'com.medilex.app.staging' 
        : 'com.medilex.app.dev',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: isProduction 
        ? 'com.medilex.app' 
        : isStaging 
        ? 'com.medilex.app.staging' 
        : 'com.medilex.app.dev',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      environment: process.env.APP_ENV || 'development',
      enableAnalytics: isProduction,
      apiUrl: isProduction 
        ? 'https://api.medilex.app' 
        : isStaging 
        ? 'https://staging-api.medilex.app' 
        : 'http://localhost:3000',
    },
  };
};
