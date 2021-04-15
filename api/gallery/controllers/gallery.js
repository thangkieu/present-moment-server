"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
// just comment
module.exports = {
  async findRandom(ctx) {
    const knex = strapi.connections.default;
    const items = await knex.table("galleries").select("id");

    const total = items.length;
    const randomIdx = Math.floor(Math.random() * total);
    const foundItems = await strapi
      .query("gallery")
      .find({ id: items[randomIdx].id });

    const item = foundItems[0];
    if (!item) return null;

    return sanitizeEntity(
      {
        id: item.id,
        isDarkBg: item.isDarkBg,
        url: `${strapi.config.get("server.url")}${item.photo.url}`,
      },
      { model: strapi.models.gallery }
    );
  },
};
