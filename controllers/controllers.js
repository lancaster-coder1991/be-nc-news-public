exports.getTopics = (req, res, next) => {
  console.log(res);
  res.status(200).send({ topics });
};
