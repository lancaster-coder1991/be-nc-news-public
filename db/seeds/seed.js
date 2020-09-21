const { topics, articles, comments, users } = require("../data/index.js");

const { referenceObj, replaceKeys } = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex
    .insert(topics)
    .into("topics")
    .then(() => {
      return knex.insert(users).into("users");
    })
    .then(() => {
      console.log(articles);
      return knex.insert(articles).into("articles").returning("*");
    })
    .then((articles) => {
      console.log(articles);
      const refObj = referenceObj(articles, "title", "article_id");
      const newComments = replaceKeys(comments, refObj);
      return knex.insert(newComments).into("comments");
    });
};
