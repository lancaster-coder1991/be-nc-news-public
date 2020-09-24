// extract any functions you are using to manipulate your data, into this file

const comments = require("../data/test-data/comments");

exports.reformatDate = (arr) => {
  const reformatted = arr.map((obj) => {
    const newObj = { ...obj };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
  return reformatted;
};

exports.referenceObj = (arr, property, value) => {
  const refObj = {};
  arr.forEach((element) => (refObj[element[property]] = element[value]));
  return refObj;
};

exports.replaceKeys = (commentsArr, refObj) => {
  const newCommentsArr = [...commentsArr];
  return newCommentsArr.map((comment) => {
    const newComment = { ...comment };

    newComment.author = newComment.created_by;
    delete newComment.created_by;
    newComment.article_id = newComment.belongs_to;
    delete newComment.belongs_to;

    newComment.article_id = refObj[newComment.article_id];

    return newComment;
  });
};

exports.replaceCommentKeysNoObj = (body, keyToCreate, KeyToDelete) => {
  body[keyToCreate] = body[KeyToDelete];
  delete body[KeyToDelete];
};
