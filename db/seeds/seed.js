const {
  topicsData,
  articlesData,
  commentsData,
  usersData,
} = require("../data/index.js");

exports.seed = function (knex) {
  return knex
    .insert(topicsData)
    .into("topics")
    .then(() => {
      return knex.insert(usersData).into("users");
    })
    .then(() => {
      return knex.insert(articlesData).into("articles");
    })
    .then((articles) => {});
};
