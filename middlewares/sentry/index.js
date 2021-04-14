const Sentry = require("@sentry/node");

Sentry.init({
  dsn:
    "https://f932cc700e3949b8a5e4f8fb15fadc5d@o571966.ingest.sentry.io/5720786",
  environment: strapi.config.environment,
});

module.exports = (strapi) => {
  return {
    initialize() {
      strapi.app.use(async (ctx, next) => {
        try {
          await next();
        } catch (error) {
          Sentry.captureException(error);
          throw error;
        }
      });
    },
  };
};
