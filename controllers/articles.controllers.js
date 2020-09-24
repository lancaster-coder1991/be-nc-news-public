const {
  fetchArticlesById,
  removeArticleById,
  updateArticleById,
  createCommentById,
  fetchCommentsById,
} = require("../models/articles.models.js");

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticlesById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteArticleById = (req, res, next) => {
  const id = req.params.article_id;
  removeArticleById(id)
    .then((articleObj) => {
      res
        .status(200)
        .send({ article: articleObj.deleted, rows_deleted: articleObj.rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleById = (req, res, next) => {
  const id = req.params.article_id;
  updateArticleById(id, req.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.postCommentById = (req, res, next) => {
  const id = req.params.article_id;
  createCommentById(id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsById = (req, res, next) => {
  let id = req.params.article_id;
  fetchCommentsById(id).then((comments) => {
    res.status(200).send({ comments });
  });
};
