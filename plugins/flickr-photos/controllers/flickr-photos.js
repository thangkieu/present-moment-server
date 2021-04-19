"use strict";
const { sanitizeEntity } = require("strapi-utils");
const Flickr = require("flickr-sdk");

/**
 * flickr-photos.js controller
 *
 * @description: A set of functions called "actions" of the `flickr-photos` plugin.
 */

module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.

    // Send 200 `ok`
    ctx.send({
      message: "ok 2",
    });
  },
  async findRandom(ctx) {
    const knex = strapi.connections.default;
    const items = await knex.table("galleries").select("id");
    const total = items.length;
    const randomIdx = Math.floor(Math.random() * total);

    const foundItem = await strapi
      .query("gallery")
      .findOne({ id: items[randomIdx].id });

    if (!foundItem) return null;

    return sanitizeEntity(
      {
        id: foundItem.id,
        isDarkBg: foundItem.isDarkBg,
        url: foundItem.photoURL,
      },
      { model: strapi.models.gallery }
    );
  },
  async syncPhotosFromFlickr(ctx) {
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

    // insert to db
    await Promise.all(
      photos.map(async (photo) => {
        const photoId = photo.id;
        const sourceResp = await flickr.photos.getSizes({
          photo_id: photoId,
        });

        const info = await flickr.photos.getInfo({
          photo_id: photoId,
        });

        const photoSize = sourceResp.body?.sizes.size;
        const photoInfo = {
          flickrId: photoId,
          name: info.body.photo.title._content,
          isDarkBg: info.body.photo.description._content.includes(
            "[Dark Background]"
          ),
          photoURL: photoSize[photoSize.length - 1].source,
        };
        const foundItem = await strapi
          .query("flickr-photos")
          .findOne({ flickrId: photoId });

        if (foundItem) {
          await strapi
            .query("flickr-photos")
            .update({ id: foundItem.id }, photoInfo);
        } else {
          await strapi.query("flickr-photos").create(photoInfo);
        }
      })
    );

    return { message: "ok" };
  },
};
