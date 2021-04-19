module.exports = ({ env }) => ({
  url: env("HEROKU_URL"),
  fKey: env("FLICKR_KEY"),
  fAlbumId: env("FLICKR_ALBUM_ID"),
  fUserId: env("FLICKR_USER_ID"),
});
