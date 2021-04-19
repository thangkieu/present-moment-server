module.exports = ({ env }) => ({
  url: env("HEROKU_URL"),
  fKey: env("FLICKR_KEY", "26e2deb0324c202dde15596c896a6268"),
  fAlbumId: env("FLICKR_ALBUM_ID", "72157718959970459"),
  fUserId: env("FLICKR_USER_ID", "100891623@N08"),
});
