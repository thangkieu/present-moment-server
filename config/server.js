module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("HOST_URL"),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "1be40a290b77a5a78e6a461396649c63"),
    },
  },
});
