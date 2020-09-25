const {
  getArticles,
  getArticleById,
  deleteArticleById,
  patchArticleById,
  postCommentById,
  getCommentsById,
} = require("../controllers/articles.controllers");
articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .delete(deleteArticleById)
  .patch(patchArticleById);

articlesRouter
  .route("/:article_id/comments")
  .post(postCommentById)
  .get(getCommentsById);

module.exports = articlesRouter;
