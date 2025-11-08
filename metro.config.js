const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enhanced configuration for better debugging
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Log all requests in dev mode for debugging
      if (process.env.NODE_ENV !== 'production') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${req.method} ${req.url}`);
      }
      return middleware(req, res, next);
    };
  },
};

// Better source maps for easier debugging
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    keep_classnames: true, // Preserve class names in errors
    keep_fnames: true, // Preserve function names in errors
  },
};

module.exports = config;
