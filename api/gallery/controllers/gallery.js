"use strict";
const { sanitizeEntity } = require("strapi-utils");
var Flickr = require("flickr-sdk");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findRandom(ctx) {
    const flickrKey = strapi.config.get("server.fKey");
    const flickrAlbumId = strapi.config.get("server.fAlbumId");
    const flickrUserId = strapi.config.get("server.fUserId");

    const flickr = new Flickr(flickrKey);

    const resp = await flickr.photosets.getPhotos({
      photoset_id: flickrAlbumId,
      user_id: flickrUserId,
    });

    const data = resp.body?.photoset;
    const photos = data.photo;

    const total = data.total;
    const randomIdx = Math.floor(Math.random() * total);
    const foundItem = photos[randomIdx];

    if (!foundItem) return null;

    const photoId = foundItem.id;
    const sourceResp = await flickr.photos.getSizes({
      photo_id: photoId,
    });

    const sizes = sourceResp.body?.sizes.size;

    return sanitizeEntity(
      {
        id: photoId,
        url: sizes[sizes.length - 1].source,
      },
      { model: strapi.models.gallery }
    );
  },
};
