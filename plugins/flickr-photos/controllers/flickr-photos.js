"use strict";
const { sanitizeEntity } = require("strapi-utils");
const Flickr = require("flickr-sdk");
const qs = require("qs");

/**
 * flickr-photos.js controller
 *
 * @description: A set of functions called "actions" of the `flickr-photos` plugin.
 */

module.exports = {
  async findRandom(ctx) {
    const knex = strapi.connections.default;
    const items = await knex.table("flickr-photos").select("id");

    const total = items.length;
    const randomIdx = Math.floor(Math.random() * total);

    const foundItem = await strapi
      .query("flickr-photos", "flickr-photos")
      .findOne({ id: items[randomIdx].id });

    if (!foundItem) return null;

    return sanitizeEntity(
      {
        id: foundItem.id,
        isDarkBg: foundItem.isDarkBg,
        url: foundItem.photoURL,
      },
      { model: strapi.plugins["flickr-photos"].models["flickr-photos"] }
    );
  },
  async syncPhotosFromFlickr(ctx) {
    try {
      const search = qs.parse(ctx.search.replace(/^\?/g, ""));

      const flickrKey = strapi.config.get("server.fKey");
      const flickrAlbumId =
        search.albumId || strapi.config.get("server.fAlbumId");
      const flickrUserId = strapi.config.get("server.fUserId");

      const flickr = new Flickr(flickrKey);

      const albumInfo = await flickr.photosets.getInfo({
        photoset_id: flickrAlbumId,
        user_id: flickrUserId,
      });

      const resp = await flickr.photosets.getPhotos({
        photoset_id: flickrAlbumId,
        user_id: flickrUserId,
      });

      const data = resp.body?.photoset;
      const photos = data.photo;

      // insert to db
      const inserted = await Promise.all(
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
            .query("flickr-photos", "flickr-photos")
            .findOne({ flickrId: photoId });

          if (foundItem) {
            return await strapi
              .query("flickr-photos", "flickr-photos")
              .update({ id: foundItem.id }, photoInfo);
          }

          return await strapi
            .query("flickr-photos", "flickr-photos")
            .create(photoInfo);
        })
      );

      ctx.send({
        photos: inserted,
        name: albumInfo.body.photoset.title._content,
      });
    } catch (e) {
      ctx.throw(
        404,
        `${e.message} ${flickrKey} ${flickrAlbumId} ${flickrUserId}`
      );
    }
  },
};
