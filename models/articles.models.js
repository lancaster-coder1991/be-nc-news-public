const knex = require("../connection");
const {
  referenceObj,
  replaceKeys,
  replaceCommentKeysNoObj,
} = require("../db/utils/data-manipulation");

exports.fetchArticles = (query) => {
  return knex
    .select("*")
    .from("articles")
    .returning("*")
    .then((articles) => {
      const columns = Object.keys(articles[0]);
      const queries = Object.keys(query);
      for (let i = 0; i < queries.length; i++) {
        if (
          !columns.includes(queries[i]) &&
          queries[i] !== "sort_by" &&
          queries[i] !== "order_by" &&
          queries[i] !== "p"
        ) {
          throw { status: 400, msg: "Invalid query or body" };
        }
      }
    })
    .then(() => {
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
          if (query.p) queryBuilder.limit(5).offset(5 * (Number(query.p) - 1));
        })
        .count("comments AS comment_count")
        .leftJoin("comments", "comments.article_id", "articles.article_id")
        .groupBy("articles.article_id")
        .orderBy(query.sort_by || "created_at", query.order_by || "desc");
    });
};

exports.fetchArticlesById = (article_id) => {
  if (!Number(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
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
  console.log(article_id);
  return Promise.all([
    knex.select("*").from("articles").where({ article_id }),
    knex.del().from("articles").where({ article_id }),
  ]).then((promises) => {
    console.log(promises[0][0]);
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
  let keys = Object.keys(body);
  if (keys.length > 1 || !keys.length || !Number(body.inc_votes)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
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
  if (!Number(article_id)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
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
