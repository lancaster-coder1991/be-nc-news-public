const {
  updateCommentById,
  removeCommentById,
} = require("../models/comments.models");

exports.patchCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  updateCommentById(id, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;
  removeCommentById(id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
