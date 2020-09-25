const {
  fetchArticles,
  fetchArticlesById,
  removeArticleById,
  updateArticleById,
  createCommentById,
  fetchCommentsById,
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query).then((articles) => {
    res.status(200).send({ articles });
  });
};

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
  let query = req.query;
  fetchCommentsById(id, query).then((comments) => {
    res.status(200).send({ comments });
  });
};
