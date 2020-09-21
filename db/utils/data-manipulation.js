// extract any functions you are using to manipulate your data, into this file

const comments = require("../data/test-data/comments");

exports.replaceKeys = (commentsArr, articleArr) => {
  let newCommentsArr = [...commentsArr];
  return newCommentsArr.map((comment) => {
    let newComment = { ...comment };
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.article_id = newComment.belongs_to;
    delete newComment.belongs_to;
    const matchedArticle = articleArr.find(
      (article) => article.title === newComment.article_id
    );
    newComment.article_id = matchedArticle.article_id;
    return newComment;
  });
};
