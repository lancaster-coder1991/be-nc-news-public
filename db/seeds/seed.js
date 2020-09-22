const { topics, articles, comments, users } = require("../data/index.js");

const {
  referenceObj,
  replaceKeys,
  reformatDate,
} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex
    .insert(topics)
    .into("topics")
    .then(() => {
      return knex.insert(users).into("users");
    })
    .then(() => {
      const newArticles = reformatDate(articles);
      return knex.insert(newArticles).into("articles").returning("*");
    })
    .then((articles) => {
      const refObj = referenceObj(articles, "title", "article_id");
      const newDateComments = reformatDate(comments);
      const newComments = replaceKeys(newDateComments, refObj);
      return knex.insert(newComments).into("comments");
    });
};
