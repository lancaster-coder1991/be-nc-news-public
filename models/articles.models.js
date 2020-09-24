const knex = require("../connection");
const {
  referenceObj,
  replaceKeys,
  replaceCommentKeysNoObj,
} = require("../db/utils/data-manipulation");

exports.fetchArticlesById = (article_id) => {
  return knex
    .select("*")
    .from("articles")
    .where({ article_id })
    .then((article) => {
      if (!article.length)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article;
    });
};

exports.removeArticleById = (article_id) => {
  return Promise.all([
    knex.select("*").from("articles").where({ article_id }),
    knex.del().from("articles").where({ article_id }),
  ]).then((promises) => {
    if (!promises[0][0]) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    }
    const deleted = promises[0][0];
    const rows = promises[1];
    return {
      deleted,
      rows,
    };
  });
};

exports.updateArticleById = (article_id, body) => {
  return knex
    .increment(body)
    .from("articles")
    .where({ article_id })
    .returning("*")
    .then(([updatedArticle]) => {
      if (!updatedArticle)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return updatedArticle;
    });
};

exports.createCommentById = (article_id, body) => {
  return knex
    .select("*")
    .from("articles")
    .where({ article_id })
    .then((article) => {
      if (!article.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
    })
    .then(() => {
      replaceCommentKeysNoObj(body, "author", "username");
      body.article_id = Number(article_id);
      return knex("comments").insert(body).returning("*");
    })
    .then(([comment]) => {
      return comment;
    });
};

exports.fetchCommentsById = (article_id) => {
  return knex.select("*").from("comments").where({ article_id });
};
