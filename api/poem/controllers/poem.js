"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findRandom(ctx) {
    const knex = strapi.connections.default;
    const poems = await knex.table("poem").select("id");

    const total = poems.length;
    const randomIdx = Math.floor(Math.random() * total);
    const poem = await strapi.query("poem").find({ id: poems[randomIdx].id });

    return sanitizeEntity(poem?.[0], { model: strapi.models.poem });
  },
};
