const knex = require("../connection");
const {
  referenceObj,
  replaceKeys,
  replaceCommentKeysNoObj,
} = require("../db/utils/data-manipulation");

exports.fetchArticles = (query) => {
  console.group(query);
  return knex
    .select(
      "articles.article_id",
      "articles.author",
      "articles.title",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .modify((queryBuilder) => {
      if (query.author) queryBuilder.where("articles.author", query.author);
      if (query.topic) queryBuilder.where("articles.topic", query.topic);
    })
    .count("comments AS comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .orderBy(query.sort_by || "created_at", query.order_by || "desc");
};

exports.fetchArticlesById = (article_id) => {
  return knex
    .select(
      "articles.article_id",
      "articles.author",
      "articles.title",
      "articles.body",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .from("articles")
    .where("articles.article_id", article_id)
    .count("comments AS comment_count")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
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
    .increment("votes", body.inc_votes || 0)
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

exports.fetchCommentsById = (article_id, query) => {
  return knex
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(query.sort_by || "created_at", query.order_by || "desc");
};
