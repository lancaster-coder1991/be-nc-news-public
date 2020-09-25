const knex = require("../connection");

exports.updateCommentById = (comment_id, body) => {
  return knex
    .increment("votes", body.inc_votes || 0)
    .from("comments")
    .where({ comment_id })
    .returning("*")
    .then(([updatedComment]) => {
      if (!updatedComment)
        return Promise.reject({ status: 404, msg: "Comment not found" });
      return updatedComment;
    });
};

exports.removeCommentById = (comment_id) => {
  return Promise.all([
    knex.select("*").from("comments").where({ comment_id }),
    knex.del().from("comments").where({ comment_id }),
  ]).then((promises) => {
    if (!promises[0][0]) {
      return Promise.reject({ status: 404, msg: "Comment not found" });
    }
  });
};
