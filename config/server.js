module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("HOST_URL"),
  fKey: env("FLICKR_KEY"),
  fAlbumId: env("FLICKR_ALBUM_ID"),
  fUserId: env("FLICKR_USER_ID"),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "1be40a290b77a5a78e6a461396649c63"),
    },
  },
});
